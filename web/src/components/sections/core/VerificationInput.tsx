import { useState } from "react"
import FocusTrap from '@/components/ui/focus-trap'
import { useForm } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"

type FormData = {
  id: string
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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const rawValue = watch('id') || ''
  const trimmedValue = rawValue.trim()

  const onSubmit = async (data: FormData) => {
    const value = (data.id || '').trim()
    if (!value) return

    setIsSubmitting(true)
    setStatus('loading')
    setStatusMessage(null)

    const apiUrl = import.meta.env.VITE_VERIFICATION_API || '/api/verify'

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: value }),
      })

      if (!res.ok) {
        let text = await res.text()
        try {
          const j = JSON.parse(text)
          text = j?.message || text
        } catch (e) {
          // keep raw text
        }
        throw new Error(text || `Server returned ${res.status}`)
      }

      const json = await res.json().catch(() => ({}))
      const ok = json?.ok ?? true
      const message = json?.message ?? (ok ? 'Verified' : 'Not verified')

      if (ok) {
        setStatus('success')
        setStatusMessage(message)
        setResultId(value)
        setOpen(true)
        reset()
      } else {
        setStatus('error')
        setStatusMessage(message || 'Not verified')
      }
    } catch (err: any) {
      setStatus('error')
      setStatusMessage(err?.message || 'Network or verification error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
  <section id="verify" tabIndex={-1} className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="bg-[var(--surface)] border border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Verify Your Impact: Instant On-Chain Audit</CardTitle>
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

                <Button type="submit" className="w-full md:w-auto md:-ml-px md:rounded-l-none md:rounded-r-md" aria-label="Verify impact" disabled={isSubmitting}>
                  Verify
                </Button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-4">
                <div className="text-xs text-[var(--muted-foreground)]" aria-live="polite">
                  {rawValue && trimmedValue !== rawValue ? (
                    <span>
                      Will verify: <span className="font-mono text-[var(--primary)]">{trimmedValue}</span>
                    </span>
                  ) : (
                    <span>Enter a Tx hash or NFT ID and press Verify (or Ctrl/Cmd+Enter).</span>
                  )}
                </div>
                <div className="text-xs" aria-live="assertive">
                  {errors.id ? (
                    <span className="text-red-400">Please enter a valid ID.</span>
                  ) : status === 'error' ? (
                    <span className="text-red-400">{statusMessage}</span>
                  ) : status === 'success' ? (
                    <span className="text-emerald-400">{statusMessage}</span>
                  ) : null}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-[var(--muted-foreground)]">This performs a client-side check (MVP). Full Stacks verification will be added soon.</p>
          </CardFooter>
        </Card>

        {open && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4">
            <div className="max-w-lg w-full">
              <FocusTrap>
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Verification Successful!</h3>
                  <p className="mb-4 text-[var(--muted-foreground)]">Impact ID <span className="font-mono text-[var(--primary)]">{resultId}</span> is confirmed on the Stacks Blockchain.</p>
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => setOpen(false)} variant="ghost">Close</Button>
                  </div>
                </div>
              </FocusTrap>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}