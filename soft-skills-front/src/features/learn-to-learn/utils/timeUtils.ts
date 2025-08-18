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
