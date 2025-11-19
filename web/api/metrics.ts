import { sql } from '@vercel/postgres'

// Fallback static metrics if DB is unavailable
const fallback = [
  { key: 'children_equipped', label: 'Children Equipped', desc: 'learning kits delivered', value: 5000, suffix: '+' },
  { key: 'verified_donations', label: 'Verified Donations', desc: 'Donations recorded on-chain (verified)', value: 12500, prefix: '$' },
  { key: 'nft_proofs', label: 'NFT Proofs Minted', desc: 'On-chain receipts minted for donors', value: 1240 },
  { key: 'field_ambassadors', label: 'Field Ambassadors', desc: 'Local verifiers & volunteers deployed', value: 45 },
]

export default async function handler(req: any, res: any) {
  // Use standard uppercase directives and add max-age for browsers; allow edge revalidation.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600')

  if (req.method === 'GET') {
    try {
      const { rows } = await sql`
        SELECT key, label, desc, value, prefix, suffix
        FROM metrics
        ORDER BY key ASC
      `
      if (rows && rows.length) {
        return res.status(200).json({ metrics: rows })
      }
      // Empty table -> attempt to create (idempotent) then fall back
      try {
        await sql`CREATE TABLE IF NOT EXISTS metrics (
          key text PRIMARY KEY,
          label text NOT NULL,
          desc text NOT NULL,
          value integer NOT NULL,
          prefix text,
          suffix text,
          updated_at timestamptz DEFAULT now()
        )`
      } catch (_) {
        // ignore create errors, still fallback
      }
      return res.status(200).json({ metrics: fallback })
    } catch (e) {
      // On connection / query failure also fallback
      return res.status(200).json({ metrics: fallback })
    }
  }

  if (req.method === 'POST') {
    const authHeader = req.headers['authorization'] || ''
    const bearer = Array.isArray(authHeader) ? authHeader[0] : authHeader
    const token = (bearer.startsWith('Bearer ') ? bearer.slice(7) : null) || (req.headers['x-api-key'] as string | undefined) || null
    const secret = process.env.METRICS_ADMIN_TOKEN || ''
    if (!secret || token !== secret) {
      return res.status(401).json({ error: 'unauthorized' })
    }

    let body: any
    try {
      body = req.body && typeof req.body === 'object' ? req.body : (req.body ? JSON.parse(req.body as any) : null)
    } catch (_) {
      body = null
    }
    const updates = Array.isArray(body) ? body : (body?.updates ? body.updates : (body ? [body] : []))
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'invalid_payload', message: 'Provide an update object or updates array.' })
    }

    const results: any[] = []
    for (const u of updates) {
      if (!u || typeof u.key !== 'string' || u.key.trim() === '') {
        return res.status(400).json({ error: 'invalid_item', message: 'Each update must include a non-empty key.' })
      }
      const key = u.key.trim()
      const label = typeof u.label === 'string' ? u.label : undefined
      const desc = typeof u.desc === 'string' ? u.desc : undefined
      const value = typeof u.value === 'number' ? u.value : undefined
      const prefix = typeof u.prefix === 'string' ? u.prefix : (u.prefix === null ? null : undefined)
      const suffix = typeof u.suffix === 'string' ? u.suffix : (u.suffix === null ? null : undefined)

      // Does the row exist?
      let exists = false
      try {
        const { rows } = await sql`SELECT 1 FROM metrics WHERE key = ${key} LIMIT 1`
        exists = rows.length > 0
      } catch (_) {
        // table might not exist; try to create it
        try {
          await sql`CREATE TABLE IF NOT EXISTS metrics (
            key text PRIMARY KEY,
            label text NOT NULL,
            desc text NOT NULL,
            value integer NOT NULL,
            prefix text,
            suffix text,
            updated_at timestamptz DEFAULT now()
          )`
          exists = false
        } catch (e) {
          return res.status(500).json({ error: 'db_error', message: 'Unable to ensure metrics table exists.' })
        }
      }

      if (!exists) {
        if (label == null || desc == null || value == null) {
          return res.status(400).json({ error: 'missing_fields', message: `Creating new key '${key}' requires label, desc, and value.` })
        }
        await sql`
          INSERT INTO metrics (key, label, desc, value, prefix, suffix)
          VALUES (${key}, ${label}, ${desc}, ${value}, ${prefix ?? null}, ${suffix ?? null})
        `
        results.push({ key, created: true })
      } else {
        const labelProvided = label !== undefined
        const descProvided = desc !== undefined
        const valueProvided = value !== undefined
        const prefixProvided = prefix !== undefined
        const suffixProvided = suffix !== undefined

        if (!labelProvided && !descProvided && !valueProvided && !prefixProvided && !suffixProvided) {
          results.push({ key, updated: false })
        } else {
          await sql`
            UPDATE metrics
            SET
              label = CASE WHEN ${labelProvided} THEN ${label ?? null} ELSE label END,
              desc = CASE WHEN ${descProvided} THEN ${desc ?? null} ELSE desc END,
              value = CASE WHEN ${valueProvided} THEN ${value ?? null} ELSE value END,
              prefix = CASE WHEN ${prefixProvided} THEN ${prefix ?? null} ELSE prefix END,
              suffix = CASE WHEN ${suffixProvided} THEN ${suffix ?? null} ELSE suffix END,
              updated_at = now()
            WHERE key = ${key}
          `
          results.push({ key, updated: true })
        }
      }
    }

    return res.status(200).json({ ok: true, results })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'method_not_allowed' })
}
