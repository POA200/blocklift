import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../ui/card"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"

export default function BottomCta() {
  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-primary bg-primary text-foreground shadow-lg">
            <CardHeader>
              <Badge className="bg-secondary/10" variant={"outline"}>Donor/Brand</Badge>
              <CardTitle className="text-2xl md:text-3xl">Be the Spark: Sponsor an Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                Whether you are an individual or a brand, join our ecosystem of verifiable giving and receive on-chain proof.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full cursor-pointer" variant={'secondary'} >Sponsor Now!</Button>
            </CardFooter>
          </Card>

          <Card className="border border-[var(--primary)] bg-[color:var(--surface)]">
            <CardHeader>
              <Badge className="bg-primary/10" variant={'outline'}>Ambassador/Volunteer</Badge>
              <CardTitle className="text-2xl md:text-3xl">Join the Movement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Become a trusted field verifier, volunteer, or educational partner in your community.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full cursor-pointer">Volunteer</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
