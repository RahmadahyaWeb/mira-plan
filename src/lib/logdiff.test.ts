import { describe, expect, it } from 'vitest'
import { diffLog } from './track'

const d = (done: string[], water = 0) => ({ done, water })

describe('diffLog', () => {
  it('is empty when nothing changed', () => {
    const log = { '2026-01-01': d(['meal-0']) }
    expect(diffLog(log, { ...log })).toEqual({ upsert: [], remove: [] })
  })
  it('upserts an added day', () => {
    expect(diffLog({}, { '2026-01-01': d([], 2) })).toEqual({ upsert: ['2026-01-01'], remove: [] })
  })
  it('upserts a changed day only', () => {
    const prev = { '2026-01-01': d(['meal-0']), '2026-01-02': d([], 1) }
    const next = { '2026-01-01': d(['meal-0', 'meal-1']), '2026-01-02': d([], 1) }
    expect(diffLog(prev, next)).toEqual({ upsert: ['2026-01-01'], remove: [] })
  })
  it('removes a deleted day', () => {
    expect(diffLog({ '2026-01-01': d(['meal-0']) }, {})).toEqual({ upsert: [], remove: ['2026-01-01'] })
  })
  it('new Plan clearing today onward removes those days and keeps the past', () => {
    const prev = { '2026-01-01': d(['meal-0']), '2026-01-05': d([], 3), '2026-01-06': d(['move-0']) }
    const next = Object.fromEntries(Object.entries(prev).filter(([k]) => k < '2026-01-05'))
    expect(diffLog(prev, next)).toEqual({ upsert: [], remove: ['2026-01-05', '2026-01-06'] })
  })
})
