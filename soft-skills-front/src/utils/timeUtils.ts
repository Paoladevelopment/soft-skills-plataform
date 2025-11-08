const DATE_UNITS = {
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1
}

const getSecondsDiff = (timestamp: Date): number => {
  return (Date.now() - timestamp.getTime()) / 1000
}

const getUnitAndValueDate = (secondsElapsed: number) => {
  for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
    if (secondsElapsed >= secondsInUnit || unit === 'second') {
      const value = Math.floor(secondsElapsed / secondsInUnit)
      return { value, unit }
    }
  }
  return { value: 0, unit: 'second' }
}

const getTimeAgo = (timestamp: Date, locale: string = 'en') => {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const secondsElapsed = getSecondsDiff(timestamp)
  const { value, unit } = getUnitAndValueDate(secondsElapsed)
  return rtf.format(-value, unit as Intl.RelativeTimeFormatUnit)
}

export const useTimeAgo = (timestamp: Date) => {
  const locale = 'en'
  const timeago = getTimeAgo(timestamp, locale)
  
  const date = new Date(timestamp)
  const dateTime = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
  
  return { dateTime, timeago }
}

export const formatTimeAgo = (date: Date): string => {
  return getTimeAgo(date, 'en')
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}

/**
 * Calculates elapsed time between start and end dates
 */
export function calculateElapsedTime(
  startedAt?: string | null,
  completedAt?: string | null
): string | undefined {
  if (!startedAt) {
    return undefined
  }

  const startDate = new Date(startedAt)
  const endDate = completedAt ? new Date(completedAt) : new Date()
  
  const diffInMs = endDate.getTime() - startDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (diffInDays > 0) {
    return `${diffInDays}d ${diffInHours}h`
  }
  
  return `${diffInHours}h`
}

