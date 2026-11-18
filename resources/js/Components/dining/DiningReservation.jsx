import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { diningChefSpecials } from '@/data/diningData';

/**
 * Section E: Book Your Table / Reservation
 * Left: Chef's Special promotional card with chef photo and menu items
 * Right: Table reservation form
 */
export default function DiningReservation() {
    const { activeOutlet } = usePage().props || {};
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        persons: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const successTimerRef = useRef(null);
    const errorTimerRef = useRef(null);

    // Show temporary success toaster that auto-hides after 4500ms
    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => {
            setSuccessMessage('');
        }, 4500);
    };

    // Show temporary error toaster that auto-hides after 4500ms
    const showError = (msg) => {
        setErrorMessage(msg);
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => {
            setErrorMessage('');
        }, 4500);
    };

    useEffect(() => {
        return () => {
            if (successTimerRef.current) clearTimeout(successTimerRef.current);
            if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        };
    }, []);

    /**
     * Validate an individual form field.
     * @param {string} field
     * @param {string} value
     * @param {boolean} isSubmittingCheck - if true, also validate required on empty
     */
    const validateField = (field, value, isSubmittingCheck = false) => {
        let error = '';

        if (field === 'name') {
            const trimmed = (value || '').trim();
            if (!trimmed) {
                if (isSubmittingCheck || hasSubmitted) {
                    error = 'Please enter your full name.';
                }
            } else if (trimmed.length < 2) {
                error = 'Name must be at least 2 characters.';
            } else if (trimmed.length > 100) {
                error = 'Name cannot exceed 100 characters.';
            } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
                error = 'Please enter a valid name using letters only.';
            }
        } else if (field === 'phone') {
            const raw = (value || '').trim();
            const digits = raw.replace(/[^0-9]/g, '');
            const normalized = (digits.startsWith('91') && digits.length === 12) ? digits.slice(2) : digits;

            if (!raw) {
                if (isSubmittingCheck || hasSubmitted) {
                    error = 'Please enter your mobile number.';
                }
            } else if (normalized.length !== 10) {
                error = 'Please enter a valid 10-digit mobile number.';
            } else if (!/^[6-9][0-9]{9}$/.test(normalized)) {
                error = 'Mobile number must start with 6, 7, 8, or 9.';
            }
        } else if (field === 'email') {
            const trimmed = (value || '').trim();
            if (!trimmed) {
                if (isSubmittingCheck || hasSubmitted) {
                    error = 'Please enter your email address.';
                }
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                error = 'Please enter a valid email address.';
            }
        } else if (field === 'persons') {
            if (value !== '' && value !== null && value !== undefined) {
                const num = parseInt(value, 10);
                if (isNaN(num) || num < 1) {
                    error = 'Number of guests must be at least 1.';
                } else if (num > 50) {
                    error = 'For parties larger than 50, please contact us directly.';
                }
            }
        } else if (field === 'message') {
            if (value && value.length > 1000) {
                error = 'Special requests cannot exceed 1000 characters.';
            }
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Auto-restrict phone to numbers and max 10 digits
        let processedValue = value;
        if (name === 'phone') {
            processedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        }

        setFormData((prev) => ({ ...prev, [name]: processedValue }));

        // If field already has an error, revalidate to clear it as user types
        if (errors[name] || hasSubmitted) {
            const fieldError = validateField(name, processedValue, hasSubmitted);
            setErrors((prev) => ({ ...prev, [name]: fieldError }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        // Only show validation on blur if user typed something or already attempted submit
        if (value.trim() || hasSubmitted) {
            const fieldError = validateField(name, value, hasSubmitted);
            setErrors((prev) => ({ ...prev, [name]: fieldError }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        setSuccessMessage('');
        setErrorMessage('');

        const newErrors = {
            name: validateField('name', formData.name, true),
            phone: validateField('phone', formData.phone, true),
            email: validateField('email', formData.email, true),
            persons: validateField('persons', formData.persons, true),
            message: validateField('message', formData.message, true),
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((err) => !!err);
        if (hasErrors) {
            showError('Please fix the errors highlighted below.');
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                ...formData,
                guests: formData.persons ? parseInt(formData.persons, 10) : 1,
                outlet_id: activeOutlet?.id || null,
            };

            const response = await axios.post('/dining', payload);

            if (response.data?.success) {
                showSuccess(
                    response.data.message ||
                    'Thank you! Your table reservation request has been received. Our dining team will contact you shortly to confirm your booking.'
                );
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    persons: '',
                    message: '',
                });
                setErrors({});
                setHasSubmitted(false);
            } else {
                showError('Unable to submit your reservation request. Please try again.');
            }
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const serverErrors = err.response.data.errors;
                const formatted = {};
                for (const key of Object.keys(serverErrors)) {
                    formatted[key] = Array.isArray(serverErrors[key]) ? serverErrors[key][0] : serverErrors[key];
                }
                setErrors((prev) => ({ ...prev, ...formatted }));
                showError(err.response.data.message || 'Please correct the invalid fields.');
            } else {
                const msg =
                    err.response?.data?.message ||
                    'Something went wrong. Please check your inputs and try again.';
                showError(msg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="dining-reservation-section" aria-label="Book Your Table">
            <div className="dining-reservation-container">
                {/* Header */}
                <div className="dining-reservation-header">
                    <div className="dining-reservation-eyebrow-wrap">
                        <span className="dining-reservation-eyebrow-line" aria-hidden="true" />
                        <span className="dining-reservation-eyebrow">RESERVE YOUR TABLE</span>
                        <span className="dining-reservation-eyebrow-line" aria-hidden="true" />
                    </div>

                    <h2 className="dining-reservation-heading">
                        <span className="rt-span-color">Book Your Table</span> for a Delightful Experience
                    </h2>
                </div>

                {/* Two-Column Grid */}
                <div className="dining-reservation-grid">
                    {/* Left Column: Chef's Special Promotional Card */}
                    <div className="dining-reservation-chef-card">
                        {/* Chef Photograph */}
                        <div className="dining-reservation-chef-media">
                            <img
                                src="/uploads/2026/08/halwai-2.png"
                                alt="Halwai"
                                className="dining-reservation-chef-img"
                            />
                        </div>

                        {/* Chef Menu Content */}
                        <div className="dining-reservation-chef-content">
                            <span className="dining-reservation-chef-eyebrow">TODAY'S</span>
                            <h3 className="dining-reservation-chef-title">CHEF'S SPECIAL</h3>

                            <div className="dining-reservation-chef-divider" aria-hidden="true" />

                            <ul className="dining-reservation-chef-list">
                                {diningChefSpecials.map((item) => (
                                    <li key={item} className="dining-reservation-chef-item">
                                        <span className="dining-reservation-chef-icon">
                                            <svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm80 248c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80z" />
                                            </svg>
                                        </span>
                                        <span className="dining-reservation-chef-text">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="dining-reservation-chef-btn-wrap">
                                <Link href="/shop" className="dining-reservation-chef-btn">
                                    <svg className="dining-reservation-btn-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M30.966 16.234l-9.6-9.6c-0.312-0.312-0.819-0.312-1.131 0s-0.312 0.819 0 1.131l8.234 8.234h-26.069c-0.442 0-0.8 0.358-0.8 0.8s0.358 0.8 0.8 0.8h26.069l-8.234 8.234c-0.312 0.312-0.312 0.819 0 1.131 0.156 0.156 0.361 0.234 0.566 0.234s0.409-0.078 0.566-0.234l9.6-9.6c0.312-0.312 0.312-0.819 0-1.131z" />
                                    </svg>
                                    <span>Order Now</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Table Reservation Form */}
                    <div className="dining-reservation-form-card">
                        <div className="dining-reservation-form-header">
                            <span className="dining-reservation-form-eyebrow">RESERVE YOUR PERFECT</span>
                            <h3 className="dining-reservation-form-title">Dining Experience</h3>
                        </div>

                        {successMessage && (
                            <div
                                style={{
                                    background: '#ECFDF5',
                                    border: '1px solid #A7F3D0',
                                    color: '#065F46',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 700, flexShrink: 0 }}>✓</span>
                                    <span>{successMessage}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (successTimerRef.current) clearTimeout(successTimerRef.current);
                                        setSuccessMessage('');
                                    }}
                                    aria-label="Close notification"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#065F46',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        lineHeight: 1,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0.8,
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
                                    title="Close notification"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {errorMessage && (
                            <div
                                style={{
                                    background: '#FEF2F2',
                                    border: '1px solid #FECACA',
                                    color: '#991B1B',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 700, flexShrink: 0 }}>⚠</span>
                                    <span>{errorMessage}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
                                        setErrorMessage('');
                                    }}
                                    aria-label="Close error"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#991B1B',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        lineHeight: 1,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0.8,
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
                                    title="Close error"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <form className="dining-reservation-form" onSubmit={handleSubmit} noValidate>
                            <div className="dining-reservation-form-row" style={{ alignItems: 'start' }}>
                                <div className="dining-reservation-field">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Your Name*"
                                        disabled={submitting}
                                        style={errors.name ? { borderColor: '#DC2626', backgroundColor: '#FFF8F8' } : {}}
                                    />
                                    {errors.name && (
                                        <span style={{ color: '#DC2626', fontSize: '0.785rem', marginTop: '0.35rem', display: 'block', fontWeight: 500 }}>
                                            {errors.name}
                                        </span>
                                    )}
                                </div>
                                <div className="dining-reservation-field">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Phone Number*"
                                        maxLength={10}
                                        disabled={submitting}
                                        style={errors.phone ? { borderColor: '#DC2626', backgroundColor: '#FFF8F8' } : {}}
                                    />
                                    {errors.phone && (
                                        <span style={{ color: '#DC2626', fontSize: '0.785rem', marginTop: '0.35rem', display: 'block', fontWeight: 500 }}>
                                            {errors.phone}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="dining-reservation-form-row" style={{ alignItems: 'start' }}>
                                <div className="dining-reservation-field">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Email Address*"
                                        disabled={submitting}
                                        style={errors.email ? { borderColor: '#DC2626', backgroundColor: '#FFF8F8' } : {}}
                                    />
                                    {errors.email && (
                                        <span style={{ color: '#DC2626', fontSize: '0.785rem', marginTop: '0.35rem', display: 'block', fontWeight: 500 }}>
                                            {errors.email}
                                        </span>
                                    )}
                                </div>
                                <div className="dining-reservation-field">
                                    <input
                                        type="number"
                                        name="persons"
                                        value={formData.persons}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="No Of Guest"
                                        min="1"
                                        max="50"
                                        disabled={submitting}
                                        style={errors.persons ? { borderColor: '#DC2626', backgroundColor: '#FFF8F8' } : {}}
                                    />
                                    {errors.persons && (
                                        <span style={{ color: '#DC2626', fontSize: '0.785rem', marginTop: '0.35rem', display: 'block', fontWeight: 500 }}>
                                            {errors.persons}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="dining-reservation-field dining-reservation-field-full">
                                <textarea
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Your Message or Special Requests..."
                                />
                                {errors.message && (
                                    <span style={{ color: '#DC2626', fontSize: '0.785rem', marginTop: '0.35rem', display: 'block', fontWeight: 500 }}>
                                        {errors.message}
                                    </span>
                                )}
                            </div>

                            <div className="dining-reservation-submit-wrap">
                                <button
                                    type="submit"
                                    className="dining-reservation-submit-btn"
                                    disabled={submitting}
                                    style={{
                                        opacity: submitting ? 0.7 : 1,
                                        cursor: submitting ? 'wait' : 'pointer',
                                    }}
                                >
                                    {submitting ? 'RESERVING...' : 'RESERVE A TABLE'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
