import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Upload, X, Trash2 } from "lucide-react";
import BlockliftBag from "/src/assets/images/BlockliftBag.jpg";
import BlockliftBag2 from "/src/assets/images/BlockliftBag2.jpg";
import BlockliftSandals from "/src/assets/images/BlockliftSandals.jpg";
import BlockliftImpact from "/src/assets/images/BlockliftImpact.jpg";
import BagGathered from "/src/assets/images/bag-gathered.jpg";
import BagGathering3 from "/src/assets/images/bag-gathering3.jpg";
import Bag1 from "/src/assets/images/bag1.jpg";
import Bag2 from "/src/assets/images/bag2.jpg";
import Bag3 from "/src/assets/images/bag3.jpg";
import BagsGathering from "/src/assets/images/bags-gathering.jpg";
import BagsGathering2 from "/src/assets/images/bags-gathering2.jpg";
import Bags from "/src/assets/images/bags.jpg";
import StaffsStudent1 from "/src/assets/images/staffs and student (1).jpg";
import StaffsStudent2 from "/src/assets/images/staffs and student (2).jpg";
import StaffsStudent3 from "/src/assets/images/staffs and student (3).jpg";
import StaffsStudent4 from "/src/assets/images/staffs and student (4).jpg";
import StaffsStudent5 from "/src/assets/images/staffs and student (5).jpg";
import StaffsStudent6 from "/src/assets/images/staffs and student (6).jpg";
import StaffsStudent7 from "/src/assets/images/staffs and student (7).jpg";
import StaffsStudent8 from "/src/assets/images/staffs and student (8).jpg";
import StaffsStudent9 from "/src/assets/images/staffs and student (9).jpg";
import StaffsStudent10 from "/src/assets/images/staffs and student (10).jpg";
import StaffsStudent11 from "/src/assets/images/staffs and student (11).jpg";
import StaffsStudent12 from "/src/assets/images/staffs and student (12).jpg";
import StaffsStudent13 from "/src/assets/images/staffs and student (13).jpg";
import StaffsStudent14 from "/src/assets/images/staffs and student (14).jpg";
import StaffsStudent15 from "/src/assets/images/staffs and student (15).jpg";

// All gallery items using Blocklift asset images
const galleryItems = [
  {
    src: BlockliftBag,
    alt: "Blocklift branded delivery bag filled with supplies",
    title: "Delivery Bag Distribution",
    description:
      "Branded supply bags prepared and dispatched to local communities.",
    priority: true,
  },
  {
    src: BlockliftBag2,
    alt: "Close-up of Blocklift bag during field logistics",
    title: "Field Logistics",
    description: "Coordinated packaging and routing of essential goods.",
  },
  {
    src: BlockliftSandals,
    alt: "New sandals provided to community members",
    title: "Footwear Support",
    description:
      "Distributing durable sandals to improve daily comfort and mobility.",
  },
  {
    src: BlockliftImpact,
    alt: "Impact verification snapshot documenting aid delivery",
    title: "Impact Verification",
    description:
      "Capturing verifiable evidence of transparent impact on-chain.",
  },
  {
    src: BagGathered,
    alt: "volunteers gathering supply bags",
    title: "Volunteers Gathering",
    description: "Volunteers coming together to organize essential supplies.",
  },
  {
    src: BagGathering3,
    alt: "Volunteers organizing supply distribution",
    title: "Volunteer Coordination",
    description: "Dedicated volunteers organizing efficient distribution.",
  },
  {
    src: Bag1,
    alt: "Individual supply bag ready for distribution",
    title: "Supply Preparation",
    description: "Carefully prepared bags ensuring quality and completeness.",
  },
  {
    src: Bag2,
    alt: "Supply bag packed with essential items",
    title: "Essential Items Packing",
    description: "Each bag packed with carefully selected essential items.",
  },
  {
    src: Bag3,
    alt: "Ready-to-distribute supply package",
    title: "Distribution Ready",
    description: "Final checks before community distribution.",
  },
  {
    src: BagsGathering,
    alt: "Multiple supply bags being gathered for distribution",
    title: "Bulk Distribution Setup",
    description: "Organizing large-scale distribution to maximize impact.",
  },
  {
    src: BagsGathering2,
    alt: "Team coordinating bag distribution logistics",
    title: "Logistics Team",
    description: "Our logistics team ensuring smooth distribution operations.",
  },
  {
    src: Bags,
    alt: "Collection of Blocklift supply bags",
    title: "Supply Collection",
    description: "Complete collection of supplies ready for communities.",
  },
  {
    src: StaffsStudent1,
    alt: "Staff and students collaborating on impact initiatives",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent2,
    alt: "Educational engagement with students",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent3,
    alt: "Staff mentoring students in community programs",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent4,
    alt: "Students participating in community activities",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent5,
    alt: "Staff and students at community event",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent6,
    alt: "Educational workshop with students",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent7,
    alt: "Students receiving support and guidance",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent8,
    alt: "Collaborative learning environment",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent9,
    alt: "Staff and students in educational setting",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent10,
    alt: "Student engagement activities",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent11,
    alt: "Staff facilitating student programs",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent12,
    alt: "Students in community development initiative",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent13,
    alt: "Educational support and mentoring",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent14,
    alt: "Staff and students achieving milestones",
    title: null,
    description: null,
  },
  {
    src: StaffsStudent15,
    alt: "Community impact through education",
    title: null,
    description: null,
  },
];

const ITEMS_PER_PAGE = 4;

const GalleryItem = ({
  item,
  onDelete,
}: {
  item: (typeof galleryItems)[0] & { filename?: string };
  onDelete?: (filename: string) => void;
}) => {
  const canDelete = item.filename && onDelete;

  return (
    <div className="gallery-item-card relative overflow-hidden rounded-xl bg-background border border-border aspect-[4/3] group">
      <img
        src={item.src}
        alt={item.alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading={item.priority ? "eager" : "lazy"}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
      />

      {/* Delete button for uploaded images */}
      {canDelete && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          onClick={() => onDelete(item.filename!)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      <div className="relative z-10 flex flex-col justify-end h-full p-6">
        <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
        <p className="text-sm text-white mt-2 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};

const UploadImageButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="gallery-item-card relative overflow-hidden rounded-xl bg-background border border-border aspect-[4/3] flex items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors group"
    >
      <div className="text-center">
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
          📸
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Upload Impact Image(s)
        </h3>
        <p className="text-sm text-muted-foreground">
          Share your BlockLift moments
        </p>
      </div>
    </div>
  );
};

export default function ImpactGallery() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [uploadedImages, setUploadedImages] = useState<typeof galleryItems>([]);
  const [allImages, setAllImages] = useState(galleryItems);

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteFilename, setDeleteFilename] = useState("");
  const [deleteCode, setDeleteCode] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  // Fetch uploaded images on mount
  useEffect(() => {
    const fetchUploadedImages = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(`${backendUrl}/api/gallery/images`);
        if (response.ok) {
          const data = await response.json();
          setUploadedImages(data.images);
          setAllImages([...galleryItems, ...data.images]);
        }
      } catch (error) {
        console.error("Failed to fetch uploaded images:", error);
      }
    };
    fetchUploadedImages();
  }, []);

  const totalPages = Math.ceil(allImages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = allImages.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      // Scroll to gallery section smoothly
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      // Scroll to gallery section smoothly
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleDeleteClick = (filename: string) => {
    setDeleteFilename(filename);
    setIsDeleteOpen(true);
    setDeleteCode("");
    setDeleteError("");
    setDeleteSuccess("");
  };

  const handleDeleteConfirm = async () => {
    if (!/^\d{6}$/.test(deleteCode)) {
      setDeleteError("Please enter a valid 6-digit verification code");
      return;
    }

    setDeleting(true);
    setDeleteError("");
    setDeleteSuccess("");

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(
        `${backendUrl}/api/gallery/delete/${deleteFilename}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${deleteCode}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Delete error:", errorData);
        throw new Error(errorData.message || "Failed to delete image");
      }

      setDeleteSuccess("Image deleted successfully!");

      // Refresh gallery
      const refreshResponse = await fetch(`${backendUrl}/api/gallery/images`);
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setUploadedImages(data.images);
        setAllImages([...galleryItems, ...data.images]);
      }

      setTimeout(() => {
        setIsDeleteOpen(false);
        setDeleteSuccess("");
      }, 1500);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete image"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setUploadError("");
    setUploadSuccess("");
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError("Please select at least one image");
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      setUploadError("Please enter a valid 6-digit verification code");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("imageFile", file);

        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(`${backendUrl}/api/gallery/upload-image`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${verificationCode}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.message || `Failed to upload ${file.name}`;
          console.error("Upload error:", errorData);
          throw new Error(errorMessage);
        }

        return response.json();
      });

      await Promise.all(uploadPromises);

      // Refresh the gallery images
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const refreshResponse = await fetch(`${backendUrl}/api/gallery/images`);
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setUploadedImages(data.images);
        setAllImages([...galleryItems, ...data.images]);
      }

      setUploadSuccess(
        `Successfully uploaded ${selectedFiles.length} image(s)!`
      );
      setSelectedFiles([]);

      // Close dialog after success
      setTimeout(() => {
        setIsUploadOpen(false);
        setUploadSuccess("");
      }, 2000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>(".gallery-item-card")
    );
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
          } else {
            el.classList.remove("is-visible");
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [currentPage]);

  return (
    <section id="gallery" className="w-full py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8 max-w-2xl mx-auto">
          <div className="text-center flex-1">
            <p className="text-xs uppercase tracking-wider text-primary mb-2">
              Blocklift Gallery
            </p>
            <h2 className="text-2xl md:text-4xl font-semibold mb-2 md:mb-4">
              BlockLift in Action
            </h2>
          </div>
        </div>
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6"
        >
          {currentItems.map((item, i) => (
            <GalleryItem
              item={item}
              key={startIndex + i}
              onDelete={item.filename ? handleDeleteClick : undefined}
            />
          ))}
          {currentPage === totalPages && (
            <UploadImageButton onClick={() => setIsUploadOpen(true)} />
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => goToPage(page)}
                className="w-10 h-10"
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Page Info */}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} ({allImages.length} total images)
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Impact Images</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span>Click to select images</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-muted-foreground text-center">
                Select one or multiple images to upload
              </p>
            </div>

            {/* Verification Code Input */}
            <div className="space-y-2">
              <label
                htmlFor="verification-code"
                className="text-sm font-medium"
              >
                6-Digit Verification Code
              </label>
              <Input
                id="verification-code"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setVerificationCode(value);
                }}
                className="text-center text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                Enter the verification code provided to you
              </p>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Selected: {selectedFiles.length} file(s)
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-accent/20 rounded"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {uploadError}
              </div>
            )}

            {/* Success Message */}
            {uploadSuccess && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded">
                {uploadSuccess}
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={
                  uploading ||
                  selectedFiles.length === 0 ||
                  verificationCode.length !== 6
                }
                className="flex-1"
              >
                {uploading
                  ? "Uploading..."
                  : `Upload ${selectedFiles.length} Image(s)`}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadOpen(false);
                  setSelectedFiles([]);
                  setUploadError("");
                  setUploadSuccess("");
                  setVerificationCode("");
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this image? This action cannot be
              undone.
            </p>

            {/* Verification Code Input */}
            <div className="space-y-2">
              <label htmlFor="delete-code" className="text-sm font-medium">
                6-Digit Verification Code
              </label>
              <Input
                id="delete-code"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={deleteCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setDeleteCode(value);
                }}
                className="text-center text-lg tracking-widest"
              />
            </div>

            {/* Error Message */}
            {deleteError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {deleteError}
              </div>
            )}

            {/* Success Message */}
            {deleteSuccess && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded">
                {deleteSuccess}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleting || deleteCode.length !== 6}
                className="flex-1"
              >
                {deleting ? "Deleting..." : "Delete Image"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteCode("");
                  setDeleteError("");
                  setDeleteSuccess("");
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
