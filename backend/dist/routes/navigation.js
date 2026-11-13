"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const activityLog_1 = require("../services/activityLog");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
// GET /api/v1/navigation - list all nav items
router.get('/', async (_req, res) => {
    try {
        const items = await prisma_1.default.navigationitem.findMany({
            orderBy: { order: 'asc' },
        });
        res.json(items);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch navigation items' });
    }
});
// POST /api/v1/navigation - create nav item
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { name, url, order, isVisible, target, parentId, websitePageId } = req.body;
        if (!name || !url) {
            return res.status(400).json({ error: 'name and url are required' });
        }
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36).slice(-4);
        const item = await prisma_1.default.navigationitem.create({
            data: {
                id: (0, uuid_1.v4)(),
                slug,
                name,
                url,
                order: order ?? 99,
                isVisible: isVisible !== false,
                target: target || '_self',
                parentId: parentId || null,
                websitePageId: websitePageId || null,
            },
        });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'nav_item_created',
            resource: 'navigation',
            resourceId: item.id,
        });
        res.status(201).json(item);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to create navigation item' });
    }
});
// PUT /api/v1/navigation/:id - update nav item
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { name, url, order, isVisible, target, parentId } = req.body;
        const item = await prisma_1.default.navigationitem.update({
            where: { id: req.params.id },
            data: {
                name,
                url,
                order: order ?? 99,
                isVisible: isVisible !== false,
                target: target || '_self',
                parentId: parentId || null,
            },
        });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'nav_item_updated',
            resource: 'navigation',
            resourceId: item.id,
        });
        res.json(item);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update navigation item' });
    }
});
// DELETE /api/v1/navigation/:id - delete nav item
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        await prisma_1.default.navigationitem.delete({ where: { id: req.params.id } });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'nav_item_deleted',
            resource: 'navigation',
            resourceId: req.params.id,
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete navigation item' });
    }
});
// PUT /api/v1/navigation/reorder/bulk - bulk reorder
router.put('/reorder/bulk', auth_1.authenticate, async (req, res) => {
    try {
        const { order } = req.body; // Array of { id, order }
        const updates = order.map(item => prisma_1.default.navigationitem.update({
            where: { id: item.id },
            data: { order: item.order },
        }));
        await prisma_1.default.$transaction(updates);
        res.json({ success: true });
    }
    catch {
        res.status(500).json({ error: 'Failed to reorder navigation items' });
    }
});
exports.default = router;
