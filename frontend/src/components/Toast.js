'use client';

import { useEffect, useState } from 'react';
import { Icons } from './Icons';
import styles from './Toast.module.css';

const iconMap = {
    success: Icons.Check,
    error: Icons.ExternalLink, // We'll use X icon
    warning: Icons.Sparkles,
    info: Icons.Brain,
};

function ToastItem({ toast, onRemove }) {
    const [isExiting, setIsExiting] = useState(false);
    const Icon = iconMap[toast.type] || iconMap.info;

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 200);
    };

    return (
        <div
            className={`${styles.toast} ${styles[toast.type]} ${isExiting ? styles.exiting : ''}`}
            role="alert"
        >
            <div className={styles.iconWrapper}>
                <Icon size={18} />
            </div>
            <p className={styles.message}>{toast.message}</p>
            <button
                className={styles.closeBtn}
                onClick={handleRemove}
                aria-label="Dismiss notification"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div className={styles.progressBar}>
                <div
                    className={styles.progress}
                    style={{ animationDuration: `${toast.duration}ms` }}
                ></div>
            </div>
        </div>
    );
}

export default function Toast({ toasts, removeToast }) {
    if (toasts.length === 0) return null;

    return (
        <div className={styles.container}>
            {toasts.map(toast => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onRemove={removeToast}
                />
            ))}
        </div>
    );
}
