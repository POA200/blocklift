"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const defaultVideos = [
    {
        id: 'YYnjpE4q2f4',
        title: 'Hope, Bags and Blockchain',
        description: 'The Blocklift Story Begins!',
        thumbnail: 'https://img.youtube.com/vi/YYnjpE4q2f4/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=YYnjpE4q2f4',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2MZI83m5oSI',
        title: 'Blocklift episode 2:',
        description: 'The Backpack collection',
        thumbnail: 'https://img.youtube.com/vi/2MZI83m5oSI/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=2MZI83m5oSI',
        createdAt: new Date().toISOString(),
    },
];
// Shared token auth (same as gallery uploads)
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
// Choose a writable base path; defaults to Render tmp on free tier
const baseDir = process.env.UPLOADS_BASE_PATH || (process.env.RENDER ? '/opt/render/project/tmp/uploads' : path_1.default.join(__dirname, '../../uploads'));
const dataDir = path_1.default.join(baseDir, 'data');
const dataFile = path_1.default.join(dataDir, 'impact-videos.json');
const ensureStore = () => {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
    if (!fs_1.default.existsSync(dataFile)) {
        fs_1.default.writeFileSync(dataFile, JSON.stringify([]));
    }
};
const readVideos = () => {
    ensureStore();
    const raw = fs_1.default.readFileSync(dataFile, 'utf-8');
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            writeVideos(defaultVideos);
            return defaultVideos;
        }
        return parsed;
    }
    catch (err) {
        console.error('Failed to parse impact-videos store. Resetting to empty array.', err);
        writeVideos(defaultVideos);
        return defaultVideos;
    }
};
const writeVideos = (videos) => {
    fs_1.default.writeFileSync(dataFile, JSON.stringify(videos, null, 2));
};
const extractYouTubeId = (input) => {
    try {
        const url = new URL(input.trim());
        if (url.hostname.includes('youtu.be')) {
            return url.pathname.replace('/', '');
        }
        if (url.searchParams.has('v')) {
            return url.searchParams.get('v') ?? null;
        }
        const pathParts = url.pathname.split('/');
        const embedIndex = pathParts.findIndex(p => p === 'embed');
        if (embedIndex >= 0 && pathParts[embedIndex + 1]) {
            return pathParts[embedIndex + 1] ?? null;
        }
        const candidate = pathParts[1];
        if (candidate && candidate.length >= 8) {
            return candidate;
        }
        return null;
    }
    catch {
        return null;
    }
};
const extractMeta = (html, name) => {
    const namePattern = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i');
    const propPattern = new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i');
    const nameMatch = html.match(namePattern);
    if (nameMatch?.[1])
        return nameMatch[1];
    const propMatch = html.match(propPattern);
    if (propMatch?.[1])
        return propMatch[1];
    return null;
};
const extractTitleTag = (html) => {
    const match = html.match(/<title>([^<]+)<\/title>/i);
    return match?.[1] ?? null;
};
const fetchYouTubeMetadata = async (videoId) => {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    try {
        const response = await fetch(watchUrl, {
            headers: {
                'user-agent': 'Mozilla/5.0 (compatible; BlockLiftBot/1.0)'
            },
            signal: controller.signal,
        });
        const html = await response.text();
        const title = extractMeta(html, 'og:title') || extractTitleTag(html) || 'YouTube video';
        const description = extractMeta(html, 'description') ||
            extractMeta(html, 'og:description') ||
            '';
        const thumbnail = extractMeta(html, 'og:image') || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        return { title, description, thumbnail };
    }
    catch (error) {
        console.error('Failed to fetch YouTube metadata. Falling back to minimal data.', error);
        return {
            title: 'YouTube video',
            description: '',
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        };
    }
    finally {
        clearTimeout(timeout);
    }
};
// List videos
router.get('/', (_req, res) => {
    const videos = readVideos();
    res.json({ videos });
});
// Add a video via YouTube link
router.post('/', checkAuth, async (req, res) => {
    const { youtubeUrl } = req.body;
    if (!youtubeUrl) {
        return res.status(400).json({ error: 'Bad Request', message: 'youtubeUrl is required' });
    }
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
        return res.status(400).json({ error: 'Bad Request', message: 'Could not extract YouTube video id from the provided url' });
    }
    const metadata = await fetchYouTubeMetadata(videoId);
    const video = {
        id: videoId,
        title: metadata.title,
        description: metadata.description,
        thumbnail: metadata.thumbnail,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        createdAt: new Date().toISOString(),
    };
    const existing = readVideos();
    const updated = [video, ...existing.filter(v => v.id !== videoId)];
    writeVideos(updated);
    return res.status(201).json({ video, videos: updated });
});
// Delete a video by id
router.delete('/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Bad Request', message: 'id is required' });
    }
    const existing = readVideos();
    const filtered = existing.filter(v => v.id !== id);
    if (filtered.length === existing.length) {
        return res.status(404).json({ error: 'Not Found', message: 'Video not found' });
    }
    writeVideos(filtered);
    return res.json({ success: true, videos: filtered });
});
exports.default = router;
//# sourceMappingURL=videos.js.map