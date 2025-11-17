import { PlayMode } from '../types/game-sessions/gameSession.models'
import i18n from '../../../i18n/config'

interface ModeInfo {
  title: string
  description: string
  prompt: string
  color: string
  borderColor: string
  textColor: string
}

export function getModeInfo(mode: PlayMode): ModeInfo {
  switch (mode) {
    case PlayMode.PARAPHRASE:
      return {
        title: i18n.t('play.modes.paraphrase.title', { ns: 'game' }),
        description: i18n.t('play.modes.paraphrase.description', { ns: 'game' }),
        prompt: i18n.t('play.modes.paraphrase.prompt', { ns: 'game' }),
        color: '#FFF9C4',
        borderColor: '#FBC02D',
        textColor: '#F57F17',
      }
    case PlayMode.SUMMARIZE:
      return {
        title: i18n.t('play.modes.summarize.title', { ns: 'game' }),
        description: i18n.t('play.modes.summarize.description', { ns: 'game' }),
        prompt: i18n.t('play.modes.summarize.prompt', { ns: 'game' }),
        color: '#F3E5F5',
        borderColor: '#9C27B0',
        textColor: '#6A1B9A',
      }
    case PlayMode.CLARIFY:
      return {
        title: i18n.t('play.modes.clarify.title', { ns: 'game' }),
        description: i18n.t('play.modes.clarify.description', { ns: 'game' }),
        prompt: i18n.t('play.modes.clarify.prompt', { ns: 'game' }),
        color: '#FCE4EC',
        borderColor: '#E91E63',
        textColor: '#AD1457',
      }
    default:
      return {
        title: i18n.t('play.modes.default.title', { ns: 'game' }),
        description: i18n.t('play.modes.default.description', { ns: 'game' }),
        prompt: i18n.t('play.modes.default.prompt', { ns: 'game' }),
        color: '#F5F5F5',
        borderColor: '#9E9E9E',
        textColor: '#424242',
      }
  }
}

