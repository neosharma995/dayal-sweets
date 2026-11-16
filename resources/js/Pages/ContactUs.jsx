import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function ContactUs({ auth }) {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        requirements: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [notified, setNotified] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setFormData({
                name: '',
                phone: '',
                email: '',
                subject: '',
                requirements: '',
            });
        }, 500);
    };

    const handleNotifyMe = () => {
        setNotified(true);
        alert('Thank you! You will be the first to know when our Palampur outlet opens its doors.');
    };

    // 5 Outlets Data matching the exact design
    const outlets = [
        {
            id: 'amb',
            name: 'Amb',
            image: '/images/contact/outlet-amb.jpg',
            address: null,
            phone: '+91 80917 57395',
            whatsapp: '+91 80027 57395',
            mapUrl: 'https://maps.google.com/?q=Dayal+Sweets+Amb+Himachal+Pradesh',
        },
        {
            id: 'hamirpur',
            name: 'Hamirpur',
            image: '/images/contact/outlet-hamirpur.jpg',
            address: 'Dayal Sweets, Gandhi Chowk, NH 70, Pratap Nagar, Hamirpur, Himachal Pradesh 177001',
            phone: '+91 80917 57395',
            whatsapp: '+91 80027 57395',
            mapUrl: 'https://maps.google.com/?q=Dayal+Sweets+Gandhi+Chowk+Hamirpur',
        },
        {
            id: 'una',
            name: 'Una',
            image: '/images/contact/outlet-una.jpg',
            address: 'Dayal Sweets Nangal Road, Una, Durga Colony, Himachal Pradesh 174303',
            phone: '+91 80917 57395',
            whatsapp: '+91 80027 57395',
            mapUrl: 'https://maps.google.com/?q=Dayal+Sweets+Nangal+Road+Una',
        },
        {
            id: 'una-bus-stand',
            name: 'Una (Bus Stand)',
            image: '/images/contact/outlet-una-bus-stand.jpg',
            address: 'Dayal Sweets, Una - Hamirpur Rd, opp. Bus Stand, Una, Himachal Pradesh 174303',
            phone: '+91 80917 57395',
            whatsapp: '+91 80027 57395',
            mapUrl: 'https://maps.google.com/?q=Dayal+Sweets+Opp+Bus+Stand+Una',
        },
        {
            id: 'palampur',
            name: 'Palampur',
            isComingSoon: true,
            image: '/images/contact/outlet-palampur.jpg',
            subtitle: 'Opening Soon',
            expected: 'Expected Opening',
            expectedSub: 'Coming Soon',
        },
    ];

    // Gallery thumbnails for footer
    const galleryThumbs = [
        '/images/contact/gallery/g1.jpg',
        '/images/contact/gallery/g2.jpg',
        '/images/contact/gallery/g3.jpg',
        '/images/contact/gallery/g4.jpg',
        '/images/contact/gallery/g5.jpg',
        '/images/contact/gallery/g6.jpg',
    ];

    return (
        <div className="dayal-contact-page">
            <Head title="Contact Us - Dayal Sweets" />

            {/* Modular Reusable Header (Active on CONTACT US) */}
            <Header auth={auth} />

            {/* ========================================================= */}
            {/* 1. HERO BANNER                                            */}
            {/* ========================================================= */}
            <section className="dayal-contact-hero">
                {/* Decorative Cashews & Rose Petals (Left) */}
                <img
                    src="/images/contact/hero-cashews.png"
                    alt="Decorative Cashews and Rose Petals"
                    className="dayal-hero-decor-cashews"
                />

                {/* Decorative Peacock Feather (Right) */}
                <img
                    src="/images/contact/hero-peacock.png"
                    alt="Decorative Peacock Feather"
                    className="dayal-hero-decor-peacock"
                />

                <div className="dayal-hero-container">
                    {/* Breadcrumbs */}
                    <nav className="dayal-contact-breadcrumb" aria-label="Breadcrumb">
                        <Link href="/">HOME</Link>
                        <span className="breadcrumb-sep">&gt;</span>
                        <span className="breadcrumb-current">CONTACT US</span>
                    </nav>

                    {/* Main Title */}
                    <h1 className="dayal-contact-hero-title">CONTACT US</h1>

                    {/* Subtitle */}
                    <h2 className="dayal-contact-hero-subtitle">We'd Love to Hear From You!</h2>

                    {/* Description */}
                    <p className="dayal-contact-hero-desc">
                        Have a query, feedback, or a special request? We're here to help and make your
                        experience with Dayal Sweets even better.
                    </p>
                </div>
            </section>

            {/* ========================================================= */}
            {/* 2. CONTACT FORM & INFO CARDS SECTION                      */}
            {/* ========================================================= */}
            <section className="dayal-contact-main-section">
                {/* Decorative Pistachio (Top Right) */}
                <img
                    src="/images/contact/pistachio.png"
                    alt="Pistachio Nut"
                    className="dayal-decor-pistachio"
                />

                {/* Watermark Feathers */}
                <img
                    src="/images/contact/peacock-left.png"
                    alt=""
                    className="dayal-decor-peacock-left"
                    aria-hidden="true"
                />
                <img
                    src="/images/contact/peacock-right.png"
                    alt=""
                    className="dayal-decor-peacock-right"
                    aria-hidden="true"
                />

                <div className="dayal-contact-container">
                    <div className="dayal-contact-grid">
                        {/* LEFT COLUMN: Send Us a Message Card */}
                        <div className="dayal-contact-form-card">
                            <h3 className="dayal-form-card-title">
                                Send Us a <span className="highlight-maroon">Message</span>
                            </h3>

                            {submitted && (
                                <div className="dayal-form-feedback">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Thank you! Your message has been received. Our team will contact you shortly.</span>
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit}>
                                {/* Row 1: Name & Phone */}
                                <div className="dayal-form-row-2col">
                                    <div className="dayal-form-group">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Your Name*"
                                            required
                                        />
                                    </div>
                                    <div className="dayal-form-group">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Mobile Number*"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Email & Subject */}
                                <div className="dayal-form-row-2col">
                                    <div className="dayal-form-group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Email Address*"
                                            required
                                        />
                                    </div>
                                    <div className="dayal-form-group">
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            placeholder="Subject*"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Textarea */}
                                <div className="dayal-form-group">
                                    <textarea
                                        name="requirements"
                                        rows="4"
                                        value={formData.requirements}
                                        onChange={handleInputChange}
                                        placeholder="Tell Us About Your Requirements..."
                                        required
                                    />
                                </div>

                                {/* Row 4: Submit Button */}
                                <div>
                                    <button type="submit" className="dayal-form-submit-btn">
                                        SEND MESSAGE
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* RIGHT COLUMN: 3 Stacked Info Cards */}
                        <div className="dayal-contact-info-column">
                            {/* Card 1: Email Us */}
                            <div className="dayal-info-card">
                                <span className="dayal-info-label">Email Us</span>
                                <span className="dayal-info-value">
                                    <a href="mailto:info@dayalsweets.com">info@dayalsweets.com</a>
                                </span>
                                <p className="dayal-info-subtext">We'll reply as soon as possible.</p>
                            </div>

                            {/* Card 2: Opening Hours */}
                            <div className="dayal-info-card">
                                <span className="dayal-info-label">Opening Hours</span>
                                <span className="dayal-info-value">
                                    Mon-Sun ( 07:00 AM - 12:00 AM )
                                </span>
                                <p className="dayal-info-subtext">Open all days</p>
                            </div>

                            {/* Card 3: Contact Us */}
                            <div className="dayal-info-card">
                                <span className="dayal-info-label">Contact Us</span>
                                <span className="dayal-info-value">
                                    <a href="tel:+919876543210">+91 98765 43210</a>
                                </span>
                                <p className="dayal-info-subtext">We're here to help you.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* 3. "VIEW OUR STORES" — "PREMIUM OUTLETS" SECTION           */}
            {/* ========================================================= */}
            <section className="dayal-contact-outlets-section">
                <div className="dayal-outlets-container">
                    {/* Header */}
                    <div className="dayal-outlets-header">
                        <span className="dayal-outlets-tag">— VIEW OUR STORES —</span>
                        <h2 className="dayal-outlets-title">
                            Premium <span className="highlight-maroon">Outlets</span>
                        </h2>
                        <p className="dayal-outlets-subtitle">
                            Visit our premium outlets across Himachal Pradesh and experience the authentic taste
                            of tradition, craftsmanship, and celebration.
                        </p>
                    </div>

                    {/* 5 Outlets Grid */}
                    <div className="dayal-outlets-grid">
                        {outlets.map((outlet) => {
                            if (outlet.isComingSoon) {
                                return (
                                    <div key={outlet.id} className="dayal-outlet-card">
                                        {/* Corner Ribbon */}
                                        <div className="dayal-outlet-coming-ribbon">
                                            Coming Soon
                                        </div>

                                        <div className="dayal-outlet-image-wrap dayal-outlet-palampur-sketch">
                                            <img
                                                src={outlet.image}
                                                alt={`${outlet.name} Storefront Architectural Rendering`}
                                            />
                                        </div>

                                        <div className="dayal-outlet-body">
                                            <h4 className="dayal-outlet-name">{outlet.name}</h4>
                                            <div className="dayal-outlet-opening-soon-text">
                                                {outlet.subtitle}
                                            </div>
                                            <div className="dayal-outlet-expected-text">
                                                <span>{outlet.expected}</span>
                                                <strong>{outlet.expectedSub}</strong>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleNotifyMe}
                                                className="dayal-outlet-notify-btn"
                                            >
                                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                                <span>Notify Me</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={outlet.id} className="dayal-outlet-card">
                                    <div className="dayal-outlet-image-wrap">
                                        <img
                                            src={outlet.image}
                                            alt={`Dayal Sweets ${outlet.name} Outlet`}
                                        />
                                    </div>

                                    <div className="dayal-outlet-body">
                                        <h4 className="dayal-outlet-name">{outlet.name}</h4>

                                        {outlet.address && (
                                            <div className="dayal-outlet-address">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{outlet.address}</span>
                                            </div>
                                        )}

                                        <div className="dayal-outlet-contacts">
                                            {outlet.phone && (
                                                <a href={`tel:${outlet.phone.replace(/\s+/g, '')}`}>
                                                    <svg className="phone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span>{outlet.phone}</span>
                                                </a>
                                            )}

                                            {outlet.whatsapp && (
                                                <a
                                                    href={`https://wa.me/${outlet.whatsapp.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <svg className="wa-icon" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12.031 2c-5.508 0-9.985 4.477-9.985 9.985 0 1.761.459 3.479 1.331 4.992L2 22l5.163-1.354a9.92 9.92 0 004.868 1.258h.004c5.508 0 9.985-4.477 9.985-9.985 0-2.668-1.04-5.176-2.927-7.063C17.208 3.04 14.7 2 12.031 2zm5.82 14.123c-.244.686-1.42 1.316-1.956 1.396-.499.074-1.15.105-1.859-.122-.43-.138-.985-.32-1.705-.632-3.003-1.303-4.965-4.34-5.115-4.542-.15-.2-1.223-1.63-1.223-3.108 0-1.478.775-2.204 1.05-2.505.275-.3.6-.375.8-.375.2 0 .4 0 .575.01.188.01.438-.071.688.528.25.6 1.05 2.565 1.138 2.744.088.179.15.388.025.626-.125.238-.188.388-.375.6-.188.212-.394.473-.563.635-.188.179-.384.375-.165.75.22.375.975 1.605 2.091 2.598 1.436 1.277 2.646 1.674 3.021 1.861.375.188.595.163.815-.088.22-.25.938-1.088 1.188-1.463.25-.375.5-.313.838-.188.338.125 2.144 1.013 2.513 1.198.369.185.614.275.703.425.089.15.089.872-.155 1.558z" />
                                                    </svg>
                                                    <span>{outlet.whatsapp}</span>
                                                </a>
                                            )}
                                        </div>

                                        <a
                                            href={outlet.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="dayal-outlet-map-link"
                                        >
                                            <span>View Map</span>
                                            <span>&rsaquo;</span>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* 4. "CRAVING SOMETHING SWEET —" SECTION                     */}
            {/* ========================================================= */}
            <section className="dayal-order-anytime-section">
                <div className="dayal-order-container">
                    {/* Left Column Content */}
                    <div className="dayal-order-content">
                        <span className="dayal-order-tag">— CRAVING SOMETHING SWEET —</span>

                        <h2 className="dayal-order-title">
                            Order your favorites
                            <span className="highlight-maroon">Anytime, Anywhere</span>
                        </h2>

                        <p className="dayal-order-desc">
                            From our kitchen to your doorstep,
                            <br />
                            we make every order special.
                        </p>

                        {/* CTA Buttons */}
                        <div className="dayal-order-actions">
                            <Link href="/#bestsellers-section" className="dayal-btn-order-now">
                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span>ORDER NOW</span>
                            </Link>

                            <a
                                href="https://wa.me/919876543210?text=Hello%20Dayal%20Sweets%2C%20I%20would%20like%20to%20place%20an%20order"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dayal-btn-chat-now"
                            >
                                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.031 2c-5.508 0-9.985 4.477-9.985 9.985 0 1.761.459 3.479 1.331 4.992L2 22l5.163-1.354a9.92 9.92 0 004.868 1.258h.004c5.508 0 9.985-4.477 9.985-9.985 0-2.668-1.04-5.176-2.927-7.063C17.208 3.04 14.7 2 12.031 2zm5.82 14.123c-.244.686-1.42 1.316-1.956 1.396-.499.074-1.15.105-1.859-.122-.43-.138-.985-.32-1.705-.632-3.003-1.303-4.965-4.34-5.115-4.542-.15-.2-1.223-1.63-1.223-3.108 0-1.478.775-2.204 1.05-2.505.275-.3.6-.375.8-.375.2 0 .4 0 .575.01.188.01.438-.071.688.528.25.6 1.05 2.565 1.138 2.744.088.179.15.388.025.626-.125.238-.188.388-.375.6-.188.212-.394.473-.563.635-.188.179-.384.375-.165.75.22.375.975 1.605 2.091 2.598 1.436 1.277 2.646 1.674 3.021 1.861.375.188.595.163.815-.088.22-.25.938-1.088 1.188-1.463.25-.375.5-.313.838-.188.338.125 2.144 1.013 2.513 1.198.369.185.614.275.703.425.089.15.089.872-.155 1.558z" />
                                </svg>
                                <span>CHAT NOW</span>
                            </a>
                        </div>

                        {/* 4 Feature Badges */}
                        <div className="dayal-features-strip">
                            <div className="dayal-feature-item">
                                <svg className="dayal-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <div className="dayal-feature-text">
                                    <h5>100% SECURE</h5>
                                    <p>Safe &amp; Secure Payment</p>
                                </div>
                            </div>

                            <div className="dayal-feature-item">
                                <svg className="dayal-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="dayal-feature-text">
                                    <h5>LIVE TRACKING</h5>
                                    <p>Real-Time Updates</p>
                                </div>
                            </div>

                            <div className="dayal-feature-item">
                                <svg className="dayal-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8h4l3 4v4a1 1 0 01-1 1h-1m-6 0h4" />
                                </svg>
                                <div className="dayal-feature-text">
                                    <h5>FAST DELIVERY</h5>
                                    <p>On Time, Every Time</p>
                                </div>
                            </div>

                            <div className="dayal-feature-item">
                                <svg className="dayal-feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <div className="dayal-feature-text">
                                    <h5>PREMIUM QUALITY</h5>
                                    <p>Handcrafted with Love &amp; Purity</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Showcase Photo */}
                    <div className="dayal-order-image-card">
                        <img
                            src="/images/contact/sweet-counter.jpg"
                            alt="Dayal Sweets Fresh Showcase Counter"
                        />
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* 5. FOOTER (FAITHFUL TO MOCKUP DESIGN)                     */}
            {/* ========================================================= */}
            <footer className="dayal-contact-footer">
                <div className="dayal-footer-container">
                    <div className="dayal-footer-grid">
                        {/* Col 1: Brand Info */}
                        <div className="dayal-footer-col-brand">
                            <div className="dayal-footer-brand-title">
                                <span className="brand-crest">द</span>
                                <span>DAYAL SWEETS</span>
                            </div>
                            <p className="dayal-footer-desc">
                                Crafting India's most loved sweet moments since 1962. Pure ingredients, authentic
                                recipes, and a legacy of taste.
                            </p>

                            {/* Social Icons */}
                            <div className="dayal-footer-socials">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.7 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                                    </svg>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>

                            {/* CERTIFIED & PROUD */}
                            <div className="dayal-footer-certified">
                                <h6>CERTIFIED &amp; PROUD</h6>
                                <div className="certified-badges">
                                    <span className="badge-fssai">fssai</span>
                                    <span className="badge-quality">
                                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                        100% PURE
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Col 2: QUICK LINK */}
                        <div className="dayal-footer-col-nav">
                            <h4>QUICK LINK</h4>
                            <ul>
                                <li><Link href="/">Home</Link></li>
                                <li><a href="/#about">About Us</a></li>
                                <li><a href="/#reviews">Reviews</a></li>
                                <li><Link href="/contact-us">Contact Us</Link></li>
                                <li><a href="/#privacy">Privacy Policy</a></li>
                                <li><a href="/#returns">Return Policy</a></li>
                            </ul>
                        </div>

                        {/* Col 3: SHOP */}
                        <div className="dayal-footer-col-nav">
                            <h4>SHOP</h4>
                            <ul>
                                <li><a href="/#sweets">Sweets &amp; Mithai</a></li>
                                <li><a href="/#namkeen">Namkeen &amp; Snacks</a></li>
                                <li><a href="/#bakery">Bakery Items</a></li>
                                <li><a href="/#beverages">Beverages</a></li>
                                <li><a href="/#hampers">Gift Hampers</a></li>
                                <li><a href="/#seasonal">Seasonal Specials</a></li>
                            </ul>
                        </div>

                        {/* Col 4: CORPORATE */}
                        <div className="dayal-footer-col-nav">
                            <h4>CORPORATE</h4>
                            <ul>
                                <li><a href="/#orders">Orders</a></li>
                                <li><a href="/#corporate-gifting">Corporate Gifting</a></li>
                                <li><a href="/#franchise-enquiry">Franchise Enquiry</a></li>
                            </ul>
                        </div>

                        {/* Col 5: GALLERY */}
                        <div className="dayal-footer-col-gallery">
                            <h4>GALLERY</h4>
                            <div className="gallery-grid-3x2">
                                {galleryThumbs.map((src, idx) => (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt={`Dayal Sweets Mithai Gallery ${idx + 1}`}
                                        loading="lazy"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="dayal-footer-bottom">
                        &copy; 2026 Dayal Sweets. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
