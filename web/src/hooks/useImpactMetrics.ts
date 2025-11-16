import { useEffect, useMemo, useState } from 'react'
import { fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions'
import type { ClarityValue } from '@stacks/transactions'
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network'
import { CONTRACT_ADDRESS, CONTRACT_NAME, NETWORK, IMPACT_METRIC_FN_MAP } from '@/lib/constants'
import { impactMetrics, fetchMetrics } from '@/lib/metrics'

export type ImpactMetric = {
  key: string
  label: string
  desc: string
  value: number
  prefix?: string
  suffix?: string
}

function extractNumericFromCv(cv: ClarityValue): number | null {
  try {
    const j = cvToJSON(cv) as any
    const dig = (x: any): string | null => {
      if (x == null) return null
      if (typeof x === 'string' && /^-?\d+$/.test(x)) return x
      if (typeof x === 'object') {
        if ('value' in x) return dig(x.value)
        if ('data' in x) return dig(x.data)
        if ('repr' in x && typeof x.repr === 'string') {
          const m = x.repr.match(/u(\d+)|\(ok u(\d+)\)|\(some u(\d+)\)/i)
          if (m) return m[1] || m[2] || m[3]
        }
      }
      return null
    }
    const s = dig(j)
    if (s == null) return null
    const n = Number(s)
    if (!Number.isFinite(n)) return null
    return n
  } catch {
    return null
  }
}

function defaultFnNameForKey(key: string): string {
  return `get-${key.replace(/_/g, '-')}`
}

export function useImpactMetrics() {
  const [data, setData] = useState<ImpactMetric[]>(impactMetrics as ImpactMetric[])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const hasContract = useMemo(() => Boolean(CONTRACT_ADDRESS && CONTRACT_NAME), [])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)

      // Fallback: if no contract configured, keep API behavior
      if (!hasContract) {
        try {
          const api = await fetchMetrics()
          if (!cancelled && Array.isArray(api)) setData(api as ImpactMetric[])
        } catch (e: any) {
          if (!cancelled) setError(e?.message || 'Failed to load metrics')
        } finally {
          if (!cancelled) setLoading(false)
        }
        return
      }

      const network = NETWORK === 'testnet' ? STACKS_TESTNET : STACKS_MAINNET

      try {
        const results = await Promise.all(
          (impactMetrics as ImpactMetric[]).map(async (m) => {
            const functionName = IMPACT_METRIC_FN_MAP[m.key] || defaultFnNameForKey(m.key)
            try {
              const cv = await fetchCallReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS!,
                contractName: CONTRACT_NAME!,
                functionName,
                functionArgs: [],
                network,
                senderAddress: CONTRACT_ADDRESS!,
              })
              const num = extractNumericFromCv(cv)
              return { ...m, value: num ?? m.value }
            } catch (_) {
              return { ...m }
            }
          })
        )

        if (!cancelled) setData(results)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to read metrics from contract')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [hasContract])

  return { metrics: data, loading, error }
}
