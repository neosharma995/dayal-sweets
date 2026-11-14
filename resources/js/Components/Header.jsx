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
        <header className="w-full font-sans">
            {/* Top Bar - Deep Royal Maroon */}
            <div className="dayal-header-topbar">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
                    {/* Left Offer */}
                    <div className="tracking-widest font-extrabold text-[11px]">
                        FREE DELIVERY ON ORDERS ABOVE ₹999
                    </div>

                    {/* Right Quick Links */}
                    <div className="flex items-center gap-4 sm:gap-6 text-[10px] tracking-wider text-stone-200">
                        {/* Delivery */}
                        <a href="#delivery" className="flex items-center gap-1.5 hover:text-amber-200">
                            <svg className="w-3.5 h-3.5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8h4l3 4v4a1 1 0 01-1 1h-1m-6 0h4" />
                            </svg>
                            <span>Delivery</span>
                        </a>

                        {/* Franchise */}
                        <a href="#franchise" className="flex items-center gap-1.5 hover:text-amber-200">
                            <svg className="w-3.5 h-3.5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>Franchise</span>
                        </a>

                        {/* Bulk/Corporate Inquiry */}
                        <a href="#corporate" className="flex items-center gap-1.5 hover:text-amber-200">
                            <svg className="w-3.5 h-3.5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
                            </svg>
                            <span>Bulk/Corporate Inquiry</span>
                        </a>

                        {/* Phone */}
                        <a href="tel:+919876543210" className="flex items-center gap-1.5 font-bold hover:text-amber-200">
                            <svg className="w-3.5 h-3.5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>+91 98765 43210</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar - Warm Cream Background */}
            <nav className="dayal-navbar">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo on Left */}
                        <Link href="/" className="flex-shrink-0">
                            <ApplicationLogo className="w-12 h-12" showText={true} />
                        </Link>

                        {/* Center Navigation Links matching reference */}
                        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                            <Link
                                href="/"
                                className={`dayal-nav-link ${route().current('home') ? 'active' : ''}`}
                            >
                                HOME
                            </Link>

                            {/* Shop dropdown */}
                            <div className="relative" onMouseLeave={() => setShopDropdownOpen(false)}>
                                <button
                                    onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                                    onMouseEnter={() => setShopDropdownOpen(true)}
                                    className="dayal-nav-link flex items-center gap-1"
                                >
                                    <span>SHOP</span>
                                    <svg className="w-3 h-3 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {shopDropdownOpen && (
                                    <div className="absolute top-full left-0 w-56 bg-white border border-[#EADBCA] rounded-xl shadow-xl py-2 z-50">
                                        <a href="#kaju-katli" className="block px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-[#FAF6F0] hover:text-[#631826]">
                                            Royal Kaju Katli (Pure Vark)
                                        </a>
                                        <a href="#motichoor" className="block px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-[#FAF6F0] hover:text-[#631826]">
                                            Himachali Desi Ghee Laddu
                                        </a>
                                        <a href="#doda-barfi" className="block px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-[#FAF6F0] hover:text-[#631826]">
                                            Special Doda Barfi
                                        </a>
                                        <a href="#dry-fruit" className="block px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-[#FAF6F0] hover:text-[#631826]">
                                            Sugar-Free Dry Fruit Lauj
                                        </a>
                                        <a href="#bengali" className="block px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-[#FAF6F0] hover:text-[#631826]">
                                            Kesar Rasmalai & Cham Cham
                                        </a>
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
                                            className="dayal-nav-link text-amber-700 font-bold"
                                        >
                                            ADMIN CONSOLE
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Right Actions matching reference: Search, Profile, Cart(3), ORDER NOW */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Search Icon */}
                            <button
                                onClick={() => setSearchModalOpen(!searchModalOpen)}
                                className="p-2 text-stone-700 hover:text-[#631826] transition-colors"
                                aria-label="Search Sweets"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* User Profile & Account Menu */}
                            {auth?.user ? (
                                <div className="flex items-center gap-1">
                                    <div className="relative" onMouseLeave={() => setUserDropdownOpen(false)}>
                                        <button
                                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                            onMouseEnter={() => setUserDropdownOpen(true)}
                                            className="p-1.5 rounded-lg hover:bg-[#FAF6F0] flex items-center gap-1.5 transition-colors border border-transparent hover:border-[#EADBCA]"
                                            aria-label="User Account Menu"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#631826] text-[#FAF6F0] flex items-center justify-center font-bold text-xs shadow-sm">
                                                {auth.user.name.charAt(0)}
                                            </div>
                                            <span className="hidden xl:inline text-xs font-bold text-stone-800 truncate max-w-[85px]">
                                                {auth.user.name.split(' ')[0]}
                                            </span>
                                            <svg className="w-3 h-3 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {userDropdownOpen && (
                                            <div className="absolute right-0 top-full mt-1 w-60 bg-white border border-[#EADBCA] rounded-xl shadow-xl py-2 z-50">
                                                <div className="px-4 py-2 border-b border-stone-100 bg-[#FAF6F0]/60">
                                                    <p className="text-xs font-bold text-stone-900 truncate">{auth.user.name}</p>
                                                    <p className="text-[11px] text-stone-500 truncate">{auth.user.email}</p>
                                                    <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-[#631826] uppercase">
                                                        {auth.user.roles?.[0] || 'Customer'}
                                                    </span>
                                                </div>

                                                <Link
                                                    href={route('dashboard')}
                                                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-[#FAF6F0] hover:text-[#631826] transition-colors"
                                                >
                                                    <span>My Dashboard</span>
                                                </Link>

                                                <Link
                                                    href={route('my-account')}
                                                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-[#FAF6F0] hover:text-[#631826] transition-colors"
                                                >
                                                    <span>My Account & Orders</span>
                                                </Link>

                                                {auth.user.roles?.includes('admin') && (
                                                    <Link
                                                        href={route('admin.dashboard')}
                                                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#631826] hover:bg-[#FAF6F0] transition-colors"
                                                    >
                                                        <span>Admin Console</span>
                                                    </Link>
                                                )}

                                                <div className="border-t border-stone-100 mt-1 pt-1">
                                                    <Link
                                                        method="post"
                                                        href={route('logout')}
                                                        as="button"
                                                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                                    >
                                                        <LogOutIcon className="w-4 h-4" />
                                                        <span>Logout (Sign Out)</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Direct 1-Click Logout Button on Header Bar */}
                                    <Link
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        title="Logout (Sign Out)"
                                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors hidden sm:flex items-center gap-1 text-xs font-bold"
                                        aria-label="Logout"
                                    >
                                        <LogOutIcon className="w-4 h-4" />
                                        <span className="hidden 2xl:inline">Logout</span>
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="p-2 text-stone-700 hover:text-[#631826] transition-colors flex items-center gap-1"
                                    title="Sign In / Register"
                                >
                                    <UserIcon className="w-5 h-5" />
                                    <span className="hidden xl:inline text-xs font-bold uppercase tracking-wider text-stone-800">
                                        Sign In
                                    </span>
                                </Link>
                            )}

                            {/* Cart Icon with circular maroon badge (3) */}
                            <button
                                onClick={() => alert('Dayal Sweets Cart: 3 freshly packed boxes ready for express checkout.')}
                                className="relative p-2 text-stone-700 hover:text-[#631826] transition-colors"
                                aria-label="Cart"
                            >
                                <CartIcon className="w-5 h-5" />
                                <span className="dayal-cart-badge-maroon">3</span>
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
                                className="dayal-order-now-btn hidden sm:block"
                            >
                                ORDER NOW
                            </button>

                            {/* Mobile Hamburger Menu */}
                            <div className="flex lg:hidden items-center">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="p-2 rounded-lg text-stone-800 hover:bg-stone-100"
                                    aria-label="Toggle Menu"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {mobileMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar Flyout */}
                {searchModalOpen && (
                    <div className="border-t border-[#EADBCA] bg-[#FAF6F0] px-4 py-3">
                        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Kaju Katli, Himachali Doda Barfi, Gulab Jamun..."
                                className="flex-1 px-4 py-2 bg-white border border-[#EADBCA] rounded-md text-xs outline-none focus:border-[#631826]"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="px-5 py-2 bg-[#631826] text-white text-xs font-bold uppercase rounded-md tracking-wider"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                )}

                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-[#EADBCA] bg-[#FCF8F2] px-6 py-4 space-y-2 shadow-lg">
                        <Link href="/" className="block py-2 text-xs font-bold uppercase text-[#631826]">
                            Home
                        </Link>
                        <a href="#shop" className="block py-2 text-xs font-bold uppercase text-stone-800">
                            Shop
                        </a>
                        <a href="#dining" className="block py-2 text-xs font-bold uppercase text-stone-800">
                            Dining
                        </a>
                        <a href="#gifting" className="block py-2 text-xs font-bold uppercase text-stone-800">
                            Gifting
                        </a>
                        <a href="#about" className="block py-2 text-xs font-bold uppercase text-stone-800">
                            About Us
                        </a>
                        <a href="#gallery" className="block py-2 text-xs font-bold uppercase text-stone-800">
                            Gallery
                        </a>
                        <a href="#contact" className="block py-2 text-xs font-bold uppercase text-stone-800">
                            Contact Us
                        </a>

                        <div className="pt-3 border-t border-[#EADBCA] space-y-2">
                            {auth?.user ? (
                                <>
                                    <Link href={route('dashboard')} className="block py-1 text-xs font-bold text-stone-800">
                                        My Dashboard
                                    </Link>
                                    <Link href={route('my-account')} className="block py-1 text-xs font-bold text-stone-800">
                                        My Account
                                    </Link>
                                    <Link
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        className="w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg bg-rose-50 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                                    >
                                        <LogOutIcon className="w-4 h-4" />
                                        <span>Logout (Sign Out)</span>
                                    </Link>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <Link href={route('login')} className="text-center py-2 bg-[#631826] text-white text-xs font-bold rounded">
                                        Sign In
                                    </Link>
                                    <Link href={route('register')} className="text-center py-2 border border-[#631826] text-[#631826] text-xs font-bold rounded">
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
