import React, { useState, useMemo } from 'react';
import { Link, useForm } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import '../../scss/pages/_contact.scss';
import '../../scss/pages/_testimonials.scss';

/**
 * Dayal Sweets - Testimonials Page
 * 100% Faithful Duplication of Reference Design & rt-reviews (Post 4249)
 *
 * Page Sections:
 * 1. Global Header
 * 2. Reusable Red Hero Banner (TESTIMONIALS)
 * 3. Login to Add Your Testimonial Button / Add Your Testimonial Modal
 * 4. Overall Rating Summary Card (Rating Score, Star Breakdown, Happy Customers)
 * 5. Customer Testimonials Section Heading ("What Our Customers Are Saying")
 * 6. Toolbar (Filter pill & Sort dropdown)
 * 7. Testimonials Grid (3 columns on desktop, customer avatar, name, time, stars, content)
 * 8. Promotional CTA Banner & Global Footer
 */
export default function Testimonials({
    auth = {},
    page = null,
    stats = {
        total: 5,
        average: 4.4,
        breakdown: { 5: 3, 4: 1, 3: 1, 2: 0, 1: 0 },
        breakdown_max: 3,
    },
    testimonials = [],
    currentSort = 'recent',
    hasSubmitted = false,
    flash = {},
}) {
    const [sort, setSort] = useState(currentSort);
    const [showModal, setShowModal] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: auth?.user?.name || '',
        rating: 5,
        content: '',
    });

    // Helper: render star characters string (e.g. ★★★★☆)
    const renderStars = (rating) => {
        const fullStars = Math.max(0, Math.min(5, Math.round(rating)));
        return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
    };

    // Helper: generate 2-letter initials
    const getInitials = (name) => {
        if (!name) return 'DS';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Client-side sorting for instant interactivity
    const sortedTestimonials = useMemo(() => {
        const list = [...testimonials];
        if (sort === 'rating') {
            return list.sort((a, b) => b.rating - a.rating || new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }
        if (sort === 'lowest') {
            return list.sort((a, b) => a.rating - b.rating || new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }
        // default: 'recent'
        return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }, [testimonials, sort]);

    // Handle modal submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/testimonials', {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                reset('content');
            },
        });
    };

    const sections = page?.sections || {};
    const topBarHeading = sections.top_bar_Heading || 'TESTIMONIALS';
    const topBarSubHeading = sections.top_bar_sub_heading || 'Loved By Thousands, Trusted Every Day';
    const topBarDescription = sections.top_bar_description || "From our delicious sweets to our warm hospitality, here's what our happy customers have to say about Dayal Sweets.";

    return (
        <div className="testimonials-page-root">
            <SeoHead
                page={page}
                fallbackTitle="Testimonials | Dayal Sweets"
                fallbackDescription={topBarDescription}
            />

            {/* Existing Global Header */}
            <Header auth={auth} />

            <main>
                {/* 1. Common Red Hero Banner (Reusable) */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: topBarHeading, url: null },
                    ]}
                    title={topBarHeading}
                    subtitle={topBarSubHeading}
                    description={topBarDescription}
                />

                {/* Main Content Area */}
                <div className="testimonials-main-section">
                    <div className="testimonials-container">

                        {/* Flash Success Notification */}
                        {flash?.success && (
                            <div className="testimonials-success-alert" role="alert">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{flash.success}</span>
                            </div>
                        )}

                        {/* 2. Top Action Button: Login or Add Testimonial */}
                        <div className="testimonials-action-wrap">
                            {auth?.user ? (
                                <button
                                    type="button"
                                    onClick={() => setShowModal(true)}
                                    className="testimonials-btn"
                                >
                                    {hasSubmitted ? 'Update Your Testimonial' : 'Add Your Testimonial'}
                                </button>
                            ) : (
                                <Link
                                    href="/login?redirect=/testimonials"
                                    className="testimonials-btn"
                                >
                                    Login to Add Your Testimonial
                                </Link>
                            )}
                        </div>

                        {/* 3. Overall Rating Summary Card */}
                        <div className="testimonials-summary">
                            {/* Column 1: Overall Rating */}
                            <div className="testimonials-summary-col testimonials-summary-rating">
                                <h4>Overall Rating</h4>
                                <div className="testimonials-big-rating">
                                    {Number(stats.average || 4.4).toFixed(1)}
                                </div>
                                <div className="testimonials-stars-static" aria-label={`${stats.average} out of 5 stars`}>
                                    {renderStars(stats.average || 4.4)}
                                </div>
                                <p className="testimonials-based-on">
                                    Based on {stats.total} {stats.total === 1 ? 'testimonial' : 'reviews'}
                                </p>
                            </div>

                            {/* Column 2: Rating Breakdown */}
                            <div className="testimonials-summary-col testimonials-summary-breakdown">
                                <h4>Rating Breakdown</h4>
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = stats.breakdown?.[star] || 0;
                                    const maxVal = stats.breakdown_max || 1;
                                    const fillPercent = Math.round((count / maxVal) * 100);

                                    return (
                                        <div key={star} className="testimonials-breakdown-row">
                                            <span className="testimonials-breakdown-label">
                                                {star} Stars
                                            </span>
                                            <span className="testimonials-breakdown-bar">
                                                <span
                                                    className="testimonials-breakdown-fill"
                                                    style={{ width: `${fillPercent}%` }}
                                                />
                                            </span>
                                            <span className="testimonials-breakdown-count">
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Column 3: Happy Customers */}
                            <div className="testimonials-summary-col testimonials-summary-happy">
                                <h4>
                                    Our Happy<br />
                                    Customers
                                </h4>
                                <div className="testimonials-happy-count">
                                    {stats.total}+
                                </div>
                                <p>Happy Customers</p>
                            </div>
                        </div>

                        {/* 4. Section Heading */}
                        <h2 className="testimonials-heading">
                            What Our <span>Customers</span> Are Saying
                        </h2>

                        {/* 5. Toolbar: Filter Pill & Sort Dropdown */}
                        <div className="testimonials-toolbar">
                            <span className="testimonials-all-pill">
                                All Testimonials ({stats.total})
                            </span>

                            <form className="testimonials-sort-form" onSubmit={(e) => e.preventDefault()}>
                                <label htmlFor="testimonial-sort" className="sr-only" style={{ display: 'none' }}>
                                    Sort Testimonials
                                </label>
                                <select
                                    id="testimonial-sort"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="testimonials-sort-select"
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="lowest">Lowest Rated</option>
                                </select>
                            </form>
                        </div>

                        {/* 6. Testimonials Grid */}
                        <div className="testimonials-grid">
                            {sortedTestimonials.map((item) => (
                                <article key={item.id} className="testimonial-card">
                                    <div className="testimonial-head">
                                        {/* Avatar rendering */}
                                        {item.avatar ? (
                                            <div className="testimonial-avatar-wrap">
                                                <img
                                                    src={item.avatar}
                                                    alt={item.name}
                                                    className="testimonial-avatar-img"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ) : item.avatar_bg ? (
                                            <div className="testimonial-avatar-wrap">
                                                <div
                                                    className="testimonial-avatar-initials"
                                                    style={{ backgroundColor: item.avatar_bg }}
                                                >
                                                    {getInitials(item.name)}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="testimonial-avatar-wrap">
                                                <div className="testimonial-avatar-silhouette">
                                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}

                                        <div className="testimonial-person">
                                            <div className="testimonial-name">{item.name}</div>
                                            <div className="testimonial-time">{item.time_ago}</div>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div
                                        className="testimonial-stars"
                                        aria-label={`${item.rating} out of 5 stars`}
                                    >
                                        {renderStars(item.rating)}
                                    </div>

                                    {/* Testimonial Description */}
                                    <div className="testimonial-text">
                                        <p>{item.content}</p>
                                    </div>
                                </article>
                            ))}
                        </div>

                    </div>
                </div>
            </main>

            {/* Modal: Add / Update Testimonial */}
            {showModal && (
                <div
                    className="testimonials-modal-overlay"
                    onClick={() => setShowModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="testimonials-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="testimonials-modal-close"
                            onClick={() => setShowModal(false)}
                            aria-label="Close form"
                        >
                            &times;
                        </button>

                        <h3 id="modal-title" className="testimonials-modal-title">
                            Add Your Testimonial
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {/* Reviewer Name */}
                            <div className="testimonials-form-field">
                                <label htmlFor="testimonial_name">Your Name</label>
                                <input
                                    id="testimonial_name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                />
                                {errors.name && <div style={{ color: '#c00', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
                            </div>

                            {/* Star Rating Picker */}
                            <div className="testimonials-form-field">
                                <label>Your Rating</label>
                                <div className="testimonials-star-picker" role="radiogroup" aria-label="Select star rating">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isFilled = (hoverRating || data.rating) >= star;
                                        return (
                                            <span
                                                key={star}
                                                className={`star-item ${isFilled ? 'filled' : ''}`}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setData('rating', star)}
                                                role="radio"
                                                aria-checked={data.rating === star}
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        setData('rating', star);
                                                    }
                                                }}
                                            >
                                                ★
                                            </span>
                                        );
                                    })}
                                </div>
                                {errors.rating && <div style={{ color: '#c00', fontSize: '12px', marginTop: '4px' }}>{errors.rating}</div>}
                            </div>

                            {/* Testimonial Message */}
                            <div className="testimonials-form-field">
                                <label htmlFor="testimonial_content">Your Testimonial</label>
                                <textarea
                                    id="testimonial_content"
                                    rows={4}
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Share your sweet experience with Dayal Sweets..."
                                    required
                                />
                                {errors.content && <div style={{ color: '#c00', fontSize: '12px', marginTop: '4px' }}>{errors.content}</div>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="testimonials-submit-btn"
                            >
                                {processing ? 'Submitting...' : 'Submit Testimonial'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 8. Promotional CTA Banner & Global Footer */}
            <Footer />
        </div>
    );
}
