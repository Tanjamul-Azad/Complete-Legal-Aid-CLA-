import React from 'react';
import type { Page } from '../../types';
import { BackButton } from '../BackButton';

export const LegalPage: React.FC<{
  setCurrentPage: (page: Page) => void;
  title: string;
  content: string;
}> = ({ setCurrentPage, title, content }) => (
  <div className="min-h-screen bg-cla-bg dark:bg-cla-bg-dark animate-fade-in pb-12">
    <div className="bg-cla-header-bg dark:bg-[#050816] py-12 border-b border-cla-border dark:border-white/5">
      <div className="container mx-auto px-6 max-w-[1000px]">
        <BackButton setCurrentPage={setCurrentPage} targetPage="home" className="mb-6 text-cla-text-muted hover:text-cla-gold" />
        <h1 className="text-3xl md:text-4xl font-bold text-cla-text dark:text-white">{title}</h1>
      </div>
    </div>

    <div className="container mx-auto px-6 max-w-[1000px] mt-12">
      <div className="bg-white dark:bg-cla-surface-dark p-8 md:p-12 rounded-2xl shadow-sm border border-cla-border dark:border-white/5">
        <div
          className="prose dark:prose-invert max-w-none prose-headings:text-cla-text dark:prose-headings:text-white prose-p:text-cla-text-muted dark:prose-p:text-gray-400 prose-a:text-cla-gold hover:prose-a:text-cla-gold-darker prose-strong:text-cla-text dark:prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  </div>
);
