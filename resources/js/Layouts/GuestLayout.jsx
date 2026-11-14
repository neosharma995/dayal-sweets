import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { CheckCircleIcon, StarIcon, ShieldCheckIcon, TruckIcon } from '@/Components/Icons';

export default function GuestLayout({ 
    children, 
    title = 'Welcome to Dayal Sweets', 
    subtitle = 'Sign in or create an account to start shopping authentic sweets' 
}) {
    return (
        <div className="dayal-auth-wrapper font-sans">
            <div className="dayal-auth-card">
                {/* Left Showcase Banner - Deep Royal Maroon with Gold accents */}
                <div className="dayal-auth-banner">
                    <div>
                        <div className="banner-badge">
                            <StarIcon className="w-3.5 h-3.5 fill-current" />
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
                                    <CheckCircleIcon className="w-4 h-4" />
                                </div>
                                <span>100% Pure Desi Ghee & Vegetarian Kitchen</span>
                            </div>

                            <div className="perk-item">
                                <div className="perk-icon">
                                    <ShieldCheckIcon className="w-4 h-4" />
                                </div>
                                <span>Zero Preservatives & 999 Pure Silver Vark</span>
                            </div>

                            <div className="perk-item">
                                <div className="perk-icon">
                                    <TruckIcon className="w-4 h-4" />
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

                        <Link href="/" className="text-[#E6C88A] hover:text-white font-bold transition-colors">
                            ← Return to Store
                        </Link>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="dayal-auth-form-panel">
                    <div className="dayal-auth-brand">
                        <Link href="/" className="flex items-center gap-3 group">
                            <ApplicationLogo className="w-11 h-11" showText={true} />
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h2 className="font-serif text-2xl font-black text-[#631826] tracking-tight">{title}</h2>
                        <p className="text-xs text-stone-500 mt-1">{subtitle}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
