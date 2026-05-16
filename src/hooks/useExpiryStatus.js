import { useMemo } from 'react';
import { getDaysLeft, getExpiryStatus, getFreshnessPercent, getExpiryText } from '../utils/expiryUtils';

/**
 * useExpiryStatus — compute all expiry info for a single item
 * @param {object} item — pantry item object
 * @returns {{ daysLeft, status, freshnessPercent, expiryText }}
 */
export function useExpiryStatus(item) {
  return useMemo(() => {
    if (!item) return {};
    const daysLeft        = getDaysLeft(item.expiryDate);
    const status          = getExpiryStatus(daysLeft);
    const freshnessPercent = getFreshnessPercent(item.entryDate, item.expiryDate);
    const expiryText      = getExpiryText(daysLeft);
    return { daysLeft, status, freshnessPercent, expiryText };
  }, [item]);
}
