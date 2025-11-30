import React from 'react';
import { VerifiedIcon } from '../icons';

interface VerifiedNameProps {
    name: string;
    isVerified?: boolean;
    className?: string;
    iconClassName?: string;
    gapClassName?: string;
}

export const VerifiedName: React.FC<VerifiedNameProps> = ({
    name,
    isVerified = false,
    className = '',
    iconClassName = 'w-4 h-4 text-gray-400',
    gapClassName = 'gap-1'
}) => {
    return (
        <span className={`inline-flex items-center ${gapClassName} ${className}`}>
            <span className="truncate">{name}</span>
            {isVerified && <VerifiedIcon className={iconClassName} />}
        </span>
    );
};
