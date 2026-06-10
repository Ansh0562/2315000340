import React, { memo } from 'react'
import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { useNavigate } from 'react-router-dom'
import { getPriorityColor, getPriorityLabel } from '../utils/priority.js'
import { timeAgo } from '../utils/formatDate.js'
import Log from '../middleware/logger.js'

function NotificationCard({ notification, isRead }) {
  const navigate = useNavigate()

  const handleClick = () => {
    Log('frontend', 'info', 'component', `Notification card clicked: ${notification.ID}`)
    navigate(`/notifications/${notification.ID}`, { state: { notification } })
  }

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        border: '1px solid',
        borderColor: isRead ? 'divider' : 'primary.light',
        borderRadius: 2,
        bgcolor: isRead ? 'background.paper' : 'primary.50',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        '&:hover': {
          boxShadow: 3,
          borderColor: 'primary.main',
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ p: 0 }}>
        <CardContent sx={{ p: '14px 16px !important' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Chip
                label={notification.Type}
                size="small"
                color={getPriorityColor(notification.Type)}
                variant="filled"
                sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }}
              />
              <Chip
                label={getPriorityLabel(notification.Type)}
                size="small"
                variant="outlined"
                color={getPriorityColor(notification.Type)}
                sx={{ fontSize: '0.65rem', height: 20 }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              {!isRead && (
                <FiberManualRecordIcon
                  sx={{ fontSize: 10, color: 'primary.main' }}
                />
              )}
              <Typography variant="caption" color="text.secondary" noWrap>
                {timeAgo(notification.Timestamp)}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="body1"
            sx={{
              mt: 1,
              fontWeight: isRead ? 400 : 600,
              color: 'text.primary',
              lineHeight: 1.4,
            }}
          >
            {notification.Message}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default memo(NotificationCard)
