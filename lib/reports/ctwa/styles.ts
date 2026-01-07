// lib/reports/ctwa/styles.ts
// CSS dan styling untuk CTWA report

// ===== CSS CLASS NAMES =====
export const styles = {
  slides: {
    cover: 'slide cover-slide ctwa-cover',
    performanceSummary: 'slide performance-summary ctwa-performance',
    detailedMetrics: 'slide detailed-metrics ctwa-metrics',
    keyInsights: 'slide key-insights ctwa-insights',
  },

  // ===== COLOR PALETTE =====
  colors: {
    primary: '#2B46BB',    // Blue untuk CTWA
    secondary: '#ECDC43',  // Yellow
    success: '#10B981',    // Green
    danger: '#EF4444',     // Red
  }
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
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

      .ctwa-cover {
        background: linear-gradient(135deg, #2B46BB 0%, #1e3a8a 100%);
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
        border-bottom: 1px solid #e2e8f0;
      }

      .table-header {
        background-color: #2B46BB;
        color: white;
        font-weight: bold;
        font-size: 13px;
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
        background-color: #10B981;
        color: white;
      }

      .badge-red {
        background-color: #EF4444;
        color: white;
      }
    </style>
  `
}
