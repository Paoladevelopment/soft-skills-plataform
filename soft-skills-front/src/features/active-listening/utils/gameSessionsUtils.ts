import { GameSessionStatus } from '../types/game-sessions/gameSession.models'
import i18n from '../../../i18n/config'

export const getStatusColor = (status: GameSessionStatus) => {
  switch (status) {
    case GameSessionStatus.PENDING:
      return 'warning'
    case GameSessionStatus.IN_PROGRESS:
      return 'info'
    case GameSessionStatus.PAUSED:
      return 'warning'
    case GameSessionStatus.COMPLETED:
      return 'success'
    case GameSessionStatus.CANCELLED:
      return 'error'
    default:
      return 'default'
  }
}

export const getStatusLabel = (status: GameSessionStatus) => {
  switch (status) {
    case GameSessionStatus.PENDING:
      return i18n.t('sessions.status.notStarted', { ns: 'game' })
    case GameSessionStatus.IN_PROGRESS:
      return i18n.t('sessions.status.inProgress', { ns: 'game' })
    case GameSessionStatus.COMPLETED:
      return i18n.t('sessions.status.completed', { ns: 'game' })
    case GameSessionStatus.PAUSED:
      return i18n.t('sessions.status.paused', { ns: 'game' })
    case GameSessionStatus.CANCELLED:
      return i18n.t('sessions.status.cancelled', { ns: 'game' })
    default:
      return status
  }
}

