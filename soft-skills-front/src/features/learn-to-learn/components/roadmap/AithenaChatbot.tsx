import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Button,
  Alert
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import SendIcon from '@mui/icons-material/Send'
import LogoutIcon from '@mui/icons-material/Logout'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatMessage } from '../../types/chatbot/chatbot.models'
import { useChatbotStore } from '../../store/useChatbotStore'

interface Props {
  messages: ChatMessage[]
  isLoading?: boolean
  onSendMessage: (text: string) => void
  onEndChat: () => void
}

const AithenaChatbot = ({ messages, isLoading, onSendMessage, onEndChat }: Props) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const isConversationEnded = useChatbotStore((state) => state.isConversationEnded)
  const startNewConversation = useChatbotStore((state) => state.startNewConversation)
  
  const { t } = useTranslation('roadmap')

  const handleSend = () => {
    if (!input.trim()) return
    onSendMessage(input)
    setInput('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }  

  return (
    <Box
      sx={{
        width: '80%',
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F5F5FA',
        border: '1px solid #ddd',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#6A5AE0',
          color: 'white',
          px: 4,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography 
            variant="subtitle1" 
            fontWeight="bold"
          >
            Aithena
          </Typography>
          <Typography 
            variant="body2"
          >
            {t('chatbot.assistant')}
          </Typography>
        </Box>
        <Button
          onClick={onEndChat}
          variant="contained"
          size="small"
          startIcon={<LogoutIcon />} 
          sx={{
            backgroundColor: '#6A5AE0',
            color: 'white',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 500,
            px: 2,
            py: 0.5,
            '&:hover': {
              backgroundColor: '#5848c2',
            }
          }}
        >
          {t('chatbot.endChat')}
        </Button>
      </Box>

      <Box 
        sx={{ 
          flex: 1, 
          px: 4, 
          py: 2, 
          overflowY: 'auto' 
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            display="flex"
            justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            mb={3}
          >
            <Box
              sx={{
                backgroundColor: msg.sender === 'user' ? '#1C1C3B' : '#fff',
                color: msg.sender === 'user' ? 'white' : 'black',
                p: 1.2,
                borderRadius: 2,
                maxWidth: '70%',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              <Stack 
                direction="row" 
                alignItems="flex-start" 
                spacing={2}
              >
                {msg.sender === 'aithena' && (
                  <SmartToyIcon 
                    fontSize="small" 
                    sx={{ 
                      color: '#6A5AE0' 
                    }} 
                  />
                )}
                <Box sx={{ 
                  wordBreak: 'break-word' 
                  }}
                >
                  <ReactMarkdown
                    components={{
                      strong: 
                        ({ children }) => 
                          <strong 
                            style={{ 
                              fontWeight: 600 
                            }}
                          >
                            {children}
                          </strong>,
                      li: 
                        ({ children }) => 
                          <li 
                            style={{ 
                              margin: '0' 
                            }}>
                              {children}
                          </li>,
                      ul: 
                        ({ children }) => (
                          <ul 
                            style={{ 
                              paddingLeft: '1.5rem', 
                              margin: '0' 
                            }}>
                              {children}
                          </ul>
                      ),
                      p: ({ children }) => (
                        <p 
                          style={{
                            margin: '0', 
                            lineHeight: 1.5 
                          }}>
                            {children}
                        </p>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </Box>
              </Stack>
            </Box>
          </Box>
        ))}

        {isLoading && (
          <Box 
            display="flex" 
            justifyContent="flex-start" 
            mb={1}
          >
            <Box
              sx={{
                backgroundColor: '#fff',
                color: 'black',
                p: 1.2,
                borderRadius: 2,
                maxWidth: '70%',
                display: 'inline-block',
                fontStyle: 'italic',
                fontSize: '14px',
              }}
            >
              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1}
              >
                <SmartToyIcon 
                  fontSize="small" 
                  sx={{ 
                    color: '#6A5AE0' 
                  }} 
                />
                <Typography 
                  variant="body2"
                >
                  {t('chatbot.typing')}
                </Typography>
              </Stack>
            </Box>
          </Box>
        )}

        {isConversationEnded && (
          <Alert 
            severity="warning" 
            sx={{
              mt: 2,
              mb: 2 
            }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={startNewConversation}
              >
                {t('chatbot.conversationEnded.newConversation')}
              </Button>
            }
          >
            {t('chatbot.conversationEnded.message')}
          </Alert>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderTop: '1px solid #ddd',
          backgroundColor: '#fff'
        }}
      >
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chatbot.inputPlaceholder')}
          fullWidth
          size="small"
          variant="outlined"
          disabled={isLoading || isConversationEnded}
        />
        <IconButton 
          onClick={handleSend} 
          sx={{ ml: 1 }} 
          disabled={isLoading || isConversationEnded}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default AithenaChatbot