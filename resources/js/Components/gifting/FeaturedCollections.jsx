import React from 'react';
import { Link } from '@inertiajs/react';
import { featuredCollections } from '@/data/giftingData';

/**
 * Section C: Featured Gift Collections
 * 2 Side-by-side Showcase Hampers: Build Your Own & Corporate Gifting
 * Sourced directly from Elementor Post 65
 */
export default function FeaturedCollections() {
    return (
        <section className="gifting-collections-section">
            <div className="gifting-collections-container">
                {/* Eyebrow: — FEATURED GIFT COLLECTIONS — */}
                <div className="gifting-eyebrow-wrapper" aria-hidden="true">
                    <span className="gifting-eyebrow-divider" />
                    <span className="gifting-eyebrow-text">FEATURED GIFT COLLECTIONS</span>
                    <span className="gifting-eyebrow-divider" />
                </div>

                {/* Section Heading */}
                <h2 className="gifting-section-heading">
                    Hand Picked <span className="rt-span-color">Hampers Everyone Loves</span>
                </h2>

                {/* Collections Row */}
                <div className="gifting-collections-row">
                    {featuredCollections.map((col) => (
                        <div
                            key={col.id}
                            className={`gifting-collection-card gifting-collection-${col.theme}`}
                            style={{ backgroundImage: `url(${col.bgImage})` }}
                        >
                            <div className="gifting-collection-content">
                                {/* Title with icon */}
                                <div className="gifting-collection-header">
                                    {col.theme === 'dark' ? (
                                        <svg
                                            className="gifting-collection-icon"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a3 3 0 0 0-3-3c-1.28 0-2.37.8-2.8 1.94L12 4.34l-.2-.4C11.37 2.8 10.28 2 9 2a3 3 0 0 0-3 3c0 .35.07.69.18 1H4a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h1v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9h1a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2zM9 4a1 1 0 0 1 1 1c0 .36-.2.67-.5.85L8.35 6.5A1 1 0 0 1 8 6a1 1 0 0 1 1-1zm6 0a1 1 0 0 1 1 1c0 .19-.05.37-.15.5l-1.15-.65c-.3-.18-.5-.49-.5-.85a1 1 0 0 1 .8-.99V4zM4 8h7v2H4V8zm2 4h5v8H6v-8zm12 8h-5v-8h5v8zm2-10h-7V8h7v2z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="gifting-collection-icon"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M20 6h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-10-2h4v2h-4V4zm10 15H4V8h16v11z" />
                                        </svg>
                                    )}
                                    <h3 className="gifting-collection-title">{col.title}</h3>
                                </div>

                                {/* Subtitle */}
                                <p className="gifting-collection-subtitle">{col.subtitle}</p>

                                {/* Features List */}
                                <ul className="gifting-collection-features">
                                    {col.features.map((feat, idx) => (
                                        <li key={idx} className="gifting-collection-feature-item">
                                            <span className="gifting-collection-bullet" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Action Link */}
                                <Link
                                    href={col.btnLink}
                                    className="gifting-collection-link"
                                >
                                    <span>{col.btnText}</span>
                                    <svg
                                        className="gifting-collection-link-arrow"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
