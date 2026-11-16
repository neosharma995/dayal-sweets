import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { StoreIcon, BoxIcon, UserIcon, ShieldCheckIcon, LogOutIcon } from '@/Components/Icons';

export default function AdminSidebar({ sidebarOpen, onCloseSidebar, onRequestLogout }) {
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
                            href={route('admin.products.index')}
                            className={`dayal-sidebar-link ${route().current('admin.products.*') ? 'active' : ''}`}
                        >
                            <BoxIcon width="18" height="18" />
                            <span>Products</span>
                        </Link>

                        <Link
                            href={route('admin.categories.index')}
                            className={`dayal-sidebar-link ${route().current('admin.categories.*') ? 'active' : ''}`}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>Product Categories</span>
                        </Link>

                        <Link
                            href={route('admin.seasonal-mithais.index')}
                            className={`dayal-sidebar-link ${route().current('admin.seasonal-mithais.*') ? 'active' : ''}`}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Seasonal Mithai Categories</span>
                        </Link>

                        <Link
                            href={route('admin.occasions.index')}
                            className={`dayal-sidebar-link ${route().current('admin.occasions.*') ? 'active' : ''}`}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                            <span>Occasion Categories</span>
                        </Link>

                        <Link
                            href={route('admin.diet-preferences.index')}
                            className={`dayal-sidebar-link ${route().current('admin.diet-preferences.*') ? 'active' : ''}`}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Diet Preference Categories</span>
                        </Link>

                        <Link
                            href={route('admin.product-tags.index')}
                            className={`dayal-sidebar-link ${route().current('admin.product-tags.*') ? 'active' : ''}`}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>Product Tags</span>
                        </Link>

                        <Link
                            href={route('admin.attributes.index')}
                            className={`dayal-sidebar-link ${route().current('admin.attributes.*') ? 'active' : ''}`}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <span>Product Attributes</span>
                        </Link>

                        <Link
                            href={route('admin.account')}
                            className={`dayal-sidebar-link ${route().current('admin.account') ? 'active' : ''}`}
                        >
                            <ShieldCheckIcon width="18" height="18" />
                            <span>Admin & Store Settings</span>
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

                    <button
                        type="button"
                        onClick={onRequestLogout}
                        className="dayal-admin-logout-btn"
                        style={{ cursor: 'pointer' }}
                    >
                        <LogOutIcon width="16" height="16" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
