// lib/reports/cpas/styles.ts
// CSS dan styling untuk CPAS report

// ===== CSS CLASS NAMES =====
export const styles = {
  slides: {
    cover: 'slide cover-slide cpas-cover',
    performanceSummary: 'slide performance-summary cpas-performance',
    detailedMetrics: 'slide detailed-metrics cpas-metrics',
    keyInsights: 'slide key-insights cpas-insights',
    ageBreakdown: 'slide age-breakdown cpas-age',
    genderBreakdown: 'slide gender-breakdown cpas-gender',
    regionBreakdown: 'slide region-breakdown cpas-region',
    platformBreakdown: 'slide platform-breakdown cpas-platform',
    placementBreakdown: 'slide placement-breakdown cpas-placement',
    objectiveBreakdown: 'slide objective-breakdown cpas-objective',
    creativeBreakdown: 'slide creative-breakdown cpas-creative',
    conclusion: 'slide conclusion cpas-conclusion',
  },

  // ===== TABLE STYLES =====
  table: {
    base: 'performance-table cpas-table',
    header: 'table-header cpas-header',
    row: 'table-row cpas-row',
    cell: 'table-cell cpas-cell',
  },

  // ===== BADGE STYLES =====
  badges: {
    green: 'badge badge-green cpas-badge-green',
    red: 'badge badge-red cpas-badge-red',
  },

  // ===== COLOR PALETTE =====
  colors: {
    primary: '#10b981',    // Emerald for CPAS
    secondary: '#3b82f6',  // Blue
    success: '#22c55e',    // Green
    warning: '#f59e0b',    // Orange
    danger: '#ef4444',     // Red
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      light: '#9ca3af',
    },
    background: {
      light: '#f9fafb',
      white: '#ffffff',
    }
  }
}

// ===== INLINE STYLE OBJECTS (untuk dynamic styles) =====

export const inlineStyles = {
  // Slide base styles
  slide: {
    padding: '40px',
    minHeight: '600px',
    backgroundColor: '#ffffff',
  },

  // Cover slide
  cover: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    padding: '60px 40px',
    minHeight: '600px',
    color: 'white',
  },

  // Table styles
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    margin: '20px 0',
    fontSize: '14px',
  },
  tableHeader: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  tableRow: {
    padding: '10px 12px',
    borderBottom: '1px solid #e5e7eb',
  },

  // Badge styles
  badgeGreen: {
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    display: 'inline-block',
    fontWeight: '500',
  },
  badgeRed: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    display: 'inline-block',
    fontWeight: '500',
  },

  // Metric card
  metricCard: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    marginBottom: '12px',
  },

  // Insight box
  insightBox: {
    padding: '12px 16px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    marginBottom: '12px',
  },

  // Highlight box
  highlightBox: {
    padding: '12px 16px',
    backgroundColor: '#ecfdf5',
    borderLeft: '4px solid #10b981',
    borderRadius: '4px',
    marginBottom: '12px',
  },

  // Lowlight box
  lowlightBox: {
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    borderLeft: '4px solid #ef4444',
    borderRadius: '4px',
    marginBottom: '12px',
  },
}

// ===== HELPER FUNCTIONS untuk generate inline styles =====

/**
 * Get badge style based on growth value
 */
export function getBadgeStyle(growth: number): object {
  return growth >= 0 ? inlineStyles.badgeGreen : inlineStyles.badgeRed
}

/**
 * Get text color style for difference value
 */
export function getDiffStyle(thisVal: number, lastVal: number): object {
  return {
    color: thisVal >= lastVal ? styles.colors.success : styles.colors.danger,
    fontWeight: 'bold' as const,
  }
}

/**
 * Get background color based on performance
 */
export function getPerformanceBackground(isPositive: boolean): string {
  return isPositive ? '#ecfdf5' : '#fef2f2'
}

/**
 * Get border color based on performance
 */
export function getPerformanceBorder(isPositive: boolean): string {
  return isPositive ? '#10b981' : '#ef4444'
}

/**
 * Convert style object to inline style string
 */
export function styleToString(styleObj: Record<string, any>): string {
  return Object.entries(styleObj)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value}`
    })
    .join('; ')
}

// ===== CSS TEMPLATES untuk HTML strings =====

/**
 * Generate complete CSS styles string for HTML
 */
export function getCSSTemplate(): string {
  return `
    <style>
      /* ===== BASE STYLES ===== */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #1f2937;
      }

      /* ===== SLIDE STYLES ===== */
      .slide {
        padding: 40px;
        min-height: 600px;
        background-color: #ffffff;
        page-break-after: always;
      }

      .cpas-cover {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
      }

      /* ===== TABLE STYLES ===== */
      .performance-table {
        border-collapse: collapse;
        width: 100%;
        margin: 20px 0;
        font-size: 14px;
      }

      .performance-table th,
      .performance-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }

      .table-header {
        background-color: #10b981;
        color: white;
        font-weight: bold;
        font-size: 13px;
      }

      .table-row:hover {
        background-color: #f9fafb;
      }

      /* ===== BADGE STYLES ===== */
      .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }

      .badge-green {
        background-color: #22c55e;
        color: white;
      }

      .badge-red {
        background-color: #ef4444;
        color: white;
      }

      /* ===== UTILITY CLASSES ===== */
      .text-green-600 {
        color: #16a34a;
      }

      .text-red-600 {
        color: #dc2626;
      }

      .font-bold {
        font-weight: bold;
      }

      .text-right {
        text-align: right;
      }

      .text-center {
        text-align: center;
      }

      .mb-4 {
        margin-bottom: 16px;
      }

      .mt-4 {
        margin-top: 16px;
      }

      /* ===== INSIGHT BOXES ===== */
      .insight-box {
        padding: 12px 16px;
        background-color: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 8px;
        margin-bottom: 12px;
      }

      .highlight-box {
        padding: 12px 16px;
        background-color: #ecfdf5;
        border-left: 4px solid #10b981;
        border-radius: 4px;
        margin-bottom: 12px;
      }

      .lowlight-box {
        padding: 12px 16px;
        background-color: #fef2f2;
        border-left: 4px solid #ef4444;
        border-radius: 4px;
        margin-bottom: 12px;
      }

      /* ===== AGENCY HEADER ===== */
      .agency-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 40px;
        border-bottom: 2px solid #10b981;
      }

      .agency-logo {
        font-size: 24px;
        font-weight: bold;
        color: #10b981;
      }

      /* ===== BREAKDOWN TABLES ===== */
      .breakdown-table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
      }

      .breakdown-table th,
      .breakdown-table td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }

      .breakdown-table th {
        background-color: #f9fafb;
        font-weight: 600;
        font-size: 12px;
        color: #6b7280;
      }

      .breakdown-table td {
        font-size: 13px;
      }

      /* ===== BREAKDOWN CARDS ===== */
      .breakdown-card {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
      }

      .breakdown-card-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 12px;
      }

      /* ===== CONCLUSION SLIDE ===== */
      .conclusion-list {
        list-style: none;
        padding: 0;
      }

      .conclusion-list li {
        padding: 8px 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .conclusion-list li:last-child {
        border-bottom: none;
      }
    </style>
  `
}
