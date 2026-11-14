import React from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={`dayal-btn dayal-btn--outline ${className}`.trim()}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
