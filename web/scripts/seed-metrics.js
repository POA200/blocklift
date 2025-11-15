// Seed metrics table in Vercel Postgres using @vercel/postgres
// Usage:
//   npm run db:seed
// Ensure env vars for @vercel/postgres are set locally or run in Vercel.

import { sql } from '@vercel/postgres'

const rows = [
  { key: 'children_equipped', label: 'Children Equipped', desc: 'learning kits delivered', value: 5000, prefix: null, suffix: '+' },
  { key: 'verified_donations', label: 'Verified Donations', desc: 'Donations recorded on-chain (verified)', value: 12500, prefix: '$', suffix: null },
  { key: 'nft_proofs', label: 'NFT Proofs Minted', desc: 'On-chain receipts minted for donors', value: 1240, prefix: null, suffix: null },
  { key: 'field_ambassadors', label: 'Field Ambassadors', desc: 'Local verifiers & volunteers deployed', value: 45, prefix: null, suffix: null },
]

async function main() {
  await sql`CREATE TABLE IF NOT EXISTS metrics (
    key text PRIMARY KEY,
    label text NOT NULL,
    desc text NOT NULL,
    value integer NOT NULL,
    prefix text,
    suffix text,
    updated_at timestamptz DEFAULT now()
  )`

  for (const r of rows) {
    await sql`
      INSERT INTO metrics (key, label, desc, value, prefix, suffix)
      VALUES (${r.key}, ${r.label}, ${r.desc}, ${r.value}, ${r.prefix}, ${r.suffix})
      ON CONFLICT (key)
      DO UPDATE SET label = EXCLUDED.label, desc = EXCLUDED.desc, value = EXCLUDED.value, prefix = EXCLUDED.prefix, suffix = EXCLUDED.suffix, updated_at = now()
    `
  }

  console.log('Seeded metrics. Rows:', rows.length)
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
