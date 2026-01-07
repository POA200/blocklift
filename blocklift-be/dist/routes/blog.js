"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
console.log('✅ Blog router loaded successfully');
// ============================================
// AUTH MIDDLEWARE (reuse token approach)
// ============================================
const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Missing Authorization header' });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid Authorization header format. Use: Bearer <TOKEN>' });
    }
    const token = parts[1];
    const secretToken = process.env.UPLOAD_SECRET_TOKEN;
    if (!secretToken) {
        console.error('UPLOAD_SECRET_TOKEN environment variable is not set');
        return res.status(500).json({ error: 'Server configuration error', message: 'Upload secret token not configured' });
    }
    if (token !== secretToken) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
    }
    next();
};
// ============================================
// Storage locations (use the same uploads base)
// ============================================
const defaultBaseDir = process.env.UPLOADS_BASE_PATH ||
    (process.env.RENDER ? '/opt/render/project/tmp/uploads' : path_1.default.join(__dirname, '../../uploads'));
let blogDir = path_1.default.join(defaultBaseDir, 'blog');
let postsDir = path_1.default.join(blogDir, 'posts');
try {
    fs_1.default.mkdirSync(postsDir, { recursive: true });
}
catch (error) {
    console.error('Failed to create blog storage directory:', postsDir, error);
    const fallbackDir = '/tmp/uploads/blog/posts';
    blogDir = path_1.default.dirname(fallbackDir);
    postsDir = fallbackDir;
    fs_1.default.mkdirSync(postsDir, { recursive: true });
}
// Helpers
const isValidSlug = (s) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
const toSlug = (title) => title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
const readAllPosts = () => {
    try {
        const files = fs_1.default.readdirSync(postsDir).filter((f) => f.endsWith('.json'));
        const posts = [];
        for (const f of files) {
            try {
                const raw = fs_1.default.readFileSync(path_1.default.join(postsDir, f), 'utf8');
                const data = JSON.parse(raw);
                if (data && data.slug)
                    posts.push(data);
            }
            catch (err) {
                console.warn('Failed to read blog file:', f, err);
            }
        }
        return posts;
    }
    catch (err) {
        console.error('Error reading blog posts:', err);
        return [];
    }
};
const writePost = (post) => {
    const filePath = path_1.default.join(postsDir, `${post.slug}.json`);
    fs_1.default.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');
};
// ============================================
// Routes
// ============================================
router.get('/', (_req, res) => {
    res.json({ ok: true, route: 'blog' });
});
// List posts (summary info)
router.get('/posts', (_req, res) => {
    try {
        const posts = readAllPosts().map(({ content, ...rest }) => rest);
        // Sort by date (try parse), newest first
        posts.sort((a, b) => {
            const da = Date.parse(a.date) || 0;
            const db = Date.parse(b.date) || 0;
            return db - da;
        });
        res.json({ success: true, posts });
    }
    catch (error) {
        console.error('Failed to list blog posts:', error);
        res.status(500).json({ success: false, error: 'Failed to list blog posts' });
    }
});
// Get single post by slug
router.get('/posts/:slug', (req, res) => {
    const { slug } = req.params;
    try {
        const file = path_1.default.join(postsDir, `${slug}.json`);
        if (!fs_1.default.existsSync(file)) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        const raw = fs_1.default.readFileSync(file, 'utf8');
        const data = JSON.parse(raw);
        res.json({ success: true, post: data });
    }
    catch (error) {
        console.error('Failed to get blog post:', error);
        res.status(500).json({ success: false, error: 'Failed to get blog post' });
    }
});
// Create a post
router.post('/posts', checkAuth, (req, res) => {
    try {
        const { title, slug: providedSlug, category, excerpt, content, date } = req.body;
        if (!title || !category || !excerpt || !content) {
            return res.status(400).json({ success: false, error: 'Missing required fields: title, category, excerpt, content' });
        }
        let slug = (providedSlug || toSlug(title)).toLowerCase();
        if (!isValidSlug(slug)) {
            return res.status(400).json({ success: false, error: 'Invalid slug. Use lowercase letters, numbers, and hyphens.' });
        }
        const target = path_1.default.join(postsDir, `${slug}.json`);
        if (fs_1.default.existsSync(target)) {
            return res.status(409).json({ success: false, error: 'A post with this slug already exists' });
        }
        const displayDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const post = { slug, title, category, excerpt, content, date: displayDate };
        writePost(post);
        res.json({ success: true, post });
    }
    catch (error) {
        console.error('Failed to create blog post:', error);
        res.status(500).json({ success: false, error: 'Failed to create blog post' });
    }
});
// Delete a post
router.delete('/posts/:slug', checkAuth, (req, res) => {
    try {
        const { slug } = req.params;
        const file = path_1.default.join(postsDir, `${slug}.json`);
        if (!fs_1.default.existsSync(file)) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        fs_1.default.unlinkSync(file);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Failed to delete blog post:', error);
        res.status(500).json({ success: false, error: 'Failed to delete blog post' });
    }
});
exports.default = router;
//# sourceMappingURL=blog.js.map