import { Box, IconButton, Stack, Typography } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AithenaChatbot from "../components/roadmap/AithenaChatbot"
import { useChatbotStore } from "../store/useChatbotStore"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

const initialMessageEs = "¡Puedo ayudarte a crear una hoja de ruta de aprendizaje para diversos temas como lenguajes de programación, desarrollo web, ciencia de datos y más. ¡Envíame un mensaje para comenzar!"
const initialMessageEn = "I can help you create a learning roadmap for various subjects like programming languages, web development, data science, and more. Send me a message to get started!"

const CreateRoadmapWithChatbot = () => {
  const {
    messages,
    isLoading,
    sendMessageToChatbot,
    clearMessages,
    addMessage
  } = useChatbotStore()

  const navigate = useNavigate()
  const { t, i18n: i18nHook } = useTranslation('roadmap')

  useEffect(() => {
    const currentInitialMessage = t('chatbot.initialMessage')
    
    if (messages.length === 0) {
      addMessage({
        sender: 'aithena',
        text: currentInitialMessage,
      })

      return
    }

    const firstMessage = messages[0]
    if (firstMessage?.sender !== 'aithena') {
      return
    }

    const isInitialMessage = firstMessage.text === initialMessageEs || firstMessage.text === initialMessageEn
    if (!isInitialMessage) {
      return
    }

    if (firstMessage.text === currentInitialMessage) {
      return
    }

    const updatedMessages = [...messages]
    updatedMessages[0] = {
      ...firstMessage,
      text: currentInitialMessage,
    }
    
    useChatbotStore.setState({ messages: updatedMessages })
  }, [i18nHook.language, messages, addMessage, t])

  const onEndChat = () => {
    clearMessages()
    navigate("/learn/roadmaps")
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: 4,
        py: 2,
        boxSizing: 'border-box',
      }}
    >
      
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate('/learn/roadmaps')} size="small">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography
          variant="body2"
          fontWeight={500}
          color="text.secondary"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/learn/roadmaps')}
        >
          Back to roadmaps
        </Typography>
      </Stack>

      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          overflowY: 'hidden'
        }}
      >
        <AithenaChatbot
          messages={messages}
          onSendMessage={sendMessageToChatbot}
          onEndChat={onEndChat}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  )
}

export default CreateRoadmapWithChatbot