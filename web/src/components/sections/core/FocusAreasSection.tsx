import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Lightbulb, Award, BookOpen, Network } from "lucide-react"
import { useEffect, useRef } from 'react'

export default function FocusAreasSection() {
  const items = [
    {
      icon: <Lightbulb className="h-12 w-12 text-primary" />,
      title: "Equipping the Future",
      desc: "We provide essential tools, from bags and sandals to notebooks, to eliminate barriers to learning for children in underserved communities.",
    },
    {
      icon: <Award className="h-12 w-12 text-primary" />,
      title: "Proof-of-Impact, On-Chain",
      desc: "Every donation is recorded as a unique transaction, generating an NFT proof of impact for absolute, auditable accountability.",
    },
    {
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      title: "Building Web3 Literacy",
      desc: "Beyond supplies, we introduce students and communities to Web3, Bitcoin, and decentralized technology, fostering future innovators.",
    },
    {
      icon: <Network className="h-12 w-12 text-primary" />,
      title: "Verified Field Network",
      desc: "Connecting donors directly with trusted NGOs and local ambassadors who verify and document impact in real-time.",
    },
  ]

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cards = Array.from(container.querySelectorAll<HTMLElement>('.focus-card'))
    if (!cards.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          // Add class when intersecting, remove when no longer intersecting
          // so the animation can replay on re-entry from either scroll direction.
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
          } else {
            el.classList.remove('is-visible')
          }
        })
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    )

    cards.forEach((card, idx) => {
      // set a staggered delay based on index (200ms steps)
      const delay = `${idx * 100}ms`
      card.style.setProperty('--delay', delay)
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" tabIndex={-1} className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-10">Core Focus Areas</h2>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {items.map((it, i) => (
            <Card
              key={it.title}
              className={`focus-card ${i % 2 === 0 ? 'from-left' : 'from-right'} hover:scale-[1.01] transition-transform bg-background`}
            >
              <CardHeader>
                <div className="p-2 rounded-md bg-transparent mb-4">{it.icon}</div>
                <CardTitle>{it.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{it.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
