import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ShieldCheckIcon, KeyIcon, StoreIcon } from '@/Components/Icons';

export default function AdminAccount({ adminUser, storeInfo }) {
    // Profile Update Form
    const profileForm = useForm({
        name: adminUser.name,
        email: adminUser.email,
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
                    <h1 className="dayal-font-serif">Admin & Store Account Settings</h1>
                    <p className="dayal-text-muted">Manage administrator credentials, Spatie roles, and Dayal Sweets business profile</p>
                </div>
            }
        >
            <Head title="Admin Account - Dayal Sweets" />

            {/* Store & Admin Banner */}
            <div className="dayal-admin-profile-banner dayal-mb-6">
                <div className="dayal-flex-start">
                    <div className="dayal-profile-avatar dayal-profile-avatar--gold">
                        {adminUser.name.charAt(0)}
                    </div>
                    <div>
                        <div className="dayal-flex-start">
                            <h2>{adminUser.name}</h2>
                            <span className="dayal-badge dayal-badge--gold">
                                Role: Admin
                            </span>
                        </div>
                        <p className="dayal-text-muted">{adminUser.email}</p>
                        <p className="dayal-text-gold dayal-mt-1">Dayal Sweets Store Owner & Super Administrator</p>
                    </div>
                </div>

                <div className="dayal-flex-start">
                    <div className="dayal-card dayal-card--subtle">
                        <span className="dayal-text-muted dayal-fs-sm dayal-block">GSTIN Registered</span>
                        <strong className="dayal-text-gold">{storeInfo.gstin}</strong>
                    </div>
                    <div className="dayal-card dayal-card--subtle">
                        <span className="dayal-text-muted dayal-fs-sm dayal-block">FSSAI License</span>
                        <strong className="dayal-text-gold">{storeInfo.fssai_license}</strong>
                    </div>
                </div>
            </div>

            <div className="dayal-grid-2 dayal-mb-6">
                {/* Admin Profile Details Form */}
                <div className="dayal-admin-card">
                    <div className="dayal-admin-card-header">
                        <ShieldCheckIcon width="20" height="20" />
                        <div>
                            <h3 className="dayal-font-serif">Administrator Profile</h3>
                            <p className="dayal-text-muted">Update your primary administrative contact details</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit}>
                        <div className="dayal-form-group">
                            <label className="dayal-label">Administrator Name</label>
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
                            <label className="dayal-label">Official Admin Email</label>
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
                            className="dayal-btn dayal-btn--secondary"
                        >
                            {profileForm.processing ? 'Saving...' : 'Save Profile Changes'}
                        </button>
                    </form>
                </div>

                {/* Change Security Password */}
                <div className="dayal-admin-card">
                    <div className="dayal-admin-card-header">
                        <KeyIcon width="20" height="20" />
                        <div>
                            <h3 className="dayal-font-serif">Security & Password</h3>
                            <p className="dayal-text-muted">Ensure your store administrator account has a strong password</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit}>
                        <div className="dayal-form-group">
                            <label className="dayal-label">Current Password</label>
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
                            <label className="dayal-label">New Password</label>
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
                            <label className="dayal-label">Confirm New Password</label>
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
                            className="dayal-btn dayal-btn--primary"
                        >
                            {passwordForm.processing ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Dayal Sweets Business Info & Spatie Role Details */}
            <div className="dayal-grid-2">
                {/* Store Profile */}
                <div className="dayal-admin-card">
                    <div className="dayal-admin-card-header">
                        <StoreIcon width="20" height="20" />
                        <h3 className="dayal-font-serif">Store Identity & Legal Details</h3>
                    </div>

                    <div>
                        <div className="dayal-admin-info-row">
                            <span className="dayal-text-muted">Business Name</span>
                            <strong>{storeInfo.store_name}</strong>
                        </div>
                        <div className="dayal-admin-info-row">
                            <span className="dayal-text-muted">Operating Entity</span>
                            <strong>{storeInfo.legal_entity}</strong>
                        </div>
                        <div className="dayal-admin-info-row">
                            <span className="dayal-text-muted">Flagship Address</span>
                            <strong>{storeInfo.flagship_store}</strong>
                        </div>
                        <div className="dayal-admin-info-row">
                            <span className="dayal-text-muted">Operating Hours</span>
                            <strong>{storeInfo.operating_hours}</strong>
                        </div>
                        <div className="dayal-admin-info-row">
                            <span className="dayal-text-muted">Support Hotline</span>
                            <strong className="dayal-text-gold">{storeInfo.support_phone}</strong>
                        </div>
                    </div>
                </div>

                {/* Spatie Permissions Assigned */}
                <div className="dayal-admin-card">
                    <div className="dayal-admin-card-header">
                        <ShieldCheckIcon width="20" height="20" />
                        <h3 className="dayal-font-serif">Spatie Permissions Guard (Admin)</h3>
                    </div>

                    <p className="dayal-text-muted dayal-mb-3">
                        The following granular permissions are bound to your active <strong className="dayal-text-gold">admin</strong> role:
                    </p>

                    <div className="dayal-flex-wrap dayal-mb-4">
                        {adminUser.permissions && adminUser.permissions.map((perm) => (
                            <span key={perm} className="dayal-badge dayal-badge--green">
                                ✓ {perm}
                            </span>
                        ))}
                    </div>

                    <div className="dayal-alert dayal-alert--warning">
                        <span>Role-Based Access Control (RBAC): Customers attempting to access <code>/admin/*</code> routes are automatically blocked by the Spatie <code>RoleMiddleware</code> guard.</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
