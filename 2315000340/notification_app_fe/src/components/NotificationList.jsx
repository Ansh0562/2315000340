import React, { memo } from 'react'
import { Box, Typography } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import NotificationCard from './NotificationCard.jsx'
import { useNotificationContext } from '../context/NotificationContext.jsx'

function EmptyState({ message = 'No notifications found.' }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        color: 'text.secondary',
      }}
    >
      <InboxIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
      <Typography variant="body1">{message}</Typography>
    </Box>
  )
}

function NotificationList({ notifications, emptyMessage }) {
  const { isRead } = useNotificationContext()

  if (!notifications || notifications.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <Box>
      {notifications.map((notif) => (
        <NotificationCard key={notif.ID} notification={notif} isRead={isRead(notif.ID)} />
      ))}
    </Box>
  )
}

export default memo(NotificationList)
