import React, { useState, useContext } from 'react';
import type { Page } from '../../types';
import { AppContext } from '../../context/AppContext';
import { BackButton } from '../ui/BackButton';
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon, RobotIcon } from '../ui/icons';

export const ContactPage: React.FC<{ setCurrentPage: (page: Page) => void; }> = ({ setCurrentPage }) => {
    const context = useContext(AppContext);
    const { siteContent, setChatOpen, addSupportMessage } = context || {};

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (addSupportMessage) {
            addSupportMessage(formData);
            alert('Message sent! We will get back to you shortly.');
            setFormData({ name: '', email: '', message: '' });
        }
    };

    return (
        <div className="min-h-screen bg-cla-bg dark:bg-cla-bg-dark animate-fade-in pb-12">
            {/* Hero Section */}
            <div className="bg-cla-header-bg dark:bg-[#050816] py-16 md:py-24 border-b border-cla-border dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-cla-gold/5 skew-x-12 transform origin-top-right pointer-events-none"></div>
                <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
                    <BackButton setCurrentPage={setCurrentPage} targetPage="home" className="mb-8 text-cla-text-muted hover:text-cla-gold" />
                    <h1 className="text-4xl md:text-6xl font-bold text-cla-text dark:text-white mb-6 leading-tight">
                        Get in <span className="text-cla-gold">Touch</span>
                    </h1>
                    <p className="text-xl text-cla-text-muted dark:text-gray-400 max-w-2xl leading-relaxed">
                        Have questions about our services or need legal assistance? We're here to help you 24/7.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-[1200px] -mt-10 relative z-20 mb-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Contact Cards */}
                        <div className="bg-white dark:bg-cla-surface-dark p-6 rounded-xl shadow-sm border border-cla-border dark:border-white/5 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                    <MailIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-cla-text dark:text-white mb-1">Email Us</h3>
                                    <p className="text-sm text-cla-text-muted dark:text-gray-400 mb-2">For general inquiries</p>
                                    <a href={`mailto:${siteContent?.contact.email}`} className="text-cla-gold hover:underline font-medium">{siteContent?.contact.email || 'support@cla-bangladesh.com'}</a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-cla-surface-dark p-6 rounded-xl shadow-sm border border-cla-border dark:border-white/5 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                                    <PhoneIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-cla-text dark:text-white mb-1">Call Us</h3>
                                    <p className="text-sm text-cla-text-muted dark:text-gray-400 mb-2">Mon-Fri from 9am to 6pm</p>
                                    <a href={`tel:${siteContent?.contact.phone}`} className="text-cla-gold hover:underline font-medium">{siteContent?.contact.phone || '+880 1234 567 890'}</a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-cla-surface-dark p-6 rounded-xl shadow-sm border border-cla-border dark:border-white/5 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                    <MapPinIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-cla-text dark:text-white mb-1">Visit Us</h3>
                                    <p className="text-sm text-cla-text-muted dark:text-gray-400 mb-2">Our main office</p>
                                    <p className="text-cla-text dark:text-gray-300 font-medium">{siteContent?.contact.address || '123 Justice Avenue, Dhaka, Bangladesh'}</p>
                                </div>
                            </div>
                        </div>

                        {/* AI Assistant Promo */}
                        <div className="bg-gradient-to-br from-cla-gold/10 to-cla-gold/5 p-6 rounded-xl border border-cla-gold/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-cla-gold text-cla-text rounded-lg">
                                    <RobotIcon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-cla-text dark:text-white">Need instant help?</h3>
                            </div>
                            <p className="text-sm text-cla-text-muted dark:text-gray-400 mb-4">Our AI Legal Assistant is available 24/7 to answer your questions.</p>
                            <button onClick={() => setChatOpen?.(true)} className="w-full py-2 bg-cla-gold text-cla-text font-bold rounded-lg hover:bg-cla-gold-darker transition-colors text-sm">
                                Chat with AI Assistant
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-cla-surface-dark p-8 rounded-2xl shadow-lg border border-cla-border dark:border-white/5">
                            <h2 className="text-2xl font-bold text-cla-text dark:text-white mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-cla-text dark:text-gray-300 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-cla-border dark:border-white/10 text-cla-text dark:text-white focus:border-cla-gold outline-none transition-colors"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-cla-text dark:text-gray-300 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-cla-border dark:border-white/10 text-cla-text dark:text-white focus:border-cla-gold outline-none transition-colors"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-cla-text dark:text-gray-300 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        rows={6}
                                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-cla-border dark:border-white/10 text-cla-text dark:text-white focus:border-cla-gold outline-none transition-colors"
                                        placeholder="How can we help you?"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full md:w-auto px-8 py-3 bg-cla-gold text-cla-text font-bold rounded-lg hover:bg-cla-gold-darker transition-colors flex items-center justify-center gap-2">
                                    <SendIcon className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};