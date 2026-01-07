import { useEffect, useMemo, useState } from "react";
import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ArticleUploadDialog from "@/components/sections/core/ArticleUploadDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Trash2, X } from "lucide-react";

type BlogSummary = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
};

export default function Admin() {
  const [active, setActive] = useState<"blog" | "gallery" | "education">(
    "blog"
  );
  const [authToken, setAuthToken] = useState<string>("");
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passErr, setPassErr] = useState<string | null>(null);
  const expectedPass =
    (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined) ||
    (import.meta.env.VITE_GALLERY_UPLOAD_CODE as string | undefined) ||
    "";

  // Persist token locally for convenience
  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t) setAuthToken(t);
  }, []);
  useEffect(() => {
    if (authToken) localStorage.setItem("admin_token", authToken);
  }, [authToken]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setPassErr(null);
    const expected = (expectedPass || "").trim();
    if (!expected) {
      // No expected pass configured: fail closed to avoid accidental exposure
      setPassErr("Admin passcode is not configured");
      return;
    }
    if (passcode.trim() !== expected) {
      setPassErr("Invalid passcode");
      return;
    }
    setUnlocked(true);
    // If no token set yet, reuse the passcode as token for convenience
    if (!authToken) {
      setAuthToken(passcode.trim());
    }
    setPasscode("");
  };

  return (
    <div>
      <Seo
        title="Admin - BlockLift"
        description="Manage content across the site"
        noindex={true}
      />
      <SimpleHeader />
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        {!unlocked ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Enter Admin Passcode</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUnlock} className="space-y-3">
                  <Input
                    type="password"
                    placeholder="Passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                  />
                  {passErr && (
                    <div className="text-sm text-red-500">{passErr}</div>
                  )}
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Unlock
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setUnlocked(false)}>
                  Lock
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={active === "blog" ? "default" : "outline"}
                onClick={() => setActive("blog")}
              >
                Blog
              </Button>
              <Button
                variant={active === "gallery" ? "default" : "outline"}
                onClick={() => setActive("gallery")}
              >
                Gallery
              </Button>
              <Button
                variant={active === "education" ? "default" : "outline"}
                onClick={() => setActive("education")}
              >
                Education
              </Button>
            </div>

            {active === "blog" && <BlogAdmin authToken={authToken} />}
            {active === "gallery" && <GalleryAdmin authToken={authToken} />}
            {active === "education" && <EducationAdmin authToken={authToken} />}
          </>
        )}
      </main>
      <SimpleFooter />
    </div>
  );
}

function BlogAdmin({ authToken }: { authToken: string }) {
  const [posts, setPosts] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  const backendUrl = useMemo(
    () => import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
    []
  );

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/blog/posts`);
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      if (data.success) setPosts(data.posts as BlogSummary[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      if (!authToken.trim()) throw new Error("Unlock required");
      const res = await fetch(`${backendUrl}/api/blog/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Create failed");
      setSubmitMsg("Post created successfully");
      setForm({
        title: "",
        slug: "",
        category: "",
        excerpt: "",
        content: "",
        date: "",
      });
      await loadPosts();
    } catch (e) {
      setSubmitMsg(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitMsg(null), 2500);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete post ${slug}?`)) return;
    try {
      if (!authToken.trim()) throw new Error("Unlock required");
      const res = await fetch(`${backendUrl}/api/blog/posts/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false)
        throw new Error(data.error || "Delete failed");
      await loadPosts();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Blog Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={handleCreate} className="space-y-3">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            <Input
              placeholder="Slug (optional, auto from title)"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
            <Input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            />
            <Input
              placeholder="Date (optional, e.g. Jan 2, 2026)"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            <Input
              placeholder="Excerpt"
              value={form.excerpt}
              onChange={(e) =>
                setForm((f) => ({ ...f, excerpt: e.target.value }))
              }
            />
            <textarea
              placeholder="Content (Markdown)"
              className="w-full min-h-[220px] border rounded px-3 py-2 bg-background"
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
            />
            {submitMsg && (
              <div className="text-sm text-center text-muted-foreground">
                {submitMsg}
              </div>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                Create
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setForm({
                    title: "",
                    slug: "",
                    category: "",
                    excerpt: "",
                    content: "",
                    date: "",
                  })
                }
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No posts yet.</div>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <div
                  key={p.slug}
                  className="border rounded p-3 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.category} • {p.date}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {p.excerpt}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      className="text-sm underline"
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(p.slug)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function GalleryAdmin({ authToken }: { authToken: string }) {
  const backendUrl = useMemo(
    () => import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
    []
  );

  type RemoteImage = { src: string; alt: string; filename: string };
  const [images, setImages] = useState<RemoteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteFilename, setDeleteFilename] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/gallery/images`);
      if (!res.ok) throw new Error("Failed to load images");
      const data = await res.json();
      setImages(data.images as RemoteImage[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const onDeleteClick = (filename: string) => {
    setDeleteFilename(filename);
    setDeleteError(null);
    setDeleteSuccess(null);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      const res = await fetch(
        `${backendUrl}/api/gallery/delete/${encodeURIComponent(
          deleteFilename
        )}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${authToken}` } }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to delete image");
      setDeleteSuccess("Image deleted successfully");
      await loadImages();
      setTimeout(() => setIsDeleteOpen(false), 1200);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Failed to delete image");
    } finally {
      setDeleting(false);
    }
  };

  const onUpload = async () => {
    if (files.length === 0) {
      setUploadError("Please select at least one image");
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("imageFile", file);
        const res = await fetch(`${backendUrl}/api/gallery/upload-image`, {
          method: "POST",
          body: fd,
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `Failed to upload ${file.name}`);
        }
      }
      setUploadSuccess(`Successfully uploaded ${files.length} image(s)`);
      setFiles([]);
      await loadImages();
      setTimeout(() => setIsUploadOpen(false), 1500);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gallery Images</h3>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-2" /> Upload Images
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading images…</div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : images.length === 0 ? (
        <div className="text-sm text-muted-foreground">No uploaded images.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img) => (
            <div
              key={img.filename}
              className="relative group border rounded overflow-hidden"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-40 object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDeleteClick(img.filename)}
                aria-label={`Delete ${img.filename}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div
                className="px-2 py-1 text-[10px] text-muted-foreground truncate"
                title={img.filename}
              >
                {img.filename}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Impact Images</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/10">
              <Upload className="h-5 w-5" />
              <span>Click to select images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="hidden"
              />
            </label>
            <p className="text-xs text-muted-foreground text-center">
              Select one or multiple images to upload
            </p>

            {files.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 bg-accent/20 rounded"
                  >
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {uploadError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded">
                {uploadSuccess}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={onUpload}
                disabled={uploading || files.length === 0}
                className="flex-1"
              >
                {uploading ? "Uploading..." : `Upload ${files.length} Image(s)`}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadOpen(false);
                  setFiles([]);
                  setUploadError(null);
                  setUploadSuccess(null);
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            {deleteError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {deleteError}
              </div>
            )}
            {deleteSuccess && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded">
                {deleteSuccess}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1"
              >
                {deleting ? "Deleting..." : "Delete Image"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteError(null);
                  setDeleteSuccess(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EducationAdmin({ authToken }: { authToken: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Education Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          The admin unlock pass is used for uploads.
        </div>
        <ArticleUploadDialog forcedToken={authToken} />
        <div className="prose prose-sm dark:prose-invert">
          <h4>Tip</h4>
          <p>
            After upload, refresh the Education page to see the new item in the
            list.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
