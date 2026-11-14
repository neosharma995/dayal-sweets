import React from 'react';

export default function ApplicationLogo({ className = 'w-11 h-11', showText = true }) {
    return (
        <div className="flex items-center gap-3 select-none">
            {/* Traditional Himachali Crest Emblem */}
            <div className="relative flex-shrink-0">
                <div className={`${className} rounded-full bg-gradient-to-b from-amber-100 via-amber-50 to-amber-200 border-2 border-amber-600/40 shadow-sm flex items-center justify-center p-1 relative overflow-hidden`}>
                    {/* Himachali Cap & Feather Crest SVG */}
                    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <div className="text-left">
                    <span className="font-serif font-extrabold text-xl sm:text-2xl tracking-wider text-[#631826] block leading-none">
                        DAYAL SWEETS
                    </span>
                    <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-semibold text-[#B88E4B] block mt-1">
                        Trust. Tradition. Taste.
                    </span>
                </div>
            )}
        </div>
    );
}
