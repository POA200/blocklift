import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";

interface BlogProps {
  slug?: string;
}

export default function Blog({ slug }: BlogProps) {
  // If slug is provided, show single post view
  if (slug) {
    return <BlogPost slug={slug} />;
  }

  // Otherwise show blog index
  return <BlogIndex />;
}
