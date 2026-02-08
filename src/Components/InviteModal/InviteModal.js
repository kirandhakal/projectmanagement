import React, { useState } from 'react';
import { X, Mail, Shield, Users, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { inviteService, boardService } from '../../services/api';

const InviteModal = ({ isOpen, onClose, projectId, boardId, type = 'project' }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('TeamMember');
    const [permissions, setPermissions] = useState({
        canRead: true,
        canWrite: false,
        canDrag: false,
        canManage: false
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [inviteUrl, setInviteUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (type === 'board') {
                // For direct board member addition (if user exists)
                // In a real flow, we'd search for user or invite them first
                await boardService.addMember(boardId, {
                    email, // Backend should handle finding user by email or creating invite
                    ...permissions
                });
                setSuccess(true);
            } else {
                const res = await inviteService.create({
                    email,
                    role,
                    projectId: type === 'project' ? projectId : undefined,
                });
                setInviteUrl(res.inviteUrl);
                setSuccess(true);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send invitation');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Invite {type === 'board' ? 'to Board' : 'to Project'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-purple transition-colors" size={20} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="colleague@company.com"
                                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary-purple/50 focus:ring-4 focus:ring-primary-purple/10 transition-all dark:text-white"
                                    />
                                </div>
                            </div>

                            {type === 'project' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Project Role</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Shield size={20} />
                                        </div>
                                        <select
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-10 outline-none focus:border-primary-purple/50 appearance-none cursor-pointer dark:text-white"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="TeamMember">Team Member</option>
                                            <option value="TeamLead">Team Lead</option>
                                            <option value="Manager">Manager</option>
                                            <option value="ProjectManager">Project Manager</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                            )}

                            {type === 'board' && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Workflow Permissions</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.keys(permissions).map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPermissions(prev => ({ ...prev, [p]: !prev[p] }))}
                                                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${permissions[p]
                                                        ? 'bg-primary-purple/10 border-primary-purple/30 text-primary-purple'
                                                        : 'bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-500'
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${permissions[p] ? 'bg-primary-purple border-primary-purple' : 'border-gray-300 dark:border-slate-700'
                                                    }`}>
                                                    {permissions[p] && <Check size={12} className="text-white" />}
                                                </div>
                                                {p.replace('can', '')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-purple hover:bg-primary-purple/90 disabled:bg-primary-purple/50 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-primary-purple/20 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Inviting...' : 'Send Invitation'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Invitation Sent!</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                An invitation has been sent to <span className="font-semibold text-primary-purple">{email}</span>
                            </p>
                            {inviteUrl && (
                                <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 mb-6">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Manual Link</p>
                                    <p className="text-xs text-primary-purple break-all selection:bg-primary-purple/20">{inviteUrl}</p>
                                </div>
                            )}
                            <button
                                onClick={onClose}
                                className="w-full bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-bold py-3 rounded-2xl transition-all"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default InviteModal;
