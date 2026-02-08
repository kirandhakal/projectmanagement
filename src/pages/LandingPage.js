import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BarChart2,
    Layers,
    Users,
    Zap,
    ChevronRight,
    Layout,
    Shield,
    MousePointer2
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const features = [
        {
            title: "Project Management",
            description: "Organize your team and projects with ease. Create multiple projects and track progress in real-time.",
            icon: <Layers className="text-indigo-500" size={24} />,
            color: "bg-indigo-500/10"
        },
        {
            title: "Workflow Boards",
            description: "Customizable Kanban boards with role-based access. Invite team members and collaborate seamlessly.",
            icon: <Layout className="text-purple-500" size={24} />,
            color: "bg-purple-500/10"
        },
        {
            title: "Role-Based Access",
            description: "Granular control over who can see and edit your boards. Secure and invitation-only visibility.",
            icon: <Shield className="text-pink-500" size={24} />,
            color: "bg-pink-500/10"
        },
        {
            title: "Team Collaboration",
            description: "Real-time updates and team communication integrated directly into your workflow.",
            icon: <Users className="text-blue-500" size={24} />,
            color: "bg-blue-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-indigo-500/30">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <BarChart2 size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">TaskFlow</span>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-slate-300 hover:text-white transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-indigo-600/20"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 text-sm mb-8"
                >
                    <Zap size={14} className="text-indigo-400" />
                    <span>The next generation project management tool</span>
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
                >
                    Workflow Harmony <br /> For Modern Teams
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
                >
                    Empower your team with a sleek, role-based project management system.
                    Manage tasks, create specialized workflow boards, and collaborate in style.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button
                        onClick={() => navigate('/register')}
                        className="group bg-white text-slate-950 px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-white/5"
                    >
                        Start Your Project
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="bg-slate-900/50 border border-slate-800 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all">
                        Watch Demo
                    </button>
                </motion.div>

                {/* Dashboard Preview Mockup */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="mt-24 w-full relative"
                >
                    <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full translate-y-1/2 scale-110" />
                    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl overflow-hidden aspect-[16/9]">
                        {/* Mock UI Elements */}
                        <div className="grid grid-cols-12 h-full gap-4">
                            <div className="col-span-3 bg-slate-950/50 rounded-xl p-4 space-y-4">
                                <div className="h-4 w-3/4 bg-slate-800 rounded-full" />
                                <div className="space-y-4 pt-8">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`h-8 w-full rounded-lg ${i === 1 ? 'bg-indigo-600/30 border border-indigo-600/50' : 'bg-slate-900'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-9 bg-slate-950/50 rounded-xl p-8">
                                <div className="flex justify-between items-center mb-12">
                                    <div className="h-8 w-48 bg-slate-800 rounded-lg" />
                                    <div className="h-10 w-10 bg-slate-800 rounded-full" />
                                </div>
                                <div className="grid grid-cols-3 gap-6 h-full pb-20">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
                                            <div className="h-4 w-1/2 bg-slate-800 rounded-full mb-4" />
                                            <div className="h-24 w-full bg-slate-800/50 rounded-lg" />
                                            <div className="h-24 w-full bg-slate-800/50 rounded-lg" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Interactive Cursor Mockup */}
                        <motion.div
                            animate={{
                                x: [100, 300, 200, 400],
                                y: [50, 200, 150, 100]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute z-20"
                        >
                            <MousePointer2 className="text-white drop-shadow-lg" size={32} fill="white" />
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            {/* Features Section */}
            <section className="relative z-10 py-32 bg-slate-950">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold mb-4">Everything you need to ship faster</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Powerful tools for teams of all sizes. From personal projects to enterprise-grade workflows.
                        </p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 border border-white/5`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="bg-indigo-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-600/20">
                        {/* Circle pattern */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

                        <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">Ready to transform your workflow?</h2>
                        <p className="text-indigo-100 text-lg mb-12 max-w-2xl mx-auto relative z-10">
                            Join thousands of teams that are already using TaskFlow to build amazing products.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all relative z-10 shadow-lg"
                        >
                            Get Started Free
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-slate-900 text-center text-slate-500 text-sm">
                <p>&copy; 2024 TaskFlow. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
