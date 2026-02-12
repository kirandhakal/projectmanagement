import React, { useState } from 'react';
import {
    X,
    Folder,
    Palette,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

import Modal from '../Modal/Modal';

/**
 * CreateProjectModal - Modal for creating projects within workflow
 */
function CreateProjectModal({ onClose, onCreate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('#7b68ee');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const colors = [
        "#7b68ee", "#ff6b9d", "#49ccf9", "#00d4aa", "#ffa800", "#ff6b6b",
        "#9b59b6", "#3498db", "#e74c3c", "#f39c12", "#1abc9c", "#34495e"
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Project name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const project = {
                id: Date.now() + Math.random() * 2,
                name: name.trim(),
                description: description.trim(),
                color: selectedColor,
                tasks: [],
                createdAt: new Date().toISOString()
            };

            await onCreate(project);
            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
            setErrors({ submit: 'Failed to create project. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-primary-purple/10 to-accent-pink/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-purple/20 rounded-lg">
                            <Folder className="text-primary-purple" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create New Project</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Organize your workflow tasks</p>
                        </div>
                    </div>
                    <button
                        className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Error Alert */}
                    {errors.submit && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <AlertCircle className="text-red-500" size={20} />
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                        </div>
                    )}

                    {/* Project Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Folder size={16} className="text-primary-purple" />
                            Project Name *
                        </label>
                        <input
                            type="text"
                            className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all ${errors.name
                                    ? 'border-red-300 dark:border-red-600 focus:border-red-500'
                                    : 'border-gray-200 dark:border-slate-700 focus:border-primary-purple'
                                }`}
                            placeholder="Enter project name..."
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                            }}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Palette size={16} className="text-primary-purple" />
                            Description
                        </label>
                        <textarea
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-purple focus:outline-none transition-all resize-none"
                            placeholder="Describe your project..."
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Palette size={16} className="text-primary-purple" />
                            Project Color
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`w-10 h-10 rounded-xl transition-all ${selectedColor === color
                                            ? 'ring-4 ring-offset-2 ring-primary-purple dark:ring-offset-slate-800 scale-110'
                                            : 'hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                >
                                    {selectedColor === color && (
                                        <CheckCircle className="w-5 h-5 text-white mx-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <CheckCircle size={16} className="text-primary-purple" />
                            Preview
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                    style={{ backgroundColor: selectedColor }}
                                >
                                    <Folder size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {name || 'Project Name'}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {description || 'No description'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Project will be created in your workflow
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-primary-purple to-accent-pink text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary-purple/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </span>
                            ) : (
                                'Create Project'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default CreateProjectModal;
