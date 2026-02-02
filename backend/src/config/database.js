const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/vault.db');
let db = null;

async function initDatabase() {
  const SQL = await initSqlJs();

  // Load existing database or create new
  try {
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
  } catch (err) {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    -- Projects table
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
    );
  `);

  db.run(`
    -- Code snippets table
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
    );
  `);

  db.run(`
    -- Interview questions table
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
    );
  `);

  db.run(`
    -- AI interview sessions table
    CREATE TABLE IF NOT EXISTS ai_interview_sessions (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      started_at DATETIME NOT NULL,
      ended_at DATETIME,
      score INTEGER,
      feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  db.run(`
    -- Session responses table
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
    );
  `);

  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_snippets_project_id ON code_snippets(project_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_questions_project_id ON interview_questions(project_id);`);

  saveDatabase();
  console.log('✅ Database initialized');
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Wrapper functions to match better-sqlite3 API
function getDb() {
  return {
    prepare: (sql) => ({
      run: (...params) => {
        db.run(sql, params);
        saveDatabase();
        return { changes: db.getRowsModified() };
      },
      get: (...params) => {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all: (...params) => {
        const results = [];
        const stmt = db.prepare(sql);
        stmt.bind(params);
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      }
    }),
    exec: (sql) => {
      db.run(sql);
      saveDatabase();
    }
  };
}

module.exports = { initDatabase, getDb, saveDatabase };
