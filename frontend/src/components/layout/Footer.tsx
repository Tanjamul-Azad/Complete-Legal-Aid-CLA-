import React, { useContext } from 'react';
import { Logo } from './Logo';
import { TwitterIcon, LinkedInIcon, FacebookIcon, MapPinIcon } from '../ui/icons';
import { AppContext } from '../../context/AppContext';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const context = useContext(AppContext);

    const handleServiceClick = (e: React.MouseEvent, service: string) => {
        e.preventDefault();
        if (!context) return;

        const { user, handleSetCurrentPage, setDashboardSubPage, goToAuth, setChatOpen } = context;

        if (service === 'ai-assistant') {
            setChatOpen(true);
            return;
        }

        // Map service to subpage
        let subPage: any = 'overview';
        if (service === 'find-lawyer') subPage = 'find-lawyers';
        else if (service === 'consultation') subPage = 'appointments';
        else if (service === 'vault') subPage = 'vault';

        setDashboardSubPage(subPage);

        if (user) {
            handleSetCurrentPage('dashboard');
        } else {
            goToAuth('login');
        }
    };

    return (
        <footer className="bg-gray-50 dark:bg-[#0A0A0A] border-t border-cla-border dark:border-white/5 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Brand & About */}
                    <div className="md:col-span-2">
                        <div className="mb-4">
                            {/* Sized slightly larger for the footer */}
                            <Logo className="w-32 h-32" />
                        </div>
                        <p className="text-cla-text-muted dark:text-gray-400 leading-relaxed mb-4 max-w-md -mt-2">
                            Justice for Everyone, Anytime. We connect citizens with verified legal professionals and provide AI-powered guidance to make the legal system accessible to all in Bangladesh.
                        </p>

                        <div className="flex items-start gap-2 text-cla-text-muted dark:text-gray-400 mb-6">
                            <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>123 Justice Avenue, Dhaka, Bangladesh</span>
                        </div>

                        <div className="flex gap-4 text-cla-text-muted dark:text-gray-400">
                            <a href="#" className="hover:text-cla-gold transition-colors" aria-label="Twitter">
                                <TwitterIcon className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-cla-gold transition-colors" aria-label="LinkedIn">
                                <LinkedInIcon className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-cla-gold transition-colors" aria-label="Facebook">
                                <FacebookIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-cla-text dark:text-white mb-6">Services</h3>
                        <ul className="space-y-4 text-cla-text-muted dark:text-gray-400">
                            <li><a href="#" onClick={(e) => handleServiceClick(e, 'find-lawyer')} className="hover:text-cla-gold transition-colors">Find a Lawyer</a></li>
                            <li><a href="#" onClick={(e) => handleServiceClick(e, 'consultation')} className="hover:text-cla-gold transition-colors">Legal Consultation</a></li>
                            <li><a href="#" onClick={(e) => handleServiceClick(e, 'vault')} className="hover:text-cla-gold transition-colors">Document Vault</a></li>
                            <li><a href="#" onClick={(e) => handleServiceClick(e, 'ai-assistant')} className="hover:text-cla-gold transition-colors">AI Legal Assistant</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Company & Support */}
                    <div>
                        <h3 className="font-bold text-cla-text dark:text-white mb-6">Company</h3>
                        <ul className="space-y-4 text-cla-text-muted dark:text-gray-400">
                            <li>
                                <button onClick={() => context?.handleSetCurrentPage('about')} className="hover:text-cla-gold transition-colors text-left">
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button onClick={() => context?.handleSetCurrentPage('careers')} className="hover:text-cla-gold transition-colors text-left">
                                    Careers
                                </button>
                            </li>
                            <li>
                                <button onClick={() => context?.handleSetCurrentPage('contact')} className="hover:text-cla-gold transition-colors text-left">
                                    Contact Support
                                </button>
                            </li>
                            <li>
                                <button onClick={() => context?.showLegalPage('Privacy Policy', 'privacy')} className="hover:text-cla-gold transition-colors text-left">
                                    Privacy Policy
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-cla-border dark:border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-cla-text-muted dark:text-gray-400">
                    <p>© {currentYear} Team Deadliners. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <button onClick={() => context?.showLegalPage('Terms of Service', 'terms')} className="hover:text-cla-gold transition-colors">Terms</button>
                        <button onClick={() => context?.showLegalPage('Privacy Policy', 'privacy')} className="hover:text-cla-gold transition-colors">Privacy</button>
                        <button onClick={() => context?.showLegalPage('Cookie Policy', 'privacy')} className="hover:text-cla-gold transition-colors">Cookies</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};
