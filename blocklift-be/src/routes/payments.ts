import { Router, Request, Response, NextFunction } from 'express';

interface PaymentRecord {
  reference: string;
  amountMinor: number; // minor units (kobo)
  donorName: string;
  donorEmail: string;
  timestamp: number; // epoch ms
}

// In-memory payment store (replace with persistent DB later)
const payments: PaymentRecord[] = [];

const router = Router();

// Return latest payment
router.get('/latest', (_req: Request, res: Response) => {
  const latest = payments[payments.length - 1];
  if (!latest) return res.status(404).json({ error: 'No payments yet' });
  res.json({ data: latest });
});

// Return recent payments (up to last 20)
router.get('/', (_req: Request, res: Response) => {
  res.json({ data: payments.slice(-20).reverse() });
});

// Record a new payment
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reference, amountMinor, donorName, donorEmail } = req.body ?? {};
    if (!reference || !amountMinor || !donorName || !donorEmail) {
      return res.status(400).json({ error: 'reference, amountMinor, donorName, donorEmail are required' });
    }
    if (typeof amountMinor !== 'number' || amountMinor < 100) {
      return res.status(400).json({ error: 'amountMinor must be a number >= 100' });
    }
    const record: PaymentRecord = {
      reference: String(reference),
      amountMinor,
      donorName: String(donorName),
      donorEmail: String(donorEmail),
      timestamp: Date.now(),
    };
    payments.push(record);
    res.status(201).json({ status: 'stored', data: record });
  } catch (err) {
    next(err);
  }
});

export default router;
