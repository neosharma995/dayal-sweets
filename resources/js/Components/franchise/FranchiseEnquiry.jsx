import React, { useState } from 'react';

/**
 * Section B: Become Our Franchise Partner
 * Left: Enquiry Form (7 fields)
 * Right: Modern Dayal Sweets building photograph
 * Decorative: Saffron, Cashews, Peacock feather
 */
export default function FranchiseEnquiry() {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        city: '',
        location: '',
        investment: '',
        experience: '',
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
            alert('Thank you for your franchise inquiry! Our business development team will contact you shortly.');
            setFormData({
                name: '',
                mobile: '',
                email: '',
                city: '',
                location: '',
                investment: '',
                experience: '',
            });
            setSubmitted(false);
        }, 300);
    };

    return (
        <section className="franchise-enquiry-section" aria-label="Become Our Franchise Partner">
            {/* Decorative Saffron & Cashew Top-Right */}
            <img
                src="/uploads/2026/07/image-165.png"
                alt=""
                className="franchise-enquiry-decor-saffron"
                aria-hidden="true"
            />
            <img
                src="/uploads/2026/07/image-262.png"
                alt=""
                className="franchise-enquiry-decor-cashew"
                aria-hidden="true"
            />

            {/* Decorative Peacock Feather Bottom-Left */}
            <img
                src="/uploads/2026/07/image-48.png"
                alt=""
                className="franchise-enquiry-decor-peacock"
                aria-hidden="true"
            />

            <div className="franchise-enquiry-container">
                {/* Header with Divider Lines */}
                <div className="franchise-enquiry-header">
                    <div className="franchise-enquiry-eyebrow-wrap">
                        <span className="franchise-enquiry-eyebrow-line" aria-hidden="true" />
                        <span className="franchise-enquiry-eyebrow">GROW WITH DAYAL SWEETS</span>
                        <span className="franchise-enquiry-eyebrow-line" aria-hidden="true" />
                    </div>

                    <h2 className="franchise-enquiry-title">
                        Become Our <span className="rt-span-color">Franchise Partner</span>
                    </h2>

                    <p className="franchise-enquiry-subtitle">
                        A treat for every craving, made with the finest ingredients.
                    </p>
                </div>

                {/* Two-Column Grid: Form (Left) & Building Image (Right) */}
                <div className="franchise-enquiry-grid">
                    {/* Left Form Box */}
                    <div className="franchise-enquiry-card">
                        <h3 className="franchise-enquiry-card-title">
                            Start Your Franchise <span className="rt-span-color">Journey</span>
                        </h3>

                        <form className="franchise-enquiry-form" onSubmit={handleSubmit}>
                            <div className="franchise-form-row">
                                <div className="franchise-form-field">
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
                                <div className="franchise-form-field">
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="Mobile Number*"
                                        required
                                        pattern="[0-9]{10}"
                                        title="Please enter a valid 10-digit mobile number"
                                    />
                                </div>
                            </div>

                            <div className="franchise-form-row">
                                <div className="franchise-form-field">
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
                                <div className="franchise-form-field">
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City*"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="franchise-form-row">
                                <div className="franchise-form-field">
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Preferred Location*"
                                        required
                                    />
                                </div>
                                <div className="franchise-form-field">
                                    <input
                                        type="text"
                                        name="investment"
                                        value={formData.investment}
                                        onChange={handleChange}
                                        placeholder="Investment Range*"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="franchise-form-field franchise-form-field-full">
                                <textarea
                                    name="experience"
                                    rows="4"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="Tell Us About Your Experience...."
                                />
                            </div>

                            <div className="franchise-form-submit-wrap">
                                <button type="submit" className="franchise-form-submit-btn">
                                    SEND ENQUIRY
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Building Image */}
                    <div className="franchise-enquiry-media">
                        <img
                            src="/uploads/2026/07/About-Outlet.png"
                            alt="Dayal Sweets Modern Outlet Storefront"
                            className="franchise-enquiry-outlet-img"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
