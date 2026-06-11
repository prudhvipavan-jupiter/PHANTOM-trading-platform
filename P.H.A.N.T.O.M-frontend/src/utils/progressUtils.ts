/**
 * Utility function to get the appropriate CSS class for progress bar width
 * This eliminates the need for inline styles
 */
export const getProgressWidthClass = (percentage: number): string => {
  const roundedPercentage = Math.round(percentage / 10) * 10;
  return `progress-width-${roundedPercentage}`;
};

/**
 * Alternative function that returns the closest width class
 */
export const getClosestProgressWidthClass = (percentage: number): string => {
  if (percentage <= 5) return 'progress-width-10';
  if (percentage <= 15) return 'progress-width-20';
  if (percentage <= 25) return 'progress-width-30';
  if (percentage <= 35) return 'progress-width-40';
  if (percentage <= 45) return 'progress-width-50';
  if (percentage <= 55) return 'progress-width-60';
  if (percentage <= 65) return 'progress-width-70';
  if (percentage <= 75) return 'progress-width-80';
  if (percentage <= 85) return 'progress-width-90';
  return 'progress-width-100';
}; 