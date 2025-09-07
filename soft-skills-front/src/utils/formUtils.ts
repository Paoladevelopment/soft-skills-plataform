/**
 * Generates form field attributes (id and name) based on a label
 * @param label - The field label to base the attributes on
 * @param prefix - Optional prefix for the id (defaults to 'field')
 * @param customId - Optional custom id to use instead of generated one
 * @param customName - Optional custom name to use instead of generated one
 * @returns Object with id and name attributes
 */
export const generateFormFieldAttributes = (
  label: string,
  prefix: string = 'field',
  customId?: string,
  customName?: string
) => {
  const normalizedLabel = label.toLowerCase().replace(/\s+/g, '-')
  const normalizedName = label.toLowerCase().replace(/\s+/g, '_')
  
  return {
    id: customId || `${prefix}-${normalizedLabel}`,
    name: customName || normalizedName
  }
}
