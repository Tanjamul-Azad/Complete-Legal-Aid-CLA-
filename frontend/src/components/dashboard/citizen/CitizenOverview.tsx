import React, { useContext, useMemo, useState, useEffect } from 'react';
import type { User, Appointment, ActivityLog, Case, DashboardSubPage, EvidenceDocument, Notification } from '../../../types';
import { AppContext } from '../../../context/AppContext';
import {
    BriefcaseIcon, CalendarIcon, VaultIcon, PlusCircleIcon, SearchIcon,
    ChevronRightIcon, DocumentTextIcon, BookOpenIcon, WarningIcon, RobotIcon,
    LockClosedIcon, StarIcon, MessageIcon, ClockIcon, DocumentCloudIcon, ScaleIcon, BuildingOfficeIcon
} from '../../ui/icons';
import { DashboardCard } from '../StatCard';

// --- Helper Components ---

const SectionHeader: React.FC<{ icon: React.ReactNode, title: string, className?: string, count?: number }> = ({ icon, title, className = '', count }) => (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
        <div className="p-2 bg-cla-surface dark:bg-cla-bg-dark rounded-lg">{icon}</div>
        <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-cla-text dark:text-cla-text-dark">{title}</h3>
            {typeof count !== 'undefined' && <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cla-gold/20 text-cla-gold-darker dark:text-cla-gold">{count} items</span>}
        </div>
    </div>
);

const AttentionItem: React.FC<{ icon: React.ReactNode, title: string, description: string, buttonText: string, onClick: () => void; }> = ({ icon, title, description, buttonText, onClick }) => (
    <div className="flex items-center gap-4 p-4 bg-cla-surface dark:bg-cla-bg-dark rounded-lg">
        <div className="text-cla-gold flex-shrink-0">{icon}</div>
        <div className="flex-grow">
            <h4 className="font-semibold text-cla-text dark:text-cla-text-dark">{title}</h4>
            <p className="text-sm text-cla-text-muted dark:text-cla-text-muted-dark">{description}</p>
        </div>
        <button onClick={onClick} className="self-center px-3 py-1 text-xs font-semibold bg-cla-gold/10 text-cla-gold rounded-full hover:bg-cla-gold/20 transition-colors whitespace-nowrap">{buttonText}</button>
    </div>
);

const getCaseIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('land') || lowerTitle.includes('rental') || lowerTitle.includes('property')) return <BuildingOfficeIcon className="w-5 h-5 text-cla-text-muted dark:text-cla-text-muted-dark" />;
    if (lowerTitle.includes('bail') || lowerTitle.includes('custody')) return <ScaleIcon className="w-5 h-5 text-cla-text-muted dark:text-cla-text-muted-dark" />;
    if (lowerTitle.includes('contract') || lowerTitle.includes('filing')) return <DocumentTextIcon className="w-5 h-5 text-cla-text-muted dark:text-cla-text-muted-dark" />;
    return <BriefcaseIcon className="w-5 h-5 text-cla-text-muted dark:text-cla-text-muted-dark" />;
};

const getActivityType = (message: string): 'upload' | 'update' | 'appointment' | 'message' | 'default' => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('upload')) return 'upload';
    if (lowerMessage.includes('status') || lowerMessage.includes('updated')) return 'update';
    if (lowerMessage.includes('appointment') || lowerMessage.includes('rescheduled')) return 'appointment';
    if (lowerMessage.includes('message')) return 'message';
    return 'default';
};

const ActivityIcon: React.FC<{ type: ReturnType<typeof getActivityType> }> = ({ type }) => {
    const iconProps = { className: "w-5 h-5" };
    switch (type) {
        case 'upload': return <DocumentCloudIcon {...iconProps} />;
        case 'update': return <BriefcaseIcon {...iconProps} />;
        case 'appointment': return <CalendarIcon {...iconProps} />;
        case 'message': return <MessageIcon {...iconProps} />;
        default: return <ClockIcon {...iconProps} />;
    }
};

const ActivityMessage: React.FC<{ message: string; onCaseClick: (id: string) => void }> = ({ message, onCaseClick }) => {
    const parts = message.split(/(Case #\w+|"[^"]+")/g);
    return (
        <p className="text-cla-text dark:text-cla-text-dark">
            {parts.map((part, index) => {
                if (part.startsWith('Case #')) {
                    const targetCaseId = part.split('#')[1];
                    return <button key={index} onClick={() => onCaseClick(targetCaseId)} className="font-semibold text-cla-gold hover:underline">{part}</button>;
                }
                if (part.startsWith('"')) {
                    return <strong key={index} className="font-semibold text-cla-text dark:text-white">{part}</strong>;
                }
                return part;
            })}
        </p>
    );
};

export const CitizenOverview: React.FC = () => {
    const context = useContext(AppContext);
    const [animateProgress, setAnimateProgress] = useState(false);

    const user = context?.user;
    const activityLogs = context?.activityLogs;

    const initialUserActivity = useMemo(() => {
        if (!user || !activityLogs) return [];
        return activityLogs.filter(a => a.userId === user.id);
    }, [activityLogs, user]);

    const [displayedActivity, setDisplayedActivity] = useState<ActivityLog[]>([]);

    useEffect(() => {
        setDisplayedActivity(initialUserActivity);
    }, [initialUserActivity]);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateProgress(true), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!user) return;
        const mockActivities = [
            { userId: user.id, message: 'You have a new message from "Barrister Sumon" regarding Case #c2.', caseId: 'c2' },
            { userId: user.id, message: 'Your appointment with "Anisul Huq" was rescheduled to tomorrow.' },
            { userId: user.id, message: 'New document "Partnership_Agreement_Final.pdf" uploaded to Case #c4.', caseId: 'c4' },
        ];
        let mockIndex = 0;

        const intervalId = setInterval(() => {
            const newActivity = { ...mockActivities[mockIndex % mockActivities.length], id: `mock-${Date.now()}`, timestamp: 'Just now' };
            setDisplayedActivity(prev => [newActivity, ...prev]);
            mockIndex++;
        }, 7000);

        return () => clearInterval(intervalId);
    }, [user]);

    if (!context || !user) return null;

    const {
        users: allUsers, appointments, cases, messages, evidenceDocuments, notifications,
        setDashboardSubPage, setReviewTarget, setChatOpen, setSelectedCaseId,
        openInbox, setSelectedCaseForUpload, handleNotificationNavigation, setAiChatInitialPrompt
    } = context;

    const documentCount = evidenceDocuments.filter(doc => cases.some(c => c.id === doc.caseId && c.clientId === user.id)).length;
    const activeCases = cases.filter(c => c.clientId === user.id && c.status !== 'Resolved');
    // FIXED: Actual filtering for upcoming appointments
    const upcomingAppointments = appointments.filter(a => a.clientId === user.id && new Date(a.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const attentionItems = useMemo(() => {
        const items: any[] = [];
        const userNotifications = notifications.filter(n => n.userId === user.id && !n.read);
        const priorityOrder: Notification['type'][] = ['deadline', 'new_message', 'appointment', 'case_update'];
        const sortedNotifications = userNotifications.sort((a, b) => {
            const priorityA = priorityOrder.indexOf(a.type);
            const priorityB = priorityOrder.indexOf(b.type);
            if (priorityA !== priorityB) return priorityA - priorityB;
            return b.timestamp - a.timestamp;
        });

        sortedNotifications.slice(0, 4).forEach(notif => {
            let item: any = { id: notif.id, title: notif.title, description: notif.body || '', onClick: () => { handleNotificationNavigation(notif); openInbox(); } };
            switch (notif.type) {
                case 'new_message': item.icon = <MessageIcon className="w-6 h-6" />; item.buttonText = 'View Message'; break;
                case 'appointment': item.icon = <CalendarIcon className="w-6 h-6" />; item.buttonText = 'View Schedule'; break;
                case 'deadline': item.icon = <WarningIcon className="w-6 h-6" />; item.buttonText = 'View Case'; break;
                default: item.icon = <BriefcaseIcon className="w-6 h-6" />; item.buttonText = 'View Details';
            }
            items.push(item);
        });

        const pendingReviewCase = cases.find(c => c.clientId === user.id && c.status === 'Resolved' && !c.reviewed);
        if (pendingReviewCase && items.length < 4) {
            const lawyer = allUsers.find(u => u.id === pendingReviewCase.lawyerId);
            if (lawyer) {
                items.push({ id: 'review', icon: <StarIcon className="w-6 h-6" />, title: `Rate your experience for case: "${pendingReviewCase.title}"`, description: `Your case with ${lawyer.name} is complete. Please provide your feedback.`, buttonText: 'Leave a Review', onClick: () => setReviewTarget({ lawyerId: lawyer.id, source: { type: 'case', id: pendingReviewCase.id } }) });
            }
        }
        return items;
    }, [user.id, notifications, cases, handleNotificationNavigation, setReviewTarget, openInbox, allUsers]);

    const handleCaseClick = (targetCaseId: string) => {
        if (setSelectedCaseId) {
            setSelectedCaseId(targetCaseId);
            setDashboardSubPage('cases');
        }
    };

    return (
        <div className="space-y-8">
            {/* OPTION A: Inline Profile Placement */}
            <div className="flex items-center justify-between mb-8 animate-fade-in-up pb-8 border-b border-cla-border dark:border-cla-border-dark">
                <div className="flex items-center gap-6">
                    {/* Profile Picture - Inline and balanced */}
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-16 w-16 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover"
                    />

                    {/* Welcome Text - Stronger hierarchy */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Welcome back, {user.name} 👋
                        </h1>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-cla-gold/10 text-cla-gold-darker dark:text-cla-gold">
                                {user.role}
                            </span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {attentionItems.length > 0 ? "You have new updates." : "You're all caught up."}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Column (Left) */}
                <div className="xl:col-span-2 space-y-8">
                    {attentionItems.length > 0 && (
                        <section className="animate-fade-in-up mt-8" style={{ animationDelay: '100ms' }}>
                            <SectionHeader icon={<WarningIcon className="w-6 h-6 text-yellow-500" />} title="Needs Your Attention" count={attentionItems.length} />
                            <div className="space-y-4">{attentionItems.map(item => <AttentionItem key={item.id} {...item} />)}</div>
                        </section>
                    )}

                    <section className="animate-fade-in-up mt-8" style={{ animationDelay: '200ms' }}>
                        <SectionHeader icon={<BriefcaseIcon className="w-6 h-6 text-cla-gold" />} title="Active Cases" />
                        <DashboardCard onClick={() => setDashboardSubPage('cases')} className="p-6">
                            <div className="flex justify-between items-center mb-4 relative z-20">
                                <h3 className="text-lg font-semibold text-cla-text dark:text-cla-text-dark">Case Progress</h3>
                                <div className="flex items-center text-sm text-cla-gold hover:underline"><span>View All</span><ChevronRightIcon className="w-4 h-4 ml-1" /></div>
                            </div>
                            {activeCases.length > 0 ? (
                                <div className="space-y-6 relative z-20">
                                    {activeCases.slice(0, 3).map(c => {
                                        const steps = ['Submitted', 'In Review', 'Scheduled', 'Resolved'];
                                        const currentStep = steps.indexOf(c.status);
                                        const progress = currentStep >= 0 ? ((currentStep + 1) / (steps.length) * 100) : 0;
                                        return (
                                            <div key={c.id} onClick={(e) => { e.stopPropagation(); setSelectedCaseId(c.id); setDashboardSubPage('cases'); }} className="hover:bg-cla-surface dark:hover:bg-cla-bg-dark -m-2 p-3 rounded-lg cursor-pointer transition-colors">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-semibold text-cla-text dark:text-cla-text-dark flex items-center gap-2">{getCaseIcon(c.title)} {c.title}</p>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>{c.status}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                                                    <div className="bg-cla-gold h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: animateProgress ? `${progress}%` : '0%' }}></div>
                                                </div>
                                                <p className="text-[10px] text-cla-text-muted dark:text-cla-text-muted-dark mt-2 uppercase tracking-wide font-semibold">Next: Lawyer Review</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 relative z-20">
                                    <DocumentTextIcon className="w-12 h-12 text-cla-text-muted dark:text-cla-text-muted-dark mx-auto opacity-50" />
                                    <p className="mt-3 text-cla-text-muted dark:text-cla-text-muted-dark font-medium">You have no active cases.</p>
                                </div>
                            )}
                        </DashboardCard>
                    </section>

                    <section className="animate-fade-in-up mt-8" style={{ animationDelay: '300ms' }}>
                        <SectionHeader icon={<ClockIcon className="w-6 h-6 text-cla-gold" />} title="Recent Activity" />
                        <DashboardCard className="p-6">
                            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-20">
                                {displayedActivity.length > 0 ? displayedActivity.slice(0, 5).map((log, index) => {
                                    const type = getActivityType(log.message);
                                    const iconColors = { upload: 'text-blue-500 bg-blue-500/10', update: 'text-cla-gold bg-cla-gold/10', appointment: 'text-green-500 bg-green-500/10', message: 'text-purple-500 bg-purple-500/10', default: 'text-gray-500 bg-gray-500/10' };
                                    return (
                                        <div key={log.id} className="relative flex items-start gap-4 animate-fade-in-up" style={{ animationDuration: '500ms' }}>
                                            {index < displayedActivity.slice(0, 5).length - 1 && <div className="absolute top-5 left-[11px] h-full w-0.5 bg-cla-border dark:bg-cla-border-dark" />}
                                            <div className={`relative z-10 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mt-1 ${iconColors[type]}`}><ActivityIcon type={type} /></div>
                                            <div className="flex-1 flex justify-between items-start text-sm">
                                                <div>
                                                    <ActivityMessage message={log.message} onCaseClick={handleCaseClick} />
                                                    <p className="text-xs text-cla-text-muted dark:text-cla-text-muted-dark mt-0.5">{log.timestamp}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <p className="text-cla-text-muted dark:text-cla-text-muted-dark text-center py-4">No recent activity.</p>
                                )}
                            </div>
                        </DashboardCard>
                    </section>
                </div>

                {/* Sidebar Column (Right) */}
                <div className="space-y-8">
                    <section className="animate-fade-in-up mt-8" style={{ animationDelay: '400ms' }}>
                        <SectionHeader icon={<CalendarIcon className="w-6 h-6 text-cla-gold" />} title="My Schedule" />
                        <DashboardCard onClick={() => setDashboardSubPage('appointments')} className="p-5">
                            {upcomingAppointments.length > 0 ? (
                                <div className="space-y-4 relative z-20">
                                    {upcomingAppointments.slice(0, 2).map(appt => (
                                        <div key={appt.id} className="flex items-center gap-3 pb-3 border-b border-cla-border dark:border-white/5 last:border-0 last:pb-0">
                                            {/* Reduced date badge size by ~15% */}
                                            <div className="flex flex-col items-center justify-center w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-lg text-cla-text dark:text-white">
                                                <span className="text-[10px] font-bold uppercase">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-base font-bold leading-none">{new Date(appt.date).getDate()}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-cla-text dark:text-white truncate">{appt.title || appt.type}</p>
                                                <p className="text-xs text-cla-text-muted dark:text-gray-400">{appt.time} • {appt.mode}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {upcomingAppointments.length > 2 && (
                                        <p className="text-xs text-center text-cla-text-muted dark:text-gray-500">+{upcomingAppointments.length - 2} more events</p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 relative z-20">
                                    <p className="font-medium text-sm text-cla-text-muted dark:text-cla-text-muted-dark mb-3">No upcoming appointments.</p>
                                    <button onClick={(e) => { e.stopPropagation(); setDashboardSubPage('find-lawyers'); }} className="w-full px-4 py-2 text-xs font-bold uppercase tracking-wide bg-cla-gold/10 text-cla-gold-darker dark:text-cla-gold rounded-lg hover:bg-cla-gold/20 transition-colors">Book Consultation</button>
                                </div>
                            )}
                        </DashboardCard>
                    </section>

                    <section className="animate-fade-in-up mt-8" style={{ animationDelay: '500ms' }}>
                        <SectionHeader icon={<VaultIcon className="w-6 h-6 text-cla-gold" />} title="Evidence Vault" />
                        <DashboardCard onClick={() => setDashboardSubPage('vault')} className="p-6 text-center bg-gradient-to-b from-white to-gray-50 dark:from-[#1E1E1E] dark:to-[#151515]">
                            <div className="relative z-20">
                                <p className="text-5xl font-bold text-cla-text dark:text-white">{documentCount}</p>
                                <p className="text-cla-text-muted dark:text-gray-400 mt-1 text-xs font-bold uppercase tracking-wider">Documents Secured</p>
                                <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 py-1 px-2 rounded-full inline-flex">
                                    <LockClosedIcon className="w-3 h-3" />
                                    <span className="tracking-tight">AES-256 Encrypted</span>
                                </div>
                            </div>
                        </DashboardCard>
                    </section>

                    <section className="animate-fade-in-up mt-8" style={{ animationDelay: '600ms' }}>
                        <DashboardCard className="p-5">
                            <SectionHeader icon={<RobotIcon className="w-6 h-6 text-cla-gold" />} title="Quick AI Help" className="mb-2 relative z-20" />
                            <div className="grid grid-cols-2 gap-2 mt-3 mb-3 relative z-20">
                                <button onClick={() => { setAiChatInitialPrompt("Please summarize this document for me. [Upload Placeholder]"); setChatOpen(true); }} className="flex flex-col items-center justify-center p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all">
                                    <BookOpenIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 text-center">Summarize Doc</span>
                                </button>
                                <button onClick={() => { setAiChatInitialPrompt("Draft an affidavit for me regarding..."); setChatOpen(true); }} className="flex flex-col items-center justify-center p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all">
                                    <DocumentTextIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1" />
                                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 text-center">Draft Affidavit</span>
                                </button>
                            </div>
                            <div className="space-y-2 text-sm relative z-20">
                                <button onClick={() => setChatOpen(true)} className="w-full text-left p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 text-cla-text dark:text-cla-text-dark hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-xs font-medium border border-cla-border dark:border-white/10">
                                    "How to file a GD?"
                                </button>
                                <button onClick={() => setChatOpen(true)} className="w-full text-left p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 text-cla-text dark:text-cla-text-dark hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-xs font-medium border border-cla-border dark:border-white/10">
                                    "Labor dispute rights?"
                                </button>
                            </div>
                        </DashboardCard>
                    </section>

                    <section className="animate-fade-in-up mt-8" style={{ animationDelay: '800ms' }}>
                        <SectionHeader icon={<PlusCircleIcon className="w-6 h-6 text-cla-gold" />} title="Quick Actions" />
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setDashboardSubPage('cases')} className="flex flex-col items-center justify-center p-4 bg-cla-surface dark:bg-cla-surface-dark border border-cla-border dark:border-cla-border-dark rounded-xl hover:border-cla-gold dark:hover:border-cla-gold hover:shadow-md transition-all group">
                                <DocumentTextIcon className="w-6 h-6 text-gray-400 group-hover:text-cla-gold mb-2" />
                                <span className="text-xs font-bold text-cla-text dark:text-white">New Case</span>
                            </button>
                            <button onClick={() => setDashboardSubPage('find-lawyers')} className="flex flex-col items-center justify-center p-4 bg-cla-surface dark:bg-cla-surface-dark border border-cla-border dark:border-cla-border-dark rounded-xl hover:border-cla-gold dark:hover:border-cla-gold hover:shadow-md transition-all group">
                                <SearchIcon className="w-6 h-6 text-gray-400 group-hover:text-cla-gold mb-2" />
                                <span className="text-xs font-bold text-cla-text dark:text-white">Find Lawyer</span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};