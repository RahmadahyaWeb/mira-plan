// Sign in by Username: the Email lookup stays on the server so it is never exposed to clients.
// Deployed with verify_jwt = false (caller is not signed in yet; the password is the check).
// shortcut: every sign-in reaches Auth from this function's IP, so Auth's per-IP token limit is shared by all users; add CAPTCHA if abused.
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const url = Deno.env.get('SUPABASE_URL')!
const opts = { auth: { persistSession: false, autoRefreshToken: false } }
const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, opts)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'method' }, 405)

  const { username, password } = await req.json().catch(() => ({}))
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) return json({ error: 'bad request' }, 400)

  // Usernames are stored lowercase (accounts check constraint).
  const { data: row } = await admin.from('accounts').select('email').eq('username', username.toLowerCase()).maybeSingle()
  if (!row) return json({ error: 'invalid' }, 401)

  const anon = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, opts)
  const { data, error } = await anon.auth.signInWithPassword({ email: row.email, password })
  if (error || !data.session) return json({ error: 'invalid' }, 401)

  const { access_token, refresh_token } = data.session
  return json({ access_token, refresh_token })
})
