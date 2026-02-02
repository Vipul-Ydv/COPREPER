'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from './prep.module.css';

export default function InterviewPrepPage() {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [project, setProject] = useState(null);
    const [session, setSession] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [responses, setResponses] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [phase, setPhase] = useState('loading'); // loading, ready, answering, evaluated, summary

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user && id) {
            loadProjectAndStart();
        }
    }, [user, id]);

    async function loadProjectAndStart() {
        try {
            const projectData = await api.getProject(id);
            setProject(projectData);

            const sessionData = await api.startInterviewSession(id);
            setSession(sessionData);
            // Ensure questions is always an array
            const questionList = Array.isArray(sessionData.questions)
                ? sessionData.questions
                : [];
            setQuestions(questionList);
            setPhase(questionList.length > 0 ? 'ready' : 'loading');
            if (questionList.length === 0) {
                console.error('No questions returned from API');
            }
        } catch (err) {
            console.error('Failed to start session:', err);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmitAnswer() {
        if (!answer.trim() || submitting) return;
        setSubmitting(true);

        try {
            const currentQ = questions[currentIndex];
            const eval_ = await api.submitAnswer(
                session.sessionId,
                currentQ.question,
                answer
            );
            setEvaluation(eval_);
            setResponses([...responses, { question: currentQ, answer, evaluation: eval_ }]);
            setPhase('evaluated');
        } catch (err) {
            console.error('Failed to submit:', err);
        } finally {
            setSubmitting(false);
        }
    }

    function handleNextQuestion() {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setAnswer('');
            setEvaluation(null);
            setPhase('answering');
        } else {
            handleEndSession();
        }
    }

    async function handleEndSession() {
        try {
            const sum = await api.endSession(session.sessionId);
            setSummary(sum);
            setPhase('summary');
        } catch (err) {
            console.error('Failed to end session:', err);
        }
    }

    function startAnswering() {
        setPhase('answering');
    }

    if (authLoading || loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className="spinner"></div>
                <p>Preparing your interview session...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <Link href={`/projects/${id}`} className={styles.backLink}>
                    ← Back to Project
                </Link>
                <div className={styles.progress}>
                    {questions.map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.dot} ${i < currentIndex ? styles.completed : ''} ${i === currentIndex ? styles.current : ''}`}
                        />
                    ))}
                </div>
                <span className={styles.counter}>
                    {currentIndex + 1} / {questions.length}
                </span>
            </nav>

            <main className={styles.main}>
                {phase === 'ready' && (
                    <div className={styles.readyCard}>
                        <div className={styles.readyIcon}>🎯</div>
                        <h1>Interview Prep: {project?.name}</h1>
                        <p className={styles.readyText}>
                            You'll be asked {questions.length} questions about your project.
                            Answer as if you're in a real interview.
                        </p>
                        <div className={styles.tips}>
                            <h3>Quick Tips:</h3>
                            <ul>
                                <li>Be specific - use concrete examples</li>
                                <li>Explain the "why" behind your decisions</li>
                                <li>Mention trade-offs you considered</li>
                            </ul>
                        </div>
                        <button onClick={startAnswering} className="btn btn-primary">
                            Start Interview →
                        </button>
                    </div>
                )}

                {phase === 'answering' && questions[currentIndex] && (
                    <div className={styles.questionCard}>
                        <div className={styles.questionHeader}>
                            <span className={`tag ${styles[questions[currentIndex].difficulty]}`}>
                                {questions[currentIndex].difficulty}
                            </span>
                            <span className="tag">{questions[currentIndex].category}</span>
                        </div>
                        <h2 className={styles.question}>{questions[currentIndex].question}</h2>
                        <textarea
                            className={styles.answerInput}
                            placeholder="Type your answer here... (imagine you're speaking to an interviewer)"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            rows={8}
                            autoFocus
                        />
                        <div className={styles.answerActions}>
                            <span className={styles.wordCount}>
                                {answer.split(/\s+/).filter(Boolean).length} words
                            </span>
                            <button
                                onClick={handleSubmitAnswer}
                                className="btn btn-primary"
                                disabled={!answer.trim() || submitting}
                            >
                                {submitting ? <span className="spinner"></span> : 'Submit Answer'}
                            </button>
                        </div>
                    </div>
                )}

                {phase === 'evaluated' && evaluation && (
                    <div className={styles.evaluationCard}>
                        <div className={styles.scoreCircle}>
                            <span className={styles.scoreValue}>{evaluation.overallScore}</span>
                            <span className={styles.scoreLabel}>/ 5</span>
                        </div>

                        <div className={styles.scores}>
                            {Object.entries(evaluation.scores).map(([key, value]) => (
                                <div key={key} className={styles.scoreItem}>
                                    <span className={styles.scoreKey}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <div className={styles.scoreBar}>
                                        <div
                                            className={styles.scoreFill}
                                            style={{ width: `${(value / 5) * 100}%` }}
                                        />
                                    </div>
                                    <span className={styles.scoreNum}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.feedback}>
                            <h3>Feedback</h3>
                            <p>{evaluation.feedback}</p>
                        </div>

                        {evaluation.followUp && (
                            <div className={styles.followUp}>
                                <h4>💡 Possible Follow-up:</h4>
                                <p>"{evaluation.followUp}"</p>
                            </div>
                        )}

                        <div className={styles.evalActions}>
                            <button onClick={handleNextQuestion} className="btn btn-primary">
                                {currentIndex < questions.length - 1 ? 'Next Question →' : 'View Summary'}
                            </button>
                        </div>
                    </div>
                )}

                {phase === 'summary' && summary && (
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryHeader}>
                            <div className={styles.summaryScore}>
                                <span className={styles.bigScore}>{summary.overallScore}</span>
                                <span className={styles.outOf}>/ 5</span>
                            </div>
                            <h1>Session Complete!</h1>
                            <p>{summary.recommendation}</p>
                        </div>

                        <div className={styles.summaryStats}>
                            <div className={styles.stat}>
                                <span className={styles.statValue}>{summary.questionsAnswered}</span>
                                <span className={styles.statLabel}>Questions</span>
                            </div>
                            {Object.entries(summary.averageScores).slice(0, 3).map(([key, value]) => (
                                <div key={key} className={styles.stat}>
                                    <span className={styles.statValue}>{value}</span>
                                    <span className={styles.statLabel}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {summary.strengths.length > 0 && (
                            <div className={styles.summarySection}>
                                <h3>✅ Strengths</h3>
                                <ul>
                                    {summary.strengths.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {summary.areasForImprovement.length > 0 && (
                            <div className={styles.summarySection}>
                                <h3>📈 Areas to Improve</h3>
                                <ul>
                                    {summary.areasForImprovement.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className={styles.summaryActions}>
                            <Link href={`/projects/${id}`} className="btn btn-secondary">
                                Back to Project
                            </Link>
                            <button
                                onClick={() => {
                                    setPhase('loading');
                                    loadProjectAndStart();
                                }}
                                className="btn btn-primary"
                            >
                                Practice Again
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
