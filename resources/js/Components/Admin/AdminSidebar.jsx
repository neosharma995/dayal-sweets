import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { StoreIcon, BoxIcon, UserIcon, ShieldCheckIcon, LogOutIcon, TruckIcon, MapPinIcon } from '@/Components/Icons';

export default function AdminSidebar({ sidebarOpen, onCloseSidebar, onRequestLogout }) {
    const { auth, outlets = [], activeOutletId } = usePage().props;

    const userRoles = auth?.user?.roles || [];
    const userPermissions = auth?.user?.permissions || [];
    const isAdmin = userRoles.includes('admin') || auth?.user?.role === 'admin';

    const can = (permission) => {
        if (Array.isArray(userPermissions) && userPermissions.length > 0) {
            return userPermissions.includes(permission);
        }
        return isAdmin;
    };

    const isProductRouteActive = Boolean(
        route().current('admin.products.*') ||
        route().current('admin.categories.*') ||
        route().current('admin.seasonal-mithais.*') ||
        route().current('admin.occasions.*') ||
        route().current('admin.diet-preferences.*') ||
        route().current('admin.product-tags.*') ||
        route().current('admin.attributes.*')
    );

    const isOutletRouteActive = Boolean(
        route().current('admin.outlets.*') ||
        route().current('admin.shipping-zones.*') ||
        route().current('admin.tables.*')
    );

    const isPagesRouteActive = Boolean(
        route().current('admin.pages.*')
    );

    const [productsOpen, setProductsOpen] = useState(isProductRouteActive);
    const [outletsOpen, setOutletsOpen] = useState(isOutletRouteActive);
    const [pagesOpen, setPagesOpen] = useState(isPagesRouteActive);

    useEffect(() => {
        if (isProductRouteActive) {
            setProductsOpen(true);
        }
    }, [isProductRouteActive]);

    useEffect(() => {
        if (isOutletRouteActive) {
            setOutletsOpen(true);
        }
    }, [isOutletRouteActive]);

    useEffect(() => {
        if (isPagesRouteActive) {
            setPagesOpen(true);
        }
    }, [isPagesRouteActive]);

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

                        {/* 1. Dashboard - visible to all authorized staff */}
                        <Link
                            href={route('admin.dashboard')}
                            className={`dayal-sidebar-link ${route().current('admin.dashboard') ? 'active' : ''}`}
                        >
                            <StoreIcon width="18" height="18" />
                            <span>Dashboard</span>
                        </Link>

                        {/* 2. Outlets Accordion / Dropdown (Outlets, Tables & QR Scanners) */}
                        {can('manage outlets') && (
                            <div className="dayal-sidebar-dropdown-group">
                                <div
                                    onClick={() => setOutletsOpen((prev) => !prev)}
                                    className={`dayal-sidebar-link ${isOutletRouteActive ? 'parent-active' : ''}`}
                                    style={{ cursor: 'pointer', justifyContent: 'space-between', userSelect: 'none' }}
                                    title="Click to toggle outlets, tables & QR scanners menu"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <MapPinIcon width="18" height="18" />
                                        <span>Outlets</span>
                                    </div>

                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        style={{
                                            transform: outletsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {outletsOpen && (
                                    <div className="dayal-sidebar-submenu">
                                        {/* Outlet-Wise Filter Dropdown inside Outlets menu */}
                                        {outlets && outlets.length > 0 && (
                                            <div style={{ padding: '0.35rem 0.65rem 0.55rem', marginBottom: '0.25rem', borderBottom: '1px solid #F1F5F9' }}>
                                                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8C6226', marginBottom: '0.25rem' }}>
                                                    Filter by Outlet
                                                </label>
                                                <select
                                                    value={activeOutletId || 'all'}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === 'all') {
                                                            router.post(route('admin.outlets.clear-context'), {}, { preserveScroll: true });
                                                        } else {
                                                            router.post(route('admin.outlets.switch-context'), { outlet_id: Number(val) }, { preserveScroll: true });
                                                        }
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.38rem 0.5rem',
                                                        borderRadius: '0.375rem',
                                                        border: '1px solid #E6D2B5',
                                                        background: '#FDF8F0',
                                                        color: '#5A1E1E',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <option value="all">All Outlets ({outlets.length})</option>
                                                    {outlets.map((o) => (
                                                        <option key={o.id} value={o.id}>
                                                            {o.name}{o.city ? ` (${o.city})` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <Link
                                            href={route('admin.outlets.index')}
                                            className={`dayal-sidebar-sublink ${route().current('admin.outlets.index') || route().current('admin.outlets.show') || route().current('admin.outlets.edit') || route().current('admin.shipping-zones.*') ? 'active' : ''}`}
                                        >
                                            <span className="dayal-sublink-dot" />
                                            <span>All Outlets</span>
                                        </Link>

                                        <Link
                                            href={route('admin.outlets.create')}
                                            className={`dayal-sidebar-sublink ${route().current('admin.outlets.create') ? 'active' : ''}`}
                                        >
                                            <span className="dayal-sublink-dot" />
                                            <span>Add New Outlet</span>
                                        </Link>

                                        <Link
                                            href={route('admin.tables.index')}
                                            className={`dayal-sidebar-sublink ${route().current('admin.tables.index') || route().current('admin.tables.edit') ? 'active' : ''}`}
                                        >
                                            <span className="dayal-sublink-dot" />
                                            <span>All Tables</span>
                                        </Link>

                                        <Link
                                            href={route('admin.tables.create')}
                                            className={`dayal-sidebar-sublink ${route().current('admin.tables.create') ? 'active' : ''}`}
                                        >
                                            <span className="dayal-sublink-dot" />
                                            <span>Add New Table</span>
                                        </Link>

                                        <Link
                                            href={route('admin.tables.scanners')}
                                            className={`dayal-sidebar-sublink ${route().current('admin.tables.scanners') ? 'active' : ''}`}
                                        >
                                            <span className="dayal-sublink-dot" />
                                            <span>Table QR Scanners</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. Tax Rates */}
                        {can('manage taxes') && (
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
                        )}

                        {/* 4. Orders Management */}
                        {can('manage orders') && (
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
                        )}

                        {/* 4a. Registered Customers */}
                        {can('manage customers') && (
                            <Link
                                href={route('admin.customers.index')}
                                className={`dayal-sidebar-link ${route().current('admin.customers.*') ? 'active' : ''}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                <span>Customers</span>
                            </Link>
                        )}

                        {/* 4b. Discount Coupons */}
                        {can('manage coupons') && (
                            <Link
                                href={route('admin.coupons.index')}
                                className={`dayal-sidebar-link ${route().current('admin.coupons.*') ? 'active' : ''}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                </svg>
                                <span>Coupons &amp; Rules</span>
                            </Link>
                        )}

                        {/* 5. Products Accordion / Nested Navigation */}
                        {can('manage products') && (
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
                        )}

                        {/* Customer Contact Queries */}
                        {can('manage queries') && (
                            <Link
                                href={route('admin.contact-queries.index')}
                                className={`dayal-sidebar-link ${route().current('admin.contact-queries.*') ? 'active' : ''}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <span>Contact Queries</span>
                            </Link>
                        )}

                        {/* Customer Dining Queries */}
                        {can('manage queries') && (
                            <Link
                                href={route('admin.dining-queries.index')}
                                className={`dayal-sidebar-link ${route().current('admin.dining-queries.*') ? 'active' : ''}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                    <line x1="6" y1="1" x2="6" y2="4" />
                                    <line x1="10" y1="1" x2="10" y2="4" />
                                    <line x1="14" y1="1" x2="14" y2="4" />
                                </svg>
                                <span>Dining Queries</span>
                            </Link>
                        )}

                        {/* Website Pages & SEO Information */}
                        {(can('manage pages') || can('manage seo')) && (
                            <div className="dayal-sidebar-dropdown-group">
                                <div
                                    onClick={() => setPagesOpen((prev) => !prev)}
                                    className={`dayal-sidebar-link ${isPagesRouteActive ? 'parent-active' : ''}`}
                                    style={{ cursor: 'pointer', justifyContent: 'space-between', userSelect: 'none' }}
                                    title="Click to toggle website pages & SEO menu"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                        </svg>
                                        <span>Website Pages</span>
                                    </div>

                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        style={{
                                            transform: pagesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {pagesOpen && (
                                    <div className="dayal-sidebar-submenu">
                                        {can('manage pages') && (
                                            <Link
                                                href={route('admin.pages.index')}
                                                className={`dayal-sidebar-sublink ${route().current('admin.pages.index') || route().current('admin.pages.edit') ? 'active' : ''}`}
                                            >
                                                <span className="dayal-sublink-dot" />
                                                <span>All Website Pages</span>
                                            </Link>
                                        )}

                                        {(can('manage seo') || can('manage pages')) && (
                                            <Link
                                                href={route('admin.pages.seo')}
                                                className={`dayal-sidebar-sublink ${route().current('admin.pages.seo') ? 'active' : ''}`}
                                            >
                                                <span className="dayal-sublink-dot" />
                                                <span>Pages SEO Information</span>
                                            </Link>
                                        )}

                                        {can('manage pages') && (
                                            <>
                                                <Link
                                                    href={route('admin.pages.about-us')}
                                                    className={`dayal-sidebar-sublink ${route().current('admin.pages.about-us') ? 'active' : ''}`}
                                                >
                                                    <span className="dayal-sublink-dot" />
                                                    <span>Edit About Us</span>
                                                </Link>

                                                <Link
                                                    href={route('admin.pages.contact-us')}
                                                    className={`dayal-sidebar-sublink ${route().current('admin.pages.contact-us') ? 'active' : ''}`}
                                                >
                                                    <span className="dayal-sublink-dot" />
                                                    <span>Edit Contact Us</span>
                                                </Link>

                                                <Link
                                                    href={route('admin.pages.gallery')}
                                                    className={`dayal-sidebar-sublink ${route().current('admin.pages.gallery') ? 'active' : ''}`}
                                                >
                                                    <span className="dayal-sublink-dot" />
                                                    <span>Edit Gallery</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pages SEO Quick Access (Right After Website Pages) */}
                        {can('manage seo') && (
                            <Link
                                href={route('admin.pages.seo')}
                                className={`dayal-sidebar-link ${route().current('admin.pages.seo') ? 'active' : ''}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    <line x1="11" y1="8" x2="11" y2="14" />
                                    <line x1="8" y1="11" x2="14" y2="11" />
                                </svg>
                                <span>Pages SEO</span>
                            </Link>
                        )}

                        {/* Header & Footer Branding */}
                        {can('manage header footer') && (
                            <Link
                                href={route('admin.header-footer.index')}
                                className={`dayal-sidebar-link ${route().current('admin.header-footer.*') ? 'active' : ''}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <line x1="3" y1="9" x2="21" y2="9" />
                                    <line x1="3" y1="15" x2="21" y2="15" />
                                </svg>
                                <span>Header &amp; Footer</span>
                            </Link>
                        )}

                        {/* Roles & Permissions Management */}
                        {can('manage roles') && (
                            <Link
                                href={route('admin.roles.index')}
                                className={`dayal-sidebar-link ${route().current('admin.roles.*') ? 'active' : ''}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <span>Roles &amp; Permissions</span>
                            </Link>
                        )}

                        {/* Staff Management */}
                        {can('manage staff') && (
                            <Link
                                href={route('admin.users.index')}
                                className={`dayal-sidebar-link ${route().current('admin.users.*') ? 'active' : ''}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                <span>Staff Management</span>
                            </Link>
                        )}

                        {can('manage store settings') && (
                            <Link
                                href={route('admin.account')}
                                className={`dayal-sidebar-link ${route().current('admin.account') ? 'active' : ''}`}
                            >
                                <ShieldCheckIcon width="18" height="18" />
                                <span>Admin & Store Settings</span>
                            </Link>
                        )}
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
                                {isAdmin
                                    ? 'Administrator'
                                    : (userRoles[0] ? userRoles[0].replace(/_/g, ' ').toUpperCase() : 'Staff Member')}
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
