const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/projects - List all projects for user
router.get('/', async (req, res, next) => {
    try {
        const db = getDb();
        const { tag } = req.query;

        let projects;
        if (tag) {
            // Filter by tag
            projects = await db.prepare(`
                SELECT p.id, p.name, p.description, p.tech_stack, p.github_url, p.live_url, p.created_at, p.updated_at
                FROM projects p
                INNER JOIN project_tags pt ON p.id = pt.project_id
                WHERE p.user_id = ? AND pt.tag_id = ?
                ORDER BY p.updated_at DESC
            `).all(req.user.id, tag);
        } else {
            projects = await db.prepare(`
                SELECT id, name, description, tech_stack, github_url, live_url, created_at, updated_at
                FROM projects
                WHERE user_id = ?
                ORDER BY updated_at DESC
            `).all(req.user.id);
        }

        // Get tags for each project
        const parsed = await Promise.all(projects.map(async (p) => {
            const tags = await db.prepare(`
                SELECT t.id, t.name, t.color
                FROM tags t
                INNER JOIN project_tags pt ON t.id = pt.tag_id
                WHERE pt.project_id = ?
            `).all(p.id);

            return {
                ...p,
                techStack: JSON.parse(p.tech_stack || '[]'),
                tags
            };
        }));

        res.json(parsed);
    } catch (err) {
        next(err);
    }
});

// GET /api/projects/:id - Get single project with all details
router.get('/:id', async (req, res, next) => {
    try {
        const db = getDb();
        const project = await db.prepare(`
            SELECT * FROM projects WHERE id = ? AND user_id = ?
        `).get(req.params.id, req.user.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Get snippets
        const snippets = await db.prepare(`
            SELECT * FROM code_snippets WHERE project_id = ? ORDER BY order_index
        `).all(req.params.id);

        // Get questions
        const questions = await db.prepare(`
            SELECT * FROM interview_questions WHERE project_id = ? ORDER BY created_at
        `).all(req.params.id);

        // Get tags
        const tags = await db.prepare(`
            SELECT t.id, t.name, t.color
            FROM tags t
            INNER JOIN project_tags pt ON t.id = pt.tag_id
            WHERE pt.project_id = ?
        `).all(req.params.id);

        res.json({
            ...project,
            techStack: JSON.parse(project.tech_stack || '[]'),
            snippets,
            questions,
            tags
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/projects - Create new project
router.post('/', async (req, res, next) => {
    try {
        const db = getDb();
        const {
            name,
            description,
            problem,
            solution,
            techStack,
            githubUrl,
            liveUrl,
            architecture,
            tradeoffs,
            challenges,
            improvements,
            interviewNotes,
            tagIds
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const projectId = uuidv4();

        await db.prepare(`
            INSERT INTO projects (
                id, user_id, name, description, problem, solution, tech_stack,
                github_url, live_url, architecture, tradeoffs, challenges,
                improvements, interview_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            projectId,
            req.user.id,
            name,
            description || null,
            problem || null,
            solution || null,
            JSON.stringify(techStack || []),
            githubUrl || null,
            liveUrl || null,
            architecture || null,
            tradeoffs || null,
            challenges || null,
            improvements || null,
            interviewNotes || null
        );

        // Add tags if provided
        if (tagIds && Array.isArray(tagIds)) {
            for (const tagId of tagIds) {
                // Verify tag belongs to user
                const tag = await db.prepare(
                    'SELECT id FROM tags WHERE id = ? AND user_id = ?'
                ).get(tagId, req.user.id);
                if (tag) {
                    await db.prepare(
                        'INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)'
                    ).run(projectId, tagId);
                }
            }
        }

        const project = await db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
        const tags = await db.prepare(`
            SELECT t.id, t.name, t.color
            FROM tags t
            INNER JOIN project_tags pt ON t.id = pt.tag_id
            WHERE pt.project_id = ?
        `).all(projectId);

        res.status(201).json({
            ...project,
            techStack: JSON.parse(project.tech_stack || '[]'),
            tags
        });
    } catch (err) {
        next(err);
    }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res, next) => {
    try {
        const db = getDb();

        // Check ownership
        const existing = await db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?')
            .get(req.params.id, req.user.id);

        if (!existing) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const {
            name,
            description,
            problem,
            solution,
            techStack,
            githubUrl,
            liveUrl,
            architecture,
            tradeoffs,
            challenges,
            improvements,
            interviewNotes,
            tagIds
        } = req.body;

        await db.prepare(`
            UPDATE projects SET
                name = COALESCE(?, name),
                description = ?,
                problem = ?,
                solution = ?,
                tech_stack = ?,
                github_url = ?,
                live_url = ?,
                architecture = ?,
                tradeoffs = ?,
                challenges = ?,
                improvements = ?,
                interview_notes = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            name,
            description || null,
            problem || null,
            solution || null,
            JSON.stringify(techStack || []),
            githubUrl || null,
            liveUrl || null,
            architecture || null,
            tradeoffs || null,
            challenges || null,
            improvements || null,
            interviewNotes || null,
            req.params.id
        );

        // Update tags if provided
        if (tagIds !== undefined && Array.isArray(tagIds)) {
            // Remove all existing tags
            await db.prepare('DELETE FROM project_tags WHERE project_id = ?')
                .run(req.params.id);

            // Add new tags
            for (const tagId of tagIds) {
                // Verify tag belongs to user
                const tag = await db.prepare(
                    'SELECT id FROM tags WHERE id = ? AND user_id = ?'
                ).get(tagId, req.user.id);
                if (tag) {
                    await db.prepare(
                        'INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)'
                    ).run(req.params.id, tagId);
                }
            }
        }

        const project = await db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
        const tags = await db.prepare(`
            SELECT t.id, t.name, t.color
            FROM tags t
            INNER JOIN project_tags pt ON t.id = pt.tag_id
            WHERE pt.project_id = ?
        `).all(req.params.id);

        res.json({
            ...project,
            techStack: JSON.parse(project.tech_stack || '[]'),
            tags
        });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res, next) => {
    try {
        const db = getDb();
        const result = await db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?')
            .run(req.params.id, req.user.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
