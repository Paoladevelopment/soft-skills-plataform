import { Box } from '@mui/material'

interface DropIndicatorProps {
  edge: 'top' | 'bottom'
  gap?: string
}

const DropIndicator = ({ edge, gap = '8px' }: DropIndicatorProps) => {
  const getIndicatorStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#1976d2',
      borderRadius: '1px',
      pointerEvents: 'none' as const,
    }

    if (edge === 'top') {
      return {
        ...baseStyle,
        top: `-${gap}`,
      }
    }

    return {
      ...baseStyle,
      bottom: `-${gap}`,
    }
  }

  return <Box sx={getIndicatorStyle()} />
}

export default DropIndicator
