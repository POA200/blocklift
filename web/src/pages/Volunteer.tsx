import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import Seo from "@/components/Seo";

export default function Volunteer() {
  return (
    <div>
      <Seo
        title="Volunteer / Ambassador"
        description="Become a BlockLift volunteer or ambassador and help verify education impact on-chain."
      />
      <SimpleHeader />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Volunteer / Ambassador</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          Thanks for your interest. Please contact our team to become a field
          ambassador or volunteer.
        </p>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
          <p className="mb-4">
            Email:{" "}
            <a
              className="text-primary font-medium"
              href="mailto:blocklift.stx@gmail.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              blocklift.stx@gmail.com
            </a>
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            We'll follow up with onboarding information and a short verification
            training.
          </p>
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
}
