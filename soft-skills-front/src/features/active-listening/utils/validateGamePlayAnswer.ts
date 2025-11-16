import { z } from 'zod'
import { PlayMode } from '../types/game-sessions/gameSession.models'
import i18n from '../../../i18n/config'

type SupportedPlayMode = PlayMode.FOCUS | PlayMode.CLOZE | PlayMode.PARAPHRASE | PlayMode.SUMMARIZE | PlayMode.CLARIFY

const answerValidationSchemas: Record<SupportedPlayMode, z.ZodSchema> = {
  [PlayMode.FOCUS]: z.object({
    selectedIndex: z.number({ invalid_type_error: 'Please select an answer' }).min(0, 'Please select an answer'),
  }),
  [PlayMode.CLOZE]: z.object({
    filledBlanks: z.array(z.string()),
    blankCount: z.number(),
  }).refine(
    (data) => data.filledBlanks.length === (data as {filledBlanks: string[], blankCount: number}).blankCount && 
              (data as {filledBlanks: string[], blankCount: number}).filledBlanks.every(b => b.trim()),
    'Please fill in all the blanks'
  ),
  [PlayMode.PARAPHRASE]: z.object({
    textResponse: z.string().min(1, 'Please provide a paraphrase'),
  }),
  [PlayMode.SUMMARIZE]: z.object({
    textResponse: z.string().min(1, 'Please provide a summary'),
  }),
  [PlayMode.CLARIFY]: z.object({
    clarifyQuestions: z.array(z.string()).min(1, 'Please ask at least one clarifying question'),
  }).refine(
    (data) => (data as {clarifyQuestions: string[]}).clarifyQuestions.some(q => q.trim()),
    'Please ask at least one clarifying question'
  )
}

interface ValidateAnswerParams {
  playMode: PlayMode
  selectedIndex?: number | null
  filledBlanks?: string[]
  textResponse?: string
  blankCount?: number
  clarifyQuestions?: string[]
}

export function validateGamePlayAnswer(params: ValidateAnswerParams): {
  isValid: boolean
  error?: string
} {
  const { playMode, selectedIndex, filledBlanks, textResponse, blankCount, clarifyQuestions } = params

  try {
    const schema = answerValidationSchemas[playMode]

    if (!schema) {
      return { 
        isValid: false, 
        error: 'Invalid play mode' 
      }
    }

    switch (playMode) {
      case PlayMode.FOCUS: {
        schema.parse({ selectedIndex })
        break
      }

      case PlayMode.CLOZE: {
        schema.parse({ filledBlanks, blankCount })
        break
      }

      case PlayMode.PARAPHRASE:
      case PlayMode.SUMMARIZE: {
        schema.parse({ textResponse })
        break
      }

      case PlayMode.CLARIFY: {
        schema.parse({ clarifyQuestions })
        break
      }
    }

    return { 
        isValid: true 
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
        return { 
            isValid: false, 
            error: error.errors[0]?.message || i18n.t('play.validation.failed', { ns: 'game' })
        }
    }
    return { 
        isValid: false, 
        error: i18n.t('play.validation.failed', { ns: 'game' })
    }
  }
}

