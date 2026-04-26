/**
 * Input validation utilities for API requests
 * BUG #12 FIX: Comprehensive input validation and sanitization
 */

import { AnalysisData, isValidAnalysisData } from './analysis'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  data?: any
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: any): ValidationResult {
  const errors: string[] = []

  // Check if file exists
  if (!file) {
    errors.push('No file provided')
    return { isValid: false, errors }
  }

  // Check if it's a File object
  if (!(file instanceof File)) {
    errors.push('Invalid file object')
    return { isValid: false, errors }
  }

  // Check file size (max 50MB)
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    return { isValid: false, errors }
  }

  // Check file type
  const validMimeTypes = ['text/csv', 'text/plain', 'application/vnd.ms-excel']
  if (!validMimeTypes.includes(file.type) && !file.name.endsWith('.csv')) {
    errors.push('Invalid file type. Only CSV files are accepted')
    return { isValid: false, errors }
  }

  // Check file name
  if (!file.name || file.name.trim().length === 0) {
    errors.push('Invalid file name')
    return { isValid: false, errors }
  }

  return { isValid: true, errors }
}

/**
 * Validate retention type
 */
export function validateRetentionType(retentionType: any): ValidationResult {
  const errors: string[] = []

  if (!retentionType) {
    return { isValid: true, errors, data: 'wow' } // Default fallback
  }

  const validTypes = ['wow', 'mom'] // Week-over-week, Month-over-month
  if (typeof retentionType !== 'string' || !validTypes.includes(retentionType.toLowerCase())) {
    errors.push(`Invalid retention type. Must be one of: ${validTypes.join(', ')}`)
    return { isValid: false, errors }
  }

  return { isValid: true, errors, data: retentionType.toLowerCase() }
}

/**
 * Validate objective type
 */
export function validateObjectiveType(objectiveType: any): ValidationResult {
  const errors: string[] = []

  if (!objectiveType) {
    errors.push('Objective type is required')
    return { isValid: false, errors }
  }

  const validTypes = ['cpas', 'ctwa', 'ctlptowa', 'ctlptopurchase']
  if (typeof objectiveType !== 'string' || !validTypes.includes(objectiveType.toLowerCase())) {
    errors.push(`Invalid objective type. Must be one of: ${validTypes.join(', ')}`)
    return { isValid: false, errors }
  }

  return { isValid: true, errors, data: objectiveType.toLowerCase() }
}

/**
 * Validate report name
 */
export function validateReportName(reportName: any): ValidationResult {
  const errors: string[] = []

  if (reportName && typeof reportName !== 'string') {
    errors.push('Report name must be a string')
    return { isValid: false, errors }
  }

  if (reportName && reportName.trim().length === 0) {
    errors.push('Report name cannot be empty')
    return { isValid: false, errors }
  }

  // Check length
  if (reportName && reportName.length > 255) {
    errors.push('Report name is too long (max 255 characters)')
    return { isValid: false, errors }
  }

  return { isValid: true, errors, data: reportName ? reportName.trim() : undefined }
}

/**
 * Validate analysis data for report generation
 */
export function validateAnalysisData(data: any): ValidationResult {
  const errors: string[] = []

  if (!data) {
    errors.push('Analysis data is required')
    return { isValid: false, errors }
  }

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      if (!isValidAnalysisData(parsed)) {
        errors.push('Invalid analysis data structure')
        return { isValid: false, errors }
      }
      return { isValid: true, errors, data: parsed }
    } catch (error) {
      errors.push('Invalid JSON in analysis data')
      return { isValid: false, errors }
    }
  }

  if (!isValidAnalysisData(data)) {
    errors.push('Invalid analysis data structure')
    return { isValid: false, errors }
  }

  return { isValid: true, errors, data }
}

/**
 * Validate form data from request
 */
export async function validateFormData(request: Request): Promise<ValidationResult> {
  const errors: string[] = []

  try {
    const formData = await request.formData()

    // Get file
    const file = formData.get('file')
    const fileValidation = validateFileUpload(file)
    if (!fileValidation.isValid) {
      errors.push(...fileValidation.errors)
    }

    // Get retentionType
    const retentionType = formData.get('retentionType')
    const retentionValidation = validateRetentionType(retentionType)
    if (!retentionValidation.isValid) {
      errors.push(...retentionValidation.errors)
    }

    // Get objectiveType
    const objectiveType = formData.get('objectiveType')
    const objectiveValidation = validateObjectiveType(objectiveType)
    if (!objectiveValidation.isValid) {
      errors.push(...objectiveValidation.errors)
    }

    // Get reportName (optional)
    const reportName = formData.get('reportName')
    const reportNameValidation = validateReportName(reportName)
    if (!reportNameValidation.isValid) {
      errors.push(...reportNameValidation.errors)
    }

    if (errors.length > 0) {
      return { isValid: false, errors }
    }

    return {
      isValid: true,
      errors,
      data: {
        file: fileValidation.data,
        retentionType: retentionValidation.data,
        objectiveType: objectiveValidation.data,
        reportName: reportNameValidation.data
      }
    }
  } catch (error: any) {
    errors.push(`Failed to parse form data: ${error.message}`)
    return { isValid: false, errors }
  }
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: any, maxLength: number = 1000): string {
  if (typeof input !== 'string') return ''

  // Trim and limit length
  let result = input.trim().substring(0, maxLength)

  // Remove dangerous HTML/script content
  result = result
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')

  return result
}

/**
 * Validate and sanitize CSV data
 */
export function validateCSVContent(csvText: string): ValidationResult {
  const errors: string[] = []

  if (!csvText || typeof csvText !== 'string') {
    errors.push('CSV content is not a string')
    return { isValid: false, errors }
  }

  // Check if not empty
  if (csvText.trim().length === 0) {
    errors.push('CSV content is empty')
    return { isValid: false, errors }
  }

  // Check size
  const MAX_CSV_SIZE = 100 * 1024 * 1024 // 100MB
  if (csvText.length > MAX_CSV_SIZE) {
    errors.push('CSV content is too large')
    return { isValid: false, errors }
  }

  // Check for at least 2 lines (header + data)
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) {
    errors.push('CSV must contain at least a header row and one data row')
    return { isValid: false, errors }
  }

  return { isValid: true, errors, data: csvText }
}
