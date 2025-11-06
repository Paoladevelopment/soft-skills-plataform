import { PlayMode } from '../types/game-sessions/gameSession.models'
import { AnswerPayload } from '../types/game-sessions/gamePlay.api'

interface BuildAnswerPayloadParams {
  playMode: PlayMode
  selectedIndex?: number | null
  filledBlanks?: string[]
  textResponse?: string
  clarifyQuestions?: string[]
}

export function buildAnswerPayload(params: BuildAnswerPayloadParams): AnswerPayload {
  const { playMode, selectedIndex, filledBlanks, textResponse, clarifyQuestions } = params
  
  switch (playMode) {
    case PlayMode.FOCUS: {
      return { selected_index: selectedIndex as number }
    }

    case PlayMode.CLOZE: {
      return { blanks: filledBlanks as string[] }
    }

    case PlayMode.PARAPHRASE: {
      return { paraphrase: textResponse as string }
    }

    case PlayMode.SUMMARIZE: {
      return { summary: textResponse as string }
    }

    case PlayMode.CLARIFY: {
      return { questions: clarifyQuestions?.filter(q => q.trim()) as string[] }
    }

    default:
      throw new Error(`Unsupported play mode: ${playMode}`)
  }
}

