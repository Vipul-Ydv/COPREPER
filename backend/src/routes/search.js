const express = require('express');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// GET /api/search?q=keyword - Search across projects and snippets
router.get('/', (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const db = getDb();
    const searchTerm = `%${q.trim()}%`;

    // Search projects
    const projects = db.prepare(`
      SELECT id, name, description, tech_stack, 'project' as type
      FROM projects
      WHERE user_id = ? AND (
        name LIKE ? OR
        description LIKE ? OR
        tech_stack LIKE ? OR
        architecture LIKE ? OR
        tradeoffs LIKE ? OR
        challenges LIKE ?
      )
      ORDER BY updated_at DESC
      LIMIT 20
    `).all(
      req.user.id,
      searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm
    );

    // Search snippets (with project info)
    const snippets = db.prepare(`
      SELECT 
        s.id,
        s.title,
        s.code,
        s.language,
        s.explanation,
        s.project_id,
        p.name as project_name,
        'snippet' as type
      FROM code_snippets s
      JOIN projects p ON s.project_id = p.id
      WHERE p.user_id = ? AND (
        s.title LIKE ? OR
        s.code LIKE ? OR
        s.explanation LIKE ?
      )
      ORDER BY s.created_at DESC
      LIMIT 20
    `).all(req.user.id, searchTerm, searchTerm, searchTerm);

    // Search questions
    const questions = db.prepare(`
      SELECT 
        q.id,
        q.question,
        q.suggested_answer,
        q.category,
        q.project_id,
        p.name as project_name,
        'question' as type
      FROM interview_questions q
      JOIN projects p ON q.project_id = p.id
      WHERE p.user_id = ? AND (
        q.question LIKE ? OR
        q.suggested_answer LIKE ?
      )
      ORDER BY q.created_at DESC
      LIMIT 20
    `).all(req.user.id, searchTerm, searchTerm);

    res.json({
      query: q,
      results: {
        projects: projects.map(p => ({
          ...p,
          techStack: JSON.parse(p.tech_stack || '[]')
        })),
        snippets,
        questions
      },
      total: projects.length + snippets.length + questions.length
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
