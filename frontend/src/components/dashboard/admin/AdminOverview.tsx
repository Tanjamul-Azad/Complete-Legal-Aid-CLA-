import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../../context/AppContext';
import { UserGroupIcon, BriefcaseIcon, VerificationIcon, BanknotesIcon, GavelIcon } from '../../ui/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatCard, DashboardCard } from '../StatCard';

export const AdminOverview: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { users, cases, setDashboardSubPage } = context;

    const stats = useMemo(() => {
        return {
            totalUsers: users.length,
            citizens: users.filter(u => u.role === 'citizen').length,
            lawyers: users.filter(u => u.role === 'lawyer').length,
            pendingVerifications: users.filter(u => u.verificationStatus === 'Pending').length,
            activeCases: cases.filter(c => c.status !== 'Resolved').length,
            revenue: '৳ 1.2M' // Simulated
        };
    }, [users, cases]);

    const recentUsers = [...users].reverse().slice(0, 5);

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-cla-text dark:text-white">System Overview</h1>
                <p className="text-cla-text-muted dark:text-cla-text-muted-dark mt-1">Platform statistics and administrative monitoring.</p>
            </div>

            {/* Emergency Alerts Section */}
            {context.emergencyAlerts && context.emergencyAlerts.filter(a => a.status === 'Active').length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 animate-pulse-slow">
                    <h2 className="text-xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        Active Emergency Alerts
                    </h2>
                    <div className="space-y-4">
                        {context.emergencyAlerts.filter(a => a.status === 'Active').map(alert => (
                            <div key={alert.id} className="bg-white dark:bg-black/40 p-4 rounded-lg border border-red-100 dark:border-red-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg text-gray-900 dark:text-white">{alert.userName}</span>
                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-mono">SOS</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        Location: <a href={`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">View on Map</a>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <span className="font-mono text-xs">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Phone: {alert.userPhone}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => context.resolveEmergencyAlert(alert.id, 'Resolved')}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                                    >
                                        Resolve
                                    </button>
                                    <button
                                        onClick={() => context.resolveEmergencyAlert(alert.id, 'False Alarm')}
                                        className="px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                                    >
                                        False Alarm
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<UserGroupIcon className="w-6 h-6" />}
                    value={stats.totalUsers.toString()}
                    label="Total Users"
                    iconColorClass="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                    onClick={() => setDashboardSubPage('admin-users')}
                />
                <StatCard
                    icon={<BriefcaseIcon className="w-6 h-6" />}
                    value={stats.activeCases.toString()}
                    label="Active Cases"
                    iconColorClass="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
                    onClick={() => setDashboardSubPage('admin-cases')}
                />
                <StatCard
                    icon={<VerificationIcon className="w-6 h-6" />}
                    value={stats.pendingVerifications.toString()}
                    label="Pending Verifications"
                    iconColorClass="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg"
                    onClick={() => setDashboardSubPage('verification')}
                />
                <StatCard
                    icon={<BanknotesIcon className="w-6 h-6" />}
                    value={stats.revenue}
                    label="Platform Revenue (Est)"
                    iconColorClass="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg"
                // No page for revenue yet, maybe link to billing later
                />
            </div>

            {/* Secondary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Registrations */}
                <DashboardCard className="flex flex-col h-full">
                    <div className="p-6 border-b border-cla-border dark:border-cla-border-dark flex justify-between items-center relative z-20">
                        <h3 className="text-lg font-bold text-cla-text dark:text-white">Recent Registrations</h3>
                        <button onClick={() => setDashboardSubPage('admin-users')} className="text-xs font-bold text-cla-gold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto flex-1 relative z-20">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cla-border dark:divide-cla-border-dark">
                                {recentUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                                            <div>
                                                <p className="font-medium text-cla-text dark:text-white">{u.name}</p>
                                                <p className="text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 capitalize">{u.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                u.verificationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                                }`}>
                                                {u.verificationStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>

                {/* Platform Analytics */}
                <DashboardCard className="p-6 flex flex-col h-full">
                    <h3 className="text-lg font-bold text-cla-text dark:text-white mb-6 relative z-20">Platform Analytics</h3>
                    <div className="flex-1 min-h-[250px] relative z-20">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: 'Mon', cases: 4, users: 2 },
                                    { name: 'Tue', cases: 3, users: 5 },
                                    { name: 'Wed', cases: 2, users: 3 },
                                    { name: 'Thu', cases: 7, users: 8 },
                                    { name: 'Fri', cases: 5, users: 4 },
                                    { name: 'Sat', cases: 6, users: 7 },
                                    { name: 'Sun', cases: 4, users: 6 },
                                ]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="cases" name="New Cases" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="users" name="New Users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 pt-6 border-t border-cla-border dark:border-cla-border-dark flex gap-4 relative z-20">
                        <button onClick={() => setDashboardSubPage('system-logs')} className="flex-1 py-2 bg-gray-100 dark:bg-white/5 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">System Logs</button>
                        <button onClick={() => setDashboardSubPage('audit-logs')} className="flex-1 py-2 bg-gray-100 dark:bg-white/5 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Audit Trail</button>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};
