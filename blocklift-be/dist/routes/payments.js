"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// In-memory payment store (replace with persistent DB later)
const payments = [];
const router = (0, express_1.Router)();
// Return latest payment
router.get('/latest', (_req, res) => {
    const latest = payments[payments.length - 1];
    if (!latest)
        return res.status(404).json({ error: 'No payments yet' });
    res.json({ data: latest });
});
// Return recent payments (up to last 20)
router.get('/', (_req, res) => {
    res.json({ data: payments.slice(-20).reverse() });
});
// Record a new payment
router.post('/', (req, res, next) => {
    try {
        const { reference, amountMinor, donorName, donorEmail } = req.body ?? {};
        if (!reference || !amountMinor || !donorName || !donorEmail) {
            return res.status(400).json({ error: 'reference, amountMinor, donorName, donorEmail are required' });
        }
        if (typeof amountMinor !== 'number' || amountMinor < 100) {
            return res.status(400).json({ error: 'amountMinor must be a number >= 100' });
        }
        const record = {
            reference: String(reference),
            amountMinor,
            donorName: String(donorName),
            donorEmail: String(donorEmail),
            timestamp: Date.now(),
        };
        payments.push(record);
        res.status(201).json({ status: 'stored', data: record });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=payments.js.map