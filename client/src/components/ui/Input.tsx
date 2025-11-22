import React, { InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, fullWidth = false, className = '', ...props }, ref) => {
        const wrapperClasses = ['input-wrapper', fullWidth && 'input-full-width']
            .filter(Boolean)
            .join(' ');

        const inputClasses = ['input', icon && 'input-with-icon', error && 'input-error', className]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={wrapperClasses}>
                {label && <label className="input-label">{label}</label>}
                <div className="input-container">
                    {icon && <span className="input-icon">{icon}</span>}
                    <input ref={ref} className={inputClasses} {...props} />
                </div>
                {error && <span className="input-error-message">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
