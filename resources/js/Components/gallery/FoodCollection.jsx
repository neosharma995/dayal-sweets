import React from 'react';
import { Link } from '@inertiajs/react';
import { foodCollectionItems } from '@/data/galleryData';

/**
 * Section C: Signature Food Collection Component
 * 6 Cards showcasing Dayal Sweets' primary culinary categories
 */
export default function FoodCollection() {
    return (
        <section className="gallery-food-section">
            <div className="gallery-food-container">
                {/* Eyebrow: — FOOD COLLECTION — */}
                <div className="gallery-food-eyebrow" aria-hidden="true">
                    <span className="gallery-food-divider" />
                    <span className="gallery-food-eyebrow-text">Food Collection</span>
                    <span className="gallery-food-divider" />
                </div>

                {/* Section Title */}
                <h2 className="gallery-food-title">
                    Signature <span className="rt-span-color">Food Collection</span>
                </h2>

                {/* Subtitle */}
                <p className="gallery-food-subtitle">
                    A treat for every craving, made with the finest ingredients.
                </p>

                {/* 6 Cards Grid */}
                <div className="gallery-food-grid">
                    {foodCollectionItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.link}
                            className="gallery-food-card"
                        >
                            <div className="gallery-food-img-wrap">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="gallery-food-card-title">{item.title}</h3>
                        </Link>
                    ))}
                </div>

                {/* View Full Menu Button */}
                <div className="gallery-food-btn-wrap">
                    <Link href="/shop" className="gallery-food-btn">
                        VIEW FULL MENU
                    </Link>
                </div>
            </div>
        </section>
    );
}
