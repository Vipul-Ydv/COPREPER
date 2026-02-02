'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from './new.module.css';

export default function NewProjectPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        problem: '',
        solution: '',
        techStack: '',
        githubUrl: '',
        liveUrl: '',
        architecture: '',
        tradeoffs: '',
        challenges: '',
        improvements: '',
        interviewNotes: '',
    });

    if (authLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                ...formData,
                techStack: formData.techStack
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
            };
            const project = await api.createProject(data);
            router.push(`/projects/${project.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <nav className="navbar">
                <Link href="/dashboard" className="navbar-brand">
                    🎯 COPREPER
                </Link>
                <div className="navbar-nav">
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
                    <h1 className={styles.title}>Add New Project</h1>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Basic Info</h2>

                        <div className={styles.field}>
                            <label className="label">Project Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="input"
                                placeholder="Real-time Chat Application"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label className="label">Description</label>
                            <textarea
                                name="description"
                                className="input textarea"
                                placeholder="A brief description of what this project does..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className="label">Tech Stack (comma-separated)</label>
                            <input
                                type="text"
                                name="techStack"
                                className="input"
                                placeholder="React, Node.js, PostgreSQL, Redis"
                                value={formData.techStack}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className="label">GitHub URL</label>
                                <input
                                    type="url"
                                    name="githubUrl"
                                    className="input"
                                    placeholder="https://github.com/..."
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className="label">Live URL</label>
                                <input
                                    type="url"
                                    name="liveUrl"
                                    className="input"
                                    placeholder="https://myapp.vercel.app"
                                    value={formData.liveUrl}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Problem & Solution</h2>

                        <div className={styles.field}>
                            <label className="label">The Problem</label>
                            <textarea
                                name="problem"
                                className="input textarea"
                                placeholder="What issue does this project solve?"
                                value={formData.problem}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className="label">The Solution</label>
                            <textarea
                                name="solution"
                                className="input textarea"
                                placeholder="How does your project solve it?"
                                value={formData.solution}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Technical Details</h2>

                        <div className={styles.field}>
                            <label className="label">Architecture</label>
                            <textarea
                                name="architecture"
                                className="input textarea"
                                placeholder="Describe the system architecture, data flow, key components..."
                                value={formData.architecture}
                                onChange={handleChange}
                                rows={5}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className="label">Tradeoffs & Decisions</label>
                            <textarea
                                name="tradeoffs"
                                className="input textarea"
                                placeholder="What choices did you make? e.g., 'Chose Socket.io over raw WebSockets for...'"
                                value={formData.tradeoffs}
                                onChange={handleChange}
                                rows={5}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className="label">Challenges & Solutions</label>
                            <textarea
                                name="challenges"
                                className="input textarea"
                                placeholder="What was the hardest problem you solved? How did you fix it?"
                                value={formData.challenges}
                                onChange={handleChange}
                                rows={5}
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Interview Prep</h2>

                        <div className={styles.field}>
                            <label className="label">If I Had More Time...</label>
                            <textarea
                                name="improvements"
                                className="input textarea"
                                placeholder="What would you improve or add? Performance, features, testing..."
                                value={formData.improvements}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className="label">Interview Notes</label>
                            <textarea
                                name="interviewNotes"
                                className="input textarea"
                                placeholder="30-second pitch, key numbers, likely follow-up questions..."
                                value={formData.interviewNotes}
                                onChange={handleChange}
                                rows={5}
                            />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <Link href="/dashboard" className="btn btn-secondary">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="spinner"></span> : 'Create Project'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
