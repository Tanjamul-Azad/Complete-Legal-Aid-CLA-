import React from 'react';
import { CheckIcon } from '../icons';

export const PasswordStrengthMeter: React.FC<{ strength: number; password: string; }> = ({ strength, password }) => (
    <div className="mt-2 space-y-2">
        <div className="flex items-center space-x-2">
            <div className={`w-1/3 h-1.5 rounded-full ${strength > 0 ? 'bg-cla-gold' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`w-1/3 h-1.5 rounded-full ${strength > 1 ? 'bg-cla-gold' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`w-1/3 h-1.5 rounded-full ${strength > 2 ? 'bg-cla-gold' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        </div>
         <div className="text-xs space-y-1 text-cla-text-muted dark:text-cla-text-muted-dark">
            <p className={`flex items-center ${password.length >= 6 ? 'text-green-500' : ''}`}><CheckIcon className="w-4 h-4 mr-1"/> At least 6 characters</p>
            <p className={`flex items-center ${/(?=.*[a-zA-Z])/.test(password) ? 'text-green-500' : ''}`}><CheckIcon className="w-4 h-4 mr-1"/> Contains letters</p>
            <p className={`flex items-center ${password.length >= 8 ? 'text-green-500' : ''}`}><CheckIcon className="w-4 h-4 mr-1"/> 8+ characters (recommended)</p>
        </div>
    </div>
);
