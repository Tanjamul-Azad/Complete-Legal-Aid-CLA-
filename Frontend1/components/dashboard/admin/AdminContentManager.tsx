import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../context/AppContext';
import { SaveIcon } from '../../icons';

export const AdminContentManager: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { siteContent, updateSiteContent } = context;

    const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'privacy' | 'terms'>('about');
    const [formData, setFormData] = useState(siteContent);
    const [isSaving, setIsSaving] = useState(false);

    // Sync form data if siteContent changes externally (though unlikely in this flow)
    useEffect(() => {
        setFormData(siteContent);
    }, [siteContent]);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        updateSiteContent(formData);
        setIsSaving(false);
        alert('Content updated successfully!');
    };

    const handleChange = (section: keyof typeof formData, field: string, value: string) => {
        setFormData(prev => {
            if (section === 'about' || section === 'contact') {
                return {
                    ...prev,
                    [section]: {
                        ...(prev[section] as any),
                        [field]: value
                    }
                };
            } else {
                return {
                    ...prev,
                    [section]: value
                };
            }
        });
    };

    return (
        <div className="bg-cla-bg dark:bg-cla-surface-dark p-6 rounded-lg border border-cla-border dark:border-cla-border-dark animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-cla-text dark:text-cla-text-dark">Content Management</h2>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-cla-gold text-cla-text font-bold rounded-lg hover:bg-cla-gold-darker transition-colors disabled:opacity-50"
                >
                    <SaveIcon className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-cla-border dark:border-white/10 mb-6">
                {(['about', 'contact', 'privacy', 'terms'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 px-2 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab
                                ? 'border-cla-gold text-cla-gold'
                                : 'border-transparent text-cla-text-muted dark:text-gray-400 hover:text-cla-text dark:hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {activeTab === 'about' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-cla-text dark:text-gray-300 mb-2">Mission Statement</label>
                            <textarea
                                value={formData.about.mission}
                                onChange={e => handleChange('about', 'mission', e.target.value)}
                                rows={3}
                                className="w-full p-3 rounded-lg bg-white dark:bg-black/20 border border-cla-border dark:border-white/10 text-cla-text dark:text-white focus:border-cla-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cla-text dark:text-gray-300 mb-2">Vision Statement</label>
                            <textarea
                                value={formData.about.vision}
                                onChange={e => handleChange('about', 'vision', e.target.value)}
                                rows={3}
                                className="w-full p-3 rounded-lg bg-white dark:bg-black/20 border border-cla-border dark:border-white/10 text-cla-text dark:text-white focus:border-cla-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cla-text dark:text-gray-300 mb-2">Core Values</label>
                            <textarea
                                value={formData.about.values}
                                onChange={e => handleChange('about', 'values', e.target.value)}
                                rows={3}
                                className="w-full p-3 rounded-lg bg-white dark:bg-black/20 border border-cla-border dark:border-white/10 text-cla-text dark:text-white focus:border-cla-gold outline-none"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-cla-text dark:text-gray-300 mb-2">Support Email</label>
                            <input
                                type="email"
                                value={formData.contact.email}
                                onChange={e => handleChange('contact', 'email', e.target.value)}
                                className="w-full p-3 rounded-lg bg-white dark:bg-black/20 border border-cla-border dark:border-white/10 text-cla-text dark:text-white focus:border-cla-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cla-text dark:text-gray-300 mb-2">Support Phone</label>
                            <input
                                type="text"
                                value={formData.contact.phone}
                                onChange={e => handleChange('contact', 'phone', e.target.value)}
                                className="w-full p-3 rounded-lg bg-white dark:bg-black/20 border border-cla-border dark:border-white/10 text-cla-text dark:text-white focus:border-cla-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cla-text dark:text-gray-300 mb-2">Office Address</label>
                            <textarea
                                value={formData.contact.address}
                                onChange={e => handleChange('contact', 'address', e.target.value)}
                                rows={3}
                                className="w-full p-3 rounded-lg bg-white dark:bg-black/20 border border-cla-border dark:border-white/10 text-cla-text dark:text-white focus:border-cla-gold outline-none"
                            />
                        </div>
                    </div>
                )}

                {(activeTab === 'privacy' || activeTab === 'terms') && (
                    <div>
                        <label className="block text-sm font-medium text-cla-text dark:text-gray-300 mb-2">
                            {activeTab === 'privacy' ? 'Privacy Policy HTML' : 'Terms of Service HTML'}
                        </label>
                        <textarea
                            value={activeTab === 'privacy' ? formData.privacy : formData.terms}
                            onChange={e => handleChange(activeTab, 'content', e.target.value)}
                            rows={20}
                            className="w-full p-3 rounded-lg bg-white dark:bg-black/20 border border-cla-border dark:border-white/10 text-cla-text dark:text-white focus:border-cla-gold outline-none font-mono text-sm"
                        />
                        <p className="mt-2 text-xs text-cla-text-muted dark:text-gray-500">
                            Supports basic HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
