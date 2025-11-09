import { ThemeProvider } from "./components/theme-provider"
import Home from "./pages/Home"
import Countdown from "./pages/Countdown"
import { useEffect, useState } from "react"
import { LAUNCH_TS } from "./lib/launch"

function App() {
  const [showHome, setShowHome] = useState(() => Date.now() >= LAUNCH_TS)

  useEffect(() => {
    // in case LAUNCH_TS is updated dynamically in future, keep the check
    if (Date.now() >= LAUNCH_TS) setShowHome(true)
  }, [])

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {showHome ? <Home /> : <Countdown onFinish={() => setShowHome(true)} />}
      </ThemeProvider>
    </>
  )
}

export default App