import type { AccountDataAdapter, State } from './accountData'
import type { DayLog } from './track'

/** Second adapter at the seam: in memory, with switches to make calls fail or wait. */
export function createMemoryAdapter(seed: State = { profile: null, plan: null, log: {} }) {
  const store = { ...seed, log: { ...seed.log } }
  const calls: string[] = []
  const ctl = { failLoad: false, failSave: false, hold: null as Promise<void> | null }
  const saved = async (name: string) => {
    calls.push(name)
    await ctl.hold
    if (ctl.failSave) throw new Error('save failed')
  }
  const adapter: AccountDataAdapter = {
    async load() {
      calls.push('load')
      if (ctl.failLoad) throw new Error('load failed')
      return { ...store, log: { ...store.log } }
    },
    async savePlan(_id, profile, plan) {
      await saved('savePlan')
      store.profile = profile
      store.plan = plan
    },
    async saveLog(_id, upsert: Record<string, DayLog>, remove) {
      await saved(`saveLog +${Object.keys(upsert).join(',')} -${remove.join(',')}`)
      Object.assign(store.log, upsert)
      remove.forEach((d) => delete store.log[d])
    },
  }
  return { adapter, store, calls, ctl }
}
