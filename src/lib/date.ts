// Local calendar dates only: toISOString() is UTC and gives the wrong day east or west of UTC.
export const dateKey = (d: Date = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** local noon of a key, so DST shifts never move it to another day */
export const fromKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}

export const addDays = (key: string, n: number) => {
  const d = fromKey(key)
  d.setDate(d.getDate() + n)
  return dateKey(d)
}

export const daysBetween = (from: string, to: string) => Math.round((fromKey(to).getTime() - fromKey(from).getTime()) / 86_400_000)

/** which of the 7 plan days a calendar day falls on */
export const planDayIndex = (startKey: string, key: string) => ((daysBetween(startKey, key) % 7) + 7) % 7

export const prettyDay = (key: string, opts: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' }) =>
  fromKey(key).toLocaleDateString('en-US', opts)
