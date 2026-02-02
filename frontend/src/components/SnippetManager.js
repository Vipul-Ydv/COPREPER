'use client';

import { useState } from 'react';
import api from '@/lib/api';
import styles from './SnippetManager.module.css';

export default function SnippetManager({ projectId, snippets: initialSnippets, onUpdate }) {
    const [snippets, setSnippets] = useState(initialSnippets || []);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        language: 'javascript',
        explanation: '',
        interviewTip: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const languages = [
        'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
        'go', 'rust', 'sql', 'html', 'css', 'bash', 'json', 'other'
    ];

    function resetForm() {
        setFormData({
            title: '',
            code: '',
            language: 'javascript',
            explanation: '',
            interviewTip: '',
        });
        setEditing(null);
        setShowForm(false);
        setError('');
    }

    function handleEdit(snippet) {
        setFormData({
            title: snippet.title,
            code: snippet.code,
            language: snippet.language,
            explanation: snippet.explanation || '',
            interviewTip: snippet.interview_tip || '',
        });
        setEditing(snippet.id);
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!formData.title || !formData.code) {
            setError('Title and code are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (editing) {
                const updated = await api.updateSnippet(projectId, editing, formData);
                setSnippets(snippets.map(s => s.id === editing ? updated : s));
            } else {
                const created = await api.createSnippet(projectId, formData);
                setSnippets([...snippets, created]);
            }
            resetForm();
            if (onUpdate) onUpdate();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(snippetId) {
        if (!confirm('Delete this snippet?')) return;

        try {
            await api.deleteSnippet(projectId, snippetId);
            setSnippets(snippets.filter(s => s.id !== snippetId));
            if (onUpdate) onUpdate();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Code Snippets ({snippets.length})
                </h2>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary"
                    >
                        + Add Snippet
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3 className={styles.formTitle}>
                        {editing ? 'Edit Snippet' : 'Add New Snippet'}
                    </h3>

                    {error && <div className="alert alert-error">{error}</div>}

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className="label">Title *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Authentication middleware"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.field} style={{ maxWidth: '150px' }}>
                            <label className="label">Language</label>
                            <select
                                className="input"
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            >
                                {languages.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className="label">Code *</label>
                        <textarea
                            className={`input ${styles.codeInput}`}
                            placeholder="Paste your code here..."
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            rows={10}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className="label">Explanation</label>
                        <textarea
                            className="input"
                            placeholder="Why is this code important? What does it demonstrate?"
                            value={formData.explanation}
                            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className="label">🎯 Interview Tip</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Key point to mention when discussing this code"
                            value={formData.interviewTip}
                            onChange={(e) => setFormData({ ...formData, interviewTip: e.target.value })}
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={resetForm} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="spinner"></span> : (editing ? 'Save Changes' : 'Add Snippet')}
                        </button>
                    </div>
                </form>
            )}

            {snippets.length === 0 && !showForm ? (
                <div className={styles.empty}>
                    <p>No code snippets yet. Add your best code examples!</p>
                </div>
            ) : (
                <div className={styles.snippetsList}>
                    {snippets.map((snippet) => (
                        <div key={snippet.id} className={styles.snippet}>
                            <div className="code-block">
                                <div className="code-header">
                                    <span>{snippet.title}</span>
                                    <div className={styles.snippetActions}>
                                        <span className="tag">{snippet.language}</span>
                                        <button
                                            onClick={() => handleEdit(snippet)}
                                            className={styles.editBtn}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(snippet.id)}
                                            className={styles.deleteBtn}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="code-content">
                                    <pre>{snippet.code}</pre>
                                </div>
                            </div>
                            {snippet.explanation && (
                                <p className={styles.explanation}>
                                    💡 {snippet.explanation}
                                </p>
                            )}
                            {snippet.interview_tip && (
                                <p className={styles.tip}>
                                    🎯 <strong>Interview Tip:</strong> {snippet.interview_tip}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
