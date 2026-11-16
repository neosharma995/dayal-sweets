import React, { useState } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
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
        // Static frontend-only behavior
        setTimeout(() => {
            setFormData({
                name: '',
                phone: '',
                email: '',
                subject: '',
                message: '',
            });
        }, 1500);
    };

    return (
        <div className="contact-form-card">
            <h3 className="contact-form-title">
                Send Us a <span className="rt-span-color">Message</span>
            </h3>

            {submitted && (
                <div className="contact-form-status" role="status">
                    Thank you for your message. It has been sent.
                </div>
            )}

            <form className="contact-form-inner-wrapper" onSubmit={handleSubmit}>
                {/* Two-column Row 1: Name and Phone */}
                <div className="contact-form-row">
                    <div className="contact-form-field">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            placeholder="Your Name*"
                            required
                        />
                    </div>
                    <div className="contact-form-field">
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Mobile Number*"
                            required
                        />
                    </div>
                </div>

                {/* Two-column Row 2: Email and Subject */}
                <div className="contact-form-row">
                    <div className="contact-form-field">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            placeholder="Email Address*"
                            required
                        />
                    </div>
                    <div className="contact-form-field">
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject*"
                            required
                        />
                    </div>
                </div>

                {/* Full-width Textarea */}
                <div className="contact-form-field contact-form-field-full">
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell Us About Your Requirements..."
                    />
                </div>

                {/* Submit Button */}
                <div className="contact-form-submit">
                    <button type="submit" className="contact-form-submit-btn">
                        SEND MESSAGE
                    </button>
                </div>
            </form>
        </div>
    );
}
