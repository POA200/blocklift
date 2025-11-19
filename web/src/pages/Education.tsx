import SimpleHeader from '@/components/simple-header'
import SimpleFooter from '@/components/simple-footer'
import { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import Seo from '@/components/Seo'

// Import sample markdown content (Vite raw imports)
import basicsLedgerMd from '@/content/education/basics/what-is-decentralized-ledger.md?raw'
import basicsHistoryMd from '@/content/education/basics/history-of-bitcoin.md?raw'
import stacksSecuredMd from '@/content/education/stacks/secured-by-bitcoin.md?raw'
import clarityIntroMd from '@/content/education/clarity/introduction-to-clarity.md?raw'
import clarityFtMd from '@/content/education/clarity/first-fungible-token.md?raw'
import blockliftNftMd from '@/content/education/blocklift/nft-proof-of-impact.md?raw'

// Types for scalable content structure
interface EducationItem {
  id: string
  title: string
  summary: string
  category: 'Bitcoin/Web3 Basics' | 'Stacks Layer 2' | 'Clarity Smart Contracts' | 'BlockLift Technology'
  type: 'article' | 'video' | 'code'
  // For future integration: path to markdown or video URL
  sourceId?: string
}

const ITEMS: EducationItem[] = [
  { id: 'basics-ledger', title: 'What is a Decentralized Ledger?', summary: 'Understand the foundations of blockchain data and consensus.', category: 'Bitcoin/Web3 Basics', type: 'article', sourceId: 'basics-ledger' },
  { id: 'basics-history', title: 'The History of Bitcoin', summary: 'From the whitepaper to global adoption and sound money debates.', category: 'Bitcoin/Web3 Basics', type: 'article', sourceId: 'basics-history' },

  { id: 'stacks-secured', title: 'Why Stacks is Secured by Bitcoin', summary: 'Learn how the Stacks layer leverages Bitcoin’s security guarantees.', category: 'Stacks Layer 2', type: 'article', sourceId: 'stacks-secured' },
  { id: 'stx-token', title: 'The STX Token Explained', summary: 'Utility, governance, and network incentives in the Stacks ecosystem.', category: 'Stacks Layer 2', type: 'article' },

  { id: 'clarity-intro', title: 'Introduction to Clarity', summary: 'A decidable smart contract language designed for security.', category: 'Clarity Smart Contracts', type: 'article', sourceId: 'clarity-intro' },
  { id: 'clarity-ft', title: 'Writing Your First Fungible Token (FT)', summary: 'Step-by-step to author and deploy a basic FT contract.', category: 'Clarity Smart Contracts', type: 'code', sourceId: 'clarity-ft' },

  { id: 'blocklift-nft-proof', title: 'How Our NFT Proof of Impact Works', summary: 'Traceable, verifiable impact artifacts on chain.', category: 'BlockLift Technology', type: 'article', sourceId: 'blocklift-nft-proof' },
  { id: 'boom-wallet', title: 'Using the Boom Wallet', summary: 'Wallet workflows and tips for BlockLift participants.', category: 'BlockLift Technology', type: 'video' },
]

const MD_BY_ID: Record<string, string> = {
  'basics-ledger': basicsLedgerMd,
  'basics-history': basicsHistoryMd,
  'stacks-secured': stacksSecuredMd,
  'clarity-intro': clarityIntroMd,
  'clarity-ft': clarityFtMd,
  'blocklift-nft-proof': blockliftNftMd,
}

const CATEGORIES = [
  'Bitcoin/Web3 Basics',
  'Stacks Layer 2',
  'Clarity Smart Contracts',
  'BlockLift Technology',
] as const

type Category = typeof CATEGORIES[number]

export default function Education() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<Category | 'All'>('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const base = active === 'All' ? ITEMS : ITEMS.filter(i => i.category === active)
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter(i => i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q))
  }, [active, query])

  const selected = useMemo(() => ITEMS.find(i => i.id === selectedId) || null, [selectedId])

  return (
    <div>
      <Seo
        title="Education Hub"
        description="Curated resources on Bitcoin, Stacks, Clarity, and BlockLift technology. Learn, build, and verify on-chain impact."
      />
      <SimpleHeader />
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Section 1: Overview + Filters/Search */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Education Portal</h1>
          <p className="text-sm text-muted-foreground mb-6">Explore curated resources on Bitcoin, Stacks, Clarity, and BlockLift tech. Filter by category or search by keyword.</p>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button variant={active === 'All' ? 'default' : 'outline'} onClick={() => setActive('All')}>All</Button>
            {CATEGORIES.map(cat => (
              <Button key={cat} variant={active === cat ? 'default' : 'outline'} onClick={() => setActive(cat)}>
                {cat}
              </Button>
            ))}
            <div className="ml-auto w-full sm:w-72">
              <Input placeholder="Search topics..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Two-column layout: list on left, content on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {filtered.map(item => (
              <Card key={item.id} className="border border-[var(--border)] bg-[var(--surface)] cursor-pointer" onClick={() => setSelectedId(item.id)}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-xs font-medium text-primary">{item.type.toUpperCase()}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{item.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.summary}</p>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">No topics match your search.</p>
            )}
          </div>

          <div className="lg:col-span-2">
            {!selected && (
              <Card className="border border-primary/40 bg-[var(--surface)]">
                <CardHeader>
                  <CardTitle>Welcome to the Education Hub</CardTitle>
                  <CardDescription className="text-sm">Select a topic from the left to view details here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">This space will render rich content: articles (Markdown), videos, and code examples. For the MVP, content is summarized. In the next iteration, we’ll store Markdown files and render them via <code>react-markdown</code>.</p>
                </CardContent>
              </Card>
            )}

            {selected && (
              <Card className="border border-[var(--border)] bg-[var(--surface)]">
                <CardHeader>
                  <CardTitle>{selected.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{selected.category} · {selected.type.toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {selected.type === 'video' && (
                    <div className="aspect-video rounded-md overflow-hidden border border-[var(--border)] bg-black/5 mb-4 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Video placeholder</span>
                    </div>
                  )}
                  {selected.type === 'code' && (
                    <pre className="text-xs p-4 rounded-md border border-[var(--border)] bg-background overflow-auto mb-4">
{`;; Clarity FT skeleton (placeholder)\n(define-fungible-token token-name)\n(define-public (transfer (amount uint) (sender principal) (recipient principal))\n  (ok true))`}
                    </pre>
                  )}
                  {selected.type === 'article' && (
                    <div className="prose prose-invert max-w-none text-foreground">
                      <ReactMarkdown>
                        {MD_BY_ID[selected.sourceId || ''] || selected.summary}
                      </ReactMarkdown>
                    </div>
                  )}
                  {selected.type !== 'article' && (
                    <p className="text-sm text-foreground">
                      {selected.summary} This is placeholder content. In a future version, this area will render Markdown or embed media from the item’s source.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}
