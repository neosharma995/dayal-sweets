import React from 'react';
import { signatureProducts } from '@/data/aboutData';

/**
 * Section E: The Signature Collection
 * Left: Premium mithai collection video/showcase card
 * Right: 5 Product cards with image, title, and description
 */
export default function SignatureCollection() {
    return (
        <section className="about-collection-section">
            <div className="about-collection-container">
                {/* Eyebrow */}
                <div className="about-collection-eyebrow" aria-hidden="true">
                    <span className="about-story-divider" />
                    <span className="about-story-eyebrow-text">Our Premium Product</span>
                    <span className="about-story-divider" />
                </div>

                {/* Section Title */}
                <h2 className="about-collection-title">
                    The Signature <span className="rt-span-color">Collection</span>
                </h2>

                {/* Two-Column Showcase Layout */}
                <div className="about-collection-layout">
                    {/* Left Column: Premium Video/Image Showcase */}
                    <div className="about-collection-main-card">
                        <video
                            src="/uploads/2026/07/13568748_1920_1080_25fps-1-3.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            aria-label="Signature Sweets Collection Showcase"
                        />
                    </div>

                    {/* Right Column: 5 Signature Products Grid */}
                    <div className="about-collection-grid">
                        {signatureProducts.map((item) => (
                            <div key={item.id} className="about-collection-card">
                                <div className="about-collection-card-img-wrap">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="about-collection-card-title">
                                    {item.title}
                                </h3>
                                <p className="about-collection-card-desc">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
