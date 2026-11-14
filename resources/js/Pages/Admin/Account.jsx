import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ShieldCheckIcon, KeyIcon, StoreIcon, CheckCircleIcon } from '@/Components/Icons';

export default function AdminAccount({ adminUser, storeInfo, adminTeam }) {
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
                    <h1 className="text-xl font-bold text-white tracking-tight">Admin & Store Account Settings</h1>
                    <p className="text-xs text-slate-400">Manage administrator credentials, Spatie roles, and Dayal Sweets business profile</p>
                </div>
            }
        >
            <Head title="Admin Account - Dayal Sweets" />

            <div className="space-y-8 max-w-6xl">
                {/* Store & Admin Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            {adminUser.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-white">{adminUser.name}</h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    Role: Admin
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{adminUser.email}</p>
                            <p className="text-xs text-amber-400 mt-1 font-medium">Dayal Sweets Store Owner & Super Administrator</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                        <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-300">
                            <span className="text-slate-500 block text-[10px] uppercase">GSTIN Registered</span>
                            <span className="font-mono font-bold text-slate-200">{storeInfo.gstin}</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-300">
                            <span className="text-slate-500 block text-[10px] uppercase">FSSAI License</span>
                            <span className="font-mono font-bold text-slate-200">{storeInfo.fssai_license}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Admin Profile Details Form */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                <ShieldCheckIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Administrator Profile</h3>
                                <p className="text-xs text-slate-400">Update your primary administrative contact details</p>
                            </div>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Administrator Name
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                                />
                                {profileForm.errors.name && (
                                    <p className="text-xs text-rose-400 mt-1">{profileForm.errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Official Admin Email
                                </label>
                                <input
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                                />
                                {profileForm.errors.email && (
                                    <p className="text-xs text-rose-400 mt-1">{profileForm.errors.email}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-colors disabled:opacity-50"
                            >
                                {profileForm.processing ? 'Saving...' : 'Save Profile Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Change Security Password */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
                            <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
                                <KeyIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Security & Password</h3>
                                <p className="text-xs text-slate-400">Ensure your store administrator account has a strong password</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="text-xs text-rose-400 mt-1">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                                />
                                {passwordForm.errors.password && (
                                    <p className="text-xs text-rose-400 mt-1">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                            >
                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Dayal Sweets Business Info & Spatie Role Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Store Profile */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <StoreIcon className="w-5 h-5 text-amber-400" />
                            <h3 className="text-sm font-bold text-white">Store Identity & Legal Details</h3>
                        </div>

                        <div className="space-y-3 text-xs text-slate-300">
                            <div className="flex justify-between py-2 border-b border-slate-800/80">
                                <span className="text-slate-500">Business Name</span>
                                <span className="font-semibold text-white">{storeInfo.store_name}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800/80">
                                <span className="text-slate-500">Operating Entity</span>
                                <span className="font-semibold text-white">{storeInfo.legal_entity}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800/80">
                                <span className="text-slate-500">Flagship Address</span>
                                <span className="font-semibold text-white text-right max-w-xs">{storeInfo.flagship_store}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800/80">
                                <span className="text-slate-500">Operating Hours</span>
                                <span className="font-semibold text-white">{storeInfo.operating_hours}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500">Support Hotline</span>
                                <span className="font-bold text-amber-400">{storeInfo.support_phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Spatie Permissions Assigned */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-sm font-bold text-white">Spatie Permissions Guard (Admin)</h3>
                        </div>

                        <p className="text-xs text-slate-400 mb-3">
                            The following granular permissions are bound to your active <span className="text-amber-400 font-semibold">admin</span> role:
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {adminUser.permissions && adminUser.permissions.map((perm) => (
                                <span
                                    key={perm}
                                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                >
                                    ✓ {perm}
                                </span>
                            ))}
                        </div>

                        <div className="mt-5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                            <span className="text-slate-300 font-bold block mb-1">Role-Based Access Control (RBAC):</span>
                            Customers attempting to access <code className="text-amber-400">/admin/*</code> routes are automatically blocked by the Spatie <code className="text-amber-400">RoleMiddleware</code> guard.
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
