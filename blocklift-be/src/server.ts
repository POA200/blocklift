import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import ambassadorRouter from './routes/ambassador';
import paymentsRouter from './routes/payments';
import galleryRouter from './routes/gallery';
import educationRouter from './routes/education';
import blogRouter from './routes/blog';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Update CORS to allow your frontend URL
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://www.blocklift.org',
    process.env.FRONTEND_URL, // Add your Vercel frontend URL here
].filter((origin): origin is string => Boolean(origin));

app.use(cors({ 
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Serve uploaded files from writable storage
// This makes files accessible at: http://localhost:3000/uploads/gallery/filename.jpg
const defaultBaseDir =
    process.env.UPLOADS_BASE_PATH ||
    (process.env.RENDER ? '/opt/render/project/tmp/uploads' : path.join(__dirname, '../uploads'));

let uploadsPath = defaultBaseDir;

try {
    fs.mkdirSync(uploadsPath, { recursive: true });
} catch (error) {
    console.error('Failed to create uploads base directory:', uploadsPath, error);
    const fallbackDir = '/tmp/uploads';
    console.warn(
        'Falling back to non-persistent path',
        fallbackDir,
        '. Set UPLOADS_BASE_PATH to a writable mount (e.g., /var/data/uploads when a Render Disk is attached).'
    );
    uploadsPath = fallbackDir;
    fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use('/uploads', express.static(uploadsPath)); 

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'BlockLift Backend', network: process.env.VITE_NETWORK });
});

// Ambassador routes
app.use('/api/ambassador', ambassadorRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/education', educationRouter);
app.use('/api/blog', blogRouter);
app.use('/api/admin', adminRouter);

// Not found handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const isDev = process.env.NODE_ENV !== 'production';
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    const stack = err instanceof Error ? err.stack : undefined;
    res.status(500).json({ error: message, ...(isDev && stack ? { stack } : {}) });
});

app.listen(PORT, () => {
    console.log(`BlockLift Backend running on port ${PORT}`);
});

export default app;