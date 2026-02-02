'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password, displayName);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Left Side - Illustration */}
            <div className={styles.illustrationSide}>
                <div className={styles.decorativeShapes}>
                    <div className={`${styles.shape} ${styles.shape1}`} />
                    <div className={`${styles.shape} ${styles.shape2}`} />
                    <div className={`${styles.shape} ${styles.shape3}`} />
                </div>

                <div className={styles.illustrationContent}>
                    <div className={styles.illustrationEmoji}>🎯</div>
                    <h2 className={styles.illustrationTitle}>
                        Master Your Project Stories
                    </h2>
                    <p className={styles.illustrationText}>
                        Store, organize, and practice explaining your software projects
                        for interviews. Never forget the details that matter.
                    </p>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>📝</span>
                            <span className={styles.featureText}>Document projects with technical depth</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>🤖</span>
                            <span className={styles.featureText}>AI-powered interview practice</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>💡</span>
                            <span className={styles.featureText}>Store code snippets & explanations</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className={styles.formSide}>
                <div className={styles.formContainer}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🎯</span>
                        COPREPER
                    </div>

                    <h1 className={styles.welcomeText}>
                        {isLogin ? 'Welcome back' : 'Get started'}
                    </h1>
                    <p className={styles.subtitle}>
                        {isLogin
                            ? 'Sign in to continue to your projects'
                            : 'Create your account to start documenting'
                        }
                    </p>

                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${isLogin ? styles.active : ''}`}
                            onClick={() => setIsLogin(true)}
                            type="button"
                        >
                            Sign In
                        </button>
                        <button
                            className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
                            onClick={() => setIsLogin(false)}
                            type="button"
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {!isLogin && (
                            <div className={styles.field}>
                                <label className={styles.label}>Full Name</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="John Doe"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className={styles.field}>
                            <label className={styles.label}>Email Address</label>
                            <input
                                type="email"
                                className={styles.input}
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Password</label>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className={styles.loading}>
                                    <span className={styles.loadingSpinner} />
                                    {isLogin ? 'Signing in...' : 'Creating account...'}
                                </span>
                            ) : isLogin ? (
                                'Sign In'
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className={styles.divider}>or</div>

                    <p className={styles.switchText}>
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            className={styles.switchBtn}
                            onClick={() => setIsLogin(!isLogin)}
                            type="button"
                        >
                            {isLogin ? 'Create one' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
