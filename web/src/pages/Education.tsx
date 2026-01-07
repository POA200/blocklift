import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import Seo from "@/components/Seo";

// Types for scalable content structure
interface EducationItem {
  id: string;
  title: string;
  summary: string;
  category:
    | "Bitcoin/Web3 Basics"
    | "Stacks Layer 2"
    | "Clarity Smart Contracts"
    | "BlockLift Technology";
  type: "article" | "video" | "code";
  sourceId?: string;
  content?: string;
  videoUrl?: string;
  codeSnippet?: string;
}

const CATEGORIES = [
  "Bitcoin/Web3 Basics",
  "Stacks Layer 2",
  "Clarity Smart Contracts",
  "BlockLift Technology",
] as const;

type Category = (typeof CATEGORIES)[number];

export default function Education() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Category | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState<EducationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<EducationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Function to fetch items (reusable)
  const fetchItems = async () => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      console.log("Fetching from:", `${backendUrl}/api/education/items`);
      const response = await fetch(`${backendUrl}/api/education/items`);
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        setItems(data.items);
        console.log("Items set:", data.items.length);
      }
    } catch (error) {
      console.error("Error fetching education items:", error);
    }
  };

  // Fetch education items on mount
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      await fetchItems();
      setLoading(false);
    };

    loadItems();
  }, []);

  // Fetch full content when item is selected
  useEffect(() => {
    const fetchItemDetail = async () => {
      if (!selectedId) {
        setSelectedItem(null);
        return;
      }

      setLoadingDetail(true);
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(
          `${backendUrl}/api/education/items/${selectedId}`
        );
        const data = await response.json();

        if (data.success) {
          setSelectedItem(data.item);
        }
      } catch (error) {
        console.error("Error fetching education item detail:", error);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchItemDetail();
  }, [selectedId]);

  const filtered = useMemo(() => {
    const base =
      active === "All" ? items : items.filter((i) => i.category === active);
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(
      (i) =>
        i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q)
    );
  }, [active, query, items]);

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
          <div className="mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Education Portal
              </h1>
              <p className="text-sm text-muted-foreground">
                Explore curated resources on Bitcoin, Stacks, Clarity, and
                BlockLift tech. Filter by category or search by keyword.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button
              variant={active === "All" ? "default" : "outline"}
              onClick={() => setActive("All")}
            >
              All
            </Button>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={active === cat ? "default" : "outline"}
                onClick={() => setActive(cat)}
              >
                {cat}
              </Button>
            ))}
            <div className="ml-auto w-full sm:w-72">
              <Input
                placeholder="Search topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Two-column layout: list on left, content on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading education content...
              </p>
            ) : (
              <>
                {filtered.map((item) => (
                  <Card
                    key={item.id}
                    className="border border-[var(--border)] bg-[var(--surface)] cursor-pointer hover:bg-[var(--surface)]/80 transition-colors"
                    onClick={() => setSelectedId(item.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        {item.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        {item.summary}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No topics match your search.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-2">
            {!selectedItem && !loadingDetail && (
              <Card className="border border-primary/40 bg-[var(--surface)]">
                <CardHeader>
                  <CardTitle>Welcome to the Education Hub</CardTitle>
                  <CardDescription className="text-sm">
                    Select a topic from the left to view details here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This space will render rich content: articles (Markdown),
                    videos, and code examples.
                  </p>
                </CardContent>
              </Card>
            )}

            {loadingDetail && (
              <Card className="border border-[var(--border)] bg-[var(--surface)]">
                <CardContent className="py-16 text-center">
                  <p className="text-sm text-muted-foreground">
                    Loading content...
                  </p>
                </CardContent>
              </Card>
            )}

            {selectedItem && !loadingDetail && (
              <Card className="border border-[var(--border)] bg-[var(--surface)]">
                <CardHeader>
                  <CardTitle>{selectedItem.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    {selectedItem.category} · {selectedItem.type.toUpperCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedItem.type === "video" && (
                    <div className="aspect-video rounded-md overflow-hidden border border-[var(--border)] bg-black/5 mb-4 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        Video placeholder
                      </span>
                    </div>
                  )}
                  {selectedItem.type === "code" && (
                    <pre className="text-xs p-4 rounded-md border border-[var(--border)] bg-background overflow-auto mb-4">
                      {`;; Clarity FT skeleton (placeholder)\n(define-fungible-token token-name)\n(define-public (transfer (amount uint) (sender principal) (recipient principal))\n  (ok true))`}
                    </pre>
                  )}
                  {selectedItem.type === "article" && selectedItem.content && (
                    <div className="prose prose-invert max-w-none text-foreground">
                      <ReactMarkdown>{selectedItem.content}</ReactMarkdown>
                    </div>
                  )}
                  {selectedItem.type === "code" && selectedItem.codeSnippet && (
                    <pre className="text-xs p-4 rounded-md border border-[var(--border)] bg-background overflow-auto mb-4">
                      {selectedItem.codeSnippet}
                    </pre>
                  )}
                  {selectedItem.type === "video" && selectedItem.content && (
                    <div className="prose prose-invert max-w-none text-foreground">
                      <ReactMarkdown>{selectedItem.content}</ReactMarkdown>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
