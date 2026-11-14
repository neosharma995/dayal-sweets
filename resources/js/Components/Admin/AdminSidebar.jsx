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
                    className="dayal-admin-backdrop"
                />
            )}

            <aside className={`dayal-admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div>
                    {/* Brand header */}
                    <div className="dayal-sidebar-brand">
                        <Link href={route('admin.dashboard')} className="dayal-sidebar-brand-inner">
                            <span className="dayal-admin-emblem">
                                DS
                            </span>
                            <div>
                                <span className="dayal-admin-title">Dayal Sweets</span>
                                <span className="dayal-admin-badge">
                                    Admin Portal
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="dayal-sidebar-nav">
                        <div className="dayal-nav-group-title">
                            Management
                        </div>

                        <Link
                            href={route('admin.dashboard')}
                            className={`dayal-sidebar-link ${route().current('admin.dashboard') ? 'active' : ''}`}
                        >
                            <StoreIcon width="18" height="18" />
                            <span>Store Dashboard</span>
                        </Link>

                        <Link
                            href={route('admin.account')}
                            className={`dayal-sidebar-link ${route().current('admin.account') ? 'active' : ''}`}
                        >
                            <ShieldCheckIcon width="18" height="18" />
                            <span>Admin & Store Settings</span>
                        </Link>

                        <div className="dayal-nav-group-title">
                            Storefront Views
                        </div>

                        <Link
                            href="/"
                            className="dayal-sidebar-link"
                        >
                            <BoxIcon width="18" height="18" />
                            <span>View Public Storefront</span>
                        </Link>

                        <Link
                            href={route('customer.dashboard')}
                            className="dayal-sidebar-link"
                        >
                            <UserIcon width="18" height="18" />
                            <span>Customer Portal View</span>
                        </Link>
                    </nav>
                </div>

                {/* Footer User Info & Logout */}
                <div className="dayal-sidebar-footer">
                    <div className="dayal-admin-user-card">
                        <div className="dayal-admin-user-avatar">
                            {auth?.user?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p className="dayal-admin-user-name">{auth?.user?.name}</p>
                            <span className="dayal-admin-role-pill">
                                Administrator
                            </span>
                        </div>
                    </div>

                    <Link
                        method="post"
                        href={route('admin.logout')}
                        as="button"
                        className="dayal-admin-logout-btn"
                    >
                        <LogOutIcon width="16" height="16" />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
