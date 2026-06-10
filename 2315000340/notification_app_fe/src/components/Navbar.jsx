import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
  Badge,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import StarIcon from '@mui/icons-material/Star'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate, useLocation } from 'react-router-dom'
import Log from '../middleware/logger.js'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Priority Inbox', path: '/priority', icon: <StarIcon /> },
]

function NavLinks({ onClick }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleNav = (path) => {
    Log('frontend', 'info', 'component', `Nav clicked: ${path}`)
    navigate(path)
    onClick?.()
  }

  return (
    <List disablePadding>
      {NAV_ITEMS.map(({ label, path, icon }) => (
        <ListItem key={path} disablePadding>
          <ListItemButton
            selected={pathname === path}
            onClick={() => handleNav(path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': { color: 'inherit' },
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
            <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  React.useEffect(() => {
    Log('frontend', 'debug', 'component', 'Navbar rendered')
  }, [])

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              aria-label="open navigation"
            >
              <MenuIcon />
            </IconButton>
          )}

          <NotificationsIcon sx={{ color: 'primary.main' }} />
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ flexGrow: 1, letterSpacing: '-0.3px' }}
          >
            Campus Notifications
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {NAV_ITEMS.map(({ label, path, icon }) => (
                <NavButton key={path} label={label} path={path} icon={icon} />
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Campus Notifications
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 1 }}>
          <NavLinks onClick={() => setDrawerOpen(false)} />
        </Box>
      </Drawer>
    </>
  )
}

function NavButton({ label, path, icon }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active = pathname === path

  return (
    <Box
      component="button"
      onClick={() => {
        Log('frontend', 'info', 'component', `Nav clicked: ${path}`)
        navigate(path)
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 2,
        py: 0.75,
        borderRadius: 2,
        border: 'none',
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: '0.875rem',
        fontFamily: 'inherit',
        transition: 'background 0.15s',
        bgcolor: active ? 'primary.main' : 'transparent',
        color: active ? 'primary.contrastText' : 'text.primary',
        '&:hover': {
          bgcolor: active ? 'primary.dark' : 'action.hover',
        },
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 18 } })}
      {label}
    </Box>
  )
}
