import React from 'react'
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import Log from '../middleware/logger.js'

const TYPES = ['All', 'Placement', 'Result', 'Event']

export default function FilterBar({ value, onChange }) {
  const handleChange = (_, newValue) => {
    if (!newValue) return // prevent deselection
    Log('frontend', 'info', 'component', `Filter changed to: ${newValue}`)
    onChange(newValue)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
        py: 1.5,
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        Filter:
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size="small"
        aria-label="notification type filter"
      >
        {TYPES.map((type) => (
          <ToggleButton
            key={type}
            value={type}
            sx={{
              px: 2,
              borderRadius: '20px !important',
              border: '1px solid',
              borderColor: 'divider',
              mx: 0.25,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.8rem',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}
