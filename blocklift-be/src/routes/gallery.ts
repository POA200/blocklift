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
 * Defaults to Render's tmp dir when no disk is attached; override with UPLOADS_BASE_PATH.
 * Filename: timestamp + original extension to prevent conflicts
 */
const defaultBaseDir =
	process.env.UPLOADS_BASE_PATH ||
	(process.env.RENDER ? '/opt/render/project/tmp/uploads' : path.join(__dirname, '../../uploads'));

let uploadDir = path.join(defaultBaseDir, 'gallery');

try {
	fs.mkdirSync(uploadDir, { recursive: true });
} catch (error) {
	console.error('Failed to create upload directory:', uploadDir, error);
	// Fallback keeps service running on free tier (ephemeral storage)
	const fallbackDir = '/tmp/uploads/gallery';
	console.warn(
		'Falling back to non-persistent path',
		fallbackDir,
		'. Set UPLOADS_BASE_PATH to a writable mount (e.g., /var/data/uploads when a Render Disk is attached).'
	);
	uploadDir = fallbackDir;
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
// 3.5 GET UPLOADED IMAGES
// ============================================
router.get('/images', (req: Request, res: Response) => {
	try {
		// Read files from upload directory
		const files = fs.readdirSync(uploadDir);
		
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
	} catch (error) {
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

			// Extract optional fields (default to null if not provided)
			const description = req.body.description || null;
			const location = req.body.location || null;

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
router.delete(
	'/delete/:filename',
	checkAuth,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { filename } = req.params;
			
			if (!filename) {
				return res.status(400).json({
					error: 'Bad Request',
					message: 'Filename is required',
				});
			}

			// Construct file path
			const filePath = path.join(uploadDir, filename);

			// Check if file exists
			if (!fs.existsSync(filePath)) {
				return res.status(404).json({
					error: 'Not Found',
					message: 'Image file not found',
				});
			}

			// Delete the file
			fs.unlinkSync(filePath);

			res.status(200).json({
				success: true,
				message: 'Image deleted successfully',
				filename,
			});
		} catch (err) {
			console.error('Gallery delete error:', err);
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
