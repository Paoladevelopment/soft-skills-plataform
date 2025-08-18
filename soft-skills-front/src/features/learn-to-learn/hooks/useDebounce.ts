import { useEffect, useState } from 'react'
import { AUTO_SAVE_DELAY } from '../../../config/api'

/**
 * Custom hook that debounces a value with a specified delay.
 * Useful for auto-saving forms or search inputs.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 750ms from config)
 * @returns The debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 300)
 * 
 * useEffect(() => {
 *   // This will only run 300ms after the user stops typing
 *   searchAPI(debouncedSearchTerm)
 * }, [debouncedSearchTerm])
 */
export const useDebounce = <T>(value: T, delay = AUTO_SAVE_DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}
