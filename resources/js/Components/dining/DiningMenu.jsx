import React from 'react';
import { Link } from '@inertiajs/react';
import { diningMenuCategories } from '@/data/diningData';

/**
 * Section D: Explore Our Menu
 * Eyebrow, Heading, 7 Menu Category Cards in one row on desktop,
 * and an 'EXPLORE FULL MENU' CTA button.
 */
export default function DiningMenu() {
    return (
        <section className="dining-menu-section" aria-label="Explore Our Menu">
            <div className="dining-menu-container">
                {/* Header */}
                <div className="dining-menu-header">
                    <div className="dining-menu-eyebrow-wrap">
                        <span className="dining-menu-eyebrow-line" aria-hidden="true" />
                        <span className="dining-menu-eyebrow">EXPLORE OUR MENU</span>
                        <span className="dining-menu-eyebrow-line" aria-hidden="true" />
                    </div>

                    <h2 className="dining-menu-heading">
                        Delicious Choices for <span className="rt-span-color">Every Craving</span>
                    </h2>
                </div>

                {/* 7 Category Cards Grid */}
                <div className="dining-menu-grid">
                    {diningMenuCategories.map((cat) => (
                        <article key={cat.id} className="dining-menu-card">
                            <div className="dining-menu-card-media">
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="dining-menu-card-img"
                                    loading="lazy"
                                />
                            </div>

                            <div className="dining-menu-card-body">
                                <h3 className="dining-menu-card-title">{cat.title}</h3>
                                <Link href={cat.url} className="dining-menu-card-btn">
                                    <span>EXPLORE</span>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M2.9165 7H11.0832" />
                                        <path d="M7 2.9165L11.0833 6.99984L7 11.0832" />
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Central Explore Full Menu Button */}
                <div className="dining-menu-cta-wrap">
                    <Link href="/shop" className="dining-menu-full-btn">
                        EXPLORE FULL MENU
                    </Link>
                </div>
            </div>
        </section>
    );
}
