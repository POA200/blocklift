"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
console.log('✅ Gallery router loaded successfully');
// ============================================
// 1. SECURE AUTHENTICATION MIDDLEWARE
// ============================================
/**
 * Middleware to verify the upload token from Authorization header.
 * Expected format: "Bearer <TOKEN>"
 * Compares against process.env.UPLOAD_SECRET_TOKEN
 */
const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Missing Authorization header',
        });
    }
    // Extract token from "Bearer <TOKEN>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid Authorization header format. Use: Bearer <TOKEN>',
        });
    }
    const token = parts[1];
    const secretToken = process.env.UPLOAD_SECRET_TOKEN;
    console.log('Received token:', token);
    console.log('Expected token:', secretToken);
    if (!secretToken) {
        console.error('UPLOAD_SECRET_TOKEN environment variable is not set');
        return res.status(500).json({
            error: 'Server configuration error',
            message: 'Upload secret token not configured',
        });
    }
    if (token !== secretToken) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token',
        });
    }
    // Token is valid, proceed
    next();
};
// ============================================
// 2. MULTER CONFIGURATION
// ============================================
/**
 * Storage configuration for file uploads.
 * Destination: ./uploads/gallery for local dev, /var/data/uploads/gallery for production
 * Filename: timestamp + original extension to prevent conflicts
 */
const productionBaseDir = process.env.UPLOADS_BASE_PATH || '/var/data/uploads';
// Resolve upload directory with a safe fallback in production
let uploadDir = process.env.NODE_ENV === 'production'
    ? path_1.default.join(productionBaseDir, 'gallery')
    : path_1.default.join(__dirname, '../../uploads/gallery');
try {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
catch (error) {
    console.error('Failed to create upload directory:', uploadDir, error);
    if (process.env.NODE_ENV === 'production') {
        // Fallback to /tmp to keep service running (not persistent!)
        const fallbackDir = '/tmp/uploads/gallery';
        console.warn('Falling back to non-persistent path', fallbackDir, '. Attach a Render Disk at /var/data or set UPLOADS_BASE_PATH to a writable mount.');
        uploadDir = fallbackDir;
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    else {
        throw error;
    }
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const name = `${Date.now()}${ext}`;
        cb(null, name);
    },
});
// File filter to accept only image files
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type. Allowed: ${allowedMimes.join(', ')}`));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
});
// ============================================
// 3. HEALTH CHECK ROUTE
// ============================================
router.get('/', (req, res) => {
    res.json({ ok: true, route: 'gallery' });
});
// ============================================
// 3.5 GET UPLOADED IMAGES
// ============================================
router.get('/images', (req, res) => {
    try {
        // Read files from upload directory
        const files = fs_1.default.readdirSync(uploadDir);
        // Filter only image files and create URLs
        const imageFiles = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(filename => {
            const renderUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 3000}`;
            return {
                src: `${renderUrl}/uploads/gallery/${filename}`,
                alt: 'Community uploaded image',
                title: null,
                description: null,
                filename,
            };
        });
        res.json({ images: imageFiles });
    }
    catch (error) {
        console.error('Error reading gallery images:', error);
        res.status(500).json({ error: 'Failed to fetch gallery images' });
    }
});
// ============================================
// 4. PROTECTED FILE UPLOAD ROUTE
// ============================================
/**
 * POST /api/gallery/upload-image
 *
 * Expects:
 * - Authorization header with Bearer token
 * - multipart/form-data with fields:
 *   - imageFile: file (image)
 *   - description: string
 *   - location: string
 *
 * Response:
 * - 201 Created with image metadata and public URL
 * - 401 Unauthorized (invalid/missing token)
 * - 400 Bad Request (missing fields)
 * - 500 Internal Server Error (file system or database error)
 */
router.post('/upload-image', checkAuth, upload.single('imageFile'), async (req, res, next) => {
    try {
        // Validate file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'No file uploaded. Expected field: imageFile',
            });
        }
        // Extract optional fields (default to null if not provided)
        const description = req.body.description || null;
        const location = req.body.location || null;
        // Extract file information
        const filename = req.file.filename;
        const filePath = req.file.path;
        // Construct public URL
        // Assuming Render serves persistent disk at: https://your-render-url/uploads/gallery/[FILENAME]
        const renderUrl = process.env.RENDER_EXTERNAL_URL ||
            `http://localhost:${process.env.PORT || 3000}`;
        const imageUrl = `${renderUrl}/uploads/gallery/${filename}`;
        // ============================================
        // DATABASE INTEGRATION
        // ============================================
        // TODO: Integrate with your actual database
        // Insert into gallery or distributions table with:
        // - imageUrl
        // - filename
        // - location
        // - description
        // - timestamp (Date.now())
        //
        // Example pseudocode:
        // const galleryRecord = await db.gallery.create({
        //   imageUrl,
        //   filename,
        //   location,
        //   description,
        //   uploadedAt: new Date(),
        // });
        // For now, return success with image metadata
        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                imageUrl,
                filename,
                location,
                description,
                uploadedAt: new Date().toISOString(),
                filePath, // Internal reference (don't expose to client in production)
            },
        });
    }
    catch (err) {
        console.error('Gallery upload error:', err);
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        res.status(500).json({
            error: 'Internal Server Error',
            message,
        });
    }
});
// ============================================
// 5. DELETE IMAGE ROUTE
// ============================================
/**
 * DELETE /api/gallery/delete/:filename
 *
 * Expects:
 * - Authorization header with Bearer token
 * - filename as URL parameter
 *
 * Response:
 * - 200 OK if deleted successfully
 * - 401 Unauthorized (invalid token)
 * - 404 Not Found (file doesn't exist)
 * - 500 Internal Server Error
 */
router.delete('/delete/:filename', checkAuth, async (req, res, next) => {
    try {
        const { filename } = req.params;
        if (!filename) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Filename is required',
            });
        }
        // Construct file path
        const filePath = path_1.default.join(uploadDir, filename);
        // Check if file exists
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Image file not found',
            });
        }
        // Delete the file
        fs_1.default.unlinkSync(filePath);
        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            filename,
        });
    }
    catch (err) {
        console.error('Gallery delete error:', err);
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        res.status(500).json({
            error: 'Internal Server Error',
            message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=gallery.js.map