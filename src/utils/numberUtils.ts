// Utility functions for safe number formatting that prevents hydration mismatches

export const safeFixed = (value: number | null | undefined, decimals: number = 1): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0' + (decimals > 0 ? '.' + '0'.repeat(decimals) : '');
  }
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals) + '';
};

export const safePercent = (value: number | null | undefined, decimals: number = 0): string => {
  return safeFixed(value, decimals) + '%';
};

export const safeNumber = (value: number | null | undefined, decimals: number = 1): number => {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};