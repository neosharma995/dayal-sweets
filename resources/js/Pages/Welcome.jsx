import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { StarIcon, StoreIcon, UserIcon, CheckCircleIcon, ShieldCheckIcon, TruckIcon } from '@/Components/Icons';

export default function Welcome({ auth }) {
    const [activeSlide, setActiveSlide] = useState(1);
    const [activeFilter, setActiveFilter] = useState('all');

    const bestsellers = [
        {
            id: 1,
            name: 'Royal Silver Kaju Katli',
            category: 'dryfruit',
            weight: '1 kg box',
            price: 950,
            originalPrice: 1100,
            rating: 4.9,
            reviews: 428,
            tag: 'Top Bestseller',
            description: 'Diamond-cut luxury made with premium Goan cashews and 999 pure silver leaf (vark).',
            badgeColor: 'bg-[#631826] text-white',
        },
        {
            id: 2,
            name: 'Himachali Desi Ghee Doda Barfi',
            category: 'ghee',
            weight: '1 kg box',
            price: 680,
            originalPrice: 750,
            rating: 4.8,
            reviews: 312,
            tag: 'Himachal Pride',
            description: 'Slow-simmered rich sprouted wheat, fresh mawa, and crushed nuts with caramelized aroma.',
            badgeColor: 'bg-[#B88E4B] text-white',
        },
        {
            id: 3,
            name: 'Pure Desi Ghee Motichoor Laddu',
            category: 'ghee',
            weight: '500 gm / 1 kg',
            price: 340,
            originalPrice: 380,
            rating: 4.9,
            reviews: 580,
            tag: 'Temple Recipe',
            description: 'Golden micro-pearls fried in churned cow ghee, scented with saffron threads and cardamom.',
            badgeColor: 'bg-[#631826] text-white',
        },
        {
            id: 4,
            name: 'Sugar-Free Pista Badam Lauj',
            category: 'dryfruit',
            weight: '500 gm box',
            price: 820,
            originalPrice: 950,
            rating: 5.0,
            reviews: 195,
            tag: 'Guilt-Free Luxury',
            description: 'Crafted exclusively from roasted Iranian pistachios and California almonds without refined sugar.',
            badgeColor: 'bg-emerald-800 text-white',
        },
    ];

    const filteredProducts = activeFilter === 'all'
        ? bestsellers
        : bestsellers.filter(p => p.category === activeFilter);

    return (
        <div className="min-h-screen bg-[#FAF6F0] text-[#2B2523] flex flex-col font-sans selection:bg-[#631826] selection:text-white">
            <Head title="Dayal Sweets - Crafting Himachal's Most Loved Sweet Moments" />

            {/* Modular Reusable Header */}
            <Header auth={auth} />

            {/* ========================================================= */}
            {/* HERO SECTION - RECREATED FAITHFULLY FROM DESIGN REFERENCE */}
            {/* ========================================================= */}
            <section className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#EADBCA] py-12 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
                        
                        {/* Left Vertical Slider Counter (Desktop) */}
                        <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center gap-6 text-xs font-mono font-bold text-[#A8A29E]">
                            <button
                                onClick={() => setActiveSlide(1)}
                                className={`transition-all ${activeSlide === 1 ? 'text-[#631826] scale-125' : 'hover:text-stone-700'}`}
                            >
                                01
                            </button>
                            <div className="w-px h-16 bg-[#EADBCA] relative">
                                <div
                                    className="w-full bg-[#631826] transition-all duration-300"
                                    style={{
                                        height: '33%',
                                        transform: `translateY(${(activeSlide - 1) * 100}%)`,
                                    }}
                                ></div>
                            </div>
                            <button
                                onClick={() => setActiveSlide(2)}
                                className={`transition-all ${activeSlide === 2 ? 'text-[#631826] scale-125' : 'hover:text-stone-700'}`}
                            >
                                02
                            </button>
                            <button
                                onClick={() => setActiveSlide(3)}
                                className={`transition-all ${activeSlide === 3 ? 'text-[#631826] scale-125' : 'hover:text-stone-700'}`}
                            >
                                03
                            </button>
                        </div>

                        {/* Left Main Hero Typography & Call-to-Actions */}
                        <div className="lg:col-span-6 z-10 text-left">
                            {/* "OUR SPECIALTY" with fine line */}
                            <div className="inline-flex items-center gap-3 mb-4">
                                <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#78716C]">
                                    OUR SPECIALTY
                                </span>
                                <div className="w-12 h-px bg-[#C5A059]"></div>
                            </div>

                            {/* Headline: Crafting / Himachal Most / Loved Sweet / Moments */}
                            <h1 className="font-serif leading-[1.08] tracking-tight text-stone-900">
                                <span className="block text-4xl sm:text-5xl lg:text-6xl font-light text-[#2B2523]">
                                    Crafting
                                </span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#631826] my-1">
                                    Himachal Most
                                </span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl font-light text-[#2B2523]">
                                    Loved Sweet
                                </span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#B88E4B]">
                                    Moments
                                </span>
                            </h1>

                            {/* Descriptive paragraph */}
                            <p className="mt-6 text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-lg font-normal">
                                Handcrafted with time-honoured recipes, the finest ingredients, and generations of sweet-making mastery. Every bite tells a story of heritage, love, and uncompromising quality.
                            </p>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <button
                                    onClick={() => {
                                        const el = document.getElementById('bestsellers-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-6 py-3.5 bg-[#631826] hover:bg-[#4A0E1A] text-white text-xs font-bold uppercase tracking-widest rounded-sm shadow-md shadow-[#631826]/20 transition-all flex items-center gap-2 group"
                                >
                                    <span>SHOP ONLINE</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>

                                <button
                                    onClick={() => alert('Corporate & Wedding Gifting Catalog: Dial +91 98765 43210 for bespoke gift hampers.')}
                                    className="px-6 py-3.5 border border-[#631826] text-[#631826] hover:bg-[#631826]/5 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
                                >
                                    CORPORATE GIFTING
                                </button>
                            </div>
                        </div>

                        {/* Right Food Artistry Showcase (Kaju Katli Diamond Art) */}
                        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[420px]">
                            {/* Floating roasted cashews & golden crumbs */}
                            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                                
                                {/* Background Glow */}
                                <div className="absolute inset-0 bg-radial from-amber-200/40 via-transparent to-transparent rounded-full filter blur-2xl pointer-events-none"></div>

                                {/* Stacked Silver Kaju Katli Artwork Component */}
                                <div className="relative z-10 w-full h-full flex items-center justify-center">
                                    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Soft Shadow */}
                                        <ellipse cx="200" cy="330" rx="140" ry="30" fill="#2B2523" fillOpacity="0.12" filter="blur(10px)" />

                                        {/* Bottom Layer Kaju Katli Diamonds */}
                                        <g transform="translate(140, 240)">
                                            {/* Diamond 1 */}
                                            <polygon points="0,30 70,0 140,30 70,60" fill="#E6D7B8" stroke="#D4C29E" strokeWidth="1" />
                                            <polygon points="5,30 70,3 135,30 70,57" fill="#F4EDE0" fillOpacity="0.85" />
                                            <polygon points="20,25 65,10 90,25 50,35" fill="#FFFFFF" fillOpacity="0.9" />
                                            {/* Silver leaf foil cracks */}
                                            <path d="M30 20 L50 35 L70 25 M60 15 L75 22" stroke="#B8B0A0" strokeWidth="0.75" />
                                        </g>

                                        {/* Mid Layer Kaju Katli Diamonds */}
                                        <g transform="translate(100, 180)">
                                            <polygon points="0,35 80,0 160,35 80,70" fill="#DECBA8" stroke="#CCA77A" strokeWidth="1" />
                                            <polygon points="5,35 80,4 155,35 80,66" fill="#F8F3EA" />
                                            {/* Silver foil texture */}
                                            <polygon points="25,30 80,8 120,30 70,45" fill="#FFFFFF" fillOpacity="0.95" />
                                            <path d="M40 25 L75 40 L110 25 M85 18 L100 28" stroke="#B0A898" strokeWidth="0.8" />
                                        </g>

                                        {/* Top Stack Kaju Katli Diamonds with Silver Leaf */}
                                        <g transform="translate(150, 110)">
                                            <polygon points="0,40 75,0 150,40 75,80" fill="#E5D4B3" stroke="#C5A059" strokeWidth="1" />
                                            <polygon points="6,40 75,5 144,40 75,75" fill="#FAF5ED" />
                                            {/* Pure Silver Vark Layer */}
                                            <polygon points="15,38 75,10 130,38 75,55" fill="#FFFFFF" />
                                            <polygon points="30,32 75,14 110,32 75,45" fill="#F0ECE4" fillOpacity="0.8" />
                                            <path d="M35 30 L65 42 L105 28 M70 18 L90 28" stroke="#9A9282" strokeWidth="1" />
                                        </g>

                                        {/* Topmost angled slice */}
                                        <g transform="translate(180, 50)">
                                            <polygon points="0,35 60,0 120,35 60,70" fill="#EFE5D0" stroke="#B88E4B" strokeWidth="1.2" />
                                            <polygon points="5,35 60,4 115,35 60,66" fill="#FFFFFF" />
                                            <path d="M25 28 L55 38 L95 24" stroke="#8E8676" strokeWidth="0.9" />
                                        </g>

                                        {/* Roasted Cashew Nuts Scattered with Details */}
                                        {/* Cashew 1 */}
                                        <path d="M80 250 C70 235, 90 220, 105 235 C115 245, 105 265, 90 265 C78 265, 85 255, 80 250 Z" fill="#E2BA78" stroke="#B88E4B" strokeWidth="1.5" />
                                        <ellipse cx="92" cy="242" rx="4" ry="2" fill="#FAF5ED" />

                                        {/* Cashew 2 (Floating Top) */}
                                        <path d="M270 95 C265 85, 280 75, 290 85 C298 92, 292 105, 282 105 C275 105, 278 98, 270 95 Z" fill="#E2BA78" stroke="#B88E4B" strokeWidth="1.5" />

                                        {/* Cashew 3 (Bottom Right) */}
                                        <path d="M295 300 C285 285, 305 270, 320 285 C330 295, 320 315, 305 315 C293 315, 300 305, 295 300 Z" fill="#DEB168" stroke="#B88E4B" strokeWidth="1.5" />

                                        {/* Pistachio & Golden Crumbs Particles */}
                                        <circle cx="120" cy="140" r="3" fill="#2E4A28" />
                                        <circle cx="240" cy="190" r="3" fill="#B88E4B" />
                                        <circle cx="280" cy="140" r="2.5" fill="#E2BA78" />
                                        <circle cx="140" cy="300" r="3" fill="#C5A059" />
                                        <circle cx="170" cy="315" r="2" fill="#2E4A28" />
                                        <circle cx="240" cy="285" r="2.5" fill="#B88E4B" />
                                        <circle cx="260" cy="310" r="3.5" fill="#E2BA78" />
                                    </svg>
                                </div>

                                {/* Circular "60+ YEARS OF SWEET TRADITIONS" Stamp Badge */}
                                <div className="absolute -bottom-2 right-4 z-20 w-24 h-24 rounded-full border border-[#B88E4B] bg-[#FAF6F0]/90 backdrop-blur-sm p-1 shadow-lg flex flex-col items-center justify-center text-center select-none">
                                    <div className="w-full h-full rounded-full border border-dashed border-[#B88E4B]/60 flex flex-col items-center justify-center">
                                        <span className="font-serif font-black text-xl text-[#B88E4B] leading-none">
                                            60+
                                        </span>
                                        <span className="text-[8px] font-bold tracking-widest uppercase text-[#631826] leading-tight mt-0.5">
                                            Years Of
                                        </span>
                                        <span className="text-[7px] font-semibold tracking-wider uppercase text-stone-500 leading-tight">
                                            Sweet Traditions
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Vertical Social "FOLLOW US" on extreme right */}
                <div className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-30 text-[#78716C]">
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.3em] rotate-90 mb-6 origin-center select-none">
                        FOLLOW US
                    </span>
                    <a href="#instagram" className="p-1.5 hover:text-[#631826] transition-colors" title="Instagram">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                    <a href="#facebook" className="p-1.5 hover:text-[#631826] transition-colors" title="Facebook">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                    </a>
                    <a href="#youtube" className="p-1.5 hover:text-[#631826] transition-colors" title="YouTube">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                    </a>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SIGNATURE PRODUCTS & BESTSELLERS SECTION */}
            {/* ========================================================= */}
            <section id="bestsellers-section" className="py-16 lg:py-24 bg-white border-b border-[#EADBCA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Section Header */}
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#B88E4B]">
                            HANDCRAFTED IN PURE DESI GHEE
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#631826] mt-2 tracking-tight">
                            Himachal’s Finest Royal Mithai
                        </h2>
                        <div className="w-16 h-0.5 bg-[#B88E4B] mx-auto mt-3 mb-4"></div>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                            Prepared with freshly churned butter and handpicked dry fruits. Dispatched in airtight aroma-preserving insulated gift boxes.
                        </p>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                                    activeFilter === 'all'
                                        ? 'bg-[#631826] text-white shadow-sm'
                                        : 'bg-[#FAF6F0] text-stone-600 hover:bg-[#F3EBDD]'
                                }`}
                            >
                                All Varieties
                            </button>
                            <button
                                onClick={() => setActiveFilter('dryfruit')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                                    activeFilter === 'dryfruit'
                                        ? 'bg-[#631826] text-white shadow-sm'
                                        : 'bg-[#FAF6F0] text-stone-600 hover:bg-[#F3EBDD]'
                                }`}
                            >
                                Dry Fruit Sweets
                            </button>
                            <button
                                onClick={() => setActiveFilter('ghee')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                                    activeFilter === 'ghee'
                                        ? 'bg-[#631826] text-white shadow-sm'
                                        : 'bg-[#FAF6F0] text-stone-600 hover:bg-[#F3EBDD]'
                                }`}
                            >
                                Pure Desi Ghee
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#FAF6F0] rounded-xl border border-[#EADBCA] p-5 shadow-sm hover:shadow-xl hover:border-[#631826]/40 transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Badge & Rating */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.badgeColor}`}>
                                            {item.tag}
                                        </span>
                                        <div className="flex items-center gap-1 text-[#B88E4B] text-xs font-bold">
                                            <StarIcon className="w-3.5 h-3.5 fill-current" />
                                            <span>{item.rating}</span>
                                        </div>
                                    </div>

                                    {/* Visual Sweet Placeholder Artwork */}
                                    <div className="h-44 rounded-lg bg-white border border-[#EADBCA] mb-4 flex items-center justify-center p-3 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                                        <div className="text-center">
                                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#FAF6F0] to-amber-100 border border-[#B88E4B]/30 flex items-center justify-center shadow-inner">
                                                <span className="font-serif font-black text-3xl text-[#631826]">
                                                    {item.name.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B88E4B] block mt-2">
                                                100% Desi Ghee
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title & Desc */}
                                    <h3 className="font-serif font-bold text-stone-900 text-base group-hover:text-[#631826] transition-colors leading-snug">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Pricing & Add Button */}
                                <div className="mt-5 pt-4 border-t border-[#EADBCA] flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] text-stone-500 block">{item.weight}</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="font-serif text-lg font-black text-[#631826]">
                                                ₹{item.price}
                                            </span>
                                            <span className="text-xs text-stone-400 line-through">
                                                ₹{item.originalPrice}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => alert(`Added "${item.name}" to Dayal Sweets Cart!`)}
                                        className="px-3.5 py-2 bg-[#631826] hover:bg-[#4A0E1A] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* HERITAGE & ROLE ACCESS PORTALS OVERVIEW */}
            {/* ========================================================= */}
            <section className="py-16 bg-[#FAF6F0] border-b border-[#EADBCA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-xl mx-auto mb-10">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#B88E4B]">
                            SECURE ROLE-BASED ARCHITECTURE
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#631826] mt-1">
                            Tailored Experience for Customers & Store Admins
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Admin Portal Card */}
                        <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#EADBCA] shadow-sm hover:border-[#631826]/40 transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="w-12 h-12 rounded-lg bg-[#631826]/10 text-[#631826] border border-[#631826]/20 flex items-center justify-center font-bold">
                                        <StoreIcon className="w-6 h-6" />
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#631826] text-white">
                                        Admin Role
                                    </span>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-[#631826]">Admin Console & Dispatch Desk</h3>
                                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                                    Complete store oversight: real-time sales revenue (₹), live order fulfillment, low-stock sweet alerts, and business credentials.
                                </p>
                                <div className="mt-4 p-3 rounded bg-[#FAF6F0] border border-[#EADBCA] text-xs font-mono text-stone-600">
                                    <p><span className="text-[#631826] font-bold">Email:</span> admin@dayalsweets.com</p>
                                    <p><span className="text-[#631826] font-bold">Password:</span> password</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-[#EADBCA]">
                                <Link
                                    href={route('admin.dashboard')}
                                    className="w-full text-center block py-2.5 bg-[#631826] hover:bg-[#4A0E1A] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                                >
                                    Access Admin Portal →
                                </Link>
                            </div>
                        </div>

                        {/* Customer Portal Card */}
                        <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#EADBCA] shadow-sm hover:border-[#631826]/40 transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
                                        <UserIcon className="w-6 h-6" />
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#B88E4B] text-white">
                                        Customer Role
                                    </span>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-stone-900">Customer Rewards & Order Tracker</h3>
                                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                                    Interactive live sweet delivery tracker, Sweet Rewards loyalty points, 1-click reorder, saved delivery addresses, and invoices.
                                </p>
                                <div className="mt-4 p-3 rounded bg-[#FAF6F0] border border-[#EADBCA] text-xs font-mono text-stone-600">
                                    <p><span className="text-[#B88E4B] font-bold">Email:</span> customer@dayalsweets.com</p>
                                    <p><span className="text-[#B88E4B] font-bold">Password:</span> password</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-[#EADBCA]">
                                <Link
                                    href={route('customer.dashboard')}
                                    className="w-full text-center block py-2.5 bg-[#B88E4B] hover:bg-[#9E783B] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                                >
                                    Access Customer Portal →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modular Reusable Footer */}
            <Footer />
        </div>
    );
}
