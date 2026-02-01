import React from 'react';
import {
    X,
    Calendar,
    Clock,
    User,
    Tag,
    CheckSquare,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    History,
    FileText,
    Briefcase,
    Code,
    TestTube,
    Rocket,
    Shield
} from 'lucide-react';

import Modal from '../Modal/Modal';
import { ROLES, STAGES, getStageById } from '../../config/workflowConfig';

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
 * Format date for display
 */
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

/**
 * Format datetime for display
 */
const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * WorkflowTaskDetailsModal - Modal showing full task details and history
 */
function WorkflowTaskDetailsModal({ task, onClose, onAdvance, onReject }) {
    const currentStage = getStageById(task.currentStage);
    const canAdvance = currentStage?.canPass && currentStage?.nextStage;
    const canReject = currentStage?.canReject;
    const nextStage = currentStage?.nextStage ? getStageById(currentStage.nextStage) : null;
    const rejectTarget = currentStage?.rejectTarget ? getStageById(currentStage.rejectTarget) : null;

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            case 'medium': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'low': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    // Calculate progress through workflow
    const getWorkflowProgress = () => {
        const stages = ['backlog', 'dev_pending', 'dev_in_progress', 'dev_done', 'test_pending', 'test_in_progress', 'test_passed', 'deploy_pending', 'deploying', 'deployed', 'qa_in_review', 'qa_approved', 'done'];
        const currentIndex = stages.indexOf(task.currentStage);
        return Math.round(((currentIndex + 1) / stages.length) * 100);
    };

    return (
        <Modal onClose={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${getPriorityStyles(task.priority)}`}>
                                {task.priority}
                            </span>
                            <div
                                className="px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1.5"
                                style={{ backgroundColor: currentStage?.color }}
                            >
                                {currentStage?.name}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-8">
                            {task.title}
                        </h2>
                    </div>
                    <button
                        className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>Workflow Progress</span>
                        <span className="font-semibold">{getWorkflowProgress()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-primary-purple to-accent-pink"
                            style={{ width: `${getWorkflowProgress()}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Rejection Alert */}
                    {task.rejected && task.rejectionReason && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                            <div>
                                <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Task Rejected</p>
                                <p className="text-sm text-red-600 dark:text-red-400">{task.rejectionReason}</p>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {task.description && (
                        <div className="space-y-2">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <FileText size={16} className="text-primary-purple" />
                                Description
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-6">
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-4">
                        {task.date && (
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                    <Calendar size={14} />
                                    <span className="text-xs font-medium">Due Date</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {formatDate(task.date)}
                                </p>
                            </div>
                        )}
                        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                <Clock size={14} />
                                <span className="text-xs font-medium">Created</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {formatDateTime(task.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Role Assignments */}
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <User size={16} className="text-primary-purple" />
                            Role Assignments
                            <span className="text-[10px] font-normal text-gray-400 ml-2">(Locked)</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(ROLES).map(([key, role]) => {
                                const roleKey = role.id;
                                const assignee = task.assignees?.[roleKey];
                                const RoleIcon = roleIcons[roleKey];
                                const isCurrentOwner = currentStage?.owner === roleKey;

                                return (
                                    <div
                                        key={roleKey}
                                        className={`p-3 rounded-xl border-2 transition-all ${isCurrentOwner
                                                ? 'border-primary-purple bg-primary-purple/5 dark:bg-primary-purple/10'
                                                : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm ${isCurrentOwner ? 'ring-2 ring-offset-1 ring-primary-purple' : ''
                                                    }`}
                                                style={{ backgroundColor: role.color }}
                                            >
                                                {RoleIcon && <RoleIcon size={16} />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium flex items-center gap-1">
                                                    {role.name}
                                                    {isCurrentOwner && (
                                                        <span className="text-primary-purple">• Active</span>
                                                    )}
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                    {assignee || 'Unassigned'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Labels */}
                    {task.labels?.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <Tag size={16} className="text-primary-purple" />
                                Labels
                            </h4>
                            <div className="flex flex-wrap gap-2 pl-6">
                                {task.labels.map((label, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                                        style={{ backgroundColor: label.color }}
                                    >
                                        {label.text}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Subtasks */}
                    {task.tasks?.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <CheckSquare size={16} className="text-primary-purple" />
                                    Subtasks
                                </h4>
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded-md">
                                    {task.tasks.filter(t => t.completed).length}/{task.tasks.length}
                                </span>
                            </div>
                            <div className="space-y-2 pl-6">
                                {task.tasks.map((subtask, idx) => (
                                    <div
                                        key={subtask.id || idx}
                                        className={`flex items-center gap-3 p-2 rounded-lg ${subtask.completed
                                                ? 'bg-green-50 dark:bg-green-900/20'
                                                : 'bg-gray-50 dark:bg-slate-800/50'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${subtask.completed
                                                ? 'bg-green-500 text-white'
                                                : 'border-2 border-gray-300 dark:border-slate-600'
                                            }`}>
                                            {subtask.completed && <CheckSquare size={12} />}
                                        </div>
                                        <span className={`text-sm ${subtask.completed
                                                ? 'line-through text-gray-400'
                                                : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {subtask.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stage History */}
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <History size={16} className="text-primary-purple" />
                            Stage History
                        </h4>
                        <div className="relative pl-6">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700" />
                            <div className="space-y-3">
                                {[...task.stageHistory].reverse().map((entry, idx) => {
                                    const stage = getStageById(entry.stageId);
                                    const isRejection = entry.action === 'rejected';

                                    return (
                                        <div key={idx} className="relative flex items-start gap-3 pl-4">
                                            <div
                                                className={`absolute left-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm ${isRejection ? 'bg-red-500' : ''
                                                    }`}
                                                style={{ backgroundColor: isRejection ? undefined : stage?.color }}
                                            />
                                            <div className="flex-1 min-w-0 ml-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        {stage?.name}
                                                    </span>
                                                    {isRejection && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-semibold">
                                                            Rejected
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDateTime(entry.enteredAt)}
                                                    {entry.exitedAt && ` → ${formatDateTime(entry.exitedAt)}`}
                                                </p>
                                                {entry.reason && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        Reason: {entry.reason}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {nextStage && (
                                <span>Next: <strong>{nextStage.name}</strong></span>
                            )}
                            {task.completed && (
                                <span className="text-green-600 font-semibold">✓ Task Completed</span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {canReject && rejectTarget && (
                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold transition-all"
                                    onClick={() => {
                                        const reason = window.prompt('Please provide a reason for rejection:');
                                        if (reason?.trim()) {
                                            onReject(task.id, reason.trim());
                                            onClose();
                                        }
                                    }}
                                >
                                    <ArrowLeft size={16} />
                                    Reject to {rejectTarget.name}
                                </button>
                            )}
                            {canAdvance && nextStage && (
                                <button
                                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                    onClick={() => {
                                        onAdvance(task.id);
                                        onClose();
                                    }}
                                >
                                    Advance to {nextStage.name}
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default WorkflowTaskDetailsModal;
