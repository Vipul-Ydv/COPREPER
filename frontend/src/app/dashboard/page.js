'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            loadProjects();
        }
    }, [user]);

    async function loadProjects() {
        try {
            const data = await api.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredProjects = projects.filter((project) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            project.name.toLowerCase().includes(query) ||
            project.description?.toLowerCase().includes(query) ||
            project.techStack.some((tech) => tech.toLowerCase().includes(query))
        );
    });

    if (authLoading || !user) {
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
                    <Link href="/projects/new" className="btn btn-primary">
                        + Add Project
                    </Link>
                    <Link href="/settings" className={styles.navLink}>
                        Settings
                    </Link>
                    <button onClick={logout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className={styles.main}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Welcome back, {user.displayName}!</h1>
                        <p className={styles.subtitle}>
                            {projects.length === 0
                                ? 'Start adding your projects for interview prep'
                                : `You have ${projects.length} project${projects.length !== 1 ? 's' : ''} ready`}
                        </p>
                    </div>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            className="input"
                            placeholder="🔍 Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className="spinner"></div>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📁</div>
                        <h3>No projects yet</h3>
                        <p>Add your first project to start preparing for interviews</p>
                        <Link href="/projects/new" className="btn btn-primary mt-lg">
                            + Add Your First Project
                        </Link>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filteredProjects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className={styles.projectCard}
                            >
                                <h3 className={styles.projectName}>{project.name}</h3>
                                <p className={styles.projectDescription}>
                                    {project.description || 'No description'}
                                </p>
                                <div className={styles.techStack}>
                                    {project.techStack.slice(0, 4).map((tech, i) => (
                                        <span key={i} className="tag tag-primary">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.techStack.length > 4 && (
                                        <span className="tag">+{project.techStack.length - 4}</span>
                                    )}
                                </div>
                                <div className={styles.projectMeta}>
                                    <span>
                                        Updated {new Date(project.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
