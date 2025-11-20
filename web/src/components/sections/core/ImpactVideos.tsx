import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImpactVideoItem {
  id: string;
  title: string;
  description: string;
}

// Playlist of impact-related YouTube videos.
const IMPACT_VIDEOS: ImpactVideoItem[] = [
  {
    id: "Oe421EPjeBE", // Example: Blockchain / crypto explainer
    title: "Verifiable Impact Overview",
    description:
      "Introduction to how on-chain proofs enhance transparency for aid logistics.",
  },
  {
    id: "dQw4w9WgXcQ", // Placeholder popular video ID
    title: "Field Verification Walkthrough",
    description:
      "Step-by-step demonstration of validating deliveries with cryptographic attestations.",
  },
  {
    id: "9bZkp7q19f0", // Placeholder second sample
    title: "Community Education Session",
    description:
      "Empowering local ambassadors with tools for transparent reporting and auditing.",
  },
];

export default function ImpactVideos() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentVideoId = IMPACT_VIDEOS[currentVideoIndex].id;
  const progressPercent =
    ((currentVideoIndex + 1) / IMPACT_VIDEOS.length) * 100;

  const handleNext = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % IMPACT_VIDEOS.length);
  };

  const handlePrev = () => {
    setCurrentVideoIndex(
      (prev) => (prev - 1 + IMPACT_VIDEOS.length) % IMPACT_VIDEOS.length
    );
  };

  return (
    <section id="impact-videos" className="py-16">
      <div className="max-w-5xl mx-auto px-6 flex flex-col gap-8">
        <header className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-semibold text-foreground">
            Impact Video Playlist
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Browse short clips showcasing transparent verification, field
            coordination, and education. Use the navigation controls to move
            through the playlist.
          </p>
        </header>

        {/* Responsive 16:9 video wrapper */}
        <div className="rounded-xl overflow-hidden bg-background border">
          <div className="relative pt-[56.25%]">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideoId}?rel=0`}
              title={IMPACT_VIDEOS[currentVideoIndex].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Navigation & Details */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="text-foreground">
              {IMPACT_VIDEOS[currentVideoIndex].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm leading-relaxed text-foreground/90">
              {IMPACT_VIDEOS[currentVideoIndex].description}
            </p>
            <div className="space-y-2">
              <Progress
                value={progressPercent}
                aria-label="Playlist progress"
              />
              <p className="text-xs text-muted-foreground">
                Video {currentVideoIndex + 1} of {IMPACT_VIDEOS.length}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                className="text-primary border-primary"
                onClick={handlePrev}
                aria-label="Previous video"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <Button
                variant="secondary"
                className="text-primary"
                onClick={handleNext}
                aria-label="Next video"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
