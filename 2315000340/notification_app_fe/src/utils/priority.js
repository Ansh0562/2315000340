/**
 * Priority scoring for notifications.
 * Placement > Result > Event
 * Recency also contributes to the score.
 */

const TYPE_WEIGHTS = {
  Placement: 300,
  Result: 200,
  Event: 100,
}

/**
 * Calculate a priority score for a single notification.
 * Higher score = higher priority.
 *
 * @param {object} notification
 * @returns {number}
 */
export function calculateScore(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 0
  const timestamp = new Date(notification.Timestamp).getTime()
  // Normalise recency: scale ms to a small float so type weight dominates
  const recencyScore = timestamp / 1e10
  return typeWeight + recencyScore
}

/**
 * Sort notifications by priority (descending).
 *
 * @param {Array} notifications
 * @returns {Array} sorted copy
 */
export function sortByPriority(notifications) {
  return [...notifications].sort((a, b) => calculateScore(b) - calculateScore(a))
}

/**
 * Return the top N unread notifications by priority.
 *
 * @param {Array}  notifications  - Full list
 * @param {Set}    readIds        - Set of read notification IDs
 * @param {number} n              - How many to return
 * @returns {Array}
 */
export function getTopPriorityUnread(notifications, readIds, n = 5) {
  const unread = notifications.filter((notif) => !readIds.has(notif.ID))
  return sortByPriority(unread).slice(0, n)
}

/**
 * Friendly label for a notification type.
 */
export function getPriorityLabel(type) {
  const labels = {
    Placement: 'High',
    Result: 'Medium',
    Event: 'Low',
  }
  return labels[type] || 'Low'
}

/**
 * MUI color for priority chip.
 */
export function getPriorityColor(type) {
  const colors = {
    Placement: 'error',
    Result: 'warning',
    Event: 'info',
  }
  return colors[type] || 'default'
}
