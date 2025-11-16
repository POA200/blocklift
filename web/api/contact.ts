import { sql } from '@vercel/postgres'

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  let body: any
  try {
    body = req.body && typeof req.body === 'object' ? req.body : (req.body ? JSON.parse(req.body as any) : null)
  } catch (_) {
    return res.status(400).json({ error: 'invalid_json' })
  }

  const name = String(body?.name || '').trim()
  const email = String(body?.email || '').trim()
  const message = String(body?.message || '').trim()

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'missing_fields', message: 'name, email, and message are required' })
  }

  // Tiny email sanity check
  const emailOk = /.+@.+\..+/.test(email)
  if (!emailOk) {
    return res.status(400).json({ error: 'invalid_email' })
  }

  try {
    await sql`CREATE TABLE IF NOT EXISTS contacts (
      id serial PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL,
      message text NOT NULL,
      created_at timestamptz DEFAULT now()
    )`

    await sql`INSERT INTO contacts (name, email, message) VALUES (${name}, ${email}, ${message})`
    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: 'db_error', message: e?.message || 'unable to save message' })
  }
}
