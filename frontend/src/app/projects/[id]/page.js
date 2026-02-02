'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import SnippetManager from '@/components/SnippetManager';
import styles from './project.module.css';

export default function ProjectDetailPage() {
    const { id } = useParams();
    const { user, loading: authLoading, logout } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user && id) {
            loadProject();
        }
    }, [user, id]);

    async function loadProject() {
        try {
            const data = await api.getProject(id);
            setProject(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.deleteProject(id);
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    }

    if (authLoading || loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className={styles.errorContainer}>
                <h2>Project not found</h2>
                <Link href="/dashboard" className="btn btn-primary">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const techStack = project.techStack || [];

    return (
        <div className={styles.page}>
            <nav className="navbar">
                <Link href="/dashboard" className="navbar-brand">
                    🎯 Project Vault
                </Link>
                <div className="navbar-nav">
                    <Link href="/projects/new" className="btn btn-primary">
                        + Add Project
                    </Link>
                    <button onClick={logout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className={styles.main}>
                <div className={styles.header}>
                    <Link href="/dashboard" className={styles.backLink}>
                        ← Back to Dashboard
                    </Link>
                    <div className={styles.actions}>
                        <Link href={`/projects/${id}/prep`} className="btn btn-success">
                            🎯 Practice Interview
                        </Link>
                        <Link href={`/projects/${id}/edit`} className="btn btn-secondary">
                            Edit Project
                        </Link>
                        <button onClick={handleDelete} className="btn btn-danger">
                            Delete
                        </button>
                    </div>
                </div>

                <div className={styles.hero}>
                    <h1 className={styles.title}>{project.name}</h1>
                    <div className={styles.techStack}>
                        {techStack.map((tech, i) => (
                            <span key={i} className="tag tag-primary">
                                {tech}
                            </span>
                        ))}
                    </div>
                    <div className={styles.links}>
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.externalLink}
                            >
                                🔗 GitHub
                            </a>
                        )}
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.externalLink}
                            >
                                🌐 Live Demo
                            </a>
                        )}
                    </div>
                </div>

                <div className={styles.content}>
                    {project.description && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Overview</h2>
                            <p className={styles.text}>{project.description}</p>
                        </section>
                    )}

                    {project.problem && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>The Problem</h2>
                            <p className={styles.text}>{project.problem}</p>
                        </section>
                    )}

                    {project.solution && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>The Solution</h2>
                            <p className={styles.text}>{project.solution}</p>
                        </section>
                    )}

                    {project.architecture && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Architecture</h2>
                            <p className={styles.text}>{project.architecture}</p>
                        </section>
                    )}

                    {project.tradeoffs && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Tradeoffs & Decisions</h2>
                            <p className={styles.text}>{project.tradeoffs}</p>
                        </section>
                    )}

                    {project.challenges && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Challenges & Solutions</h2>
                            <p className={styles.text}>{project.challenges}</p>
                        </section>
                    )}

                    {project.improvements && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>If I Had More Time...</h2>
                            <p className={styles.text}>{project.improvements}</p>
                        </section>
                    )}

                    {project.interview_notes && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Interview Notes</h2>
                            <p className={styles.text}>{project.interview_notes}</p>
                        </section>
                    )}

                    <section className={styles.section}>
                        <SnippetManager
                            projectId={id}
                            snippets={project.snippets || []}
                            onUpdate={loadProject}
                        />
                    </section>

                    {project.questions && project.questions.length > 0 && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Interview Questions ({project.questions.length})
                            </h2>
                            <div className={styles.questionsList}>
                                {project.questions.map((q) => (
                                    <div key={q.id} className={styles.question}>
                                        <div className={styles.questionHeader}>
                                            <span className="tag">{q.category}</span>
                                            <span className={`tag ${styles[q.difficulty]}`}>
                                                {q.difficulty}
                                            </span>
                                        </div>
                                        <p className={styles.questionText}>{q.question}</p>
                                        {q.suggested_answer && (
                                            <details className={styles.answerDetails}>
                                                <summary>View Suggested Answer</summary>
                                                <p>{q.suggested_answer}</p>
                                            </details>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
