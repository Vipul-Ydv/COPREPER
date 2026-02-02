'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './settings.module.css';

export default function SettingsPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

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
                    🎯 COPREPER
                </Link>
                <div className="navbar-nav">
                    <Link href="/dashboard" className={styles.navLink}>
                        Dashboard
                    </Link>
                    <button onClick={logout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.title}>Settings</h1>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Profile</h2>
                    <div className={styles.profileCard}>
                        <div className={styles.avatar}>
                            {user.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className={styles.profileInfo}>
                            <h3 className={styles.displayName}>{user.displayName}</h3>
                            <p className={styles.email}>{user.email}</p>
                            <p className={styles.joinDate}>
                                Member since {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Account</h2>
                    <div className={styles.accountActions}>
                        <button onClick={logout} className="btn btn-secondary">
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>About</h2>
                    <p className={styles.aboutText}>
                        COPREPER v1.0.0
                        <br />
                        Built for CS students preparing for technical interviews.
                    </p>
                </div>
            </main>
        </div>
    );
}
