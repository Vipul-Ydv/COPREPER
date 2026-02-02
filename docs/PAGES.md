# Page & Navigation Design

## Navigation Bar
```
🎯 Project Vault    [Dashboard]  [+ Add Project]  [Settings]  [Logout]
```

---

## 1. Authentication (`/login`, `/signup`)

**Purpose:** Secure entry point

| Data Shown | Key Actions |
|------------|-------------|
| Login/Signup forms | Enter email & password |
| Brand tagline | Toggle login ↔ signup |
| Error messages | Submit credentials |

**After success:** Redirect to Dashboard

---

## 2. Dashboard (`/dashboard`)

**Purpose:** Central hub to view & manage all projects

*User scenario: "I have an interview tomorrow. Which projects should I revise?"*

| Data Shown | Key Actions |
|------------|-------------|
| Project cards (name, tech stack, last edited) | Click to view project |
| Search bar | Search by keyword/tech |
| Filter buttons (by technology) | Filter projects |
| "Add Project" button | Create new project |
| Empty state if no projects | Guide to add first project |

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Welcome back, John!          🔍 [Search...]     │
│ 5 projects ready                                │
├─────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │ Chat App │ │ E-comm   │ │ ML Model │         │
│ │ React,   │ │ Node,    │ │ Python,  │         │
│ │ Socket.io│ │ Postgres │ │ TensorFlow│        │
│ │ 2d ago   │ │ 1w ago   │ │ 3w ago   │         │
│ └──────────┘ └──────────┘ └──────────┘         │
└─────────────────────────────────────────────────┘
```

---

## 3. Project Detail (`/projects/:id`)

**Purpose:** Deep dive into one project for interview prep

*User scenario: "Tell me about your chat app project..."*

| Data Shown | Key Actions |
|------------|-------------|
| Project name & description | Edit project |
| Tech stack badges | Delete project |
| GitHub/Live links | Start Interview Prep |
| Architecture notes | Add code snippet |
| Tradeoffs & decisions | Add interview question |
| Challenges & solutions | |
| Code snippets (syntax highlighted) | |
| Interview questions list | |

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ← Back                    [Edit] [🎯 Prep Mode] │
├─────────────────────────────────────────────────┤
│ Real-time Chat App                              │
│ [React] [Node.js] [Socket.io] [Redis]           │
│ 🔗 GitHub  🔗 Live Demo                         │
├─────────────────────────────────────────────────┤
│ ## Architecture                                 │
│ Event-driven with WebSockets...                 │
├─────────────────────────────────────────────────┤
│ ## Tradeoffs                                    │
│ • Chose Socket.io over raw WS for fallback     │
│ • Redis over in-memory for scaling             │
├─────────────────────────────────────────────────┤
│ ## Code Snippets                    [+ Add]     │
│ ┌─ WebSocket Handler ──────────────────────┐   │
│ │ io.on('connection', (socket) => {...})   │   │
│ │ "Handles real-time message routing"      │   │
│ └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ ## Interview Questions              [+ Add]     │
│ • How did you handle message ordering?          │
│ • What happens if Redis goes down?              │
└─────────────────────────────────────────────────┘
```

---

## 4. Add/Edit Project (`/projects/new`, `/projects/:id/edit`)

**Purpose:** Create or modify project information

| Data Shown | Key Actions |
|------------|-------------|
| Form fields (see below) | Fill in each section |
| Validation errors | Save as draft |
| Autosave indicator | Publish/Update |
| Rich text for notes | Cancel |

**Form Fields:**
```
┌─────────────────────────────────────────────────┐
│ Project Name *         [Real-time Chat App    ] │
│ Description            [A Slack-like app...   ] │
│ Tech Stack             [+ React] [+ Node.js]    │
│ GitHub URL             [https://github.com/...] │
│ Live URL               [https://chat.app/     ] │
├─────────────────────────────────────────────────┤
│ Architecture Notes     [Rich text editor     ]  │
│                        [                     ]  │
├─────────────────────────────────────────────────┤
│ Tradeoffs & Decisions  [                     ]  │
├─────────────────────────────────────────────────┤
│ Challenges & Solutions [                     ]  │
├─────────────────────────────────────────────────┤
│                        [Cancel]  [Save Project] │
└─────────────────────────────────────────────────┘
```

---

## 5. Interview Prep Mode (`/projects/:id/prep`)

**Purpose:** Practice explaining the project like in an interview

*User scenario: "Walk me through this project..."*

| Data Shown | Key Actions |
|------------|-------------|
| Question prompt | Type/record answer |
| Timer (optional) | Skip question |
| Suggested answer (reveal) | Reveal answer |
| Progress indicator | Mark as confident |
| AI feedback (if enabled) | Next question |

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Interview Prep: Chat App           [End Session]│
│ Question 3 of 8                    ⏱️ 2:34      │
├─────────────────────────────────────────────────┤
│                                                 │
│   "How did you handle message ordering         │
│    across multiple server instances?"          │
│                                                 │
├─────────────────────────────────────────────────┤
│ Your Answer:                                    │
│ ┌───────────────────────────────────────────┐  │
│ │ I used Redis sorted sets with timestamps  │  │
│ │ as scores. Each message gets a unique...  │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ [Show Suggested Answer]  [Skip]  [Next →]       │
└─────────────────────────────────────────────────┘
```

---

## 6. Settings/Profile (`/settings`)

**Purpose:** Manage account and preferences

| Data Shown | Key Actions |
|------------|-------------|
| Display name | Update profile |
| Email (read-only) | Change password |
| Password change form | Toggle dark mode |
| Theme preference | Export data |
| Data export option | Delete account |

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Settings                                        │
├─────────────────────────────────────────────────┤
│ Profile                                         │
│   Display Name    [John Doe        ] [Save]     │
│   Email           john@university.edu           │
├─────────────────────────────────────────────────┤
│ Security                                        │
│   [Change Password]                             │
├─────────────────────────────────────────────────┤
│ Preferences                                     │
│   Theme           [Light ▼]                     │
│   AI Features     [✓] Enable AI suggestions    │
├─────────────────────────────────────────────────┤
│ Data                                            │
│   [Export All Projects as JSON]                 │
│   [Delete Account] ⚠️                           │
└─────────────────────────────────────────────────┘
```

---

## Route Map

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Redirect → `/login` or `/dashboard` | - |
| `/login` | Auth (Login) | No |
| `/signup` | Auth (Signup) | No |
| `/dashboard` | Dashboard | Yes |
| `/projects/new` | Add Project | Yes |
| `/projects/:id` | Project Detail | Yes |
| `/projects/:id/edit` | Edit Project | Yes |
| `/projects/:id/prep` | Interview Prep | Yes |
| `/settings` | Settings | Yes |
