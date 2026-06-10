import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const PriorityInbox = lazy(() => import('./pages/PriorityInbox.jsx'))
const NotificationDetails = lazy(() => import('./pages/NotificationDetails.jsx'))

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  )
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/priority" element={<PriorityInbox />} />
        <Route path="/notifications/:id" element={<NotificationDetails />} />
      </Routes>
    </Suspense>
  )
}
