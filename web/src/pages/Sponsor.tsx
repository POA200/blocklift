import { useNavigate } from "react-router-dom";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Package, MapPin } from "lucide-react";
import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import BlockliftLogo from "@/assets/images/BlockliftLogo.png";

export default function Sponsor() {
  const navigate = useNavigate();

  const handlePrimary = () => navigate("/pay");

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-background text-foreground">
        <Seo
          title="Sponsor Impact"
          description="Donate with verifiable, on-chain proof to fund essential education materials and Web3 literacy."
        />
        <main className="w-full mx-auto px-6 py-32 max-w-7xl">
          {/* Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center mb-16 py-16">
            {/* Left Logo */}
            <div className="flex justify-center lg:justify-start">
              <img
                src={BlockliftLogo}
                alt="BlockLift logo"
                className="h-80 w-auto drop-shadow-sm select-none"
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Right Content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-4xl font-medium">
                Verifiable Impact!
              </h1>
              <h1 className="text-2xl md:text-4xl font-medium mb-6">
                Secure Your Legacy on the
                <span className="text-primary"> Bitcoin L2.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
                BlockLift guarantees that every penny funds essential school
                materials, transforming communities with 100% on-chain
                transparency.
              </p>
              <Button
                onClick={handlePrimary}
                className="cursor-pointer w-fit"
                size={"lg"}
                aria-label="Sponsor impact now"
              >
                Sponsor An Impact Today →
              </Button>
            </div>
          </section>

          {/* Trust & Security Bar */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-20">
            <div className="flex items-center gap-2 bg-accent/40 rounded-md px-4 py-2">
              <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
              <Badge
                className="text-xs"
                variant={"outline"}
                aria-label="On-chain verification"
              >
                100% On-Chain Verification
              </Badge>
            </div>
            <div className="flex items-center gap-2 bg-accent/40 rounded-md px-4 py-2">
              <Package className="h-4 w-4 text-primary" aria-hidden="true" />
              <Badge
                className="text-xs"
                variant={"outline"}
                aria-label="Backed by Stacks and Bitcoin"
              >
                Backed by Stacks & Bitcoin
              </Badge>
            </div>
            <div className="flex items-center gap-2 bg-accent/40 rounded-md px-4 py-2">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              <Badge
                className="text-xs"
                variant={"outline"}
                aria-label="Verified locally"
              >
                Verified by Local Ambassadors
              </Badge>
            </div>
          </section>

          {/* Three Pillar Value Proposition */}
          <section className="grid gap-8 md:grid-cols-3 mb-24">
            <Card className="border-border bg-card/90 backdrop-blur">
              <CardHeader>
                <CardTitle>Fund Essentials, Not Overhead.</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Your donation directly procures supplies (bags, sandals, books)
                for children who need them most, eliminating administrative
                waste.
              </CardContent>
            </Card>
            <Card className="border-border bg-card/90 backdrop-blur">
              <CardHeader>
                <CardTitle>Blockchain-Secured Proof.</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Every delivery is recorded by a field verifier and instantly
                generates an{" "}
                <strong className="font-semibold">NFT Proof of Impact</strong>{" "}
                for guaranteed auditability.
              </CardContent>
            </Card>
            <Card className="border-border bg-card/90 backdrop-blur">
              <CardHeader>
                <CardTitle>Building Web3 Literacy.</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Beyond supplies, you fund educational sessions introducing
                students to Bitcoin and the future of decentralized finance.
              </CardContent>
            </Card>
          </section>

          {/* Secondary CTA */}
          <section className="text-center">
            <p className="mt-4 text-xs text-muted-foreground tracking-wide">
              Secure a transparent impact record — audited by the community.
            </p>
          </section>
        </main>
      </div>
      <SimpleFooter />
    </>
  );
}
