// lib/reports/ctlptowa/styles.ts
// CSS dan styling untuk CTLPTOWA report

export const styles = {
  colors: {
    primary: '#8B5CF6',    // Purple untuk CTLPTOWA
    secondary: '#EC4899',
    success: '#10B981',
    danger: '#EF4444',
  }
}

export function getCSSTemplate(): string {
  return `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', sans-serif; line-height: 1.6; }
      .slide { padding: 40px; min-height: 600px; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
      .badge-green { background-color: #10B981; color: white; }
      .badge-red { background-color: #EF4444; color: white; }
    </style>
  `
}
