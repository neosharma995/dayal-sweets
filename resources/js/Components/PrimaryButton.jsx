import React from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={`dayal-btn dayal-btn--primary ${className}`.trim()}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
