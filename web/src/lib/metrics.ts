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
  // Try the local mock server first (dev). Falls back to the bundled metrics.
  const url = typeof window !== 'undefined' ? (window.__METRICS_URL__ || 'http://localhost:4001/metrics') : 'http://localhost:4001/metrics'
  try {
    const res = await fetch(url, { mode: 'cors' })
    if (!res.ok) throw new Error('fetch failed')
    const body = await res.json()
    if (body?.metrics) return body.metrics
  } catch (e) {
    // ignore and return static
  }
  return impactMetrics
}

