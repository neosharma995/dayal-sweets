import React, { useState } from 'react';

/**
 * Section G: Custom Gifting / Large Celebration Quote Form
 * 3 Column Layout:
 * 1. Large Hamper Photograph
 * 2. Copy & Hamper Illustration
 * 3. 9-Field Custom Quote Form (Reproducing CF7 Post 4570)
 * Sourced directly from Elementor Post 65 & Post 4570
 */
export default function CustomQuoteSection() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        occasion: '',
        quantity: '',
        budget: '',
        deliveryDate: '',
        requirements: '',
        message: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <section className="gifting-quote-section">
            <div className="gifting-quote-container celebration-section">
                {/* Column 1: Hamper Photograph */}
                <div className="gifting-quote-col-photo">
                    <img
                        src="/uploads/2026/08/Planning-a-Large-Celeb.png"
                        alt="Planning a Large Celebration Hamper"
                        className="gifting-quote-photo"
                        loading="lazy"
                    />
                </div>

                {/* Column 2: Information & Illustration */}
                <div className="gifting-quote-col-info">
                    <h2 className="gifting-quote-heading">
                        Planning a Large{' '}
                        <span className="rt-span-color">Celebration?</span>
                    </h2>
                    <p className="gifting-quote-description">
                        Whether it's weddings, festivals, employee gifting, or milestone
                        moments, Dayal Sweets creates customized hampers tailored to your
                        taste and budget.
                    </p>
                    <div className="gifting-quote-illustration-wrap">
                        <img
                            src="/uploads/2026/08/Gift-Hamper-img.png"
                            alt="Gift Hamper Illustration"
                            className="gifting-quote-illustration"
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Column 3: 9-Field Quote Form */}
                <div className="gifting-quote-col-form">
                    <div className="contact-form-wrapper booking-form">
                        <form
                            onSubmit={handleSubmit}
                            className="contact-form-inner-wrapper"
                        >
                            {/* Row 1: Name & Company */}
                            <div className="form-row">
                                <div className="form-field">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="form-field">
                                    <input
                                        type="text"
                                        name="company"
                                        placeholder="Company Name"
                                        value={formData.company}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row 2: Email & Occasion */}
                            <div className="form-row">
                                <div className="form-field">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="form-field">
                                    <input
                                        type="text"
                                        name="occasion"
                                        placeholder="Occasion"
                                        value={formData.occasion}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row 3: Quantity & Budget */}
                            <div className="form-row">
                                <div className="form-field">
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        placeholder="Quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <input
                                        type="number"
                                        name="budget"
                                        placeholder="Budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row 4: Delivery Date & Requirements */}
                            <div className="form-row">
                                <div className="form-field">
                                    <input
                                        type="date"
                                        name="deliveryDate"
                                        placeholder="Delivery Date"
                                        value={formData.deliveryDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <input
                                        type="text"
                                        name="requirements"
                                        placeholder="Requirements"
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Full Width: Message Textarea */}
                            <div className="form-field full-width">
                                <textarea
                                    name="message"
                                    placeholder="Tell Us About Your Requirements..."
                                    value={formData.message}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="form-submit booking-submit">
                                <button type="submit" className="gifting-quote-submit-btn">
                                    {isSubmitted ? 'Quote Request Sent!' : 'Get Custom Quote'}
                                </button>
                            </div>

                            {/* Feedback Notice */}
                            {isSubmitted && (
                                <p
                                    className="gifting-quote-success-notice"
                                    style={{
                                        color: '#2e7d32',
                                        fontSize: '14px',
                                        marginTop: '12px',
                                        textAlign: 'center',
                                        fontWeight: '500',
                                    }}
                                >
                                    Thank you! Your custom quote request has been received. Our gifting team will contact you shortly.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
