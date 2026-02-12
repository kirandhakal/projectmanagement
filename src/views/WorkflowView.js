import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Moon,
    Sun,
    LayoutGrid,
    List,
    Calendar as CalendarIcon,
    // BarChart3,
    RefreshCw,
    // ChevronDown,
    // Settings,
    // Users,
    // Briefcase
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import WorkflowBoard from '../Components/WorkflowBoard/WorkflowBoard';
import CreateWorkflowTaskModal from '../Components/CreateWorkflowTaskModal/CreateWorkflowTaskModal';
import WorkflowTaskDetailsModal from '../Components/WorkflowTaskDetailsModal/WorkflowTaskDetailsModal';
import { ROLES, transitionTask, getStageById } from '../config/workflowConfig';

/**
 * WorkflowView - Main workflow management view
 */
function WorkflowView() {
    // State management
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('workflow-tasks');
        return saved ? JSON.parse(saved) : [];
    });

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [viewMode, setViewMode] = useState('board');
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });
    const [showFilters, setShowFilters] = useState(false);

    // Persist tasks to localStorage
    useEffect(() => {
        localStorage.setItem('workflow-tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Dark mode toggle
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    // Create new task
    const handleCreateTask = async (task) => {
        setTasks(prev => [...prev, task]);
    };

    // Advance task to next stage
    const handleAdvanceTask = (taskId) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                try {
                    const updated = transitionTask({ ...task }, 'advance', 'current_user');
                    return updated;
                } catch (error) {
                    console.error('Error advancing task:', error);
                    return task;
                }
            }
            return task;
        }));
    };

    // Reject task (send back)
    const handleRejectTask = (taskId, reason) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                try {
                    const updated = transitionTask({ ...task }, 'reject', 'current_user', reason);
                    return updated;
                } catch (error) {
                    console.error('Error rejecting task:', error);
                    return task;
                }
            }
            return task;
        }));
    };

    // View task details
    const handleViewTaskDetails = (task) => {
        setSelectedTask(task);
    };

    // Update task (for discussions, media, etc.)
    const handleUpdateTask = (taskId, updatedTask) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                return { ...task, ...updatedTask };
            }
            return task;
        }));
        // Update selected task if it's the one being modified
        if (selectedTask?.id === taskId) {
            setSelectedTask({ ...selectedTask, ...updatedTask });
        }
    };

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesTitle = task.title.toLowerCase().includes(query);
            const matchesDesc = task.description?.toLowerCase().includes(query);
            if (!matchesTitle && !matchesDesc) return false;
        }

        // Role filter
        if (filterRole !== 'all') {
            const currentStage = getStageById(task.currentStage);
            if (currentStage?.owner !== filterRole) return false;
        }

        // Priority filter
        if (filterPriority !== 'all') {
            if (task.priority !== filterPriority) return false;
        }

        return true;
    });

    // Statistics
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        rejected: tasks.filter(t => t.rejected && !t.completed).length,
        inProgress: tasks.filter(t => !t.completed && !t.rejected && t.currentStage !== 'backlog').length,
        backlog: tasks.filter(t => t.currentStage === 'backlog').length
    };

    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            
            {/* Header: flex-shrink-0 prevents the header from collapsing */}
            <header className="flex-shrink-0 z-10 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    {/* Left side */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-primary-purple to-accent-pink rounded-xl shadow-lg shadow-primary-purple/20">
                                <LayoutGrid className="text-white" size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Workflow Board</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Role-based task management</p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden lg:flex items-center gap-4 ml-8 pl-8 border-l border-gray-200 dark:border-slate-700">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-medium">Total</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary-purple">{stats.inProgress}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-medium">In Progress</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-medium">Done</p>
                            </div>
                            {stats.rejected > 0 && (
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-medium">Rejected</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-slate-700 border border-transparent focus:border-primary-purple/30 focus:bg-white dark:focus:bg-slate-600 rounded-lg text-sm outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <button
                            className={`p-2 rounded-lg transition-all ${showFilters
                                ? 'bg-primary-purple text-white'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                                }`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={18} />
                        </button>

                        <div className="flex items-center bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
                            <button
                                className={`p-2 rounded-md transition-all ${viewMode === 'board'
                                    ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-purple'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                onClick={() => setViewMode('board')}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                className={`p-2 rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-purple'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={16} />
                            </button>
                            <button
                                className={`p-2 rounded-md transition-all ${viewMode === 'calendar'
                                    ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-purple'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                onClick={() => setViewMode('calendar')}
                            >
                                <CalendarIcon size={16} />
                            </button>
                        </div>

                        <button
                            className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-purple transition-all"
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-purple to-accent-pink text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary-purple/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Create Task</span>
                        </button>
                    </div>
                </div>

                {/* Filters Bar */}
                {showFilters && (
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                        {/* ... (Role, Priority, and Clear buttons remain the same) */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Role:</span>
                            <select
                                className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:border-primary-purple outline-none"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                {Object.entries(ROLES).map(([key, role]) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Priority:</span>
                            <select
                                className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:border-primary-purple outline-none"
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <button
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-primary-purple transition-colors"
                            onClick={() => {
                                setFilterRole('all');
                                setFilterPriority('all');
                                setSearchQuery('');
                            }}
                        >
                            <RefreshCw size={12} />
                            Clear
                        </button>
                    </div>
                )}
            </header>

            {/* Main Content: flex-1 takes remaining space, overflow-y-auto makes cards scrollable */}
            <main className="flex-1 overflow-y-auto min-h-0 bg-gray-50 dark:bg-slate-900/50">
                {viewMode === 'calendar' ? (
                    <div className="p-6">
                        <Calendar
                            onChange={(date) => {
                                // Handle date selection, perhaps filter tasks by date
                                console.log('Selected date:', date);
                            }}
                            value={new Date()}
                            className="react-calendar-custom"
                        />
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Tasks for selected date</h3>
                            {/* Add logic to show tasks on selected date */}
                            <p className="text-gray-500">Calendar view - tasks will be shown here based on due dates.</p>
                        </div>
                    </div>
                ) : (
                    <WorkflowBoard
                        tasks={filteredTasks}
                        onAdvanceTask={handleAdvanceTask}
                        onRejectTask={handleRejectTask}
                        onViewTaskDetails={handleViewTaskDetails}
                        viewMode={viewMode}
                    />
                )}
            </main>

         
            {showCreateModal && (
                <CreateWorkflowTaskModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateTask}
                />
            )}
            {selectedTask && (
                <WorkflowTaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onAdvance={handleAdvanceTask}
                    onReject={handleRejectTask}
                    onUpdateTask={handleUpdateTask}
                />
            )}
        </div>
    );
}
    

export default WorkflowView;
