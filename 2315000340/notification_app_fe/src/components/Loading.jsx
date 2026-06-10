import React from 'react'
import { Box, Skeleton, Stack } from '@mui/material'

function NotificationSkeleton() {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        mb: 1.5,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Skeleton variant="rounded" width={80} height={22} />
        <Skeleton variant="text" width={90} sx={{ fontSize: '0.75rem' }} />
      </Stack>
      <Skeleton variant="text" sx={{ mt: 1, fontSize: '1rem' }} width="90%" />
      <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="60%" />
    </Box>
  )
}

export default function Loading({ count = 5 }) {
  return (
    <Box>
      {Array.from({ length: count }).map((_, i) => (
        <NotificationSkeleton key={i} />
      ))}
    </Box>
  )
}
