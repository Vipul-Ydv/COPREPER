'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import styles from './TagInput.module.css';

// Tag color palette
const TAG_COLORS = [
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#84cc16', // Lime
];

export default function TagInput({ selectedTags = [], onChange, placeholder = 'Add tags...' }) {
    const [tags, setTags] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
    const [loading, setLoading] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        loadTags();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowColorPicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function loadTags() {
        try {
            const data = await api.getTags();
            setTags(data);
        } catch (err) {
            console.error('Failed to load tags:', err);
        }
    }

    async function handleCreateTag() {
        if (!newTagName.trim()) return;

        setLoading(true);
        try {
            const newTag = await api.createTag({
                name: newTagName.trim(),
                color: newTagColor
            });
            setTags([...tags, newTag]);
            // Automatically select the new tag
            onChange([...selectedTags, newTag]);
            setNewTagName('');
            setNewTagColor(TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]);
            setShowColorPicker(false);
        } catch (err) {
            console.error('Failed to create tag:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleToggleTag(tag) {
        const isSelected = selectedTags.some(t => t.id === tag.id);
        if (isSelected) {
            onChange(selectedTags.filter(t => t.id !== tag.id));
        } else {
            onChange([...selectedTags, tag]);
        }
    }

    function handleRemoveTag(tagId) {
        onChange(selectedTags.filter(t => t.id !== tagId));
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && newTagName.trim()) {
            e.preventDefault();
            handleCreateTag();
        }
    }

    const availableTags = tags.filter(
        tag => !selectedTags.some(selected => selected.id === tag.id)
    );

    const filteredTags = newTagName.trim()
        ? availableTags.filter(tag =>
            tag.name.toLowerCase().includes(newTagName.toLowerCase())
        )
        : availableTags;

    return (
        <div className={styles.container} ref={dropdownRef}>
            <div
                className={styles.inputWrapper}
                onClick={() => {
                    setIsOpen(true);
                    inputRef.current?.focus();
                }}
            >
                {/* Selected Tags */}
                {selectedTags.map(tag => (
                    <span
                        key={tag.id}
                        className={styles.selectedTag}
                        style={{ backgroundColor: tag.color + '20', borderColor: tag.color, color: tag.color }}
                    >
                        {tag.name}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTag(tag.id);
                            }}
                            className={styles.removeBtn}
                        >
                            ×
                        </button>
                    </span>
                ))}

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedTags.length === 0 ? placeholder : ''}
                    className={styles.input}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className={styles.dropdown}>
                    {/* Existing Tags */}
                    {filteredTags.length > 0 && (
                        <div className={styles.tagList}>
                            {filteredTags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleToggleTag(tag)}
                                    className={styles.tagOption}
                                >
                                    <span
                                        className={styles.tagDot}
                                        style={{ backgroundColor: tag.color }}
                                    />
                                    {tag.name}
                                    <span className={styles.tagCount}>
                                        {tag.project_count || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Create New Tag */}
                    {newTagName.trim() && !tags.some(t => t.name.toLowerCase() === newTagName.toLowerCase()) && (
                        <div className={styles.createSection}>
                            <div className={styles.createHeader}>
                                <span>Create new tag:</span>
                            </div>
                            <div className={styles.createRow}>
                                <button
                                    type="button"
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                    className={styles.colorBtn}
                                    style={{ backgroundColor: newTagColor }}
                                />
                                <span className={styles.newTagPreview}>
                                    {newTagName}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCreateTag}
                                    className={styles.addBtn}
                                    disabled={loading}
                                >
                                    {loading ? '...' : 'Add'}
                                </button>
                            </div>

                            {/* Color Picker */}
                            {showColorPicker && (
                                <div className={styles.colorPicker}>
                                    {TAG_COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => {
                                                setNewTagColor(color);
                                                setShowColorPicker(false);
                                            }}
                                            className={`${styles.colorOption} ${newTagColor === color ? styles.colorSelected : ''}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredTags.length === 0 && !newTagName.trim() && (
                        <div className={styles.emptyState}>
                            Type to search or create a tag
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
