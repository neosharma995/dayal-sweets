import React from 'react';
import { Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export default function GuestLayout({ 
    children, 
    title = 'Welcome to Dayal Sweets', 
    subtitle = 'Sign in or create an account to start shopping authentic sweets',
    hideTitleBlock = false,
}) {
    return (
        <div className="dayal-page-shell">
            <Header />

            <main className="dayal-main-content">
                <div className="dayal-auth-wrapper">
                    <div className="dayal-auth-box">
                        {/* Left Heritage Showcase Banner */}
                        <div className="dayal-auth-banner">
                            <div className="banner-content-top">
                                <div className="banner-heritage-badge">
                                    <Sparkles size={13} />
                                    <span>Since 1952 • Una, Himachal</span>
                                </div>

                                <h2 className="banner-headline">
                                    Pure Desi Ghee Sweets Crafted Across Three Generations.
                                </h2>

                                <p className="banner-subtext">
                                    Every delicacy at Dayal Sweets is slow-crafted using authentic family recipes, 100% pure desi ghee, and the finest natural Himalayan ingredients.
                                </p>

                                <div className="banner-features">
                                    <div className="banner-feature-item">
                                        <CheckCircle2 size={16} />
                                        <span>100% Pure Desi Ghee &amp; Zero Preservatives</span>
                                    </div>
                                    <div className="banner-feature-item">
                                        <CheckCircle2 size={16} />
                                        <span>Freshly Handcrafted Daily in Small Batches</span>
                                    </div>
                                    <div className="banner-feature-item">
                                        <CheckCircle2 size={16} />
                                        <span>Express Climate-Controlled Delivery Across India</span>
                                    </div>
                                </div>
                            </div>

                            <div className="banner-content-bottom">
                                <div className="banner-stamp">
                                    <span className="stamp-years">70+</span>
                                    <span className="stamp-text">Years of Heritage</span>
                                </div>

                                <Link href="/" className="banner-back-link">
                                    <ArrowLeft size={14} />
                                    <span>Back to Store</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right Form Panel */}
                        <div className="dayal-auth-form-panel">
                            {!hideTitleBlock && title && (
                                <div className="dayal-auth-title-block">
                                    <h2>{title}</h2>
                                    {subtitle && <p>{subtitle}</p>}
                                </div>
                            )}

                            {children}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
