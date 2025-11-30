import React, { useState, useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import { UserCircleIcon, LockClosedIcon, BellIcon } from '../../icons';
import { FormInput, PasswordInput } from '../../ui/FormInputs';
import { PasswordStrengthMeter } from '../../ui/PasswordStrengthMeter';

const TabButton: React.FC<{ id: string; label: string; icon: React.ElementType; activeTab: string; setActiveTab: (id: string) => void; }> = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === id
            ? 'border-cla-gold text-cla-gold'
            : 'border-transparent text-cla-text-muted dark:text-cla-text-muted-dark hover:text-cla-text dark:hover:text-cla-text-dark hover:border-gray-300 dark:hover:border-gray-700'
            }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
);

const SectionCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-cla-surface dark:bg-cla-surface-dark p-6 rounded-xl border border-cla-border dark:border-cla-border-dark shadow-sm animate-fade-in-up">
        <div className="border-b border-cla-border dark:border-cla-border-dark pb-4 mb-6">
            <h3 className="text-lg font-bold text-cla-text dark:text-cla-text-dark">{title}</h3>
            <p className="text-sm text-cla-text-muted dark:text-cla-text-muted-dark mt-1">{description}</p>
        </div>
        {children}
    </div>
);

export const AdminSettings: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { user, handleUpdateProfile, handleChangePassword, setToast, setTheme } = context;

    const [activeTab, setActiveTab] = useState('profile');

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const [isProfileSaving, setIsProfileSaving] = useState(false);

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isPasswordSaving, setIsPasswordSaving] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // Notification State
    const [notificationSettings, setNotificationSettings] = useState({
        systemAlerts: true,
        newRegistrations: true
    });
    const [isNotificationsSaving, setIsNotificationsSaving] = useState(false);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProfileSaving(true);
        try {
            await handleUpdateProfile(user.id, profileData);
            setToast({ message: "Profile updated successfully!", type: 'success' });
        } catch (error) {
            setToast({ message: "Failed to update profile.", type: 'error' });
        } finally {
            setIsProfileSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setToast({ message: "New passwords do not match.", type: 'error' });
            return;
        }
        setIsPasswordSaving(true);
        try {
            await handleChangePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
            setToast({ message: "Password changed successfully!", type: 'success' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setToast({ message: "Failed to change password. Check current password.", type: 'error' });
        } finally {
            setIsPasswordSaving(false);
        }
    };

    const handleNotificationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsNotificationsSaving(true);
        setTimeout(() => {
            setIsNotificationsSaving(false);
            setToast({ message: "Notification settings saved!", type: 'success' });
        }, 1000);
    };

    const renderProfileTab = () => (
        <form onSubmit={handleProfileSubmit}>
            <SectionCard title="Profile Information" description="Update your admin profile details.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput id="name" name="name" label="Full Name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                    <FormInput id="email" name="email" label="Email Address" type="email" value={profileData.email} disabled />
                    <FormInput id="phone" name="phone" label="Phone Number" type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                </div>
            </SectionCard>
            <div className="mt-6 flex justify-start">
                <button type="submit" disabled={isProfileSaving} className="px-6 py-2 bg-cla-gold text-cla-text font-semibold rounded-lg hover:bg-cla-gold-darker disabled:bg-gray-400 transition-colors">
                    {isProfileSaving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
    );

    const renderSecurityTab = () => (
        <div className="space-y-8">
            <form onSubmit={handlePasswordSubmit}>
                <SectionCard title="Change Password" description="For your security, we recommend choosing a strong password you don't use elsewhere.">
                    <div className="space-y-4 max-w-md">
                        <PasswordInput id="currentPassword" name="currentPassword" label="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
                        <PasswordInput id="newPassword" name="newPassword" label="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                        <PasswordStrengthMeter password={passwordData.newPassword} />
                        <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm New Password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                    </div>
                    <div className="mt-6">
                        <button type="submit" disabled={isPasswordSaving} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition-colors">
                            {isPasswordSaving ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </SectionCard>
            </form>

            <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-cla-text dark:text-white">Two-Factor Authentication (2FA)</p>
                        <p className="text-sm text-cla-text-muted dark:text-cla-text-muted-dark">Secure your account with 2FA.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setTwoFactorEnabled(!twoFactorEnabled);
                            setToast({ message: `2FA ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`, type: 'success' });
                        }}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${twoFactorEnabled ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-cla-surface dark:bg-cla-surface-dark border-cla-border dark:border-cla-border-dark hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                        {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                </div>
            </SectionCard>

            <SectionCard title="Active Sessions" description="This is a list of devices that have logged into your account.">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-cla-border dark:border-cla-border-dark">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
                                <span className="text-xl">💻</span>
                            </div>
                            <div>
                                <p className="font-medium text-sm text-cla-text dark:text-white">Windows PC - Chrome</p>
                                <p className="text-xs text-cla-text-muted dark:text-cla-text-muted-dark">Dhaka, Bangladesh • Active now</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">Current</span>
                    </div>
                </div>
            </SectionCard>
        </div>
    );

    const renderNotificationsTab = () => (
        <form onSubmit={handleNotificationSubmit}>
            <SectionCard title="Email Notifications" description="Choose which emails you'd like to receive.">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-cla-text dark:text-white">System Alerts</p>
                            <p className="text-sm text-cla-text-muted dark:text-cla-text-muted-dark">Critical system health notifications.</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="toggle"
                                id="toggle1"
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-cla-gold"
                                checked={notificationSettings.systemAlerts}
                                onChange={(e) => setNotificationSettings(s => ({ ...s, systemAlerts: e.target.checked }))}
                            />
                            <label htmlFor="toggle1" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${notificationSettings.systemAlerts ? 'bg-cla-gold' : 'bg-gray-300'}`}></label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-cla-text dark:text-white">New User Registrations</p>
                            <p className="text-sm text-cla-text-muted dark:text-cla-text-muted-dark">Get notified when a new lawyer registers.</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="toggle"
                                id="toggle2"
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-cla-gold"
                                checked={notificationSettings.newRegistrations}
                                onChange={(e) => setNotificationSettings(s => ({ ...s, newRegistrations: e.target.checked }))}
                            />
                            <label htmlFor="toggle2" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${notificationSettings.newRegistrations ? 'bg-cla-gold' : 'bg-gray-300'}`}></label>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-start">
                        <button type="submit" disabled={isNotificationsSaving} className="px-6 py-2 bg-cla-gold text-cla-text font-semibold rounded-lg hover:bg-cla-gold-darker disabled:bg-gray-400 transition-colors">
                            {isNotificationsSaving ? 'Saving...' : 'Save Notification Settings'}
                        </button>
                    </div>
                </div>
            </SectionCard>
        </form>
    );

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="border-b border-cla-border dark:border-cla-border-dark mb-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <TabButton id="profile" label="Profile" icon={UserCircleIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="security" label="Security" icon={LockClosedIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="notifications" label="Notifications" icon={BellIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>
            </div>
            <div className="space-y-8">
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'security' && renderSecurityTab()}
                {activeTab === 'notifications' && renderNotificationsTab()}
            </div>
        </div>
    );
};
