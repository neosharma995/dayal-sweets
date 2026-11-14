import React from 'react';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={`dayal-checkbox ${className}`.trim()}
        />
    );
}
