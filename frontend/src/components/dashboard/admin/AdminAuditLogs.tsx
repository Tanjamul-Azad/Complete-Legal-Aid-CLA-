import React, { useState } from 'react';
import { SearchIcon, DocumentTextIcon, UserCircleIcon, ShieldCheckIcon, ClockIcon } from '../../ui/icons';

interface AuditLog {
    id: string;
    action: string;
    actor: string;
    role: string;
    details: string;
    timestamp: string;
    status: 'Success' | 'Failed' | 'Warning';
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: '1', action: 'User Login', actor: 'Rahim Ahmed', role: 'Citizen', details: 'Logged in from IP 192.168.1.1', timestamp: '2023-10-27 10:30 AM', status: 'Success' },
    { id: '2', action: 'Case Updated', actor: 'Barrister Sumon', role: 'Lawyer', details: 'Updated status of Case #C-102 to In Review', timestamp: '2023-10-27 11:15 AM', status: 'Success' },
    { id: '3', action: 'Document Deleted', actor: 'Admin User', role: 'Admin', details: 'Deleted "Old_Policy.pdf" from Content Manager', timestamp: '2023-10-26 04:45 PM', status: 'Warning' },
    { id: '4', action: 'Failed Login', actor: 'Unknown', role: 'Guest', details: 'Failed login attempt for user@example.com', timestamp: '2023-10-26 02:20 PM', status: 'Failed' },
    { id: '5', action: 'Lawyer Verified', actor: 'Admin User', role: 'Admin', details: 'Verified lawyer profile: Anisul Huq', timestamp: '2023-10-25 09:00 AM', status: 'Success' },
    { id: '6', action: 'System Backup', actor: 'System', role: 'System', details: 'Automated daily backup completed', timestamp: '2023-10-25 03:00 AM', status: 'Success' },
];

export const AdminAuditLogs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');

    const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || log.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Success': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'Warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-cla-text dark:text-white flex items-center gap-2">
                        <ShieldCheckIcon className="w-8 h-8 text-cla-gold" />
                        Audit Trail
                    </h1>
                    <p className="text-cla-text-muted dark:text-cla-text-muted-dark text-sm mt-1">Monitor system activities and security events.</p>
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
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-cla-border dark:border-cla-border-dark bg-white dark:bg-cla-surface-dark text-sm focus:ring-2 focus:ring-cla-gold focus:outline-none"
                    >
                        <option value="All">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Lawyer">Lawyer</option>
                        <option value="Citizen">Citizen</option>
                        <option value="System">System</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-cla-surface-dark rounded-xl border border-cla-border dark:border-cla-border-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3">Actor</th>
                                <th className="px-6 py-3">Details</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cla-border dark:divide-cla-border-dark">
                            {filteredLogs.length > 0 ? filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-cla-text-muted dark:text-gray-400 flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4" />
                                        {log.timestamp}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-cla-text dark:text-white">{log.action}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <UserCircleIcon className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-cla-text dark:text-white">{log.actor}</p>
                                                <p className="text-xs text-cla-text-muted dark:text-gray-500">{log.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-cla-text-muted dark:text-gray-400 max-w-xs truncate" title={log.details}>
                                        {log.details}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(log.status)}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-cla-text-muted dark:text-gray-500">
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
