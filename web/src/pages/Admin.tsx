import { useEffect, useMemo, useState } from "react";
import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Upload, Trash2, X } from "lucide-react";

type BlogSummary = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
};

type EducationCourse = {
  id: string;
  title: string;
  summary: string;
  category:
    | "Bitcoin/Web3 Basics"
    | "Stacks Layer 2"
    | "Clarity Smart Contracts"
    | "BlockLift Technology";
  type: "article" | "video" | "code";
};

export default function Admin() {
  const [active, setActive] = useState<
    "blog" | "gallery" | "education" | "metrics"
  >("blog");
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

            <div className="flex gap-2 flex-wrap">
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
              <Button
                variant={active === "metrics" ? "default" : "outline"}
                onClick={() => setActive("metrics")}
              >
                Metrics & Distributions
              </Button>
            </div>

            {active === "blog" && <BlogAdmin authToken={authToken} />}
            {active === "gallery" && <GalleryAdmin authToken={authToken} />}
            {active === "education" && <EducationAdmin authToken={authToken} />}
            {active === "metrics" && (
              <AdminDashboard
                apiUrl={import.meta.env.VITE_API_URL || "http://localhost:3000"}
              />
            )}
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
    category: "",
    excerpt: "",
    content: "",
    link: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  const blogCategories = [
    "Stacks",
    "Community",
    "Blockchain",
    "Impact",
    "Tutorial",
    "Product",
  ];

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
        category: "",
        excerpt: "",
        content: "",
        link: "",
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
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Blog post title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category *</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full border rounded px-3 py-2 bg-background"
              >
                <option value="">Select a category</option>
                {blogCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Short Description *</label>
              <Input
                placeholder="Brief excerpt for the blog list"
                value={form.excerpt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, excerpt: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Read More Link</label>
              <Input
                placeholder="e.g., /blog/post-slug or https://external-link.com"
                value={form.link}
                onChange={(e) =>
                  setForm((f) => ({ ...f, link: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Content (Markdown) *
              </label>
              <textarea
                placeholder="Full blog content in Markdown"
                className="w-full min-h-[220px] border rounded px-3 py-2 bg-background"
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Date is automatically set to today.
            </div>
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
                    category: "",
                    excerpt: "",
                    content: "",
                    link: "",
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
  const [courses, setCourses] = useState<EducationCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    category: "",
    type: "article",
    content: "",
    videoUrl: "",
    codeSnippet: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  const educationCategories = [
    "Bitcoin/Web3 Basics",
    "Stacks Layer 2",
    "Clarity Smart Contracts",
    "BlockLift Technology",
  ];

  const educationTypes = ["article", "video", "code"];

  const backendUrl = useMemo(
    () => import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
    []
  );

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/education/courses`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses as EducationCourse[]);
          return;
        }
      }

      // Fallback for older backend versions that only expose /items
      const fallback = await fetch(`${backendUrl}/api/education/items`);
      if (!fallback.ok) throw new Error("Failed to load courses");
      const data = await fallback.json();
      if (data.items) {
        setCourses(data.items as EducationCourse[]);
        return;
      }

      throw new Error("Failed to load courses");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      if (!authToken.trim()) throw new Error("Unlock required");
      const res = await fetch(`${backendUrl}/api/education/courses`, {
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
      setSubmitMsg("Course created successfully");
      setForm({
        title: "",
        summary: "",
        category: "",
        type: "article",
        content: "",
        videoUrl: "",
        codeSnippet: "",
      });
      await loadCourses();
    } catch (e) {
      setSubmitMsg(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitMsg(null), 2500);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this course?`)) return;
    try {
      if (!authToken.trim()) throw new Error("Unlock required");
      const res = await fetch(`${backendUrl}/api/education/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false)
        throw new Error(data.error || "Delete failed");
      await loadCourses();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Education Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Course title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Summary *</label>
              <Input
                placeholder="Brief course description"
                value={form.summary}
                onChange={(e) =>
                  setForm((f) => ({ ...f, summary: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category *</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full border rounded px-3 py-2 bg-background"
              >
                <option value="">Select a category</option>
                {educationCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Type *</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                className="w-full border rounded px-3 py-2 bg-background"
              >
                {educationTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">
                Content (Markdown) *
              </label>
              <textarea
                placeholder="Full course content in Markdown"
                className="w-full min-h-[150px] border rounded px-3 py-2 bg-background"
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Video URL (optional)
              </label>
              <Input
                placeholder="e.g., https://youtube.com/watch?v=..."
                value={form.videoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, videoUrl: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Code Snippet (optional)
              </label>
              <textarea
                placeholder="Code example in markdown format"
                className="w-full min-h-[100px] border rounded px-3 py-2 bg-background font-mono text-xs"
                value={form.codeSnippet}
                onChange={(e) =>
                  setForm((f) => ({ ...f, codeSnippet: e.target.value }))
                }
              />
            </div>
            {submitMsg && (
              <div className="text-sm text-center text-muted-foreground">
                {submitMsg}
              </div>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                Create Course
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setForm({
                    title: "",
                    summary: "",
                    category: "",
                    type: "article",
                    content: "",
                    videoUrl: "",
                    codeSnippet: "",
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
          <CardTitle>Existing Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : courses.length === 0 ? (
            <div className="text-sm text-muted-foreground">No courses yet.</div>
          ) : (
            <div className="space-y-3">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="border rounded p-3 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.category} • {c.type}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {c.summary}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
