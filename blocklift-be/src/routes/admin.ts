import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Type definitions
interface Metric {
  key: string;
  label: string;
  desc: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

interface Distribution {
  id: string;
  schoolName: string;
  location: string;
  status: "verified" | "pending";
  studentsImpacted: number;
  timeAgo: string;
  txId: string;
  supplies: string[];
  principal: string;
  establishedYear: number;
  totalStudents: number;
  totalSuppliesDistributed: number;
  imageSrc: string;
  isActive: boolean;
}

// In-memory storage (would be replaced with DB in production)
let metrics: Metric[] = [
  {
    key: "children_equipped",
    label: "Children Equipped",
    desc: "learning kits delivered",
    value: 5000,
    suffix: "+",
  },
  {
    key: "verified_donations",
    label: "Verified Donations",
    desc: "Donations recorded on-chain (verified)",
    value: 12500,
    prefix: "$",
  },
  {
    key: "nft_proofs",
    label: "NFT Proofs Minted",
    desc: "On-chain receipts minted for donors",
    value: 1240,
  },
  {
    key: "field_ambassadors",
    label: "Field Ambassadors",
    desc: "Local verifiers & volunteers deployed",
    value: 45,
  },
];

let distributions: Distribution[] = [
  {
    id: "dist_001",
    schoolName: "St. Mary's Primary School",
    location: "Ikeja, Lagos",
    status: "verified",
    studentsImpacted: 125,
    timeAgo: "2 hours ago",
    txId: "0xe7fbc62c",
    supplies: ["25 School Bags"],
    principal: "Mrs. Adebayo",
    establishedYear: 1995,
    totalStudents: 342,
    totalSuppliesDistributed: 1025,
    imageSrc:
      "https://via.placeholder.com/400x200/10b981/ffffff?text=St.+Mary's+School",
    isActive: true,
  },
  {
    id: "dist_002",
    schoolName: "Lagos Central High School",
    location: "Lekki, Lagos",
    status: "pending",
    studentsImpacted: 89,
    timeAgo: "5 hours ago",
    txId: "0xf3d8a9e2",
    supplies: ["15 Textbooks", "20 Notebooks"],
    principal: "Mr. Okonkwo",
    establishedYear: 2001,
    totalStudents: 450,
    totalSuppliesDistributed: 560,
    imageSrc:
      "https://via.placeholder.com/400x200/3b82f6/ffffff?text=Lagos+Central+High",
    isActive: true,
  },
  {
    id: "dist_003",
    schoolName: "Abuja Community School",
    location: "Abuja, FCT",
    status: "verified",
    studentsImpacted: 156,
    timeAgo: "1 day ago",
    txId: "0x7c9e4f1b",
    supplies: ["30 School Bags", "50 Pens"],
    principal: "Dr. Chioma",
    establishedYear: 1998,
    totalStudents: 520,
    totalSuppliesDistributed: 1820,
    imageSrc:
      "https://via.placeholder.com/400x200/8b5cf6/ffffff?text=Abuja+Community",
    isActive: true,
  },
];

// GET all metrics
router.get('/metrics', (req: Request, res: Response) => {
  try {
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// POST new metric
router.post('/metrics', (req: Request, res: Response) => {
  try {
    const { key, label, desc, value, prefix, suffix } = req.body;
    
    if (!key || !label || value === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newMetric: Metric = {
      key,
      label,
      desc: desc || '',
      value,
      prefix,
      suffix,
    };

    metrics.push(newMetric);
    res.status(201).json(newMetric);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create metric' });
  }
});

// PUT update metric
router.put('/metrics/:key', (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { label, desc, value, prefix, suffix } = req.body;

    const metricIndex = metrics.findIndex(m => m.key === key);
    if (metricIndex === -1) {
      return res.status(404).json({ error: 'Metric not found' });
    }

    const currentMetric = metrics[metricIndex]!;
    const updatedMetric: Metric = {
      key: currentMetric.key,
      label: label !== undefined ? label : currentMetric.label,
      desc: desc !== undefined ? desc : currentMetric.desc,
      value: value !== undefined ? value : currentMetric.value,
      prefix: prefix !== undefined ? prefix : currentMetric.prefix,
      suffix: suffix !== undefined ? suffix : currentMetric.suffix,
    };

    metrics[metricIndex] = updatedMetric;

    res.json(metrics[metricIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update metric' });
  }
});

// DELETE metric
router.delete('/metrics/:key', (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const initialLength = metrics.length;
    metrics = metrics.filter(m => m.key !== key);

    if (metrics.length === initialLength) {
      return res.status(404).json({ error: 'Metric not found' });
    }

    res.json({ message: 'Metric deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete metric' });
  }
});

// GET all distributions
router.get('/distributions', (req: Request, res: Response) => {
  try {
    res.json(distributions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distributions' });
  }
});

// POST new distribution
router.post('/distributions', (req: Request, res: Response) => {
  try {
    const {
      schoolName,
      location,
      status,
      studentsImpacted,
      timeAgo,
      txId,
      supplies,
      principal,
      establishedYear,
      totalStudents,
      totalSuppliesDistributed,
      imageSrc,
      isActive,
    } = req.body;

    if (!schoolName || !location || !principal) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newDistribution: Distribution = {
      id: `dist_${Date.now()}`,
      schoolName,
      location,
      status: status || 'pending',
      studentsImpacted: studentsImpacted || 0,
      timeAgo: timeAgo || 'just now',
      txId: txId || '',
      supplies: supplies || [],
      principal,
      establishedYear: establishedYear || new Date().getFullYear(),
      totalStudents: totalStudents || 0,
      totalSuppliesDistributed: totalSuppliesDistributed || 0,
      imageSrc:
        imageSrc ||
        `https://via.placeholder.com/400x200/6366f1/ffffff?text=${encodeURIComponent(schoolName)}`,
      isActive: isActive !== undefined ? isActive : true,
    };

    distributions.push(newDistribution);
    res.status(201).json(newDistribution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create distribution' });
  }
});

// PUT update distribution
router.put('/distributions/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const distIndex = distributions.findIndex(d => d.id === id);
    if (distIndex === -1) {
      return res.status(404).json({ error: 'Distribution not found' });
    }

    distributions[distIndex] = {
      ...distributions[distIndex],
      ...updateData,
      id, // Preserve original ID
    };

    res.json(distributions[distIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update distribution' });
  }
});

// DELETE distribution
router.delete('/distributions/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const initialLength = distributions.length;
    distributions = distributions.filter(d => d.id !== id);

    if (distributions.length === initialLength) {
      return res.status(404).json({ error: 'Distribution not found' });
    }

    res.json({ message: 'Distribution deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete distribution' });
  }
});

export default router;
