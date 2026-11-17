import React, { useState, useRef } from 'react';
import { outletsList as defaultOutlets } from '@/data/outletsData';

/**
 * Reusable Outlets & Stores Section Component ("Premium Outlets")
 * Matches Dayal Sweets 1720px Design System & Reference Layout
 */
export default function Outlets({
    eyebrow = 'VIEW OUR STORES',
    title = 'Premium',
    highlightTitle = 'Outlets',
    subtitle = 'Visit our premium outlets across Himachal Pradesh and experience the authentic taste of tradition, craftsmanship, and celebration.',
    outlets = defaultOutlets,
}) {
    const list = outlets && outlets.length > 0 ? outlets : defaultOutlets;
    const [activeDot, setActiveDot] = useState(0);
    const trackRef = useRef(null);

    const handleScroll = () => {
        if (!trackRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (maxScroll <= 0) return;
        const progress = scrollLeft / maxScroll;
        const dotIndex = Math.min(list.length - 1, Math.round(progress * (list.length - 1)));
        setActiveDot(dotIndex);
    };

    const scrollToCard = (index) => {
        if (!trackRef.current) return;
        const cards = trackRef.current.children;
        if (cards[index]) {
            cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            setActiveDot(index);
        }
    };

    const handleNotifyMe = (outletName) => {
        alert(`Thank you for your interest in our ${outletName} outlet! We will notify you once doors open.`);
    };

    return (
        <section className="dayal-outlets-section" aria-label="Premium Outlets">
            <div className="dayal-outlets-container">
                {/* Section Header */}
                <header className="dayal-outlets-header">
                    <span className="dayal-outlets-tag">{eyebrow}</span>
                    <h2 className="dayal-outlets-title">
                        {title} <span className="rt-span-color">{highlightTitle}</span>
                    </h2>
                    {subtitle && <p className="dayal-outlets-subtitle">{subtitle}</p>}
                </header>

                {/* Outlets Slider / Grid Wrapper */}
                <div className="oto-outlets-slider-wrapper">
                    <div className="oto-outlets-track-container">
                        <div
                            className="oto-outlets-track"
                            ref={trackRef}
                            onScroll={handleScroll}
                        >
                            {list.map((outlet) => {
                                if (outlet.isComingSoon || outlet.comingSoon) {
                                    return (
                                        <article
                                            key={outlet.id || outlet.name}
                                            className="oto-outlet-card oto-coming-soon-card"
                                        >
                                            <div className="oto-outlet-card-img-wrap oto-coming-soon-media">
                                                <div className="oto-coming-soon-ribbon">
                                                    Coming Soon
                                                </div>
                                                <img
                                                    src={outlet.image}
                                                    alt={`${outlet.name} Storefront Architectural Rendering`}
                                                    className="oto-outlet-card-img"
                                                    loading="lazy"
                                                />
                                            </div>

                                            <div className="oto-outlet-card-content oto-coming-soon-body">
                                                <h3 className="oto-outlet-card-title">
                                                    {outlet.name}
                                                </h3>
                                                <div className="oto-opening-soon-text">
                                                    {outlet.subtitle || 'Opening Soon'}
                                                </div>

                                                {/* Laurel Wreath Badge */}
                                                <div className="oto-laurel-badge">
                                                    <img
                                                        src="/uploads/2026/09/Group-14.png"
                                                        alt=""
                                                        className="oto-laurel-leaf oto-laurel-left"
                                                        aria-hidden="true"
                                                    />
                                                    <div className="oto-laurel-text">
                                                        <span className="oto-laurel-label">
                                                            {outlet.expected || 'Expected Opening'}
                                                        </span>
                                                        <strong className="oto-laurel-val">
                                                            {outlet.expectedSub || 'Coming Soon'}
                                                        </strong>
                                                    </div>
                                                    <img
                                                        src="/uploads/2026/09/Group-15.png"
                                                        alt=""
                                                        className="oto-laurel-leaf oto-laurel-right"
                                                        aria-hidden="true"
                                                    />
                                                </div>

                                                <div className="oto-outlet-card-notify-action">
                                                    <button
                                                        type="button"
                                                        className="oto-notify-btn"
                                                        onClick={() => handleNotifyMe(outlet.name)}
                                                        aria-label={`Notify me when ${outlet.name} outlet opens`}
                                                    >
                                                        <svg
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                                        </svg>
                                                        <span>Notify Me</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                }

                                return (
                                    <article
                                        key={outlet.id || outlet.name}
                                        className="oto-outlet-card"
                                    >
                                        <div className="oto-outlet-card-img-wrap">
                                            <img
                                                src={outlet.image}
                                                alt={`Dayal Sweets ${outlet.name} Storefront`}
                                                className="oto-outlet-card-img"
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="oto-outlet-card-content">
                                            <h3 className="oto-outlet-card-title">{outlet.name}</h3>

                                            {outlet.address && (
                                                <div className="oto-outlet-card-row">
                                                    <span className="oto-card-icon" aria-hidden="true">
                                                        <svg
                                                            width="15"
                                                            height="15"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="#7B1C2E"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                            <circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                    </span>
                                                    <span>{outlet.address}</span>
                                                </div>
                                            )}

                                            {outlet.phone && (
                                                <div className="oto-outlet-card-row">
                                                    <span className="oto-card-icon" aria-hidden="true">
                                                        <svg
                                                            width="15"
                                                            height="15"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="#7B1C2E"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                        </svg>
                                                    </span>
                                                    <a
                                                        href={`tel:${outlet.phoneRaw || outlet.phone.replace(/\s+/g, '')}`}
                                                        className="oto-card-link"
                                                    >
                                                        {outlet.phone}
                                                    </a>
                                                </div>
                                            )}

                                            {outlet.whatsapp && (
                                                <div className="oto-outlet-card-row">
                                                    <span className="oto-card-icon" aria-hidden="true">
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
                                                            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.78 14.07c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.15.11-3.72-.95-3.28-1.36-5.4-4.69-5.56-4.91-.16-.22-1.33-1.77-1.33-3.38 0-1.61.84-2.4 1.14-2.73.3-.33.65-.41.87-.41.22 0 .43 0 .62.01.2.01.47-.08.73.55.27.65.92 2.25 1 2.42.08.16.13.36.03.57-.11.22-.16.36-.32.55-.16.19-.34.42-.48.56-.16.16-.33.33-.14.65.19.33.84 1.39 1.81 2.25 1.25 1.11 2.3 1.45 2.63 1.61.33.16.52.14.71-.08.19-.22.82-.95 1.04-1.28.22-.33.43-.27.73-.16.3.11 1.91.9 2.24 1.06.33.16.55.24.63.38.08.14.08.82-.16 1.5z" />
                                                        </svg>
                                                    </span>
                                                    <a
                                                        href={`https://wa.me/${outlet.whatsappRaw || '918062757395'}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="oto-card-link"
                                                    >
                                                        {outlet.whatsapp}
                                                    </a>
                                                </div>
                                            )}

                                            {(outlet.map || outlet.mapUrl) && (
                                                <div className="oto-outlet-card-map-action">
                                                    <a
                                                        href={outlet.map || outlet.mapUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="oto-view-map-link"
                                                    >
                                                        <span>View Map</span>
                                                        <span className="oto-arrow-icon" aria-hidden="true">
                                                            ↗
                                                        </span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dot navigation for mobile */}
                    <div className="oto-outlets-dots-wrapper" role="tablist" aria-label="Outlet pagination">
                        {list.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`oto-outlet-dot ${activeDot === i ? 'active' : ''}`}
                                onClick={() => scrollToCard(i)}
                                aria-label={`Go to outlet ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
