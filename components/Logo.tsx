import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-auto h-10" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 160 40"
            fill="none"
            className={`flex-shrink-0 transition-colors duration-300 ${className}`}
            aria-label="Complete Legal Aid Logo"
        >
            {/* Icon: Temple of Justice */}
            <g transform="translate(0, 2)">
                {/* Base */}
                <rect x="2" y="32" width="36" height="4" rx="1" fill="#F59E0B" />
                <rect x="0" y="36" width="40" height="2" rx="1" fill="#F59E0B" />

                {/* Columns */}
                <rect x="6" y="12" width="4" height="20" rx="1" fill="#F59E0B" />
                <rect x="18" y="12" width="4" height="20" rx="1" fill="#F59E0B" />
                <rect x="30" y="12" width="4" height="20" rx="1" fill="#F59E0B" />

                {/* Roof */}
                <path d="M2 12H38L20 2L2 12Z" fill="#F59E0B" />
            </g>

            {/* Text: CLA */}
            <text x="50" y="30" fontSize="28" fontWeight="800" fontFamily="serif" letterSpacing="1" fill="currentColor" className="text-slate-900 dark:text-white">CLA</text>

            {/* Subtext: Complete Legal Aid (Optional, maybe too small) */}
            {/* Let's stick to just CLA for the main logo to keep it clean */}
        </svg>
    );
};