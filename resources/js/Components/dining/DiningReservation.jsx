import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { diningChefSpecials } from '@/data/diningData';

/**
 * Section E: Book Your Table / Reservation
 * Left: Chef's Special promotional card with chef photo and menu items
 * Right: Table reservation form
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
                                    placeholder="Your Message Or Special Requests..."
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
