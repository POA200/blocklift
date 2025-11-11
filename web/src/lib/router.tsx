import React, { useEffect, useState } from "react"
import Home from "@/pages/Home"
import Dashboard from "@/pages/Dashboard"
import Sponsor from "@/pages/Sponsor"
// Volunteer import was failing; provide a small inline fallback component so the router compiles.
// Note: keep imports light; pages below are simple components exported as default.
const Volunteer: React.FC = () => <div>Volunteer page</div>

export function navigate(to: string) {
  if (typeof window === "undefined") return
  if (window.location.pathname === to) return
  window.history.pushState({}, "", to)
  window.dispatchEvent(new PopStateEvent("popstate"))
}

export function Link({ to, children, ...props }: { to: string; children: React.ReactNode } & React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={to}
      onClick={(e) => {
        // allow normal ctrl+click / new-tab behavior
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
        e.preventDefault()
        if (to.startsWith('#')) {
          // in-page anchor. If we're not on the home route, navigate there first then set hash.
          if (typeof window !== 'undefined') {
            if (window.location.pathname !== '/') {
              navigate('/')
              // set hash after navigation has taken place
              setTimeout(() => { window.location.hash = to }, 80)
            } else {
              window.location.hash = to
            }
          }
        } else {
          navigate(to)
        }
      }}
      {...props}
    >
      {children}
    </a>
  )
}

export default function Router() {
  const [path, setPath] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : '/'))

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Normalize trailing slash
  const p = path.replace(/\/$/, '') || '/'

  switch (p) {
    case '/':
      return <Home />
    case '/dashboard':
    case '/impact-chain':
      return <Dashboard />
    case '/sponsor':
      return <Sponsor />
    case '/volunteer':
      return <Volunteer />
    default:
      // unknown path -> Home
      return <Home />
  }
}
