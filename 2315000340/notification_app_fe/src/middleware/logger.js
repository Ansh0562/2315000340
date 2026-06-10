import axiosInstance from '../api/axios.js'

const ALLOWED_STACKS = ['frontend']
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal']
const ALLOWED_PACKAGES = [
  'api', 'component', 'hook', 'page', 'state', 'style',
  'auth', 'config', 'middleware', 'utils',
]

/**
 * Central logging function — sends logs to the backend /logs endpoint.
 *
 * @param {string} stack     - Must be 'frontend'
 * @param {string} level     - One of: debug | info | warn | error | fatal
 * @param {string} packageName - One of the allowed package names
 * @param {string} message   - Human-readable log message
 */
export async function Log(stack, level, packageName, message) {
  if (!ALLOWED_STACKS.includes(stack)) return
  if (!ALLOWED_LEVELS.includes(level)) return
  if (!ALLOWED_PACKAGES.includes(packageName)) return

  const payload = {
    stack,
    level,
    package: packageName,
    message,
  }

  try {
    await axiosInstance.post('/logs', payload)
  } catch {
    // Silently fail — logging must never break the app
  }
}

export default Log
