import React from 'react';
import { Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { CheckCircleIcon, StarIcon, ShieldCheckIcon, TruckIcon } from '@/Components/Icons';

export default function GuestLayout({ 
    children, 
    title = 'Welcome to Dayal Sweets', 
    subtitle = 'Sign in or create an account to start shopping authentic sweets' 
}) {
    return (
        <div className="dayal-page-shell">
            <Header />

            <main className="dayal-main-content">
                <div className="dayal-auth-wrapper">
                    <div className="dayal-auth-box">
                        {/* Left Showcase Banner - Deep Royal Maroon with Gold accents */}
                        <div className="dayal-auth-banner">
                            <div>
                                <div className="banner-badge">
                                    <StarIcon width="14" height="14" />
                                    <span>Himachal’s Pride • Since 1962</span>
                                </div>

                                <h2 className="banner-title">
                                    Crafting <span className="highlight">Himachal's Most Loved</span> Sweet Moments.
                                </h2>

                                <p className="banner-description">
                                    Handcrafted with time-honoured recipes, the finest Goan cashews, and pure churned desi ghee. Every bite tells a story of heritage, love, and uncompromising quality.
                                </p>

                                <div className="banner-perks">
                                    <div className="perk-item">
                                        <div className="perk-icon">
                                            <CheckCircleIcon width="16" height="16" />
                                        </div>
                                        <span>100% Pure Desi Ghee & Vegetarian Kitchen</span>
                                    </div>

                                    <div className="perk-item">
                                        <div className="perk-icon">
                                            <ShieldCheckIcon width="16" height="16" />
                                        </div>
                                        <span>Zero Preservatives & 999 Pure Silver Vark</span>
                                    </div>

                                    <div className="perk-item">
                                        <div className="perk-icon">
                                            <TruckIcon width="16" height="16" />
                                        </div>
                                        <span>Express Aroma-Lock Insulated City Dispatch</span>
                                    </div>
                                </div>
                            </div>

                            <div className="banner-footer">
                                {/* Circular 60+ Years Stamp Seal */}
                                <div className="banner-seal">
                                    <strong>60+</strong>
                                    <span>Years Tradition</span>
                                </div>

                                <Link href="/" className="banner-return-link">
                                    ← Return to Store
                                </Link>
                            </div>
                        </div>

                        {/* Right Form Panel */}
                        <div className="dayal-auth-form-panel">
                            <div className="dayal-auth-brand">
                                <Link href="/">
                                    <ApplicationLogo showText={true} />
                                </Link>
                            </div>

                            <div className="dayal-auth-title-block">
                                <h2>{title}</h2>
                                <p>{subtitle}</p>
                            </div>

                            {children}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
