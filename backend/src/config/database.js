const { createClient } = require('@libsql/client');

// Turso database client
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDatabase() {
  // Create tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      problem TEXT,
      solution TEXT,
      tech_stack TEXT DEFAULT '[]',
      github_url TEXT,
      live_url TEXT,
      architecture TEXT,
      tradeoffs TEXT,
      challenges TEXT,
      improvements TEXT,
      interview_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS code_snippets (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      title TEXT NOT NULL,
      code TEXT NOT NULL,
      language TEXT NOT NULL,
      explanation TEXT,
      interview_tip TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS interview_questions (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      question TEXT NOT NULL,
      suggested_answer TEXT,
      category TEXT,
      difficulty TEXT,
      is_ai_generated INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS ai_interview_sessions (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      started_at DATETIME NOT NULL,
      ended_at DATETIME,
      score INTEGER,
      feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS session_responses (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      user_response TEXT,
      ai_feedback TEXT,
      scores TEXT,
      rating INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES ai_interview_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_snippets_project_id ON code_snippets(project_id)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_questions_project_id ON interview_questions(project_id)`);

  console.log('✅ Turso database initialized');
}

// Wrapper functions to match the existing API pattern
function getDb() {
  return {
    prepare: (sql) => ({
      run: async (...params) => {
        const result = await db.execute({ sql, args: params });
        return { changes: result.rowsAffected };
      },
      get: async (...params) => {
        const result = await db.execute({ sql, args: params });
        return result.rows[0] || undefined;
      },
      all: async (...params) => {
        const result = await db.execute({ sql, args: params });
        return result.rows;
      }
    }),
    exec: async (sql) => {
      await db.execute(sql);
    }
  };
}

// No-op for compatibility (Turso auto-persists)
function saveDatabase() { }

module.exports = { initDatabase, getDb, saveDatabase };
