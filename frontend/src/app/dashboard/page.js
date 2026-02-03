'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Icons } from '@/components/Icons';
import api from '@/lib/api';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
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
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

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
                    <Link href="/dashboard" className={`${styles.navItem} ${styles.active}`}>
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
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            {user.displayName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user.displayName}</span>
                            <span className={styles.userEmail}>{user.email}</span>
                        </div>
                    </div>
                    <button onClick={logout} className={styles.logoutBtn}>
                        <Icons.Logout size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Top Bar */}
                <header className={styles.topBar}>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}><Icons.Search size={16} /></span>
                        <input
                            type="text"
                            placeholder="Search projects, technologies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <Link href="/projects/new" className="btn btn-primary">
                        <Icons.Plus size={16} /> New Project
                    </Link>
                </header>

                {/* Page Content */}
                <div className={styles.content}>
                    {/* Welcome Section */}
                    <section className={styles.welcomeSection}>
                        <div className={styles.welcomeText}>
                            <h1 className={styles.welcomeTitle}>
                                Welcome back, {user.displayName?.split(' ')[0]}!
                            </h1>
                            <p className={styles.welcomeSubtitle}>
                                Here's an overview of your interview preparation progress.
                            </p>
                        </div>
                    </section>

                    {/* Stats Row */}
                    <section className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><Icons.Folder size={22} /></div>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>{projects.length}</span>
                                <span className={styles.statLabel}>Total Projects</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><Icons.Code size={22} /></div>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>
                                    {[...new Set(projects.flatMap(p => p.techStack || []))].length}
                                </span>
                                <span className={styles.statLabel}>Technologies</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><Icons.Document size={22} /></div>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>
                                    {projects.reduce((sum, p) => sum + (p.snippets?.length || 0), 0)}
                                </span>
                                <span className={styles.statLabel}>Code Snippets</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><Icons.Target size={22} /></div>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>
                                    {projects.reduce((sum, p) => sum + (p.questions?.length || 0), 0)}
                                </span>
                                <span className={styles.statLabel}>Interview Q's</span>
                            </div>
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section className={styles.projectsSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Your Projects</h2>
                            <span className={styles.projectCount}>
                                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {loading ? (
                            <div className={styles.loadingState}>
                                <div className="spinner"></div>
                            </div>
                        ) : filteredProjects.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}><Icons.Folder size={48} /></div>
                                <h3 className={styles.emptyTitle}>No projects yet</h3>
                                <p className={styles.emptyText}>
                                    Add your first project to start preparing for technical interviews.
                                </p>
                                <Link href="/projects/new" className="btn btn-primary">
                                    <Icons.Plus size={16} /> Add Your First Project
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.projectsGrid}>
                                {filteredProjects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className={styles.projectCard}
                                    >
                                        <div className={styles.cardAccent}></div>
                                        <div className={styles.cardContent}>
                                            <h3 className={styles.projectName}>{project.name}</h3>
                                            <p className={styles.projectDescription}>
                                                {project.description || 'No description added yet'}
                                            </p>
                                            <div className={styles.techStack}>
                                                {project.techStack.slice(0, 3).map((tech, i) => (
                                                    <span key={i} className={styles.techTag}>
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.techStack.length > 3 && (
                                                    <span className={styles.techMore}>
                                                        +{project.techStack.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={styles.cardFooter}>
                                                <span className={styles.updateDate}>
                                                    Updated {new Date(project.updated_at).toLocaleDateString()}
                                                </span>
                                                <span className={styles.viewLink}>
                                                    View <Icons.ArrowRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
