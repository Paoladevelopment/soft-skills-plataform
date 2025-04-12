import { NavLink } from 'react-router-dom'
import { IconButton, Tooltip } from '@mui/material'
import { ReactElement } from 'react'

type SidebarIconProps = {
  icon: ReactElement
  label: string
  to: string
}

const SidebarIcon = ({ icon, label, to }: SidebarIconProps) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Tooltip title={label}>
          <IconButton color={isActive ? 'secondary' : 'default'}>
            {icon}
          </IconButton>
        </Tooltip>
      )}
    </NavLink>
  )
}

export default SidebarIcon
