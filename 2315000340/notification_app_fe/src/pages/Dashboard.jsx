import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Pagination,
  Stack,
  Button,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import RefreshIcon from '@mui/icons-material/Refresh'
import useNotifications from '../hooks/useNotifications.js'
import NotificationList from '../components/NotificationList.jsx'
import FilterBar from '../components/FilterBar.jsx'
import Loading from '../components/Loading.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { useNotificationContext } from '../context/NotificationContext.jsx'
import Log from '../middleware/logger.js'

const PAGE_SIZE = 10

export default function Dashboard() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('All')
  const { markAllAsRead, showSnackbar } = useNotificationContext()

  const { notifications, loading, error, total, refetch } = useNotifications({
    page,
    limit: PAGE_SIZE,
    notification_type: filter,
  })

  useEffect(() => {
    Log('frontend', 'info', 'page', 'Dashboard loaded')
  }, [])

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter)
    setPage(1)
    Log('frontend', 'info', 'page', `Dashboard filter changed: ${newFilter}`)
  }, [])

  const handleMarkAllRead = () => {
    markAllAsRead(notifications.map((n) => n.ID))
    showSnackbar('All visible notifications marked as read', 'success')
    Log('frontend', 'info', 'page', 'User marked all visible notifications as read')
  }

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1} mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700} letterSpacing="-0.3px">
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stay up to date with campus updates
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" gap={1}>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={refetch} disabled={loading}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllRead}
            disabled={notifications.length === 0}
            variant="outlined"
          >
            Mark all read
          </Button>
        </Stack>
      </Stack>

      <FilterBar value={filter} onChange={handleFilterChange} />
      <Divider sx={{ mb: 2 }} />

      {/* Content */}
      {loading ? (
        <Loading count={PAGE_SIZE} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <>
          {total > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} notifications
            </Typography>
          )}

          <NotificationList
            notifications={notifications}
            emptyMessage="No notifications match the selected filter."
          />

          {totalPages > 1 && (
            <Stack alignItems="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => {
                  setPage(p)
                  Log('frontend', 'info', 'page', `Dashboard page changed: ${p}`)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                color="primary"
                shape="rounded"
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  )
}
