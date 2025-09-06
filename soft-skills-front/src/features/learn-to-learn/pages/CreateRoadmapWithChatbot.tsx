import { Box, IconButton, Stack, Typography } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AithenaChatbot from "../components/roadmap/AithenaChatbot"
import { useChatbotStore } from "../store/useChatbotStore"
import { useNavigate } from "react-router-dom"

const CreateRoadmapWithChatbot = () => {
  const {
    messages,
    isLoading,
    sendMessageToChatbot,
    clearMessages
  } = useChatbotStore()

  const navigate = useNavigate()

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