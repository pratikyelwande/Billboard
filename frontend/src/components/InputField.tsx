import React, { ChangeEvent } from 'react';

export interface InputFieldProps {
    label: string;
    type: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    autoComplete?: string;
    error?: string;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, type, name, placeholder, required = true, autoComplete, error, onChange }) => (
    <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700" htmlFor={name}>
            {label}
        </label>
        <div className="mt-1">
            <input
                className={`appearance-none block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                required={required}
                autoComplete={autoComplete}
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
);