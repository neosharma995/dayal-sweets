import React from 'react';

export default function ContactInfo() {
    return (
        <div className="contact-info-column">
            {/* Decorative Pistachio on Top Right */}
            <img
                src="/uploads/2026/07/image-166.png"
                alt=""
                className="contact-info-decor-pistachio"
                aria-hidden="true"
            />

            {/* Card 1: Email Us */}
            <div className="contact-info-card">
                <p className="contact-info-label">
                    Email <span className="rt-span-color">Us</span>
                </p>
                <h5 className="contact-info-value">
                    <a href="mailto:info@dayalsweets.com" className="anchor-tag">
                        info@dayalsweets.com
                    </a>
                </h5>
                <p className="contact-info-subtext">We'll reply as soon as possible..</p>
            </div>

            {/* Card 2: Opening Hours */}
            <div className="contact-info-card">
                <p className="contact-info-label">
                    Opening <span className="rt-span-color">Hours</span>
                </p>
                <h5 className="contact-info-value">
                    Mon-Sun ( 07:00 AM - 12:00 AM )
                </h5>
                <p className="contact-info-subtext">Open all days</p>
            </div>

            {/* Card 3: Contact Us */}
            <div className="contact-info-card">
                <p className="contact-info-label">
                    Contact <span className="rt-span-color">Us</span>
                </p>
                <h5 className="contact-info-value">
                    <a href="tel:+919876543210" className="anchor-tag">
                        +91 98765 43210
                    </a>
                </h5>
                <p className="contact-info-subtext">We're here to help you.</p>
            </div>
        </div>
    );
}
