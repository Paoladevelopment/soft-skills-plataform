import { PlayMode } from '../types/game-sessions/gameSession.models'

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
        title: 'Paraphrase the content',
        description: 'Restate the main ideas in your own words without changing the meaning.',
        prompt: 'Paraphrase what you heard:',
        color: '#FFF9C4',
        borderColor: '#FBC02D',
        textColor: '#F57F17',
      }
    case PlayMode.SUMMARIZE:
      return {
        title: 'Summarize the content',
        description: 'Provide a brief summary of the key points you heard.',
        prompt: 'Summarize what you heard:',
        color: '#F3E5F5',
        borderColor: '#9C27B0',
        textColor: '#6A1B9A',
      }
    case PlayMode.CLARIFY:
      return {
        title: 'Clarify the content',
        description: 'Ask clarifying questions about what you heard or provide additional context.',
        prompt: 'What would you like to clarify:',
        color: '#FCE4EC',
        borderColor: '#E91E63',
        textColor: '#AD1457',
      }
    default:
      return {
        title: 'Provide your response',
        description: 'Type your response here.',
        prompt: 'Your response:',
        color: '#F5F5F5',
        borderColor: '#9E9E9E',
        textColor: '#424242',
      }
  }
}

