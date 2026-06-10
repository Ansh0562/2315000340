/**
 * logging_middleware/index.js
 *
 * Reusable logging middleware — can be imported into any part of the project.
 * Sends structured log entries to the backend /logs endpoint.
 *
 * Usage:
 *   import { Log } from '../logging_middleware/index.js'
 *   Log("frontend", "info", "component", "Navbar rendered")
 */

const BASE_URL = process.env.VITE_BASE_URL || 'http://4.224.186.213/evaluation-service'
const TOKEN = process.env.VITE_TOKEN || ''

const ALLOWED_STACKS = ['frontend']
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal']
const ALLOWED_PACKAGES = [
  'api', 'component', 'hook', 'page', 'state', 'style',
  'auth', 'config', 'middleware', 'utils',
]

/**
 * @param {string} stack
 * @param {string} level
 * @param {string} packageName
 * @param {string} message
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
    await fetch(`${BASE_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    })
  } catch {
    // Never crash the app due to a logging failure
  }
}

export default Log
