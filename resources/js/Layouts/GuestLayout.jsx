import React from 'react';
import { Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { CheckCircle2, Star, ShieldCheck, Truck, Gift, ArrowLeft, Heart } from 'lucide-react';

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
                        {/* Left Showcase Banner - Deep Royal Maroon with Gold accents */}
                        <div className="dayal-auth-banner">
                            <div>
                                <div className="banner-badge">
                                    <Star size={13} fill="#D4AF37" color="#D4AF37" />
                                    <span>Himachal’s Pride • Since 1952</span>
                                </div>

                                <h2 className="banner-title">
                                    Crafting <span className="highlight">Himachal's Most Loved</span> Sweet Moments.
                                </h2>

                                <p className="banner-description">
                                    Handcrafted with time-honoured recipes, the finest Goan cashews, and pure churned desi ghee. Every bite tells a story of heritage, love, and uncompromising quality.
                                </p>

                                {/* Floating Sweet Showcase Card */}
                                <div className="banner-sweet-showcase">
                                    <div className="showcase-img-box">
                                        <img
                                            src="/uploads/2026/07/kaaju-katli.png"
                                            alt="Royal Kaju Katli"
                                            onError={(e) => {
                                                e.currentTarget.src = '/uploads/2026/07/kaaju-katli.png';
                                            }}
                                        />
                                    </div>
                                    <div className="showcase-info">
                                        <div className="showcase-title">Royal Kaju Katli</div>
                                        <div className="showcase-desc">100% Pure Desi Ghee &amp; 999 Silver Vark</div>
                                        <div className="showcase-rating-row">
                                            <div className="stars">★★★★★</div>
                                            <span className="rating-val">4.9</span>
                                            <span className="reviews-cnt">(15,200+ Reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="banner-perks">
                                    <div className="perk-item">
                                        <div className="perk-icon">
                                            <Gift size={16} />
                                        </div>
                                        <span><strong>100 Bonus Points</strong> credited on joining</span>
                                    </div>

                                    <div className="perk-item">
                                        <div className="perk-icon">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span>100% Pure Desi Ghee &amp; Zero Preservatives</span>
                                    </div>

                                    <div className="perk-item">
                                        <div className="perk-icon">
                                            <Truck size={16} />
                                        </div>
                                        <span>Express Insulated Climate-Controlled Delivery</span>
                                    </div>
                                </div>
                            </div>

                            <div className="banner-footer">
                                {/* Circular 70+ Years Stamp Seal */}
                                <div className="banner-seal">
                                    <strong>70+</strong>
                                    <span>Years Tradition</span>
                                </div>

                                <Link href="/" className="banner-return-link">
                                    <ArrowLeft size={14} />
                                    <span>Return to Store</span>
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
