export const normalizeUsername = (s: string) => s.trim().toLowerCase()

/** Returns an error message, or null when valid. */
export function validateUsername(s: string): string | null {
  const u = normalizeUsername(s)
  if (u.length < 3 || u.length > 20) return 'Username must be 3 to 20 characters.'
  if (!/^[a-z0-9_]+$/.test(u)) return 'Use only letters, digits and underscore.'
  return null
}
