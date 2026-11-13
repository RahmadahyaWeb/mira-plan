import { describe, expect, it } from 'vitest'
import { createAccountData, noCustom, type State } from './accountData'
import { createMemoryAdapter } from './accountDataMemory'

const d = (done: string[], water = 0) => ({ done, water })
const tick = () => new Promise((r) => setTimeout(r, 0))
const settle = async () => { for (let i = 0; i < 5; i++) await tick() }

async function open(seed?: State) {
  const mem = createMemoryAdapter(seed)
  const data = createAccountData(mem.adapter)
  data.setAccount('a')
  await settle()
  return { ...mem, data }
}

describe('loading', () => {
  it('is loading with empty state until the load finishes, then hands out the data', async () => {
    const mem = createMemoryAdapter({ profile: null, plan: null, custom: noCustom, log: { '2026-01-01': d(['meal-0']) } })
    const data = createAccountData(mem.adapter)
    data.setAccount('a')
    expect(data.getSnapshot()).toMatchObject({ loading: true, state: { log: {} } })
    await settle()
    expect(data.getSnapshot()).toMatchObject({ loading: false, error: null, state: { log: { '2026-01-01': d(['meal-0']) } } })
  })
  it('signing out clears the state', async () => {
    const { data } = await open({ profile: null, plan: null, custom: noCustom, log: { '2026-01-01': d([]) } })
    data.setAccount(undefined)
    expect(data.getSnapshot()).toMatchObject({ loading: false, state: { log: {} } })
  })
  it('a failed load shows an error and never saves afterwards', async () => {
    const mem = createMemoryAdapter()
    mem.ctl.failLoad = true
    const data = createAccountData(mem.adapter)
    data.setAccount('a')
    await settle()
    expect(data.getSnapshot().error).toMatch(/Could not load/)
    data.update((s) => ({ ...s, log: { '2026-01-01': d([], 1) } }))
    await settle()
    expect(mem.calls).toEqual(['load'])
    expect(data.getSnapshot().state.log).toEqual({ '2026-01-01': d([], 1) }) // still on screen
  })
})

describe('saving the Log', () => {
  it('writes nothing when nothing changed', async () => {
    const { data, calls } = await open({ profile: null, plan: null, custom: noCustom, log: { '2026-01-01': d(['meal-0']) } })
    data.update((s) => ({ ...s, log: { ...s.log } }))
    await settle()
    expect(calls).toEqual(['load'])
  })
  it('upserts an added day', async () => {
    const { data, calls } = await open()
    data.update((s) => ({ ...s, log: { '2026-01-01': d([], 2) } }))
    await settle()
    expect(calls).toEqual(['load', 'saveLog +2026-01-01 -'])
  })
  it('upserts a changed day only', async () => {
    const { data, calls } = await open({ profile: null, plan: null, custom: noCustom, log: { '2026-01-01': d(['meal-0']), '2026-01-02': d([], 1) } })
    data.update((s) => ({ ...s, log: { ...s.log, '2026-01-01': d(['meal-0', 'meal-1']) } }))
    await settle()
    expect(calls).toEqual(['load', 'saveLog +2026-01-01 -'])
  })
  it('removes a deleted day', async () => {
    const { data, calls } = await open({ profile: null, plan: null, custom: noCustom, log: { '2026-01-01': d(['meal-0']) } })
    data.update((s) => ({ ...s, log: {} }))
    await settle()
    expect(calls).toEqual(['load', 'saveLog + -2026-01-01'])
  })
  it('a new Plan clearing today onward removes those days and keeps the past', async () => {
    const log = { '2026-01-01': d(['meal-0']), '2026-01-05': d([], 3), '2026-01-06': d(['move-0']) }
    const { data, store } = await open({ profile: null, plan: null, custom: noCustom, log })
    data.update((s) => ({ ...s, log: { '2026-01-01': s.log['2026-01-01'] } }))
    await settle()
    expect(Object.keys(store.log)).toEqual(['2026-01-01'])
  })
})

describe('save failures and ordering', () => {
  it('shows an error after a failed save, keeps the data, and clears it on the next good save', async () => {
    const { data, ctl } = await open()
    ctl.failSave = true
    data.update((s) => ({ ...s, log: { '2026-01-01': d([], 1) } }))
    await settle()
    expect(data.getSnapshot().error).toMatch(/Could not save/)
    expect(data.getSnapshot().state.log).toEqual({ '2026-01-01': d([], 1) })
    ctl.failSave = false
    data.update((s) => ({ ...s, log: { '2026-01-01': d([], 2) } }))
    await settle()
    expect(data.getSnapshot().error).toBeNull()
  })
  it('saves run one at a time, so the last change wins', async () => {
    const { data, ctl, store, calls } = await open()
    let release!: () => void
    ctl.hold = new Promise((r) => { release = r })
    data.update((s) => ({ ...s, log: { '2026-01-01': d([], 1) } }))
    data.update((s) => ({ ...s, log: { '2026-01-01': d([], 2) } }))
    await settle()
    expect(calls).toEqual(['load', 'saveLog +2026-01-01 -']) // second waits behind the first
    ctl.hold = null
    release()
    await settle()
    expect(calls).toHaveLength(3)
    expect(store.log['2026-01-01'].water).toBe(2)
  })
  it('ignores a save result that lands after switching Account', async () => {
    const { data, ctl } = await open()
    let release!: () => void
    ctl.hold = new Promise((r) => { release = r })
    ctl.failSave = true
    data.update((s) => ({ ...s, log: { '2026-01-01': d([], 1) } }))
    data.setAccount('b')
    await settle()
    ctl.hold = null
    release()
    await settle()
    expect(data.getSnapshot()).toMatchObject({ accountId: 'b', error: null })
  })
})

describe('Custom Meals and Moves', () => {
  const meal = { id: 'c-1', name: 'Nasi Uduk', slot: 'breakfast' as const, emoji: '🍚', kcal: 450, protein: 10, carbs: 70, fat: 14, diet: 'vegan' as const, minutes: 0, ingredients: [], steps: [] }
  it('loads with the rest of Account data', async () => {
    const { data } = await open({ profile: null, plan: null, log: {}, custom: { meals: [meal], moves: [] } })
    expect(data.getSnapshot().state.custom.meals).toEqual([meal])
  })
  it('a Custom change saves the Custom part only', async () => {
    const { data, calls, store } = await open()
    data.update((s) => ({ ...s, custom: { ...s.custom, meals: [meal] } }))
    await settle()
    expect(calls).toEqual(['load', 'saveCustom'])
    expect(store.custom.meals).toEqual([meal])
  })
  it('a failed load never saves Custom items', async () => {
    const mem = createMemoryAdapter()
    mem.ctl.failLoad = true
    const data = createAccountData(mem.adapter)
    data.setAccount('a')
    await settle()
    data.update((s) => ({ ...s, custom: { ...s.custom, meals: [meal] } }))
    await settle()
    expect(mem.calls).toEqual(['load'])
  })
})
