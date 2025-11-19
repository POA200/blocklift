import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Simple health for this router
router.get('/', (req: Request, res: Response) => {
	res.json({ ok: true, route: 'ambassador' });
});

// Stub for ambassador sign-up
router.post('/', (req: Request, res: Response, next: NextFunction) => {
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
	} catch (err) {
		next(err);
	}
});

export default router;
