import React, { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Reusable Outlets & Stores Section Component ("Premium Outlets")
 * Fetches dynamic outlets from seeded database / Inertia shared props
 */
function normalizeOutlet(item) {
    if (!item) return null;
    const isComingSoon = Boolean(
        item.is_coming_soon ||
        item.isComingSoon ||
        item.status === 'coming_soon'
    );
    return {
        id: item.id || item.slug || item.name,
        slug: item.slug,
        name: item.name,
        subtitle: item.subtitle,
        address: item.address,
        city: item.city,
        state: item.state,
        pincode: item.pincode,
        phone: item.phone,
        phoneRaw: item.phone_raw || item.phoneRaw || item.phone?.replace(/\s+/g, ''),
        whatsapp: item.whatsapp,
        whatsappRaw: item.whatsapp_raw || item.whatsappRaw || '918062757395',
        timings: item.timings,
        image: item.image_url || item.image,
        mapUrl: item.map_url || item.mapUrl || item.map,
        isComingSoon,
        expected: item.expected || 'Expected Opening',
        expectedSub: item.expectedSub || (item.expected_opening
            ? item.expected_opening.replace(/Expected Opening\s*/i, '')
            : 'Coming Soon'),
    };
}

export default function Outlets({
    eyebrow = 'VIEW OUR STORES',
    title = 'Premium',
    highlightTitle = 'Outlets',
    subtitle = 'Visit our premium outlets across Himachal Pradesh and experience the authentic taste of tradition, craftsmanship, and celebration.',
    outlets: initialOutlets = null,
}) {
    const pageProps = usePage()?.props || {};
    const sharedOutlets = pageProps.outlets || null;

    const [fetchedOutlets, setFetchedOutlets] = useState(null);
    const [activeDot, setActiveDot] = useState(0);
    const trackRef = useRef(null);

    const hasFullDetails = (arr) =>
        Array.isArray(arr) &&
        arr.length > 0 &&
        arr.some((o) => Boolean(o.image || o.image_url || o.address || o.phone));

    // Determine current raw outlets source
    const rawList = hasFullDetails(initialOutlets)
        ? initialOutlets
        : hasFullDetails(fetchedOutlets)
            ? fetchedOutlets
            : hasFullDetails(sharedOutlets)
                ? sharedOutlets
                : (initialOutlets || sharedOutlets || fetchedOutlets || []);

    // Fetch dynamic outlets from public API if not provided with full details in props
    useEffect(() => {
        if (!hasFullDetails(initialOutlets) && !hasFullDetails(sharedOutlets)) {
            fetch('/api/outlets', { headers: { Accept: 'application/json' } })
                .then((res) => (res.ok ? res.json() : null))
                .then((json) => {
                    if (json?.data && Array.isArray(json.data)) {
                        setFetchedOutlets(json.data);
                    }
                })
                .catch((err) => {
                    console.error('Failed to fetch dynamic outlets:', err);
                });
        }
    }, [initialOutlets, sharedOutlets]);

    const list = rawList.map(normalizeOutlet).filter(Boolean);

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
                        {title} <span className="dayal-highlight">{highlightTitle}</span>
                    </h2>
                    {subtitle && <p className="dayal-outlets-subtitle">{subtitle}</p>}
                </header>

                {/* Outlets Slider / Grid Wrapper */}
                <div className="dayal-outlets-slider-wrapper">
                    <div className="dayal-outlets-track-container">
                        <div
                            className="dayal-outlets-track"
                            ref={trackRef}
                            onScroll={handleScroll}
                        >
                            {list.map((outlet) => {
                                if (outlet.isComingSoon || outlet.comingSoon) {
                                    return (
                                        <article
                                            key={outlet.id || outlet.name}
                                            className="dayal-outlet-card dayal-outlet-card-coming-soon"
                                        >
                                            <div className="dayal-outlet-card-img-wrap dayal-outlet-card-media-coming-soon">
                                                <div className="dayal-outlet-card-ribbon">
                                                    Coming Soon
                                                </div>
                                                <img
                                                    src={outlet.image}
                                                    alt={`${outlet.name} Architectural Rendering`}
                                                    className="dayal-outlet-card-img"
                                                    loading="lazy"
                                                />
                                            </div>

                                            <div className="dayal-outlet-card-content dayal-outlet-card-body-coming-soon">
                                                <h3 className="dayal-outlet-card-title">
                                                    {outlet.name}
                                                </h3>
                                                <div className="dayal-outlet-card-opening-soon">
                                                    {outlet.subtitle || 'Opening Soon'}
                                                </div>

                                                {/* Laurel Wreath Badge */}
                                                <div className="dayal-outlet-laurel-badge">
                                                    <img
                                                        src="/uploads/2026/09/Group-14.png"
                                                        alt=""
                                                        className="dayal-outlet-laurel-leaf dayal-outlet-laurel-left"
                                                        aria-hidden="true"
                                                    />
                                                    <div className="dayal-outlet-laurel-text">
                                                        <span className="dayal-outlet-laurel-label">
                                                            {outlet.expected || 'Expected Opening'}
                                                        </span>
                                                        <strong className="dayal-outlet-laurel-val">
                                                            {outlet.expectedSub || 'Coming Soon'}
                                                        </strong>
                                                    </div>
                                                    <img
                                                        src="/uploads/2026/09/Group-15.png"
                                                        alt=""
                                                        className="dayal-outlet-laurel-leaf dayal-outlet-laurel-right"
                                                        aria-hidden="true"
                                                    />
                                                </div>

                                                <div className="dayal-outlet-card-notify-action">
                                                    <button
                                                        type="button"
                                                        className="dayal-outlet-notify-btn"
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
                                        className="dayal-outlet-card"
                                    >
                                        <div className="dayal-outlet-card-img-wrap">
                                            <img
                                                src={outlet.image}
                                                alt={`Dayal Sweets ${outlet.name} Outlet`}
                                                className="dayal-outlet-card-img"
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="dayal-outlet-card-content">
                                            <h3 className="dayal-outlet-card-title">{outlet.name}</h3>

                                            {outlet.address && (
                                                <div className="dayal-outlet-card-row">
                                                    <span className="dayal-outlet-card-icon" aria-hidden="true">
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
                                                <div className="dayal-outlet-card-row">
                                                    <span className="dayal-outlet-card-icon" aria-hidden="true">
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
                                                        className="dayal-outlet-card-link"
                                                    >
                                                        {outlet.phone}
                                                    </a>
                                                </div>
                                            )}

                                            {outlet.whatsapp && (
                                                <div className="dayal-outlet-card-row">
                                                    <span className="dayal-outlet-card-icon" aria-hidden="true">
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
                                                            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.78 14.07c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.15.11-3.72-.95-3.28-1.36-5.4-4.69-5.56-4.91-.16-.22-1.33-1.77-1.33-3.38 0-1.61.84-2.4 1.14-2.73.3-.33.65-.41.87-.41.22 0 .43 0 .62.01.2.01.47-.08.73.55.27.65.92 2.25 1 2.42.08.16.13.36.03.57-.11.22-.16.36-.32.55-.16.19-.34.42-.48.56-.16.16-.33.33-.14.65.19.33.84 1.39 1.81 2.25 1.25 1.11 2.3 1.45 2.63 1.61.33.16.52.14.71-.08.19-.22.82-.95 1.04-1.28.22-.33.43-.27.73-.16.3.11 1.91.9 2.24 1.06.33.16.55.24.63.38.08.14.08.82-.16 1.5z" />
                                                        </svg>
                                                    </span>
                                                    <a
                                                        href={`https://wa.me/${outlet.whatsappRaw || '918062757395'}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="dayal-outlet-card-link"
                                                    >
                                                        {outlet.whatsapp}
                                                    </a>
                                                </div>
                                            )}

                                            {(outlet.map || outlet.mapUrl) && (
                                                <div className="dayal-outlet-card-map-action">
                                                    <a
                                                        href={outlet.map || outlet.mapUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="dayal-outlet-view-map-link"
                                                    >
                                                        <span>View Map</span>
                                                        <span className="dayal-outlet-arrow-icon" aria-hidden="true">
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
                    <div className="dayal-outlets-dots-wrapper" role="tablist" aria-label="Outlet pagination">
                        {list.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`dayal-outlet-dot ${activeDot === i ? 'active' : ''}`}
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
