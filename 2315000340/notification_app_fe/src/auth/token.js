/**
 * Returns the Bearer token from environment variables.
 */
export function getToken() {
  return import.meta.env.VITE_TOKEN || ''
}

export function getAuthHeader() {
  return { Authorization: `Bearer ${getToken()}` }
}
