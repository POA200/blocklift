import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import type { JSX } from 'react'

const videos = [
  // TODO: replace these placeholder IDs with BlockLift's official video IDs
  'WD_SfUKgiCA',
  'dQw4w9WgXcQ',
  'M7lc1UVf-VE',
  'hY7m5jjJ9mM',
]

const makeEmbed = (id: string) => `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0`

export default function ImpactVideos(): JSX.Element {
  return (
    <section id="impact-videos" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 text-[var(--primary)]">
          Our Initiatives on the Ground
        </h2>

        <Carousel className="relative">
          <CarouselContent className="gap-4">
            {videos.map((id, i) => (
              <CarouselItem key={`${id}-${i}`}>
                <div className="rounded-xl overflow-hidden border border-primary">
                  <div className="relative" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={makeEmbed(id)}
                      title={`Impact video ${i + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex items-center justify-center gap-4 mt-6 hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
