import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { diningChefSpecials } from '@/data/diningData';

/**
 * Section E: Book Your Table / Reservation
 * Left: Chef's Special promotional card with chef photo and menu items
 * Right: Table reservation form (static phase 1)
 */
export default function DiningReservation() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        persons: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            alert('Thank you! Your table reservation request has been received. Our dining team will contact you shortly to confirm your booking.');
            setFormData({
                name: '',
                phone: '',
                email: '',
                persons: '',
                message: '',
            });
            setSubmitted(false);
        }, 300);
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
                        <div className="dining-reservation-chef-inner">
                            {/* Chef Photograph */}
                            <div className="dining-reservation-chef-media">
                                <img
                                    src="/uploads/2026/08/halwai-2.png"
                                    alt="Dayal Sweets Master Chef"
                                    className="dining-reservation-chef-img"
                                    loading="lazy"
                                />
                            </div>

                            {/* Chef Menu Content */}
                            <div className="dining-reservation-chef-content">
                                <span className="dining-reservation-chef-eyebrow">TODAY'S</span>
                                <h3 className="dining-reservation-chef-title">CHEF'S SPECIAL</h3>

                                <img
                                    src="/uploads/2026/07/Group-2.png"
                                    alt=""
                                    className="dining-reservation-chef-divider"
                                    aria-hidden="true"
                                />

                                <ul className="dining-reservation-chef-list">
                                    {diningChefSpecials.map((item) => (
                                        <li key={item} className="dining-reservation-chef-item">
                                            <span className="dining-reservation-chef-dot" aria-hidden="true" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/shop" className="dining-reservation-chef-btn">
                                    <span>ORDER NOW</span>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
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

                        <form className="dining-reservation-form" onSubmit={handleSubmit}>
                            <div className="dining-reservation-form-row">
                                <div className="dining-reservation-field">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name*"
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="dining-reservation-field">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number*"
                                        required
                                        pattern="[0-9]{10}"
                                        title="Please enter a valid 10-digit phone number"
                                    />
                                </div>
                            </div>

                            <div className="dining-reservation-form-row">
                                <div className="dining-reservation-field">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email Address*"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="dining-reservation-field">
                                    <input
                                        type="number"
                                        name="persons"
                                        value={formData.persons}
                                        onChange={handleChange}
                                        placeholder="No Of Guest"
                                        min="1"
                                    />
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
                            </div>

                            <div className="dining-reservation-submit-wrap">
                                <button type="submit" className="dining-reservation-submit-btn">
                                    RESERVE A TABLE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
