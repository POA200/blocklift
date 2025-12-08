import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

console.log('✅ Gallery router loaded successfully');

// ============================================
// 1. SECURE AUTHENTICATION MIDDLEWARE
// ============================================
/**
 * Middleware to verify the upload token from Authorization header.
 * Expected format: "Bearer <TOKEN>"
 * Compares against process.env.UPLOAD_SECRET_TOKEN
 */
const checkAuth = (req: Request, res: Response, next: NextFunction) => {
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
const uploadDir = process.env.NODE_ENV === 'production' 
	? '/var/data/uploads/gallery' 
	: path.join(__dirname, '../../uploads/gallery');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req: any, file: any, cb: any) => {
		cb(null, uploadDir);
	},
	filename: (req: any, file: any, cb: any) => {
		const ext = path.extname(file.originalname);
		const name = `${Date.now()}${ext}`;
		cb(null, name);
	},
});

// File filter to accept only image files
const fileFilter = (req: any, file: any, cb: any) => {
	const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
	if (allowedMimes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error(`Invalid file type. Allowed: ${allowedMimes.join(', ')}`));
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB max
	},
});

// ============================================
// 3. HEALTH CHECK ROUTE
// ============================================
router.get('/', (req: Request, res: Response) => {
	res.json({ ok: true, route: 'gallery' });
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
router.post(
	'/upload-image',
	checkAuth,
	upload.single('imageFile'),
	async (req: any, res: Response, next: NextFunction) => {
		try {
			// Validate file was uploaded
			if (!req.file) {
				return res.status(400).json({
					error: 'Bad Request',
					message: 'No file uploaded. Expected field: imageFile',
				});
			}

			// Validate required fields
			const { description, location } = req.body;
			if (!description || !location) {
				return res.status(400).json({
					error: 'Bad Request',
					message: 'Missing required fields: description and location',
				});
			}

			// Extract file information
			const filename = req.file.filename;
			const filePath = req.file.path;

			// Construct public URL
			// Assuming Render serves persistent disk at: https://your-render-url/uploads/gallery/[FILENAME]
			const renderUrl =
				process.env.RENDER_EXTERNAL_URL ||
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
		} catch (err) {
			console.error('Gallery upload error:', err);
			const message =
				err instanceof Error ? err.message : 'Unknown error occurred';
			res.status(500).json({
				error: 'Internal Server Error',
				message,
			});
		}
	}
);

export default router;
