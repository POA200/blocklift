declare global {
  interface Window {
    __METRICS_URL__?: string
  }
}

export const impactMetrics = [
  {
    key: "children_equipped",
    label: "Children Equipped",
    desc: "learning kits delivered",
    value: 5000,
    suffix: "+",
  },
  {
    key: "verified_donations",
    label: "Verified Donations",
    desc: "Donations recorded on-chain (verified)",
    value: 12500,
    prefix: "$",
  },
  {
    key: "nft_proofs",
    label: "NFT Proofs Minted",
    desc: "On-chain receipts minted for donors",
    value: 1240,
  },
  {
    key: "field_ambassadors",
    label: "Field Ambassadors",
    desc: "Local verifiers & volunteers deployed",
    value: 45,
  },
]

export async function fetchMetrics() {

  const envUrl = (import.meta.env.VITE_METRICS_URL as string | undefined) || undefined
  const rawCustom = typeof window !== 'undefined' ? window.__METRICS_URL__ : undefined
  const isAbsolute = (u?: string) => !!u && /^https?:\/\//i.test(u)

  const candidates: string[] = []
  if (isAbsolute(envUrl)) candidates.push(envUrl as string)
  if (isAbsolute(rawCustom)) candidates.push(rawCustom as string)

  if (import.meta.env.PROD) {
    candidates.push('/api/metrics')
  } else if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === '1') {
    candidates.push('http://localhost:4001/metrics')
  }

  for (const url of candidates) {
    try {
      const res = await fetch(url, { mode: 'cors' })
      if (!res.ok) continue
      const body = await res.json()
      if (body?.metrics) return body.metrics
    } catch (_) {
      // try next candidate
    }
  }

  return impactMetrics
}

