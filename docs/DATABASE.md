# Database Schema

## Entity Relationship

```
users (1) ──< projects (1) ──< code_snippets (many)
                    │
                    ├──< interview_questions (many)
                    │
                    └──< ai_interview_sessions (1) ──< session_responses (many)
```

## Tables

### users
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT (UUID) | Primary key |
| email | TEXT | Unique, login |
| password_hash | TEXT | bcrypt hash |
| display_name | TEXT | User's name |
| created_at | DATETIME | Account created |

### projects
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT (UUID) | Primary key |
| user_id | TEXT | FK → users |
| name | TEXT | Project title |
| description | TEXT | Brief summary |
| tech_stack | TEXT | JSON array |
| github_url | TEXT | Repo link |
| live_url | TEXT | Deployed URL |
| architecture | TEXT | Design notes |
| tradeoffs | TEXT | Decisions made |
| challenges | TEXT | Problems solved |
| created_at | DATETIME | Created time |
| updated_at | DATETIME | Last modified |

### code_snippets
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT (UUID) | Primary key |
| project_id | TEXT | FK → projects |
| title | TEXT | Snippet name |
| code | TEXT | The code |
| language | TEXT | Programming lang |
| explanation | TEXT | Why it matters |
| order_index | INTEGER | Display order |

### interview_questions
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT (UUID) | Primary key |
| project_id | TEXT | FK → projects |
| question | TEXT | The question |
| suggested_answer | TEXT | Model answer |
| category | TEXT | technical/architecture/etc |
| difficulty | TEXT | easy/medium/hard |
| is_ai_generated | INTEGER | 0 or 1 |

### ai_interview_sessions
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT (UUID) | Primary key |
| project_id | TEXT | FK → projects |
| started_at | DATETIME | Session start |
| ended_at | DATETIME | Session end |
| score | INTEGER | 0-100 |
| feedback | TEXT | AI summary |

### session_responses
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT (UUID) | Primary key |
| session_id | TEXT | FK → sessions |
| question_id | TEXT | FK → questions |
| user_response | TEXT | User's answer |
| ai_feedback | TEXT | AI evaluation |
| rating | INTEGER | 1-5 score |
