import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import LeoImg from "@/assets/images/leo.jpg";

export default function AdsBanner() {
  // Static banner: always visible as a regular landing section (no dismiss logic).
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 border-b border-white-600 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-sm text-white text-center gap-2">
            <img src={LeoImg} alt="$LEO coin" className="inline-block h-8 w-8 rounded-full mr-2" />
            <strong className="font-semibold">$LEO coin</strong>
            <span className="ml-2">Leocoinstx</span>
          </div>

          <Badge className="ml-2" variant='outline'>ad</Badge>
          <a href="https://stxtools.io/tokens/SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token" target="_blank" rel="noopener noreferrer" aria-label="Buy Now" className="mt-1 md:mt-0">
            <Button className="cursor-pointer bg-purple-700 hover:bg-purple-800" size={"sm"}>
              Buy Now!
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
