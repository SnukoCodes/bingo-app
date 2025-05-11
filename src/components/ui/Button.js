import React from 'react';

export const Button = ({ children, onClick, className }) => {
    return (
        <button 
            onClick={onClick} 
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${className}`}>
            {children}
        </button>
    );
};

export const Input = ({ value, onChange, placeholder, className }) => {
    return (
        <input 
            type="text" 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            className={`border border-gray-300 p-2 rounded-md ${className}`} />
    );
};