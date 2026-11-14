import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { StoreIcon, BoxIcon, UserIcon, ShieldCheckIcon, LogOutIcon } from '@/Components/Icons';

export default function AdminSidebar({ sidebarOpen, onCloseSidebar }) {
    const { auth } = usePage().props;

    return (
        <>
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    onClick={onCloseSidebar}
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div>
                    {/* Brand header */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-amber-500/10">
                        <Link href={route('admin.dashboard')} className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
                                DS
                            </span>
                            <div>
                                <span className="font-bold text-lg tracking-tight text-white block">Dayal Sweets</span>
                                <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-400 block -mt-1">
                                    Admin Portal
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="p-4 space-y-1.5 text-sm font-medium">
                        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Management
                        </div>

                        <Link
                            href={route('admin.dashboard')}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                                route().current('admin.dashboard')
                                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                            }`}
                        >
                            <StoreIcon className="w-5 h-5" />
                            <span>Store Dashboard</span>
                        </Link>

                        <Link
                            href={route('admin.account')}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                                route().current('admin.account')
                                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                            }`}
                        >
                            <ShieldCheckIcon className="w-5 h-5" />
                            <span>Admin & Store Settings</span>
                        </Link>

                        <div className="pt-4 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Storefront Views
                        </div>

                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-900 transition-colors"
                        >
                            <BoxIcon className="w-5 h-5" />
                            <span>View Public Storefront</span>
                        </Link>

                        <Link
                            href={route('customer.dashboard')}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-900 transition-colors"
                        >
                            <UserIcon className="w-5 h-5" />
                            <span>Customer Portal View</span>
                        </Link>
                    </nav>
                </div>

                {/* Footer User Info & Logout */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/60">
                    <div className="flex items-center gap-3 mb-3 px-1">
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                            {auth?.user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{auth?.user?.name}</p>
                            <span className="inline-flex items-center text-[10px] bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded-full font-medium border border-amber-400/20">
                                Administrator
                            </span>
                        </div>
                    </div>

                    <Link
                        method="post"
                        href={route('admin.logout')}
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20"
                    >
                        <LogOutIcon className="w-4 h-4" />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
