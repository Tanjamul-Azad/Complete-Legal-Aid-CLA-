import React from 'react';
import { BackButton } from '../BackButton';
import type { Page } from '../../types';
import { BriefcaseIcon, MapPinIcon, ClockIcon } from '../icons';

export const CareersPage: React.FC<{ setCurrentPage: (page: Page) => void; }> = ({ setCurrentPage }) => {
    const jobs = [
        {
            id: 1,
            title: 'Senior Legal Consultant',
            department: 'Legal',
            location: 'Dhaka, Bangladesh',
            type: 'Full-time',
            description: 'We are looking for an experienced legal consultant to lead our civil law division.'
        },
        {
            id: 2,
            title: 'Frontend Developer',
            department: 'Engineering',
            location: 'Remote / Dhaka',
            type: 'Full-time',
            description: 'Join our tech team to build the future of legal tech in Bangladesh using React and modern web technologies.'
        },
        {
            id: 3,
            title: 'Customer Support Specialist',
            department: 'Operations',
            location: 'Dhaka, Bangladesh',
            type: 'Part-time',
            description: 'Help our users navigate the platform and ensure they get the legal help they need.'
        }
    ];

    return (
        <div className="min-h-screen bg-cla-bg dark:bg-cla-bg-dark animate-fade-in pb-12">
            <div className="bg-cla-header-bg dark:bg-[#050816] py-16 mb-12 border-b border-cla-border dark:border-white/5">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <BackButton setCurrentPage={setCurrentPage} targetPage="home" className="mb-8 text-cla-text-muted hover:text-cla-gold" />
                    <h1 className="text-4xl md:text-5xl font-bold text-cla-text dark:text-white mb-6">
                        Join Our Mission
                    </h1>
                    <p className="text-xl text-cla-text-muted dark:text-gray-400 max-w-2xl">
                        Help us democratize legal access in Bangladesh. We're building a team of passionate individuals committed to making justice accessible for everyone.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="grid gap-6">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white dark:bg-cla-surface-dark p-6 rounded-xl shadow-sm border border-cla-border dark:border-white/5 hover:border-cla-gold/50 transition-colors group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-cla-text dark:text-white group-hover:text-cla-gold transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-cla-text-muted dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <BriefcaseIcon className="w-4 h-4" /> {job.department}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPinIcon className="w-4 h-4" /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ClockIcon className="w-4 h-4" /> {job.type}
                                        </span>
                                    </div>
                                    <p className="mt-4 text-gray-600 dark:text-gray-300">{job.description}</p>
                                </div>
                                <button className="px-6 py-2 bg-cla-gold/10 text-cla-gold font-semibold rounded-lg hover:bg-cla-gold hover:text-white transition-all whitespace-nowrap">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-gray-50 dark:bg-white/5 rounded-2xl p-12">
                    <h2 className="text-2xl font-bold text-cla-text dark:text-white mb-4">Don't see the right role?</h2>
                    <p className="text-cla-text-muted dark:text-gray-400 mb-8">
                        We're always looking for talented people. Send your CV to careers@cla-bangladesh.com
                    </p>
                    <a href="mailto:careers@cla-bangladesh.com" className="inline-block px-8 py-3 bg-cla-text dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-90 transition-opacity">
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
};
