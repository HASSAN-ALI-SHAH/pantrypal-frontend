import { differenceInDays, parseISO, isValid, startOfDay } from 'date-fns';

/**
 * Get number of days left until expiry.
 * Negative = already expired.
 * Uses startOfDay on both sides to avoid time-of-day off-by-1 errors.
 */
export const getDaysLeft = (expiryDate) => {
  if (!expiryDate) return 0;
  try {
    const parsed = parseISO(expiryDate);
    if (!isValid(parsed)) return 0;
    return differenceInDays(startOfDay(parsed), startOfDay(new Date()));
  } catch { return 0; }
};

/**
 * Returns status object for a pantry item based on days left.
 */
export const getExpiryStatus = (daysLeft) => {
  if (daysLeft < 0)  return { label: 'Expired',       color: 'red',   icon: '⚠️',  badgeClass: 'badge-red',   severity: 4 };
  if (daysLeft === 0) return { label: 'Expires Today', color: 'red',   icon: '🔴',  badgeClass: 'badge-red',   severity: 3 };
  if (daysLeft <= 2)  return { label: 'Critical',      color: 'red',   icon: '🔴',  badgeClass: 'badge-red',   severity: 3 };
  if (daysLeft <= 5)  return { label: 'Expiring Soon', color: 'amber', icon: '🟡',  badgeClass: 'badge-amber', severity: 2 };
  return               { label: 'Fresh',        color: 'green', icon: '🟢',  badgeClass: 'badge-green', severity: 1 };
};

/**
 * Calculate freshness percentage for progress bar.
 * Uses entryDate → expiryDate range.
 */
export const getFreshnessPercent = (entryDate, expiryDate) => {
  if (!entryDate || !expiryDate) return 100;
  try {
    const entry  = startOfDay(parseISO(entryDate));
    const expiry = startOfDay(parseISO(expiryDate));
    const today  = startOfDay(new Date());
    const total  = differenceInDays(expiry, entry);
    const left   = differenceInDays(expiry, today);
    if (total <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((left / total) * 100)));
  } catch { return 100; }
};

/**
 * Generate alert objects from pantry items.
 */
export const generateAlerts = (items, alertDays = 5) => {
  return items
    .filter(item => item.status === 'active')
    .map(item => {
      const daysLeft = getDaysLeft(item.expiryDate);
      const status   = getExpiryStatus(daysLeft);
      if (daysLeft > alertDays) return null;
      return {
        id:        `alert-${item.id}`,
        itemId:    item.id,
        itemName:  item.name,
        category:  item.category,
        daysLeft,
        status,
        expiryDate: item.expiryDate,
        dismissed: false,
        createdAt:  new Date().toISOString(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysLeft - b.daysLeft);
};

/**
 * Expiry countdown text (e.g., "Expires in 3 days", "Expired 2 days ago")
 */
export const getExpiryText = (daysLeft) => {
  if (daysLeft < 0)  return `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} ago`;
  if (daysLeft === 0) return 'Expires today!';
  if (daysLeft === 1) return 'Expires tomorrow';
  return `Expires in ${daysLeft} days`;
};

/**
 * Sort items by various fields.
 */
export const sortItems = (items, sortBy) => {
  const arr = [...items];
  switch (sortBy) {
    case 'expiry':     return arr.sort((a, b) => getDaysLeft(a.expiryDate) - getDaysLeft(b.expiryDate));
    case 'name':       return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'category':   return arr.sort((a, b) => a.category.localeCompare(b.category));
    case 'dateAdded':  return arr.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));
    default:           return arr;
  }
};

/**
 * Filter items by status tab.
 */
export const filterByStatus = (items, tab) => {
  switch (tab) {
    case 'fresh':         return items.filter(i => getDaysLeft(i.expiryDate) > 5);
    case 'expiring-soon': return items.filter(i => { const d = getDaysLeft(i.expiryDate); return d >= 0 && d <= 5; });
    case 'expired':       return items.filter(i => getDaysLeft(i.expiryDate) < 0);
    case 'consumed':      return items.filter(i => i.status === 'consumed');
    case 'discarded':     return items.filter(i => i.status === 'discarded');
    default:              return items;
  }
};
