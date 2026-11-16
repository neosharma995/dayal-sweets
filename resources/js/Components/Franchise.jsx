import React from 'react';
import { Link } from '@inertiajs/react';
import { franchiseFeatures as defaultFeatures } from '@/data/outletsData';

/**
 * Franchise Opportunities Section Component
 * Rendered directly on the homepage as its own dedicated section
 */
export default function Franchise({
    tag = '— FRANCHISE OPPORTUNITIES —',
    title = 'Own A Premium',
    highlightTitle = 'Dayal Sweets Outlet',
    description = 'With 60+ years of trust, premium products, and a loyal customer base, Dayal Sweets offers the perfect opportunity to build a successful business in your city.',
    phone = '+91 98765 43210',
    phoneLink = 'tel:+919876543210',
    whatsapp = '+91 98765 43210',
    whatsappLink = 'https://wa.me/919876543210',
    ctaText = 'Fill Your Details',
    ctaLink = '/franchise',
    features = defaultFeatures,
    emblemSrc = '/uploads/2026/07/cropped-Frame-51-2-1-192x192.png',
}) {
    return (
        <section className="dayal-franchise-section" aria-label="Franchise Opportunities">
            <div className="dayal-franchise-container">
                <div className="dayal-franchise-card">
                    {/* Top Row: Logo + Text (Left) and Contact/Action Buttons (Right) */}
                    <div className="dayal-franchise-top-row">
                        <div className="dayal-franchise-brand-wrap">
                            <img
                                src={emblemSrc}
                                alt="Dayal Sweets Emblem"
                                className="dayal-franchise-emblem"
                                loading="lazy"
                            />
                            <div className="dayal-franchise-text-box">
                                <span className="dayal-franchise-tag">{tag}</span>
                                <h3 className="dayal-franchise-title">
                                    {title} <span className="rt-span-color">{highlightTitle}</span>
                                </h3>
                                <p className="dayal-franchise-desc">{description}</p>
                            </div>
                        </div>

                        <div className="dayal-franchise-actions-wrap">
                            <a
                                href={phoneLink}
                                className="dayal-franchise-pill"
                                aria-label="Call for franchise inquiries"
                            >
                                <span className="dayal-pill-icon" aria-hidden="true">
                                    <svg
                                        width="18"
                                        height="18"
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
                                <div className="dayal-pill-text">
                                    <span className="dayal-pill-label">Interested In Franchise</span>
                                    <strong className="dayal-pill-val">{phone}</strong>
                                </div>
                            </a>

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dayal-franchise-pill"
                                aria-label="WhatsApp for franchise inquiries"
                            >
                                <span className="dayal-pill-icon" aria-hidden="true">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.78 14.07c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.15.11-3.72-.95-3.28-1.36-5.4-4.69-5.56-4.91-.16-.22-1.33-1.77-1.33-3.38 0-1.61.84-2.4 1.14-2.73.3-.33.65-.41.87-.41.22 0 .43 0 .62.01.2.01.47-.08.73.55.27.65.92 2.25 1 2.42.08.16.13.36.03.57-.11.22-.16.36-.32.55-.16.19-.34.42-.48.56-.16.16-.33.33-.14.65.19.33.84 1.39 1.81 2.25 1.25 1.11 2.3 1.45 2.63 1.61.33.16.52.14.71-.08.19-.22.82-.95 1.04-1.28.22-.33.43-.27.73-.16.3.11 1.91.9 2.24 1.06.33.16.55.24.63.38.08.14.08.82-.16 1.5z" />
                                    </svg>
                                </span>
                                <div className="dayal-pill-text">
                                    <span className="dayal-pill-label">Whatsapp us</span>
                                    <strong className="dayal-pill-val">{whatsapp}</strong>
                                </div>
                            </a>

                            <Link className="dayal-franchise-submit-btn" href={ctaLink}>
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                <span>{ctaText}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Horizontal Divider */}
                    <div className="dayal-franchise-divider" />

                    {/* Bottom Row: 5 Feature Boxes */}
                    <div className="dayal-franchise-features-row">
                        {features.map((feat) => (
                            <div className="dayal-franchise-feat-item" key={feat.id}>
                                <div className="dayal-feat-icon" aria-hidden="true">
                                    {feat.icon === 'ribbon' && (
                                        <svg
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#C9A15B"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="8" r="6" />
                                            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                                        </svg>
                                    )}
                                    {feat.icon === 'box' && (
                                        <svg
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#C9A15B"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                                            <path d="m3.3 7 8.7 5 8.7-5" />
                                            <path d="M12 22V12" />
                                        </svg>
                                    )}
                                    {feat.icon === 'support' && (
                                        <svg
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#C9A15B"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                                            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                                            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                                            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                                        </svg>
                                    )}
                                    {feat.icon === 'profit' && (
                                        <svg
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#C9A15B"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect width="20" height="12" x="2" y="6" rx="2" />
                                            <circle cx="12" cy="12" r="2" />
                                            <path d="M6 12h.01M18 12h.01" />
                                        </svg>
                                    )}
                                    {feat.icon === 'growth' && (
                                        <svg
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#C9A15B"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                            <polyline points="16 7 22 7 22 13" />
                                        </svg>
                                    )}
                                </div>
                                <strong className="dayal-feat-title">{feat.title}</strong>
                                <p className="dayal-feat-desc">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
