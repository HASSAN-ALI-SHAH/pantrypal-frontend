import { useAuth } from '../context/AuthContext';

const API_URL = 'https://pantrypal-backend-wine.vercel.app/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
});

export const pantryApi = {
  fetchItems: async (token) => {
    const res = await fetch(`${API_URL}/pantry`, { headers: getHeaders(token) });
    return res.json();
  },
  addItem: async (token, itemData) => {
    const res = await fetch(`${API_URL}/pantry`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(itemData)
    });
    return res.json();
  },
  updateItem: async (token, id, updates) => {
    const res = await fetch(`${API_URL}/pantry/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(updates)
    });
    return res.json();
  },
  deleteItem: async (token, id) => {
    const res = await fetch(`${API_URL}/pantry/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return res.json();
  },
  updateStatus: async (token, id, status) => {
    const res = await fetch(`${API_URL}/pantry/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return res.json();
  },
  bulkConsume: async (token, ids) => {
    const res = await fetch(`${API_URL}/pantry/bulk-consume`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ ids })
    });
    return res.json();
  },
  bulkDelete: async (token, ids) => {
    const res = await fetch(`${API_URL}/pantry/bulk-delete`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ ids })
    });
    return res.json();
  }
};
