/**
 * Formats a date string to match API expectations
 * Converts YYYY-MM-DD to YYYY-MM-DDTHH:mm:ssZ format
 */
export const formatDateToDateTime = (dateString: string): string => {
  if (dateString.includes('T')) {
    return dateString
  }
  
  // Add T23:59:59Z to make it end of day (consistent with create objective)
  return `${dateString}T23:59:59Z`
}

/**
 * Normalizes a date string to YYYY-MM-DD format for comparison
 * Extracts the date part from ISO datetime strings
 */
export const normalizeDate = (dateString: string | null): string | null => {
  if (!dateString) return null
  try {
    // Extract YYYY-MM-DD part from ISO date or return as-is if already in correct format
    return dateString.split('T')[0]
  } catch {
    return dateString
  }
}
