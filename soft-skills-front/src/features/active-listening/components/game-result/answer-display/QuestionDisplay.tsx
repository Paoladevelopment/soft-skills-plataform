import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import TealBorderedCard from './TealBorderedCard'

interface QuestionDisplayProps {
  question: string
}

const QuestionDisplay = ({ question }: QuestionDisplayProps) => {
  const { t } = useTranslation('game')
  return (
    <TealBorderedCard borderLeftColor="#F8B5CB">
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          fontWeight: 600,
        }}
      >
        {t('result.evaluation.question')}
      </Typography>
      <Typography
        variant="body1"
      >
        {question}
      </Typography>
    </TealBorderedCard>
  )
}

export default QuestionDisplay

