# 🎯 COPREPER

> **A personal knowledge base for CS students to store, organize, and revise their software projects before technical interviews.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-blue?logo=sqlite)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 The Problem

You build impressive projects during coursework and hackathons, but when interview season arrives:

- ❌ "What algorithm did you use for that feature 8 months ago?"
- ❌ "Why did you choose MongoDB over PostgreSQL?"
- ❌ "Walk me through the architecture..." *fumbles through half-forgotten code*

**CS students undersell their own work because they can't recall the details under pressure.**

---

## ✅ The Solution

COPREPER is a structured interview prep tool that transforms scattered project memories into organized, interview-ready material.

| Without COPREPER | With COPREPER |
|-----------------------|-------------------|
| "I think I used... some caching?" | "I implemented Redis caching with a 5-minute TTL to reduce DB load by 60%" |
| Scrambling through old repos | One-click access to annotated code snippets |
| Forgetting why you made decisions | Documented tradeoffs: "Chose X over Y because..." |

---

## ✨ Features

### Core Features
- **📁 Project Management** — Store unlimited projects with structured fields
- **💻 Code Snippets** — Syntax-highlighted code with "why this matters" explanations
- **⚖️ Tradeoff Documentation** — Record decisions in "Chose X over Y" format
- **🔍 Instant Search** — Find any project or snippet in milliseconds
- **📱 Mobile Responsive** — Review on your phone before the interview

### AI Interview Prep (Beta)
- **🤖 AI Interviewer** — Practice with questions generated from YOUR project data
- **📊 Answer Evaluation** — Get scored on completeness, accuracy, and clarity
- **🚫 No Hallucination** — AI strictly grounded in your documented project details

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js Frontend                      │
│        Pages │ Components │ Hooks │ API Client          │
└─────────────────────────────────────────────────────────┘
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Node.js + Express                       │
│     Routes │ Controllers │ Services │ Middleware        │
│                    │              │                     │
│              ┌─────┴─────┐  ┌─────┴─────┐              │
│              │  SQLite   │  │    AI     │              │
│              │  Database │  │  Adapter  │              │
│              └───────────┘  └───────────┘              │
└─────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- **Three-tier architecture** — Clean separation of concerns
- **Adapter pattern for AI** — Swap providers (OpenAI/Claude) via environment variable
- **SQLite for MVP** — Zero-config, with clear migration path to PostgreSQL
- **JWT authentication** — Stateless auth with httpOnly cookies

---

## 🤖 AI Interview System

The AI interviewer is designed to help you practice explaining YOUR projects:

### How It Works
1. **Question Generation** — AI reads your project data and generates relevant questions
2. **Grounded Responses** — AI can ONLY ask about details you've documented
3. **Structured Evaluation** — Answers scored on 5 criteria:

| Criterion | Description |
|-----------|-------------|
| Completeness | Did you cover the key points? |
| Accuracy | Does it match your project data? |
| Clarity | Is your explanation structured? |
| Depth | Did you explain "why" not just "what"? |
| Interview-Ready | Would this impress a real interviewer? |

### Question Types
- **Overview** — "Walk me through this project in 2 minutes"
- **Technical** — "Explain how your WebSocket handler works"
- **Architecture** — "What happens when Redis goes down?"
- **Tradeoffs** — "Why Socket.io over raw WebSockets?"
- **Challenges** — "What was the hardest bug you fixed?"

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, CSS Modules |
| **Backend** | Node.js 20, Express 4 |
| **Database** | SQLite 3 (FTS5 for search) |
| **Auth** | JWT, bcrypt |
| **AI** | OpenAI GPT-4 / Anthropic Claude (modular) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/project-vault.git
cd project-vault

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

```bash
# Backend (.env)
PORT=5000
JWT_SECRET=your-secret-key
AI_PROVIDER=openai  # or 'claude' or 'mock'
OPENAI_API_KEY=sk-...

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Run Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
project-vault/
├── frontend/
│   ├── pages/           # Next.js routes
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # API client, utilities
│   └── styles/          # CSS modules
│
├── backend/
│   ├── routes/          # Express routes
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Auth, validation
│   ├── models/          # Database queries
│   └── ai/              # AI provider adapters
│
└── docs/                # Architecture & design docs
```

---

## 🗺️ Roadmap

### ✅ MVP (Current)
- [x] User authentication
- [x] Project CRUD
- [x] Code snippets with explanations
- [x] Search functionality
- [x] Responsive design

### 🔄 In Progress
- [ ] AI-powered interview questions
- [ ] Answer evaluation system

### 📋 Future
- [ ] Session history & analytics
- [ ] Dark mode
- [ ] Data export (JSON/PDF)
- [ ] Keyboard shortcuts

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) first.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**
- GitHub: [@VIPUL-YDV](https://github.com/Vipul-YDV)
- LinkedIn: [VIPUL](https://www.linkedin.com/in/vipulydvv/)

---

*Built for CS students, by a CS student. Good luck with your interviews! 🚀*
