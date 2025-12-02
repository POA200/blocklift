import { useEffect, useState } from "react";
import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import Seo from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar } from "lucide-react";
import { POSTS_MANIFEST } from "@/content/blog/index";
import { navigate } from "@/lib/router";
import ReactMarkdown from "react-markdown";

interface BlogPostProps {
  slug: string;
}

export default function BlogPost({ slug }: BlogPostProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const post = POSTS_MANIFEST.find((p) => p.slug === slug);

  useEffect(() => {
    if (!post) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    fetch(`/content/blog/${slug}.md`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post content");
        }
        return response.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading blog post:", err);
        setError(true);
        setLoading(false);
      });
  }, [slug, post]);

  const handleGoBack = () => {
    navigate("/blog");
  };

  if (!post) {
    return (
      <div>
        <Seo title="Post Not Found - BlockLift" noindex={true} />
        <SimpleHeader />
        <main className="mx-auto max-w-4xl px-6 py-12">
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The blog post you're looking for doesn't exist.
              </p>
              <Button onClick={handleGoBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </CardContent>
          </Card>
        </main>
        <SimpleFooter />
      </div>
    );
  }

  return (
    <div>
      <Seo
        title={`${post.title} - BlockLift Blog`}
        description={post.excerpt}
        noindex={false}
      />
      <SimpleHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>

        <Card className="border-2">
          <CardContent className="py-8 px-6 md:px-12">
            {/* Post Header */}
            <div className="mb-8 pb-8 border-b">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {post.title}
              </h1>
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            </div>

            {/* Post Content */}
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Failed to load post content. Please try again later.
                </p>
                <Button onClick={handleGoBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </div>
            )}

            {!loading && !error && content && (
              <article className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mt-8 mb-4">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold mt-6 mb-3">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ml-6 mb-4 space-y-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-6 mb-4 space-y-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-muted-foreground">{children}</li>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="text-primary hover:underline font-medium"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    hr: () => <hr className="my-8 border-border" />,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </article>
            )}
          </CardContent>
        </Card>

        {/* Back Button at Bottom */}
        <div className="mt-8 text-center">
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Posts
          </Button>
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
}
