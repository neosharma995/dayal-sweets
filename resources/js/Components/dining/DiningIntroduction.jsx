import React from 'react';
import { diningFeatures } from '@/data/diningData';

/**
 * Section B: Welcome to Dayal Sweets Dining
 * Left: Large restaurant interior photograph
 * Right: Eyebrow, Heading, Description, 4 Feature Cards (2x2)
 */
export default function DiningIntroduction() {
    return (
        <section className="dining-intro-section" aria-label="Welcome to Dayal Sweets Dining">
            <div className="dining-intro-container">
                <div className="dining-intro-grid">
                    {/* Left Column: Dining Interior Photograph */}
                    <div className="dining-intro-media">
                        <img
                            src="/uploads/2026/08/About-Us-Hero-Image-scaled.jpg"
                            alt="Dayal Sweets Elegant Dining Interior"
                            className="dining-intro-img"
                            loading="lazy"
                        />
                    </div>

                    {/* Right Column: Heading, Description, Feature Cards */}
                    <div className="dining-intro-content">
                        <div className="dining-intro-eyebrow-wrap">
                            <span className="dining-intro-eyebrow-line" aria-hidden="true" />
                            <span className="dining-intro-eyebrow">WELCOME TO DAYAL SWEETS DINING</span>
                            <span className="dining-intro-eyebrow-line" aria-hidden="true" />
                        </div>

                        <h2 className="dining-intro-heading">
                            Crafted for <span className="rt-span-color">Memorable Dining</span> Experiences
                        </h2>

                        <p className="dining-intro-desc">
                            Experience the perfect blend of authentic Himachali flavors, warm hospitality, and elegant interiors. Every dish is freshly prepared using premium ingredients to create unforgettable dining moments for you and your loved ones.
                        </p>

                        <div className="dining-intro-features-grid">
                            {diningFeatures.map((feat) => (
                                <div key={feat.id} className="dining-intro-feature-card">
                                    <div className="dining-intro-feature-icon-wrap">
                                        <img
                                            src={feat.icon}
                                            alt={feat.title}
                                            className="dining-intro-feature-icon"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="dining-intro-feature-text">
                                        <h3 className="dining-intro-feature-title">{feat.title}</h3>
                                        <p className="dining-intro-feature-desc">{feat.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
