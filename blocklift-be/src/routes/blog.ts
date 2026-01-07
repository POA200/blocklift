import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

console.log('✅ Blog router loaded successfully');

// ============================================
// AUTH MIDDLEWARE (reuse token approach)
// ============================================
const checkAuth = (req: Request, res: Response, next: NextFunction) => {
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
const defaultBaseDir =
  process.env.UPLOADS_BASE_PATH ||
  (process.env.RENDER ? '/opt/render/project/tmp/uploads' : path.join(__dirname, '../../uploads'));

let blogDir = path.join(defaultBaseDir, 'blog');
let postsDir = path.join(blogDir, 'posts');

try {
  fs.mkdirSync(postsDir, { recursive: true });
} catch (error) {
  console.error('Failed to create blog storage directory:', postsDir, error);
  const fallbackDir = '/tmp/uploads/blog/posts';
  blogDir = path.dirname(fallbackDir);
  postsDir = fallbackDir;
  fs.mkdirSync(postsDir, { recursive: true });
}

// ============================================
// Types
// ============================================
interface BlogPost {
  slug: string;
  title: string;
  date: string; // display date string
  category: string;
  excerpt: string;
  content: string; // markdown content
  link?: string; // external link for "Read More"
}

// Helpers
const isValidSlug = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
const toSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const readAllPosts = (): BlogPost[] => {
  try {
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.json'));
    const posts: BlogPost[] = [];
    for (const f of files) {
      try {
        const raw = fs.readFileSync(path.join(postsDir, f), 'utf8');
        const data = JSON.parse(raw) as BlogPost;
        if (data && data.slug) posts.push(data);
      } catch (err) {
        console.warn('Failed to read blog file:', f, err);
      }
    }
    return posts;
  } catch (err) {
    console.error('Error reading blog posts:', err);
    return [];
  }
};

const writePost = (post: BlogPost) => {
  const filePath = path.join(postsDir, `${post.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');
};

// ============================================
// Seed dummy posts if none exist
// ============================================
const seedDummyPosts = () => {
  try {
    const existingPosts = readAllPosts();
    if (existingPosts.length > 0) {
      console.log(`✅ Blog: Found ${existingPosts.length} existing posts, skipping seed`);
      return;
    }

    const dummyPosts: BlogPost[] = [
      {
        slug: "stacks-nft-impact-explained",
        title: "Stacks NFT Impact Explained: How BlockLift Uses Bitcoin-Secured Proof",
        date: "Dec 2, 2025",
        category: "Stacks",
        excerpt: "Discover how BlockLift leverages Stacks Layer 2 to create immutable, Bitcoin-secured Proof of Impact NFTs that verify every donation and distribution.",
        content: "# Stacks NFT Impact Explained\n\nBlockLift uses Stacks Layer 2 to create immutable, Bitcoin-secured NFTs that verify every donation and distribution with transparency.",
        link: "/blog/stacks-nft-impact-explained"
      },
      {
        slug: "ambassador-spotlight-lagos",
        title: "Ambassador Spotlight: Bringing BlockLift to Lagos Communities",
        date: "Nov 28, 2025",
        category: "Community",
        excerpt: "Meet our local ambassadors in Lagos who are bridging the gap between blockchain technology and grassroots impact, ensuring transparent aid delivery.",
        content: "# Ambassador Spotlight: Lagos\n\nOur ambassadors in Lagos are making a real difference in their communities by bringing blockchain transparency to aid delivery.",
        link: "/blog/ambassador-spotlight-lagos"
      },
      {
        slug: "transparency-blockchain-charity",
        title: "Why Transparency Matters: The Case for Blockchain in Charity",
        date: "Nov 20, 2025",
        category: "Blockchain",
        excerpt: "Traditional charity models often lack transparency. Learn how BlockLift's blockchain-based approach ensures every donation is tracked, verified, and immutable.",
        content: "# Transparency in Charity\n\nBlockchain technology ensures that every donation is tracked and verified, creating unprecedented transparency in charitable giving.",
        link: "/blog/transparency-blockchain-charity"
      },
      {
        slug: "first-distribution-success",
        title: "Success Story: Our First Major School Supply Distribution",
        date: "Nov 15, 2025",
        category: "Impact",
        excerpt: "Celebrating our milestone: 500 students across 5 schools received essential supplies. See how blockchain verification made every step transparent and accountable.",
        content: "# First Distribution Success\n\nWe successfully distributed supplies to 500 students across 5 schools, all verified on the blockchain.",
        link: "/blog/first-distribution-success"
      },
      {
        slug: "how-to-verify-donation",
        title: "How to Verify Your Donation on the Stacks Blockchain",
        date: "Nov 10, 2025",
        category: "Tutorial",
        excerpt: "A step-by-step guide for donors to verify their contributions on the Stacks blockchain using the Impact-Chain Dashboard and Stacks Explorer.",
        content: "# How to Verify Your Donation\n\nLearn how to verify your donation on the Stacks blockchain in just a few simple steps.",
        link: "/blog/how-to-verify-donation"
      },
      {
        slug: "paystack-integration-announcement",
        title: "Announcing Paystack Integration: Donate with Naira, Verify on Bitcoin",
        date: "Nov 5, 2025",
        category: "Product",
        excerpt: "We've integrated Paystack to make donations easier for Nigerian donors. Pay with Naira and get the same blockchain verification as crypto donations.",
        content: "# Paystack Integration\n\nNow donors can pay with Naira through Paystack and still get full blockchain verification of their donation.",
        link: "/blog/paystack-integration-announcement"
      }
    ];

    for (const post of dummyPosts) {
      writePost(post);
    }
    console.log(`✅ Blog: Seeded ${dummyPosts.length} dummy blog posts`);
  } catch (error) {
    console.error('Failed to seed dummy posts:', error);
  }
};

seedDummyPosts();

// ============================================
// Routes
// ============================================
router.get('/', (_req: Request, res: Response) => {
  res.json({ ok: true, route: 'blog' });
});

// List posts (summary info)
router.get('/posts', (_req: Request, res: Response) => {
  try {
    const posts = readAllPosts().map(({ content, ...rest }) => rest);
    // Sort by date (try parse), newest first
    posts.sort((a, b) => {
      const da = Date.parse(a.date) || 0;
      const db = Date.parse(b.date) || 0;
      return db - da;
    });
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Failed to list blog posts:', error);
    res.status(500).json({ success: false, error: 'Failed to list blog posts' });
  }
});

// Get single post by slug
router.get('/posts/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const file = path.join(postsDir, `${slug}.json`);
    if (!fs.existsSync(file)) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    const raw = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(raw) as BlogPost;
    res.json({ success: true, post: data });
  } catch (error) {
    console.error('Failed to get blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to get blog post' });
  }
});

// Create a post
router.post('/posts', checkAuth, (req: Request, res: Response) => {
  try {
    const { title, slug: providedSlug, category, excerpt, content, date, link } = req.body as Partial<BlogPost>;
    if (!title || !category || !excerpt || !content) {
      return res.status(400).json({ success: false, error: 'Missing required fields: title, category, excerpt, content' });
    }

    let slug = (providedSlug || toSlug(title)).toLowerCase();
    if (!isValidSlug(slug)) {
      return res.status(400).json({ success: false, error: 'Invalid slug. Use lowercase letters, numbers, and hyphens.' });
    }

    const target = path.join(postsDir, `${slug}.json`);
    if (fs.existsSync(target)) {
      return res.status(409).json({ success: false, error: 'A post with this slug already exists' });
    }

    const displayDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const post: BlogPost = { slug, title, category, excerpt, content, date: displayDate, ...(link && { link }) } as BlogPost;
    writePost(post);
    res.json({ success: true, post });
  } catch (error) {
    console.error('Failed to create blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to create blog post' });
  }
});

// Delete a post
router.delete('/posts/:slug', checkAuth, (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const file = path.join(postsDir, `${slug}.json`);
    if (!fs.existsSync(file)) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    fs.unlinkSync(file);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blog post' });
  }
});

export default router;
