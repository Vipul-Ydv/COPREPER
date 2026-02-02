'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from '../../new/new.module.css';

export default function EditProjectPage() {
    const { id } = useParams();
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
            const project = await api.getProject(id);
            setFormData({
                name: project.name || '',
                description: project.description || '',
                problem: project.problem || '',
                solution: project.solution || '',
                techStack: (project.techStack || []).join(', '),
                githubUrl: project.github_url || '',
                liveUrl: project.live_url || '',
                architecture: project.architecture || '',
                tradeoffs: project.tradeoffs || '',
                challenges: project.challenges || '',
                improvements: project.improvements || '',
                interviewNotes: project.interview_notes || '',
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const data = {
                ...formData,
                techStack: formData.techStack
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
            };
            await api.updateProject(id, data);
            router.push(`/projects/${id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <nav className="navbar">
                <Link href="/dashboard" className="navbar-brand">
                    🎯 Project Vault
                </Link>
                <div className="navbar-nav">
                    <button onClick={logout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className={styles.main}>
                <div className={styles.header}>
                    <Link href={`/projects/${id}`} className={styles.backLink}>
                        ← Back to Project
                    </Link>
                    <h1 className={styles.title}>Edit Project</h1>
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
                                value={formData.problem}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className="label">The Solution</label>
                            <textarea
                                name="solution"
                                className="input textarea"
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
                                value={formData.improvements}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className="label">Interview Notes</label>
                            <textarea
                                name="interviewNotes"
                                className="input textarea"
                                value={formData.interviewNotes}
                                onChange={handleChange}
                                rows={5}
                            />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <Link href={`/projects/${id}`} className="btn btn-secondary">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? <span className="spinner"></span> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
