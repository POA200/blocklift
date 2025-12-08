import { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUploadForm from "@/components/admin/ImageUploadForm";
import { Upload } from "lucide-react";

/**
 * AdminGalleryPanel - Example integration of the ImageUploadForm
 *
 * This component shows how to integrate the gallery upload feature
 * into your application. You can add this to any admin page or dashboard.
 *
 * Usage:
 * - Place this button on your Dashboard, Home page, or admin section
 * - The upload form opens in a dialog when clicked
 * - After successful upload, the gallery can be refreshed if needed
 */
export default function AdminGalleryPanel() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  /**
   * Called when image is successfully uploaded
   * You can use this to:
   * - Refresh the ImpactGallery component
   * - Show a success toast notification
   * - Log the upload event
   * - Update local state
   */
  const handleUploadSuccess = () => {
    console.log("✅ Image successfully uploaded to gallery!");

    // Example: Refresh gallery data
    // window.location.reload(); // or call a refresh function

    // Example: Show toast notification
    // showToast('Image added to gallery', 'success');

    // Example: Update parent component state
    // onGalleryUpdated?.();
  };

  return (
    <div className="flex gap-2">
      {/* Admin Upload Button */}
      <Button
        onClick={() => setIsUploadDialogOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2"
        title="Upload image to Impact Gallery (Admin only)"
      >
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Upload Gallery Image</span>
      </Button>

      {/* Upload Form Dialog */}
      <ImageUploadForm
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}

/**
 * INTEGRATION EXAMPLES
 *
 * 1. Add to Dashboard.tsx:
 *
 *    import AdminGalleryPanel from '@/components/admin/AdminGalleryPanel';
 *
 *    export default function Dashboard() {
 *      return (
 *        <div>
 *          <header className="flex justify-between items-center mb-6">
 *            <h1>Dashboard</h1>
 *            <AdminGalleryPanel />
 *          </header>
 *        </div>
 *      );
 *    }
 *
 * 2. Add to Home.tsx header:
 *
 *    import AdminGalleryPanel from '@/components/admin/AdminGalleryPanel';
 *
 *    export default function Home() {
 *      return (
 *        <Layout>
 *          <div className="fixed top-4 right-4">
 *            <AdminGalleryPanel />
 *          </div>
 *        </Layout>
 *      );
 *    }
 *
 * 3. Create dedicated Admin page:
 *
 *    // pages/AdminPanel.tsx
 *    import AdminGalleryPanel from '@/components/admin/AdminGalleryPanel';
 *
 *    export default function AdminPanel() {
 *      return (
 *        <div className="p-8">
 *          <h1>Admin Panel</h1>
 *          <AdminGalleryPanel />
 *        </div>
 *      );
 *    }
 *
 * 4. Use with callback to refresh gallery:
 *
 *    const [refreshGallery, setRefreshGallery] = useState(0);
 *
 *    return (
 *      <>
 *        <Button onClick={() => setRefreshGallery(prev => prev + 1)}>
 *          Refresh Gallery
 *        </Button>
 *        <ImpactGallery key={refreshGallery} />
 *      </>
 *    );
 */
