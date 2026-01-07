// lib/reports/cpas/slides.ts
// HTML generators untuk semua slide di CPAS report

// NOTE: Temporary bridge ke file lama
// Menggunakan fungsi generateReactTailwindReport dari reportTemplate-cpas.ts
import { generateReactTailwindReport as generateOldCPASTemplate } from '../../reportTemplate-cpas'

/**
 * Generate all slides for CPAS report
 *
 * Temporary implementation: Delegates to the old template file
 * TODO: Refactor pelan-pelan untuk memecah setiap slide ke function terpisah
 */
export async function generateAllSlides(
  data: any,
  metrics: any,
  insights: any,
  reportName: string,
  retentionType?: string
): Promise<string> {
  // For now, use the old template generator
  // The old function already has all the HTML generators
  return await generateOldCPASTemplate(data, reportName, retentionType, 'cpas')
}

