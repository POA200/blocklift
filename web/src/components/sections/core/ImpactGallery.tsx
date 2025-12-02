import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlockliftBag from "/src/assets/images/BlockliftBag.jpg";
import BlockliftBag2 from "/src/assets/images/BlockliftBag2.jpg";
import BlockliftSandals from "/src/assets/images/BlockliftSandals.jpg";
import BlockliftImpact from "/src/assets/images/BlockliftImpact.jpg";
import BagGathered from "/src/assets/images/bag-gathered.jpg";
import BagGathering3 from "/src/assets/images/bag-gathering3.jpg";
import Bag1 from "/src/assets/images/bag1.jpg";
import Bag2 from "/src/assets/images/bag2.jpg";
import Bag3 from "/src/assets/images/bag3.jpg";
import BagsGathering from "/src/assets/images/bags-gathering.jpg";
import BagsGathering2 from "/src/assets/images/bags-gathering2.jpg";
import Bags from "/src/assets/images/bags.jpg";

// All gallery items using Blocklift asset images
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
  {
    src: BagGathered,
    alt: "volunteers gathering supply bags",
    title: "Volunteers Gathering",
    description: "Volunteers coming together to organize essential supplies.",
  },
  {
    src: BagGathering3,
    alt: "Volunteers organizing supply distribution",
    title: "Volunteer Coordination",
    description: "Dedicated volunteers organizing efficient distribution.",
  },
  {
    src: Bag1,
    alt: "Individual supply bag ready for distribution",
    title: "Supply Preparation",
    description: "Carefully prepared bags ensuring quality and completeness.",
  },
  {
    src: Bag2,
    alt: "Supply bag packed with essential items",
    title: "Essential Items Packing",
    description: "Each bag packed with carefully selected essential items.",
  },
  {
    src: Bag3,
    alt: "Ready-to-distribute supply package",
    title: "Distribution Ready",
    description: "Final checks before community distribution.",
  },
  {
    src: BagsGathering,
    alt: "Multiple supply bags being gathered for distribution",
    title: "Bulk Distribution Setup",
    description: "Organizing large-scale distribution to maximize impact.",
  },
  {
    src: BagsGathering2,
    alt: "Team coordinating bag distribution logistics",
    title: "Logistics Team",
    description: "Our logistics team ensuring smooth distribution operations.",
  },
  {
    src: Bags,
    alt: "Collection of Blocklift supply bags",
    title: "Supply Collection",
    description: "Complete collection of supplies ready for communities.",
  },
];

const ITEMS_PER_PAGE = 4;

const GalleryItem = ({ item }: { item: (typeof galleryItems)[0] }) => {
  return (
    <div className="gallery-item-card relative overflow-hidden rounded-xl bg-background border border-border aspect-[4/3]">
      <img
        src={item.src}
        alt={item.alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading={item.priority ? "eager" : "lazy"}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
      />
      <div className="relative z-10 flex flex-col justify-end h-full p-6">
        <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
        <p className="text-sm text-white mt-2 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default function ImpactGallery() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(galleryItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = galleryItems.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      // Scroll to gallery section smoothly
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      // Scroll to gallery section smoothly
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
  }, [currentPage]);

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
          {currentItems.map((item, i) => (
            <GalleryItem item={item} key={startIndex + i} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => goToPage(page)}
                className="w-10 h-10"
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Page Info */}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} ({galleryItems.length} total
          images)
        </div>
      </div>
    </section>
  );
}
