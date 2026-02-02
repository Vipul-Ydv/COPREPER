const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
    try {
        const { email, password, displayName } = req.body;
        const db = getDb();

        // Validation
        if (!email || !password || !displayName) {
            return res.status(400).json({ error: 'Email, password, and display name are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Check if user exists
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const userId = uuidv4();
        db.prepare(`
      INSERT INTO users (id, email, password_hash, display_name)
      VALUES (?, ?, ?, ?)
    `).run(userId, email, passwordHash, displayName);

        // Get created user
        const user = db.prepare('SELECT id, email, display_name, created_at FROM users WHERE id = ?').get(userId);

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                displayName: user.display_name,
                createdAt: user.created_at
            },
            token
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const db = getDb();

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                displayName: user.display_name,
                createdAt: user.created_at
            },
            token
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me - Get current user
router.get('/me', require('../middleware/auth').authenticateToken, (req, res) => {
    const db = getDb();
    const user = db.prepare('SELECT id, email, display_name, created_at FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        createdAt: user.created_at
    });
});

module.exports = router;
