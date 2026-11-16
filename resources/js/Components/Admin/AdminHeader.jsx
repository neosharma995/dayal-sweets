import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LogOutIcon } from '@/Components/Icons';

export default function AdminHeader({ onToggleSidebar, header }) {
    const { auth } = usePage().props;

    return (
        <header className="dayal-admin-header">
            <div className="dayal-admin-header-left">
                <button
                    onClick={onToggleSidebar}
                    className="dayal-admin-toggle-btn"
                    aria-label="Open sidebar"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {header && <div>{header}</div>}
            </div>

            <div className="dayal-admin-header-right">
                <Link
                    href={route('admin.account')}
                    className="dayal-admin-head-btn"
                >
                    Admin Account
                </Link>

                <Link
                    method="post"
                    href={route('admin.logout')}
                    as="button"
                    title="Sign Out"
                    className="dayal-admin-head-logout"
                >
                    <LogOutIcon width="16" height="16" />
                </Link>
            </div>
        </header>
    );
}
