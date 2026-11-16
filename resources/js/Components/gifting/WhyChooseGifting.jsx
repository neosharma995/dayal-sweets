import React from 'react';
import { whyChooseGiftingList } from '@/data/giftingData';

/**
 * Section E: Why Choose Dayal Sweets
 * 6 Benefit Cards with top icon, gold divider, text, and bottom arrow
 * Sourced directly from Elementor Post 65
 */
export default function WhyChooseGifting() {
    return (
        <section className="gifting-benefits-section">
            <div className="gifting-benefits-container">
                {/* Eyebrow: — WHY CHOOSE DAYAL SWEETS — */}
                <div className="gifting-eyebrow-wrapper" aria-hidden="true">
                    <span className="gifting-eyebrow-divider" />
                    <span className="gifting-eyebrow-text">WHY CHOOSE DAYAL SWEETS</span>
                    <span className="gifting-eyebrow-divider" />
                </div>

                {/* Section Heading */}
                <h2 className="gifting-section-heading">
                    Crafted with <span className="rt-span-color">Tradition, Delivered</span> with Care
                </h2>

                {/* 6 Benefit Cards Grid */}
                <div className="gifting-benefits-grid">
                    {whyChooseGiftingList.map((item) => (
                        <div key={item.id} className="gifting-benefit-card">
                            {/* Top Feature Icon */}
                            <div className="gifting-benefit-icon-wrap">
                                <img
                                    src={item.icon}
                                    alt={item.title}
                                    className="gifting-benefit-icon"
                                    loading="lazy"
                                />
                            </div>

                            {/* Card Title */}
                            <h3 className="gifting-benefit-title">{item.title}</h3>

                            {/* Gold Divider Line */}
                            <img
                                src="/uploads/2026/07/Group-2.png"
                                alt=""
                                className="gifting-benefit-divider"
                                aria-hidden="true"
                            />

                            {/* Description */}
                            <p className="gifting-benefit-desc">{item.desc}</p>

                            {/* Bottom Arrow Graphic */}
                            <img
                                src="/uploads/2026/08/Clip-Arrow.png"
                                alt=""
                                className="gifting-benefit-arrow"
                                aria-hidden="true"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
