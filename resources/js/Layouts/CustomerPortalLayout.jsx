import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import FlashToaster from '@/Components/FlashToaster';
import Modal from '@/Components/Modal';
import {
    LayoutDashboard,
    PackageCheck,
    ShoppingBag,
    MapPin,
    UserCheck,
    LogOut,
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
                {/* Hero Banner */}
                <section className="dayal-dashboard-hero">
                    <div className="dayal-dashboard-hero-inner">
                        <nav className="dayal-dashboard-breadcrumb" aria-label="Breadcrumb">
                            <Link href="/">Home</Link>
                            <span aria-hidden="true">/</span>
                            <span className="current">{breadcrumbTitle}</span>
                        </nav>
                        <span className="dayal-dashboard-hero-eyebrow">
                            — PURE DESI GHEE SWEETS • SINCE 1952 —
                        </span>
                        <h1 className="dayal-dashboard-hero-title">
                            {heroTitle}
                        </h1>
                        <p className="dayal-dashboard-hero-subtitle">
                            {heroSubtitle}
                        </p>
                    </div>
                </section>

                <div className="dayal-dashboard-container">
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
