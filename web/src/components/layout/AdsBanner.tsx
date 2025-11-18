import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { X } from "lucide-react";
//import LeoImg from "@/assets/images/leo.jpg";
import LabImg from "@/assets/images/lab.jpg";
import FlatImg from "@/assets/images/flat.jpg";
import BoomImg from "@/assets/images/Boom.jpg";

export default function AdsBanner() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  const items = useMemo(
    () => [
      //{
      //img: LeoImg,
      //alt: "$LEO coin",
      //title: "$LEO coin",
      //subtitle: "Leocoinstx",
      //cta: "Buy $Leo!",
      //href: "https://stxtools.io/tokens/SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token",
      //bgClass: "bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600",
      //btnClass: "bg-purple-700 hover:bg-purple-800",
      //},
      {
        img: LabImg,
        alt: "Let Africa Build",
        title: "Let Africa Build (LAB)",
        subtitle: "Web3 Education Partner",
        cta: "Visit",
        href: "https://letafricabuild.com",
        bgClass: "bg-gradient-to-r from-yellow-500 via-orange-500 to-black-600",
        btnClass: "bg-yellow-600 hover:bg-yellow-700",
      },
      {
        img: FlatImg,
        alt: "Flatearth Memecoin",
        title: "Flatearth ($FLAT)",
        subtitle: "Memecoin Partner",
        cta: "Buy $Flat!",
        href: "https://linktr.ee/flatearth_btc",
        bgClass: "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600",
        btnClass: "bg-blue-700 hover:bg-blue-800",
      },
      {
        img: BoomImg,
        alt: "Boom Wallet",
        title: "Boom Wallet",
        subtitle: "Bitcoin-native SocialFi",
        cta: "Open",
        href: "https://boom.money",
        bgClass: "bg-gradient-to-r from-pink-300 via-purple-500 to-purple-600",
        btnClass: "bg-purple-700 hover:bg-purple-800",
      },
    ],
    []
  );

  useEffect(() => {
    if (!visible || paused) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 3000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [visible, paused, items.length]);

  if (!visible) return null;

  const item = items[index];

  return (
    <div
      className={`w-full z-50 ${item.bgClass} border-b border-white-600 text-white`}
      onMouseEnter={() => {
        setPaused(true);
        if (timer.current) window.clearInterval(timer.current);
      }}
      onMouseLeave={() => {
        setPaused(false);
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3">
        <div
          key={index}
          className="fade-in flex flex-row md:flex-row justify-between items-center gap-3"
        >
          <div className="flex items-center text-sm text-white">
            <img
              src={item.img}
              alt={item.alt}
              className="inline-block h-8 w-8 rounded-full mr-2 object-cover"
            />
            <strong className="font-semibold">{item.title}</strong>
            <span className="ml-2">{item.subtitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.cta}
              className="mt-1 md:mt-0"
            >
              <Button className={`cursor-pointer ${item.btnClass}`} size={"sm"}>
                {item.cta}
              </Button>
            </a>
            <Badge className="ml-2" variant="outline">
              ad
            </Badge>
            <Button
              onClick={() => setVisible(false)}
              aria-label="Dismiss banner"
              className="ml-2 text-white cursor-pointer"
              variant={"link"}
              size={"sm"}
            >
              <X className="w-2 h-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
