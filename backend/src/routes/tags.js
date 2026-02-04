const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/tags - List all tags for user
router.get('/', async (req, res, next) => {
    try {
        const db = getDb();
        const tags = await db.prepare(`
            SELECT t.*, COUNT(pt.project_id) as project_count
            FROM tags t
            LEFT JOIN project_tags pt ON t.id = pt.tag_id
            WHERE t.user_id = ?
            GROUP BY t.id
            ORDER BY t.name ASC
        `).all(req.user.id);

        res.json(tags);
    } catch (err) {
        next(err);
    }
});

// POST /api/tags - Create new tag
router.post('/', async (req, res, next) => {
    try {
        const db = getDb();
        const { name, color } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Tag name is required' });
        }

        const tagId = uuidv4();
        const tagName = name.trim();
        const tagColor = color || '#8b5cf6';

        // Check if tag already exists
        const existing = await db.prepare(
            'SELECT id FROM tags WHERE user_id = ? AND LOWER(name) = LOWER(?)'
        ).get(req.user.id, tagName);

        if (existing) {
            return res.status(409).json({ error: 'Tag already exists', existingId: existing.id });
        }

        await db.prepare(`
            INSERT INTO tags (id, user_id, name, color)
            VALUES (?, ?, ?, ?)
        `).run(tagId, req.user.id, tagName, tagColor);

        const tag = await db.prepare('SELECT * FROM tags WHERE id = ?').get(tagId);
        res.status(201).json(tag);
    } catch (err) {
        next(err);
    }
});

// PUT /api/tags/:id - Update tag
router.put('/:id', async (req, res, next) => {
    try {
        const db = getDb();
        const { name, color } = req.body;

        // Check ownership
        const existing = await db.prepare(
            'SELECT id FROM tags WHERE id = ? AND user_id = ?'
        ).get(req.params.id, req.user.id);

        if (!existing) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        // Check for duplicate name
        if (name) {
            const duplicate = await db.prepare(
                'SELECT id FROM tags WHERE user_id = ? AND LOWER(name) = LOWER(?) AND id != ?'
            ).get(req.user.id, name.trim(), req.params.id);

            if (duplicate) {
                return res.status(409).json({ error: 'Tag name already exists' });
            }
        }

        await db.prepare(`
            UPDATE tags SET
                name = COALESCE(?, name),
                color = COALESCE(?, color)
            WHERE id = ?
        `).run(name?.trim() || null, color || null, req.params.id);

        const tag = await db.prepare('SELECT * FROM tags WHERE id = ?').get(req.params.id);
        res.json(tag);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', async (req, res, next) => {
    try {
        const db = getDb();
        const result = await db.prepare(
            'DELETE FROM tags WHERE id = ? AND user_id = ?'
        ).run(req.params.id, req.user.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.json({ message: 'Tag deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// POST /api/tags/:id/projects - Add tag to multiple projects
router.post('/:id/projects', async (req, res, next) => {
    try {
        const db = getDb();
        const { projectIds } = req.body;

        if (!Array.isArray(projectIds) || projectIds.length === 0) {
            return res.status(400).json({ error: 'projectIds array is required' });
        }

        // Verify tag ownership
        const tag = await db.prepare(
            'SELECT id FROM tags WHERE id = ? AND user_id = ?'
        ).get(req.params.id, req.user.id);

        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        // Add tag to each project
        for (const projectId of projectIds) {
            // Verify project ownership
            const project = await db.prepare(
                'SELECT id FROM projects WHERE id = ? AND user_id = ?'
            ).get(projectId, req.user.id);

            if (project) {
                // Insert if not exists (ignore duplicates)
                try {
                    await db.prepare(`
                        INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)
                    `).run(projectId, req.params.id);
                } catch (e) {
                    // Ignore duplicate key errors
                }
            }
        }

        res.json({ message: 'Tag added to projects' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
