# Resume & Interview Talking Points

---

## Resume Bullet Points

### Bullet 1: Technical Achievement
> **Built a full-stack project knowledge vault** using Next.js, Node.js, and SQLite, enabling students to store project details, code snippets, and interview prep notes with full-text search across 1000+ entries in <100ms

### Bullet 2: AI Integration
> **Designed an AI-powered interview simulation system** using modular adapter pattern for LLM integration, generating project-specific technical questions with structured evaluation rubrics scoring completeness, accuracy, and clarity

### Bullet 3: User Impact
> **Developed interview preparation tool** that structures project documentation into problem-solution-tradeoffs format, reducing project recall time by organizing architecture notes, code snippets with explanations, and common Q&A patterns

---

## Elevator Pitch (30 seconds)

> "I built Project Vault, a personal knowledge base for CS students to store and revise their software projects before interviews. The problem is simple—you build great projects but forget the details when someone asks 'walk me through your architecture.' My app lets you save code snippets with explanations, document your tradeoffs, and even practice with an AI interviewer that asks questions based only on YOUR project data. It's built with Next.js and Node.js, and the AI uses a modular adapter pattern so I can swap between providers without touching business logic."

---

## Technical Interview Talking Points

### 1. Architecture Decision: Three-Tier with Adapter Pattern

**Question:** "Walk me through the architecture."

> "It's a classic three-tier architecture—React frontend, Express API, SQLite database—but the interesting part is how I handled AI integration. I used the adapter pattern to abstract the LLM provider. The business logic calls a generic `AIProvider` interface, and I can swap OpenAI for Claude or a mock provider via environment variable. This made testing easy and avoided vendor lock-in. The tradeoff was slight overhead from the abstraction layer, but the flexibility was worth it for a project that might need to change providers."

---

### 2. Database Design: Balancing Normalization and Simplicity

**Question:** "How did you design the database?"

> "I chose SQLite for the MVP because it's zero-configuration and file-based—perfect for single-user development. The schema has six tables with clear relationships: Users have Projects, Projects have Snippets and Questions. I stored `tech_stack` as JSON in a TEXT field rather than creating a separate tags table—denormalized but simpler for the MVP. For search, I used SQLite's FTS5 full-text search on project names and descriptions. The migration path to PostgreSQL is straightforward—just change the JSON field to JSONB and add proper full-text indexes."

---

### 3. AI System: Grounding to Prevent Hallucination

**Question:** "How does the AI interview feature work?"

> "The key constraint was that the AI must ONLY ask about the user's actual project data—no hallucinated questions about features they didn't build. I achieved this by structuring the prompt with explicit rules: the PROJECT_CONTEXT is injected, and the system prompt states 'you can ONLY reference information in PROJECT_CONTEXT.' For evaluation, I built a rubric scoring Completeness, Accuracy, Clarity, Depth, and Interview-Readiness on a 1-5 scale. The AI compares the user's answer against their own documented notes and identifies covered vs. missing points. If a section like 'tradeoffs' is empty, the system skips those question types entirely rather than making things up."

---

## Quick Stats to Mention

- **Tech Stack:** Next.js, Node.js, Express, SQLite, JWT auth
- **Database:** 6 tables, normalized with JSON flexibility
- **AI:** Modular adapter pattern, 5 prompt templates
- **Security:** bcrypt password hashing, JWT with httpOnly cookies
- **Testing:** Unit tests for API, integration tests for auth flow
