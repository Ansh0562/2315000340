import React, { useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
  Paper,
  Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getPriorityColor, getPriorityLabel } from '../utils/priority.js'
import { formatDate } from '../utils/formatDate.js'
import { useNotificationContext } from '../context/NotificationContext.jsx'
import Log from '../middleware/logger.js'

export default function NotificationDetails() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { markAsRead, isRead, showSnackbar } = useNotificationContext()

  const notification = state?.notification

  useEffect(() => {
    Log('frontend', 'info', 'page', `Notification Details loaded: ${id}`)
  }, [id])

  const handleMarkRead = () => {
    markAsRead(notification.ID)
    showSnackbar('Notification marked as read', 'success')
    Log('frontend', 'info', 'page', `User marked notification as read: ${notification.ID}`)
  }

  if (!notification) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Alert severity="warning">
          Notification not found. Please go back and try again.
        </Alert>
      </Box>
    )
  }

  const read = isRead(notification.ID)

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: 'none' }}
        color="inherit"
      >
        Back
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: read ? 'divider' : 'primary.light',
          bgcolor: read ? 'background.paper' : 'primary.50',
        }}
      >
        {/* Type & Priority */}
        <Stack direction="row" gap={1} flexWrap="wrap" mb={2.5}>
          <Chip
            label={notification.Type}
            color={getPriorityColor(notification.Type)}
            size="medium"
            sx={{ fontWeight: 700, fontSize: '0.8rem' }}
          />
          <Chip
            label={`${getPriorityLabel(notification.Type)} Priority`}
            color={getPriorityColor(notification.Type)}
            variant="outlined"
            size="medium"
            sx={{ fontSize: '0.75rem' }}
          />
          {read && (
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
              label="Read"
              size="medium"
              variant="outlined"
              color="success"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Stack>

        {/* Message */}
        <Typography variant="h5" fontWeight={700} lineHeight={1.35} mb={2}>
          {notification.Message}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Metadata */}
        <Stack spacing={1}>
          <Stack direction="row" gap={1}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
              ID
            </Typography>
            <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
              {notification.ID}
            </Typography>
          </Stack>
          <Stack direction="row" gap={1}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
              Date & Time
            </Typography>
            <Typography variant="body2">
              {formatDate(notification.Timestamp)}
            </Typography>
          </Stack>
          <Stack direction="row" gap={1}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
              Category
            </Typography>
            <Typography variant="body2">{notification.Type}</Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        {!read && (
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={handleMarkRead}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Mark as Read
          </Button>
        )}
        {read && (
          <Typography variant="body2" color="success.main" fontWeight={500}>
            ✓ You've read this notification
          </Typography>
        )}
      </Paper>
    </Box>
  )
}
