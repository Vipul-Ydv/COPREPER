require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Initialize database and start server
async function start() {
  await initDatabase();

  // Import routes after DB is initialized
  const authRoutes = require('./routes/auth');
  const projectRoutes = require('./routes/projects');
  const snippetRoutes = require('./routes/snippets');
  const questionRoutes = require('./routes/questions');
  const searchRoutes = require('./routes/search');
  const aiRoutes = require('./routes/ai');

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/snippets', snippetRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/ai', aiRoutes);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);
