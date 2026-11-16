import React from 'react';

const trustItems = [
    {
        title: '100% SECURE',
        description: 'Safe & Secure Payments',
        icon: '/uploads/2026/07/Vector-3.svg',
    },
    {
        title: 'LIVE TRACKING',
        description: 'Real-Time Updates',
        icon: '/uploads/2026/07/Icon-1.svg',
    },
    {
        title: 'FAST DELIVERY',
        description: 'On Time, Every Time',
        icon: '/uploads/2026/07/Icon-2.svg',
    },
    {
        title: 'PREMIUM QUALITY',
        description: 'Handcrafted with Love & Purity',
        icon: '/uploads/2026/07/Vector-4.svg',
    },
];

export default function ContactCTA() {
    return (
        <section className="contact-cta-section">
            <div className="contact-cta-inner">
                <div className="contact-cta-content">
                    <div className="contact-cta-lead">
                        <div className="contact-cta-intro">
                            <span className="contact-cta-intro-rule" aria-hidden="true" />
                            <p className="contact-cta-eyebrow">CRAVING SOMETHING SWEET</p>
                            <span className="contact-cta-intro-rule" aria-hidden="true" />
                        </div>
                        <div className="contact-cta-heading">
                            <h2>Order your favorites</h2>
                            <h2 className="rt-span-color">Anytime, Anywhere</h2>
                        </div>
                    </div>
                    <div className="contact-cta-copy">
                        <p className="contact-cta-description">
                            From our kitchen to your doorstep,
                            <br />
                            we make every order special.
                        </p>
                        <div className="contact-cta-actions">
                            <a href="/shop" className="contact-cta-btn-order">
                                <span className="contact-cta-action-icon contact-cta-order-icon" aria-hidden="true" />
                                <span>ORDER NOW</span>
                            </a>
                            <a
                                href="https://wa.me/919876543210"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-cta-btn-chat"
                            >
                                <span className="contact-cta-action-icon contact-cta-chat-icon" aria-hidden="true" />
                                <span>CHAT NOW</span>
                            </a>
                        </div>
                    </div>
                    <div className="contact-cta-benefits" aria-label="Shopping benefits">
                        {trustItems.map((item) => (
                            <div className="contact-cta-benefit" key={item.title}>
                                <img src={item.icon} alt="" />
                                <div className="contact-cta-benefit-copy">
                                    <strong>{item.title}</strong>
                                    <span>{item.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <img
                    className="contact-cta-image"
                    src="/uploads/2026/07/25a75be7cdf9333748b57b1e795b01d57a04548a.webp"
                    alt="Dayal Sweets sweets shop showcase"
                />
            </div>
        </section>
    );
}
