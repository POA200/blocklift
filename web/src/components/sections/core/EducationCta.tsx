import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "../../ui/card"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"

export default function EducationCta() {
  return (
    <section id="education-cta" className="w-full py-10">
      <div className="max-w-7xl mx-auto px-6">
        <Card className="border border-primary bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-primary">Start Your Web3 Journey</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Beyond the classroom: Access educational content on Bitcoin, Stacks, Clarity Smart Contracts, and the future of decentralized technology.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <div className="relative inline-block">
              <Button disabled aria-disabled className="cursor-not-allowed">
                Explore the Education Portal
              </Button>
              <Badge className="absolute -top-2 -right-2" variant="secondary">
                Coming soon
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
