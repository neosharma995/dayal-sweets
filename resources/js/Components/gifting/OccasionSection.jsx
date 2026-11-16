import React from 'react';
import { Link } from '@inertiajs/react';
import { occasionsList } from '@/data/giftingData';

/**
 * Section B: Shop by Occasion
 * 8 Occasion Cards with custom SVG icons
 * Sourced directly from Elementor Post 65
 */
export default function OccasionSection() {
    return (
        <section className="gifting-occasion-section">
            <div className="gifting-occasion-container">
                {/* Eyebrow: — SHOP BY OCCASION — */}
                <div className="gifting-eyebrow-wrapper" aria-hidden="true">
                    <span className="gifting-eyebrow-divider" />
                    <span className="gifting-eyebrow-text">SHOP BY OCCASION</span>
                    <span className="gifting-eyebrow-divider" />
                </div>

                {/* Section Heading */}
                <h2 className="gifting-section-heading">
                    Celebrate Every <span className="rt-span-color">Special Moment</span>
                </h2>

                {/* Section Subtitle */}
                <p className="gifting-section-subtitle">
                    Find the perfect gift curated for every celebration.
                </p>

                {/* 5-Column Grid with 8 cards and centered 2nd row */}
                <div className="gifting-occasion-grid">
                    {/* First 5 cards (Row 1) */}
                    {occasionsList.slice(0, 5).map((item) => (
                        <Link
                            key={item.id}
                            href={item.link}
                            className="gifting-occasion-card"
                        >
                            <div className="gifting-occasion-icon-wrap">
                                <img
                                    src={item.icon}
                                    alt=""
                                    className="gifting-occasion-icon"
                                    aria-hidden="true"
                                />
                            </div>
                            <h3 className="gifting-occasion-card-title">{item.title}</h3>
                        </Link>
                    ))}

                    {/* Spacer for 5-col desktop layout centering bottom 3 items */}
                    <div className="gifting-occasion-spacer" aria-hidden="true" />

                    {/* Last 3 cards (Row 2) */}
                    {occasionsList.slice(5).map((item) => (
                        <Link
                            key={item.id}
                            href={item.link}
                            className="gifting-occasion-card"
                        >
                            <div className="gifting-occasion-icon-wrap">
                                <img
                                    src={item.icon}
                                    alt=""
                                    className="gifting-occasion-icon"
                                    aria-hidden="true"
                                />
                            </div>
                            <h3 className="gifting-occasion-card-title">{item.title}</h3>
                        </Link>
                    ))}

                    {/* Spacer for 5-col desktop layout */}
                    <div className="gifting-occasion-spacer" aria-hidden="true" />
                </div>
            </div>
        </section>
    );
}
