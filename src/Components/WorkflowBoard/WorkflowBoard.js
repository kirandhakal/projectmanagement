import React, { useState, useEffect } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    AlertCircle,
    PlayCircle,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    User,
    MessageSquare
} from 'lucide-react';

import { STAGES, WORKFLOW_ORDER, STAGE_CATEGORIES, getStageById, ROLES } from '../../config/workflowConfig';
import Modal from '../Modal/Modal';

/**
 * WorkflowCard Component - Displays a task card within a workflow stage
 */
function WorkflowCard({ task, stage, onAdvance, onReject, onViewDetails }) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const currentStage = getStageById(task.currentStage);
    const canAdvance = currentStage?.canPass && currentStage?.nextStage;
    const canReject = currentStage?.canReject;

    // Get current owner role
    const currentOwner = currentStage?.owner ? ROLES[currentStage.owner.toUpperCase()] : null;
    const assignedPerson = currentStage?.owner ? task.assignees?.[currentStage.owner] : null;

    // Calculate time in current stage
    const getTimeInStage = () => {
        const currentHistory = task.stageHistory?.find(
            h => h.stageId === task.currentStage && !h.exitedAt
        );
        if (!currentHistory) return '';

        const enteredAt = new Date(currentHistory.enteredAt);
        const now = new Date();
        const diffMs = now - enteredAt;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays}d`;
        if (diffHours > 0) return `${diffHours}h`;
        return `${diffMins}m`;
    };

    const handleReject = () => {
        if (!rejectReason.trim()) return;
        onReject(task.id, rejectReason);
        setShowRejectModal(false);
        setRejectReason('');
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            case 'medium': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'low': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    return (
        <>
            {showRejectModal && (
                <Modal onClose={() => setShowRejectModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 min-w-[400px] max-w-[500px]">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <XCircle className="text-red-500" size={20} />
                            Reject Task
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            This task will be sent back to <strong>{getStageById(currentStage.rejectTarget)?.name}</strong>.
                        </p>
                        <textarea
                            className="w-full p-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200 focus:border-red-500 outline-none transition-all resize-none"
                            rows={4}
                            placeholder="Please provide a reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                onClick={() => setShowRejectModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleReject}
                                disabled={!rejectReason.trim()}
                            >
                                Reject Task
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            <div
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg group ${task.rejected
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50'
                        : task.completed
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50'
                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-primary-purple'
                    }`}
                onClick={() => onViewDetails(task)}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} />
                        <span>{getTimeInStage()}</span>
                    </div>
                </div>

                {/* Title */}
                <h4 className={`font-semibold text-sm mb-2 leading-snug ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-100'
                    }`}>
                    {task.title}
                </h4>

                {/* Rejection badge */}
                {task.rejected && task.rejectionReason && (
                    <div className="flex items-start gap-2 p-2 mb-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-600 dark:text-red-400 line-clamp-2">
                            {task.rejectionReason}
                        </p>
                    </div>
                )}

                {/* Labels */}
                {task.labels?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {task.labels.slice(0, 3).map((label, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                                style={{ backgroundColor: label.color }}
                            >
                                {label.text}
                            </span>
                        ))}
                        {task.labels.length > 3 && (
                            <span className="text-[10px] text-gray-400">+{task.labels.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Current Owner */}
                {currentOwner && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: currentOwner.color }}
                        >
                            {currentOwner.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase">
                                {currentOwner.name}
                            </p>
                            {assignedPerson && (
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                    {assignedPerson}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Subtasks progress */}
                {task.tasks?.length > 0 && (
                    <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Subtasks</span>
                            <span className="font-medium">
                                {task.tasks.filter(t => t.completed).length}/{task.tasks.length}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${(task.tasks.filter(t => t.completed).length / task.tasks.length) * 100}%`,
                                    backgroundColor: task.tasks.every(t => t.completed) ? '#10b981' : '#7b68ee'
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-slate-700">
                    {canReject && (
                        <button
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowRejectModal(true);
                            }}
                        >
                            <ChevronLeft size={14} />
                            Reject
                        </button>
                    )}
                    {canAdvance && (
                        <button
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg text-xs font-semibold transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAdvance(task.id);
                            }}
                        >
                            Advance
                            <ChevronRight size={14} />
                        </button>
                    )}
                    {task.completed && (
                        <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-semibold">
                            <CheckCircle size={14} />
                            Completed
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

/**
 * WorkflowStage Component - A column in the workflow board
 */
function WorkflowStage({ stageId, tasks, onAdvance, onReject, onViewDetails }) {
    const stage = getStageById(stageId);
    const stageTasks = tasks.filter(t => t.currentStage === stageId);
    const ownerRole = stage?.owner ? ROLES[stage.owner.toUpperCase()] : null;

    return (
        <div className="min-w-[300px] w-[300px] flex flex-col rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
            {/* Stage Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="w-3 h-3 rounded-full shadow-lg"
                        style={{ backgroundColor: stage?.color }}
                    />
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white flex-1 truncate">
                        {stage?.name}
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 bg-gray-200 dark:bg-slate-700 rounded-full text-gray-600 dark:text-gray-400">
                        {stageTasks.length}
                    </span>
                </div>
                {ownerRole && (
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{ownerRole.icon}</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {ownerRole.name}
                        </span>
                    </div>
                )}
            </div>

            {/* Task Cards */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600">
                {stageTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mb-3">
                            <PlayCircle className="text-gray-400 dark:text-gray-500" size={24} />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">No tasks in this stage</p>
                    </div>
                ) : (
                    stageTasks.map(task => (
                        <WorkflowCard
                            key={task.id}
                            task={task}
                            stage={stage}
                            onAdvance={onAdvance}
                            onReject={onReject}
                            onViewDetails={onViewDetails}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

/**
 * WorkflowBoard Component - Main workflow board with all stages
 */
function WorkflowBoard({ tasks, onAdvanceTask, onRejectTask, onViewTaskDetails, viewMode = 'full' }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Filter stages based on view mode
    const getVisibleStages = () => {
        if (viewMode === 'compact') {
            // Show only main stages (one per category)
            return ['backlog', 'dev_in_progress', 'test_in_progress', 'deploying', 'qa_in_review', 'done'];
        }
        if (selectedCategory) {
            return STAGE_CATEGORIES[selectedCategory]?.stages || WORKFLOW_ORDER;
        }
        return WORKFLOW_ORDER;
    };

    const visibleStages = getVisibleStages();

    return (
        <div className="flex flex-col h-full">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
                <button
                    className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${!selectedCategory
                            ? 'bg-primary-purple text-white shadow-md'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                        }`}
                    onClick={() => setSelectedCategory(null)}
                >
                    All Stages
                </button>
                {Object.entries(STAGE_CATEGORIES).map(([key, category]) => (
                    <button
                        key={key}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === key
                                ? 'bg-primary-purple text-white shadow-md'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                            }`}
                        onClick={() => setSelectedCategory(key)}
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                        <span className="px-1.5 py-0.5 bg-white/20 dark:bg-black/20 rounded-full text-[10px]">
                            {category.stages.reduce((acc, stageId) =>
                                acc + tasks.filter(t => t.currentStage === stageId).length, 0
                            )}
                        </span>
                    </button>
                ))}
            </div>

            {/* Stages Board */}
            <div className="flex-1 flex gap-4 p-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600">
                {visibleStages.map(stageId => (
                    <WorkflowStage
                        key={stageId}
                        stageId={stageId}
                        tasks={tasks}
                        onAdvance={onAdvanceTask}
                        onReject={onRejectTask}
                        onViewDetails={onViewTaskDetails}
                    />
                ))}
            </div>
        </div>
    );
}

export default WorkflowBoard;
export { WorkflowCard, WorkflowStage };
