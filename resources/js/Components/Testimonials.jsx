import React, { useState, useEffect, useRef } from 'react';
import { testimonialsList as defaultTestimonials } from '@/data/testimonialsData';

/**
 * Reusable Customer Testimonials Component ("Loved By Thousands")
 * Exact 1:1 match with Hostinger reference design & Elementor structure:
 * - Eyebrow & Title mathematically aligned with the Active Card
 * - Mascot correctly sized and positioned on the left
 * - Exact typography (Plus Jakarta Sans 65px title, Inter 14px eyebrow with 21px dividers)
 * - Exact Google 4.9 rating badge with Container-13.png & image-126.png
 * - Exact 3 stacked side preview cards
 */
export default function Testimonials({
    eyebrow = 'WHAT THE WAY',
    title = 'Loved By',
    highlightTitle = 'Thousands',
    rating = '4.9',
    ratingCountText = 'Based on 3,200+ reviews',
    testimonials = defaultTestimonials,
    mascot = '/uploads/2026/07/image-149-e1789633262291.png',
}) {
    const list = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;
    const [activeIndex, setActiveIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const timerRef = useRef(null);

    const total = list.length;

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
        timerRef.current = setInterval(next, 6500);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activeIndex, total]);

    const handleMouseEnter = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleMouseLeave = () => {
        timerRef.current = setInterval(next, 6500);
    };

    const activeSlide = list[activeIndex];
    const side1 = list[circularIndex(1)];
    const side2 = list[circularIndex(2)];
    const side3 = list[circularIndex(3)];

    return (
        <section className="dayal-testimonials-section" aria-label="Customer Testimonials">
            <div className="dayal-testimonials-container">
                <div
                    className="dayal-testimonials-layout"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Left Column: Mascot Illustration */}
                    {mascot && (
                        <div className="dayal-testimonials-mascot-col">
                            <img
                                src={mascot}
                                alt="Dayal Sweets Mascot"
                                className="dayal-testimonials-mascot-img"
                                loading="lazy"
                            />
                        </div>
                    )}

                    {/* Right Column: Heading + Slider */}
                    <div className="dayal-testimonials-content-col">
                        {/* Top Row: Eyebrow + Heading (Left) and 4.9 Google Rating Badge (Right) */}
                        <div className="dayal-testimonials-top-row">
                            <div className="dayal-testimonials-heading-box">
                                <div className="dayal-testimonials-eyebrow-wrap">
                                    <span className="dayal-eyebrow-divider" aria-hidden="true" />
                                    <span className="dayal-eyebrow-text">{eyebrow}</span>
                                    <span className="dayal-eyebrow-divider" aria-hidden="true" />
                                </div>
                                <h2 className="dayal-testimonials-heading">
                                    {title} <span className="rt-span-color">{highlightTitle}</span>
                                </h2>
                            </div>

                            {/* Google 4.9 Rating Badge (Exact match to reference) */}
                            <div className="dayal-testimonials-rating-badge">
                                <h3 className="dayal-rating-number">{rating}</h3>
                                <img
                                    src="/uploads/2026/07/image-126.png"
                                    alt="Google"
                                    className="dayal-rating-google-img"
                                />
                                <img
                                    src="/uploads/2026/07/Container-13.png"
                                    alt="5 Stars"
                                    className="dayal-rating-stars-img"
                                />
                                <p className="dayal-rating-text">{ratingCountText}</p>
                            </div>
                        </div>

                        {/* Slider Row */}
                        <div className="ts-slider-wrapper">
                            {/* Prev Button */}
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
                                <div className={`ts-active-card ${fade ? 'fade-in' : 'fade-out'}`}>
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
                                            className="google-img-test"
                                        />
                                    </div>

                                    <div className="ts-active-content">
                                        <p>{activeSlide.content}</p>
                                    </div>

                                    <div className="ts-active-footer">
                                        <div className="ts-footer-author">
                                            <img
                                                className="ts-avatar"
                                                src={activeSlide.avatar || '/uploads/2026/09/user.png'}
                                                alt={activeSlide.name}
                                            />
                                            <div className="ts-person-info">
                                                <div className="ts-person-name">{activeSlide.name}</div>
                                                <div className="ts-person-location">
                                                    {activeSlide.location || activeSlide.category}
                                                </div>
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

                                {/* Side Column: 3 Stacked Reviews */}
                                <div className="ts-side-column">
                                    {side1 && (
                                        <div
                                            className="ts-side-card ts-is-next"
                                            onClick={() => goTo(circularIndex(1))}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <div className="ts-side-header">
                                                <img
                                                    className="ts-avatar-sm"
                                                    src={side1.avatar || '/uploads/2026/09/user.png'}
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
                                    )}

                                    {side2 && (
                                        <div
                                            className="ts-side-card ts-is-plain"
                                            onClick={() => goTo(circularIndex(2))}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <div className="ts-side-header">
                                                <img
                                                    className="ts-avatar-sm"
                                                    src={side2.avatar || '/uploads/2026/09/user.png'}
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
                                    )}

                                    {side3 && (
                                        <div
                                            className="ts-side-card ts-is-plain"
                                            onClick={() => goTo(circularIndex(3))}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <div className="ts-side-header">
                                                <img
                                                    className="ts-avatar-sm"
                                                    src={side3.avatar || '/uploads/2026/09/user.png'}
                                                    alt={side3.name}
                                                />
                                                <div className="ts-person-info">
                                                    <div className="ts-person-name">{side3.name}</div>
                                                    <div className="ts-person-category">
                                                        {side3.category || side3.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ts-side-excerpt">{side3.excerpt}</div>
                                        </div>
                                    )}
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
