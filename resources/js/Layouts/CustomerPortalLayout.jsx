import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import FlashToaster from '@/Components/FlashToaster';
import Modal from '@/Components/Modal';
import ContactHero from '@/Components/contact/ContactHero';
import {
    LayoutDashboard,
    PackageCheck,
    ShoppingBag,
    MapPin,
    UserCheck,
    LogOut,
    ChevronLeft,
    Menu,
    X,
    Home,
    Package,
    Download,
    User,
} from 'lucide-react';

export default function CustomerPortalLayout({
    title = 'My Account - Dayal Sweets',
    breadcrumbTitle = 'My Account',
    heroTitle = 'My Account',
    heroSubtitle = 'Manage your sweet orders, view purchased products, track dispatches, and edit your account details.',
    activeNav = 'dashboard',
    tier = 'Gold Mithai Club Member',
    ordersCount = 0,
    sweetsCount = 0,
    children,
}) {
    const { url, props } = usePage();
    const user = props?.auth?.user || {};
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') setMobileMenuOpen(false);
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                document.body.style.overflow = '';
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [mobileMenuOpen]);

    const handleConfirmLogout = () => {
        setLoggingOut(true);
        router.post(route('logout'), {}, {
            onFinish: () => {
                setLoggingOut(false);
                setLogoutModalOpen(false);
            },
        });
    };

    // Determine active item from prop or URL
    const currentPath = (url || '').split(/[?#]/, 1)[0].replace(/\/+$/, '') || '';
    const isActive = (navKey, pathPrefix) => {
        if (activeNav === navKey) return true;
        if (pathPrefix && currentPath.startsWith(pathPrefix)) return true;
        return false;
    };

    return (
        <div className="dayal-site dayal-dashboard-page">
            <Head title={title} />

            {/* Modular Site Header */}
            <Header />

            {/* Global Flash Toaster */}
            <FlashToaster />

            <main>
                {/* Reusable Common Hero Banner used across inner pages */}
                <ContactHero
                    breadcrumbs={
                        breadcrumbTitle && breadcrumbTitle.toLowerCase() !== 'my account'
                            ? [
                                { label: 'HOME', url: '/' },
                                { label: 'MY ACCOUNT', url: '/customer/dashboard' },
                                { label: breadcrumbTitle.toUpperCase(), url: null },
                            ]
                            : [
                                { label: 'HOME', url: '/' },
                                { label: 'MY ACCOUNT', url: null },
                            ]
                    }
                    title={(heroTitle || 'My Account').toUpperCase()}
                    subtitle=""
                    description={heroSubtitle}
                />

                <div className="dayal-dashboard-container">
                    {/* Mobile Navigation Header Bar (Shown only on responsive mobile) */}
                    <div className="dayal-myaccount-mobile-bar">
                        <button
                            type="button"
                            className="dayal-myaccount-mobile-back"
                            onClick={() => (window.history.length > 1 ? window.history.back() : router.visit('/customer/dashboard'))}
                            aria-label="Go back"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            type="button"
                            className="dayal-myaccount-mobile-trigger"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open My Account Menu"
                        >
                            <Menu size={16} />
                            <span>My Account</span>
                        </button>
                    </div>

                    <div className="dayal-myaccount-layout">
                        {/* LEFT COLUMN: WooCommerce Sidebar Navigation */}
                        <aside className="dayal-myaccount-sidebar">
                            <div className="myaccount-user-card">
                                <div className="myaccount-avatar">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="myaccount-meta">
                                    <h3>{user?.name || 'Customer'}</h3>
                                    <p>{user?.email}</p>
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            marginTop: '4px',
                                            background: 'rgba(212, 175, 55, 0.2)',
                                            color: '#E6CA92',
                                            padding: '2px 8px',
                                            borderRadius: '999px',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {tier}
                                    </span>
                                </div>
                            </div>

                            <ul className="myaccount-nav-list">
                                <li className="myaccount-nav-item">
                                    <Link
                                        href="/customer/dashboard"
                                        className={isActive('dashboard', '/customer/dashboard') ? 'active' : ''}
                                    >
                                        <LayoutDashboard size={17} />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>

                                <li className="myaccount-nav-item">
                                    <Link
                                        href="/customer/orders"
                                        className={isActive('orders', '/customer/orders') ? 'active' : ''}
                                    >
                                        <PackageCheck size={17} />
                                        <span>Orders</span>
                                        {ordersCount > 0 && (
                                            <span className="nav-badge">{ordersCount}</span>
                                        )}
                                    </Link>
                                </li>

                                <li className="myaccount-nav-item">
                                    <Link
                                        href="/customer/purchased-sweets"
                                        className={isActive('items', '/customer/purchased-items') || isActive('sweets', '/customer/purchased-sweets') || isActive('products', '/customer/products') ? 'active' : ''}
                                    >
                                        <ShoppingBag size={17} />
                                        <span>Purchased Items</span>
                                        {sweetsCount > 0 && (
                                            <span className="nav-badge">{sweetsCount}</span>
                                        )}
                                    </Link>
                                </li>

                                <li className="myaccount-nav-item">
                                    <Link
                                        href="/customer/addresses"
                                        className={isActive('addresses', '/customer/addresses') ? 'active' : ''}
                                    >
                                        <MapPin size={17} />
                                        <span>Addresses</span>
                                    </Link>
                                </li>

                                <li className="myaccount-nav-item">
                                    <Link
                                        href="/customer/account"
                                        className={isActive('account', '/customer/account') ? 'active' : ''}
                                    >
                                        <UserCheck size={17} />
                                        <span>Account Details</span>
                                    </Link>
                                </li>

                                <li className="myaccount-nav-item" style={{ borderTop: '1px solid #F1E9DF', marginTop: '6px', paddingTop: '6px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setLogoutModalOpen(true)}
                                        style={{ color: '#DC2626' }}
                                    >
                                        <LogOut size={17} color="#DC2626" />
                                        <span>Log Out</span>
                                    </button>
                                </li>
                            </ul>
                        </aside>

                        {/* RIGHT COLUMN: Active Page Content */}
                        <div className="dayal-myaccount-content">
                            {children}
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile My Account Menu Popup Modal */}
            {mobileMenuOpen && (
                <div
                    className="dayal-myaccount-modal-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="My Account Menu"
                >
                    <div
                        className="dayal-myaccount-modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="dayal-myaccount-modal-header">
                            <h3>My Account</h3>
                            <button
                                type="button"
                                className="dayal-myaccount-modal-close"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="dayal-myaccount-modal-grid">
                            <Link
                                href="/customer/dashboard"
                                className={`dayal-myaccount-grid-item ${isActive('dashboard', '/customer/dashboard') ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <LayoutDashboard size={22} />
                                <span>Dashboard</span>
                            </Link>

                            <Link
                                href="/customer/orders"
                                className={`dayal-myaccount-grid-item ${isActive('orders', '/customer/orders') ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <PackageCheck size={22} />
                                <span>Orders</span>
                            </Link>

                            <Link
                                href="/customer/purchased-sweets"
                                className={`dayal-myaccount-grid-item ${isActive('items', '/customer/purchased-items') || isActive('sweets', '/customer/purchased-sweets') || isActive('products', '/customer/products') ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <ShoppingBag size={22} />
                                <span>Purchased Items</span>
                            </Link>

                            <Link
                                href="/customer/addresses"
                                className={`dayal-myaccount-grid-item ${isActive('addresses', '/customer/addresses') ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <MapPin size={22} />
                                <span>Addresses</span>
                            </Link>

                            <Link
                                href="/customer/account"
                                className={`dayal-myaccount-grid-item ${isActive('account', '/customer/account') ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <UserCheck size={22} />
                                <span>Account Details</span>
                            </Link>

                            <button
                                type="button"
                                className="dayal-myaccount-grid-item dayal-myaccount-grid-item--logout"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setLogoutModalOpen(true);
                                }}
                            >
                                <LogOut size={22} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modular Site Footer */}
            <Footer />

            {/* Shared Logout Confirmation Modal */}
            <Modal show={logoutModalOpen} onClose={() => !loggingOut && setLogoutModalOpen(false)}>
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: '#FEE2E2',
                                border: '1px solid #FECACA',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#DC2626',
                                flexShrink: 0,
                            }}
                        >
                            <LogOut size={22} color="#DC2626" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0F172A', fontFamily: 'Cormorant Garamond, serif' }}>
                                Confirm Sign Out
                            </h3>
                            <span style={{ fontSize: '12px', color: '#64748B' }}>
                                Dayal Sweets Active Session
                            </span>
                        </div>
                    </div>

                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                        Are you sure you want to sign out, <strong>{user?.name}</strong>? Any items in your active shopping bag and addresses will remain saved for your next visit.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={() => setLogoutModalOpen(false)}
                            className="dayal-btn dayal-btn--outline dayal-btn--sm"
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={handleConfirmLogout}
                            className="dayal-btn dayal-btn--primary dayal-btn--sm"
                            style={{
                                padding: '8px 18px',
                                fontSize: '13px',
                                background: '#DC2626',
                                borderColor: '#DC2626',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            {loggingOut ? (
                                <span>Signing out...</span>
                            ) : (
                                <>
                                    <LogOut size={14} />
                                    <span>Sign Out</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
