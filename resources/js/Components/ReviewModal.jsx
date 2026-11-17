import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Star, CheckCircle2, ShieldCheck } from 'lucide-react';

const RATING_LABELS = {
    1: '1 - Poor (Needs Improvement)',
    2: '2 - Fair (Below Expectations)',
    3: '3 - Good (Average Experience)',
    4: '4 - Very Good (Satisfied)',
    5: '5 - Excellent (Loved the Taste & Freshness!)',
};

export default function ReviewModal({
    show = false,
    onClose,
    product = null,
    orderId = null,
}) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewMessage, setReviewMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (product) {
            setRating(product.user_rating || 5);
            setReviewMessage(product.user_review || '');
            setErrorMessage('');
        }
    }, [product]);

    if (!product) return null;

    const activeStarCount = hoverRating || rating;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage('');

        const targetProductId = product.product_id || product.id;

        router.post(
            route('customer.reviews.store'),
            {
                product_id: targetProductId,
                rating: rating,
                review: reviewMessage.trim(),
                order_id: orderId || product.order_db_id || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSubmitting(false);
                    if (onClose) onClose(true);
                },
                onError: (errors) => {
                    setSubmitting(false);
                    setErrorMessage(
                        errors.rating ||
                        errors.review ||
                        errors.product_id ||
                        'Failed to submit review. Please try again.'
                    );
                },
            }
        );
    };

    return (
        <Modal show={show} onClose={() => !submitting && onClose && onClose(false)}>
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #EBE4D8', paddingBottom: '12px' }}>
                    <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#631826', letterSpacing: '0.05em' }}>
                            Customer Feedback
                        </span>
                        <h3 style={{ margin: '2px 0 0', fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#0F172A' }}>
                            {product.user_rating ? 'Edit Your Review' : 'Rate & Review Product'}
                        </h3>
                    </div>
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={() => onClose && onClose(false)}
                        style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
                    >
                        ✕
                    </button>
                </div>

                {/* Product Summary Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', background: '#FAF7F2', borderRadius: '8px', border: '1px solid #EBE4D8', marginBottom: '20px' }}>
                    <img
                        src={product.image || product.product_image || '/uploads/2026/07/kaaju-katli.png'}
                        alt={product.name || product.product_name}
                        style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.src = '/uploads/2026/07/kaaju-katli.png'; }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                            {product.name || product.product_name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>
                            {product.variation_name ? `Pack: ${product.variation_name}` : 'Standard Box'}
                            {product.order_id && ` • Order #${product.order_id}`}
                        </div>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16A34A', fontWeight: 700, background: '#DCFCE7', padding: '3px 8px', borderRadius: '999px' }}>
                        <ShieldCheck size={13} />
                        <span>Verified Buyer</span>
                    </div>
                </div>

                {errorMessage && (
                    <div style={{ padding: '10px 14px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '6px', color: '#991B1B', fontSize: '13px', marginBottom: '16px' }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Interactive Star Rating */}
                    <div style={{ marginBottom: '20px', textAlign: 'center', background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                            Select Rating out of 5 Stars <span style={{ color: '#E11D48' }}>*</span>
                        </label>

                        <div
                            style={{ display: 'inline-flex', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            {[1, 2, 3, 4, 5].map((star) => {
                                const filled = star <= activeStarCount;
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        aria-label={`Rate ${star} out of 5 stars`}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            transform: star <= activeStarCount ? 'scale(1.15)' : 'scale(1)',
                                            transition: 'transform 0.15s ease',
                                        }}
                                    >
                                        <Star
                                            size={32}
                                            color={filled ? '#D4AF37' : '#CBD5E1'}
                                            fill={filled ? '#D4AF37' : 'none'}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#631826' }}>
                            {RATING_LABELS[activeStarCount] || 'Select your rating'}
                        </div>
                    </div>

                    {/* Review Message Textarea */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Write a Message / Review (Optional)
                        </label>
                        <textarea
                            value={reviewMessage}
                            onChange={(e) => setReviewMessage(e.target.value)}
                            maxLength={1000}
                            rows={4}
                            placeholder="Share your experience: How was the taste, sweetness, texture, and pure desi ghee aroma?"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                resize: 'vertical',
                                boxSizing: 'border-box',
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                            <span>Help other sweet lovers choose their festive treats</span>
                            <span>{reviewMessage.length} / 1000 characters</span>
                        </div>
                    </div>

                    {/* Modal Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={() => onClose && onClose(false)}
                            className="dayal-btn dayal-btn--outline dayal-btn--sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="dayal-btn dayal-btn--primary dayal-btn--sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                            {submitting ? (
                                <span>Submitting...</span>
                            ) : (
                                <>
                                    <Star size={14} fill="#FFFFFF" />
                                    <span>{product.user_rating ? 'Update Review' : 'Submit Review'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
