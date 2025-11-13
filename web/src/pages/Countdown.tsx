import  { useEffect, useMemo, useState } from "react"
import { useNavigate } from 'react-router-dom'
import LogoSrc from "@/assets/images/BlockliftLogo.png"
import { LAUNCH_TS } from "@/lib/launch"
// Home component import removed (Countdown now navigates to Home route instead of rendering inline)

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: number): TimeLeft {
  const now = Date.now()
  const diff = Math.max(0, target - now)
  const seconds = Math.floor(diff / 1000) % 60
  const minutes = Math.floor(diff / (1000 * 60)) % 60
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  return { days, hours, minutes, seconds }
}

export default function Countdown({ onFinish }: { onFinish?: () => void }) {
  // Use the canonical launch timestamp from lib/launch (shared source of truth)
  const initialTarget = useMemo(() => LAUNCH_TS, [])
  const [target] = useState<number>(initialTarget)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(target))
  const navigate = useNavigate()

  useEffect(() => {
    if (target <= Date.now()) {
      onFinish?.()
      return
    }
    const id = setInterval(() => {
      const tl = calcTimeLeft(target)
      setTimeLeft(tl)
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        clearInterval(id)
        onFinish?.()
      }
    }, 1000)

    return () => clearInterval(id)
  }, [target, onFinish])

  // (removed dev-only inline Home rendering) - navigation will go to the Home route.

  return (
    <main className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center py-16 px-6 relative">
      {/* Shortcut: navigate to Home */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate('/')}
          className="bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] px-3 py-2 rounded-md text-sm shadow-sm"
          title="Go to Home"
        >
          Go to Home
        </button>
      </div>

      <div className="max-w-3xl w-full text-center">
        <img src={LogoSrc} alt="Blocklift" className="mx-auto h-16 w-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">We&apos;re launching soon</h1>
        <p className="text-sm md:text-base text-[var(--muted-foreground)] mb-8">
          BLOCKLIFT is currently under active development. We&apos;ll be live in a few days thanks for your patience. Below is the time remaining until launch.
        </p>

        <div className="grid grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-semibold">{timeLeft.days}</div>
            <div className="text-xs text-[var(--muted-foreground)]">Days</div>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-semibold">{String(timeLeft.hours).padStart(2, "0")}</div>
            <div className="text-xs text-[var(--muted-foreground)]">Hours</div>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-semibold">{String(timeLeft.minutes).padStart(2, "0")}</div>
            <div className="text-xs text-[var(--muted-foreground)]">Minutes</div>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-semibold">{String(timeLeft.seconds).padStart(2, "0")}</div>
            <div className="text-xs text-[var(--muted-foreground)]">Seconds</div>
          </div>
        </div>

        <p className="text-xs md:text-sm text-[var(--muted-foreground)]">
          Want to be the first to know? Follow us on our socials or check back later.
        </p>
        <div className="mt-6 flex items-center justify-center gap-6">
          <a
            href="https://x.com/blocklift_stx"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Blocklift on X"
            className="inline-flex items-center gap-2 text-[var(--foreground)] hover:opacity-90"
          >
            <img src="https://cdn.simpleicons.org/x/ffffff" alt="X" className="h-6 w-6" />
            <span className="hidden sm:inline text-sm">@blocklift_stx</span>
          </a>

          <a
            href="https://www.instagram.com/blocklift_stx"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Blocklift on Instagram"
            className="inline-flex items-center gap-2 text-[var(--foreground)] hover:opacity-90"
          >
            <img src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" className="h-6 w-6" />
            <span className="hidden sm:inline text-sm">@blocklift_stx</span>
          </a>

          <a
            href="https://www.tiktok.com/@blocklift_stx"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Blocklift on TikTok"
            className="inline-flex items-center gap-2 text-[var(--foreground)] hover:opacity-90"
          >
            <img src="https://cdn.simpleicons.org/tiktok/ffffff" alt="TikTok" className="h-6 w-6" />
            <span className="hidden sm:inline text-sm">@blocklift_stx</span>
          </a>
        </div>
      </div>
    </main>
  )
}
