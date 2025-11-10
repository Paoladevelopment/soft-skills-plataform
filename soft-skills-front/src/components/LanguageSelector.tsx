import { 
  Select, 
  MenuItem, 
  FormControl, 
  SelectChangeEvent,
  Box,
  Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import LanguageIcon from '@mui/icons-material/Language'

const LanguageSelector = () => {
  const { i18n, t } = useTranslation('common')

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLang = event.target.value
    i18n.changeLanguage(newLang)

    localStorage.setItem('i18nextLng', newLang)
  }

  const currentLanguage = i18n.language === 'es' ? t('language.es') : t('language.en')

  return (
    <FormControl 
      size="small" 
      sx={{ 
        minWidth: 140,
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          color: 'common.white',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
          },
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.7)',
          },
        },
        '& .MuiSvgIcon-root': {
          color: 'common.white',
        },
      }}
    >
      <Select
        id="language-select"
        value={i18n.language}
        onChange={handleLanguageChange}
        displayEmpty
        renderValue={() => (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <LanguageIcon sx={{ fontSize: 18 }} />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500 
              }}
            >
              {currentLanguage}
            </Typography>
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 140,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            },
          },
        }}
      >
        <MenuItem value="es">
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <Typography variant="body2">
              {t('language.es')}
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem value="en">
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <Typography variant="body2">
              {t('language.en')}
            </Typography>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default LanguageSelector

