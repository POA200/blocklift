import { useEffect, useRef } from "react"

function getFocusableElements(root: HTMLElement | null) {
  if (!root) return [] as HTMLElement[]
  const sel = [
    'a[href]', 'button:not([disabled])', 'textarea:not([disabled])', 'input:not([disabled])', 'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',')
  return Array.from(root.querySelectorAll<HTMLElement>(sel)).filter(el => el.offsetParent !== null)
}

export default function FocusTrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<Element | null>(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement
    const root = ref.current
    const focusable = getFocusableElements(root)
    if (focusable.length) focusable[0].focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        if (!root) return
        const elements = getFocusableElements(root)
        if (elements.length === 0) {
          e.preventDefault()
          return
        }
        const first = elements[0]
        const last = elements[elements.length - 1]
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (e.key === 'Escape') {
        // allow consumer to handle Escape via buttons/handlers in the modal
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      // restore focus
      if (previouslyFocused.current && (previouslyFocused.current as HTMLElement).focus) {
        ;(previouslyFocused.current as HTMLElement).focus()
      }
    }
  }, [])

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}
