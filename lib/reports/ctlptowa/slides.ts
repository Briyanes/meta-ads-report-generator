// lib/reports/ctlptowa/slides.ts
// HTML generators untuk CTLPTOWA report

import { generateReactTailwindReport as generateOldCTLPTOWATemplate } from '../../reportTemplate-ctlptowa'

export async function generateAllSlides(
  data: any,
  metrics: any,
  insights: any,
  reportName: string,
  retentionType?: string
): Promise<string> {
  return await generateOldCTLPTOWATemplate(data, reportName, retentionType)
}
