import React from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import FlashToaster from '@/Components/FlashToaster';
import ContactHero from '@/Components/contact/ContactHero';

export default function GuestLayout({ 
    children, 
    heroTitle = 'WELCOME TO DAYAL SWEETS', 
    heroSubtitle = '',
    heroDescription = 'Sign in with your password to access your account',
    breadcrumbLabel = 'LOGIN & REGISTER',
    cardMaxWidth = '440px',
}) {
    return (
        <div className="dayal-page-shell dayal-auth-shell dayal-auth-page">
            <Header />
            <FlashToaster />

            <main className="dayal-main-content">
                {/* Reusable Common Hero Banner used across inner pages (About Us, Contact Us, Shop, etc.) */}
                <ContactHero
                    className="dayal-auth-hero"
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: breadcrumbLabel, url: null },
                    ]}
                    title={heroTitle}
                    subtitle={heroSubtitle}
                    description={heroDescription}
                />

                {/* Auth Wrap & Centered Card - Exact 1:1 match to original WordPress wc-mobile-otp-auth */}
                <div className="dayal-otp-auth-wrap">
                    <div className="dayal-otp-auth-card" style={{ maxWidth: cardMaxWidth }}>
                        {children}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
