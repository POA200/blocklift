import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ArticleUploadDialogProps {
  onArticleAdded?: () => void;
}

const CATEGORIES = [
  "Bitcoin/Web3 Basics",
  "Stacks Layer 2",
  "Clarity Smart Contracts",
  "BlockLift Technology",
] as const;

const TYPES = ["article", "video", "code"] as const;

export default function ArticleUploadDialog({
  onArticleAdded,
}: ArticleUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadToken, setUploadToken] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    category: "" as (typeof CATEGORIES)[number] | "",
    type: "" as (typeof TYPES)[number] | "",
    content: "",
    videoUrl: "",
    codeSnippet: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!uploadToken.trim()) {
        setError("Please enter the upload token");
        setLoading(false);
        return;
      }

      if (
        !formData.title ||
        !formData.summary ||
        !formData.category ||
        !formData.type ||
        !formData.content
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${backendUrl}/api/education/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${uploadToken}`,
        },
        body: JSON.stringify({
          title: formData.title,
          summary: formData.summary,
          category: formData.category,
          type: formData.type,
          content: formData.content,
          videoUrl: formData.videoUrl || undefined,
          codeSnippet: formData.codeSnippet || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload article");
      }

      setSuccess(true);
      setFormData({
        title: "",
        summary: "",
        category: "",
        type: "",
        content: "",
        videoUrl: "",
        codeSnippet: "",
      });
      setUploadToken("");

      setTimeout(() => {
        setOpen(false);
        onArticleAdded?.();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          + Upload Content
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Upload New Education Article</DialogTitle>
          <DialogDescription>
            Share your knowledge with the BlockLift community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload Token */}
          <div className="space-y-2">
            <label
              htmlFor="uploadToken"
              className="block text-sm font-medium text-foreground"
            >
              Upload Token *
            </label>
            <input
              type="password"
              id="uploadToken"
              value={uploadToken}
              onChange={(e) => setUploadToken(e.target.value)}
              placeholder="Enter upload token"
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {!uploadToken.trim() && (
              <p className="text-xs text-red-500">
                Token is required to upload articles
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground"
            >
              Title *
            </label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Understanding DeFi on Bitcoin"
              value={formData.title}
              onChange={handleChange}
              className="bg-background border-[var(--border)] text-foreground"
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-foreground"
            >
              Summary *
            </label>
            <Input
              id="summary"
              name="summary"
              placeholder="Brief description of the article"
              value={formData.summary}
              onChange={handleChange}
              className="bg-background border-[var(--border)] text-foreground"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-foreground"
            >
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleSelectChange("category", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-[var(--border)] rounded-md text-foreground"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-foreground"
            >
              Type *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleSelectChange("type", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-[var(--border)] rounded-md text-foreground"
            >
              <option value="">Select a type</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-foreground"
            >
              Content (Markdown) *
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Enter article content in Markdown format"
              value={formData.content}
              onChange={handleChange}
              className="w-full min-h-[200px] px-3 py-2 bg-background border border-[var(--border)] rounded-md text-foreground"
            />
          </div>

          {/* Video URL (conditional) */}
          {formData.type === "video" && (
            <div className="space-y-2">
              <label
                htmlFor="videoUrl"
                className="block text-sm font-medium text-foreground"
              >
                Video URL
              </label>
              <Input
                id="videoUrl"
                name="videoUrl"
                placeholder="https://www.youtube.com/embed/..."
                value={formData.videoUrl}
                onChange={handleChange}
                className="bg-background border-[var(--border)] text-foreground"
              />
            </div>
          )}

          {/* Code Snippet (conditional) */}
          {formData.type === "code" && (
            <div className="space-y-2">
              <label
                htmlFor="codeSnippet"
                className="block text-sm font-medium text-foreground"
              >
                Code Snippet
              </label>
              <textarea
                id="codeSnippet"
                name="codeSnippet"
                placeholder="Enter your code here"
                value={formData.codeSnippet}
                onChange={handleChange}
                className="w-full min-h-[150px] px-3 py-2 font-mono text-sm bg-background border border-[var(--border)] rounded-md text-foreground"
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="p-3 bg-green-500/20 border border-green-500/40 rounded text-green-400 text-sm">
              Article uploaded successfully! Reloading...
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Uploading..." : "Upload Article"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
