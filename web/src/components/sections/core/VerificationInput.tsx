import { useState, useEffect } from "react"
import FocusTrap from '@/components/ui/focus-trap'
import { useForm } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"

type FormData = {
  id: string
}

const network = import.meta.env.VITE_NETWORK || 'mainnet'

export const waitForTxConfirmed = async (txId: string, opts?: { timeoutMs?: number; intervalMs?: number }): Promise<void> => {
  console.log('waiting for tx to confirm → starting (poll-only)')
  const controller = new AbortController()
  const timeoutMs = opts?.timeoutMs ?? 5 * 60_000 // default 5 minutes
  const intervalMs = opts?.intervalMs ?? 5_000 // default 5s polling

  const start = Date.now()

  const isExpectedError = (reason: string | undefined): boolean => {
    if (!reason) return false

    const errorPatterns = [
      /\bu5\b/i,
      /\bu9\b/i,
      /\(err u5\)/i,
      /\(err u9\)/i,
      /err-u5/i,
      /err-u9/i,
    ]

    return errorPatterns.some((pattern) => pattern.test(reason))
  }

  // Basic tx id validation (hex, optionally leading 0x, 64 hex chars)
  const txRegex = /^(0x)?[0-9a-fA-F]{64}$/
  if (!txRegex.test(txId)) {
    throw new Error('Invalid transaction id format — expected 64 hex characters (optionally prefixed with 0x)')
  }

  while (true) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('Timeout waiting for transaction confirmation')
    }

    let res: Response
    try {
      res = await fetch(`https://api.${network}.hiro.so/extended/v1/tx/${txId}`, { signal: controller.signal })
    } catch (err) {
      throw err
    }

    if (!res.ok) {
      let bodyText = ''
      try {
        bodyText = await res.text()
      } catch (e) {
        bodyText = `<unable to read body: ${String(e)}>`
      }

      // If Hiro doesn't know the tx (404), try the Stacks Node API as a fallback
      if (res.status === 404) {
        try {
          const alt = await fetch(`https://stacks-node-api.${network}.stacks.co/extended/v1/tx/${txId}`, { signal: controller.signal })
          if (alt.ok) {
            const altData = await alt.json()
            console.log('🔁 fallback stacks-node-api result:', altData.tx_status)
            if (altData.tx_status === 'success') return
            if (altData.tx_status === 'abort_by_response' || altData.tx_status === 'abort_by_post_condition') {
              const reason = altData.tx_result?.repr
              if (isExpectedError(reason)) return
              throw new Error(`Transaction failed or was aborted: ${reason || 'unknown reason'}`)
            }
            // otherwise continue polling
          }
        } catch (e) {
          console.warn('Fallback to stacks-node-api failed:', e)
        }
      }

      // Non-OK from Hiro and fallback didn't resolve -> surface error for debugging
      throw new Error(`Hiro API ${res.status} ${res.statusText}: ${bodyText}`)
    }

    const data = await res.json()
    console.log('� polling tx status:', data.tx_status)

    if (data.tx_status === 'success') {
      return
    }

    if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
      const reason = data.tx_result?.repr
      if (isExpectedError(reason)) return
      throw new Error(`Transaction failed or was aborted: ${reason || 'unknown reason'}`)
    }

    // wait and poll again
    await new Promise((r) => setTimeout(r, intervalMs))
  }
}

export default function VerificationInput() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const [open, setOpen] = useState(false)
  const [resultId, setResultId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastTx, setLastTx] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [open])

  const rawValue = watch('id') || ''
  const trimmedValue = rawValue.trim()

  const onSubmit = async (data: FormData) => {
    const value = (data.id || '').trim()
    if (!value) return

    setLastTx(value)

    setIsSubmitting(true)
    setStatus('loading')
    setStatusMessage(null)

    try {
      // Wait for transaction confirmation on Stacks (Hiro API + websocket)
      await waitForTxConfirmed(value)

      setStatus('success')
      setStatusMessage('Transaction confirmed on Stacks')
      setResultId(value)
      setOpen(true)
      reset()
    } catch (err: any) {
      setStatus('error')
      setStatusMessage(err?.message || 'Failed to confirm transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = async () => {
    if (!lastTx) return
    setIsSubmitting(true)
    setStatus('loading')
    setStatusMessage(null)
    try {
      await waitForTxConfirmed(lastTx)
      setStatus('success')
      setStatusMessage('Transaction confirmed on Stacks')
      setResultId(lastTx)
      setOpen(true)
      setLastTx(null)
    } catch (err: any) {
      setStatus('error')
      setStatusMessage(err?.message || 'Failed to confirm transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
  <section id="verify" tabIndex={-1} className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="bg-[var(--surface)] border border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Verify Your Impact: Impact Chain Verification Audit (ICV)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-3 items-stretch w-full">
              <label htmlFor="verify-id" className="sr-only">Transaction hash or NFT ID</label>

              <div className="flex flex-col md:flex-row w-full">
                <div className="relative flex-1">
                  <Input
                    id="verify-id"
                    {...register('id', { required: true })}
                    placeholder="Enter Tx Hash or NFT ID..."
                    aria-label="Transaction hash or NFT id"
                    aria-invalid={errors.id ? 'true' : 'false'}
                    className={`pr-10 ${errors.id ? 'border-destructive' : 'border-[var(--border)]'} ${
                      status === 'success' ? 'ring-2 ring-emerald-500/40' : status === 'error' ? 'ring-2 ring-red-500/40' : ''
                    }`}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault()
                        void handleSubmit(onSubmit)()
                      }
                    }}
                  />

                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    {status === 'loading' ? (
                      <svg className="animate-spin h-4 w-4 text-[var(--muted-foreground)]" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    ) : status === 'success' ? (
                      <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : status === 'error' ? (
                      <svg className="h-4 w-4 text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </div>
                </div>
              </div>

                <Button type="submit" className="w-full md:w-auto md:-ml-px" aria-label="Verify impact" disabled={isSubmitting}>
                  Verify
                </Button>

              <div className="mt-2 flex items-center justify-between gap-4">
                <div className="text-xs text-[var(--muted-foreground)]" aria-live="polite">
                  {rawValue && trimmedValue !== rawValue ? (
                    <span>
                      Will verify: <span className="font-mono text-[var(--primary)]">{trimmedValue}</span>
                    </span>
                  ) : null}
                </div>
                <div className="text-xs" aria-live="assertive">
                  {errors.id ? (
                    <span className="text-destructive">Please enter a valid ID.</span>
                  ) : status === 'error' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-destructive">{statusMessage}</span>
                      {/* If the error looks like a 404 / not found, offer a retry button */}
                      {lastTx && /404|not found/i.test(String(statusMessage)) ? (
                        <Button onClick={handleRetry} size={'sm'} className="ml-2" disabled={isSubmitting} variant="ghost">
                          Retry
                        </Button>
                      ) : null}
                    </div>
                  ) : status === 'success' ? (
                    <span className="text-emerald-400">{statusMessage}</span>
                  ) : null}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-[var(--muted-foreground)]">Enter a Tx hash or NFT ID and press Verify.</p>
          </CardFooter>
        </Card>

        {open && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-transparent backdrop-blur-sm">
            <div className="max-w-lg w-full">
              <FocusTrap>
                <Card className="bg-background border border-primary">
                  <CardHeader className="">
                    <CardTitle className="text-lg text-green-600">Verification Successful!</CardTitle>
                  </CardHeader>
                  <CardDescription>
                  </CardDescription>
                  <CardContent className="pt-0 mb-4">
                    <p className="text-foreground">Impact ID</p>
                    <p className="font-mono text-primary break-all text-sm max-w-full">{resultId}</p>
                    <p className="text-muted-foreground">is confirmed on the Stacks Blockchain.</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button onClick={() => setOpen(false)} variant="ghost">Close</Button>
                  </CardFooter>
                </Card>
              </FocusTrap>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}