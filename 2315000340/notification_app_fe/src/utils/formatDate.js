/**
 * Format a notification timestamp to a readable string.
 *
 * @param {string} timestamp - e.g. "2026-04-22 17:50:30"
 * @returns {string}
 */
export function formatDate(timestamp) {
  if (!timestamp) return '—'
  const date = new Date(timestamp.replace(' ', 'T'))
  if (isNaN(date.getTime())) return timestamp
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Return a relative time string (e.g. "2 hours ago").
 *
 * @param {string} timestamp
 * @returns {string}
 */
export function timeAgo(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp.replace(' ', 'T'))
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays}d ago`
  return formatDate(timestamp)
}
