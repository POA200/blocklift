import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import ambassadorRouter from './routes/ambassador';
import paymentsRouter from './routes/payments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ 
    origin: ['http://localhost:5173', 'https://www.blocklift.org'], 
}));
app.use(express.json()); 

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'BlockLift Backend', network: process.env.VITE_NETWORK });
});

// Ambassador routes
app.use('/api/ambassador', ambassadorRouter);
app.use('/api/payments', paymentsRouter);

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