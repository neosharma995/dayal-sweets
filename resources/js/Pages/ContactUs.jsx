import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import ContactForm from '@/Components/contact/ContactForm';
import ContactInfo from '@/Components/contact/ContactInfo';
import '../../scss/pages/_contact.scss';

export default function ContactUs({ auth }) {
    return (
        <div className="contact-page-root">
            <Head title="Contact Us | Dayal Sweets" />

            {/* Existing Header Component */}
            <Header auth={auth} />

            <main>
                {/* Section A: Common Red Hero Banner (Reusable) */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: 'CONTACT US', url: null },
                    ]}
                    title="CONTACT US"
                    subtitle="We'd Love to Hear From You!"
                    description="Have a query, feedback, or a special request? We're here to help and make your experience with Dayal Sweets even better."
                />

                {/* Section B: Contact Form & Information Cards */}
                <section className="contact-page-main-section">
                    <div className="contact-page-container">
                        {/* Left Column: Send Us a Message Card */}
                        <ContactForm />

                        {/* Right Column: 3 Contact Info Cards */}
                        <ContactInfo />
                    </div>

                    {/* Decorative Watermark Graphics */}
                    <img
                        src="/uploads/2026/07/image-48.png"
                        alt=""
                        className="contact-page-watermark-feather"
                        aria-hidden="true"
                    />
                    <img
                        src="/uploads/2026/08/Peacock.png"
                        alt=""
                        className="contact-page-watermark-peacock"
                        aria-hidden="true"
                    />
                </section>

                {/* Section C: Premium Outlets is intentionally SKIPPED as instructed */}
            </main>

            {/* Section D (Promotional CTA) & Section E (Footer) via Existing Reusable Footer */}
            <Footer />
        </div>
    );
}
