import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { CheckCircleIcon, ShieldCheckIcon, TruckIcon, StarIcon, PhoneIcon, MapPinIcon } from '@/Components/Icons';

export default function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail) {
            setSubscribed(true);
            setNewsletterEmail('');
        }
    };

    return (
        <footer className="dayal-footer">
            {/* Trust Badges Strip */}
            <div className="dayal-footer-trust-strip">
                <div className="dayal-trust-grid">
                    <div className="dayal-trust-card">
                        <div className="dayal-trust-icon">
                            <StarIcon width="20" height="20" />
                        </div>
                        <div className="dayal-trust-text">
                            <h4>100% Pure Desi Ghee</h4>
                            <p>Crafted strictly in churned cow ghee</p>
                        </div>
                    </div>

                    <div className="dayal-trust-card">
                        <div className="dayal-trust-icon">
                            <CheckCircleIcon width="20" height="20" />
                        </div>
                        <div className="dayal-trust-text">
                            <h4>Sanctified & Pure Veg</h4>
                            <p>No eggs or artificial stabilizers</p>
                        </div>
                    </div>

                    <div className="dayal-trust-card">
                        <div className="dayal-trust-icon">
                            <ShieldCheckIcon width="20" height="20" />
                        </div>
                        <div className="dayal-trust-text">
                            <h4>Daily Fresh Batches</h4>
                            <p>FSSAI Certified & 999 Pure Silver Vark</p>
                        </div>
                    </div>

                    <div className="dayal-trust-card">
                        <div className="dayal-trust-icon">
                            <TruckIcon width="20" height="20" />
                        </div>
                        <div className="dayal-trust-text">
                            <h4>Express City Delivery</h4>
                            <p>Sealed in aroma-lock insulated boxes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links & Newsletter */}
            <div className="dayal-footer-main">
                <div className="dayal-footer-grid">
                    {/* Brand Info */}
                    <div className="dayal-footer-brand">
                        <div className="dayal-footer-brand-header">
                            <ApplicationLogo showText={false} />
                            <div>
                                <h3>DAYAL SWEETS</h3>
                                <span>Trust. Tradition. Taste. • Since 1962</span>
                            </div>
                        </div>
                        <p>
                            Crafting Himachal’s most loved sweet moments for over six decades. Every delicacy is a tribute to pure taste, Himalayan heritage, and uncompromising quality.
                        </p>
                        <div className="dayal-footer-badges">
                            <span className="dayal-footer-pill">FSSAI: 10019011000123</span>
                            <span className="dayal-footer-pill">GSTIN: 07AAAAA0000A1Z5</span>
                        </div>
                    </div>

                    {/* Sweet Varieties */}
                    <div className="dayal-footer-links">
                        <h4>Signature Sweets</h4>
                        <ul>
                            <li><a href="#kaju-katli">Royal Silver Kaju Katli</a></li>
                            <li><a href="#motichoor">Himachali Desi Ghee Laddu</a></li>
                            <li><a href="#doda-barfi">Himachal Special Doda Barfi</a></li>
                            <li><a href="#pista-lauj">Sugar-Free Dry Fruit Lauj</a></li>
                            <li><a href="#bengali">Kesar Rasmalai & Cham Cham</a></li>
                            <li><a href="#hampers">Festive Celebration Hampers</a></li>
                        </ul>
                    </div>

                    {/* Customer Service & Portals */}
                    <div className="dayal-footer-links">
                        <h4>Customer Care</h4>
                        <ul>
                            <li><Link href={route('my-account')}>My Account Center</Link></li>
                            <li><Link href={route('dashboard')}>Track Live Orders</Link></li>
                            <li><a href="#corporate">Bulk & Corporate Inquiries</a></li>
                            <li><a href="#franchise">Franchise Opportunities</a></li>
                            <li><a href="#shipping">Delivery & Shipping Terms</a></li>
                            <li><Link href={route('admin.login')}>Store Manager Console →</Link></li>
                        </ul>
                    </div>

                    {/* Store Timings & Newsletter */}
                    <div className="dayal-footer-newsletter">
                        <h4>Store & Hotline</h4>
                        <div className="dayal-footer-hotline">
                            <div className="dayal-hotline-item">
                                <MapPinIcon width="16" height="16" />
                                <span>Main Market, Mall Road / Flagship Counter</span>
                            </div>
                            <div className="dayal-hotline-item">
                                <PhoneIcon width="16" height="16" />
                                <a href="tel:+919876543210">+91 98765 43210</a>
                            </div>
                            <p>Daily: 08:00 AM – 10:30 PM</p>
                        </div>

                        <h4>Festive Sweet Offers</h4>
                        <p>Subscribe for seasonal discount alerts and pre-orders:</p>
                        {subscribed ? (
                            <div className="dayal-alert dayal-alert--success">
                                <span>✓ Subscribed successfully!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleNewsletterSubmit} className="dayal-newsletter-form">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                                <button type="submit">Join</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="dayal-footer-bottom">
                <div className="dayal-bottom-inner">
                    <p>© {new Date().getFullYear()} Dayal Sweets Pvt. Ltd. All rights reserved. • Himachal's Most Loved Sweets</p>

                    <div className="dayal-payment-pills">
                        <span>Secure Payments:</span>
                        <span className="dayal-pay-pill">UPI</span>
                        <span className="dayal-pay-pill">RuPay</span>
                        <span className="dayal-pay-pill">Cards</span>
                        <span className="dayal-pay-pill">NetBanking</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
