"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Simple health for this router
router.get('/', (req, res) => {
    res.json({ ok: true, route: 'ambassador' });
});
// Stub for ambassador sign-up
router.post('/', (req, res, next) => {
    try {
        const { name, email, message } = req.body ?? {};
        if (!email) {
            return res.status(400).json({ error: 'email is required' });
        }
        // TODO: save to database/mail provider in the future
        res.status(201).json({
            status: 'received',
            data: { name: name ?? null, email, message: message ?? null },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=ambassador.js.map