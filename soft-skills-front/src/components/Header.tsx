import {
	AppBar,
	Avatar,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined'
import Logout from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../features/authentication/store/useAuthStore'
import LanguageSelector from './LanguageSelector'
import React from 'react'
  
const Header = () => {
    const { t } = useTranslation('common')
    const navigate = useNavigate()
    const logout = useAuthStore(state => state.logout)
    const user = useAuthStore(state => state.user)
  
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
	const open = Boolean(anchorElUser)
  
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget)
    };
  
    const handleCloseUserMenu = () => {
    	setAnchorElUser(null)
    };
  
    const handleLogout = () => {
		logout()
		handleCloseUserMenu()
		navigate('/login')
    };
  
    return (
		<AppBar
			position="static"
			elevation={1}
			sx={{
				backgroundColor: '#2E82D6',
			}}
		>
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Box
					sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					onClick={() => navigate('/')}
				>
				<PsychologyOutlinedIcon sx={{ fontSize: 40, mr: 1, color: 'common.white' }} />
				<Typography
					variant="h5"
					fontWeight="bold"
					color="common.white"
					sx={{ letterSpacing: '0.1em' }}
				>
					Soft Skills
				</Typography>
				</Box>

				<Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2 
          }}
        >
					<LanguageSelector />
					<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
						<Avatar 
							alt={user?.name || 'user'} 
							src={user?.profilePicture} 
						/>
					</IconButton>
					<Menu
						sx={{ mt: '45px' }}
						anchorEl={anchorElUser}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={open}
						onClose={handleCloseUserMenu}
						slotProps={{
							paper: {
								elevation: 4,
								sx: {
									mt: 1,
									minWidth: 160,
									borderRadius: 2,
									boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px;',
								},
							},
						}}
					>
						<MenuItem onClick={handleLogout}>
							<Logout fontSize="small" sx={{ mr: 1 }} />
							<Typography textAlign="center">{t('actions.signOut')}</Typography>
						</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
    );
};
  
export default Header;
  

