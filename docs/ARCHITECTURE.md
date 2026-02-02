# Project Knowledge Vault - Architecture

## Overview

Three-tier architecture: React frontend → Express backend → SQLite database

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js Frontend                      │
│        Pages │ Components │ Hooks │ API Client          │
└─────────────────────────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Node.js + Express                       │
│     Routes │ Controllers │ Services │ Middleware        │
│                    │              │                     │
│              ┌─────┴─────┐  ┌─────┴─────┐              │
│              │  Database │  │    AI     │              │
│              │  Service  │  │  Adapter  │              │
│              └───────────┘  └───────────┘              │
└─────────────────────────────────────────────────────────┘
                │                    │
                ▼                    ▼
         ┌──────────┐        ┌─────────────┐
         │  SQLite  │        │ AI Provider │
         └──────────┘        └─────────────┘
```

## Layer Responsibilities

### Frontend (Next.js)
- UI rendering with React components
- Client-side routing
- Form handling & validation
- API communication with JWT auth
- Responsive design

### Backend (Express)
- RESTful API endpoints
- JWT authentication & authorization
- Input validation
- Business logic
- AI service orchestration

### Database (SQLite)
- Data persistence
- Relationships: User → Projects → Snippets/Questions
- Full-text search support

### AI Service (Modular)
- Adapter pattern for swappable providers
- Interview question generation
- Provider: OpenAI, Claude, or Mock

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/projects | List user projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Get project details |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/search?q= | Search projects |
| POST | /api/ai/questions | Generate interview Qs |

## Security
- Passwords: bcrypt hashing
- Auth: JWT with httpOnly cookies
- SQL: Parameterized queries
- CORS: Whitelist frontend origin
