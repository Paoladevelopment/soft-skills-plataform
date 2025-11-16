import { Typography, Stack, Chip, Grid2 } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AccessTimeOutlined, Lock } from '@mui/icons-material'
import { formatTimeAgo, formatDate } from '../../../../utils/timeUtils'

interface DateItem {
  label: string
  value: string | null
}

interface DateDisplayProps {
  title: string
  readOnlyLabel?: string
  dates: DateItem[]
}

const DateDisplay = ({ title, readOnlyLabel, dates }: DateDisplayProps) => {
  const { t } = useTranslation('goals')
  
  const renderDateItem = (dateItem: DateItem) => (
    <Stack 
      direction="row" 
      spacing={2} 
      alignItems="flex-start"
    >
      <Stack 
        direction="row" 
        spacing={1} 
        alignItems="center"
        sx={{ minWidth: '120px' }}
      >
        <AccessTimeOutlined 
          sx={{ 
            fontSize: '1rem', 
            color: 'text.secondary' 
          }} 
        />
        <Typography variant="body2" color="text.secondary">
          {dateItem.label}
        </Typography>
      </Stack>
      
      <Stack sx={{ flex: 1 }}>
        {dateItem.value ? (
          <Stack spacing={0.5}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ fontWeight: 600 }}
            >
              {formatDate(new Date(dateItem.value))}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatTimeAgo(new Date(dateItem.value))}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body1" color="text.secondary">
            —
          </Typography>
        )}
      </Stack>
    </Stack>
  )

  return (
    <Stack spacing={2}>
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center"
      >
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
        
        <Chip
          icon={<Lock />}
          label={readOnlyLabel || t('goalDetail.dates.readOnly')}
          size="small"
          variant="outlined"
          color="default"
        />
      </Stack>

      <Grid2 container spacing={{ xs: 1, sm: 2 }}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          {renderDateItem(dates[0])}
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          {renderDateItem(dates[1])}
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          {renderDateItem(dates[2])}
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          {renderDateItem(dates[3])}
        </Grid2>
      </Grid2>
    </Stack>
  )
}

export default DateDisplay
