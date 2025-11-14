import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'

const makeSvgData = (text: string, w = 1400, h = 700, bg = 'rgba(255, 117, 32, 0.11)', fg = '#ff6a1aff') => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
    <rect width='100%' height='100%' fill='${bg}' />
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${fg}' font-family='Inter, Arial, sans-serif' font-size='36'>${text}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const images = [
  makeSvgData('Supplies Distribution'),
  makeSvgData('Local Ambassador Verification'),
  makeSvgData('Children in Classroom'),
  makeSvgData('Web3 Awareness Session'),
]

export default function ImpactGallery() {
  return (
    <section id="gallery" className="w-full py-10">
      <div className="max-w-7xl mx-auto px-6">
  <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-center">BlockLift in Action: Verifiable Impact</h2>

        <Carousel className="relative">
          <CarouselContent className="gap-4">
            {images.map((src, i) => (
              <CarouselItem key={i}>
                <div className="rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={src}
                    alt={`Impact ${i + 1}`}
                    className="w-full h-full object-cover block"
                  />
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
