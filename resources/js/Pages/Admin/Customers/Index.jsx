import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CustomersIndex({ customers, stats, filters }) {
    const { flash } = usePage().props || {};

    const [search, setSearch] = useState(filters.search || '');
    const [dateFilter, setDateFilter] = useState(filters.date || 'all');
    const [ordersFilter, setOrdersFilter] = useState(filters.orders || 'all');

    const handleApplyFilters = (newOverrides = {}) => {
        router.get(
            route('admin.customers.index'),
            {
                search,
                date: dateFilter,
                orders: ordersFilter,
                ...newOverrides,
            },
            {
                preserveState: true,
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
        router.get(route('admin.customers.index'), {}, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Registered Customers - Dayal Sweets Admin" />

            <div className="dayal-admin-content-container" style={{ padding: '1.5rem 2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            Registered Customers
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            All storefront users registered on Dayal Sweets. Ordered by newest registrations first.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Link
                            href={route('admin.users.index')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem 1rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            </svg>
                            <span>Go to Staff Management →</span>
                        </Link>
                    </div>
                </div>

                {/* Metric Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Total Registered Customers
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                            {stats.total_customers}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.2rem', fontWeight: 600 }}>
                            Active storefront shoppers
                        </div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            New This Week
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginTop: '0.35rem' }}>
                            {stats.new_this_week}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                            Registered in last 7 days
                        </div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Customers With Orders
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>
                            {stats.with_orders}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                            Placed 1 or more orders
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ flex: '1 1 240px' }}>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by customer name, email, or ID..."
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.875rem',
                                    background: '#F8FAFC',
                                }}
                            />
                        </div>

                        {/* Date Filter */}
                        <div style={{ minWidth: '150px' }}>
                            <select
                                value={dateFilter}
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                    handleApplyFilters({ date: e.target.value });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.875rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Registered Today</option>
                                <option value="this_week">This Week</option>
                                <option value="this_month">This Month</option>
                            </select>
                        </div>

                        {/* Orders Filter */}
                        <div style={{ minWidth: '160px' }}>
                            <select
                                value={ordersFilter}
                                onChange={(e) => {
                                    setOrdersFilter(e.target.value);
                                    handleApplyFilters({ orders: e.target.value });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.875rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Order Statuses</option>
                                <option value="with_orders">Has Placed Orders</option>
                                <option value="no_orders">No Orders Yet</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '0.55rem 1rem',
                                background: '#B88E4B',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Filter
                        </button>

                        {(search || dateFilter !== 'all' || ordersFilter !== 'all') && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                style={{
                                    padding: '0.55rem 0.85rem',
                                    background: 'transparent',
                                    color: '#64748B',
                                    border: '1px solid #CBD5E1',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Reset
                            </button>
                        )}
                    </form>
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
                                            borderColor: link.active ? '#B88E4B' : '#E2E8F0',
                                            background: link.active ? '#B88E4B' : '#FFFFFF',
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
