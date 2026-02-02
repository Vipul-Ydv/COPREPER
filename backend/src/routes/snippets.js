const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Helper to verify project ownership
function verifyProjectOwnership(projectId, userId) {
    const db = getDb();
    const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?')
        .get(projectId, userId);
    return !!project;
}

// GET /api/snippets/:projectId - List snippets for a project
router.get('/:projectId', (req, res, next) => {
    try {
        if (!verifyProjectOwnership(req.params.projectId, req.user.id)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const db = getDb();
        const snippets = db.prepare(`
      SELECT * FROM code_snippets 
      WHERE project_id = ? 
      ORDER BY order_index
    `).all(req.params.projectId);

        res.json(snippets);
    } catch (err) {
        next(err);
    }
});

// POST /api/snippets/:projectId - Create snippet
router.post('/:projectId', (req, res, next) => {
    try {
        if (!verifyProjectOwnership(req.params.projectId, req.user.id)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const { title, code, language, explanation, interviewTip } = req.body;

        if (!title || !code || !language) {
            return res.status(400).json({ error: 'Title, code, and language are required' });
        }

        const db = getDb();

        // Get max order_index
        const maxOrder = db.prepare(`
      SELECT MAX(order_index) as max FROM code_snippets WHERE project_id = ?
    `).get(req.params.projectId);

        const snippetId = uuidv4();

        db.prepare(`
      INSERT INTO code_snippets (id, project_id, title, code, language, explanation, interview_tip, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            snippetId,
            req.params.projectId,
            title,
            code,
            language,
            explanation || null,
            interviewTip || null,
            (maxOrder?.max || 0) + 1
        );

        const snippet = db.prepare('SELECT * FROM code_snippets WHERE id = ?').get(snippetId);
        res.status(201).json(snippet);
    } catch (err) {
        next(err);
    }
});

// PUT /api/snippets/:projectId/:id - Update snippet
router.put('/:projectId/:id', (req, res, next) => {
    try {
        if (!verifyProjectOwnership(req.params.projectId, req.user.id)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const { title, code, language, explanation, interviewTip, orderIndex } = req.body;
        const db = getDb();

        db.prepare(`
      UPDATE code_snippets SET
        title = COALESCE(?, title),
        code = COALESCE(?, code),
        language = COALESCE(?, language),
        explanation = ?,
        interview_tip = ?,
        order_index = COALESCE(?, order_index)
      WHERE id = ? AND project_id = ?
    `).run(
            title,
            code,
            language,
            explanation || null,
            interviewTip || null,
            orderIndex,
            req.params.id,
            req.params.projectId
        );

        const snippet = db.prepare('SELECT * FROM code_snippets WHERE id = ?').get(req.params.id);

        if (!snippet) {
            return res.status(404).json({ error: 'Snippet not found' });
        }

        res.json(snippet);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/snippets/:projectId/:id - Delete snippet
router.delete('/:projectId/:id', (req, res, next) => {
    try {
        if (!verifyProjectOwnership(req.params.projectId, req.user.id)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const db = getDb();
        const result = db.prepare('DELETE FROM code_snippets WHERE id = ? AND project_id = ?')
            .run(req.params.id, req.params.projectId);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Snippet not found' });
        }

        res.json({ message: 'Snippet deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
