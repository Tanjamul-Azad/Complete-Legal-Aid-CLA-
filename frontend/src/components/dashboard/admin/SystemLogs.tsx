import React, { useState, useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import { SearchIcon, ServerIcon, ExclamationCircleIcon, CheckCircleIcon, InformationCircleIcon } from '../../ui/icons';

interface SystemLog {
    id: string;
    level: 'INFO' | 'WARN' | 'ERROR';
    component: string;
    message: string;
    timestamp: string;
}

const MOCK_SYSTEM_LOGS: SystemLog[] = [
    { id: '1', level: 'INFO', component: 'AuthService', message: 'User login successful: user_123', timestamp: '2023-10-27 10:30:05' },
    { id: '2', level: 'INFO', component: 'Database', message: 'Connection pool refreshed', timestamp: '2023-10-27 10:00:00' },
    { id: '3', level: 'WARN', component: 'EmailService', message: 'Retry attempt 1 for email to user@example.com', timestamp: '2023-10-27 09:45:12' },
    { id: '4', level: 'ERROR', component: 'PaymentGateway', message: 'Timeout waiting for response from provider', timestamp: '2023-10-27 09:30:00' },
    { id: '5', level: 'INFO', component: 'CronJob', message: 'Daily backup started', timestamp: '2023-10-27 03:00:00' },
    { id: '6', level: 'INFO', component: 'CronJob', message: 'Daily backup completed successfully', timestamp: '2023-10-27 03:15:00' },
];

export const SystemLogs: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('ALL');

    const filteredLogs = MOCK_SYSTEM_LOGS.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.component.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
        return matchesSearch && matchesLevel;
    });

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'INFO': return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
            case 'WARN': return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
            case 'ERROR': return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
            default: return <CheckCircleIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const getLevelClass = (level: string) => {
        switch (level) {
            case 'INFO': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
            case 'WARN': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'ERROR': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-cla-text dark:text-white flex items-center gap-2">
                        <ServerIcon className="w-8 h-8 text-cla-gold" />
                        System Logs
                    </h1>
                    <p className="text-cla-text-muted dark:text-cla-text-muted-dark text-sm mt-1">Technical logs and server events.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg border border-cla-border dark:border-cla-border-dark bg-white dark:bg-cla-surface-dark text-sm focus:ring-2 focus:ring-cla-gold focus:outline-none"
                        />
                    </div>
                    <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-cla-border dark:border-cla-border-dark bg-white dark:bg-cla-surface-dark text-sm focus:ring-2 focus:ring-cla-gold focus:outline-none"
                    >
                        <option value="ALL">All Levels</option>
                        <option value="INFO">Info</option>
                        <option value="WARN">Warning</option>
                        <option value="ERROR">Error</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-cla-surface-dark rounded-xl border border-cla-border dark:border-cla-border-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">Level</th>
                                <th className="px-6 py-3">Component</th>
                                <th className="px-6 py-3">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cla-border dark:divide-cla-border-dark">
                            {filteredLogs.length > 0 ? filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-cla-text-muted dark:text-gray-400 font-mono text-xs">
                                        {log.timestamp}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${getLevelClass(log.level)}`}>
                                            {getLevelIcon(log.level)}
                                            {log.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-cla-text dark:text-white font-mono text-xs">{log.component}</td>
                                    <td className="px-6 py-4 text-cla-text-muted dark:text-gray-400">
                                        {log.message}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-cla-text-muted dark:text-gray-500">
                                        No logs found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
