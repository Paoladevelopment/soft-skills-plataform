import { GameSessionStatus } from '../types/game-sessions/gameSession.models'

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
      return 'Not Started'
    case GameSessionStatus.IN_PROGRESS:
      return 'In Progress'
    case GameSessionStatus.COMPLETED:
      return 'Completed'
    case GameSessionStatus.PAUSED:
      return 'Paused'
    case GameSessionStatus.CANCELLED:
      return 'Cancelled'
    default:
      return status
  }
}

