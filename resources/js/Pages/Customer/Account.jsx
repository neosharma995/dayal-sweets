import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { UserIcon, MapPinIcon, KeyIcon, LogOutIcon } from '@/Components/Icons';

export default function CustomerAccount({ customer, savedAddresses, orderHistory }) {
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const profileForm = useForm({
        name: customer.name,
        email: customer.email,
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.patch(route('customer.account.profile'), {
            preserveScroll: true,
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
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <CustomerLayout
            header={
                <div className="dayal-flex-between">
                    <div>
                        <span className="dayal-badge dayal-badge--gold">Account Center</span>
                        <h1 className="dayal-font-serif">My Account & Saved Preferences</h1>
                    </div>
                    <Link
                        method="post"
                        href={route('logout')}
                        as="button"
                        className="dayal-btn dayal-btn--danger dayal-btn--sm"
                    >
                        <LogOutIcon width="16" height="16" />
                        <span>Sign Out / Logout</span>
                    </Link>
                </div>
            }
        >
            <Head title="My Account - Dayal Sweets" />

            {/* Customer Identity Banner */}
            <div className="dayal-customer-profile-banner">
                <div className="dayal-profile-identity">
                    <div className="dayal-profile-avatar">
                        {customer.name.charAt(0)}
                    </div>
                    <div className="dayal-profile-details">
                        <div className="dayal-flex-start">
                            <h2>{customer.name}</h2>
                            <span className="dayal-badge dayal-badge--gold-subtle">
                                {customer.tier}
                            </span>
                        </div>
                        <p>{customer.email}</p>
                        <p className="dayal-text-gold dayal-mt-1">Member Since {customer.member_since}</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="dayal-profile-tabs">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`dayal-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    >
                        Profile & Security
                    </button>
                    <button
                        onClick={() => setActiveTab('addresses')}
                        className={`dayal-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                    >
                        Saved Addresses ({savedAddresses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`dayal-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    >
                        All Orders ({orderHistory.length})
                    </button>
                </div>
            </div>

            {/* Tab: Profile & Security */}
            {activeTab === 'profile' && (
                <div className="dayal-grid-2">
                    {/* Personal Details Form */}
                    <div className="dayal-card">
                        <div className="dayal-flex-start dayal-mb-4">
                            <UserIcon width="20" height="20" />
                            <div>
                                <h3 className="dayal-font-serif">Personal Details</h3>
                                <p className="dayal-text-muted">Update your name and primary contact email</p>
                            </div>
                        </div>

                        <form onSubmit={handleProfileSubmit}>
                            <div className="dayal-form-group">
                                <label className="dayal-label">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    className="dayal-input"
                                />
                                {profileForm.errors.name && (
                                    <p className="dayal-input-error">{profileForm.errors.name}</p>
                                )}
                            </div>

                            <div className="dayal-form-group">
                                <label className="dayal-label">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    className="dayal-input"
                                />
                                {profileForm.errors.email && (
                                    <p className="dayal-input-error">{profileForm.errors.email}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="dayal-btn dayal-btn--primary"
                            >
                                {profileForm.processing ? 'Saving...' : 'Update Details'}
                            </button>
                        </form>
                    </div>

                    {/* Security Password Form */}
                    <div className="dayal-card">
                        <div className="dayal-flex-start dayal-mb-4">
                            <KeyIcon width="20" height="20" />
                            <div>
                                <h3 className="dayal-font-serif">Account Security</h3>
                                <p className="dayal-text-muted">Change your login password anytime</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordSubmit}>
                            <div className="dayal-form-group">
                                <label className="dayal-label">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="dayal-input"
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="dayal-input-error">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div className="dayal-form-group">
                                <label className="dayal-label">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="dayal-input"
                                />
                                {passwordForm.errors.password && (
                                    <p className="dayal-input-error">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div className="dayal-form-group">
                                <label className="dayal-label">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="dayal-input"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="dayal-btn dayal-btn--secondary"
                            >
                                {passwordForm.processing ? 'Updating...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Tab: Saved Addresses */}
            {activeTab === 'addresses' && (
                <div>
                    <div className="dayal-flex-between dayal-mb-3">
                        <div>
                            <h3 className="dayal-font-serif">Your Saved Delivery Addresses</h3>
                            <p className="dayal-text-muted">Manage delivery destinations for express dispatch</p>
                        </div>
                        <button
                            onClick={() => alert('Add Address: Dialog ready.')}
                            className="dayal-btn dayal-btn--primary dayal-btn--sm"
                        >
                            + Add New Address
                        </button>
                    </div>

                    <div className="dayal-address-grid">
                        {savedAddresses.map((addr) => (
                            <div key={addr.id} className="dayal-card">
                                <div className="dayal-flex-between dayal-mb-2">
                                    <div className="dayal-flex-start">
                                        <MapPinIcon width="18" height="18" />
                                        <h4 className="dayal-font-serif">{addr.title}</h4>
                                    </div>
                                    {addr.is_default && (
                                        <span className="dayal-badge dayal-badge--gold-subtle">
                                            Default Address
                                        </span>
                                    )}
                                </div>

                                <p className="dayal-fs-base"><strong>{addr.recipient_name}</strong> • {addr.phone}</p>
                                <p className="dayal-text-muted dayal-mt-1">
                                    {addr.address_line}, {addr.landmark}
                                </p>
                                <p className="dayal-text-muted">
                                    {addr.city} - {addr.pincode}
                                </p>

                                <div className="dayal-flex-between dayal-mt-4">
                                    <button
                                        onClick={() => alert(`Editing ${addr.title}`)}
                                        className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                    >
                                        Edit Address
                                    </button>
                                    {!addr.is_default && (
                                        <button
                                            onClick={() => alert(`Set ${addr.title} as default`)}
                                            className="dayal-btn dayal-btn--ghost dayal-btn--sm"
                                        >
                                            Make Default
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab: Full Orders History */}
            {activeTab === 'orders' && (
                <div className="dayal-order-history-card">
                    <h3 className="dayal-font-serif">Dayal Sweets Order Records</h3>
                    <p className="dayal-text-muted dayal-mb-4">Complete list of previous purchases and deliveries</p>

                    <div>
                        {orderHistory && orderHistory.length > 0 ? (
                            orderHistory.map((item) => (
                                <div key={item.order_id} className="dayal-history-row">
                                    <div>
                                        <div className="dayal-flex-start">
                                            <strong className="dayal-text-maroon">#{item.order_id}</strong>
                                            <span className="dayal-text-muted">• {item.date}</span>
                                            <span className={`dayal-badge ${
                                                item.delivery_status === 'delivered'
                                                    ? 'dayal-badge--green'
                                                    : item.delivery_status === 'shipping'
                                                    ? 'dayal-badge--gold'
                                                    : 'dayal-badge--gold-subtle'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="dayal-mt-1">{item.items}</p>
                                        <p className="dayal-text-muted">{item.payment}</p>
                                    </div>

                                    <div className="dayal-flex-start">
                                        <strong className="dayal-font-serif dayal-fs-lg">
                                            ₹{item.total}
                                        </strong>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem' }}>No purchase records found in your account.</p>
                                <Link href="/shop" className="dayal-btn dayal-btn--primary dayal-btn--sm">
                                    Explore Sweets &amp; Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
