import React from 'react';

export const Card = ({ children, className }) => {
    return (
        <div className={`border border-gray-300 p-4 rounded-lg shadow-sm ${className}`}>
            {children}
        </div>
    );
};

export const CardContent = ({ children }) => {
    return (
        <div className="text-gray-700">
            {children}
        </div>
    );
};
