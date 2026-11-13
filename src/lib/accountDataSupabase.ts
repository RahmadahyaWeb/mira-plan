import { supabase } from './supabase'
import type { AccountDataAdapter, State } from './accountData'
import type { Log } from './track'

const check = (r: { error: unknown }) => { if (r.error) throw r.error }

export const supabaseAdapter: AccountDataAdapter = {
  async load(id) {
    const [plans, logs] = await Promise.all([
      supabase.from('plans').select('profile, plan').eq('account_id', id).maybeSingle(),
      supabase.from('logs').select('day, done, water').eq('account_id', id),
    ])
    check(plans)
    check(logs)
    const log: Log = Object.fromEntries((logs.data ?? []).map((r) => [r.day, { done: r.done, water: r.water }]))
    return { profile: plans.data?.profile ?? null, plan: plans.data?.plan ?? null, log } satisfies State
  },
  async savePlan(id, profile, plan) {
    check(await supabase.from('plans').upsert({ account_id: id, profile, plan, updated_at: new Date().toISOString() }))
  },
  async saveLog(id, upsert, remove) {
    const rows = Object.entries(upsert).map(([day, d]) => ({ account_id: id, day, done: d.done, water: d.water }))
    if (rows.length) check(await supabase.from('logs').upsert(rows))
    if (remove.length) check(await supabase.from('logs').delete().eq('account_id', id).in('day', remove))
  },
}
