/**
 * Utility function to set dynamic colors for portfolio indicators
 * This eliminates the need for inline styles
 */
export const setPortfolioColor = (element: HTMLElement, color: string) => {
  element.style.setProperty('--portfolio-color', color);
  element.style.backgroundColor = color;
};

/**
 * Alternative approach using CSS custom properties
 */
export const createPortfolioColorStyle = (color: string) => {
  return {
    '--portfolio-color': color,
    backgroundColor: color
  } as React.CSSProperties;
}; 