import { createContext, useContext, useReducer, useEffect, useMemo, useCallback, useState } from 'react';
import { generateAlerts, getDaysLeft, getExpiryStatus } from '../utils/expiryUtils';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const PantryContext = createContext(null);

const API_URL = 'https://pantrypal-backend-bay.vercel.app/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('pantrypal_token');
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

// ── Local reducer for optimistic UI updates ──────────────────
function pantryReducer(state, action) {
  switch (action.type) {
    case 'RESET_STATE':     return { ...initialState, loading: false };
    case 'SET_ITEMS':       return { ...state, items: action.payload, loading: false };
    case 'SET_GROCERY':     return { ...state, groceryList: action.payload };
    case 'SET_SETTINGS':    return { ...state, settings: action.payload };
    case 'SET_LOADING':     return { ...state, loading: action.payload };
    case 'SET_ALERTS':      return { ...state, dbAlerts: action.payload };

    case 'ADD_ITEM':        return { ...state, items: [action.payload, ...state.items] };
    case 'UPDATE_ITEM':
      return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, ...action.payload } : i) };
    case 'DELETE_ITEM':     return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'SET_STATUS': {
      const { id, status } = action.payload;
      return { ...state, items: state.items.map(i => i.id === id ? { ...i, status } : i) };
    }
    case 'BULK_STATUS': {
      const { ids, status } = action.payload;
      return { ...state, items: state.items.map(i => ids.includes(i.id) ? { ...i, status } : i) };
    }
    case 'BULK_DELETE':
      return { ...state, items: state.items.filter(i => !action.payload.includes(i.id)) };

    case 'ADD_GROCERY':
      return { ...state, groceryList: [action.payload, ...state.groceryList] };
    case 'UPDATE_GROCERY':
      return { ...state, groceryList: state.groceryList.map(g => g.id === action.payload.id ? action.payload : g) };
    case 'REMOVE_GROCERY':
      return { ...state, groceryList: state.groceryList.filter(g => g.id !== action.payload) };
    case 'CLEAR_PURCHASED':
      return { ...state, groceryList: state.groceryList.filter(g => !g.purchased) };
    case 'BULK_GROCERY_PURCHASED': {
      const ids = action.payload;
      return {
        ...state,
        groceryList: state.groceryList.map(g =>
          ids.includes(g.id) ? { ...g, purchased: true, purchasedAt: new Date().toISOString() } : g
        )
      };
    }
    case 'BULK_REMOVE_GROCERY':
      return { ...state, groceryList: state.groceryList.filter(g => !action.payload.includes(g.id)) };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'CLEAR_ALL_ITEMS':
      return { ...state, items: [] };

    default: return state;
  }
}

const defaultSettings = {
  alertDays: 2,
  showExpiredInDashboard: true,
  defaultUnit: 'Pieces',
  defaultCategory: 'Other',
  itemsPerPage: 10,
  browserNotifications: false,
  alertSound: false,
  theme: 'light',
};

const initialState = {
  items: [],
  settings: defaultSettings,
  groceryList: [],
  dbAlerts: [],
  loading: true,
};

// ── API helper ────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });
  return res.json();
}

export function PantryProvider({ children }) {
  const [state, dispatch] = useReducer(pantryReducer, initialState);
  const { token } = useAuth();

  // ── Load all data on mount or when token changes ────────────────
  useEffect(() => {
    if (!token) {
      dispatch({ type: 'RESET_STATE' });
      return;
    }
    loadAllData();
  }, [token]);

  const loadAllData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [itemsRes, groceryRes, settingsRes, alertsRes] = await Promise.all([
        apiFetch('/pantry'),
        apiFetch('/grocery'),
        apiFetch('/settings'),
        apiFetch('/alerts'),
      ]);
      if (itemsRes.success)   dispatch({ type: 'SET_ITEMS',    payload: itemsRes.items });
      if (groceryRes.success) dispatch({ type: 'SET_GROCERY',  payload: groceryRes.items });
      if (settingsRes.success) dispatch({ type: 'SET_SETTINGS', payload: settingsRes.settings });
      if (alertsRes.success)  dispatch({ type: 'SET_ALERTS',   payload: alertsRes.alerts });
    } catch (err) {
      console.error('Failed to load data:', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // ── Computed values ─────────────────────────────────────────
  const alerts = useMemo(
    () => state.dbAlerts.length > 0
      ? state.dbAlerts.map(a => ({ ...a, status: getExpiryStatus(a.daysLeft) }))
      : generateAlerts(state.items, state.settings.alertDays),
    [state.dbAlerts, state.items, state.settings.alertDays]
  );

  const stats = useMemo(() => {
    const active = state.items.filter(i => i.status === 'active');
    const total      = active.length;
    const expired    = active.filter(i => getDaysLeft(i.expiryDate) < 0).length;
    const expiring   = active.filter(i => { const d = getDaysLeft(i.expiryDate); return d >= 0 && d <= 5; }).length;
    const fresh      = active.filter(i => getDaysLeft(i.expiryDate) > 5).length;
    const consumed   = state.items.filter(i => i.status === 'consumed').length;
    const discarded  = state.items.filter(i => i.status === 'discarded').length;
    const total_all  = state.items.length;
    const wasteReduction = total_all > 0 ? Math.round((consumed / total_all) * 100) : 0;
    const needsRestocking = state.items.filter(
      i => i.status === 'active' && i.autoAddToGrocery &&
           i.currentQuantity !== undefined && i.minQuantity !== undefined &&
           i.currentQuantity <= i.minQuantity
    ).length;
    return { total, expired, expiring, fresh, consumed, discarded, total_all, wasteReduction, needsRestocking };
  }, [state.items]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    state.items.filter(i => i.status === 'active').forEach(i => {
      map[i.category] = (map[i.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [state.items]);

  // ── Pantry Item Actions ─────────────────────────────────────
  const addItem = useCallback(async (data) => {
    const res = await apiFetch('/pantry', { method: 'POST', body: JSON.stringify(data) });
    if (res.success) {
      dispatch({ type: 'ADD_ITEM', payload: res.item });
      return res.item;
    }
    throw new Error(res.message);
  }, []);

  const updateItem = useCallback(async (data) => {
    const res = await apiFetch(`/pantry/${data.id}`, { method: 'PUT', body: JSON.stringify(data) });
    if (res.success) {
      dispatch({ type: 'UPDATE_ITEM', payload: res.item });
      return res.item;
    }
    throw new Error(res.message);
  }, []);

  const deleteItem = useCallback(async (id) => {
    dispatch({ type: 'DELETE_ITEM', payload: id }); // optimistic
    const res = await apiFetch(`/pantry/${id}`, { method: 'DELETE' });
    if (!res.success) {
      await loadAllData(); // rollback by reloading
    }
  }, []);

  const markConsumed = useCallback(async (id) => {
    dispatch({ type: 'SET_STATUS', payload: { id, status: 'consumed' } });
    await apiFetch(`/pantry/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'consumed' }) });
  }, []);

  const markDiscarded = useCallback(async (id) => {
    dispatch({ type: 'SET_STATUS', payload: { id, status: 'discarded' } });
    await apiFetch(`/pantry/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'discarded' }) });
  }, []);

  const bulkConsume = useCallback(async (ids) => {
    dispatch({ type: 'BULK_STATUS', payload: { ids, status: 'consumed' } });
    await apiFetch('/pantry/bulk-consume', { method: 'POST', body: JSON.stringify({ ids }) });
  }, []);

  const bulkDelete = useCallback(async (ids) => {
    dispatch({ type: 'BULK_DELETE', payload: ids });
    await apiFetch('/pantry/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) });
  }, []);

  const clearAllItems = useCallback(async () => {
    dispatch({ type: 'CLEAR_ALL_ITEMS' });
    await apiFetch('/settings/data', { method: 'DELETE' });
  }, []);

  const resetApp = useCallback(async () => {
    dispatch({ type: 'CLEAR_ALL_ITEMS' });
    await apiFetch('/settings/data', { method: 'DELETE' });
  }, []);

  // importItems: bulk-add via API (best effort)
  const importItems = useCallback(async (items) => {
    for (const item of items) {
      try {
        const res = await apiFetch('/pantry', { method: 'POST', body: JSON.stringify(item) });
        if (res.success) dispatch({ type: 'ADD_ITEM', payload: res.item });
      } catch (e) { /* skip failed */ }
    }
  }, []);

  // ── Settings Actions ────────────────────────────────────────
  const updateSettings = useCallback(async (updates) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates });
    await apiFetch('/settings', { method: 'PUT', body: JSON.stringify(updates) });
  }, []);

  // ── Grocery Actions ─────────────────────────────────────────
  const addToGroceryList = useCallback(async (groceryItem) => {
    const res = await apiFetch('/grocery', { method: 'POST', body: JSON.stringify(groceryItem) });
    if (res.success) {
      dispatch({ type: 'ADD_GROCERY', payload: res.item });
    }
  }, []);

  const toggleGroceryPurchased = useCallback(async (id) => {
    const res = await apiFetch(`/grocery/${id}/toggle`, { method: 'PATCH' });
    if (res.success) dispatch({ type: 'UPDATE_GROCERY', payload: res.item });
  }, []);

  const removeFromGroceryList = useCallback(async (id) => {
    dispatch({ type: 'REMOVE_GROCERY', payload: id });
    await apiFetch(`/grocery/${id}`, { method: 'DELETE' });
  }, []);

  const restoreGroceryItem = useCallback(async (id) => {
    const res = await apiFetch(`/grocery/${id}/restore`, { method: 'PATCH' });
    if (res.success) dispatch({ type: 'UPDATE_GROCERY', payload: res.item });
  }, []);

  const clearPurchasedHistory = useCallback(async () => {
    dispatch({ type: 'CLEAR_PURCHASED' });
    await apiFetch('/grocery/purchased', { method: 'DELETE' });
  }, []);

  const bulkMarkPurchased = useCallback(async (ids) => {
    dispatch({ type: 'BULK_GROCERY_PURCHASED', payload: ids });
    await apiFetch('/grocery/bulk-purchase', { method: 'POST', body: JSON.stringify({ ids }) });
  }, []);

  const bulkRemoveGrocery = useCallback(async (ids) => {
    dispatch({ type: 'BULK_REMOVE_GROCERY', payload: ids });
    await apiFetch('/grocery/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) });
  }, []);

  // ── Auto-add to grocery only when quantity drops to 3 or fewer ──
  useEffect(() => {
    const LOW_STOCK_THRESHOLD = 3;
    state.items.forEach(item => {
      if (
        item.autoAddToGrocery && item.status === 'active' &&
        item.currentQuantity !== undefined &&
        item.currentQuantity <= LOW_STOCK_THRESHOLD
      ) {
        const alreadyInList = state.groceryList.some(g => g.itemName === item.name && !g.purchased);
        if (!alreadyInList) {
          addToGroceryList({
            itemName: item.name,
            category: item.category,
            suggestedQuantity: 5,
            unit: item.unit,
            triggeredBy: 'auto',
            minQuantity: item.minQuantity,
            pantryItemId: item.id,
          }).then(() => {
            toast(`🛒 ${item.name} added to grocery list — only ${item.currentQuantity} left!`, {
              style: { background: '#1D4ED8', color: '#fff' },
            });
          });
        }
      }
    });
  }, [state.items]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Purchase a grocery item: ask quantity + dates, create batch, update pantry ──
  const purchaseGroceryItem = useCallback(async (groceryId, { quantity, entryDate, expiryDate }) => {
    const res = await apiFetch(`/grocery/${groceryId}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ quantity, entryDate, expiryDate }),
    });
    if (res.success) {
      // Update grocery list
      dispatch({ type: 'UPDATE_GROCERY', payload: res.groceryItem });
      // Update pantry item quantity if one was linked
      if (res.pantryItem) {
        dispatch({ type: 'UPDATE_ITEM', payload: res.pantryItem });
      }
    }
    return res;
  }, []);

  // ── Fetch purchase batch history for a pantry item ───────────────
  const fetchItemBatches = useCallback(async (pantryItemId) => {
    const res = await apiFetch(`/pantry/${pantryItemId}/batches`);
    if (res.success) return res.batches;
    return [];
  }, []);

  // ── Log partial consumption: subtract qty from stock ────────────────
  const logItemConsumption = useCallback(async (pantryItemId, { quantity, notes, consumedAt }) => {
    const res = await apiFetch(`/pantry/${pantryItemId}/consume-qty`, {
      method: 'POST',
      body: JSON.stringify({ quantity, notes, consumedAt }),
    });
    if (res.success && res.item) {
      dispatch({ type: 'UPDATE_ITEM', payload: res.item });
    }
    return res;
  }, []);

  // ── Fetch consumption history for a pantry item ─────────────────
  const fetchConsumptionLog = useCallback(async (pantryItemId) => {
    const res = await apiFetch(`/pantry/${pantryItemId}/consumption`);
    if (res.success) return { logs: res.logs, totalConsumed: res.totalConsumed };
    return { logs: [], totalConsumed: 0 };
  }, []);

  const actions = {
    addItem, updateItem, deleteItem,
    markConsumed, markDiscarded,
    bulkConsume, bulkDelete,
    clearAllItems, resetApp, importItems,
    updateSettings,
    addToGroceryList,
    toggleGroceryPurchased,
    purchaseGroceryItem,
    fetchItemBatches,
    logItemConsumption,
    fetchConsumptionLog,
    removeFromGroceryList,
    restoreGroceryItem,
    clearPurchasedHistory,
    bulkMarkPurchased,
    bulkRemoveGrocery,
    reloadData: loadAllData,
  };

  return (
    <PantryContext.Provider value={{ ...state, alerts, stats, categoryBreakdown, ...actions }}>
      {children}
    </PantryContext.Provider>
  );
}

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error('usePantry must be used within PantryProvider');
  return ctx;
}
