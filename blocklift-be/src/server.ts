import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import ambassadorRouter from './routes/ambassador';
import paymentsRouter from './routes/payments';
import galleryRouter from './routes/gallery';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ 
    origin: ['http://localhost:5173', 'https://www.blocklift.org'], 
}));
app.use(express.json());

// Serve uploaded files from persistent storage
// This makes files accessible at: http://localhost:3000/uploads/gallery/filename.jpg
const uploadsPath = process.env.NODE_ENV === 'production'
	? '/var/data/uploads'
	: path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath)); 

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'BlockLift Backend', network: process.env.VITE_NETWORK });
});

// Ambassador routes
app.use('/api/ambassador', ambassadorRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/gallery', galleryRouter);

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