import React from 'react';
import { Link } from '@inertiajs/react';
import { festivalsList } from '@/data/giftingData';

/**
 * Section D: Festival Specials
 * 8 Festival Showcase Cards (Diwali, Raksha Bandhan, Holi, Christmas, New Year, Eid, Navratri, Baisakhi)
 * Sourced directly from Elementor Post 65
 */
export default function FestivalSpecials() {
    return (
        <section className="gifting-festival-section">
            <div className="gifting-festival-container">
                {/* Eyebrow: — FESTIVAL SPECIALS — */}
                <div className="gifting-eyebrow-wrapper" aria-hidden="true">
                    <span className="gifting-eyebrow-divider" />
                    <span className="gifting-eyebrow-text">FESTIVAL SPECIALS</span>
                    <span className="gifting-eyebrow-divider" />
                </div>

                {/* Section Heading */}
                <h2 className="gifting-section-heading">
                    Celebrate Every Festival with <span className="rt-span-color">Sweet Memories</span>
                </h2>

                {/* 8-Card Festival Grid */}
                <div className="gifting-festival-grid">
                    {festivalsList.map((item) => (
                        <Link
                            key={item.id}
                            href={item.link}
                            className="gifting-festival-card"
                        >
                            <div className="gifting-festival-image-wrap">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="gifting-festival-image"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="gifting-festival-title">{item.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
