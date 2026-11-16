import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * Reusable Common Red Hero Banner for Dayal Sweets Inner Pages
 * (Contact Us, About Us, Gallery, Gifting, etc.)
 */
export default function ContactHero({
    breadcrumbs = [
        { label: 'HOME', url: '/' },
        { label: 'CONTACT US', url: null },
    ],
    title = 'CONTACT US',
    subtitle = "We'd Love to Hear From You!",
    description = "Have a query, feedback, or a special request? We're here to help and make your experience with Dayal Sweets even better.",
}) {
    return (
        <section className="contact-hero-section">
            {/* Dark burgundy textured background overlay */}
            <div className="contact-hero-overlay" aria-hidden="true" />

            {/* Decorative Sweets and Rose Petals graphics on left */}
            <img
                src="/uploads/2026/07/image-262.png"
                alt=""
                className="contact-hero-decor-sweet-1"
                aria-hidden="true"
            />
            <img
                src="/uploads/2026/07/image-261.png"
                alt=""
                className="contact-hero-decor-sweet-2"
                aria-hidden="true"
            />
            <img
                src="/uploads/2026/07/image-263.png"
                alt=""
                className="contact-hero-decor-sweet-3"
                aria-hidden="true"
            />

            {/* Decorative Peacock Feather graphic on right */}
            <img
                src="/uploads/2026/07/image-48.png"
                alt=""
                className="contact-hero-decor-peacock"
                aria-hidden="true"
            />

            {/* Center Content Container */}
            <div className="contact-hero-inner">
                {/* Center-aligned Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="contact-hero-breadcrumb" aria-label="Breadcrumb">
                        {breadcrumbs.map((crumb, idx) => {
                            const isLast = idx === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={crumb.label || idx}>
                                    {crumb.url && !isLast ? (
                                        <Link href={crumb.url} className="contact-hero-breadcrumb-link">
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="contact-hero-breadcrumb-current">
                                            {crumb.label}
                                        </span>
                                    )}
                                    {!isLast && (
                                        <span className="contact-hero-breadcrumb-sep" aria-hidden="true">
                                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 32c-0.205 0-0.409-0.078-0.566-0.234-0.312-0.312-0.312-0.819 0-1.131l13.834-13.834-13.834-13.834c-0.312-0.312-0.312-0.819 0-1.131s0.819-0.312 1.131 0l14.4 14.4c0.312 0.312 0.312 0.819 0 1.131l-14.4 14.4c-0.156 0.156-0.361 0.234-0.566 0.234z" />
                                            </svg>
                                        </span>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </nav>
                )}

                {/* Large uppercase page heading & golden divider */}
                <div className="contact-hero-heading-box">
                    <h1 className="contact-hero-title">{title}</h1>
                    <img
                        src="/uploads/2026/07/Group-2.png"
                        alt=""
                        className="contact-hero-divider"
                        aria-hidden="true"
                    />
                </div>

                {/* Subtitle & Description */}
                {(subtitle || description) && (
                    <div className="contact-hero-sub-box">
                        {subtitle && <h2 className="contact-hero-subtitle">{subtitle}</h2>}
                        {description && <p className="contact-hero-description">{description}</p>}
                    </div>
                )}
            </div>
        </section>
    );
}
