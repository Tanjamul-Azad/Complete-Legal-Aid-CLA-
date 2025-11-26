import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 dark:bg-[#0A0A0A] border-t border-cla-border dark:border-white/5 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Brand & About */}
                    <div className="md:col-span-2">
                        <div className="mb-6">
                            {/* Sized slightly larger for the footer */}
                            <Logo className="w-32 h-32" />
                        </div>
                        <p className="text-cla-text-muted dark:text-gray-400 leading-relaxed mb-6 max-w-md">
                            Justice for Everyone, Anytime. We connect citizens with verified legal professionals and provide AI-powered guidance to make the legal system accessible to all in Bangladesh.
                        </p>
                        <div className="flex gap-4 text-cla-text-muted dark:text-gray-400">
                            <a href="#" className="hover:text-cla-gold transition-colors">Twitter</a>
                            <a href="#" className="hover:text-cla-gold transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-cla-gold transition-colors">Facebook</a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-cla-text dark:text-white mb-6">Services</h3>
                        <ul className="space-y-4 text-cla-text-muted dark:text-gray-400">
                            <li><a href="#" className="hover:text-cla-gold transition-colors">Find a Lawyer</a></li>
                            <li><a href="#" className="hover:text-cla-gold transition-colors">Legal Consultation</a></li>
                            <li><a href="#" className="hover:text-cla-gold transition-colors">Document Vault</a></li>
                            <li><a href="#" className="hover:text-cla-gold transition-colors">AI Legal Assistant</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Company & Support */}
                    <div>
                        <h3 className="font-bold text-cla-text dark:text-white mb-6">Company</h3>
                        <ul className="space-y-4 text-cla-text-muted dark:text-gray-400">
                            <li><a href="#" className="hover:text-cla-gold transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-cla-gold transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-cla-gold transition-colors">Contact Support</a></li>
                            <li><a href="#" className="hover:text-cla-gold transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-cla-border dark:border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-cla-text-muted dark:text-gray-400">
                    <p>© {currentYear} Complete Legal Aid. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-cla-gold transition-colors">Terms</a>
                        <a href="#" className="hover:text-cla-gold transition-colors">Privacy</a>
                        <a href="#" className="hover:text-cla-gold transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
