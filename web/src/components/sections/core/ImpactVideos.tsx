import BlockliftLogo from '@/assets/images/BlockliftLogo.png'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import FocusTrap from '@/components/ui/focus-trap'

interface VideoCardData {
  title: string
  description: string
  image: string
  href: string
  videoSrc?: string
}

const PLACEHOLDER_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4'

const videoCards: VideoCardData[] = [
  {
    title: 'Ambassador Verification',
    description: 'Local ambassador validating on-chain proof of a real-world aid delivery.',
    image: BlockliftLogo,
    href: '/videos/ambassador-verification',
    videoSrc: PLACEHOLDER_VIDEO,
  },
  {
    title: 'School Supply Distribution',
    description: 'Tracking supply packages reaching classrooms with transparent receipts.',
    image: BlockliftLogo,
    href: '/videos/school-supplies',
    videoSrc: PLACEHOLDER_VIDEO,
  },
  {
    title: 'Web3 Education Session',
    description: 'Community workshop introducing Stacks and verifiable impact tooling.',
    image: BlockliftLogo,
    href: '/videos/web3-education',
    videoSrc: PLACEHOLDER_VIDEO,
  },
  {
    title: 'Logistics & Coordination',
    description: 'Coordinating field resources while preserving on-chain auditability.',
    image: BlockliftLogo,
    href: '/videos/logistics',
    videoSrc: PLACEHOLDER_VIDEO,
  },
]

export default function ImpactVideos() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeModal = () => setOpenIndex(null)

  // Lock background scroll when modal is open
  useEffect(() => {
    if (openIndex !== null) {
      const prevOverflow = document.body.style.overflow
      const prevPaddingRight = document.body.style.paddingRight
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
      return () => {
        document.body.style.overflow = prevOverflow
        document.body.style.paddingRight = prevPaddingRight
      }
    }
  }, [openIndex])

  return (
    <section id="impact-videos" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-[var(--primary)]">Our Initiatives on the Ground</h2>
          <p className="text-sm text-muted-foreground">Explore short field clips documenting verifiable impact processes, community engagement, and transparent logistics.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {videoCards.map((card, idx) => (
            <Card key={card.href} className="flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
              <div className="relative aspect-video bg-black/5 flex items-center justify-center">
                <img src={card.image} alt={card.title} className="h-14 w-auto opacity-80" loading="lazy" />
              </div>
              <CardHeader>
                <CardTitle className="text-[var(--foreground)] text-lg">{card.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button variant="default" className="w-full cursor-pointer" aria-label={`Watch video: ${card.title}`} onClick={() => setOpenIndex(idx)}>
                  Watch video
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {openIndex !== null && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="max-w-3xl w-full" onClick={(e) => {
              if (e.target === e.currentTarget) closeModal()
            }}>
              <FocusTrap>
                <Card className="bg-background border border-[var(--border)]">
                  <CardHeader>
                    <CardTitle>{videoCards[openIndex].title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">{videoCards[openIndex].description}</CardDescription>
                  </CardHeader>
                  <div className="px-6">
                    <div className="rounded-lg overflow-hidden border border-[var(--border)]">
                      <video
                        src={videoCards[openIndex].videoSrc || PLACEHOLDER_VIDEO}
                        poster={videoCards[openIndex].image}
                        controls
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <CardFooter className="flex justify-end gap-2">
                    <Button className='cursor-pointer' variant="ghost" onClick={closeModal}>Close Video</Button>
                  </CardFooter>
                </Card>
              </FocusTrap>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
