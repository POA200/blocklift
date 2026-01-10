"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("../data");
const router = express_1.default.Router();
console.log('✅ Admin router loaded successfully');
// Type definitions
// GET all metrics
router.get('/metrics', (req, res) => {
    try {
        res.json(data_1.store.metrics);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});
// POST new metric
router.post('/metrics', (req, res) => {
    try {
        const { key, label, desc, value, prefix, suffix } = req.body;
        if (!key || !label || value === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newMetric = {
            key,
            label,
            desc: desc || '',
            value,
            prefix,
            suffix,
        };
        data_1.store.metrics.push(newMetric);
        res.status(201).json(newMetric);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create metric' });
    }
});
// PUT update metric
router.put('/metrics/:key', (req, res) => {
    try {
        const { key } = req.params;
        const { label, desc, value, prefix, suffix } = req.body;
        const metricIndex = data_1.store.metrics.findIndex(m => m.key === key);
        if (metricIndex === -1) {
            return res.status(404).json({ error: 'Metric not found' });
        }
        const currentMetric = data_1.store.metrics[metricIndex];
        const updatedMetric = {
            key: currentMetric.key,
            label: label !== undefined ? label : currentMetric.label,
            desc: desc !== undefined ? desc : currentMetric.desc,
            value: value !== undefined ? value : currentMetric.value,
            prefix: prefix !== undefined ? prefix : currentMetric.prefix,
            suffix: suffix !== undefined ? suffix : currentMetric.suffix,
        };
        data_1.store.metrics[metricIndex] = updatedMetric;
        res.json(data_1.store.metrics[metricIndex]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update metric' });
    }
});
// DELETE metric
router.delete('/metrics/:key', (req, res) => {
    try {
        const { key } = req.params;
        const initialLength = data_1.store.metrics.length;
        const next = data_1.store.metrics.filter(m => m.key !== key);
        if (next.length === initialLength) {
            return res.status(404).json({ error: 'Metric not found' });
        }
        data_1.store.metrics.splice(0, data_1.store.metrics.length, ...next);
        res.json({ message: 'Metric deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete metric' });
    }
});
// GET all distributions
router.get('/distributions', (req, res) => {
    try {
        res.json(data_1.store.distributions);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch distributions' });
    }
});
// POST new distribution
router.post('/distributions', (req, res) => {
    try {
        const { schoolName, location, status, studentsImpacted, timeAgo, txId, supplies, principal, establishedYear, totalStudents, totalSuppliesDistributed, imageSrc, isActive, } = req.body;
        if (!schoolName || !location || !principal) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newDistribution = {
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
            imageSrc: imageSrc ||
                `https://via.placeholder.com/400x200/6366f1/ffffff?text=${encodeURIComponent(schoolName)}`,
            isActive: isActive !== undefined ? isActive : true,
        };
        data_1.store.distributions.push(newDistribution);
        res.status(201).json(newDistribution);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create distribution' });
    }
});
// PUT update distribution
router.put('/distributions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const distIndex = data_1.store.distributions.findIndex(d => d.id === id);
        if (distIndex === -1) {
            return res.status(404).json({ error: 'Distribution not found' });
        }
        data_1.store.distributions[distIndex] = {
            ...data_1.store.distributions[distIndex],
            ...updateData,
            id, // Preserve original ID
        };
        res.json(data_1.store.distributions[distIndex]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update distribution' });
    }
});
// DELETE distribution
router.delete('/distributions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const initialLength = data_1.store.distributions.length;
        const next = data_1.store.distributions.filter(d => d.id !== id);
        if (next.length === initialLength) {
            return res.status(404).json({ error: 'Distribution not found' });
        }
        data_1.store.distributions.splice(0, data_1.store.distributions.length, ...next);
        res.json({ message: 'Distribution deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete distribution' });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map