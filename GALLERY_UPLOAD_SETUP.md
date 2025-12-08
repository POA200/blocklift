# BlockLift Gallery Upload System - Implementation Guide

## Overview

This document provides setup instructions and usage examples for the new secure file upload endpoint and admin UI component for the BlockLift Impact Gallery.

## ✅ Files Created

### Backend

- **`blocklift-be/src/routes/gallery.ts`** - Gallery upload endpoint with authentication and Multer file handling
- **`blocklift-be/src/server.ts`** - Updated to include gallery router

### Frontend

- **`web/src/components/admin/ImageUploadForm.tsx`** - Admin UI component for uploading images

---

## 🔧 Setup Instructions

### 1. Install Missing Dependencies (Backend)

Run the following command in the `blocklift-be` directory:

```bash
npm install --save-dev @types/multer
```

This installs the TypeScript type definitions for Multer, resolving the compilation error.

### 2. Configure Environment Variables

#### Backend (`.env` in `blocklift-be/`)

Add the following variables:

```dotenv
# Upload Configuration
UPLOAD_SECRET_TOKEN=your-super-secret-upload-token-here

# Render Configuration (for production)
# RENDER_EXTERNAL_URL is automatically set by Render
# For local development, omit this to use http://localhost:3000

# If developing locally with custom URL:
# RENDER_EXTERNAL_URL=http://localhost:3000
```

**⚠️ Security Notes:**

- Keep `UPLOAD_SECRET_TOKEN` secure and never commit to version control
- Use strong, random tokens (e.g., generated with `crypto.randomBytes(32).toString('hex')`)
- On Render, set this as a Private Environment Variable via the Render dashboard

#### Frontend (`.env` in `web/`)

Add the following if using a different API URL:

```dotenv
# Optional: Set to your backend API URL
# Default: http://localhost:3000 (development)
VITE_API_URL=http://localhost:3000
```

### 3. Create Upload Directory (Development)

For **local development**, create the upload directory:

```bash
# Linux/macOS
mkdir -p /var/data/uploads/gallery

# Or use the development directory:
mkdir -p ./uploads/gallery
```

Then update `gallery.ts` line 64 if using a local directory:

```typescript
const uploadDir =
  process.env.NODE_ENV === "development"
    ? "./uploads/gallery"
    : "/var/data/uploads/gallery";
```

**For Render Production:**
Render automatically manages persistent disks mounted at `/var/data`. The code is already configured for this path.

### 4. Build and Run

#### Backend

```bash
cd blocklift-be
npm run build
npm start

# Or for development with auto-reload:
npm run dev
```

#### Frontend

```bash
cd web
npm run dev
```

---

## 🔐 Security Architecture

### Authentication Middleware (`checkAuth`)

The `checkAuth` middleware protects the `/api/gallery/upload-image` endpoint:

1. **Reads** the `Authorization` header from the request
2. **Extracts** the token from the `Bearer <TOKEN>` format
3. **Compares** against `process.env.UPLOAD_SECRET_TOKEN`
4. **Returns** 401 Unauthorized if invalid or missing
5. **Continues** to the upload handler if valid

```typescript
// Example valid request
fetch("/api/gallery/upload-image", {
  method: "POST",
  headers: {
    Authorization: "Bearer your-secret-token-here",
  },
  body: formData,
});
```

---

## 📤 File Upload Process

### Backend Flow

1. **Request arrives** → `checkAuth` middleware validates token
2. **Token is valid** → Multer processes the file upload
3. **File validation** → Checks file type (image only) and size (max 10MB)
4. **File saved** → Stored at `/var/data/uploads/gallery/[timestamp].[ext]`
5. **URL constructed** → Public URL: `{RENDER_URL}/uploads/gallery/{filename}`
6. **Database insert** → TODO: integrate with your database
7. **Response sent** → 201 Created with image metadata

### Multer Configuration

```typescript
const upload = multer({
  storage: diskStorage({
    destination: "/var/data/uploads/gallery",
    filename: "[timestamp].[ext]", // e.g., 1702123456789.jpg
  }),
  fileFilter: "image/*", // Only accept image files
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});
```

### Endpoint Response (Success)

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "http://localhost:3000/uploads/gallery/1702123456789.jpg",
    "filename": "1702123456789.jpg",
    "location": "Ikeja, Lagos",
    "description": "Distribution of school bags",
    "uploadedAt": "2024-12-08T12:34:56.789Z",
    "filePath": "/var/data/uploads/gallery/1702123456789.jpg"
  }
}
```

### Endpoint Response (Error)

```json
{
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

---

## 🎨 Frontend Component: `ImageUploadForm`

### Features

- ✅ File selection with validation (image only, max 10MB)
- ✅ Form inputs for image description and location
- ✅ Secure API key input (type="password")
- ✅ Loading states during upload
- ✅ Success/error feedback with icons
- ✅ Auto-clear form on successful upload
- ✅ Dialog/Modal wrapper for admin access

### Usage in Parent Component

```tsx
import { useState } from "react";
import ImageUploadForm from "@/components/admin/ImageUploadForm";
import { Button } from "@/components/ui/button";

export function MyAdminPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUploadSuccess = () => {
    console.log("Image uploaded successfully!");
    // Optionally refresh the gallery or metrics
  };

  return (
    <div>
      <Button onClick={() => setIsUploadDialogOpen(true)}>
        Upload Gallery Image
      </Button>

      <ImageUploadForm
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
```

### Component Props

```typescript
interface ImageUploadFormProps {
  isOpen: boolean; // Controls Dialog visibility
  onClose: () => void; // Called when dialog closes
  onSuccess?: () => void; // Called after successful upload
}
```

### Component State

| State            | Type           | Description                    |
| ---------------- | -------------- | ------------------------------ |
| `selectedFile`   | `File \| null` | Selected image file            |
| `description`    | `string`       | Image description/title        |
| `location`       | `string`       | Location where image was taken |
| `apiKey`         | `string`       | Upload secret token            |
| `isUploading`    | `boolean`      | Upload in progress             |
| `successMessage` | `string`       | Success feedback message       |
| `errorMessage`   | `string`       | Error feedback message         |

---

## 🗂️ File System Layout

```
/var/data/uploads/gallery/
├── 1702123456789.jpg
├── 1702123456890.png
├── 1702123456891.gif
└── ...
```

**Public access URL:** `{RENDER_EXTERNAL_URL}/uploads/gallery/{filename}`

---

## 🗄️ Database Integration (TODO)

The endpoint currently returns success without persisting data. To complete the feature:

### 1. Create Gallery/Distribution Table

```sql
CREATE TABLE gallery (
  id INT PRIMARY KEY AUTO_INCREMENT,
  imageUrl VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY(filename)
);
```

### 2. Update `gallery.ts` Route Handler

Replace the TODO section in the POST handler:

```typescript
// Insert into database
const result = await db.query(
  "INSERT INTO gallery (imageUrl, filename, location, description, uploadedAt) VALUES (?, ?, ?, ?, ?)",
  [imageUrl, filename, location, description, new Date()]
);

// Return success with database ID
res.status(201).json({
  success: true,
  message: "Image uploaded successfully",
  data: {
    id: result.insertId,
    imageUrl,
    filename,
    location,
    description,
    uploadedAt: new Date().toISOString(),
  },
});
```

### 3. Add Gallery Retrieval Endpoint

```typescript
// GET all gallery images
router.get("/images", async (req, res) => {
  try {
    const images = await db.query(
      "SELECT * FROM gallery ORDER BY uploadedAt DESC"
    );
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gallery images" });
  }
});
```

---

## 🧪 Testing the Endpoint

### Using cURL

```bash
curl -X POST http://localhost:3000/api/gallery/upload-image \
  -H "Authorization: Bearer your-secret-token-here" \
  -F "imageFile=@/path/to/image.jpg" \
  -F "description=School distribution" \
  -F "location=Lagos, Nigeria"
```

### Using Postman

1. **Method:** POST
2. **URL:** `http://localhost:3000/api/gallery/upload-image`
3. **Headers:**
   - `Authorization: Bearer your-secret-token-here`
4. **Body:** Form-data
   - `imageFile` (type: File) - Select image
   - `description` (type: Text) - "School distribution"
   - `location` (type: Text) - "Lagos, Nigeria"
5. **Send** and check the response

### Using the Frontend Component

1. Open the page with `ImageUploadForm`
2. Click the upload button to open the dialog
3. Select an image file
4. Enter description and location
5. Paste the `UPLOAD_SECRET_TOKEN` into the API Key field
6. Click "Upload Image"
7. Check the success/error message

---

## 🚀 Production Deployment (Render)

### 1. Set Environment Variable on Render

1. Go to Render Dashboard → Your Service
2. Settings → Environment
3. Add variable: `UPLOAD_SECRET_TOKEN` with a strong random token
4. Save and redeploy

### 2. Persistent Disk Setup

Ensure your Render service has a persistent disk mounted:

1. Dashboard → Your Service → Disks
2. Mount path: `/var/data`
3. Size: As needed (starts at 10GB)

### 3. Serve Uploaded Files

To make uploaded files publicly accessible, configure a static file server:

```typescript
// In server.ts, add after cors and json middleware:
app.use("/uploads", express.static("/var/data/uploads"));
```

This serves files from `/var/data/uploads/` at `https://your-render-url/uploads/[path]`

---

## 📋 Checklist

- [ ] Install `@types/multer` dev dependency
- [ ] Add `UPLOAD_SECRET_TOKEN` to `.env` (backend)
- [ ] Create upload directory (`/var/data/uploads/gallery` or `./uploads/gallery` for dev)
- [ ] Update `VITE_API_URL` in frontend `.env` if needed
- [ ] Build backend: `npm run build`
- [ ] Start backend: `npm start` or `npm run dev`
- [ ] Start frontend: `npm run dev`
- [ ] Test upload via component or cURL
- [ ] Set `UPLOAD_SECRET_TOKEN` on Render (production)
- [ ] Verify persistent disk on Render
- [ ] Integrate database storage (when ready)
- [ ] Configure static file serving on production

---

## 🔍 Troubleshooting

### "UPLOAD_SECRET_TOKEN not configured"

- Ensure `UPLOAD_SECRET_TOKEN` is set in `.env`
- Restart the backend server

### "Cannot write to /var/data/uploads/gallery"

- Create the directory manually: `mkdir -p /var/data/uploads/gallery`
- Check file permissions: `chmod 755 /var/data/uploads`

### "401 Unauthorized"

- Verify the token in the `Authorization: Bearer` header matches exactly
- Check `.env` for typos

### "Invalid file type"

- Only image files (jpeg, png, gif, webp) are accepted
- Max file size is 10MB

### Files not served publicly

- Add static file middleware to `server.ts` (see Production section)
- Verify disk path is `/var/data` on Render

---

## 📝 Notes

- The component automatically prevents file selection errors with inline validation
- All uploads are logged to console for debugging
- The endpoint is token-protected; no authentication framework needed
- Files are named by timestamp to avoid collisions
- Supports concurrent uploads with queue management

---

## 📞 Support

For issues or questions:

1. Check the error messages in browser console (frontend) or server logs (backend)
2. Verify environment variables are set correctly
3. Test the endpoint directly with cURL before using the UI component
4. Check file permissions on the server

---

**Version:** 1.0.0  
**Last Updated:** December 8, 2024
