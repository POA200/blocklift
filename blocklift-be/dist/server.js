"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ambassador_1 = __importDefault(require("./routes/ambassador"));
const payments_1 = __importDefault(require("./routes/payments"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const education_1 = __importDefault(require("./routes/education"));
const blog_1 = __importDefault(require("./routes/blog"));
const admin_1 = __importDefault(require("./routes/admin"));
const data_1 = require("./data");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Update CORS to allow your frontend URL
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://www.blocklift.org',
    process.env.FRONTEND_URL, // Add your Vercel frontend URL here
].filter((origin) => Boolean(origin));
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json());
// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Serve uploaded files from writable storage
// This makes files accessible at: http://localhost:3000/uploads/gallery/filename.jpg
const defaultBaseDir = process.env.UPLOADS_BASE_PATH ||
    (process.env.RENDER ? '/opt/render/project/tmp/uploads' : path_1.default.join(__dirname, '../uploads'));
let uploadsPath = defaultBaseDir;
try {
    fs_1.default.mkdirSync(uploadsPath, { recursive: true });
}
catch (error) {
    console.error('Failed to create uploads base directory:', uploadsPath, error);
    const fallbackDir = '/tmp/uploads';
    console.warn('Falling back to non-persistent path', fallbackDir, '. Set UPLOADS_BASE_PATH to a writable mount (e.g., /var/data/uploads when a Render Disk is attached).');
    uploadsPath = fallbackDir;
    fs_1.default.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express_1.default.static(uploadsPath));
// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'BlockLift Backend', network: process.env.VITE_NETWORK });
});
// Ambassador routes
app.use('/api/ambassador', ambassador_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/gallery', gallery_1.default);
app.use('/api/education', education_1.default);
app.use('/api/blog', blog_1.default);
app.use('/api/admin', admin_1.default);
// Quick admin namespace ping for debugging
app.get('/api/admin/health', (req, res) => {
    res.json({ ok: true, ns: 'admin' });
});
// Public GET endpoints for frontend consumption (fallback if admin namespace is blocked)
console.log('📍 Registering /api/metrics endpoint with store:', data_1.store.metrics.length, 'items');
app.get('/api/metrics', (req, res) => {
    console.log('📊 GET /api/metrics called');
    res.json(data_1.store.metrics);
});
console.log('📍 Registering /api/distributions endpoint with store:', data_1.store.distributions.length, 'items');
app.get('/api/distributions', (req, res) => {
    console.log('📦 GET /api/distributions called');
    res.json(data_1.store.distributions);
});
// Not found handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});
// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
    const isDev = process.env.NODE_ENV !== 'production';
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    const stack = err instanceof Error ? err.stack : undefined;
    res.status(500).json({ error: message, ...(isDev && stack ? { stack } : {}) });
});
app.listen(PORT, () => {
    console.log(`BlockLift Backend running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map