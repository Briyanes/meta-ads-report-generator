// lib/reports/ctwa/slides.ts
// HTML generators untuk semua slide di CTWA report

// NOTE: Temporary bridge ke file lama
import { generateReactTailwindReport as generateOldCTWATemplate } from '../../reportTemplate-ctwa'

/**
 * Generate all slides for CTWA report
 *
 * Temporary implementation: Delegates to the old template file
 */
export async function generateAllSlides(
  data: any,
  metrics: any,
  insights: any,
  reportName: string,
  retentionType?: string
): Promise<string> {
  // Use the old template generator
  return await generateOldCTWATemplate(data, reportName, retentionType)
}
