import axiosInstance from './axios.js'
import Log from '../middleware/logger.js'

/**
 * Fetch paginated notifications from the API.
 *
 * @param {object} params - { page, limit, notification_type }
 * @returns {Promise<{ notifications: Array, total: number }>}
 */
export async function fetchNotifications({ page = 1, limit = 10, notification_type } = {}) {
  const params = { page, limit }
  if (notification_type && notification_type !== 'All') {
    params.notification_type = notification_type
  }

  try {
    const response = await axiosInstance.get('/notifications', { params })
    Log('frontend', 'info', 'api', `Notifications fetched: page=${page}, limit=${limit}, type=${notification_type || 'All'}`)
    return response.data
  } catch (error) {
    Log('frontend', 'error', 'api', `Failed to fetch notifications: ${error.message}`)
    throw error
  }
}

/**
 * Post a log entry to the server.
 *
 * @param {object} payload - { stack, level, package, message }
 */
export async function postLog(payload) {
  return axiosInstance.post('/logs', payload)
}
