import React from 'react';

export default function ApplicationLogo({ showText = true, className = '' }) {
    return (
        <div className={`dayal-logo-container ${className}`}>
            {/* Traditional Himachali Crest Emblem */}
            <div className="dayal-logo-emblem-wrap">
                <div className="dayal-logo-circle">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Golden Radiance Aura */}
                        <circle cx="50" cy="50" r="46" fill="#FDF8ED" stroke="#C5A059" strokeWidth="2" strokeDasharray="3 2" />
                        
                        {/* Himachali Cap Crown */}
                        <path d="M22 42 C22 28, 78 28, 78 42 L82 50 C82 52, 18 52, 18 50 Z" fill="#2E4A28" />
                        <path d="M25 43 C35 32, 65 32, 75 43" stroke="#C5A059" strokeWidth="2" fill="none" />
                        
                        {/* Velvet Green/Red Band */}
                        <path d="M20 48 L80 48 L78 54 L22 54 Z" fill="#7D1D2B" />
                        
                        {/* Traditional Devanagari 'द' Glyph */}
                        <text
                            x="50"
                            y="82"
                            textAnchor="middle"
                            fontFamily="Georgia, serif"
                            fontWeight="900"
                            fontSize="32"
                            fill="#631826"
                        >
                            द
                        </text>
                    </svg>
                </div>
            </div>

            {/* Typography */}
            {showText && (
                <div className="dayal-logo-text">
                    <span className="dayal-logo-name">
                        DAYAL SWEETS
                    </span>
                    <span className="dayal-logo-sub">
                        Trust. Tradition. Taste.
                    </span>
                </div>
            )}
        </div>
    );
}
