import React from 'react';

export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={`dayal-btn dayal-btn--danger ${className}`.trim()}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
