import { ThemeProvider } from "./components/theme-provider"
import Countdown from "./pages/Countdown"
import { Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Sponsor from "./pages/Sponsor"
import Volunteer from "./pages/Volunteer"
import About from './pages/About'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import Terms from './pages/legal/Terms'
import Blog from "./pages/Blog"
import Contact from "./pages/Contact"
import Pay from "./pages/Pay"

function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    // remove leading '#'
    const id = hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      el.focus && (el as HTMLElement).focus()
    }
  }, [pathname, hash])
  return null
}

function App() {
  // Countdown no longer toggles Home automatically here; it is available at /countdown

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/countdown" element={<Countdown />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/impact-chain" element={<Dashboard />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/legal/terms" element={<Terms />} />
          <Route path="/pay" element={<Pay />} />
          {/* fallback to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App