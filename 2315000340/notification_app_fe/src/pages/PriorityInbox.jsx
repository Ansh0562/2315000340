import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  Slider,
  Stack,
  Divider,
  Alert,
  Chip,
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import useNotifications from '../hooks/useNotifications.js'
import NotificationList from '../components/NotificationList.jsx'
import Loading from '../components/Loading.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { getTopPriorityUnread } from '../utils/priority.js'
import { useNotificationContext } from '../context/NotificationContext.jsx'
import Log from '../middleware/logger.js'

export default function PriorityInbox() {
  const [topN, setTopN] = useState(5)
  const { readIds } = useNotificationContext()

  // Fetch a larger batch so priority sorting is meaningful
  const { notifications, loading, error, refetch } = useNotifications({
    page: 1,
    limit: 50,
  })

  useEffect(() => {
    Log('frontend', 'info', 'page', 'Priority Inbox loaded')
  }, [])

  const prioritized = useMemo(() => {
    const result = getTopPriorityUnread(notifications, readIds, topN)
    Log('frontend', 'debug', 'page', `Priority inbox: showing top ${result.length} unread notifications`)
    return result
  }, [notifications, readIds, topN])

  const handleTopNChange = (_, value) => {
    setTopN(value)
    Log('frontend', 'info', 'page', `Top N changed to: ${value}`)
  }

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" gap={1.5} mb={1}>
        <StarIcon sx={{ color: 'warning.main', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={700} letterSpacing="-0.3px">
            Priority Inbox
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unread notifications, ranked by importance and recency
          </Typography>
        </Box>
      </Stack>

      {/* Priority legend */}
      <Stack direction="row" gap={1} mt={1.5} flexWrap="wrap">
        <Chip label="Placement — High" color="error" size="small" variant="outlined" />
        <Chip label="Result — Medium" color="warning" size="small" variant="outlined" />
        <Chip label="Event — Low" color="info" size="small" variant="outlined" />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Top-N selector */}
      <Box sx={{ maxWidth: 340, mb: 3 }}>
        <Typography variant="body2" fontWeight={500} gutterBottom>
          Show top {topN} unread notifications
        </Typography>
        <Slider
          value={topN}
          onChange={handleTopNChange}
          min={1}
          max={20}
          step={1}
          marks={[
            { value: 1, label: '1' },
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 20, label: '20' },
          ]}
          valueLabelDisplay="auto"
          color="primary"
        />
      </Box>

      {/* Content */}
      {loading ? (
        <Loading count={topN} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : prioritized.length === 0 ? (
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          You're all caught up! No unread notifications.
        </Alert>
      ) : (
        <>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            {prioritized.length} unread notification{prioritized.length !== 1 ? 's' : ''} — sorted by priority
          </Typography>
          <NotificationList notifications={prioritized} />
        </>
      )}
    </Box>
  )
}
