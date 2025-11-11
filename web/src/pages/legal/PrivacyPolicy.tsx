// React import not required with the new JSX transform, keep file simple
import SimpleHeader from '../../components/simple-header'
import SimpleFooter from '../../components/simple-footer'

export default function PrivacyPolicy() {
  return (
    <div>
      <SimpleHeader />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">This is a placeholder Privacy Policy. Replace this with the project's real privacy policy text.</p>
        <section>
          <h2 className="font-semibold">Data we collect</h2>
          <p className="text-sm text-muted-foreground">We collect only the minimal data necessary to provide services. This is demo content.</p>
        </section>
      </main>
      <SimpleFooter />
    </div>
  )
}
