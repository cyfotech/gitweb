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
// ─── helpers ───────────────────────────────────────────────────────────────
// canonical field list per section. Returns an array of { fieldKey, fieldType, value }.
// When includeDraft is true, values from draftData override the published columns.
function buildFieldList(section, includeDraft = false) {
    let publishedContent = {};
    let draftContent = {};
    if (section.content) {
        try {
            publishedContent = JSON.parse(section.content);
        }
        catch {
            publishedContent = { text: section.content };
        }
    }
    if (section.draftData && includeDraft) {
        try {
            const d = JSON.parse(section.draftData);
            draftContent = d.content && typeof d.content === 'object' ? d.content : d;
        }
        catch { /* ignore */ }
    }
    const merged = { ...publishedContent, ...draftContent };
    const fields = [
        { fieldKey: 'title', fieldType: 'text', value: section.title },
        { fieldKey: 'subheading', fieldType: 'text', value: section.subheading || '' },
        { fieldKey: 'description', fieldType: 'richtext', value: section.description },
        { fieldKey: 'backgroundImage', fieldType: 'image', value: section.backgroundImage || '' },
        { fieldKey: 'backgroundVideo', fieldType: 'url', value: section.backgroundVideo || '' },
        { fieldKey: 'imagePosition', fieldType: 'select', value: section.imagePosition || 'left' },
        { fieldKey: 'imageAltText', fieldType: 'text', value: section.imageAltText || '' },
    ];
    for (const [k, v] of Object.entries(merged)) {
        fields.push({
            fieldKey: k,
            fieldType: typeof v === 'object' ? 'richtext' : 'text',
            value: typeof v === 'object' ? v : String(v),
        });
    }
    return fields;
}
// Apply a field-array (the shape the editor sends) onto a snapshot object.
function applyFields(target, fields) {
    if (!Array.isArray(fields))
        return target;
    for (const f of fields) {
        if (!f || !f.fieldKey)
            continue;
        const key = f.fieldKey;
        const val = f.value;
        if (key === 'title')
            target.title = val || '';
        else if (key === 'subheading')
            target.subheading = val ?? null;
        else if (key === 'description')
            target.description = val || '';
        else if (key === 'backgroundImage')
            target.backgroundImage = val || null;
        else if (key === 'backgroundVideo')
            target.backgroundVideo = val || null;
        else if (key === 'imagePosition')
            target.imagePosition = val || 'left';
        else if (key === 'imageAltText')
            target.imageAltText = val || null;
        else
            target.content[key] = val;
    }
    return target;
}
function validateFields(fields) {
    if (!Array.isArray(fields))
        return 'fields must be an array';
    const allowed = new Set([
        'title', 'subheading', 'description', 'backgroundImage', 'backgroundVideo', 'imagePosition', 'imageAltText',
    ]);
    for (const f of fields) {
        if (!f || typeof f !== 'object' || typeof f.fieldKey !== 'string') {
            return 'each field needs a string fieldKey';
        }
        if (!allowed.has(f.fieldKey) && f.fieldKey.startsWith('chart'))
            continue;
    }
    return null;
}
// ─── GET /:id ──────────────────────────────────────────────────────────────
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const section = await prisma_1.default.pagesection.findUnique({
            where: { id: req.params.id },
            include: {
                contentrevision: {
                    orderBy: { createdAt: 'desc' },
                    take: 15,
                },
            },
        });
        if (!section)
            return res.status(404).json({ error: 'Section not found' });
        const hasDraft = !!section.draftData;
        res.json({
            id: section.id,
            pageId: section.pageId,
            sectionKey: section.sectionKey,
            componentName: section.sectionType || section.sectionKey,
            displayOrder: section.displayOrder,
            isVisible: section.isEnabled,
            hasDraft,
            content: buildFieldList(section, true),
            revisions: section.contentrevision,
        });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch section' });
    }
});
// ─── PUT /:id/draft — overwrite the draft ───────────────────────────────────
router.put('/:id/draft', auth_1.authenticate, async (req, res) => {
    try {
        const { fields, note, expectedUpdatedAt } = req.body;
        const sectionId = String(req.params.id);
        const current = await prisma_1.default.pagesection.findUnique({ where: { id: sectionId } });
        if (!current)
            return res.status(404).json({ error: 'Section not found' });
        const validationError = validateFields(fields);
        if (validationError)
            return res.status(422).json({ error: validationError });
        if (expectedUpdatedAt !== undefined && (typeof expectedUpdatedAt !== 'string' || Number.isNaN(Date.parse(expectedUpdatedAt)))) {
            return res.status(422).json({ error: 'expectedUpdatedAt must be a valid timestamp' });
        }
        const snapshot = {
            title: current.title,
            subheading: current.subheading,
            description: current.description,
            backgroundImage: current.backgroundImage,
            backgroundVideo: current.backgroundVideo,
            imagePosition: current.imagePosition,
            imageAltText: current.imageAltText,
            content: {},
        };
        if (current.content) {
            try {
                snapshot.content = JSON.parse(current.content);
            }
            catch {
                snapshot.content = { text: current.content };
            }
        }
        applyFields(snapshot, fields);
        snapshot.content = snapshot.content || {};
        if (expectedUpdatedAt) {
            const result = await prisma_1.default.pagesection.updateMany({
                where: { id: sectionId, updatedAt: new Date(expectedUpdatedAt) },
                data: { draftData: JSON.stringify(snapshot) },
            });
            if (result.count === 0) {
                return res.status(409).json({ error: 'Section content changed since it was loaded. Reload before saving.' });
            }
        }
        else {
            await prisma_1.default.pagesection.update({
                where: { id: sectionId },
                data: { draftData: JSON.stringify(snapshot) },
            });
        }
        const savedSection = await prisma_1.default.pagesection.findUnique({
            where: { id: sectionId },
            select: { updatedAt: true },
        });
        await prisma_1.default.contentrevision.create({
            data: {
                id: (0, uuid_1.v4)(),
                sectionId,
                previousData: { draftData: current.draftData || null },
                newData: snapshot,
                changeType: 'draft_save',
                changeNotes: note || 'Draft saved',
                adminUserId: req.admin?.adminId || null,
            },
        });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'section_saved_draft',
            resource: 'section',
            resourceId: sectionId,
        });
        res.json({ success: true, hasDraft: true, updatedAt: savedSection?.updatedAt });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to save draft' });
    }
});
// ─── PUT /:id/publish — promote draft (or given fields) into live columns ──
router.put('/:id/publish', auth_1.authenticate, async (req, res) => {
    try {
        const { fields, note } = req.body;
        const current = await prisma_1.default.pagesection.findUnique({ where: { id: req.params.id } });
        if (!current)
            return res.status(404).json({ error: 'Section not found' });
        let live = {
            title: current.title,
            subheading: current.subheading,
            description: current.description,
            backgroundImage: current.backgroundImage,
            backgroundVideo: current.backgroundVideo,
            imagePosition: current.imagePosition,
            imageAltText: current.imageAltText,
            content: {},
        };
        if (current.content) {
            try {
                live.content = JSON.parse(current.content);
            }
            catch {
                live.content = { text: current.content };
            }
        }
        if (Array.isArray(fields) && fields.length) {
            const validationError = validateFields(fields);
            if (validationError)
                return res.status(422).json({ error: validationError });
            applyFields(live, fields);
        }
        else if (current.draftData) {
            try {
                const d = JSON.parse(current.draftData);
                live = d;
            }
            catch { /* ignore */ }
        }
        live.content = live.content || {};
        await prisma_1.default.pagesection.update({
            where: { id: req.params.id },
            data: {
                title: live.title,
                subheading: live.subheading,
                description: live.description,
                backgroundImage: live.backgroundImage,
                backgroundVideo: live.backgroundVideo,
                imagePosition: live.imagePosition,
                imageAltText: live.imageAltText,
                content: JSON.stringify(live.content),
                draftData: null,
                publishedAt: new Date(),
            },
        });
        await prisma_1.default.contentrevision.create({
            data: {
                id: (0, uuid_1.v4)(),
                sectionId: req.params.id,
                previousData: current,
                newData: live,
                changeType: 'publish',
                changeNotes: note || 'Published',
                adminUserId: req.admin?.adminId || null,
            },
        });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'section_published',
            resource: 'section',
            resourceId: req.params.id,
        });
        res.json({ success: true, publishedAt: new Date() });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to publish' });
    }
});
// ─── PUT /:id/rename ───────────────────────────────────────────────────────
router.put('/:id/rename', auth_1.authenticate, async (req, res) => {
    try {
        const { sectionKey, title } = req.body;
        if (!sectionKey || !sectionKey.trim()) {
            return res.status(422).json({ error: 'sectionKey is required' });
        }
        const parent = await prisma_1.default.pagesection.findUnique({ where: { id: req.params.id } });
        const existing = await prisma_1.default.pagesection.findFirst({
            where: { sectionKey: sectionKey.trim(), pageId: parent?.pageId, id: { not: req.params.id } },
        });
        if (existing)
            return res.status(409).json({ error: 'A section with that key already exists on this page' });
        const section = await prisma_1.default.pagesection.update({
            where: { id: req.params.id },
            data: { sectionKey: sectionKey.trim(), title: title?.trim() || undefined },
        });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'section_renamed',
            resource: 'section',
            resourceId: req.params.id,
        });
        res.json(section);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to rename section' });
    }
});
// ─── PUT /:id/visibility ───────────────────────────────────────────────────
router.put('/:id/visibility', auth_1.authenticate, async (req, res) => {
    try {
        const { isVisible } = req.body;
        if (typeof isVisible !== 'boolean')
            return res.status(422).json({ error: 'isVisible must be a boolean' });
        const section = await prisma_1.default.pagesection.update({
            where: { id: req.params.id },
            data: { isEnabled: isVisible },
        });
        res.json(section);
    }
    catch {
        res.status(500).json({ error: 'Failed to update visibility' });
    }
});
// ─── POST / — create section ───────────────────────────────────────────────
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { pageId, sectionKey, sectionType, title, subheading, description, content, backgroundImage, backgroundVideo, displayOrder, } = req.body;
        if (!pageId || !sectionKey) {
            return res.status(400).json({ error: 'pageId and sectionKey are required' });
        }
        const newSection = await prisma_1.default.pagesection.create({
            data: {
                id: (0, uuid_1.v4)(),
                pageId,
                sectionKey,
                sectionType: sectionType || 'CustomSection',
                title: title || 'New Section Headline',
                subheading: subheading || '',
                description: description || '',
                content: content || null,
                backgroundImage: backgroundImage || null,
                backgroundVideo: backgroundVideo || null,
                displayOrder: displayOrder ?? 99,
                isEnabled: true,
            },
        });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'section_created',
            resource: 'section',
            resourceId: newSection.id,
            details: { pageId, sectionKey, sectionType },
        });
        res.status(201).json(newSection);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to create section' });
    }
});
// ─── DELETE /:id ───────────────────────────────────────────────────────────
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const section = await prisma_1.default.pagesection.findUnique({ where: { id: req.params.id } });
        if (!section)
            return res.status(404).json({ error: 'Section not found' });
        await prisma_1.default.contentrevision.deleteMany({ where: { sectionId: req.params.id } });
        await prisma_1.default.pagesection.delete({ where: { id: req.params.id } });
        await (0, activityLog_1.logActivity)({
            adminId: req.admin?.adminId,
            action: 'section_deleted',
            resource: 'section',
            resourceId: req.params.id,
        });
        res.json({ success: true, id: req.params.id });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to delete section' });
    }
});
// ─── POST /:id/duplicate ───────────────────────────────────────────────────
router.post('/:id/duplicate', auth_1.authenticate, async (req, res) => {
    try {
        const original = await prisma_1.default.pagesection.findUnique({ where: { id: req.params.id } });
        if (!original)
            return res.status(404).json({ error: 'Section not found' });
        const newKey = `${original.sectionKey}_copy_${Date.now().toString(36).slice(-4)}`;
        const duplicated = await prisma_1.default.pagesection.create({
            data: {
                id: (0, uuid_1.v4)(),
                pageId: original.pageId,
                sectionKey: newKey,
                sectionType: original.sectionType,
                title: original.title ? `${original.title} (Copy)` : 'Copy Section',
                subheading: original.subheading,
                description: original.description,
                content: original.content,
                backgroundImage: original.backgroundImage,
                backgroundVideo: original.backgroundVideo,
                imagePosition: original.imagePosition,
                imageAltText: original.imageAltText,
                displayOrder: original.displayOrder + 1,
                isEnabled: true,
            },
        });
        res.status(201).json(duplicated);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to duplicate section' });
    }
});
// ─── POST /:id/restore/:revisionId ─────────────────────────────────────────
router.post('/:id/restore/:revisionId', auth_1.authenticate, async (req, res) => {
    try {
        const rev = await prisma_1.default.contentrevision.findUnique({
            where: { id: req.params.revisionId },
        });
        if (!rev)
            return res.status(404).json({ error: 'Revision not found' });
        const prev = rev.previousData;
        if (prev) {
            await prisma_1.default.pagesection.update({
                where: { id: req.params.id },
                data: {
                    title: prev.title,
                    subheading: prev.subheading,
                    description: prev.description,
                    content: prev.content,
                    backgroundImage: prev.backgroundImage,
                    backgroundVideo: prev.backgroundVideo,
                    draftData: null,
                },
            });
        }
        res.json({ success: true });
    }
    catch {
        res.status(500).json({ error: 'Failed to restore revision' });
    }
});
exports.default = router;
