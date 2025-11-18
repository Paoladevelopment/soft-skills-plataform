import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Help = () => {
  const { t } = useTranslation('goals')

  const questions = [
    {
      id: 'q1',
      question: 'help.questions.q1.question',
      answer: 'help.questions.q1.answer'
    },
    {
      id: 'q2',
      question: 'help.questions.q2.question',
      answer: 'help.questions.q2.answer'
    },
    {
      id: 'q3',
      question: 'help.questions.q3.question',
      answer: 'help.questions.q3.answer'
    },
    {
      id: 'q4',
      question: 'help.questions.q4.question',
      answer: 'help.questions.q4.answer'
    },
    {
      id: 'q5',
      question: 'help.questions.q5.question',
      answer: 'help.questions.q5.answer'
    },
    {
      id: 'q6',
      question: 'help.questions.q6.question',
      answer: 'help.questions.q6.answer'
    },
    {
      id: 'q7',
      question: 'help.questions.q7.question',
      answer: 'help.questions.q7.answer'
    },
    {
      id: 'q8',
      question: 'help.questions.q8.question',
      answer: 'help.questions.q8.answer'
    },
    {
      id: 'q9',
      question: 'help.questions.q9.question',
      answer: 'help.questions.q9.answer'
    },
    {
      id: 'q10',
      question: 'help.questions.q10.question',
      answer: 'help.questions.q10.answer'
    },
    {
      id: 'q11',
      question: 'help.questions.q11.question',
      answer: 'help.questions.q11.answer'
    },
    {
      id: 'q12',
      question: 'help.questions.q12.question',
      answer: 'help.questions.q12.answer'
    },
    {
      id: 'q13',
      question: 'help.questions.q13.question',
      answer: 'help.questions.q13.answer'
    }
  ]

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 4 
      }}
    >
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t('help.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('help.subtitle')}
          </Typography>
        </Box>

        <Stack spacing={2}>
          {questions.map((item) => (
            <Accordion 
              key={item.id} 
              elevation={0} 
              sx={{ 
                '&:before': { display: 'none' },
                backgroundColor: 'secondary.main',
                borderRadius: 2,
                '&.Mui-expanded': {
                  margin: 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                sx={{
                  backgroundColor: 'secondary.main',
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'secondary.800',
                  },
                  '& .MuiAccordionSummary-content': {
                    my: 1.5,
                  },
                  '&.Mui-expanded': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight="600" color="white">
                  {t(item.question)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: 'white',
                  borderBottomLeftRadius: 2,
                  borderBottomRightRadius: 2,
                }}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    whiteSpace: 'pre-line' 
                  }}
                >
                  {t(item.answer)}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}

export default Help
