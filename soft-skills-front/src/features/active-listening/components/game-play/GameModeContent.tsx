import { Card } from '@mui/material'
import { PlayMode } from '../../types/game-sessions/gameSession.models'
import { FocusModePayload, ClozeModePayload, TextModePayload } from '../../types/game-sessions/gamePlay.models'
import { useGamePlayAnswerStore } from '../../store/useGamePlayAnswerStore'
import FocusMode from './FocusMode'
import ClozeMode from './ClozeMode'
import TextAreaMode from './TextAreaMode'

interface GameModeContentProps {
  playMode: PlayMode
  modePayload: FocusModePayload | ClozeModePayload | TextModePayload
}

const GameModeContent = ({
  playMode,
  modePayload,
}: GameModeContentProps) => {
  const { selectedIndex, filledBlanks, textResponse, clarifyQuestions } = useGamePlayAnswerStore()
  const { setSelectedIndex, updateBlank, setTextResponse, setClarifyQuestions } = useGamePlayAnswerStore()
  return (
    <Card
      sx={{
        p: 4,
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.97)',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
        border: '1px solid rgba(74, 138, 111, 0.15)',
      }}
    >
      {playMode === PlayMode.FOCUS && (
        <FocusMode
          modePayload={modePayload as FocusModePayload}
          selectedIndex={selectedIndex}
          onAnswerChange={setSelectedIndex}
        />
      )}

      {playMode === PlayMode.CLOZE && (
        <ClozeMode
          modePayload={modePayload as ClozeModePayload}
          filledBlanks={filledBlanks}
          onBlankChange={updateBlank}
        />
      )}

      {(playMode === PlayMode.PARAPHRASE ||
        playMode === PlayMode.SUMMARIZE ||
        playMode === PlayMode.CLARIFY) && (
        <TextAreaMode
          playMode={playMode}
          modePayload={modePayload as TextModePayload}
          textResponse={textResponse}
          onTextChange={setTextResponse}
          clarifyQuestions={clarifyQuestions}
          onClarifyQuestionsChange={setClarifyQuestions}
        />
      )}
    </Card>
  )
}

export default GameModeContent

