import React, { useContext } from 'react';
import type { Page } from '../../types';
import { AppContext } from '../../context/AppContext';
import { BackButton } from '../ui/BackButton';
import { ScaleIcon, UserGroupIcon, ShieldCheckIcon } from '../ui/icons';

export const AboutPage: React.FC<{ setCurrentPage: (page: Page) => void; }> = ({ setCurrentPage }) => {
    const context = useContext(AppContext);
    const { siteContent } = context || {};

    return (
        <div className="min-h-screen bg-cla-bg dark:bg-cla-bg-dark animate-fade-in pb-12">
            {/* Hero Section */}
            <div className="bg-cla-header-bg dark:bg-[#050816] py-16 md:py-24 border-b border-cla-border dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-cla-gold/5 skew-x-12 transform origin-top-right pointer-events-none"></div>
                <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
                    <BackButton setCurrentPage={setCurrentPage} targetPage="home" className="mb-8 text-cla-text-muted hover:text-cla-gold" />
                    <h1 className="text-4xl md:text-6xl font-bold text-cla-text dark:text-white mb-6 leading-tight">
                        Justice for Everyone,<br />
                        <span className="text-cla-gold">Anytime.</span>
                    </h1>
                    <p className="text-xl text-cla-text-muted dark:text-gray-400 max-w-2xl leading-relaxed">
                        We are dedicated to bridging the gap between citizens and the legal system in Bangladesh, leveraging technology to make justice accessible, transparent, and affordable for all.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-6 max-w-[1200px] -mt-10 relative z-20 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-cla-surface-dark p-8 rounded-xl shadow-lg border border-cla-border dark:border-white/5 text-center">
                        <div className="text-4xl font-bold text-cla-gold mb-2">500+</div>
                        <div className="text-cla-text-muted dark:text-gray-400 font-medium">Verified Lawyers</div>
                    </div>
                    <div className="bg-white dark:bg-cla-surface-dark p-8 rounded-xl shadow-lg border border-cla-border dark:border-white/5 text-center">
                        <div className="text-4xl font-bold text-cla-gold mb-2">10k+</div>
                        <div className="text-cla-text-muted dark:text-gray-400 font-medium">Cases Resolved</div>
                    </div>
                    <div className="bg-white dark:bg-cla-surface-dark p-8 rounded-xl shadow-lg border border-cla-border dark:border-white/5 text-center">
                        <div className="text-4xl font-bold text-cla-gold mb-2">24/7</div>
                        <div className="text-cla-text-muted dark:text-gray-400 font-medium">AI Support</div>
                    </div>
                </div>
            </div>

            {/* Mission, Vision, Values */}
            <div className="container mx-auto px-6 max-w-[1200px] mb-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-cla-surface-dark p-8 rounded-2xl shadow-sm border border-cla-border dark:border-white/5 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                            <ScaleIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-cla-text dark:text-white mb-4">Our Mission</h3>
                        <p className="text-cla-text-muted dark:text-gray-400 leading-relaxed">
                            {siteContent?.about.mission || "To empower every citizen with the legal resources and support they need to navigate the complexities of the judicial system with confidence and ease."}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-cla-surface-dark p-8 rounded-2xl shadow-sm border border-cla-border dark:border-white/5 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                            <UserGroupIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-cla-text dark:text-white mb-4">Our Vision</h3>
                        <p className="text-cla-text-muted dark:text-gray-400 leading-relaxed">
                            {siteContent?.about.vision || "To create a digitally-integrated legal ecosystem in Bangladesh where finding legal help is as simple, transparent, and reliable as any modern digital service."}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-cla-surface-dark p-8 rounded-2xl shadow-sm border border-cla-border dark:border-white/5 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                            <ShieldCheckIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-cla-text dark:text-white mb-4">Our Values</h3>
                        <p className="text-cla-text-muted dark:text-gray-400 leading-relaxed">
                            {siteContent?.about.values || "Integrity, Accessibility, and Innovation. We believe in a justice system that is fair, open, and accessible to everyone, regardless of their background or financial status."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};