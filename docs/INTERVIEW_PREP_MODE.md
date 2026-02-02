# Interview Preparation Mode - AI Design

**Route:** `/projects/:id/prep`  
**Core Rule:** AI uses ONLY the user's own project data. No generic questions.

---

## Design Principles

1. **Realistic** - Questions mirror actual technical interviews
2. **Project-specific** - Every question derives from user's data
3. **Constructive** - Feedback helps improve, not just judge
4. **Forgiving** - Handles missing data gracefully

---

## Question Types

### 1. Overview Questions
*Tests: Can you explain your project clearly?*

| Template | Generated From |
|----------|----------------|
| "Walk me through {project_name} in 2 minutes" | project.name, project.description |
| "What problem does this solve?" | project.problem |
| "What was your role in this project?" | project.role |

**Example:**
> "Walk me through your Real-time Chat Application in 2 minutes."

---

### 2. Technical Deep-Dive Questions
*Tests: Do you understand the implementation?*

| Template | Generated From |
|----------|----------------|
| "Explain how {snippet.title} works" | code_snippets[].title, code |
| "Why did you use {tech} for this?" | tech_stack[] |
| "How does data flow from {A} to {B}?" | architecture_notes |

**Example:**
> "Explain how your WebSocket Connection Handler works. I see you're using Socket.io - walk me through the code."

---

### 3. Architecture Questions
*Tests: Can you think at a system level?*

| Template | Generated From |
|----------|----------------|
| "Draw the architecture of {project_name}" | architecture_notes |
| "How would you scale this to 10x users?" | architecture + tech_stack |
| "What happens when {component} fails?" | architecture_notes |

**Example:**
> "Your notes mention Redis pub/sub for cross-server messaging. What happens if Redis goes down?"

---

### 4. Tradeoff Questions
*Tests: Do you make reasoned decisions?*

| Template | Generated From |
|----------|----------------|
| "Why did you choose {chose} over {alternative}?" | tradeoffs[].chose, over |
| "What would you do differently now?" | tradeoffs[].hindsight |
| "What are the downsides of {technology}?" | tradeoffs[].downsides |

**Example:**
> "You chose Socket.io over raw WebSockets. What did you give up with that choice?"

---

### 5. Debugging/Challenge Questions
*Tests: Can you solve problems under pressure?*

| Template | Generated From |
|----------|----------------|
| "Tell me about the hardest bug you fixed" | challenges[].title |
| "How did you debug {challenge}?" | challenges[].solution |
| "What was the impact of solving this?" | challenges[].impact |

**Example:**
> "You mentioned message ordering was a challenge. Walk me through how you diagnosed and fixed it."

---

### 6. Improvement Questions
*Tests: Do you have a growth mindset?*

| Template | Generated From |
|----------|----------------|
| "What would you add if you had 2 more weeks?" | improvements[] |
| "How would you improve performance?" | improvements.performance |
| "What technical debt exists?" | improvements[] |

**Example:**
> "You mentioned wanting to add end-to-end encryption. How would you approach that?"

---

## Interview Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         INTERVIEW SESSION                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  STEP 1: SESSION START                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ "Let's practice for your interview about {project_name}."         │ │
│  │ "I'll ask you 5-8 questions based on your project notes."         │ │
│  │ "Answer as if you're in a real technical interview."              │ │
│  │                                                                    │ │
│  │ Difficulty: [Easy] [Medium] [Hard]    Questions: [5] [8] [10]    │ │
│  │                                                                    │ │
│  │                    [Start Interview]                               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                    │                                    │
│                                    ▼                                    │
│  STEP 2: QUESTION PRESENTED                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Question 1 of 5                                        ⏱️ 0:00     │ │
│  │                                                                    │ │
│  │ "Tell me about your Real-time Chat Application.                   │ │
│  │  What problem does it solve and how does it work?"                │ │
│  │                                                                    │ │
│  │ ┌─────────────────────────────────────────────────────────────┐   │ │
│  │ │ Type your answer here...                                    │   │ │
│  │ │                                                             │   │ │
│  │ │                                                             │   │ │
│  │ └─────────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  │ [Skip Question]                              [Submit Answer]       │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                    │                                    │
│                                    ▼                                    │
│  STEP 3: AI EVALUATION (shown after submit)                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Your Response:                                                     │ │
│  │ "It's a chat app I built with React and Node. Users can send     │ │
│  │ messages in real-time using WebSockets..."                        │ │
│  │                                                                    │ │
│  │ ──────────────────────────────────────────────────────────────    │ │
│  │                                                                    │ │
│  │ 📊 Evaluation                                     Score: 3/5      │ │
│  │                                                                    │ │
│  │ ✅ Good:                                                          │ │
│  │ • Mentioned the core technology (React, Node, WebSockets)         │ │
│  │ • Explained the real-time nature                                  │ │
│  │                                                                    │ │
│  │ ⚠️ Could Improve:                                                  │ │
│  │ • Didn't mention the PROBLEM being solved                         │ │
│  │ • Missing key differentiator (e.g., "lightweight Slack alt")     │ │
│  │ • Could add a specific metric (e.g., "handles 1000 users")        │ │
│  │                                                                    │ │
│  │ 💡 Suggested Answer (from your notes):                             │ │
│  │ "I built a lightweight Slack alternative for small teams who     │ │
│  │ needed real-time communication without bloated features..."       │ │
│  │                                                                    │ │
│  │                                      [Continue to Next Question]   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                    │                                    │
│                                    ▼                                    │
│  STEP 4: SESSION SUMMARY (after all questions)                          │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ 🎯 Session Complete!                                               │ │
│  │                                                                    │ │
│  │ Overall Score: 72/100                          Time: 12:34        │ │
│  │                                                                    │ │
│  │ ┌──────────────────────────────────────────────────────────────┐  │ │
│  │ │ ████████████████████████░░░░░░░░  72%                        │  │ │
│  │ └──────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │ Question Breakdown:                                                │ │
│  │ 1. Overview question          ⭐⭐⭐☆☆  3/5                       │ │
│  │ 2. Technical deep-dive        ⭐⭐⭐⭐☆  4/5                       │ │
│  │ 3. Architecture               ⭐⭐⭐⭐⭐  5/5                       │ │
│  │ 4. Tradeoff question          ⭐⭐⭐☆☆  3/5                       │ │
│  │ 5. Challenge question         ⭐⭐⭐⭐☆  4/5                       │ │
│  │                                                                    │ │
│  │ 📈 Strengths:                                                      │ │
│  │ • Strong architecture knowledge                                   │ │
│  │ • Good technical explanations                                     │ │
│  │                                                                    │ │
│  │ 📉 Areas to Practice:                                              │ │
│  │ • Project overview (add problem statement)                        │ │
│  │ • Tradeoff articulation (be more specific about downsides)       │ │
│  │                                                                    │ │
│  │ [Review All Answers]  [Practice Again]  [Back to Project]         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Evaluation Criteria

AI evaluates answers on 5 dimensions:

| Criteria | Weight | What AI Looks For |
|----------|--------|-------------------|
| **Completeness** | 25% | Did they cover all key points from their notes? |
| **Accuracy** | 25% | Does it match what they documented? |
| **Clarity** | 20% | Is it structured and easy to follow? |
| **Depth** | 20% | Did they go beyond surface-level? |
| **Interview-Ready** | 10% | Would this impress an interviewer? |

### Scoring Logic

```javascript
function evaluateAnswer(userAnswer, projectData, questionType) {
  const keyPoints = extractKeyPoints(projectData, questionType);
  
  return {
    completeness: checkCoverage(userAnswer, keyPoints),     // 0-5
    accuracy: checkAccuracy(userAnswer, projectData),       // 0-5
    clarity: assessClarity(userAnswer),                     // 0-5
    depth: assessDepth(userAnswer, questionType),           // 0-5
    interviewReady: assessProfessionalism(userAnswer),      // 0-5
    
    covered: identifyCoveredPoints(userAnswer, keyPoints),
    missing: identifyMissingPoints(userAnswer, keyPoints),
    suggestions: generateImprovements(userAnswer, projectData)
  };
}
```

### Rating Scale

| Score | Meaning |
|-------|---------|
| 5/5 ⭐⭐⭐⭐⭐ | Excellent - Would impress interviewers |
| 4/5 ⭐⭐⭐⭐☆ | Good - Solid answer with minor gaps |
| 3/5 ⭐⭐⭐☆☆ | Okay - Key info present but incomplete |
| 2/5 ⭐⭐☆☆☆ | Needs Work - Missing important details |
| 1/5 ⭐☆☆☆☆ | Insufficient - Major gaps or inaccuracies |

---

## Failure Handling

### Scenario 1: Missing Project Data

**Problem:** User's project has empty sections

**Handling:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Limited Data Available                                               │
│                                                                         │
│ Your project is missing some sections that would help generate         │
│ better interview questions:                                             │
│                                                                         │
│ ❌ Tradeoffs section is empty                                           │
│ ❌ Challenges section is empty                                          │
│ ✅ Architecture notes available                                         │
│ ✅ Code snippets available (3)                                          │
│                                                                         │
│ I can still run a session with Technical and Architecture questions.   │
│                                                                         │
│ [Continue Anyway]    [Add Missing Data First]                           │
└─────────────────────────────────────────────────────────────────────────┘
```

**Question Generation Rules:**
- Only generate questions for sections with data
- Show user which question types are disabled
- Suggest adding data for a fuller experience

---

### Scenario 2: Minimal Project (Only Name + Description)

**Handling:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ 📝 Basic Mode Activated                                                 │
│                                                                         │
│ Your project only has basic info. I'll ask general questions:          │
│                                                                         │
│ • "Tell me about this project"                                          │
│ • "What technologies did you use?"                                      │
│ • "What would you do differently?"                                      │
│                                                                         │
│ For deeper practice, add: architecture, code snippets, tradeoffs       │
│                                                                         │
│ [Start Basic Practice]    [Enhance Project First]                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Scenario 3: Answer Too Short

**Handling:**
```
AI detects answer < 50 characters

Response:
"Your answer seems brief for a technical interview. 
Interviewers expect 1-2 minutes of explanation for this type of question.

Would you like to:
[Expand Your Answer]  [Submit Anyway]"
```

---

### Scenario 4: Answer Doesn't Match Question

**Handling:**
```
AI detects low relevance score

Response:
"Your answer doesn't seem to address the question directly.

Question: How did you handle message ordering?
Your answer: I used React for the frontend...

Tip: For debugging/challenge questions, structure your answer as:
1. The problem
2. How you diagnosed it
3. The solution
4. The impact

[Try Again]  [Skip Question]"
```

---

## AI Prompt Templates

### Question Generation Prompt

```
You are generating interview questions for a technical interview practice session.

PROJECT DATA:
{project JSON}

RULES:
1. Generate exactly {count} questions
2. Each question MUST reference specific details from the project data
3. Mix question types: overview, technical, architecture, tradeoffs, challenges
4. Questions should be challenging but answerable from the provided data
5. Do NOT ask about topics not covered in the project data

OUTPUT FORMAT:
[
  {
    "type": "technical",
    "question": "...",
    "key_points": ["point1", "point2"],
    "suggested_answer": "...",
    "difficulty": "medium"
  }
]
```

---

### Answer Evaluation Prompt

```
You are evaluating an interview answer.

QUESTION: {question}
EXPECTED KEY POINTS: {key_points}
USER'S ANSWER: {user_answer}
PROJECT DATA: {relevant_section}

Evaluate the answer on:
1. Completeness (0-5): Did they cover the key points?
2. Accuracy (0-5): Is the information correct per their project data?
3. Clarity (0-5): Is it well-structured and easy to follow?
4. Depth (0-5): Did they go beyond surface-level?
5. Interview-Ready (0-5): Would this impress an interviewer?

OUTPUT FORMAT:
{
  "scores": { ... },
  "covered_points": [...],
  "missing_points": [...],
  "good": ["positive feedback 1", "positive feedback 2"],
  "improve": ["improvement 1", "improvement 2"],
  "suggested_answer": "..."
}

TONE: Encouraging but honest. Help them improve.
```

---

## Data Model

```javascript
// AI Interview Session
{
  id: "uuid",
  project_id: "uuid",
  started_at: "2026-01-28T15:00:00Z",
  ended_at: "2026-01-28T15:25:00Z",
  difficulty: "medium",
  question_count: 5,
  overall_score: 72,
  
  strengths: ["architecture knowledge", "technical depth"],
  improvements: ["overview clarity", "tradeoff articulation"],
  
  responses: [
    {
      question_id: "uuid",
      question_type: "overview",
      question_text: "Walk me through...",
      user_answer: "...",
      scores: { completeness: 3, accuracy: 4, ... },
      feedback: { good: [...], improve: [...] },
      time_taken_seconds: 120
    }
  ]
}
```

---

## Future Enhancements (Not MVP)

| Feature | Description |
|---------|-------------|
| Voice input | Answer verbally, transcribe with Whisper |
| Follow-up questions | AI asks clarifying questions |
| Difficulty adaptation | Gets harder/easier based on performance |
| Spaced repetition | Resurface weak areas |
| Comparative stats | "You're in the top 20% for architecture" |
