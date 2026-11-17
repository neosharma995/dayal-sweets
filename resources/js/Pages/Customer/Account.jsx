import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { CheckCircle2, UserCheck, Key } from 'lucide-react';

export default function CustomerAccount({
    customer = {},
    savedAddresses = [],
    orderHistory = [],
    tier = 'Gold Mithai Club Member',
    ordersCount = 0,
    sweetsCount = 0,
}) {
    const { auth } = usePage().props;
    const user = auth?.user || customer;
    const [toastMessage, setToastMessage] = useState('');

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
        <CustomerPortalLayout
            title="Account Details - Dayal Sweets"
            breadcrumbTitle="Account Details"
            heroTitle="Account Details"
            heroSubtitle="Manage your profile information and update your security credentials."
            activeNav="account"
            tier={tier || customer?.tier}
            ordersCount={ordersCount || orderHistory.length}
            sweetsCount={sweetsCount}
        >
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

            <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#631826', margin: '0 0 4px 0' }}>
                    Account Details
                </h2>
                <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0' }}>
                    Edit your personal name, email address, and security password.
                </p>

                {/* Profile Edit Form */}
                <div style={{ background: '#FAF7F2', border: '1px solid #EBE4D8', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={18} color="#631826" />
                        <span>Personal Information</span>
                    </h3>

                    <form onSubmit={handleProfileSubmit}>
                        <div style={{ marginBottom: '16px', maxWidth: '420px' }}>
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

                        <div style={{ marginBottom: '20px', maxWidth: '420px' }}>
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

                        <button
                            type="submit"
                            disabled={profileForm.processing}
                            className="dayal-btn dayal-btn--primary dayal-btn--sm"
                        >
                            {profileForm.processing ? 'Saving...' : 'Save Profile Changes'}
                        </button>
                    </form>
                </div>

                {/* Password Change Form */}
                <div style={{ background: '#FAF7F2', border: '1px solid #EBE4D8', borderRadius: '8px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Key size={18} color="#631826" />
                        <span>Change Password</span>
                    </h3>

                    <form onSubmit={handlePasswordSubmit}>
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
            </div>
        </CustomerPortalLayout>
    );
}
