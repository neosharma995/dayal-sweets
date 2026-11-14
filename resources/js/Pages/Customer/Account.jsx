import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { UserIcon, MapPinIcon, KeyIcon, BoxIcon, CheckCircleIcon } from '@/Components/Icons';

export default function CustomerAccount({ customer, savedAddresses, orderHistory }) {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses', 'orders'

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
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Account Center</span>
                    <h1 className="font-serif text-2xl md:text-3xl font-black text-stone-900">My Account & Saved Preferences</h1>
                </div>
            }
        >
            <Head title="My Account - Dayal Sweets" />

            <div className="space-y-8">
                {/* Customer Identity Banner */}
                <div className="p-6 md:p-8 rounded-3xl bg-white border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white font-serif font-black text-2xl flex items-center justify-center shadow-md shadow-amber-600/20">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-serif text-xl font-bold text-stone-900">{customer.name}</h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                    {customer.tier}
                                </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">{customer.email}</p>
                            <p className="text-xs text-amber-700 font-semibold mt-1">Customer Member Since {customer.member_since}</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                                activeTab === 'profile'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                        >
                            Profile & Security
                        </button>
                        <button
                            onClick={() => setActiveTab('addresses')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                                activeTab === 'addresses'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                        >
                            Saved Addresses ({savedAddresses.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                                activeTab === 'orders'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                        >
                            All Orders ({orderHistory.length})
                        </button>
                    </div>
                </div>

                {/* Tab: Profile & Security */}
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Personal Details Form */}
                        <div className="bg-white rounded-3xl border border-amber-200 p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-stone-900 text-base">Personal Details</h3>
                                    <p className="text-xs text-stone-500">Update your name and primary contact email</p>
                                </div>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600 outline-none transition-colors"
                                    />
                                    {profileForm.errors.name && (
                                        <p className="text-xs text-rose-600 mt-1">{profileForm.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600 outline-none transition-colors"
                                    />
                                    {profileForm.errors.email && (
                                        <p className="text-xs text-rose-600 mt-1">{profileForm.errors.email}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-600/20 transition-colors disabled:opacity-50"
                                >
                                    {profileForm.processing ? 'Saving...' : 'Update Details'}
                                </button>
                            </form>
                        </div>

                        {/* Security Password Form */}
                        <div className="bg-white rounded-3xl border border-amber-200 p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                    <KeyIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-stone-900 text-base">Account Security</h3>
                                    <p className="text-xs text-stone-500">Change your login password anytime</p>
                                </div>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600 outline-none transition-colors"
                                    />
                                    {passwordForm.errors.current_password && (
                                        <p className="text-xs text-rose-600 mt-1">{passwordForm.errors.current_password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600 outline-none transition-colors"
                                    />
                                    {passwordForm.errors.password && (
                                        <p className="text-xs text-rose-600 mt-1">{passwordForm.errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600 outline-none transition-colors"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                                >
                                    {passwordForm.processing ? 'Updating...' : 'Change Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Tab: Saved Addresses */}
                {activeTab === 'addresses' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-serif font-bold text-stone-900 text-lg">Your Saved Delivery Addresses</h3>
                                <p className="text-xs text-stone-500">Manage home, office, and celebration addresses for quick delivery</p>
                            </div>
                            <button
                                onClick={() => alert('New address modal: Ready to add fresh address.')}
                                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                            >
                                + Add New Address
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {savedAddresses.map((addr) => (
                                <div key={addr.id} className="bg-white rounded-3xl border border-amber-200 p-6 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <MapPinIcon className="w-5 h-5 text-amber-600" />
                                                <span className="font-serif font-bold text-stone-900">{addr.title}</span>
                                            </div>
                                            {addr.is_default && (
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                    Default Address
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs font-bold text-stone-800">{addr.recipient_name} • {addr.phone}</p>
                                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                                            {addr.address_line}, {addr.landmark}
                                        </p>
                                        <p className="text-xs font-semibold text-stone-700 mt-1">
                                            {addr.city} - {addr.pincode}
                                        </p>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                                        <button
                                            onClick={() => alert(`Editing ${addr.title}`)}
                                            className="text-amber-700 font-bold hover:underline"
                                        >
                                            Edit Address
                                        </button>
                                        {!addr.is_default && (
                                            <button
                                                onClick={() => alert(`Set ${addr.title} as default`)}
                                                className="text-stone-500 hover:text-stone-800 font-medium"
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
                    <div className="bg-white rounded-3xl border border-amber-200 p-6 md:p-8 shadow-sm">
                        <h3 className="font-serif font-bold text-stone-900 text-lg mb-1">Dayal Sweets Order Records</h3>
                        <p className="text-xs text-stone-500 mb-6">Complete list of previous purchases and deliveries</p>

                        <div className="divide-y divide-stone-100">
                            {orderHistory.map((item) => (
                                <div key={item.order_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-amber-700 text-xs">#{item.order_id}</span>
                                            <span className="text-xs text-stone-400">• {item.date}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                item.status === 'Delivered'
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="text-xs font-semibold text-stone-800 mt-1">{item.items}</p>
                                        <p className="text-[11px] text-stone-400 mt-0.5">{item.payment}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="font-serif text-lg font-black text-stone-900">
                                            ₹{item.total}
                                        </span>
                                        <button
                                            onClick={() => alert(`Downloading invoice for #${item.order_id}`)}
                                            className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors"
                                        >
                                            Invoice PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
