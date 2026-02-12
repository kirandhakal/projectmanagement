import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Image,
    Paperclip,
    X,
    MoreVertical,
    Reply,
    Trash2,
    Download,
    File,
    MessageCircle,
    Users,
    Briefcase,
    Code,
    TestTube,
    Rocket,
    Shield
} from 'lucide-react';

import { ROLES, USERS } from '../../config/workflowConfig';

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
 * Format time for chat messages
 */
const formatMessageTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Message Bubble Component
 */
function MessageBubble({ message, isOwn, onDelete, onReply }) {
    const [showMenu, setShowMenu] = useState(false);
    const role = ROLES[message.role?.toUpperCase()];
    const RoleIcon = roleIcons[message.role];

    return (
        <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''} group`}>
            {/* Avatar */}
            <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: role?.color || '#7b68ee' }}
            >
                {RoleIcon && <RoleIcon size={14} />}
            </div>

            {/* Message Content */}
            <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Header */}
                <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {message.senderName}
                    </span>
                    <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: role?.color || '#7b68ee' }}
                    >
                        {role?.name || message.role}
                    </span>
                    <span className="text-[10px] text-gray-400">
                        {formatMessageTime(message.timestamp)}
                    </span>
                </div>

                {/* Reply Reference */}
                {message.replyTo && (
                    <div className={`text-xs text-gray-500 dark:text-gray-400 p-2 mb-1 bg-gray-100 dark:bg-slate-700/50 rounded-lg border-l-2 border-primary-purple ${isOwn ? 'ml-auto' : ''}`}>
                        <span className="font-medium">↩ {message.replyTo.senderName}:</span>{' '}
                        {message.replyTo.text?.substring(0, 50)}...
                    </div>
                )}

                {/* Message Bubble */}
                <div
                    className={`relative p-3 rounded-2xl shadow-sm ${isOwn
                            ? 'bg-gradient-to-br from-primary-purple to-accent-pink text-white rounded-tr-none'
                            : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-600 rounded-tl-none'
                        }`}
                >
                    {/* Text Content */}
                    {message.text && (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.text}
                        </p>
                    )}

                    {/* Media Attachments */}
                    {message.media?.length > 0 && (
                        <div className={`flex flex-wrap gap-2 ${message.text ? 'mt-2' : ''}`}>
                            {message.media.map((media, idx) => (
                                <div key={idx} className="relative group/media">
                                    {media.type === 'image' ? (
                                        <img
                                            src={media.data}
                                            alt={media.name}
                                            className="max-w-[200px] max-h-[150px] rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(media.data, '_blank')}
                                        />
                                    ) : (
                                        <a
                                            href={media.data}
                                            download={media.name}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${isOwn
                                                    ? 'bg-white/20 hover:bg-white/30 text-white'
                                                    : 'bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 text-gray-700 dark:text-gray-200'
                                                }`}
                                        >
                                            <File size={14} />
                                            <span className="max-w-[120px] truncate">{media.name}</span>
                                            <Download size={12} />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Message Actions */}
                    <div
                        className={`absolute ${isOwn ? '-left-8' : '-right-8'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                        <button
                            className="p-1.5 rounded-full bg-white dark:bg-slate-700 shadow-md text-gray-500 hover:text-primary-purple transition-colors"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <MoreVertical size={14} />
                        </button>

                        {showMenu && (
                            <div className={`absolute ${isOwn ? 'left-0' : 'right-0'} top-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-1 z-10 min-w-[120px]`}>
                                <button
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                                    onClick={() => {
                                        onReply(message);
                                        setShowMenu(false);
                                    }}
                                >
                                    <Reply size={12} />
                                    Reply
                                </button>
                                {isOwn && (
                                    <button
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => {
                                            onDelete(message.id);
                                            setShowMenu(false);
                                        }}
                                    >
                                        <Trash2 size={12} />
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * DiscussionRoom Component - Group chat for task collaboration
 */
function DiscussionRoom({
    taskId,
    messages = [],
    onSendMessage,
    onDeleteMessage,
    assignees = {},
    currentUserRole = 'pm'
}) {
    const [newMessage, setNewMessage] = useState('');
    const [mediaAttachments, setMediaAttachments] = useState([]);
    const [replyTo, setReplyTo] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentUser, setCurrentUser] = useState('user1');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle file selection
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setMediaAttachments(prev => [...prev, {
                    type: file.type.startsWith('image/') ? 'image' : 'file',
                    data: ev.target.result,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    // Remove attachment
    const removeAttachment = (index) => {
        setMediaAttachments(prev => prev.filter((_, i) => i !== index));
    };

    // Send message
    const handleSend = () => {
        if (!newMessage.trim() && mediaAttachments.length === 0) return;

        const message = {
            id: Date.now() + Math.random(),
            text: newMessage.trim(),
            media: mediaAttachments,
            role: USERS[currentUser].role,
            senderName: USERS[currentUser].name,
            timestamp: new Date().toISOString(),
            replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, senderName: replyTo.senderName } : null
        };

        onSendMessage(message);
        setNewMessage('');
        setMediaAttachments([]);
        setReplyTo(null);
    };

    // Handle keyboard shortcut
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Get online team members (simulated)
    const teamMembers = Object.entries(assignees).filter(([_, name]) => name);

    return (
        <div className="flex flex-col bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary-purple to-accent-pink rounded-lg">
                        <MessageCircle className="text-white" size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Discussion Room</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                            {messages.length} messages • {teamMembers.length} team members
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Team avatars */}
                    <div className="flex -space-x-2">
                        {teamMembers.slice(0, 4).map(([roleKey, name]) => {
                            const role = ROLES[roleKey.toUpperCase()];
                            return (
                                <div
                                    key={roleKey}
                                    className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-white"
                                    style={{ backgroundColor: role?.color || '#7b68ee' }}
                                    title={`${role?.name}: ${name}`}
                                >
                                    {role?.icon}
                                </div>
                            );
                        })}
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 transition-colors">
                        <Users size={16} />
                    </button>
                </div>
            </div>

            {/* User Selector */}
            {isExpanded && (
                <div className="px-4 py-2 bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                    <select
                        value={currentUser}
                        onChange={(e) => setCurrentUser(e.target.value)}
                        className="w-full p-2 text-sm bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-md"
                    >
                        {Object.entries(USERS).map(([id, user]) => (
                            <option key={id} value={id}>
                                {user.avatar} {user.name} ({ROLES[user.role.toUpperCase()]?.name})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {isExpanded && (
                <>
                    {/* Messages Area */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[300px] min-h-[200px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-8">
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mb-3">
                                    <MessageCircle className="text-gray-400" size={24} />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isOwn={message.role === currentUserRole}
                                    onDelete={onDeleteMessage}
                                    onReply={setReplyTo}
                                />
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Reply Banner */}
                    {replyTo && (
                        <div className="flex items-center justify-between px-4 py-2 bg-primary-purple/10 border-t border-primary-purple/20">
                            <div className="flex items-center gap-2">
                                <Reply size={14} className="text-primary-purple" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Replying to <strong>{replyTo.senderName}</strong>
                                </span>
                            </div>
                            <button
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500"
                                onClick={() => setReplyTo(null)}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    {/* Attachments Preview */}
                    {mediaAttachments.length > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700 overflow-x-auto">
                            {mediaAttachments.map((attachment, idx) => (
                                <div key={idx} className="relative group flex-shrink-0">
                                    {attachment.type === 'image' ? (
                                        <img
                                            src={attachment.data}
                                            alt={attachment.name}
                                            className="w-12 h-12 rounded-lg object-cover border border-gray-300 dark:border-slate-600"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                                            <File size={20} className="text-gray-500" />
                                        </div>
                                    )}
                                    <button
                                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeAttachment(idx)}
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="flex items-end gap-2 p-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        <button
                            className="p-2 rounded-lg text-gray-500 hover:text-primary-purple hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                            onClick={() => fileInputRef.current?.click()}
                            title="Attach files"
                        >
                            <Paperclip size={18} />
                        </button>

                        <button
                            className="p-2 rounded-lg text-gray-500 hover:text-primary-purple hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                            onClick={() => fileInputRef.current?.click()}
                            title="Add image"
                        >
                            <Image size={18} />
                        </button>

                        <div className="flex-1 relative">
                            <textarea
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-slate-700 border border-transparent focus:border-primary-purple/30 focus:bg-white dark:focus:bg-slate-600 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 resize-none outline-none transition-all"
                                placeholder="Type a message..."
                                rows={1}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{ maxHeight: '100px' }}
                            />
                        </div>

                        <button
                            className={`p-3 rounded-xl transition-all ${newMessage.trim() || mediaAttachments.length > 0
                                    ? 'bg-gradient-to-r from-primary-purple to-accent-pink text-white shadow-lg shadow-primary-purple/30 hover:shadow-xl hover:-translate-y-0.5'
                                    : 'bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed'
                                }`}
                            onClick={handleSend}
                            disabled={!newMessage.trim() && mediaAttachments.length === 0}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default DiscussionRoom;
export { MessageBubble };
