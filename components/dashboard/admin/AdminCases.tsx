import React, { useContext, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import { BriefcaseIcon, SearchIcon, ClockIcon } from '../../icons';

export const AdminCases: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { cases, users } = context;

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredCases = cases.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-cla-text dark:text-white flex items-center gap-2">
                        <BriefcaseIcon className="w-8 h-8 text-cla-gold" />
                        Case Management
                    </h1>
                    <p className="text-cla-text-muted dark:text-cla-text-muted-dark text-sm mt-1">Monitor and manage all legal cases.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search cases..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg border border-cla-border dark:border-cla-border-dark bg-white dark:bg-cla-surface-dark text-sm focus:ring-2 focus:ring-cla-gold focus:outline-none"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-cla-border dark:border-cla-border-dark bg-white dark:bg-cla-surface-dark text-sm focus:ring-2 focus:ring-cla-gold focus:outline-none"
                    >
                        <option value="all">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-cla-surface-dark rounded-xl border border-cla-border dark:border-cla-border-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Case Title</th>
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Lawyer</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cla-border dark:divide-cla-border-dark">
                            {filteredCases.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-medium text-cla-text dark:text-white">
                                        {c.title}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {getUserName(c.clientId)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {c.lawyerId ? getUserName(c.lawyerId) : <span className="text-gray-400 italic">Unassigned</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                c.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs flex items-center gap-1">
                                        <ClockIcon className="w-3 h-3" />
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-cla-gold hover:underline font-medium text-xs">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
