import {
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from '@mui/material'
import { ChevronDown, SquarePen, Ellipsis, Trash2, Copy } from 'lucide-react'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState } from 'react'
import { RoadmapVisibility } from '../../types/roadmap/roadmap.enums'
import { useRoadmapStore } from '../../store/useRoadmapStore'

type TopbarProps = {
  title: string
  description?: string
  visibility: RoadmapVisibility
  onEditMetaClick: () => void
  onClickSharing: () => void
  onBackClick: () => void
}

const Topbar = ({ title, description = '', visibility, onEditMetaClick, onClickSharing, onBackClick }: TopbarProps) => {
  const {
    updateRoadmap,
    selectedRoadmap
  } = useRoadmapStore()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const onSaveRoadmap = async () => {
    if (!selectedRoadmap) return
  
    await updateRoadmap(selectedRoadmap.roadmapId)
  }

  const getVisibilityLabelAndIcon = (visibility: RoadmapVisibility) => {
    switch (visibility) {
      case RoadmapVisibility.Private:
        return {
          icon: <LockIcon fontSize="small" />,
          label: 'Only visible to me',
        }
      case RoadmapVisibility.Public:
        return {
          icon: <PublicIcon fontSize="small" />,
          label: 'Anyone can view',
        }
      case RoadmapVisibility.Unlisted:
        return {
          icon: <PublicIcon fontSize="small" />,
          label: 'Unlisted access',
        }
      default:
        return {
          icon: <PublicIcon fontSize="small" />,
          label: 'Anyone can view',
        }
    }
  }

  const { icon, label } = getVisibilityLabelAndIcon(visibility)

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        paddingLeft: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #ddd",
        zIndex: 100,
      }}
    >
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Box display="flex" alignItems="center" gap={1} paddingTop={1}>
          <IconButton onClick={onBackClick}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            {title || 'Untitled Roadmap'}
          </Typography>

          <IconButton size="small" onClick={onEditMetaClick}>
            <SquarePen size={16} strokeWidth={1.5} />
          </IconButton>

          <IconButton size="small" onClick={handleMenuOpen}>
            <Ellipsis size={16} strokeWidth={1.5} />
          </IconButton>

          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.05), 0px 8px 20px rgba(0,0,0,0.08)',
                  overflow: "visible",
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 0.5,
                    gap: 1,
                    fontSize: 14,
                    color: "#2D2D2D",
                  },
                },
              },
            }}
          >
            <MenuItem>
              <Copy size={16} strokeWidth={1.5} />
              Duplicate
            </MenuItem>
            <MenuItem 
              sx={{ 
                color: "#E53935",
                "& svg": {
                color: "#E53935",
                },
                "&:hover": {
                  backgroundColor: "#fceaea",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Trash2 size={16} strokeWidth={1.5} />
                <Typography 
                  sx={{
                   color: "#E53935", 
                   fontSize: 14
                  }}
                >
                  Delete
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            maxWidth: 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            paddingBottom: 1,
          }}
        >
          {description || 'No description has been added yet.'}
        </Typography>
      </Box>

      <Box 
        display="flex" 
        alignItems="center" 
        height="100%"
      >
        <Button
          variant="text"
          onClick={onClickSharing}
          startIcon={icon}
          endIcon={<ChevronDown size={16} strokeWidth={1.5} />}
          sx={{
            height: "100%",
            fontWeight: 400,
            px: 2,
            borderRadius: 0,
            color: "text.primary",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          {label}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
          sx={{
            height: "100%",
            borderRadius: 0,
            fontWeight: 600 ,
            px: 2,
          }}
          onClick={onSaveRoadmap}
        >
          Save Roadmap
        </Button>
      </Box>
    </Box>
  )
}

export default Topbar