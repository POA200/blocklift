"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const ambassador_1 = __importDefault(require("./routes/ambassador"));
const payments_1 = __importDefault(require("./routes/payments"));
const gallery_1 = __importDefault(require("./routes/gallery"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://www.blocklift.org'],
}));
app.use(express_1.default.json());
// Serve uploaded files from persistent storage
// This makes files accessible at: http://localhost:3000/uploads/gallery/filename.jpg
app.use('/uploads', express_1.default.static('/var/data/uploads'));
// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'BlockLift Backend', network: process.env.VITE_NETWORK });
});
// Ambassador routes
app.use('/api/ambassador', ambassador_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/gallery', gallery_1.default);
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