import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { AlertIcon } from '@/Components/Icons';

export default function Index({ taxRates = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState('all');
    const [classFilter, setClassFilter] = useState('all');
    const [showCards, setShowCards] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [rateToDelete, setRateToDelete] = useState(null);

    // Filter rates
    const filteredRates = useMemo(() => {
        return taxRates.filter((r) => {
            if (statusFilter === 'active' && !r.is_active) return false;
            if (statusFilter === 'inactive' && r.is_active) return false;
            if (classFilter !== 'all' && r.tax_class !== classFilter) return false;

            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return (
                r.name?.toLowerCase().includes(q) ||
                r.code?.toLowerCase().includes(q) ||
                r.tax_class?.toLowerCase().includes(q) ||
                r.description?.toLowerCase().includes(q)
            );
        });
    }, [taxRates, statusFilter, classFilter, search]);

    const totalPages = Math.ceil(filteredRates.length / itemsPerPage) || 1;
    const paginatedRates = useMemo(() => {
        const safePage = Math.min(currentPage, totalPages);
        const start = (safePage - 1) * itemsPerPage;
        return filteredRates.slice(start, start + itemsPerPage);
    }, [filteredRates, currentPage, itemsPerPage, totalPages]);

    const activeCount = taxRates.filter((r) => r.is_active).length;
    const totalProductsWithTax = taxRates.reduce((sum, r) => sum + (Number(r.products_count) || 0), 0);

    const handleDeleteClick = (rate) => {
        setRateToDelete(rate);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!rateToDelete) return;
        router.delete(route('admin.taxes.destroy', rateToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setRateToDelete(null);
            },
        });
    };

    const toggleRateActive = (rateId) => {
        router.patch(route('admin.taxes.toggle', rateId), {}, {
            preserveScroll: true,
        });
    };

    const handleTabFilter = (tabStatus, tabClass = 'all') => {
        setStatusFilter(tabStatus);
        setClassFilter(tabClass);
        setCurrentPage(1);
    };

    const getActiveTabKey = () => {
        if (classFilter === 'standard') return 'standard';
        if (classFilter === 'zero_rate') return 'zero';
        if (statusFilter === 'active') return 'active';
        if (statusFilter === 'inactive') return 'inactive';
        return 'all';
    };
    const activeTab = getActiveTabKey();

    return (
        <AdminLayout header="Taxes & GST Rates">
            <Head title="Taxes & GST Rates - Dayal Sweets Admin" />

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
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Taxes &amp; GST Rates</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Taxes &amp; GST Rates
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                            Configure Indian Goods &amp; Services Tax (GST) rates (5%, 12%, 18%, 0%) to calculate final sweet prices and invoice totals.
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
                            href={route('admin.taxes.create')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 1rem',
                                borderRadius: '0.5rem',
                                background: '#7A1C1C',
                                color: '#FFFFFF',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                        >
                            <span>+ Add New Tax Rate</span>
                        </Link>
                    </div>
                </div>

                {/* Top Metric Cards - Collapsed by default, counts only, NO clicks */}
                {showCards && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {/* 1. Total Tax Rates */}
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
                                Total Tax Rates
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                                {taxRates.length}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Registered GST tiers
                            </div>
                        </div>

                        {/* 2. Active Rates */}
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
                                Active Rates
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>
                                {activeCount}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>
                                Applied to product catalog
                            </div>
                        </div>

                        {/* 3. Assigned Products */}
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
                                Assigned Products
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2563EB', marginTop: '0.35rem' }}>
                                {totalProductsWithTax}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Items with calculated GST
                            </div>
                        </div>

                        {/* 4. Standard Mithai Rate */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6226', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Standard Mithai Rate
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#8C6226', marginTop: '0.35rem' }}>
                                5% GST
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Desi Ghee Sweets &amp; Mithai
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Filter Buttons without count - Clicks happen here */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {[
                        { key: 'all', label: 'All Rates', status: 'all', cls: 'all' },
                        { key: 'active', label: 'Active Rates', status: 'active', cls: 'all' },
                        { key: 'inactive', label: 'Disabled Rates', status: 'inactive', cls: 'all' },
                        { key: 'standard', label: 'Standard Class', status: 'all', cls: 'standard' },
                        { key: 'zero', label: 'Zero Rate GST', status: 'all', cls: 'zero_rate' },
                    ].map((tab) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleTabFilter(tab.status, tab.cls)}
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
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: '1 1 320px', maxWidth: '440px' }}>
                        <input
                            type="text"
                            placeholder="Search by name, code, class or description..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
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
                            type="button"
                            style={{
                                padding: '0.5rem 0.85rem',
                                borderRadius: '0.375rem',
                                background: '#7A1C1C',
                                color: '#FFFFFF',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'default',
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
                                    setCurrentPage(1);
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
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Status Filter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Disabled Only</option>
                            </select>
                        </div>

                        {/* Class Filter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Class:</span>
                            <select
                                value={classFilter}
                                onChange={(e) => {
                                    setClassFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Classes</option>
                                <option value="standard">Standard</option>
                                <option value="zero_rate">Zero Rate</option>
                            </select>
                        </div>

                        {/* Per page Filter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Per page:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(parseInt(e.target.value, 10));
                                    setCurrentPage(1);
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

                        {(search || statusFilter !== 'all' || classFilter !== 'all') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setStatusFilter('all');
                                    setClassFilter('all');
                                    setCurrentPage(1);
                                }}
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

                {/* Table Card */}
                <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    <th style={{ padding: '0.85rem 1.25rem', width: '28%' }}>Tax Name &amp; Description</th>
                                    <th style={{ padding: '0.85rem 1rem', width: '15%' }}>Code</th>
                                    <th style={{ padding: '0.85rem 1rem', width: '14%' }}>Rate</th>
                                    <th style={{ padding: '0.85rem 1rem', width: '15%' }}>Class</th>
                                    <th style={{ padding: '0.85rem 1rem', width: '10%', textAlign: 'center' }}>Products</th>
                                    <th style={{ padding: '0.85rem 1rem', width: '10%', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '0.85rem 1.25rem', width: '8%', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRates.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                                            <div style={{ fontWeight: 600, color: '#475569' }}>No Tax Rates Found</div>
                                            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Configure GST rates to apply taxes to sweet products.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedRates.map((rate) => (
                                        <tr key={rate.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                                            <td style={{ padding: '0.85rem 1.25rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                    <Link
                                                        href={route('admin.taxes.edit', rate.id)}
                                                        style={{ fontWeight: 700, color: '#0F172A', textDecoration: 'none', fontSize: '0.875rem' }}
                                                    >
                                                        {rate.name}
                                                    </Link>
                                                    {rate.description && (
                                                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                            {rate.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A', background: '#F1F5F9', padding: '0.2rem 0.45rem', borderRadius: '0.25rem' }}>
                                                    {rate.code}
                                                </span>
                                            </td>

                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#7A1C1C' }}>
                                                    {Number(rate.rate).toFixed(rate.rate % 1 === 0 ? 0 : 2)}%
                                                </span>
                                                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>
                                                    {rate.type === 'fixed' ? 'Fixed Fee' : 'Percentage'}
                                                </span>
                                            </td>

                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <span style={{ fontSize: '0.75rem', textTransform: 'capitalize', color: '#334155', fontWeight: 600 }}>
                                                    {rate.tax_class.replace('_', ' ')}
                                                </span>
                                                {rate.apply_to_shipping && (
                                                    <span style={{ fontSize: '0.65rem', color: '#2563EB', display: 'block' }}>
                                                        + Shipping freight
                                                    </span>
                                                )}
                                            </td>

                                            <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A', background: '#F8FAFC', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid #E2E8F0' }}>
                                                    {rate.products_count ?? 0}
                                                </span>
                                            </td>

                                            <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleRateActive(rate.id)}
                                                    style={{
                                                        padding: '0.25rem 0.65rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        background: rate.is_active ? '#ECFDF5' : '#F1F5F9',
                                                        color: rate.is_active ? '#059669' : '#64748B',
                                                        border: rate.is_active ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                                                    }}
                                                >
                                                    {rate.is_active ? 'Active' : 'Disabled'}
                                                </button>
                                            </td>

                                            <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <Link
                                                        href={route('admin.taxes.edit', rate.id)}
                                                        style={{
                                                            padding: '0.35rem 0.55rem',
                                                            borderRadius: '0.375rem',
                                                            border: '1px solid #CBD5E1',
                                                            background: '#FFFFFF',
                                                            color: '#334155',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            textDecoration: 'none',
                                                        }}
                                                        title="Edit Rate"
                                                    >
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(rate)}
                                                        style={{
                                                            padding: '0.35rem 0.55rem',
                                                            borderRadius: '0.375rem',
                                                            border: '1px solid #FECACA',
                                                            background: '#FEF2F2',
                                                            color: '#DC2626',
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                        }}
                                                        title="Delete Rate"
                                                    >
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                Showing page {currentPage} of {totalPages} ({filteredRates.length} total tax rates)
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setCurrentPage(p)}
                                        style={{
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: '0.25rem',
                                            border: '1px solid',
                                            borderColor: currentPage === p ? '#7A1C1C' : '#E2E8F0',
                                            background: currentPage === p ? '#7A1C1C' : '#FFFFFF',
                                            color: currentPage === p ? '#FFFFFF' : '#334155',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            fontWeight: currentPage === p ? 700 : 500,
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertIcon width="22" height="22" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Delete Tax Rate?</h3>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Permanent Catalog Action</span>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        Are you sure you want to delete <strong>&ldquo;{rateToDelete?.name}&rdquo;</strong>? Products currently using this tax rate will be unassigned and marked tax-exempt until updated.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(false)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#475569',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                background: '#DC2626',
                                color: '#FFFFFF',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Delete Tax Rate
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
