import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { POSTS_MANIFEST } from "@/content/blog/index";
import { navigate } from "@/lib/router";

export default function BlogIndex() {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div>
      <Seo
        title="Blog - BlockLift News & Updates"
        description="Read the latest news, updates, and insights from BlockLift about blockchain transparency, community impact, and verified charitable giving."
        noindex={false}
      />
      <SimpleHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>

          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-wider text-primary mb-2">
              Our Blog
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              BlockLift News & Updates
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed about our latest distributions, blockchain
              innovations, community stories, and transparent impact
              initiatives.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POSTS_MANIFEST.map((post) => (
            <Card
              key={post.slug}
              className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg group"
              onClick={() => handlePostClick(post.slug)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {POSTS_MANIFEST.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        )}
      </main>
      <SimpleFooter />
    </div>
  );
}
