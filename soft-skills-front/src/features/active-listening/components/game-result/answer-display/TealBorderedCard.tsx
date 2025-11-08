import { Card } from '@mui/material'
import { ReactNode } from 'react'

interface TealBorderedCardProps {
  children: ReactNode
  borderLeftColor?: string
}

const TealBorderedCard = ({ children, borderLeftColor = '#17A2B8' }: TealBorderedCardProps) => {
  return (
    <Card
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        borderLeft: `4px solid ${borderLeftColor}`,
        borderLeftRadius: '8px',
        color: '#000000',
      }}
    >
      {children}
    </Card>
  )
}

export default TealBorderedCard

