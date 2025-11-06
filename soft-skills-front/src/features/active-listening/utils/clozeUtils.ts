/**
 * Splits text into parts and blank markers
 * @param text - Text with blanks marked as underscores (e.g., "Hello ___ world")
 * @returns Array of text parts and blank markers
 */
export function splitTextByBlanks(text: string): string[] {
  return text.split(/(_+)/g)
}

/**
 * Gets indices of blank positions in split text
 * @param parts - Parts array from splitTextByBlanks
 * @returns Array of indices where blanks are located
 */
export function getBlankIndices(parts: string[]): number[] {
  return parts
    .map((part, index) => isBlank(part) ? index : -1)
    .filter(index => index !== -1)
}

/**
 * Counts the number of blanks in text
 * @param text - Text with blanks marked as underscores
 * @returns Number of blanks found
 */
export function countBlanks(text: string): number {
  return (text.match(/_+/g) || []).length
}

/**
 * Checks if a part is a blank (marked with underscores)
 * @param part - Text part to check
 * @returns True if part is a blank, false otherwise
 */
export function isBlank(part: string): boolean {
  return /^_+$/.test(part)
}

