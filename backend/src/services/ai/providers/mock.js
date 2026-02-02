// Mock AI Provider - Improved version with stricter evaluation
// Works without API keys but gives more realistic feedback

const QUESTION_TEMPLATES = {
    overview: [
        "Walk me through {projectName} in about 2 minutes. What problem does it solve?",
        "Explain the core functionality of {projectName} as if I'm a non-technical PM.",
        "Give me the 30-second elevator pitch for {projectName}."
    ],
    technical: [
        "You used {tech} in this project. Why did you choose it over alternatives like {alternative}?",
        "How does the {tech} integration work in {projectName}? Walk me through the data flow.",
        "What was your approach to handling {concern} in this project?"
    ],
    architecture: [
        "Can you draw the architecture of {projectName}? Explain each component.",
        "How does data flow from the frontend to the database in your system?",
        "What design patterns did you use and why?"
    ],
    challenge: [
        "Tell me about the toughest bug you encountered. How did you debug it?",
        "What was the most technically challenging feature to implement?",
        "Describe a situation where your initial approach failed. What did you learn?"
    ],
    tradeoffs: [
        "What tradeoffs did you make when building {projectName}? Justify them.",
        "If you had to scale this to 100x users, what would break first?",
        "What technical debt did you knowingly take on and why?"
    ],
    improvements: [
        "What would you do differently if you started {projectName} from scratch?",
        "What features would you add with another month of development time?",
        "How would you improve the performance/security/UX of {projectName}?"
    ]
};

const ALTERNATIVES = {
    'React': 'Vue or Angular',
    'Node.js': 'Python/Django or Go',
    'PostgreSQL': 'MongoDB or MySQL',
    'MongoDB': 'PostgreSQL or DynamoDB',
    'Express': 'Fastify or Koa',
    'Next.js': 'Remix or plain React',
    'TypeScript': 'JavaScript',
    'Redis': 'Memcached or in-memory caching',
    'default': 'other options'
};

const CONCERNS = ['authentication', 'error handling', 'state management', 'data validation', 'performance', 'security'];

function generateQuestions(project, count = 5) {
    const questions = [];
    const techStack = project.techStack || [];
    const categories = Object.keys(QUESTION_TEMPLATES);
    const usedCategories = new Set();

    while (questions.length < count) {
        // Ensure variety
        let category;
        do {
            category = categories[Math.floor(Math.random() * categories.length)];
        } while (usedCategories.has(category) && usedCategories.size < categories.length);
        usedCategories.add(category);

        const templates = QUESTION_TEMPLATES[category];
        const template = templates[Math.floor(Math.random() * templates.length)];

        const tech = techStack[Math.floor(Math.random() * techStack.length)] || 'your chosen technology';
        const alternative = ALTERNATIVES[tech] || ALTERNATIVES.default;
        const concern = CONCERNS[Math.floor(Math.random() * CONCERNS.length)];

        const question = template
            .replace(/{projectName}/g, project.name)
            .replace(/{tech}/g, tech)
            .replace(/{alternative}/g, alternative)
            .replace(/{concern}/g, concern);

        const difficulty = category === 'overview' ? 'easy' :
            (category === 'tradeoffs' || category === 'architecture') ? 'hard' : 'medium';

        questions.push({ question, category, difficulty });
    }

    return questions;
}

function evaluateAnswer(project, question, userAnswer) {
    const answer = userAnswer.toLowerCase();
    const words = answer.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const projectName = (project.name || '').toLowerCase();
    const techStack = (project.techStack || []).map(t => t.toLowerCase());

    // Strict evaluation criteria
    const checks = {
        hasLength: wordCount >= 50,
        hasProjectReference: answer.includes(projectName) || techStack.some(t => answer.includes(t)),
        hasExplanation: /because|therefore|since|so that|in order to|the reason/i.test(userAnswer),
        hasSpecifics: /implemented|built|designed|created|used|configured|integrated|handled/i.test(userAnswer),
        hasNumbers: /\d+/.test(userAnswer),
        hasExample: /for example|such as|like when|instance|specifically/i.test(userAnswer),
        notGeneric: !(/it is good|it works well|it helps|its useful|i learned a lot/i.test(userAnswer)),
        notRandom: wordCount > 5 && words.filter(w => w.length > 3).length > wordCount * 0.5
    };

    // Count passed checks
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    // Calculate scores based on checks
    const baseScore = Math.max(1, Math.min(5, Math.round((passedChecks / totalChecks) * 5)));

    const scores = {
        completeness: checks.hasLength ? (checks.hasExplanation ? 4 : 3) : (wordCount > 20 ? 2 : 1),
        accuracy: checks.hasProjectReference ? (checks.hasSpecifics ? 4 : 3) : 2,
        clarity: checks.hasExplanation ? (checks.hasExample ? 5 : 4) : (wordCount > 30 ? 3 : 2),
        depth: checks.hasSpecifics && checks.hasNumbers ? 4 : (checks.hasSpecifics ? 3 : 2),
        interviewReady: passedChecks >= 6 ? 4 : (passedChecks >= 4 ? 3 : 2)
    };

    // Random keywords detection
    if (wordCount < 15 || !checks.notRandom) {
        Object.keys(scores).forEach(k => scores[k] = 1);
    }

    const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5;

    // Generate specific feedback
    const missedPoints = [];
    const coveredPoints = [];

    if (!checks.hasLength) missedPoints.push('Answer too brief - aim for 50+ words');
    if (!checks.hasProjectReference) missedPoints.push('Mention your specific project or tech stack');
    if (!checks.hasExplanation) missedPoints.push('Explain WHY you made your choices');
    if (!checks.hasSpecifics) missedPoints.push('Include specific implementation details');
    if (!checks.hasExample) missedPoints.push('Give concrete examples');
    if (!checks.notGeneric) missedPoints.push('Avoid generic phrases - be specific');

    if (checks.hasExplanation) coveredPoints.push('Good use of reasoning');
    if (checks.hasSpecifics) coveredPoints.push('Mentioned implementation details');
    if (checks.hasExample) coveredPoints.push('Included examples');
    if (checks.hasNumbers) coveredPoints.push('Used concrete numbers/metrics');

    let feedback;
    if (avgScore >= 4) {
        feedback = "Strong answer! You explained your reasoning clearly and included specific details.";
    } else if (avgScore >= 3) {
        feedback = "Decent answer. Add more specific implementation details and explain your reasoning.";
    } else if (wordCount < 15) {
        feedback = "Your answer is too short. In real interviews, you need to elaborate. Aim for at least 50 words.";
    } else {
        feedback = "This answer lacks depth. Don't just list keywords - explain your thought process and give specific examples.";
    }

    const followUps = [
        "What specific metrics did you use to measure success?",
        "Can you walk me through the code for that?",
        "What would happen if that component failed?",
        "How did you test this functionality?",
        "What alternatives did you consider?"
    ];

    return {
        scores,
        overallScore: Math.round(avgScore * 10) / 10,
        feedback,
        followUp: followUps[Math.floor(Math.random() * followUps.length)],
        coveredPoints,
        missedPoints
    };
}

function generateSessionSummary(responses) {
    if (responses.length === 0) {
        return {
            questionsAnswered: 0,
            averageScores: {},
            overallScore: 0,
            strengths: [],
            areasForImprovement: ['Complete the session first'],
            recommendation: 'Answer all questions to get feedback.'
        };
    }

    const avgScores = { completeness: 0, accuracy: 0, clarity: 0, depth: 0, interviewReady: 0 };

    responses.forEach(r => {
        Object.keys(avgScores).forEach(key => {
            avgScores[key] += (r.scores?.[key] || 0) / responses.length;
        });
    });

    Object.keys(avgScores).forEach(key => {
        avgScores[key] = Math.round(avgScores[key] * 10) / 10;
    });

    const overall = Object.values(avgScores).reduce((a, b) => a + b, 0) / 5;

    const strengths = [];
    const improvements = [];

    Object.entries(avgScores).forEach(([key, val]) => {
        if (val >= 4) strengths.push(`Strong ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        else if (val < 3) improvements.push(`Improve ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    });

    let recommendation;
    if (overall >= 4) {
        recommendation = "You're well-prepared! Keep refining with more practice.";
    } else if (overall >= 3) {
        recommendation = "Good foundation. Focus on adding specific examples and explaining trade-offs.";
    } else if (overall >= 2) {
        recommendation = "Needs work. Practice explaining your project in depth - pretend you're teaching someone.";
    } else {
        recommendation = "Start by writing out detailed answers to common questions. Focus on the 'why' behind your decisions.";
    }

    return {
        questionsAnswered: responses.length,
        averageScores: avgScores,
        overallScore: Math.round(overall * 10) / 10,
        strengths: strengths.length ? strengths : ['Completed the session'],
        areasForImprovement: improvements.length ? improvements : ['Keep practicing'],
        recommendation
    };
}

module.exports = {
    generateQuestions,
    evaluateAnswer,
    generateSessionSummary
};
