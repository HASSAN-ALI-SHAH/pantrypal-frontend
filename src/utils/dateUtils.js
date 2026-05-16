import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date string as "Jan 15, 2025"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, 'MMM d, yyyy') : '—';
  } catch { return '—'; }
};

/**
 * Format a date as relative (e.g., "2 days ago")
 */
export const formatRelative = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : '';
  } catch { return ''; }
};

/**
 * Get today's date as ISO string YYYY-MM-DD
 */
export const todayISO = () => new Date().toISOString().split('T')[0];

/**
 * Format number with compact notation (e.g., 1500 → 1.5K)
 */
export const formatCompact = (n) =>
  Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

/**
 * Get month name from 0-indexed month
 */
export const monthName = (m) =>
  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m];
