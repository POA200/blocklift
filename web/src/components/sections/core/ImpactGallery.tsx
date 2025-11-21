import { useEffect, useRef } from "react";
import BlockliftBag from "/src/assets/images/BlockliftBag.jpg";
import BlockliftBag2 from "/src/assets/images/BlockliftBag2.jpg";
import BlockliftSandals from "/src/assets/images/BlockliftSandals.jpg";
import BlockliftImpact from "/src/assets/images/BlockliftImpact.jpg";

// Four gallery items using newly added Blocklift asset images
const galleryItems = [
  {
    src: BlockliftBag,
    alt: "Blocklift branded delivery bag filled with supplies",
    title: "Delivery Bag Distribution",
    description:
      "Branded supply bags prepared and dispatched to local communities.",
    priority: true,
  },
  {
    src: BlockliftBag2,
    alt: "Close-up of Blocklift bag during field logistics",
    title: "Field Logistics",
    description: "Coordinated packaging and routing of essential goods.",
  },
  {
    src: BlockliftSandals,
    alt: "New sandals provided to community members",
    title: "Footwear Support",
    description:
      "Distributing durable sandals to improve daily comfort and mobility.",
  },
  {
    src: BlockliftImpact,
    alt: "Impact verification snapshot documenting aid delivery",
    title: "Impact Verification",
    description:
      "Capturing verifiable evidence of transparent impact on-chain.",
  },
];

const GalleryItem = ({ item }: { item: (typeof galleryItems)[0] }) => {
  return (
    <div className="gallery-item-card relative overflow-hidden rounded-xl bg-background border border-border aspect-[4/3]">
      <img
        src={item.src}
        alt={item.alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading={item.priority ? "eager" : "lazy"}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
      />
      <div className="relative z-10 flex flex-col justify-end h-full p-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default function ImpactGallery() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>(".gallery-item-card")
    );
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
          } else {
            el.classList.remove("is-visible");
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="gallery" className="w-full py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-wider text-primary mb-2">
            Blocklift Gallery
          </p>
          <h2 className="text-2xl md:text-4xl font-semibold mb-2 md:mb-4">
            BlockLift in Action
          </h2>
        </div>
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6"
        >
          {galleryItems.map((item, i) => (
            <GalleryItem item={item} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
