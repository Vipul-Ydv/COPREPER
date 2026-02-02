// OpenAI Provider - Real AI evaluation
// Requires OPENAI_API_KEY in environment

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function callOpenAI(messages, maxTokens = 1000) {
    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: maxTokens,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function generateQuestions(project, count = 5) {
    const techList = (project.techStack || []).join(', ');

    const systemPrompt = `You are a senior technical interviewer. Generate ${count} interview questions about this software project.

PROJECT DETAILS:
- Name: ${project.name}
- Description: ${project.description || 'Not provided'}
- Tech Stack: ${techList || 'Not specified'}
- Problem Solved: ${project.problem || 'Not provided'}
- Architecture: ${project.architecture || 'Not provided'}
- Challenges: ${project.challenges || 'Not provided'}

RULES:
1. Questions must be specific to THIS project, not generic
2. Mix difficulty levels (2 easy, 2 medium, 1 hard)
3. Include at least one question about architecture/design decisions
4. Include at least one question about challenges faced
5. Questions should test DEEP understanding, not just facts

Return ONLY a JSON array with this exact format:
[{"question": "...", "category": "technical|design|behavioral|challenge", "difficulty": "easy|medium|hard"}]`;

    try {
        const response = await callOpenAI([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Generate the interview questions.' }
        ]);

        // Parse JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Invalid response format');
    } catch (err) {
        console.error('OpenAI question generation failed, using mock:', err.message);
        // Use mock provider's question generation as fallback
        const mockProvider = require('./mock');
        return mockProvider.generateQuestions(project, count);
    }
}

async function evaluateAnswer(project, question, userAnswer) {
    const techList = (project.techStack || []).join(', ');

    const systemPrompt = `You are a senior technical interviewer evaluating a candidate's answer about their project.

PROJECT CONTEXT:
- Name: ${project.name}
- Description: ${project.description || 'Not provided'}
- Tech Stack: ${techList}
- Problem: ${project.problem || 'Not provided'}
- Solution: ${project.solution || 'Not provided'}
- Architecture: ${project.architecture || 'Not provided'}
- Challenges: ${project.challenges || 'Not provided'}

QUESTION ASKED: "${question}"

CANDIDATE'S ANSWER: "${userAnswer}"

EVALUATION CRITERIA (score 1-5 each):
1. Completeness: Did they fully address the question?
2. Accuracy: Is the technical content correct and consistent with project details?
3. Clarity: Is the answer well-structured and easy to follow?
4. Depth: Did they show deep understanding or just surface-level knowledge?
5. InterviewReady: Would this impress in a real interview?

IMPORTANT SCORING RULES:
- Score 1-2: Answer is vague, generic, or shows poor understanding
- Score 3: Basic answer, covers minimum requirements
- Score 4: Good answer with specific details
- Score 5: Excellent, would impress senior engineers

BE STRICT. Random keywords or generic answers should score 1-2. Reward specificity and depth.

Return ONLY valid JSON:
{
  "scores": {"completeness": N, "accuracy": N, "clarity": N, "depth": N, "interviewReady": N},
  "overallScore": N.N,
  "feedback": "Specific feedback on what was good/bad",
  "followUp": "A challenging follow-up question",
  "coveredPoints": ["list of good points made"],
  "missedPoints": ["what they should have mentioned"]
}`;

    try {
        const response = await callOpenAI([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Evaluate this answer.' }
        ], 800);

        // Parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            // Ensure all required fields exist
            return {
                scores: result.scores || { completeness: 2, accuracy: 2, clarity: 2, depth: 2, interviewReady: 2 },
                overallScore: result.overallScore || 2,
                feedback: result.feedback || 'Unable to evaluate properly.',
                followUp: result.followUp || 'Can you elaborate further?',
                coveredPoints: result.coveredPoints || [],
                missedPoints: result.missedPoints || ['More specific details needed']
            };
        }
        throw new Error('Invalid response format');
    } catch (err) {
        console.error('OpenAI evaluation failed, using smart fallback:', err.message);
        // Use mock provider's smarter evaluation as fallback
        const mockProvider = require('./mock');
        return mockProvider.evaluateAnswer(project, question, userAnswer);
    }
}

function generateSessionSummary(responses) {
    if (responses.length === 0) {
        return {
            questionsAnswered: 0,
            averageScores: {},
            overallScore: 0,
            strengths: [],
            areasForImprovement: ['No answers provided'],
            recommendation: 'Please complete the session to get feedback.'
        };
    }

    const avgScores = {
        completeness: 0,
        accuracy: 0,
        clarity: 0,
        depth: 0,
        interviewReady: 0
    };

    responses.forEach(r => {
        const scores = r.scores || {};
        Object.keys(avgScores).forEach(key => {
            avgScores[key] += (scores[key] || 0) / responses.length;
        });
    });

    Object.keys(avgScores).forEach(key => {
        avgScores[key] = Math.round(avgScores[key] * 10) / 10;
    });

    const overall = Object.values(avgScores).reduce((a, b) => a + b, 0) / 5;

    const strengths = [];
    const improvements = [];

    if (avgScores.clarity >= 4) strengths.push('Clear communication');
    if (avgScores.depth >= 4) strengths.push('Good technical depth');
    if (avgScores.accuracy >= 4) strengths.push('Technically accurate responses');

    if (avgScores.depth < 3) improvements.push('Add more technical depth to your answers');
    if (avgScores.completeness < 3) improvements.push('Make sure to fully address each question');
    if (avgScores.clarity < 3) improvements.push('Structure your answers more clearly');
    if (overall < 3) improvements.push('Use specific examples from your project');

    let recommendation;
    if (overall >= 4) {
        recommendation = "Great job! You're well-prepared for interviews on this project.";
    } else if (overall >= 3) {
        recommendation = "Good foundation, but practice adding more specific details and examples.";
    } else {
        recommendation = "You need more practice. Focus on explaining your specific implementation decisions and challenges.";
    }

    return {
        questionsAnswered: responses.length,
        averageScores: avgScores,
        overallScore: Math.round(overall * 10) / 10,
        strengths: strengths.length ? strengths : ['Keep practicing to build confidence'],
        areasForImprovement: improvements.length ? improvements : ['Continue refining your answers'],
        recommendation
    };
}

module.exports = {
    generateQuestions,
    evaluateAnswer,
    generateSessionSummary
};
