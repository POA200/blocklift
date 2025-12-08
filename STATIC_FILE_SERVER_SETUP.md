/\*\*

- STATIC FILE SERVER CONFIGURATION
-
- This file shows how to update server.ts to serve uploaded files
- and make them publicly accessible.
-
- Add these lines to src/server.ts after the cors and json middleware.
  \*/

// ============================================
// OPTION 1: Serve all uploads (recommended)
// ============================================
// Add after app.use(express.json());

import express from 'express';

// Serve uploaded files from /var/data/uploads at /uploads/
// Example: /uploads/gallery/1702123456789.jpg
// Full URL: https://your-render-url/uploads/gallery/1702123456789.jpg
app.use('/uploads', express.static('/var/data/uploads'));

// ============================================
// OPTION 2: Serve gallery uploads only
// ============================================
// Alternative if you want to limit to gallery only:
app.use('/uploads/gallery', express.static('/var/data/uploads/gallery'));

// ============================================
// OPTION 3: Environment-aware configuration
// ============================================
// If using different paths for dev and production:
const uploadDir = process.env.NODE_ENV === 'production'
? '/var/data/uploads'
: './uploads';

app.use('/uploads', express.static(uploadDir));

// ============================================
// IMPLEMENTATION
// ============================================
// Update src/server.ts like this:

/\*\*

- import express, { NextFunction, Request, Response } from 'express';
- import dotenv from 'dotenv';
- import cors from 'cors';
- import ambassadorRouter from './routes/ambassador';
- import paymentsRouter from './routes/payments';
- import galleryRouter from './routes/gallery';
-
- dotenv.config();
-
- const app = express();
- const PORT = process.env.PORT || 3000;
-
- app.use(cors({
-     origin: ['http://localhost:5173', 'https://www.blocklift.org'],
- }));
- app.use(express.json());
-
- // ⭐ ADD THIS LINE - Serve uploaded files
- app.use('/uploads', express.static('/var/data/uploads'));
-
- // ... rest of the routes
  \*/

// ============================================
// VERIFY FILE ACCESS
// ============================================
// After adding the static middleware, you can verify it works:

app.get('/api/test-uploads', (req: any, res: any) => {
const fs = require('fs');
const path = require('path');

const galleryDir = '/var/data/uploads/gallery';

if (!fs.existsSync(galleryDir)) {
return res.status(404).json({
error: 'Gallery directory not found',
path: galleryDir,
});
}

try {
const files = fs.readdirSync(galleryDir);
const baseUrl = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';

    const imageUrls = files.map((file: string) => ({
      filename: file,
      url: `${baseUrl}/uploads/gallery/${file}`,
    }));

    res.json({
      message: 'Gallery files found',
      totalFiles: files.length,
      files: imageUrls,
    });

} catch (error) {
res.status(500).json({
error: 'Failed to list gallery files',
details: error instanceof Error ? error.message : 'Unknown error',
});
}
});

// ============================================
// RENDER DEPLOYMENT NOTES
// ============================================
/\*\*

- 1.  Persistent Disk Setup:
- - Render Dashboard → Your Service → Disks
- - Mount path: /var/data
- - Size: minimum 10GB recommended
-
- 2.  File Permissions:
- The upload directory is created by the gallery route with:
- fs.mkdirSync(uploadDir, { recursive: true });
- This automatically creates it with proper permissions.
-
- 3.  Public Access:
- With the static middleware, files are served at:
- https://your-render-url/uploads/gallery/[filename]
-
- 4.  Restart After Changes:
- After adding the static middleware, redeploy:
- - git push (triggers automatic redeploy)
- - or manually restart service in Render dashboard
-
- 5.  CORS Configuration:
- The existing cors middleware allows requests from:
- - http://localhost:5173 (frontend dev)
- - https://www.blocklift.org (production frontend)
-
- Update the origins array if needed:
- origin: ['http://localhost:5173', 'https://www.blocklift.org'],
  \*/

// ============================================
// SECURITY CONSIDERATIONS
// ============================================
/\*\*

- 1.  File Type Validation:
- - Multer fileFilter only accepts image/\* MIME types
- - Additional validation: jpeg, png, gif, webp
-
- 2.  File Size Limits:
- - Maximum: 10MB per file
- - Configurable in gallery.ts: limits.fileSize
-
- 3.  Authentication:
- - Upload endpoint requires Bearer token
- - Read-only access to /uploads is unrestricted
- - If you need read protection, implement auth middleware
-
- 4.  Path Traversal Prevention:
- - Multer handles safe filename generation
- - Files named with timestamp: [Date.now()][extension]
- - No user-controlled directory paths
-
- 5.  Rate Limiting (Recommended):
- Add express-rate-limit for production:
-
- import rateLimit from 'express-rate-limit';
-
- const uploadLimiter = rateLimit({
-      windowMs: 15 * 60 * 1000, // 15 minutes
-      max: 10, // 10 uploads per 15 minutes
-      message: 'Too many uploads, please try again later',
- });
-
- router.post('/upload-image', uploadLimiter, checkAuth, upload.single(...));
  \*/
