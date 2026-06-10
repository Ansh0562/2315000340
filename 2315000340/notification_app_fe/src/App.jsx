import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { Box, Snackbar, Alert, Container } from '@mui/material'
import Navbar from './components/Navbar.jsx'
import AppRoutes from './routes.jsx'
import { NotificationProvider, useNotificationContext } from './context/NotificationContext.jsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#DBEAFE',
      dark: '#1D4ED8',
      contrastText: '#ffffff',
      50: '#EFF6FF',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    divider: '#E2E8F0',
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    error: { main: '#DC2626' },
    warning: { main: '#D97706' },
    success: { main: '#16A34A' },
    info: { main: '#0284C7' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
  },
})

function GlobalSnackbar() {
  const { snackbar, closeSnackbar } = useNotificationContext()
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3500}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%', borderRadius: 2 }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NotificationProvider>
          <Box
            sx={{
              minHeight: '100vh',
              bgcolor: 'background.default',
            }}
          >
            <Navbar />
            {/* Offset content below fixed AppBar */}
            <Box component="main" sx={{ pt: { xs: 8, sm: 9 } }}>
              <Container maxWidth="md" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
                <AppRoutes />
              </Container>
            </Box>
          </Box>
          <GlobalSnackbar />
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
