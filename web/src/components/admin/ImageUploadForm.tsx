import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";

interface ImageUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ImageUploadForm({
  isOpen,
  onClose,
  onSuccess,
}: ImageUploadFormProps) {
  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [apiKey, setApiKey] = useState("");

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handle file selection from input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file");
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      setErrorMessage("");
    }
  };

  /**
   * Handle form submission - upload image to backend
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!selectedFile) {
      setErrorMessage("Please select an image file");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("Please enter an image description");
      return;
    }

    if (!location.trim()) {
      setErrorMessage("Please enter a location");
      return;
    }

    if (!apiKey.trim()) {
      setErrorMessage("Please enter the API key");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Construct FormData
      const formData = new FormData();
      formData.append("imageFile", selectedFile);
      formData.append("description", description);
      formData.append("location", location);

      // Determine API endpoint
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const endpoint = `${apiUrl}/api/gallery/upload-image`;

      // Make request with Authorization header
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          // Do NOT set Content-Type; browser will set multipart/form-data boundary
        },
        body: formData,
      });

      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg =
          errorData?.message ||
          errorData?.error ||
          `Upload failed: ${response.status}`;

        if (response.status === 401) {
          setErrorMessage("Unauthorized: Invalid or expired API key");
        } else {
          setErrorMessage(errorMsg);
        }
        return;
      }

      const result = await response.json();

      // Success
      setSuccessMessage(
        `Image uploaded successfully! URL: ${result.data.imageUrl}`
      );

      // Reset form
      setSelectedFile(null);
      setDescription("");
      setLocation("");
      setApiKey("");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      // Call callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Network error";
      setErrorMessage(`Failed to upload image: ${errorMsg}`);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Reset form and close dialog
   */
  const handleClose = () => {
    setSelectedFile(null);
    setDescription("");
    setLocation("");
    setApiKey("");
    setErrorMessage("");
    setSuccessMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Gallery Image</DialogTitle>
          <DialogDescription>
            Add a new image to the Impact Gallery with location and description.
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {errorMessage && (
                <div className="border-l-4 border-destructive/50 bg-destructive/10 p-4 rounded flex gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
              )}

              {/* Success Alert */}
              {successMessage && (
                <div className="border-l-4 border-green-500/50 bg-green-500/10 p-4 rounded flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              )}

              {/* Image File Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Image File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                    id="imageFile"
                  />
                  <label
                    htmlFor="imageFile"
                    className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-border rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to select image"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Distribution of school bags to students"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                />
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Ikeja, Lagos"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isUploading}
                />
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  API Key (Upload Secret Token)
                </label>
                <Input
                  type="password"
                  placeholder="Enter your upload secret token"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground">
                  This token is kept secure and never stored
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isUploading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="flex-1"
                >
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
