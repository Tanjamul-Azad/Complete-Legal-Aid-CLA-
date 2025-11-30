import React, { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import { MailIcon, ClockIcon } from '../../ui/icons';

export const AdminSupport: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { supportMessages, setToast } = context;

    const handleReply = (email: string) => {
        // In a real app, this would open a modal or redirect to an email client
        window.location.href = `mailto:${email}`;
        setToast({ message: `Opened email client to reply to ${email}`, type: 'info' });
    };

    const handleMarkSpam = (id: string) => {
        // In a real app, this would call an API
        setToast({ message: "Message marked as spam.", type: 'success' });
    };

    return (
        <div className="bg-cla-bg dark:bg-cla-surface-dark p-6 rounded-lg border border-cla-border dark:border-cla-border-dark animate-fade-in">
            <h2 className="text-2xl font-bold text-cla-text dark:text-cla-text-dark mb-6">Support Inbox ({supportMessages.length})</h2>

            {supportMessages.length > 0 ? (
                <div className="space-y-4">
                    {supportMessages.map(msg => (
                        <div key={msg.id} className="bg-white dark:bg-black/20 p-4 rounded-lg border border-cla-border dark:border-white/10 hover:border-cla-gold transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                                        <MailIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-cla-text dark:text-white">{msg.name}</h3>
                                        <p className="text-xs text-cla-text-muted dark:text-gray-400">{msg.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-cla-text-muted dark:text-gray-500">
                                    <ClockIcon className="w-3 h-3" />
                                    {new Date(msg.timestamp).toLocaleString()}
                                </div>
                            </div>
                            <div className="pl-10">
                                <p className="text-sm text-cla-text dark:text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                                <div className="mt-3 flex gap-2">
                                    <button onClick={() => handleReply(msg.email)} className="text-xs font-bold text-cla-gold hover:underline">Reply via Email</button>
                                    <span className="text-gray-300 dark:text-gray-700">|</span>
                                    <button onClick={() => handleMarkSpam(msg.id)} className="text-xs font-bold text-red-500 hover:underline">Mark as Spam</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-cla-text-muted dark:text-gray-500">
                    <MailIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No support messages yet.</p>
                </div>
            )}
        </div>
    );
};
