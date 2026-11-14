import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LogOutIcon, StoreIcon } from '@/Components/Icons';

export default function AdminHeader({ onToggleSidebar, header }) {
    const { auth } = usePage().props;

    return (
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 -ml-2 text-slate-400 hover:text-white md:hidden rounded-lg focus:outline-none"
                    aria-label="Open sidebar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {header && <div>{header}</div>}
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Dayal Sweets Live Store Online
                </div>

                <Link
                    href={route('admin.account')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                    Admin Account
                </Link>

                <Link
                    method="post"
                    href={route('admin.logout')}
                    as="button"
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                    <LogOutIcon className="w-4 h-4" />
                </Link>
            </div>
        </header>
    );
}
