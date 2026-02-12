import React, { useMemo } from 'react';
import { 
    Users, 
    TrendingUp, 
    CheckCircle2, 
    Clock, 
    User as UserIcon,
    Briefcase,
    Code,
    TestTube,
    Rocket,
    Shield
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell,
    Legend
} from 'recharts';
import { USERS, ROLES, STAGES } from '../config/workflowConfig';

const roleIcons = {
    pm: Briefcase,
    developer: Code,
    tester: TestTube,
    devops: Rocket,
    qa: Shield
};

const COLORS = ['#7b68ee', '#49ccf9', '#ff6b9d', '#00d4aa', '#ffa800'];

const TeamView = () => {
    // Get tasks from localStorage
    const tasks = useMemo(() => {
        const saved = localStorage.getItem('workflow-tasks');
        return saved ? JSON.parse(saved) : [];
    }, []);

    // Calculate overall project progress
    const projectStats = useMemo(() => {
        if (tasks.length === 0) return { total: 0, completed: 0, progress: 0 };
        const completed = tasks.filter(t => t.completed).length;
        return {
            total: tasks.length,
            completed,
            progress: Math.round((completed / tasks.length) * 100)
        };
    }, [tasks]);

    // Calculate progress by stage category
    const stageStats = useMemo(() => {
        const stats = {};
        tasks.forEach(task => {
            const stage = STAGES[task.currentStage.toUpperCase()] || {};
            const category = stage.category || 'Unknown';
            stats[category] = (stats[category] || 0) + 1;
        });
        return Object.entries(stats).map(([name, value]) => ({ name, value }));
    }, [tasks]);

    // Calculate individual progress
    const teamStats = useMemo(() => {
        return Object.values(USERS).map(user => {
            // Find tasks assigned to this user
            const assignedTasks = tasks.filter(task => {
                const userRole = user.role;
                return task.assignees && task.assignees[userRole] === user.id;
            });

            // Calculate completed tasks for this user in their role
            // Since tasks move through stages, we check if the task has passed the user's stage
            const userRole = user.role;
            const completedCount = assignedTasks.filter(task => {
                // A task is "completed" for a role if it has moved beyond its responsibility 
                // or the whole task is done.
                if (task.completed) return true;
                
                // Logic to check if task passed user's role stages
                const currentStage = STAGES[task.currentStage.toUpperCase()];
                // This is simplified: if current owner is not the user's role and it's not backlog
                return currentStage?.owner !== userRole && task.currentStage !== 'backlog';
            }).length;

            return {
                ...user,
                totalTasks: assignedTasks.length,
                completedTasks: completedCount,
                progress: assignedTasks.length > 0 ? Math.round((completedCount / assignedTasks.length) * 100) : 0
            };
        });
    }, [tasks]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="text-primary-purple" />
                    Team Performance & Project Progress
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Real-time visualization of team assignments and project milestones.
                </p>
            </header>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <TrendingUp className="text-primary-purple" size={24} />
                        </div>
                        <span className="text-2xl font-bold text-indigo-600">{projectStats.progress}%</span>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Project Completion</h3>
                    <div className="mt-4 w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                        <div 
                            className="bg-primary-purple h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${projectStats.progress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <CheckCircle2 className="text-green-600" size={24} />
                        </div>
                        <span className="text-2xl font-bold text-green-600">{projectStats.completed}</span>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tasks Completed</h3>
                    <p className="text-xs text-gray-400 mt-2">Out of {projectStats.total} total tasks</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">{projectStats.total - projectStats.completed}</span>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Tasks</h3>
                    <p className="text-xs text-gray-400 mt-2">Currently in workflow</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Visualization */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Workflow Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stageStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stageStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Team Overview */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Role-based Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teamStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" fontSize={12} tick={{ fill: '#64748B' }} />
                                <YAxis fontSize={12} tick={{ fill: '#64748B' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="progress" fill="#7b68ee" radius={[4, 4, 0, 0]} name="Progress %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Individual Team Members */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Members</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                                <th className="px-6 py-4">Member</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Current Projects Tasks</th>
                                <th className="px-6 py-4">Performance</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {teamStats.map((member) => {
                                const RoleIcon = roleIcons[member.role] || UserIcon;
                                const roleInfo = ROLES[member.role.toUpperCase()];
                                return (
                                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/70 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xl shadow-sm">
                                                    {member.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</p>
                                                    <p className="text-xs text-gray-500 uppercase tracking-tighter">ID: {member.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 px-2 py-1 rounded-md w-fit" style={{ backgroundColor: `${roleInfo?.color}20`, color: roleInfo?.color }}>
                                                <RoleIcon size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{roleInfo?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{member.totalTasks} assigned</p>
                                                <p className="text-xs text-gray-400">{member.completedTasks} completed</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-2 min-w-[100px]">
                                                    <div 
                                                        className="h-2 rounded-full transition-all duration-500" 
                                                        style={{ 
                                                            width: `${member.progress}%`,
                                                            backgroundColor: roleInfo?.color || '#7b68ee'
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{member.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${member.totalTasks > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'}`}>
                                                {member.totalTasks > 0 ? 'ACTIVE' : 'IDLE'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeamView;
