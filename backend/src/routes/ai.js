const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { getProvider } = require('../services/ai');

const router = express.Router();
router.use(authenticateToken);

// Helper to verify project ownership
function verifyProjectOwnership(projectId, userId) {
    const db = getDb();
    const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?')
        .get(projectId, userId);
    return project;
}

// POST /api/ai/generate-questions/:projectId - Generate interview questions
router.post('/generate-questions/:projectId', async (req, res, next) => {
    try {
        const project = verifyProjectOwnership(req.params.projectId, req.user.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const { count = 5 } = req.body;
        const ai = getProvider();

        // Parse tech stack
        const projectData = {
            ...project,
            techStack: JSON.parse(project.tech_stack || '[]')
        };

        const questions = await ai.generateQuestions(projectData, Math.min(count, 10));

        res.json({ questions });
    } catch (err) {
        next(err);
    }
});

// POST /api/ai/evaluate/:projectId - Evaluate an answer
router.post('/evaluate/:projectId', async (req, res, next) => {
    try {
        const project = verifyProjectOwnership(req.params.projectId, req.user.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: 'Question and answer are required' });
        }

        const ai = getProvider();
        const projectData = {
            ...project,
            techStack: JSON.parse(project.tech_stack || '[]')
        };

        const evaluation = await ai.evaluateAnswer(projectData, question, answer);

        res.json(evaluation);
    } catch (err) {
        next(err);
    }
});

// POST /api/ai/start-session/:projectId - Start an interview session
router.post('/start-session/:projectId', async (req, res, next) => {
    try {
        const project = verifyProjectOwnership(req.params.projectId, req.user.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const db = getDb();
        const sessionId = uuidv4();

        db.prepare(`
      INSERT INTO ai_interview_sessions (id, project_id, started_at)
      VALUES (?, ?, datetime('now'))
    `).run(sessionId, req.params.projectId);

        // Generate initial questions
        const ai = getProvider();
        const projectData = {
            ...project,
            techStack: JSON.parse(project.tech_stack || '[]')
        };
        const questions = await ai.generateQuestions(projectData, 5);

        res.status(201).json({
            sessionId,
            projectName: project.name,
            questions
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/ai/submit-answer/:sessionId - Submit answer for a session
router.post('/submit-answer/:sessionId', async (req, res, next) => {
    try {
        const db = getDb();
        const { question, answer, questionId } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: 'Question and answer are required' });
        }

        // Get session and verify ownership
        const session = db.prepare(`
      SELECT s.*, p.user_id, p.name as project_name, p.tech_stack, p.description,
             p.problem, p.solution, p.architecture, p.challenges
      FROM ai_interview_sessions s
      JOIN projects p ON s.project_id = p.id
      WHERE s.id = ?
    `).get(req.params.sessionId);

        if (!session || session.user_id !== req.user.id) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const ai = getProvider();
        const projectData = {
            name: session.project_name,
            description: session.description,
            problem: session.problem,
            solution: session.solution,
            architecture: session.architecture,
            challenges: session.challenges,
            techStack: JSON.parse(session.tech_stack || '[]')
        };

        const evaluation = await ai.evaluateAnswer(projectData, question, answer);

        // Store response
        const responseId = uuidv4();
        const qId = questionId || uuidv4();

        // Create question if not exists
        db.prepare(`
      INSERT OR IGNORE INTO interview_questions (id, project_id, question, category)
      VALUES (?, ?, ?, 'technical')
    `).run(qId, session.project_id, question);

        db.prepare(`
      INSERT INTO session_responses (id, session_id, question_id, user_response, ai_feedback, scores, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
            responseId,
            req.params.sessionId,
            qId,
            answer,
            evaluation.feedback,
            JSON.stringify(evaluation.scores),
            Math.round(evaluation.overallScore)
        );

        res.json({
            responseId,
            ...evaluation
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/ai/end-session/:sessionId - End session and get summary
router.post('/end-session/:sessionId', async (req, res, next) => {
    try {
        const db = getDb();

        // Get session and verify ownership
        const session = db.prepare(`
      SELECT s.*, p.user_id
      FROM ai_interview_sessions s
      JOIN projects p ON s.project_id = p.id
      WHERE s.id = ?
    `).get(req.params.sessionId);

        if (!session || session.user_id !== req.user.id) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Get all responses for this session
        const responses = db.prepare(`
      SELECT * FROM session_responses WHERE session_id = ?
    `).all(req.params.sessionId);

        const parsedResponses = responses.map(r => ({
            ...r,
            scores: JSON.parse(r.scores || '{}')
        }));

        const ai = getProvider();
        const summary = await ai.generateSessionSummary(parsedResponses);

        // Update session
        db.prepare(`
      UPDATE ai_interview_sessions 
      SET ended_at = datetime('now'), score = ?, feedback = ?
      WHERE id = ?
    `).run(
            Math.round(summary.overallScore * 20), // Convert to 0-100
            summary.recommendation,
            req.params.sessionId
        );

        res.json(summary);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
