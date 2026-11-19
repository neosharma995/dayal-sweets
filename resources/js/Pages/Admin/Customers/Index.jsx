import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CustomersIndex({ customers, stats, filters }) {
    const { flash } = usePage().props || {};

    const [search, setSearch] = useState(filters.search || '');
    const [dateFilter, setDateFilter] = useState(filters.date || 'all');
    const [ordersFilter, setOrdersFilter] = useState(filters.orders || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [showCards, setShowCards] = useState(false);

    const handleApplyFilters = (newOverrides = {}) => {
        router.get(
            route('admin.customers.index'),
            {
                search: newOverrides.search !== undefined ? newOverrides.search : search,
                date: newOverrides.date !== undefined ? newOverrides.date : dateFilter,
                orders: newOverrides.orders !== undefined ? newOverrides.orders : ordersFilter,
                per_page: newOverrides.per_page !== undefined ? newOverrides.per_page : perPage,
                ...newOverrides,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleApplyFilters({ search });
    };

    const handleClearFilters = () => {
        setSearch('');
        setDateFilter('all');
        setOrdersFilter('all');
        router.get(route('admin.customers.index'), { per_page: perPage }, { preserveState: true });
    };

    const handleTabFilter = (tabOrders, tabDate) => {
        setOrdersFilter(tabOrders);
        setDateFilter(tabDate);
        handleApplyFilters({ orders: tabOrders, date: tabDate });
    };

    // Determine active tab
    const getActiveTabKey = () => {
        if (dateFilter === 'today') return 'today';
        if (dateFilter === 'this_week') return 'this_week';
        if (ordersFilter === 'with_orders') return 'with_orders';
        if (ordersFilter === 'no_orders') return 'no_orders';
        return 'all';
    };
    const activeTab = getActiveTabKey();

    return (
        <AdminLayout>
            <Head title="Registered Customers - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
                {/* Header Row */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.dashboard')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Admin
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Customers</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Registered Customers
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                            All storefront users registered on Dayal Sweets. Ordered by newest registrations first.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => setShowCards(!showCards)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 0.85rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transform: showCards ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                            <span>{showCards ? 'Hide Summary Cards ▲' : 'Expand Summary Cards ▼'}</span>
                        </button>

                        <Link
                            href={route('admin.users.index')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 1rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            </svg>
                            <span>Go to Staff Management →</span>
                        </Link>
                    </div>
                </div>

                {/* Top Metric Cards - Collapsed by default, counts only, NO clicks */}
                {showCards && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {/* 1. Total Registered Customers */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Total Registered Customers
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                                {stats.total_customers ?? 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>
                                Active storefront shoppers
                            </div>
                        </div>

                        {/* 2. New This Week */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                New This Week
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2563EB', marginTop: '0.35rem' }}>
                                {stats.new_this_week ?? 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Registered in last 7 days
                            </div>
                        </div>

                        {/* 3. Customers With Orders */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Customers With Orders
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>
                                {stats.with_orders ?? 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Placed 1 or more orders
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Filter Buttons without count - Clicks happen here */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {[
                        { key: 'all', label: 'All Customers', orders: 'all', date: 'all' },
                        { key: 'with_orders', label: 'Has Placed Orders', orders: 'with_orders', date: 'all' },
                        { key: 'no_orders', label: 'No Orders Yet', orders: 'no_orders', date: 'all' },
                        { key: 'this_week', label: 'New This Week', orders: 'all', date: 'this_week' },
                        { key: 'today', label: 'Registered Today', orders: 'all', date: 'today' },
                    ].map((tab) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleTabFilter(tab.orders, tab.date)}
                                style={{
                                    padding: '0.45rem 0.9rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.8125rem',
                                    fontWeight: isActive ? 700 : 500,
                                    border: isActive ? '1px solid #7A1C1C' : '1px solid #CBD5E1',
                                    background: isActive ? '#7A1C1C' : '#FFFFFF',
                                    color: isActive ? '#FFFFFF' : '#475569',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    transition: 'all 0.15s ease',
                                    boxShadow: isActive ? '0 1px 2px rgba(122, 28, 28, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
                                }}
                            >
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Search & Filter Toolbar */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        padding: '1rem 1.25rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}
                >
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: '1 1 340px', maxWidth: '480px' }}>
                        <input
                            type="text"
                            placeholder="Search by customer name, email, or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.8125rem',
                                outline: 'none',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '0.5rem 0.85rem',
                                borderRadius: '0.375rem',
                                background: '#7A1C1C',
                                color: '#FFFFFF',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Search
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    handleApplyFilters({ search: '' });
                                }}
                                style={{
                                    padding: '0.5rem 0.65rem',
                                    borderRadius: '0.375rem',
                                    background: '#F1F5F9',
                                    color: '#475569',
                                    fontSize: '0.8125rem',
                                    border: '1px solid #CBD5E1',
                                    cursor: 'pointer',
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Dates:</span>
                            <select
                                value={dateFilter}
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                    handleApplyFilters({ date: e.target.value });
                                }}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Registered Today</option>
                                <option value="this_week">This Week</option>
                                <option value="this_month">This Month</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Orders:</span>
                            <select
                                value={ordersFilter}
                                onChange={(e) => {
                                    setOrdersFilter(e.target.value);
                                    handleApplyFilters({ orders: e.target.value });
                                }}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Order Statuses</option>
                                <option value="with_orders">Has Placed Orders</option>
                                <option value="no_orders">No Orders Yet</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Per page:</span>
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    setPerPage(val);
                                    handleApplyFilters({ per_page: val });
                                }}
                                style={{
                                    padding: '0.45rem 0.6rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        {(search || dateFilter !== 'all' || ordersFilter !== 'all') && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    background: '#F1F5F9',
                                    color: '#475569',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                }}
                            >
                                Reset All
                            </button>
                        )}
                    </div>
                </div>

                {/* Customers Table */}
                <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    <th style={{ padding: '0.85rem 1.25rem' }}>Customer Info</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Email &amp; Status</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Orders Placed</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Total Spend</th>
                                    <th style={{ padding: '0.85rem 1.25rem' }}>Registered On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
                                            <div style={{ fontWeight: 600, color: '#475569' }}>No registered customers found.</div>
                                            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Any user who signs up on the store will automatically appear here.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    customers.data.map((c) => (
                                        <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                                            {/* Customer Info */}
                                            <td style={{ padding: '0.85rem 1.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '999px',
                                                            background: '#F1F5F9',
                                                            color: '#475569',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 700,
                                                            fontSize: '0.875rem',
                                                            border: '1px solid #E2E8F0',
                                                        }}
                                                    >
                                                        {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#0F172A' }}>
                                                            {c.name}
                                                        </div>
                                                        <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                                                            ID #{c.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email & Status */}
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <div style={{ color: '#334155', fontWeight: 500 }}>
                                                    {c.email}
                                                </div>
                                                <div style={{ marginTop: '0.2rem' }}>
                                                    {c.is_verified ? (
                                                        <span style={{ fontSize: '0.7rem', color: '#059669', background: '#ECFDF5', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontWeight: 600 }}>
                                                            ✓ Verified Email
                                                        </span>
                                                    ) : (
                                                        <span style={{ fontSize: '0.7rem', color: '#64748B', background: '#F1F5F9', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>
                                                            Registered User
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Orders Placed */}
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                {c.orders_count > 0 ? (
                                                    <Link
                                                        href={route('admin.orders.index', { search: c.email })}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            background: '#EFF6FF',
                                                            color: '#1D4ED8',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 700,
                                                            padding: '0.25rem 0.6rem',
                                                            borderRadius: '0.25rem',
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        <span>{c.orders_count} orders</span>
                                                        <span>→</span>
                                                    </Link>
                                                ) : (
                                                    <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                                                        0 orders
                                                    </span>
                                                )}
                                            </td>

                                            {/* Total Spend */}
                                            <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                                                ₹{c.orders_sum_total_amount.toLocaleString('en-IN')}
                                            </td>

                                            {/* Registered On */}
                                            <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem' }}>
                                                <div style={{ color: '#1E293B', fontWeight: 500 }}>{c.created_at}</div>
                                                <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{c.created_at_human}</div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {customers.links && customers.links.length > 3 && (
                        <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                Showing {customers.from || 0} to {customers.to || 0} of {customers.total} registered customers
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {customers.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: '0.25rem',
                                            border: '1px solid',
                                            borderColor: link.active ? '#7A1C1C' : '#E2E8F0',
                                            background: link.active ? '#7A1C1C' : '#FFFFFF',
                                            color: link.active ? '#FFFFFF' : link.url ? '#334155' : '#CBD5E1',
                                            fontSize: '0.8rem',
                                            cursor: link.url ? 'pointer' : 'default',
                                            fontWeight: link.active ? 700 : 500,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
