import React, { useState, useMemo } from 'react';
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
    Shield,
    Filter,
    Folder,
    ChevronDown
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

const COLORS = ['#7b68ee', '#49ccf9', '#ff6b9d', '#00d4aa', '#ffa800', '#ef4444'];

// Team definitions based on roles
const TEAMS = {
    all: { id: 'all', name: 'All Teams', roles: ['pm', 'developer', 'tester', 'devops', 'qa'] },
    development: { id: 'development', name: 'Development Team', roles: ['pm', 'developer'] },
    testing: { id: 'testing', name: 'Testing Team', roles: ['tester'] },
    devops: { id: 'devops', name: 'Deployment Team', roles: ['devops'] },
    qa: { id: 'qa', name: 'QA Review Team', roles: ['qa'] }
};

const TeamView = () => {
    // Get tasks from localStorage
    const tasks = useMemo(() => {
        const saved = localStorage.getItem('workflow-tasks');
        return saved ? JSON.parse(saved) : [];
    }, []);

    // Get projects from localStorage
    const projects = useMemo(() => {
        const saved = localStorage.getItem('workflow-projects');
        return saved ? JSON.parse(saved) : [];
    }, []);

    // Filter state
    const [selectedProject, setSelectedProject] = useState('all');
    const [selectedTeam, setSelectedTeam] = useState('all');

    // Filter tasks based on selected project
    const filteredTasks = useMemo(() => {
        if (selectedProject === 'all') {
            return tasks;
        }
        return tasks.filter(task => task.projectId === selectedProject);
    }, [tasks, selectedProject]);

    // Calculate individual progress based on filtered tasks
    const teamStats = useMemo(() => {
        return Object.values(USERS).map(user => {
            // Find tasks assigned to this user in filtered tasks
            const assignedTasks = filteredTasks.filter(task => {
                const userRole = user.role;
                return task.assignees && task.assignees[userRole] === user.id;
            });

            // Calculate completed tasks for this user in their role
            const completedCount = assignedTasks.filter(task => {
                if (task.completed) return true;
                
                const currentStage = STAGES[task.currentStage.toUpperCase()];
                return currentStage?.owner !== user.role && task.currentStage !== 'backlog';
            }).length;

            return {
                ...user,
                totalTasks: assignedTasks.length,
                completedTasks: completedCount,
                progress: assignedTasks.length > 0 ? Math.round((completedCount / assignedTasks.length) * 100) : 0
            };
        });
    }, [filteredTasks]);

    // Filter team stats based on selected team
    const filteredTeamStats = useMemo(() => {
        const teamRoles = TEAMS[selectedTeam]?.roles || Object.keys(roleIcons);
        return teamStats.filter(member => teamRoles.includes(member.role));
    }, [teamStats, selectedTeam]);

    // Calculate overall project progress based on filtered tasks
    const projectStats = useMemo(() => {
        if (filteredTasks.length === 0) return { total: 0, completed: 0, progress: 0 };
        const completed = filteredTasks.filter(t => t.completed).length;
        return {
            total: filteredTasks.length,
            completed,
            progress: Math.round((completed / filteredTasks.length) * 100)
        };
    }, [filteredTasks]);

    // Calculate progress by stage category for filtered tasks
    const stageStats = useMemo(() => {
        const stats = {};
        filteredTasks.forEach(task => {
            const stage = STAGES[task.currentStage.toUpperCase()] || {};
            const category = stage.category || 'Unknown';
            stats[category] = (stats[category] || 0) + 1;
        });
        return Object.entries(stats).map(([name, value]) => ({ name, value }));
    }, [filteredTasks]);

    // Calculate project-wise stats
    const projectWiseStats = useMemo(() => {
        if (selectedProject !== 'all') {
            const project = projects.find(p => p.id === selectedProject);
            const projectTasks = filteredTasks;
            const completed = projectTasks.filter(t => t.completed).length;
            return [{
                name: project?.name || 'Unknown',
                total: projectTasks.length,
                completed,
                progress: projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0
            }];
        }
        return projects.map(project => {
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            const completed = projectTasks.filter(t => t.completed).length;
            return {
                name: project.name,
                total: projectTasks.length,
                completed,
                progress: projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0,
                color: project.color
            };
        }).filter(p => p.total > 0);
    }, [projects, tasks, selectedProject, filteredTasks]);

    // Calculate team-wise stats
    const teamWiseStats = useMemo(() => {
        return Object.entries(TEAMS).filter(([key]) => key !== 'all').map(([key, team]) => {
            const teamMembers = Object.values(USERS).filter(user => team.roles.includes(user.role));
            let totalTasks = 0;
            let completedTasks = 0;

            teamMembers.forEach(member => {
                const memberTasks = filteredTasks.filter(task => 
                    task.assignees && task.assignees[member.role] === member.id
                );
                totalTasks += memberTasks.length;
                completedTasks += memberTasks.filter(task => task.completed).length;
            });

            return {
                name: team.name,
                total: totalTasks,
                completed: completedTasks,
                progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
            };
        });
    }, [filteredTasks]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header with Filters */}
            <header className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="text-primary-purple" />
                        Team Performance & Project Progress
                    </h1>
                    
                    {/* Filters */}
                    <div className="flex items-center gap-4">
                        {/* Project Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none px-4 py-2 pr-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:border-primary-purple outline-none cursor-pointer"
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                            >
                                <option value="all">All Projects</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                ))}
                            </select>
                            <Folder className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        {/* Team Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none px-4 py-2 pr-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:border-primary-purple outline-none cursor-pointer"
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                            >
                                {Object.values(TEAMS).map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>
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
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completion Rate</h3>
                    <div className="mt-4 w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                        <div 
                            className="bg-primary-purple h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${projectStats.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{projectStats.completed} of {projectStats.total} tasks</p>
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
                {/* Project/Milestone Visualization */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                        {selectedProject === 'all' ? 'Project Milestones' : 'Stage Distribution'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {selectedProject === 'all' ? 'Progress across all projects' : 'Current stage breakdown'}
                    </p>
                    <div className="h-64">
                        {selectedProject === 'all' ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectWiseStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" fontSize={11} tick={{ fill: '#64748B' }} interval={0} />
                                    <YAxis fontSize={12} tick={{ fill: '#64748B' }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="progress" fill="#7b68ee" radius={[4, 4, 0, 0]} name="Progress %" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
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
                        )}
                    </div>
                </div>

                {/* Team Performance */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                        {selectedTeam === 'all' ? 'Team Performance' : `${TEAMS[selectedTeam]?.name} Performance`}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {selectedTeam === 'all' ? 'Progress by team/department' : 'Team progress metrics'}
                    </p>
                    <div className="h-64">
                        {selectedTeam === 'all' ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={teamWiseStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" fontSize={11} tick={{ fill: '#64748B' }} interval={0} />
                                    <YAxis fontSize={12} tick={{ fill: '#64748B' }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="progress" fill="#49ccf9" radius={[4, 4, 0, 0]} name="Progress %" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredTeamStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" fontSize={12} tick={{ fill: '#64748B' }} />
                                    <YAxis fontSize={12} tick={{ fill: '#64748B' }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="progress" fill="#00d4aa" radius={[4, 4, 0, 0]} name="Progress %" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Individual Team Members */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Members</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Filter size={14} />
                        <span>Showing {selectedTeam === 'all' ? 'all members' : TEAMS[selectedTeam]?.name}</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                                <th className="px-6 py-4">Member</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Current Tasks</th>
                                <th className="px-6 py-4">Performance</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {filteredTeamStats.map((member) => {
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
