// React import not required with the new JSX transform, keep file simple
import SimpleHeader from '../../components/simple-header'
import SimpleFooter from '../../components/simple-footer'
import Seo from '../../components/Seo'

export default function Terms() {
  return (
    <div>
      <Seo
        title="Terms & Conditions"
        description="BlockLift terms and conditions."
        noindex={false}
      />
      <SimpleHeader />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
        <p className="mb-4">This is a placeholder Terms & Conditions page. Replace with official terms for production.</p>
        <section>
          <h2 className="font-semibold">Usage</h2>
          <p className="text-sm text-muted-foreground">By using this site you agree to these demo terms.</p>
        </section>
      </main>
      <SimpleFooter />
    </div>
  )
}
