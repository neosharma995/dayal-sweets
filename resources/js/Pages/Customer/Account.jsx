import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
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
    CheckCircle2,
    Lock,
    Key
} from 'lucide-react';

export default function CustomerAccount({ customer, savedAddresses = [], orderHistory = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user || customer;
    const [activeTab, setActiveTab] = useState('account');
    const [toastMessage, setToastMessage] = useState('');
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

    // Profile form
    const profileForm = useForm({
        name: customer?.name || user?.name || '',
        email: customer?.email || user?.email || '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.patch(route('customer.account.profile'), {
            preserveScroll: true,
            onSuccess: () => {
                setToastMessage('Profile details updated successfully!');
                setTimeout(() => setToastMessage(''), 4500);
            },
        });
    };

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route('customer.account.password'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setToastMessage('Password updated successfully!');
                setTimeout(() => setToastMessage(''), 4500);
            },
        });
    };

    return (
        <div className="dayal-site dayal-dashboard-page">
            <Head title="Account Details - Dayal Sweets" />

            {/* Modular Site Header */}
            <Header />

            {/* Global Flash Toaster */}
            <FlashToaster />

            {/* Toast Feedback */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        background: '#631826',
                        color: '#ffffff',
                        padding: '14px 20px',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 9999,
                        fontSize: '14px',
                        fontWeight: 600,
                    }}
                >
                    <CheckCircle2 size={18} color="#D4AF37" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <main>
                {/* Hero Banner */}
                <section className="dayal-dashboard-hero">
                    <div className="dayal-dashboard-hero-inner">
                        <nav className="dayal-dashboard-breadcrumb" aria-label="Breadcrumb">
                            <Link href="/">Home</Link>
                            <span aria-hidden="true">/</span>
                            <span className="current">My Account</span>
                        </nav>
                        <span className="dayal-dashboard-hero-eyebrow">
                            — PURE DESI GHEE SWEETS • SINCE 1952 —
                        </span>
                        <h1 className="dayal-dashboard-hero-title">
                            Account Information
                        </h1>
                        <p className="dayal-dashboard-hero-subtitle">
                            Manage your profile settings, delivery destinations, and login credentials.
                        </p>
                    </div>
                </section>

                <div className="dayal-dashboard-container">
                    <div className="dayal-myaccount-layout">
                        {/* ========================================================= */}
                        {/* LEFT COLUMN: Sidebar Navigation                           */}
                        {/* ========================================================= */}
                        <aside className="dayal-myaccount-sidebar">
                            <div className="myaccount-user-card">
                                <div className="myaccount-avatar">
                                    {customer?.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="myaccount-meta">
                                    <h3>{customer?.name || 'Customer'}</h3>
                                    <p>{customer?.email}</p>
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
                                        {customer?.tier || 'Gold Mithai Club'}
                                    </span>
                                </div>
                            </div>

                            <ul className="myaccount-nav-list">
                                <li className="myaccount-nav-item">
                                    <Link href={route('customer.dashboard')}>
                                        <LayoutDashboard size={17} />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>

                                <li className="myaccount-nav-item">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('orders')}
                                        className={activeTab === 'orders' ? 'active' : ''}
                                    >
                                        <PackageCheck size={17} />
                                        <span>Orders</span>
                                        {orderHistory.length > 0 && (
                                            <span className="nav-badge">{orderHistory.length}</span>
                                        )}
                                    </button>
                                </li>

                                <li className="myaccount-nav-item">
                                    <Link href={route('customer.dashboard')}>
                                        <ShoppingBag size={17} />
                                        <span>Purchased Sweets</span>
                                    </Link>
                                </li>

                                <li className="myaccount-nav-item">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('addresses')}
                                        className={activeTab === 'addresses' ? 'active' : ''}
                                    >
                                        <MapPin size={17} />
                                        <span>Addresses</span>
                                    </button>
                                </li>

                                <li className="myaccount-nav-item">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('account')}
                                        className={activeTab === 'account' ? 'active' : ''}
                                    >
                                        <UserCheck size={17} />
                                        <span>Account Details</span>
                                    </button>
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

                        {/* ========================================================= */}
                        {/* RIGHT COLUMN: Content Panel                               */}
                        {/* ========================================================= */}
                        <div className="dayal-myaccount-content">
                            {/* ACCOUNT DETAILS TAB */}
                            {activeTab === 'account' && (
                                <div>
                                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#631826', margin: '0 0 4px 0' }}>
                                        Account Details
                                    </h2>
                                    <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0' }}>
                                        Update your personal profile information and change your login password.
                                    </p>

                                    {/* Personal Profile Form */}
                                    <form onSubmit={handleProfileSubmit} style={{ marginBottom: '32px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                                    Full Name <span style={{ color: '#E11D48' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.name}
                                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                                                    required
                                                />
                                                {profileForm.errors.name && (
                                                    <p style={{ color: '#E11D48', fontSize: '12px', marginTop: '4px' }}>{profileForm.errors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                                    Email Address <span style={{ color: '#E11D48' }}>*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileForm.data.email}
                                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                                                    required
                                                />
                                                {profileForm.errors.email && (
                                                    <p style={{ color: '#E11D48', fontSize: '12px', marginTop: '4px' }}>{profileForm.errors.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="dayal-btn dayal-btn--primary dayal-btn--sm"
                                        >
                                            {profileForm.processing ? 'Saving...' : 'Save Profile Changes'}
                                        </button>
                                    </form>

                                    <hr style={{ border: 'none', borderTop: '1px solid #EBE4D8', margin: '32px 0' }} />

                                    {/* Password Change Form */}
                                    <form onSubmit={handlePasswordSubmit}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
                                            Password Change
                                        </h3>

                                        <div style={{ marginBottom: '16px', maxWidth: '420px' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                                Current Password (leave blank to leave unchanged)
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                                            />
                                            {passwordForm.errors.current_password && (
                                                <p style={{ color: '#E11D48', fontSize: '12px', marginTop: '4px' }}>{passwordForm.errors.current_password}</p>
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '16px', maxWidth: '420px' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                                            />
                                            {passwordForm.errors.password && (
                                                <p style={{ color: '#E11D48', fontSize: '12px', marginTop: '4px' }}>{passwordForm.errors.password}</p>
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '20px', maxWidth: '420px' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="dayal-btn dayal-btn--secondary dayal-btn--sm"
                                        >
                                            {passwordForm.processing ? 'Updating Password...' : 'Change Password'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* ORDERS TAB */}
                            {activeTab === 'orders' && (
                                <div>
                                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#631826', margin: '0 0 4px 0' }}>
                                        Orders
                                    </h2>
                                    <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0' }}>
                                        Complete record of purchases made from your account.
                                    </p>

                                    {orderHistory && orderHistory.length > 0 ? (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '2px solid #EBE4D8', color: '#64748B', fontSize: '12px', textTransform: 'uppercase' }}>
                                                        <th style={{ padding: '12px 16px' }}>Order</th>
                                                        <th style={{ padding: '12px 16px' }}>Date</th>
                                                        <th style={{ padding: '12px 16px' }}>Status</th>
                                                        <th style={{ padding: '12px 16px' }}>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orderHistory.map((item) => (
                                                        <tr key={item.order_id} style={{ borderBottom: '1px solid #F1E9DF' }}>
                                                            <td style={{ padding: '16px' }}>
                                                                <strong style={{ color: '#631826' }}>#{item.order_id}</strong>
                                                                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{item.items}</div>
                                                            </td>
                                                            <td style={{ padding: '16px', color: '#475569' }}>{item.date}</td>
                                                            <td style={{ padding: '16px' }}>
                                                                <span
                                                                    style={{
                                                                        display: 'inline-block',
                                                                        padding: '3px 8px',
                                                                        borderRadius: '999px',
                                                                        fontSize: '11px',
                                                                        fontWeight: 700,
                                                                        background: item.delivery_status === 'delivered' ? '#DCFCE7' : '#FEF3C7',
                                                                        color: item.delivery_status === 'delivered' ? '#15803D' : '#92400E',
                                                                    }}
                                                                >
                                                                    {item.status}
                                                                </span>
                                                                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>{item.payment}</div>
                                                            </td>
                                                            <td style={{ padding: '16px', fontWeight: 700, color: '#0F172A' }}>₹{item.total.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748B' }}>
                                            <p style={{ margin: '0 0 16px 0', fontSize: '15px' }}>No purchase records found.</p>
                                            <Link href="/shop" className="dayal-btn dayal-btn--primary dayal-btn--sm">
                                                Start Shopping
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ADDRESSES TAB */}
                            {activeTab === 'addresses' && (
                                <div>
                                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#631826', margin: '0 0 4px 0' }}>
                                        Addresses
                                    </h2>
                                    <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0' }}>
                                        The following addresses will be used on the checkout page by default.
                                    </p>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                        {savedAddresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                style={{
                                                    border: '1px solid #EBE4D8',
                                                    borderRadius: '8px',
                                                    padding: '20px',
                                                    background: '#FAF7F2',
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                                                        {addr.title}
                                                    </h3>
                                                    {addr.is_default && (
                                                        <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, background: '#DCFCE7', padding: '2px 8px', borderRadius: '999px' }}>
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                                                    <div><strong>{addr.recipient_name}</strong></div>
                                                    <div>{addr.address_line}, {addr.landmark}</div>
                                                    <div>{addr.city} - {addr.pincode}</div>
                                                    <div style={{ marginTop: '4px' }}>📞 {addr.phone}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* LOGOUT CONFIRMATION MODAL */}
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
                                Dayal Sweets Customer Account
                            </span>
                        </div>
                    </div>

                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                        Are you sure you want to log out of your account, <strong>{user?.name}</strong>? Any items in your active shopping bag and saved addresses will remain preserved for your next visit.
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
                            <LogOut size={14} />
                            <span>{loggingOut ? 'Logging Out...' : 'Yes, Log Out'}</span>
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modular Site Footer */}
            <Footer />
        </div>
    );
}
