import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'

const UserMenu = () => {
  const { t } = useTranslation('common')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    // your logout logic here
    console.log('Signing out...')
  }

  return (
    <Box>
      <IconButton onClick={handleClick} size="small" sx={{ p: 0 }}>
        <Avatar 
          alt={t('userMenu.userAvatar')} 
          src="/profile.jpg" 
          sx={
            { 
              width: 40, 
              height: 40 
            }
          } 
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 2,
            sx: {
              ml: 6,
              minWidth: 180,
              borderRadius: 2,
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              '& .MuiMenuItem-root': {
                fontSize: 14,
              },
            },
          }
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            {t('userMenu.settings')}
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            {t('userMenu.signOut')}
          </MenuItem>
      </Menu>
    </Box>
  )
}

export default UserMenu
