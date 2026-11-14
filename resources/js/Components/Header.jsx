import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { UserIcon, CartIcon, LogOutIcon } from '@/Components/Icons';

export default function Header({ auth: propAuth }) {
    const pageProps = usePage().props;
    const auth = propAuth || pageProps.auth;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            alert(`Searching for "${searchQuery}" in Dayal Sweets...`);
            setSearchModalOpen(false);
        }
    };

    return (
        <header className="dayal-header-wrapper">
            {/* Top Bar - Deep Royal Maroon */}
            <div className="dayal-header-topbar">
                <div className="dayal-topbar-inner">
                    <div className="dayal-topbar-left">
                        <span>FREE DELIVERY ON ORDERS ABOVE ₹999</span>
                    </div>

                    <div className="dayal-topbar-links">
                        <a href="#delivery">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8h4l3 4v4a1 1 0 01-1 1h-1m-6 0h4" />
                            </svg>
                            <span>Delivery</span>
                        </a>

                        <a href="#franchise">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>Franchise</span>
                        </a>

                        <a href="#corporate">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
                            </svg>
                            <span>Bulk/Corporate Inquiry</span>
                        </a>

                        <a href="tel:+919876543210">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>+91 98765 43210</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <nav className="dayal-navbar">
                <div className="dayal-navbar-inner">
                    {/* Logo on Left */}
                    <Link href="/" className="dayal-brand">
                        <ApplicationLogo showText={true} />
                    </Link>

                    {/* Center Navigation Links */}
                    <div className="dayal-nav-menu">
                        <Link
                            href="/"
                            className={`dayal-nav-link ${route().current('home') ? 'active' : ''}`}
                        >
                            HOME
                        </Link>

                        {/* Shop dropdown */}
                        <div className="dayal-shop-dropdown-wrapper" onMouseLeave={() => setShopDropdownOpen(false)}>
                            <button
                                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                                onMouseEnter={() => setShopDropdownOpen(true)}
                                className="dayal-nav-link"
                            >
                                <span>SHOP</span>
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {shopDropdownOpen && (
                                <div className="dayal-shop-dropdown-card">
                                    <a href="#kaju-katli">Royal Kaju Katli (Pure Vark)</a>
                                    <a href="#motichoor">Himachali Desi Ghee Laddu</a>
                                    <a href="#doda-barfi">Special Doda Barfi</a>
                                    <a href="#dry-fruit">Sugar-Free Dry Fruit Lauj</a>
                                    <a href="#bengali">Kesar Rasmalai & Cham Cham</a>
                                </div>
                            )}
                        </div>

                        <a href="#dining" className="dayal-nav-link">DINNING</a>
                        <a href="#gifting" className="dayal-nav-link">GIFTING</a>
                        <a href="#about" className="dayal-nav-link">ABOUT US</a>
                        <a href="#gallery" className="dayal-nav-link">GALLERY</a>
                        <a href="#contact" className="dayal-nav-link">CONTACT US</a>

                        {/* Portal Switchers when logged in */}
                        {auth?.user && (
                            <>
                                <Link
                                    href={route('dashboard')}
                                    className={`dayal-nav-link ${route().current('customer.dashboard') ? 'active' : ''}`}
                                >
                                    DASHBOARD
                                </Link>
                                {auth.user.roles?.includes('admin') && (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="dayal-nav-link"
                                    >
                                        ADMIN CONSOLE
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Actions: Search, User Menu, 1-Click Logout, Cart, Order Now, Mobile Toggle */}
                    <div className="dayal-header-actions">
                        {/* Search Icon */}
                        <button
                            onClick={() => setSearchModalOpen(!searchModalOpen)}
                            className="dayal-action-btn"
                            aria-label="Search Sweets"
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* User Profile & Account Menu */}
                        {auth?.user ? (
                            <>
                                <div className="dayal-user-dropdown-wrapper" onMouseLeave={() => setUserDropdownOpen(false)}>
                                    <button
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        onMouseEnter={() => setUserDropdownOpen(true)}
                                        className="dayal-user-trigger"
                                        aria-label="User Account Menu"
                                    >
                                        <div className="dayal-avatar">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                        <span className="dayal-user-name">
                                            {auth.user.name.split(' ')[0]}
                                        </span>
                                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {userDropdownOpen && (
                                        <div className="dayal-user-dropdown-card">
                                            <div className="dayal-dropdown-header">
                                                <p className="dayal-user-title">{auth.user.name}</p>
                                                <p className="dayal-user-email">{auth.user.email}</p>
                                                <span className="dayal-badge dayal-badge--gold-subtle">
                                                    {auth.user.roles?.[0] || 'Customer'}
                                                </span>
                                            </div>

                                            <Link
                                                href={route('dashboard')}
                                                className="dayal-dropdown-link"
                                            >
                                                <span>My Dashboard</span>
                                            </Link>

                                            <Link
                                                href={route('my-account')}
                                                className="dayal-dropdown-link"
                                            >
                                                <span>My Account & Orders</span>
                                            </Link>

                                            {auth.user.roles?.includes('admin') && (
                                                <Link
                                                    href={route('admin.dashboard')}
                                                    className="dayal-dropdown-link"
                                                >
                                                    <span>Admin Console</span>
                                                </Link>
                                            )}

                                            <div className="dayal-dropdown-divider" />

                                            <Link
                                                method="post"
                                                href={route('logout')}
                                                as="button"
                                                className="dayal-dropdown-logout"
                                            >
                                                <LogOutIcon width="16" height="16" />
                                                <span>Logout (Sign Out)</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Direct 1-Click Logout Button on Header Bar */}
                                <Link
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    title="Logout (Sign Out)"
                                    className="dayal-header-logout-btn"
                                    aria-label="Logout"
                                >
                                    <LogOutIcon width="14" height="14" />
                                    <span>Logout</span>
                                </Link>
                            </>
                        ) : (
                            <Link
                                href={route('login')}
                                className="dayal-action-btn"
                                title="Sign In / Register"
                            >
                                <UserIcon width="20" height="20" />
                            </Link>
                        )}

                        {/* Cart Button */}
                        <button
                            onClick={() => alert('Dayal Sweets Cart: 3 freshly packed boxes ready for express checkout.')}
                            className="dayal-cart-btn"
                            aria-label="Cart"
                        >
                            <CartIcon width="20" height="20" />
                            <span className="dayal-cart-badge">3</span>
                        </button>

                        {/* ORDER NOW Maroon Button */}
                        <button
                            onClick={() => {
                                const element = document.getElementById('bestsellers-section');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    window.location.href = '/#bestsellers-section';
                                }
                            }}
                            className="dayal-order-btn"
                        >
                            ORDER NOW
                        </button>

                        {/* Mobile Hamburger Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="dayal-hamburger-btn"
                            aria-label="Toggle Menu"
                        >
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search Bar Flyout */}
                {searchModalOpen && (
                    <div className="dayal-search-flyout">
                        <form onSubmit={handleSearchSubmit} className="dayal-search-inner">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Kaju Katli, Himachali Doda Barfi, Gulab Jamun..."
                                className="dayal-search-input"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="dayal-search-submit"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                )}

                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="dayal-mobile-drawer">
                        <Link href="/" className="dayal-mobile-link">
                            Home
                        </Link>
                        <a href="#shop" className="dayal-mobile-link">
                            Shop
                        </a>
                        <a href="#dining" className="dayal-mobile-link">
                            Dining
                        </a>
                        <a href="#gifting" className="dayal-mobile-link">
                            Gifting
                        </a>
                        <a href="#about" className="dayal-mobile-link">
                            About Us
                        </a>
                        <a href="#gallery" className="dayal-mobile-link">
                            Gallery
                        </a>
                        <a href="#contact" className="dayal-mobile-link">
                            Contact Us
                        </a>

                        <div className="dayal-mobile-auth">
                            {auth?.user ? (
                                <>
                                    <Link href={route('dashboard')} className="dayal-mobile-link">
                                        My Dashboard
                                    </Link>
                                    <Link href={route('my-account')} className="dayal-mobile-link">
                                        My Account
                                    </Link>
                                    <Link
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        className="dayal-btn dayal-btn--danger dayal-btn--full"
                                    >
                                        <LogOutIcon width="16" height="16" />
                                        <span>Logout (Sign Out)</span>
                                    </Link>
                                </>
                            ) : (
                                <div className="dayal-mobile-auth-grid">
                                    <Link href={route('login')} className="dayal-btn dayal-btn--primary dayal-btn--full">
                                        Sign In
                                    </Link>
                                    <Link href={route('register')} className="dayal-btn dayal-btn--outline dayal-btn--full">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
