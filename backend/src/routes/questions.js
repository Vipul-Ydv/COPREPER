const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Helper to verify project ownership
async function verifyProjectOwnership(projectId, userId) {
    const db = getDb();
    const project = await db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?')
        .get(projectId, userId);
    return !!project;
}

// GET /api/questions/:projectId - List questions for a project
router.get('/:projectId', async (req, res, next) => {
    try {
        if (!await verifyProjectOwnership(req.params.projectId, req.user.id)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const db = getDb();
        const questions = await db.prepare(`
      SELECT * FROM interview_questions 
      WHERE project_id = ? 
      ORDER BY created_at
    `).all(req.params.projectId);

        res.json(questions);
    } catch (err) {
        next(err);
    }
});

// POST /api/questions/:projectId - Create question
router.post('/:projectId', async (req, res, next) => {
    try {
        if (!await verifyProjectOwnership(req.params.projectId, req.user.id)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const { question, suggestedAnswer, category, difficulty, isAiGenerated } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question text is required' });
        }

        const validCategories = ['technical', 'architecture', 'debugging', 'scaling', 'behavioral', 'overview'];
        const validDifficulty = ['easy', 'medium', 'hard'];

        if (category && !validCategories.includes(category)) {
            return res.status(400).json({ error: `Category must be one of: ${validCategories.join(', ')}` });
        }

        if (difficulty && !validDifficulty.includes(difficulty)) {
            return res.status(400).json({ error: `Difficulty must be one of: ${validDifficulty.join(', ')}` });
        }

        const db = getDb();
        const questionId = uuidv4();

        await db.prepare(`
      INSERT INTO interview_questions (id, project_id, question, suggested_answer, category, difficulty, is_ai_generated)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
            questionId,
            req.params.projectId,
            question,
            suggestedAnswer || null,
            category || 'technical',
            difficulty || 'medium',
            isAiGenerated ? 1 : 0
        );

        const created = await db.prepare('SELECT * FROM interview_questions WHERE id = ?').get(questionId);
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
});

// PUT /api/questions/:projectId/:id - Update question
router.put('/:projectId/:id', async (req, res, next) => {
    try {
        if (!await verifyProjectOwnership(req.params.projectId, req.user.id)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const { question, suggestedAnswer, category, difficulty } = req.body;
        const db = getDb();

        await db.prepare(`
      UPDATE interview_questions SET
        question = COALESCE(?, question),
        suggested_answer = ?,
        category = COALESCE(?, category),
        difficulty = COALESCE(?, difficulty)
      WHERE id = ? AND project_id = ?
    `).run(
            question,
            suggestedAnswer || null,
            category,
            difficulty,
            req.params.id,
            req.params.projectId
        );

        const updated = await db.prepare('SELECT * FROM interview_questions WHERE id = ?').get(req.params.id);

        if (!updated) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json(updated);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/questions/:projectId/:id - Delete question
router.delete('/:projectId/:id', async (req, res, next) => {
    try {
        if (!await verifyProjectOwnership(req.params.projectId, req.user.id)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const db = getDb();
        const result = await db.prepare('DELETE FROM interview_questions WHERE id = ? AND project_id = ?')
            .run(req.params.id, req.params.projectId);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
