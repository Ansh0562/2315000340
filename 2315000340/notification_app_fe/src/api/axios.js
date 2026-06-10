import axios from 'axios'
import { getToken } from '../auth/token.js'

// Defer logger import to break circular dependency:
// axios.js ← notifications.js ← logger.js ← axios.js
let _log = null
setTimeout(async () => {
  const mod = await import('../middleware/logger.js')
  _log = mod.Log
}, 0)

function safeLog(...args) {
  if (_log) _log(...args)
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://4.224.186.213/evaluation-service',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor ──────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    config.metadata = { startTime: Date.now() }
    safeLog('frontend', 'info', 'api', `API request started: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    safeLog('frontend', 'error', 'api', `Request setup error: ${error.message}`)
    return Promise.reject(error)
  }
)

// ── Response interceptor ─────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config.metadata?.startTime || Date.now())
    safeLog(
      'frontend', 'info', 'api',
      `API response success: ${response.config.method?.toUpperCase()} ${response.config.url} [${response.status}] ${duration}ms`
    )
    return response
  },
  (error) => {
    const duration = Date.now() - (error.config?.metadata?.startTime || Date.now())
    const status = error.response?.status
    const url = error.config?.url
    if (status === 401) {
      safeLog('frontend', 'warn', 'auth', `Unauthorized request to ${url} — check token`)
    } else {
      safeLog(
        'frontend', 'error', 'api',
        `API response failed: ${error.config?.method?.toUpperCase()} ${url} [${status || 'NETWORK_ERROR'}] ${duration}ms — ${error.message}`
      )
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
