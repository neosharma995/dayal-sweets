import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { StoreIcon, BoxIcon, UserIcon, ShieldCheckIcon, LogOutIcon, TruckIcon, MapPinIcon } from '@/Components/Icons';

export default function AdminSidebar({ sidebarOpen, onCloseSidebar, onRequestLogout }) {
    const { auth } = usePage().props;

    const isProductRouteActive = Boolean(
        route().current('admin.products.*') ||
        route().current('admin.categories.*') ||
        route().current('admin.seasonal-mithais.*') ||
        route().current('admin.occasions.*') ||
        route().current('admin.diet-preferences.*') ||
        route().current('admin.product-tags.*') ||
        route().current('admin.attributes.*')
    );

    const [productsOpen, setProductsOpen] = useState(isProductRouteActive);

    useEffect(() => {
        if (isProductRouteActive) {
            setProductsOpen(true);
        }
    }, [isProductRouteActive]);

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

                        {/* Orders Management */}
                        <Link
                            href={route('admin.orders.index')}
                            className={`dayal-sidebar-link ${route().current('admin.orders.*') ? 'active' : ''}`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            <span>Orders</span>
                        </Link>

                        {/* Products Accordion / Nested Navigation */}
                        <div className="dayal-sidebar-dropdown-group">
                            <div
                                onClick={() => setProductsOpen((prev) => !prev)}
                                className={`dayal-sidebar-link ${isProductRouteActive ? 'parent-active' : ''}`}
                                style={{ cursor: 'pointer', justifyContent: 'space-between', userSelect: 'none' }}
                                title="Click to toggle products menu"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <BoxIcon width="18" height="18" />
                                    <span>Products</span>
                                </div>

                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    style={{
                                        transform: productsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease',
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {productsOpen && (
                                <div className="dayal-sidebar-submenu">
                                    <Link
                                        href={route('admin.products.index')}
                                        className={`dayal-sidebar-sublink ${route().current('admin.products.index') || route().current('admin.products.show') ? 'active' : ''}`}
                                    >
                                        <span className="dayal-sublink-dot" />
                                        <span>All Products</span>
                                    </Link>

                                    <Link
                                        href={route('admin.products.create')}
                                        className={`dayal-sidebar-sublink ${route().current('admin.products.create') ? 'active' : ''}`}
                                    >
                                        <span className="dayal-sublink-dot" />
                                        <span>Add New Product</span>
                                    </Link>

                                    <Link
                                        href={route('admin.categories.index')}
                                        className={`dayal-sidebar-sublink ${route().current('admin.categories.*') ? 'active' : ''}`}
                                    >
                                        <span className="dayal-sublink-dot" />
                                        <span>Product Categories</span>
                                    </Link>

                                    <Link
                                        href={route('admin.seasonal-mithais.index')}
                                        className={`dayal-sidebar-sublink ${route().current('admin.seasonal-mithais.*') ? 'active' : ''}`}
                                    >
                                        <span className="dayal-sublink-dot" />
                                        <span>Seasonal Mithai</span>
                                    </Link>

                                    <Link
                                        href={route('admin.occasions.index')}
                                        className={`dayal-sidebar-sublink ${route().current('admin.occasions.*') ? 'active' : ''}`}
                                    >
                                        <span className="dayal-sublink-dot" />
                                        <span>Occasion Categories</span>
                                    </Link>

                                    <Link
                                        href={route('admin.diet-preferences.index')}
                                        className={`dayal-sidebar-sublink ${route().current('admin.diet-preferences.*') ? 'active' : ''}`}
                                    >
                                        <span className="dayal-sublink-dot" />
                                        <span>Diet Preference</span>
                                    </Link>

                                    <Link
                                        href={route('admin.attributes.index')}
                                        className={`dayal-sidebar-sublink ${route().current('admin.attributes.*') ? 'active' : ''}`}
                                    >
                                        <span className="dayal-sublink-dot" />
                                        <span>Product Attributes</span>
                                    </Link>

                                    <Link
                                        href={route('admin.product-tags.index')}
                                        className={`dayal-sidebar-sublink ${route().current('admin.product-tags.*') ? 'active' : ''}`}
                                    >
                                        <span className="dayal-sublink-dot" />
                                        <span>Product Tags</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Shipping Zones */}
                        <Link
                            href={route('admin.shipping-zones.index')}
                            className={`dayal-sidebar-link ${route().current('admin.shipping-zones.*') ? 'active' : ''}`}
                        >
                            <TruckIcon width="18" height="18" />
                            <span>Shipping Zones</span>
                        </Link>

                        {/* Outlets Management */}
                        <Link
                            href={route('admin.outlets.index')}
                            className={`dayal-sidebar-link ${route().current('admin.outlets.*') ? 'active' : ''}`}
                        >
                            <MapPinIcon width="18" height="18" />
                            <span>Outlets</span>
                        </Link>

                        {/* Tax Rates */}
                        <Link
                            href={route('admin.taxes.index')}
                            className={`dayal-sidebar-link ${route().current('admin.taxes.*') ? 'active' : ''}`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="5" x2="5" y2="19"></line>
                                <circle cx="6.5" cy="6.5" r="2.5"></circle>
                                <circle cx="17.5" cy="17.5" r="2.5"></circle>
                            </svg>
                            <span>Taxes &amp; GST Rates</span>
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
