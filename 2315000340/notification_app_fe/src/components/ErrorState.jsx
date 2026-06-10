import React from 'react'
import { Box, Alert, AlertTitle, Button } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

export default function ErrorState({ message, onRetry }) {
  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Retry
            </Button>
          )
        }
      >
        <AlertTitle>Something went wrong</AlertTitle>
        {message || 'An unexpected error occurred. Please try again.'}
      </Alert>
    </Box>
  )
}
