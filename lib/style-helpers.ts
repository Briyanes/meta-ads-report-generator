/**
 * Helper functions for generating inline styles with CSS variables
 * BUG #23 FIX: Use CSS variables in inline styles instead of hardcoded colors
 */

/**
 * Generate inline style string with CSS color variables
 */
export function styleWithColor(
  colorProperty: 'color' | 'backgroundColor' | 'borderColor' = 'color',
  colorValue: string,
  additionalStyles: string = ''
): string {
  return `${colorProperty}: ${colorValue};${additionalStyles ? ' ' + additionalStyles : ''}`
}

/**
 * Generate metric icon styles (background + text color)
 */
export function metricIconStyle(bgColor: string, textColor: string): string {
  return `background: ${bgColor}; color: ${textColor};`
}

/**
 * Generate badge styles based on status
 */
export function badgeStyle(type: 'success' | 'error' | 'warning' | 'info'): string {
  const styles = {
    success: 'background: #dcfce7; color: #22c55e;',
    error: 'background: #fee2e2; color: #ef4444;',
    warning: 'background: #fef3c7; color: #d97706;',
    info: 'background: #dbeafe; color: #3b82f6;'
  }
  return styles[type] || styles.info
}

/**
 * Generate text color style
 */
export function textColorStyle(color: string): string {
  return `color: ${color};`
}

/**
 * Generate background color style
 */
export function bgColorStyle(color: string): string {
  return `background-color: ${color};`
}

/**
 * CSS variable references for templates
 */
export const CSS_COLORS = {
  // Primary
  primaryBlue: 'var(--primary-blue)',
  primaryYellow: 'var(--primary-yellow)',
  
  // Status
  greenGrowth: 'var(--green-growth)',
  redDecline: 'var(--red-decline)',
  warningAmber: 'var(--warning-amber)',
  
  // Neutral
  neutral50: 'var(--neutral-50)',
  neutral100: 'var(--neutral-100)',
  neutral200: 'var(--neutral-200)',
  neutral300: 'var(--neutral-300)',
  neutral400: 'var(--neutral-400)',
  neutral500: 'var(--neutral-500)',
  neutral600: 'var(--neutral-600)',
  neutral700: 'var(--neutral-700)',
  neutral800: 'var(--neutral-800)',
  neutral900: 'var(--neutral-900)',
  
  // Custom
  accentPurple: '#8b5cf6',
  accentPurpleBg: '#ede9fe',
  textGold: '#d97706',
  bgAmberLight: '#fef9c3',
  bgOrangeLight: '#fed7aa',
  bgGreenLight: '#f0fdf4',
  bgTealLight: '#ecfdf5',
  bgRedLight: '#fef2f2',
  textBrownDark: '#78350f',
  textBrownLight: '#92400e'
}
