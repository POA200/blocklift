import { useState } from 'react'
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { X } from 'lucide-react'
import LeoImg from "@/assets/images/leo.jpg";

export default function AdsBanner() {
  // Static banner with a dismiss control. Dismissal is session-scoped (no persistence).
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="w-full z-50 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 border-b border-white-600 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3">
        <div className="flex flex-row md:flex-row justify-between items-center gap-3">
          <div className="flex items-center text-sm text-white">
            <img src={LeoImg} alt="$LEO coin" className="inline-block h-8 w-8 rounded-full mr-2" />
            <strong className="font-semibold">$LEO coin</strong>
            <span className="ml-2">Leocoinstx</span>
          </div>

          <div className="flex items-center gap-3">

            <a href="https://stxtools.io/tokens/SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token" target="_blank" rel="noopener noreferrer" aria-label="Buy Now" className="mt-1 md:mt-0">
              <Button className="cursor-pointer bg-purple-700 hover:bg-purple-800" size={"sm"}>
                Buy Now!
              </Button>
            </a>
            <Badge className="ml-2" variant="outline">ad</Badge>
            <Button
              onClick={() => setVisible(false)}
              aria-label="Dismiss banner"
              className="ml-2 text-white cursor-pointer"
              variant={'link'}
              size={'sm'}
            >
              <X className="w-2 h-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
