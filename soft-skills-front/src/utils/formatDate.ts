export function formatDateString(
  dateStr: string | null, 
  fallbackMessage = "Not started yet",
  prefix = "Started:"
): string {
  if (!dateStr) return fallbackMessage

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return "Invalid date"

  const formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return prefix ? `${prefix} ${formattedDate}` : formattedDate
}

export function formatDate(
  date: Date | null, 
  fallbackMessage = "Not started yet",
  prefix = "Started:"
): string {
  if (!date) return fallbackMessage

  return `${prefix}: ${date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })}`
}