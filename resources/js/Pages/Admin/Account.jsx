import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ShieldCheckIcon, KeyIcon, UserIcon } from '@/Components/Icons';

export default function AdminAccount({ adminUser }) {
    // Profile Update Form
    const profileForm = useForm({
        name: adminUser?.name || '',
        email: adminUser?.email || '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.patch(route('admin.account.profile'), {
            preserveScroll: true,
        });
    };

    // Password Update Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route('admin.account.password'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', fontFamily: 'serif' }}>
                        Account Settings
                    </h1>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                        Manage your administrator profile details and security credentials
                    </p>
                </div>
            }
        >
            <Head title="Account Settings - Dayal Sweets" />

            <div style={{ width: '100%' }}>
                {/* Profile Overview Card */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        marginBottom: '1.75rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1.25rem',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #B88E4B 0%, #8C6226 100%)',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.35rem',
                                fontWeight: 700,
                                flexShrink: 0,
                                boxShadow: '0 2px 6px rgba(184, 142, 75, 0.25)',
                            }}
                        >
                            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                                    {adminUser?.name}
                                </h2>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.15rem 0.55rem',
                                        borderRadius: '9999px',
                                        background: '#ECFDF5',
                                        color: '#047857',
                                        border: '1px solid #A7F3D0',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                                    {adminUser?.role || 'Administrator'}
                                </span>
                            </div>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', color: '#64748B' }}>
                                {adminUser?.email}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8125rem' }}>
                        <div>
                            <span style={{ display: 'block', color: '#94A3B8', fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                                Account Status
                            </span>
                            <strong style={{ color: '#059669' }}>Active &amp; Verified</strong>
                        </div>
                        <div>
                            <span style={{ display: 'block', color: '#94A3B8', fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                                Member Since
                            </span>
                            <strong style={{ color: '#0F172A' }}>{adminUser?.created_at_formatted || 'Active'}</strong>
                        </div>
                    </div>
                </div>

                {/* Forms Grid: 1. Profile Info, 2. Update Password */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
                    {/* 1. Profile Details Form */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.75rem',
                            padding: '1.75rem',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '0.375rem', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                                    <UserIcon width="16" height="16" />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                                    Profile Details
                                </h3>
                            </div>
                            <p style={{ margin: '0 0 1.5rem', fontSize: '0.8125rem', color: '#64748B' }}>
                                Update your account name and official email address.
                            </p>

                            <form onSubmit={handleProfileSubmit}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.55rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                            boxSizing: 'border-box',
                                        }}
                                        required
                                    />
                                    {profileForm.errors.name && (
                                        <p style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{profileForm.errors.name}</p>
                                    )}
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.55rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                            boxSizing: 'border-box',
                                        }}
                                        required
                                    />
                                    {profileForm.errors.email && (
                                        <p style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{profileForm.errors.email}</p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <button
                                        type="submit"
                                        disabled={profileForm.processing}
                                        style={{
                                            padding: '0.5rem 1.25rem',
                                            borderRadius: '0.375rem',
                                            background: '#B88E4B',
                                            color: '#FFFFFF',
                                            fontSize: '0.8125rem',
                                            fontWeight: 700,
                                            border: 'none',
                                            cursor: profileForm.processing ? 'not-allowed' : 'pointer',
                                            opacity: profileForm.processing ? 0.7 : 1,
                                            boxShadow: '0 1px 2px rgba(184, 142, 75, 0.25)',
                                        }}
                                    >
                                        {profileForm.processing ? 'Saving...' : 'Save Profile Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* 2. Security & Password Form */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.75rem',
                            padding: '1.75rem',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '0.375rem', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                                    <KeyIcon width="16" height="16" />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                                    Update Password
                                </h3>
                            </div>
                            <p style={{ margin: '0 0 1.5rem', fontSize: '0.8125rem', color: '#64748B' }}>
                                Ensure your administrative account uses a strong, secure password.
                            </p>

                            <form onSubmit={handlePasswordSubmit}>
                                <div style={{ marginBottom: '1.1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.55rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                            boxSizing: 'border-box',
                                        }}
                                        required
                                    />
                                    {passwordForm.errors.current_password && (
                                        <p style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{passwordForm.errors.current_password}</p>
                                    )}
                                </div>

                                <div style={{ marginBottom: '1.1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.55rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                            boxSizing: 'border-box',
                                        }}
                                        required
                                    />
                                    {passwordForm.errors.password && (
                                        <p style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{passwordForm.errors.password}</p>
                                    )}
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.55rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                            boxSizing: 'border-box',
                                        }}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        style={{
                                            padding: '0.5rem 1.25rem',
                                            borderRadius: '0.375rem',
                                            background: '#0F172A',
                                            color: '#FFFFFF',
                                            fontSize: '0.8125rem',
                                            fontWeight: 700,
                                            border: 'none',
                                            cursor: passwordForm.processing ? 'not-allowed' : 'pointer',
                                            opacity: passwordForm.processing ? 0.7 : 1,
                                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.25)',
                                        }}
                                    >
                                        {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
