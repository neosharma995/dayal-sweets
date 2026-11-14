import React from 'react';

export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={`dayal-input-error ${className}`.trim()}
        >
            {message}
        </p>
    ) : null;
}
