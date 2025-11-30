import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    subtext?: string;
    onClick?: () => void;
    className?: string;
    iconColorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, subtext, onClick, className = '', iconColorClass }) => {
    return (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden group
                bg-white dark:bg-cla-surface-dark 
                p-6 rounded-2xl 
                border border-cla-border dark:border-cla-border-dark 
                shadow-sm hover:shadow-gold-soft dark:hover:shadow-gold-soft-sm
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:border-cla-gold/30 dark:hover:border-cla-gold/30
                cursor-pointer
                ${className}
            `}
        >
            {/* Shade Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cla-gold/5 to-cla-gold/20 dark:from-white/5 dark:to-white/10 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110 pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-cla-text-muted dark:text-cla-text-muted-dark mb-2">
                            {label}
                        </p>
                        <h3 className="text-3xl font-bold text-cla-text dark:text-white tracking-tight">
                            {value}
                        </h3>
                    </div>
                    <div className={`p-3 rounded-xl transition-colors duration-300 shadow-sm ${iconColorClass ? iconColorClass : 'bg-cla-gold/10 text-cla-gold group-hover:bg-cla-gold group-hover:text-white'}`}>
                        {icon}
                    </div>
                </div>

                {subtext && (
                    <div className="mt-4 pt-4 border-t border-cla-border/50 dark:border-white/5">
                        <p className="text-xs font-medium text-cla-text-muted dark:text-cla-text-muted-dark group-hover:text-cla-gold/80 transition-colors">
                            {subtext}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const DashboardCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
    <div
        onClick={onClick}
        className={`
            relative overflow-hidden group
            bg-white dark:bg-cla-surface-dark 
            rounded-2xl 
            border border-cla-border dark:border-cla-border-dark 
            shadow-sm hover:shadow-gold-soft dark:hover:shadow-gold-soft-sm
            transition-all duration-300 ease-out
            hover:border-cla-gold/30 dark:hover:border-cla-gold/30
            ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
            ${className}
        `}
    >
        {/* Shade Effect */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cla-gold/5 to-cla-gold/20 dark:from-white/5 dark:to-white/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-110 pointer-events-none" />

        <div className="relative z-10 h-full">
            {children}
        </div>
    </div>
);
