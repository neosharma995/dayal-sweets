import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import Outlets from '@/Components/Outlets';
import '../../scss/pages/_contact.scss';

export default function ContactUs({ auth, page }) {
    // Form state (design untouched)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        requirements: '',
    });
    const [submitted, setSubmitted] = useState(false);

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
        }, 800);
    };

    // Dynamic fields from admin
    const sections = page?.sections || {};

    // 1. Top Bar Section
    const topBarHeading = sections.top_bar_Heading ?? sections.top_bar?.title ?? 'CONTACT US';
    const topBarSubHeading = sections.top_bar_sub_heading ?? sections.top_bar?.subtitle ?? "We'd Love to Hear From You!";
    const topBarDescription = sections.top_bar_description ?? sections.top_bar?.description ?? "Have a query, feedback, or a special request? We're here to help and make your experience with Dayal Sweets even better.";

    // 2. Contact Information Section
    // email[] repeater
    const emails = Array.isArray(sections.emails) && sections.emails.length > 0
        ? sections.emails
        : (Array.isArray(sections.contact_info?.emails) && sections.contact_info.emails.length > 0
            ? sections.contact_info.emails.map((e) => (typeof e === 'object' ? e.email : e))
            : ['info@dayalsweets.com']);

    // phone[] repeater
    const phones = Array.isArray(sections.phones) && sections.phones.length > 0
        ? sections.phones
        : (Array.isArray(sections.contact_info?.phones) && sections.contact_info.phones.length > 0
            ? sections.contact_info.phones.map((p) => (typeof p === 'object' ? p.phone : p))
            : ['+91 98765 43210']);

    // Opening Hours
    const openingHours = sections.opening_hours ??
        (sections.contact_info?.hours?.[0]
            ? (typeof sections.contact_info.hours[0] === 'object'
                ? `${sections.contact_info.hours[0].days} ( ${sections.contact_info.hours[0].time} )`
                : sections.contact_info.hours[0])
            : 'Mon-Sun ( 07:00 AM - 12:00 AM )');

    return (
        <div className="dayal-contact-page">
            <Head title="Contact Us - Dayal Sweets" />

            {/* Modular Reusable Header (Active on CONTACT US) */}
            <Header auth={auth} />

            {/* ========================================================= */}
            {/* 1. HERO BANNER (Canonical Red Banner)                     */}
            {/* ========================================================= */}
            <ContactHero
                breadcrumbs={[
                    { label: 'HOME', url: '/' },
                    { label: topBarHeading, url: null },
                ]}
                title={topBarHeading}
                subtitle={topBarSubHeading}
                description={topBarDescription}
            />

            {/* ========================================================= */}
            {/* 2. CONTACT FORM & INFORMATION SECTION                      */}
            {/* ========================================================= */}
            <section className="contact-page-main-section">
                {/* Left Feather Watermark (image-48.png) */}
                <img
                    src="/uploads/2026/07/image-48.png"
                    alt=""
                    className="contact-page-watermark-feather"
                    aria-hidden="true"
                />

                {/* Right Peacock Watermark (Peacock.png) */}
                <img
                    src="/uploads/2026/08/Peacock.png"
                    alt=""
                    className="contact-page-watermark-peacock"
                    aria-hidden="true"
                />

                <div className="contact-page-container">
                    {/* LEFT COLUMN: Send Us a Message Card */}
                    <div className="contact-form-card">
                        <h2 className="contact-form-title">
                            Send Us a <span className="rt-span-color">Message</span>
                        </h2>

                        {submitted && (
                            <div className="contact-form-status">
                                Thank you! Your message has been received. Our team will contact you shortly.
                            </div>
                        )}

                        <form className="contact-form-inner-wrapper" onSubmit={handleFormSubmit}>
                            {/* Row 1: Name & Phone */}
                            <div className="contact-form-row">
                                <div className="contact-form-field">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your Name*"
                                        required
                                    />
                                </div>
                                <div className="contact-form-field">
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
                            <div className="contact-form-row">
                                <div className="contact-form-field">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email Address*"
                                        required
                                    />
                                </div>
                                <div className="contact-form-field">
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
                            <div className="contact-form-field contact-form-field-full">
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
                            <div className="contact-form-submit">
                                <button type="submit" className="contact-form-submit-btn">
                                    SEND MESSAGE
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: 3 Stacked Info Cards */}
                    <div className="contact-info-column">
                        {/* Floating Pistachio (Top Right) */}
                        <img
                            src="/uploads/2026/07/image-166.png"
                            alt="Pistachio Garnish"
                            className="contact-info-decor-pistachio"
                            aria-hidden="true"
                        />

                        {/* Card 1: Email Us (email[]) */}
                        <div className="contact-info-card">
                            <p className="contact-info-label">
                                Email <span className="rt-span-color">Us</span>
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {emails.map((email, idx) => (
                                    <h5 key={idx} className="contact-info-value" style={{ margin: 0 }}>
                                        <a href={`mailto:${email}`} className="anchor-tag">
                                            {email}
                                        </a>
                                    </h5>
                                ))}
                            </div>
                            <p className="contact-info-subtext">We'll reply as soon as possible..</p>
                        </div>

                        {/* Card 2: Opening Hours */}
                        <div className="contact-info-card">
                            <p className="contact-info-label">
                                Opening <span className="rt-span-color">Hours</span>
                            </p>
                            <h5 className="contact-info-value highlight-burgundy">
                                {openingHours}
                            </h5>
                            <p className="contact-info-subtext">Open all days</p>
                        </div>

                        {/* Card 3: Contact Us (phone[]) */}
                        <div className="contact-info-card">
                            <p className="contact-info-label">
                                Contact <span className="rt-span-color">Us</span>
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {phones.map((phone, idx) => (
                                    <h5 key={idx} className="contact-info-value" style={{ margin: 0 }}>
                                        <a href={`tel:${phone.replace(/\s+/g, '')}`} className="anchor-tag">
                                            {phone}
                                        </a>
                                    </h5>
                                ))}
                            </div>
                            <p className="contact-info-subtext">We're here to help you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reusable Modular Outlets Section */}
            <Outlets />

            {/* Modular Site-wide Reusable Footer */}
            <Footer />
        </div>
    );
}
