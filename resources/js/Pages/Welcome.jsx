import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { StarIcon, StoreIcon, UserIcon } from '@/Components/Icons';

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
            badgeClass: 'dayal-badge dayal-badge--maroon',
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
            badgeClass: 'dayal-badge dayal-badge--gold',
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
            badgeClass: 'dayal-badge dayal-badge--maroon',
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
            badgeClass: 'dayal-badge dayal-badge--green',
        },
    ];

    const filteredProducts = activeFilter === 'all'
        ? bestsellers
        : bestsellers.filter(p => p.category === activeFilter);

    return (
        <div className="dayal-page-shell">
            <Head title="Dayal Sweets - Crafting Himachal's Most Loved Sweet Moments" />

            {/* Modular Reusable Header */}
            <Header auth={auth} />

            {/* ========================================================= */}
            {/* HERO SECTION - RECREATED FAITHFULLY FROM DESIGN REFERENCE */}
            {/* ========================================================= */}
            <section className="dayal-hero-section">
                <div className="dayal-hero-container">
                    <div className="dayal-hero-grid">
                        
                        {/* Left Vertical Slider Counter (Desktop) */}
                        <div className="dayal-hero-slider-nav">
                            <button
                                onClick={() => setActiveSlide(1)}
                                className={activeSlide === 1 ? 'active' : ''}
                            >
                                01
                            </button>
                            <div className="dayal-slider-track">
                                <div className={`dayal-slider-thumb dayal-slider-thumb--${activeSlide}`} />
                            </div>
                            <button
                                onClick={() => setActiveSlide(2)}
                                className={activeSlide === 2 ? 'active' : ''}
                            >
                                02
                            </button>
                            <button
                                onClick={() => setActiveSlide(3)}
                                className={activeSlide === 3 ? 'active' : ''}
                            >
                                03
                            </button>
                        </div>

                        {/* Left Main Hero Typography & Call-to-Actions */}
                        <div className="dayal-hero-content">
                            <div className="dayal-hero-specialty">
                                <span>OUR SPECIALTY</span>
                            </div>

                            <h1 className="dayal-hero-title">
                                <span className="dayal-title-line">Crafting</span>
                                <span className="dayal-title-line">Himachal Most</span>
                                <span className="dayal-title-line dayal-gold-accent">Loved Sweet</span>
                                <span className="dayal-title-line dayal-gold-accent">Moments</span>
                            </h1>

                            <p className="dayal-hero-description">
                                Handcrafted with time-honoured recipes, the finest ingredients, and generations of sweet-making mastery. Every bite tells a story of heritage, love, and uncompromising quality.
                            </p>

                            <div className="dayal-hero-cta-group">
                                <button
                                    onClick={() => {
                                        const el = document.getElementById('bestsellers-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="dayal-cta-shop"
                                >
                                    <span>SHOP ONLINE</span>
                                    <span>→</span>
                                </button>

                                <button
                                    onClick={() => alert('Corporate & Wedding Gifting Catalog: Dial +91 98765 43210 for bespoke gift hampers.')}
                                    className="dayal-cta-gifting"
                                >
                                    CORPORATE GIFTING
                                </button>
                            </div>
                        </div>

                        {/* Right Food Artistry Showcase (Kaju Katli Diamond Art) */}
                        <div className="dayal-hero-art">
                            <div className="dayal-katli-illustration">
                                <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Soft Shadow */}
                                    <ellipse cx="200" cy="330" rx="140" ry="30" fill="#2B2523" fillOpacity="0.12" />

                                    {/* Bottom Layer Kaju Katli Diamonds */}
                                    <g transform="translate(140, 240)">
                                        <polygon points="0,30 70,0 140,30 70,60" fill="#E6D7B8" stroke="#D4C29E" strokeWidth="1" />
                                        <polygon points="5,30 70,3 135,30 70,57" fill="#F4EDE0" fillOpacity="0.85" />
                                        <polygon points="20,25 65,10 90,25 50,35" fill="#FFFFFF" fillOpacity="0.9" />
                                        <path d="M30 20 L50 35 L70 25 M60 15 L75 22" stroke="#B8B0A0" strokeWidth="0.75" />
                                    </g>

                                    {/* Mid Layer Kaju Katli Diamonds */}
                                    <g transform="translate(100, 180)">
                                        <polygon points="0,35 80,0 160,35 80,70" fill="#DECBA8" stroke="#CCA77A" strokeWidth="1" />
                                        <polygon points="5,35 80,4 155,35 80,66" fill="#F8F3EA" />
                                        <polygon points="25,30 80,8 120,30 70,45" fill="#FFFFFF" fillOpacity="0.95" />
                                        <path d="M40 25 L75 40 L110 25 M85 18 L100 28" stroke="#B0A898" strokeWidth="0.8" />
                                    </g>

                                    {/* Top Stack Kaju Katli Diamonds with Silver Leaf */}
                                    <g transform="translate(150, 110)">
                                        <polygon points="0,40 75,0 150,40 75,80" fill="#E5D4B3" stroke="#C5A059" strokeWidth="1" />
                                        <polygon points="6,40 75,5 144,40 75,75" fill="#FAF5ED" />
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

                                    {/* Scattered Roasted Cashew Nuts */}
                                    <path d="M80 250 C70 235, 90 220, 105 235 C115 245, 105 265, 90 265 C78 265, 85 255, 80 250 Z" fill="#E2BA78" stroke="#B88E4B" strokeWidth="1.5" />
                                    <ellipse cx="92" cy="242" rx="4" ry="2" fill="#FAF5ED" />

                                    <path d="M270 95 C265 85, 280 75, 290 85 C298 92, 292 105, 282 105 C275 105, 278 98, 270 95 Z" fill="#E2BA78" stroke="#B88E4B" strokeWidth="1.5" />
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

                            {/* Circular 60+ Years Stamp Badge */}
                            <div className="dayal-heritage-badge">
                                <span className="dayal-badge-years">60+</span>
                                <span className="dayal-badge-label">Years of Sweet Traditions</span>
                            </div>
                        </div>

                        {/* Vertical Social "FOLLOW US" on extreme right */}
                        <div className="dayal-hero-social">
                            <span className="dayal-social-label">FOLLOW US</span>
                            <a href="#instagram" title="Instagram">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="#facebook" title="Facebook">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                            </a>
                            <a href="#youtube" title="YouTube">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SIGNATURE PRODUCTS & BESTSELLERS SECTION */}
            {/* ========================================================= */}
            <section id="bestsellers-section" className="dayal-bestsellers-section">
                <div className="dayal-container">
                    
                    {/* Section Header */}
                    <div className="dayal-bestsellers-header">
                        <span className="dayal-sub-tag">
                            HANDCRAFTED IN PURE DESI GHEE
                        </span>
                        <h2>Himachal’s Finest Royal Mithai</h2>
                        <p>
                            Prepared with freshly churned cow ghee and handpicked nuts. Dispatched in airtight aroma-preserving insulated gift boxes.
                        </p>

                        {/* Filter Tabs */}
                        <div className="dayal-filter-bar">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`dayal-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            >
                                All Varieties
                            </button>
                            <button
                                onClick={() => setActiveFilter('dryfruit')}
                                className={`dayal-filter-btn ${activeFilter === 'dryfruit' ? 'active' : ''}`}
                            >
                                Dry Fruit Sweets
                            </button>
                            <button
                                onClick={() => setActiveFilter('ghee')}
                                className={`dayal-filter-btn ${activeFilter === 'ghee' ? 'active' : ''}`}
                            >
                                Pure Desi Ghee
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="dayal-grid-4">
                        {filteredProducts.map((item) => (
                            <div key={item.id} className="dayal-sweet-card">
                                <div className="dayal-sweet-card-top">
                                    <span className={item.badgeClass}>
                                        {item.tag}
                                    </span>
                                    <div className="dayal-card-svg">
                                        <svg viewBox="0 0 100 100" fill="none">
                                            <circle cx="50" cy="50" r="40" fill="#FAF6F0" stroke="#B88E4B" strokeWidth="2" />
                                            <text x="50" y="58" textAnchor="middle" fontFamily="serif" fontSize="28" fontWeight="bold" fill="#631826">
                                                {item.name.charAt(0)}
                                            </text>
                                        </svg>
                                    </div>
                                </div>

                                <div className="dayal-sweet-card-body">
                                    <div className="dayal-sweet-rating">
                                        <StarIcon width="14" height="14" />
                                        <span>{item.rating} ({item.reviews})</span>
                                    </div>

                                    <h3 className="dayal-sweet-name">{item.name}</h3>
                                    <p className="dayal-sweet-desc">{item.description}</p>

                                    <div className="dayal-sweet-footer">
                                        <div className="dayal-price-box">
                                            <span className="dayal-weight-label">{item.weight}</span>
                                            <div>
                                                <span className="dayal-current-price">₹{item.price}</span>
                                                <span className="dayal-original-price">₹{item.originalPrice}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => alert(`Added "${item.name}" to Dayal Sweets Cart!`)}
                                            className="dayal-add-btn"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* HERITAGE & ROLE ACCESS PORTALS OVERVIEW */}
            {/* ========================================================= */}
            <section className="dayal-portals-section">
                <div className="dayal-container">
                    <div className="dayal-bestsellers-header">
                        <span className="dayal-sub-tag">
                            SECURE ROLE-BASED ARCHITECTURE
                        </span>
                        <h2>Tailored Experience for Customers & Store Admins</h2>
                    </div>

                    <div className="dayal-portal-grid">
                        {/* Admin Portal Card */}
                        <div className="dayal-portal-card dayal-portal-card--admin">
                            <div>
                                <div className="dayal-portal-icon dayal-portal-icon--admin">
                                    <StoreIcon width="24" height="24" />
                                </div>
                                <span className="dayal-badge dayal-badge--maroon">Admin Role</span>
                                <h3>Admin Console & Dispatch Desk</h3>
                                <p>
                                    Complete store oversight: real-time sales revenue, live sweet orders, inventory alerts, and credentials.
                                </p>
                                <div className="dayal-portal-credentials">
                                    <p><strong>Email:</strong> admin@dayalsweets.com</p>
                                    <p><strong>Password:</strong> password</p>
                                </div>
                            </div>
                            <div>
                                <Link
                                    href={route('admin.dashboard')}
                                    className="dayal-btn dayal-btn--primary dayal-btn--full"
                                >
                                    Access Admin Portal →
                                </Link>
                            </div>
                        </div>

                        {/* Customer Portal Card */}
                        <div className="dayal-portal-card">
                            <div>
                                <div className="dayal-portal-icon dayal-portal-icon--customer">
                                    <UserIcon width="24" height="24" />
                                </div>
                                <span className="dayal-badge dayal-badge--gold">Customer Role</span>
                                <h3>Customer Rewards & Order Tracker</h3>
                                <p>
                                    Interactive live sweet delivery tracker, Sweet Rewards loyalty points, saved addresses, and invoices.
                                </p>
                                <div className="dayal-portal-credentials">
                                    <p><strong>Email:</strong> customer@dayalsweets.com</p>
                                    <p><strong>Password:</strong> password</p>
                                </div>
                            </div>
                            <div>
                                <Link
                                    href={route('customer.dashboard')}
                                    className="dayal-btn dayal-btn--secondary dayal-btn--full"
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
