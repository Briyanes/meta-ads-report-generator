/**
 * Color Constants and Palette
 * BUG #23 FIX: Centralized color management instead of hardcoded values
 * All colors reference CSS variables for consistency
 */

// Primary Colors (from CSS variables)
export const COLOR_PRIMARY_BLUE = 'var(--primary-blue)'      // #2B46BB
export const COLOR_PRIMARY_YELLOW = 'var(--primary-yellow)'  // #ECDC43
export const COLOR_GREEN_GROWTH = 'var(--green-growth)'      // #10B981
export const COLOR_RED_DECLINE = 'var(--red-decline)'        // #EF4444
export const COLOR_WARNING_AMBER = 'var(--warning-amber)'    // #F59E0B

// Neutral Colors (from CSS variables)
export const COLOR_NEUTRAL_50 = 'var(--neutral-50)'          // #f8fafc
export const COLOR_NEUTRAL_100 = 'var(--neutral-100)'        // #f1f5f9
export const COLOR_NEUTRAL_200 = 'var(--neutral-200)'        // #e2e8f0
export const COLOR_NEUTRAL_300 = 'var(--neutral-300)'        // #cbd5e1
export const COLOR_NEUTRAL_400 = 'var(--neutral-400)'        // #94a3b8
export const COLOR_NEUTRAL_500 = 'var(--neutral-500)'        // #64748b
export const COLOR_NEUTRAL_600 = 'var(--neutral-600)'        // #475569
export const COLOR_NEUTRAL_700 = 'var(--neutral-700)'        // #334155
export const COLOR_NEUTRAL_800 = 'var(--neutral-800)'        // #1e293b
export const COLOR_NEUTRAL_900 = 'var(--neutral-900)'        // #0f172a

// Status Colors (semantic)
export const COLOR_SUCCESS = COLOR_GREEN_GROWTH
export const COLOR_ERROR = COLOR_RED_DECLINE
export const COLOR_WARNING = COLOR_WARNING_AMBER
export const COLOR_INFO = COLOR_PRIMARY_BLUE

// Custom Colors for specific uses
export const COLOR_ACCENT_PURPLE = '#8b5cf6'
export const COLOR_ACCENT_PURPLE_BG = '#ede9fe'
export const COLOR_TEXT_GOLD = '#d97706'
export const COLOR_BG_AMBER_LIGHT = '#fef9c3'
export const COLOR_BG_ORANGE_LIGHT = '#fed7aa'
export const COLOR_BG_GREEN_LIGHT = '#f0fdf4'
export const COLOR_BG_TEAL_LIGHT = '#ecfdf5'
export const COLOR_BG_RED_LIGHT = '#fef2f2'
export const COLOR_TEXT_BROWN_DARK = '#78350f'
export const COLOR_TEXT_BROWN_LIGHT = '#92400e'

// Metric Icon Colors
export const METRIC_ICON_COLORS = {
  purple: {
    background: COLOR_ACCENT_PURPLE_BG,
    text: COLOR_ACCENT_PURPLE
  },
  blue: {
    background: '#dbeafe',
    text: '#3b82f6'
  },
  green: {
    background: '#dcfce7',
    text: '#22c55e'
  },
  orange: {
    background: '#fed7aa',
    text: '#f97316'
  },
  red: {
    background: '#fee2e2',
    text: '#ef4444'
  }
}

/**
 * Helper function to get CSS variable or fallback hex value
 * For inline styles where CSS variables might not work
 */
export function getCSSColor(colorVar: string, fallback: string = ''): string {
  // If it's already a var(), return as-is
  if (colorVar.includes('var(')) {
    return colorVar
  }
  // Otherwise return the fallback or empty
  return fallback
}

/**
 * Create inline style with color variable
 */
export function createColorStyle(property: 'color' | 'backgroundColor', colorVar: string): string {
  return `${property}: ${colorVar};`
}
