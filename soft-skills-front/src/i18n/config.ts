import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonEs from './locales/es/common.json'
import commonEn from './locales/en/common.json'
import reportsEs from './locales/es/reports.json'
import reportsEn from './locales/en/reports.json'
import roadmapEs from './locales/es/roadmap.json'
import roadmapEn from './locales/en/roadmap.json'
import goalsEs from './locales/es/goals.json'
import goalsEn from './locales/en/goals.json'
import dashboardEs from './locales/es/dashboard.json'
import dashboardEn from './locales/en/dashboard.json'
import gameEs from './locales/es/game.json'
import gameEn from './locales/en/game.json'
import authEs from './locales/es/auth.json'
import authEn from './locales/en/auth.json'

const getStoredLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('i18nextLng')
    if (stored && (stored === 'es' || stored === 'en')) {
      return stored
    }
  }
  return 'es'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        common: commonEs,
        reports: reportsEs,
        roadmap: roadmapEs,
        goals: goalsEs,
        dashboard: dashboardEs,
        game: gameEs,
        auth: authEs,
      },
      en: {
        common: commonEn,
        reports: reportsEn,
        roadmap: roadmapEn,
        goals: goalsEn,
        dashboard: dashboardEn,
        game: gameEn,
        auth: authEn,
      },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'es',
    defaultNS: 'common',
    ns: ['common', 'reports', 'roadmap', 'goals', 'dashboard', 'game', 'auth'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n

