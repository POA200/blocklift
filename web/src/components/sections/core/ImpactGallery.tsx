import { useEffect, useRef } from 'react'
import BlockliftLogo from '/src/assets/images/BlockliftLogo.png'

// Six uniform gallery items for 3x2 desktop, 2x3 tablet, 1x6 mobile
const galleryItems = [
  // Replace makeSvgData with the imported BlockliftLogo path
  {
    src: BlockliftLogo,
    alt: 'Supplies Distribution (Blocklift Logo Placeholder)',
    title: 'Supplies Distribution',
    description: 'Ensuring essential supplies reach the communities that need them most.',
    priority: true,
  },
  {
    src: BlockliftLogo,
    alt: 'Local Ambassador Verification (Blocklift Logo Placeholder)',
    title: 'Local Ambassador Verification',
    description: 'Our ambassadors on the ground verify and report on project impact.',
  },
  {
    src: BlockliftLogo,
    alt: 'Children in Classroom (Blocklift Logo Placeholder)',
    title: 'Education Initiatives',
    description: 'Providing access to quality education for children in underserved areas.',
  },
  {
    src: BlockliftLogo,
    alt: 'Web3 Awareness Session (Blocklift Logo Placeholder)',
    title: 'Web3 Awareness',
    description: 'Educating communities about the potential of Web3 technologies.',
  },
]

const GalleryItem = ({ item }: { item: (typeof galleryItems)[0] }) => {
  return (
    <div className="gallery-item-card relative overflow-hidden rounded-xl bg-[var(--surface)] border border-border aspect-[4/3]">
      <img
        src={item.src}
        alt={item.alt}
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        loading={item.priority ? 'eager' : 'lazy'}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/20 to-transparent">
        <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
      </div>
    </div>
  )
}

export default function ImpactGallery() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cards = Array.from(container.querySelectorAll<HTMLElement>('.gallery-item-card'))
    if (!cards.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
          } else {
            el.classList.remove('is-visible')
          }
        })
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    )

    cards.forEach((card) => {
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="gallery" className="w-full py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-wider text-primary mb-2">Gallery section</p>
          <h2 className="text-2xl md:text-4xl font-semibold mb-2 md:mb-4">BlockLift in Action</h2>
        </div>
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          {galleryItems.map((item, i) => (
            <GalleryItem item={item} key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}