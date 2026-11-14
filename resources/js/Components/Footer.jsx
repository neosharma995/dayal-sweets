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
        <footer className="bg-[#1F080D] text-[#FAF6F0] border-t border-[#430B15] font-sans">
            {/* Trust Badges Strip */}
            <div className="bg-[#2D0C13] border-b border-[#430B15] py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-lg bg-[#FAF6F0]/10 border border-[#C5A059]/40 text-[#E6C88A] flex items-center justify-center flex-shrink-0">
                            <StarIcon className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Pure Desi Ghee</h4>
                            <p className="text-[11px] text-[#EADBCA]/80">Crafted strictly in pure churned ghee</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-lg bg-[#FAF6F0]/10 border border-[#C5A059]/40 text-[#E6C88A] flex items-center justify-center flex-shrink-0">
                            <CheckCircleIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sanctified & Pure Veg</h4>
                            <p className="text-[11px] text-[#EADBCA]/80">No eggs or artificial stabilizers</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-lg bg-[#FAF6F0]/10 border border-[#C5A059]/40 text-[#E6C88A] flex items-center justify-center flex-shrink-0">
                            <ShieldCheckIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Daily Fresh Batches</h4>
                            <p className="text-[11px] text-[#EADBCA]/80">FSSAI Certified & 999 Pure Silver Vark</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-lg bg-[#FAF6F0]/10 border border-[#C5A059]/40 text-[#E6C88A] flex items-center justify-center flex-shrink-0">
                            <TruckIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Express City Delivery</h4>
                            <p className="text-[11px] text-[#EADBCA]/80">Sealed in aroma-lock insulated boxes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links & Newsletter */}
            <div className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Info */}
                    <div className="lg:col-span-2 space-y-4">
                        <ApplicationLogo className="w-12 h-12" showText={false} />
                        <div>
                            <span className="font-serif font-black text-2xl text-white tracking-wider block">DAYAL SWEETS</span>
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#E6C88A] font-bold block mt-1">
                                Trust. Tradition. Taste. • Since 1962
                            </span>
                        </div>
                        <p className="text-xs text-[#EADBCA]/90 leading-relaxed max-w-sm font-normal">
                            Crafting Himachal’s most loved sweet moments for over six decades. Every delicacy is a tribute to pure taste, Himalayan heritage, and uncompromising quality.
                        </p>
                        <div className="pt-2 text-[11px] text-[#EADBCA]/70 space-y-1">
                            <p>FSSAI License: <span className="font-mono text-white">10019011000123</span></p>
                            <p>GSTIN Registered: <span className="font-mono text-white">07AAAAA0000A1Z5</span></p>
                        </div>
                    </div>

                    {/* Sweet Varieties */}
                    <div>
                        <h4 className="font-serif text-sm font-bold text-white mb-4 uppercase tracking-wider border-b border-[#430B15] pb-2 text-[#E6C88A]">
                            Signature Sweets
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#kaju-katli" className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">Royal Silver Kaju Katli</a></li>
                            <li><a href="#motichoor" className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">Himachali Desi Ghee Laddu</a></li>
                            <li><a href="#doda-barfi" className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">Himachal Special Doda Barfi</a></li>
                            <li><a href="#pista-lauj" className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">Sugar-Free Dry Fruit Lauj</a></li>
                            <li><a href="#bengali" className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">Kesar Rasmalai & Cham Cham</a></li>
                            <li><a href="#hampers" className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">Festive Celebration Hampers</a></li>
                        </ul>
                    </div>

                    {/* Customer Service & Portals */}
                    <div>
                        <h4 className="font-serif text-sm font-bold text-white mb-4 uppercase tracking-wider border-b border-[#430B15] pb-2 text-[#E6C88A]">
                            Customer Care
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href={route('my-account')} className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">My Account Center</Link></li>
                            <li><Link href={route('dashboard')} className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">Track Live Orders</Link></li>
                            <li><a href="#corporate" className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">Bulk & Corporate Inquiries</a></li>
                            <li><a href="#franchise" className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">Franchise Opportunities</a></li>
                            <li><a href="#shipping" className="text-[#EADBCA]/80 hover:text-[#E6C88A] transition-colors block">Delivery & Shipping Terms</a></li>
                            <li><Link href={route('admin.login')} className="text-[#E6C88A]/60 hover:text-[#E6C88A] transition-colors block font-semibold">Store Manager Console →</Link></li>
                        </ul>
                    </div>

                    {/* Store Timings & Newsletter */}
                    <div>
                        <h4 className="font-serif text-sm font-bold text-white mb-4 uppercase tracking-wider border-b border-[#430B15] pb-2 text-[#E6C88A]">
                            Store & Hotline
                        </h4>
                        <div className="space-y-2 text-xs text-[#EADBCA]/90">
                            <div className="flex items-start gap-2">
                                <MapPinIcon className="w-4 h-4 text-[#E6C88A] flex-shrink-0 mt-0.5" />
                                <span>Main Market, Mall Road / Chandni Chowk Flagship</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="w-4 h-4 text-[#E6C88A] flex-shrink-0" />
                                <a href="tel:+919876543210" className="hover:text-white transition-colors font-bold">
                                    +91 98765 43210
                                </a>
                            </div>
                            <p className="text-[11px] text-[#EADBCA]/60 pt-1">
                                Open Daily: 08:00 AM – 10:30 PM
                            </p>
                        </div>

                        {/* Newsletter */}
                        <div className="mt-4 pt-3 border-t border-[#430B15]">
                            <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                                Subscribe for Festive Sweet Offers:
                            </p>
                            {subscribed ? (
                                <p className="text-xs text-emerald-400 font-semibold mt-2">
                                    ✓ Subscribed! You will receive sweet festive alerts.
                                </p>
                            ) : (
                                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mt-2">
                                    <input
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full px-3 py-1.5 bg-[#2D0C13] border border-[#430B15] rounded text-xs text-white placeholder-stone-400 outline-none focus:border-[#E6C88A]"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 bg-[#631826] hover:bg-[#7D1D2B] text-white text-xs font-bold uppercase rounded border border-[#C5A059]/40"
                                    >
                                        Join
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-[#140407] py-4 border-t border-[#380810]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#EADBCA]/60">
                    <div>
                        <p>© {new Date().getFullYear()} Dayal Sweets Pvt. Ltd. All rights reserved. • Himachal's Most Loved Sweets</p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                        <span>Secure Payments:</span>
                        <span className="px-2 py-0.5 rounded bg-[#2D0C13] border border-[#430B15] text-[#EADBCA] font-mono">UPI</span>
                        <span className="px-2 py-0.5 rounded bg-[#2D0C13] border border-[#430B15] text-[#EADBCA] font-mono">RuPay</span>
                        <span className="px-2 py-0.5 rounded bg-[#2D0C13] border border-[#430B15] text-[#EADBCA] font-mono">Cards</span>
                        <span className="px-2 py-0.5 rounded bg-[#2D0C13] border border-[#430B15] text-[#EADBCA] font-mono">COD</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
