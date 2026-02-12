import React, { useState } from 'react';
import {
    X,
    Plus,
    User,
    Calendar,
    Tag,
    AlertCircle,
    CheckCircle,
    Briefcase,
    Code,
    TestTube,
    Rocket,
    Shield,
    Folder
} from 'lucide-react';

import Modal from '../Modal/Modal';
import { ROLES, USERS, createTask } from '../../config/workflowConfig';

/**
 * Role icons mapping
 */
const roleIcons = {
    pm: Briefcase,
    developer: Code,
    tester: TestTube,
    devops: Rocket,
    qa: Shield
};

/**
 * CreateWorkflowTaskModal - Modal for PM to create tasks with role assignments
 */
function CreateWorkflowTaskModal({ onClose, onCreate, currentUserId = 'pm_user', currentProjectId = null, projects = [] }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [selectedProject, setSelectedProject] = useState(currentProjectId || '');
    const [assignees, setAssignees] = useState({
        pm: '',
        developer: '',
        tester: '',
        devops: '',
        qa: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const priorities = [
        { value: 'low', label: 'Low', color: 'bg-green-100 text-green-600 border-green-300' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-600 border-yellow-300' },
        { value: 'high', label: 'High', color: 'bg-red-100 text-red-600 border-red-300' }
    ];

    const getUsersByRole = (roleId) => {
        return Object.values(USERS).filter(user => user.role === roleId);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }

        // Require project selection if projects exist
        if (projects.length > 0 && !selectedProject) {
            newErrors.project = 'Please select a project';
        }

        // Check if at least developer, tester, devops, and qa are assigned
        if (!assignees.developer) {
            newErrors.developer = 'Developer is required';
        }
        if (!assignees.tester) {
            newErrors.tester = 'Tester is required';
        }
        if (!assignees.devops) {
            newErrors.devops = 'DevOps is required';
        }
        if (!assignees.qa) {
            newErrors.qa = 'QA Reviewer is required';
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
            const task = createTask(title.trim(), currentUserId, {
                pm: assignees.pm || currentUserId,
                developer: assignees.developer,
                tester: assignees.tester,
                devops: assignees.devops,
                qa: assignees.qa
            });

            // Add additional fields
            task.description = description.trim();
            task.priority = priority;
            task.date = dueDate;
            task.projectId = selectedProject || null;

            await onCreate(task);
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
            setErrors({ submit: 'Failed to create task. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateAssignee = (role, value) => {
        setAssignees(prev => ({
            ...prev,
            [role]: value
        }));
        // Clear error when user types
        if (errors[role]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[role];
                return newErrors;
            });
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-primary-purple/10 to-accent-pink/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-purple/20 rounded-lg">
                            <Plus className="text-primary-purple" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create New Task</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Assign all roles before creating</p>
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

                    {/* Project Selection */}
                    {projects.length > 0 && (
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <Folder size={16} className="text-primary-purple" />
                                Project *
                            </label>
                            <select
                                className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none transition-all ${errors.project
                                        ? 'border-red-300 dark:border-red-600 focus:border-red-500'
                                        : 'border-gray-200 dark:border-slate-700 focus:border-primary-purple'
                                    }`}
                                value={selectedProject}
                                onChange={(e) => {
                                    setSelectedProject(e.target.value);
                                    if (errors.project) setErrors(prev => ({ ...prev, project: null }));
                                }}
                            >
                                <option value="">Select a project...</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            {errors.project && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {errors.project}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <CheckCircle size={16} className="text-primary-purple" />
                            Task Title *
                        </label>
                        <input
                            type="text"
                            className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all ${errors.title
                                    ? 'border-red-300 dark:border-red-600 focus:border-red-500'
                                    : 'border-gray-200 dark:border-slate-700 focus:border-primary-purple'
                                }`}
                            placeholder="Enter a clear, descriptive title..."
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                            }}
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Tag size={16} className="text-primary-purple" />
                            Description
                        </label>
                        <textarea
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-purple focus:outline-none transition-all resize-none"
                            placeholder="Describe the task in detail..."
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Priority & Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <AlertCircle size={16} className="text-primary-purple" />
                                Priority
                            </label>
                            <div className="flex gap-2">
                                {priorities.map((p) => (
                                    <button
                                        key={p.value}
                                        type="button"
                                        className={`flex-1 px-3 py-2 border-2 rounded-lg text-xs font-semibold transition-all ${priority === p.value
                                                ? p.color + ' border-current shadow-sm'
                                                : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-500 hover:border-gray-300'
                                            }`}
                                        onClick={() => setPriority(p.value)}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <Calendar size={16} className="text-primary-purple" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-purple focus:outline-none transition-all"
                                min={new Date().toISOString().split('T')[0]}
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Role Assignments */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                                <User size={16} className="text-primary-purple" />
                                Role Assignments
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                                ⚠️ Cannot be changed after creation
                            </span>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Assign responsible team members for each role. These assignments are locked after task creation.
                        </p>

                        <div className="grid gap-3">
                            {Object.entries(ROLES).map(([key, role]) => {
                                const roleKey = role.id;
                                const RoleIcon = roleIcons[roleKey];
                                const isRequired = roleKey !== 'pm';

                                return (
                                    <div
                                        key={roleKey}
                                        className={`p-4 rounded-xl border-2 transition-all ${errors[roleKey]
                                                ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                                                : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md"
                                                style={{ backgroundColor: role.color }}
                                            >
                                                {RoleIcon && <RoleIcon size={20} />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                        {role.name}
                                                    </span>
                                                    {isRequired && (
                                                        <span className="text-xs text-red-500">*</span>
                                                    )}
                                                </div>
                                                <select
                                                    className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200 focus:border-primary-purple focus:outline-none transition-all"
                                                    value={assignees[roleKey] || ''}
                                                    onChange={(e) => updateAssignee(roleKey, e.target.value)}
                                                >
                                                    <option value="">Select {role.name}...</option>
                                                    {getUsersByRole(roleKey).map(user => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.avatar} {user.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors[roleKey] && (
                                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                        <AlertCircle size={10} />
                                                        {errors[roleKey]}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedProject ? 'Task will be created in selected project' : 'Task will be created in Backlog stage'}
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
                                'Create Task'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default CreateWorkflowTaskModal;
