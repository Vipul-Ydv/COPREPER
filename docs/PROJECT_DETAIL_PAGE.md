# Project Detail Page - Detailed Design

**Route:** `/projects/:id`  
**Purpose:** The core page for interview prep - view everything about a project in one place

---

## Page Layout Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                  │
│ ← Back to Dashboard              [Edit Project] [🎯 Interview Prep]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ PROJECT HERO                                                            │
│ ┌─────────────────────────────────────────────────────────────────────┐│
│ │ Project Name                                      Created: Jan 15   ││
│ │ [React] [Node.js] [PostgreSQL] [Redis]           Updated: Jan 28   ││
│ │                                                                     ││
│ │ 🔗 GitHub Repository    🌐 Live Demo                                ││
│ └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
├───────────────────────────┬─────────────────────────────────────────────┤
│ SIDEBAR (Sticky)          │ MAIN CONTENT (Scrollable)                   │
│                           │                                             │
│ Quick Nav:                │ [Sections listed below]                     │
│ • Overview                │                                             │
│ • Architecture            │                                             │
│ • Code Snippets           │                                             │
│ • Tradeoffs               │                                             │
│ • Challenges              │                                             │
│ • Improvements            │                                             │
│ • Interview Notes         │                                             │
│                           │                                             │
│ ─────────────────         │                                             │
│ Interview Questions (5)   │                                             │
│ [Start Practice →]        │                                             │
└───────────────────────────┴─────────────────────────────────────────────┘
```

---

## Section 1: Project Overview

**Purpose:** Quick summary to refresh memory in 30 seconds

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ## Overview                                                    [Edit ✏️]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ **The Problem**                                                         │
│ Teams needed real-time communication but existing tools were bloated    │
│ and expensive for small teams.                                          │
│                                                                         │
│ **The Solution**                                                        │
│ A lightweight Slack alternative with channels, DMs, and file sharing.   │
│ Focused on speed and simplicity.                                        │
│                                                                         │
│ **Tech Stack**                                                          │
│ ┌──────────┬──────────────────────────────────────────────────────────┐│
│ │ Frontend │ React 18, TypeScript, Zustand for state                  ││
│ │ Backend  │ Node.js, Express, Socket.io for real-time                ││
│ │ Database │ PostgreSQL (messages), Redis (pub/sub, sessions)         ││
│ │ Infra    │ Docker, AWS EC2, CloudFront CDN                          ││
│ └──────────┴──────────────────────────────────────────────────────────┘│
│                                                                         │
│ **My Role**                                                             │
│ Solo developer - designed architecture, implemented full stack          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Data Fields:**
- `problem` - What issue this solves
- `solution` - How it solves it
- `tech_stack` - Array with categories
- `role` - User's contribution

**Interactions:**
- Click "Edit" → Opens inline editor or redirects to edit page
- Hover on tech badges → Show tooltip with version/details

---

## Section 2: Architecture Explanation

**Purpose:** Explain system design decisions (common interview topic)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ## Architecture                                                [Edit ✏️]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐│
│ │                      [Architecture Diagram]                         ││
│ │   Client → Load Balancer → Server Pool → Redis Pub/Sub             ││
│ │                              ↓                                      ││
│ │                          PostgreSQL                                 ││
│ └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│ **Event-Driven Architecture**                                           │
│ Used WebSockets via Socket.io for real-time messaging. Each server     │
│ instance subscribes to Redis pub/sub channels, allowing horizontal     │
│ scaling without sticky sessions.                                        │
│                                                                         │
│ **Data Flow**                                                           │
│ 1. Client sends message via WebSocket                                   │
│ 2. Server validates and persists to PostgreSQL                          │
│ 3. Server publishes to Redis channel                                    │
│ 4. All server instances receive and broadcast to connected clients     │
│                                                                         │
│ **Key Design Decisions**                                                │
│ • Stateless servers for easy scaling                                    │
│ • Redis for both pub/sub AND session storage                           │
│ • Message ordering via timestamp-based IDs                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Data Fields:**
- `architecture_diagram` - Optional image URL
- `architecture_notes` - Rich text explanation
- `data_flow` - Step-by-step flow
- `design_decisions` - Bullet points

**Interactions:**
- Click diagram → Expand to fullscreen modal
- Code terms are auto-highlighted

---

## Section 3: Code Snippets

**Purpose:** Key code with explanations - show, don't just tell

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ## Code Snippets                                         [+ Add Snippet]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─ WebSocket Connection Handler ────────────────────────────┬─[⋮]─────┐│
│ │                                                           │ Edit    ││
│ │ ```javascript                                             │ Delete  ││
│ │ io.on('connection', (socket) => {                         └─────────┘│
│ │   // Join user's personal room for DMs                              ││
│ │   socket.join(`user:${socket.user.id}`);                            ││
│ │                                                                      ││
│ │   socket.on('message', async (data) => {                            ││
│ │     const message = await Message.create(data);                     ││
│ │     redis.publish('chat', JSON.stringify(message));                 ││
│ │   });                                                                ││
│ │ });                                                                  ││
│ │ ```                                                                  ││
│ ├──────────────────────────────────────────────────────────────────────┤│
│ │ 💡 **Why This Matters**                                              ││
│ │ Each user joins a room with their ID, enabling targeted DMs.        ││
│ │ Messages are published to Redis for cross-server delivery.          ││
│ │                                                                      ││
│ │ 🎯 **Interview Tip**                                                 ││
│ │ Be ready to explain: "What if the Redis publish fails?"             ││
│ └──────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│ ┌─ Rate Limiter Middleware ─────────────────────────────────┬─[⋮]─────┐│
│ │ [Another snippet...]                                      │         ││
│ └───────────────────────────────────────────────────────────┴─────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

**Data Fields (per snippet):**
- `title` - Descriptive name
- `code` - The actual code
- `language` - For syntax highlighting
- `explanation` - Why it matters
- `interview_tip` - Common follow-up questions
- `order_index` - Display order

**Interactions:**
- Drag to reorder snippets
- Click "Copy" → Copy code to clipboard
- Click "Expand" → Full-screen code view
- Syntax highlighting based on language
- Edit/Delete via dropdown menu

---

## Section 4: Tradeoffs & Decisions

**Purpose:** Show critical thinking - interviewers love this

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ## Tradeoffs & Decisions                                       [Edit ✏️]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─ Socket.io vs Raw WebSockets ─────────────────────────────────────┐  │
│ │ **Chose:** Socket.io                                               │  │
│ │ **Over:** Native WebSocket API                                     │  │
│ │                                                                    │  │
│ │ **Why:**                                                           │  │
│ │ • Automatic fallback to polling for older browsers                │  │
│ │ • Built-in reconnection with exponential backoff                  │  │
│ │ • Room/namespace abstraction simplifies code                       │  │
│ │                                                                    │  │
│ │ **Tradeoff:**                                                      │  │
│ │ • Larger bundle size (~40KB)                                       │  │
│ │ • Slight latency overhead from protocol layer                     │  │
│ │                                                                    │  │
│ │ **In hindsight:**                                                  │  │
│ │ Good choice for MVP. Would consider raw WS for performance-       │  │
│ │ critical features at scale.                                        │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│ ┌─ PostgreSQL vs MongoDB ───────────────────────────────────────────┐  │
│ │ [Another tradeoff...]                                              │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Data Structure:**
```json
{
  "tradeoffs": [
    {
      "title": "Socket.io vs Raw WebSockets",
      "chose": "Socket.io",
      "over": "Native WebSocket API",
      "reasons": ["fallback", "reconnection", "rooms"],
      "downsides": ["bundle size", "latency"],
      "hindsight": "Good for MVP, reconsider at scale"
    }
  ]
}
```

**Interactions:**
- Collapsible cards (expand/collapse)
- Add new tradeoff via form

---

## Section 5: Challenges & Solutions

**Purpose:** Show problem-solving ability - "hardest bug" question

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ## Challenges & Solutions                                      [Edit ✏️]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ 🔴 **Challenge: Message Ordering Across Servers**                       │
│                                                                         │
│ When running multiple server instances, messages could arrive out of   │
│ order because each server processed at different speeds.                │
│                                                                         │
│ 🟢 **Solution**                                                         │
│                                                                         │
│ Used Redis sorted sets with Unix timestamps as scores:                  │
│ ```javascript                                                           │
│ redis.zadd('channel:123', timestamp, messageId);                        │
│ ```                                                                     │
│ Clients fetch messages with ZRANGEBYSCORE, guaranteeing order.          │
│                                                                         │
│ 📊 **Impact**                                                           │
│ Reduced message ordering bugs to zero. Slight latency increase          │
│ (avg 5ms) was acceptable.                                               │
│                                                                         │
│ ─────────────────────────────────────────────────────────────────────   │
│                                                                         │
│ 🔴 **Challenge: Memory Leaks in Long-Running Connections**              │
│ [Another challenge...]                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Data Structure:**
```json
{
  "challenges": [
    {
      "title": "Message Ordering Across Servers",
      "description": "Messages arriving out of order...",
      "solution": "Redis sorted sets with timestamps",
      "code_snippet": "redis.zadd(...)",
      "impact": "Zero ordering bugs, 5ms latency"
    }
  ]
}
```

---

## Section 6: Improvement Ideas

**Purpose:** Show growth mindset - "what would you do differently?"

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ## If I Had More Time...                                       [Edit ✏️]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ 🚀 **Performance**                                                      │
│ • Implement message pagination with cursor-based pagination            │
│ • Add read receipts with batch updates instead of individual           │
│ • Use WebSocket binary protocol for file transfers                     │
│                                                                         │
│ 🏗️ **Architecture**                                                     │
│ • Migrate to microservices (separate chat, auth, file services)        │
│ • Add message queue (SQS/RabbitMQ) for async processing               │
│ • Implement CQRS for read-heavy message history                        │
│                                                                         │
│ 🧪 **Testing**                                                          │
│ • Add load testing with k6 (target: 10K concurrent users)             │
│ • Implement chaos engineering for Redis/DB failures                    │
│                                                                         │
│ 📱 **Features**                                                         │
│ • End-to-end encryption for DMs                                        │
│ • Message threading like Slack                                         │
│ • Voice/video calls with WebRTC                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Categories:** Performance, Architecture, Testing, Features, Security

---

## Section 7: Interview Notes

**Purpose:** Quick-reference notes specific to interview prep

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ## Interview Notes                                             [Edit ✏️]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ 🎯 **30-Second Pitch**                                                  │
│ "I built a real-time chat app using React and Node.js with Socket.io.  │
│ The interesting challenge was scaling to multiple servers while        │
│ maintaining message order - I solved it using Redis sorted sets."      │
│                                                                         │
│ ─────────────────────────────────────────────────────────────────────   │
│                                                                         │
│ 📋 **Key Numbers to Remember**                                          │
│ • Handles 1000 concurrent connections per server                        │
│ • Average message latency: 50ms                                         │
│ • 99.9% uptime over 3 months                                           │
│ • Reduced load by 60% with Redis caching                                │
│                                                                         │
│ ─────────────────────────────────────────────────────────────────────   │
│                                                                         │
│ ⚠️ **Likely Follow-Up Questions**                                       │
│ 1. "How would you handle 100K users?" → Horizontal scaling, sharding   │
│ 2. "What if Redis goes down?" → Fallback to in-memory + reconnect      │
│ 3. "How do you test real-time features?" → Socket.io-client mocks      │
│                                                                         │
│ ─────────────────────────────────────────────────────────────────────   │
│                                                                         │
│ 🏷️ **Keywords to Mention**                                              │
│ WebSockets, Event-driven, Pub/Sub, Horizontal scaling, Redis,          │
│ PostgreSQL, Stateless servers, Load balancing                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Responsive Behavior

| Viewport | Layout |
|----------|--------|
| **Desktop (>1024px)** | Sidebar + Main content side by side |
| **Tablet (768-1024px)** | Sidebar collapses to floating TOC button |
| **Mobile (<768px)** | Single column, sticky nav at bottom |

---

## Key Interactions Summary

| Action | Behavior |
|--------|----------|
| Click section in sidebar | Smooth scroll to section |
| Click "Edit" on section | Inline editing OR redirect to edit page |
| Click "Interview Prep" | Navigate to `/projects/:id/prep` |
| Add code snippet | Modal form with code editor |
| Copy code | Copy to clipboard, show toast |
| Drag snippet | Reorder snippets |
| Click external link | Opens in new tab |

---

## Empty States

| Section | Empty State Message |
|---------|---------------------|
| Code Snippets | "No snippets yet. Add key code examples that you'd want to explain." |
| Tradeoffs | "Document your design decisions. Interviewers love hearing 'I chose X over Y because...'" |
| Challenges | "What was the hardest problem you solved? Add it here." |
| Interview Notes | "Add your 30-second pitch and key metrics to remember." |
