import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminSecondaryBtnStyle, adminTableActionStyles } from '@/Components/Admin/AdminDataTable';

const formatCurrency = (val) =>
    `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function SalesAnalyticsIndex({
    summary = {},
    dailySeries = [],
    outletBreakdown = [],
    paymentBreakdown = [],
    topProducts = [],
    orders,
    outlets = [],
    filters = {},
}) {
    const [channel, setChannel] = useState(filters.channel || 'all');
    const [range, setRange] = useState(filters.range || '30d');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [outletId, setOutletId] = useState(filters.outlet_id || 'all');
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);

    const applyFilters = (overrides = {}) => {
        const nextChannel = overrides.channel !== undefined ? overrides.channel : channel;
        const nextRange = overrides.range !== undefined ? overrides.range : range;
        const nextStart = overrides.start_date !== undefined ? overrides.start_date : startDate;
        const nextEnd = overrides.end_date !== undefined ? overrides.end_date : endDate;
        const nextOutlet = overrides.outlet_id !== undefined ? overrides.outlet_id : outletId;
        const nextSearch = overrides.search !== undefined ? overrides.search : search;
        const nextPerPage = overrides.per_page !== undefined ? overrides.per_page : perPage;

        const params = {};
        if (nextChannel && nextChannel !== 'all') params.channel = nextChannel;
        if (nextRange && nextRange !== '30d') params.range = nextRange;
        if (nextRange === 'custom' && nextStart && nextEnd) {
            params.start_date = nextStart;
            params.end_date = nextEnd;
        }
        if (nextOutlet && nextOutlet !== 'all') params.outlet_id = nextOutlet;
        if (nextSearch && nextSearch.trim()) params.search = nextSearch.trim();
        if (nextPerPage && Number(nextPerPage) !== 10) params.per_page = Number(nextPerPage);

        router.get(route('admin.analytics.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setChannel('all');
        setRange('30d');
        setStartDate('');
        setEndDate('');
        setOutletId('all');
        setSearch('');
        setPerPage(10);
        router.get(route('admin.analytics.index'), {}, { preserveState: true, replace: true });
    };

    const maxDailyRevenue = useMemo(() => {
        const vals = dailySeries.map((d) => Number(d.total_revenue) || 0);
        return Math.max(1, ...vals);
    }, [dailySeries]);

    const totalChannelRevenue = (Number(summary.website_revenue) || 0) + (Number(summary.dine_in_revenue) || 0);
    const websiteShare = totalChannelRevenue > 0
        ? Math.round(((Number(summary.website_revenue) || 0) / totalChannelRevenue) * 100)
        : 0;
    const dineInShare = totalChannelRevenue > 0 ? 100 - websiteShare : 0;

    const orderRows = orders?.data || [];

    return (
        <AdminLayout header="Sales Analytics">
            <Head title="Sales Analytics - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
                {/* 1. Header Row */}
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
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Sales Analytics</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Sales Analytics
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem', marginBottom: 0 }}>
                            Complete revenue, orders, and product performance across Website Online Orders and Dine-In Table QR Orders.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link href={route('admin.orders.index')} style={adminSecondaryBtnStyle}>
                            View All Orders →
                        </Link>
                    </div>
                </div>

                {/* 2. Channel & Date Range Filter Bar */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        marginBottom: '1.25rem',
                    }}
                >
                    {/* Channel Filter Buttons (Website vs Dine-In vs All) */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {[
                            { key: 'all', label: 'All Sales (Website + Dine-In)' },
                            { key: 'website', label: 'Website Sales' },
                            { key: 'dine_in', label: 'Dine-In Sales' },
                        ].map((tab) => {
                            const isActive = channel === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => {
                                        setChannel(tab.key);
                                        applyFilters({ channel: tab.key });
                                    }}
                                    style={{
                                        padding: '0.45rem 0.9rem',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.8125rem',
                                        fontWeight: isActive ? 700 : 500,
                                        border: isActive ? '1px solid #7A1C1C' : '1px solid #CBD5E1',
                                        background: isActive ? '#7A1C1C' : '#FFFFFF',
                                        color: isActive ? '#FFFFFF' : '#475569',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Date Range Buttons + Outlet Selector */}
                    <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {[
                            { key: '7d', label: '7 Days' },
                            { key: '30d', label: '30 Days' },
                            { key: '90d', label: '90 Days' },
                            { key: 'all', label: 'All Time' },
                            { key: 'custom', label: 'Custom' },
                        ].map((r) => {
                            const isActive = range === r.key;
                            return (
                                <button
                                    key={r.key}
                                    type="button"
                                    onClick={() => {
                                        setRange(r.key);
                                        if (r.key !== 'custom') {
                                            applyFilters({ range: r.key });
                                        }
                                    }}
                                    style={{
                                        padding: '0.4rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.78rem',
                                        fontWeight: isActive ? 700 : 500,
                                        border: isActive ? '1px solid #7A1C1C' : '1px solid #CBD5E1',
                                        background: isActive ? '#7A1C1C' : '#FFFFFF',
                                        color: isActive ? '#FFFFFF' : '#475569',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {r.label}
                                </button>
                            );
                        })}

                        <select
                            value={outletId}
                            onChange={(e) => {
                                setOutletId(e.target.value);
                                applyFilters({ outlet_id: e.target.value });
                            }}
                            style={{
                                padding: '0.42rem 0.75rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.8rem',
                                background: '#FFFFFF',
                                color: '#0F172A',
                            }}
                        >
                            <option value="all">All Outlets</option>
                            {outlets.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Custom Date Range Picker Row */}
                {range === 'custom' && (
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.5rem',
                            padding: '0.75rem 1rem',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Custom Range:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{ padding: '0.4rem 0.65rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                        />
                        <span style={{ color: '#64748B', fontSize: '0.8rem' }}>to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{ padding: '0.4rem 0.65rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                        />
                        <button
                            type="button"
                            onClick={() => applyFilters({ range: 'custom', start_date: startDate, end_date: endDate })}
                            style={{ ...adminTableActionStyles.primary, padding: '0.45rem 0.9rem' }}
                        >
                            Apply Dates
                        </button>
                    </div>
                )}

                {/* 3. KPI Summary Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Total Sales Revenue
                        </div>
                        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                            {formatCurrency(summary.total_revenue)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>
                            Paid: {formatCurrency(summary.paid_revenue)} • {summary.total_orders ?? 0} orders
                        </div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7A1C1C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Website Online Sales
                        </div>
                        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#7A1C1C', marginTop: '0.35rem' }}>
                            {formatCurrency(summary.website_revenue)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                            {summary.website_orders ?? 0} orders ({websiteShare}% of total)
                        </div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Dine-In Table Sales
                        </div>
                        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2563EB', marginTop: '0.35rem' }}>
                            {formatCurrency(summary.dine_in_revenue)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                            {summary.dine_in_orders ?? 0} orders ({dineInShare}% of total)
                        </div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Avg Order Value
                        </div>
                        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>
                            {formatCurrency(summary.avg_order_value)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                            Pending: {summary.pending_orders ?? 0} • Cancelled: {summary.cancelled_orders ?? 0}
                        </div>
                    </div>
                </div>

                {/* 4. Daily Revenue Chart (Website vs Dine-In) */}
                <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                                Daily Sales Trend (Website vs Dine-In)
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                Stacked daily revenue across selected date window
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', fontWeight: 600 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#7A1C1C' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#7A1C1C' }} />
                                Website
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#2563EB' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#2563EB' }} />
                                Dine-In
                            </span>
                        </div>
                    </div>

                    {dailySeries.length === 0 ? (
                        <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>
                            No sales recorded in this date range yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '180px', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {dailySeries.map((day) => {
                                const webPct = Math.round(((Number(day.website_revenue) || 0) / maxDailyRevenue) * 100);
                                const dinePct = Math.round(((Number(day.dine_in_revenue) || 0) / maxDailyRevenue) * 100);
                                return (
                                    <div
                                        key={day.date}
                                        title={`${day.label}: Total ${formatCurrency(day.total_revenue)} | Website ${formatCurrency(day.website_revenue)} (${day.website_orders}) | Dine-In ${formatCurrency(day.dine_in_revenue)} (${day.dine_in_orders})`}
                                        style={{
                                            flex: '1 0 32px',
                                            maxWidth: '48px',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                        }}
                                    >
                                        <div style={{ width: '100%', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: '#F8FAFC', borderRadius: '0.25rem', overflow: 'hidden' }}>
                                            {dinePct > 0 && (
                                                <div style={{ height: `${Math.max(4, dinePct)}%`, background: '#2563EB', width: '100%' }} />
                                            )}
                                            {webPct > 0 && (
                                                <div style={{ height: `${Math.max(4, webPct)}%`, background: '#7A1C1C', width: '100%' }} />
                                            )}
                                        </div>
                                        <span style={{ fontSize: '0.68rem', color: '#64748B', whiteSpace: 'nowrap' }}>{day.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 5. Outlet Breakdown, Top Products & Payment Methods */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    {/* Outlet Breakdown */}
                    <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Outlet-Wise Sales</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '0.65rem 1rem', textAlign: 'left' }}>Outlet</th>
                                        <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Website</th>
                                        <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Dine-In</th>
                                        <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {outletBreakdown.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                                                No outlet sales data yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        outletBreakdown.map((o, idx) => (
                                            <tr key={o.outlet_id ?? `unassigned-${idx}`} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                                                    {o.outlet_name}
                                                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 400 }}>{o.orders_count} orders</div>
                                                </td>
                                                <td style={{ padding: '0.7rem 0.75rem', textAlign: 'right', color: '#7A1C1C', fontWeight: 600 }}>
                                                    {formatCurrency(o.website_revenue)}
                                                </td>
                                                <td style={{ padding: '0.7rem 0.75rem', textAlign: 'right', color: '#2563EB', fontWeight: 600 }}>
                                                    {formatCurrency(o.dine_in_revenue)}
                                                </td>
                                                <td style={{ padding: '0.7rem 1rem', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                                                    {formatCurrency(o.total_revenue)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Top Selling Products</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '0.65rem 1rem', textAlign: 'left' }}>Product</th>
                                        <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Units</th>
                                        <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                                                No product sales recorded yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        topProducts.map((p, idx) => (
                                            <tr key={`${p.product_name}-${idx}`} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: '#0F172A' }}>{p.product_name}</td>
                                                <td style={{ padding: '0.7rem 0.75rem', textAlign: 'center', color: '#334155' }}>{p.units_sold}</td>
                                                <td style={{ padding: '0.7rem 1rem', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                                                    {formatCurrency(p.total_revenue)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Payment Methods</h3>
                        </div>
                        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {paymentBreakdown.length === 0 ? (
                                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                                    No payment data yet.
                                </div>
                            ) : (
                                paymentBreakdown.map((pm) => (
                                    <div key={pm.method} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '0.375rem', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>{pm.method}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{pm.orders_count} orders</div>
                                        </div>
                                        <div style={{ fontWeight: 800, color: '#7A1C1C', fontSize: '0.95rem' }}>
                                            {formatCurrency(pm.total_revenue)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* 6. Search & Per-Page Toolbar for Sales Ledger */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        padding: '0.9rem 1.25rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilters({ search });
                        }}
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: '1 1 320px', maxWidth: '480px' }}
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search order #, customer, phone, or table..."
                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem' }}
                        />
                        <button type="submit" style={{ ...adminTableActionStyles.primary, padding: '0.5rem 0.85rem' }}>
                            Search
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    applyFilters({ search: '' });
                                }}
                                style={adminTableActionStyles.secondary}
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Per Page:</span>
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    const next = Number(e.target.value);
                                    setPerPage(next);
                                    applyFilters({ per_page: next });
                                }}
                                style={{ padding: '0.45rem 0.65rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                            >
                                {[10, 15, 25, 50, 100].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>

                        {(channel !== 'all' || range !== '30d' || outletId !== 'all' || search) && (
                            <button type="button" onClick={handleReset} style={adminTableActionStyles.secondary}>
                                Reset All
                            </button>
                        )}
                    </div>
                </div>

                {/* 7. Sales Ledger Table (10 per page default) */}
                <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    <th style={{ padding: '0.85rem 1.15rem' }}>Order #</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Channel</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Customer / Table</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Outlet</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Payment</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Total</th>
                                    <th style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderRows.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
                                            No sales orders found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    orderRows.map((o) => {
                                        const isDineIn = o.order_type === 'dine_in';
                                        return (
                                            <tr key={o.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 700, color: '#0F172A' }}>
                                                    {o.order_number}
                                                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 400 }}>
                                                        {o.created_at ? new Date(o.created_at).toLocaleString() : '—'}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.85rem 1rem' }}>
                                                    <span
                                                        style={{
                                                            display: 'inline-flex',
                                                            padding: '0.2rem 0.6rem',
                                                            borderRadius: '999px',
                                                            fontSize: '0.74rem',
                                                            fontWeight: 700,
                                                            background: isDineIn ? '#EFF6FF' : '#FDF2F2',
                                                            color: isDineIn ? '#1D4ED8' : '#7A1C1C',
                                                            border: isDineIn ? '1px solid #BFDBFE' : '1px solid #FECACA',
                                                        }}
                                                    >
                                                        {isDineIn ? 'Dine-In' : 'Website'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.85rem 1rem' }}>
                                                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{o.customer_name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                        {isDineIn && o.table_number ? `Table ${o.table_number} • ` : ''}
                                                        {o.customer_phone}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.85rem 1rem', color: '#334155', fontSize: '0.8125rem' }}>
                                                    {o.outlet?.name || 'General'}
                                                </td>
                                                <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>
                                                    <span style={{ fontWeight: 600, color: '#0F172A', textTransform: 'uppercase' }}>{o.payment_method || 'COD'}</span>
                                                    <div style={{ fontSize: '0.72rem', color: o.payment_status === 'paid' ? '#059669' : '#D97706', fontWeight: 600 }}>
                                                        {o.payment_status}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                                                    {o.delivery_status}
                                                </td>
                                                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>
                                                    {formatCurrency(o.total_amount)}
                                                </td>
                                                <td style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>
                                                    <Link href={route('admin.orders.show', o.id)} style={adminTableActionStyles.primary}>
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div style={{ padding: '0.9rem 1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                            Showing <strong style={{ color: '#0F172A' }}>{orders?.from ?? 0}</strong> to{' '}
                            <strong style={{ color: '#0F172A' }}>{orders?.to ?? 0}</strong> of{' '}
                            <strong style={{ color: '#0F172A' }}>{orders?.total ?? 0}</strong> orders
                        </div>
                        {orders?.links && orders.links.length > 3 && (
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                {orders.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{
                                            padding: '0.38rem 0.7rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid',
                                            borderColor: link.active ? '#7A1C1C' : '#E2E8F0',
                                            background: link.active ? '#7A1C1C' : '#FFFFFF',
                                            color: link.active ? '#FFFFFF' : link.url ? '#334155' : '#CBD5E1',
                                            fontSize: '0.8rem',
                                            cursor: link.url && !link.active ? 'pointer' : 'default',
                                            fontWeight: link.active ? 700 : 500,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
