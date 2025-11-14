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
  // Try the local mock server when in development or when a custom metrics URL is provided.
  // In production we avoid calling localhost to prevent console network errors.
  const rawCustom = typeof window !== 'undefined' ? window.__METRICS_URL__ : undefined
  // Only accept an explicit custom URL if it looks like a valid absolute http(s) URL
  const hasCustom = typeof rawCustom === 'string' && /^https?:\/\//i.test(rawCustom)
  const shouldTryMock = import.meta.env.DEV || hasCustom
  if (!shouldTryMock) return impactMetrics

  const url = hasCustom ? rawCustom : 'http://localhost:4001/metrics'
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

