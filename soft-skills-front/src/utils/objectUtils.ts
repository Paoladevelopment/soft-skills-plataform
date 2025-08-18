/**
 * Checks if any specified fields have changed between a payload and existing object
 * 
 * @template T - The type of the existing object
 * @param payload - Partial object containing the fields to check for changes
 * @param existing - The complete existing object to compare against
 * @param fields - Array of field names to check for changes
 * @returns true if any of the specified fields have different values, false otherwise
 * 
 * @example
 * ```typescript
 * // Check if title, description, or impact have changed
 * if (!hasChanges(payload, selectedGoal, ['title', 'description', 'impact'])) {
 *   return // No changes detected
 * }
 * 
 * // Check if user profile fields have changed
 * if (!hasChanges(payload, user, ['name', 'email', 'avatar'])) {
 *   return // No changes detected
 * }
 * ```
 */
export function hasChanges<T extends object>(
  payload: Partial<T>,
  existing: T,
  fields: (keyof T)[]
): boolean {
  if (!payload || !existing) return false
  
  return fields.some(field => 
    field in payload && payload[field] !== existing[field]
  )
}