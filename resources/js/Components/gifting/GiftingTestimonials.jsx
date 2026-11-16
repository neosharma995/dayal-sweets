import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { testimonialsList } from '@/data/giftingData';

/**
 * Section H: Customer Testimonials
 * Includes:
 * 1. Top Section Header with Eyebrow, Heading, and 4.9 Google Rating Badge
 * 2. Left Mascot illustration (image-149-e1789633262291.png)
 * 3. Interactive Testimonial Slider with Active Card, Side Column Cards, and Prev/Next Navigation
 * Sourced directly from Elementor Post 65, rgb_custom_shortcodes.php, and rt_style.css
 */
export default function GiftingTestimonials() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const timerRef = useRef(null);

    const total = testimonialsList.length;

    const circularIndex = (offset) => {
        return (activeIndex + offset) % total;
    };

    const goTo = (index) => {
        setFade(false);
        setTimeout(() => {
            const nextIdx = ((index % total) + total) % total;
            setActiveIndex(nextIdx);
            setFade(true);
        }, 150);
    };

    const next = () => goTo(activeIndex + 1);
    const prev = () => goTo(activeIndex - 1);

    useEffect(() => {
        timerRef.current = setInterval(next, 6000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activeIndex]);

    const handleMouseEnter = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleMouseLeave = () => {
        timerRef.current = setInterval(next, 6000);
    };

    const activeSlide = testimonialsList[activeIndex];
    const side1 = testimonialsList[circularIndex(1)];
    const side2 = testimonialsList[circularIndex(2)];

    return (
        <section className="gifting-testimonial-section">
            <div className="gifting-testimonial-container">
                {/* Top Row: Eyebrow + Heading (Left) and 4.9 Rating Badge (Right) */}
                <div className="gifting-testimonial-top-row">
                    <div className="gifting-testimonial-heading-box">
                        <div className="gifting-eyebrow-wrapper" aria-hidden="true">
                            <span className="gifting-eyebrow-divider" />
                            <span className="gifting-eyebrow-text">WHAT THEY SAY</span>
                            <span className="gifting-eyebrow-divider" />
                        </div>
                        <h2 className="gifting-section-heading">
                            Loved By{' '}
                            <span className="rt-span-color" style={{ fontWeight: 500 }}>
                                Thousands
                            </span>
                        </h2>
                    </div>

                    {/* Google 4.9 Rating Badge */}
                    <Link
                        href="/reviews"
                        className="gifting-testimonial-rating-badge"
                        title="View All Reviews"
                    >
                        <span className="gifting-rating-number">4.9</span>
                        <div className="gifting-rating-media">
                            <img
                                src="/uploads/2026/07/image-126.png"
                                alt="5 Stars"
                                className="gifting-rating-stars-img"
                            />
                            <img
                                src="/uploads/2026/07/Container-13.png"
                                alt="Google Reviews"
                                className="gifting-rating-google-img"
                            />
                        </div>
                        <p className="gifting-rating-text">Based on 3,200+ reviews</p>
                    </Link>
                </div>

                {/* Main Row: Mascot Illustration (Left) + Slider (Right) */}
                <div
                    className="gifting-testimonial-main-row"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Mascot Illustration */}
                    <div className="gifting-testimonial-mascot-col">
                        <img
                            src="/uploads/2026/07/image-149-e1789633262291.png"
                            alt="Dayal Sweets Mascot"
                            className="gifting-testimonial-mascot-img"
                            loading="lazy"
                        />
                    </div>

                    {/* Testimonial Slider */}
                    <div className="gifting-testimonial-slider-col">
                        <div className="ts-slider-wrapper">
                            {/* Previous Button */}
                            <button
                                type="button"
                                className="ts-arrow ts-arrow-prev"
                                onClick={prev}
                                aria-label="Previous Review"
                            >
                                <img
                                    src="/uploads/2026/07/Path.png"
                                    alt=""
                                    aria-hidden="true"
                                />
                            </button>

                            <div className="ts-slider-inner">
                                {/* Active (Large) Card */}
                                <div
                                    className={`ts-active-card ${fade ? 'fade-in' : 'fade-out'}`}
                                >
                                    <div className="ts-quote-icon">
                                        <img
                                            src="/uploads/2026/07/quote-up.png"
                                            alt=""
                                            className="ts-quote-img"
                                            aria-hidden="true"
                                        />
                                        <img
                                            src="/uploads/2026/09/google-logo.png"
                                            alt="Google"
                                            className="ts-google-logo google-img-test"
                                        />
                                    </div>

                                    <div className="ts-active-content">
                                        <p>"{activeSlide.content}"</p>
                                    </div>

                                    <div className="ts-active-footer">
                                        <img
                                            className="ts-avatar"
                                            src={activeSlide.avatar}
                                            alt={activeSlide.name}
                                        />
                                        <div className="ts-person-info">
                                            <div className="ts-person-name">
                                                {activeSlide.name}
                                            </div>
                                            <div className="ts-person-location">
                                                {activeSlide.location || activeSlide.category}
                                            </div>
                                        </div>
                                        <div
                                            className="ts-stars"
                                            aria-label={`${activeSlide.rating} out of 5 stars`}
                                        >
                                            {'★'.repeat(activeSlide.rating)}
                                            {'☆'.repeat(Math.max(0, 5 - activeSlide.rating))}
                                        </div>
                                    </div>
                                </div>

                                {/* Side Column: Upcoming Reviews (Desktop) */}
                                <div className="ts-side-column">
                                    {/* Next slide (featured gold border) */}
                                    <div
                                        className="ts-side-card ts-is-next"
                                        onClick={() => goTo(circularIndex(1))}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="ts-side-header">
                                            <img
                                                className="ts-avatar-sm"
                                                src={side1.avatar}
                                                alt={side1.name}
                                            />
                                            <div className="ts-person-info">
                                                <div className="ts-person-name">{side1.name}</div>
                                                <div className="ts-person-category">
                                                    {side1.category || side1.location}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ts-side-excerpt">{side1.excerpt}</div>
                                    </div>

                                    {/* Second upcoming slide */}
                                    <div
                                        className="ts-side-card ts-is-plain"
                                        onClick={() => goTo(circularIndex(2))}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="ts-side-header">
                                            <img
                                                className="ts-avatar-sm"
                                                src={side2.avatar}
                                                alt={side2.name}
                                            />
                                            <div className="ts-person-info">
                                                <div className="ts-person-name">{side2.name}</div>
                                                <div className="ts-person-category">
                                                    {side2.category || side2.location}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ts-side-excerpt">{side2.excerpt}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Button */}
                            <button
                                type="button"
                                className="ts-arrow ts-arrow-next"
                                onClick={next}
                                aria-label="Next Review"
                            >
                                <img
                                    src="/uploads/2026/07/Path-1.png"
                                    alt=""
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
