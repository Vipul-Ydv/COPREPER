'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { Icons } from '@/components/Icons';
import api from '@/lib/api';
import SnippetManager from '@/components/SnippetManager';
import styles from './project.module.css';

export default function ProjectDetailPage() {
    const { id } = useParams();
    const { user, loading: authLoading, logout } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const { success, error: showError } = useToast();
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
            showError('Failed to load project.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.deleteProject(id);
            success('Project deleted successfully!');
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
            showError('Failed to delete project. Please try again.');
        }
    }

    if (authLoading || loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className="spinner spinner-lg"></div>
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
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/dashboard" className={styles.logo}>
                        <span className={styles.logoIcon}><Icons.Logo size={24} /></span>
                        <span className={styles.logoText}>COPREPER</span>
                    </Link>
                </div>

                <nav className={styles.sidebarNav}>
                    <Link href="/dashboard" className={styles.navItem}>
                        <span className={styles.navIcon}><Icons.Dashboard size={18} /></span>
                        Dashboard
                    </Link>
                    <Link href="/projects/new" className={styles.navItem}>
                        <span className={styles.navIcon}><Icons.Plus size={18} /></span>
                        New Project
                    </Link>
                    <Link href="/settings" className={styles.navItem}>
                        <span className={styles.navIcon}><Icons.Settings size={18} /></span>
                        Settings
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={toggleTheme} className={styles.themeToggle}>
                        <span className={styles.themeIcon}>
                            {isDark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
                        </span>
                        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <button onClick={logout} className={styles.logoutBtn}>
                        <Icons.Logout size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.header}>
                    <Link href="/dashboard" className={styles.backLink}>
                        <Icons.ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <div className={styles.actions}>
                        <Link href={`/projects/${id}/prep`} className="btn btn-success">
                            <Icons.Target size={16} /> Practice Interview
                        </Link>
                        <Link href={`/projects/${id}/edit`} className="btn btn-secondary">
                            Edit
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
                                <Icons.ExternalLink size={14} /> GitHub
                            </a>
                        )}
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.externalLink}
                            >
                                <Icons.ExternalLink size={14} /> Live Demo
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
