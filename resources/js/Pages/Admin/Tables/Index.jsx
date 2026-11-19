import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import QrCodeSvg from '@/Components/QrCodeSvg';
import Pagination from '@/Components/Pagination';

export default function Index({
    tables,
    outlets = [],
    locations = [],
    stats = {},
    filters = {},
}) {
    // Supports both LengthAwarePaginator and array
    const tableList = Array.isArray(tables) ? tables : (tables?.data || []);
    const isPaginator = !Array.isArray(tables) && tables?.total !== undefined;

    const totalItems = isPaginator ? tables.total : tableList.length;
    const currentPage = isPaginator ? tables.current_page : Number(filters.page || 1);
    const totalPages = isPaginator ? tables.last_page : (Math.ceil(totalItems / (Number(filters.per_page) || 8)) || 1);
    const itemsPerPage = isPaginator ? tables.per_page : Number(filters.per_page || 8);

    const [search, setSearch] = useState(filters.search || '');
    const [outletFilter, setOutletFilter] = useState(String(filters.outlet_id || 'all'));
    const [locationFilter, setLocationFilter] = useState(filters.location || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [showCards, setShowCards] = useState(false);

    // Sync local filter state when server props change (e.g. from sidebar or header outlet switcher)
    useEffect(() => {
        setOutletFilter(String(filters.outlet_id || 'all'));
    }, [filters.outlet_id]);

    useEffect(() => {
        setLocationFilter(filters.location || 'all');
    }, [filters.location]);

    useEffect(() => {
        setStatusFilter(filters.status || 'all');
    }, [filters.status]);

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    // QR Scanner Preview Modal
    const [activeQrTable, setActiveQrTable] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    // Quick Add Table Modal
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const [customLocation, setCustomLocation] = useState('');
    const [form, setForm] = useState({
        outlet_id: filters.outlet_id && filters.outlet_id !== 'all' ? filters.outlet_id : (outlets[0]?.id || ''),
        table_number: '',
        name: '',
        capacity: 4,
        location: locations[0] || 'Main Dining Hall',
        status: 'available',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const applyFilters = (overrides = {}) => {
        const params = {
            outlet_id: outletFilter,
            location: locationFilter,
            status: statusFilter,
            search: search || undefined,
            per_page: itemsPerPage,
            page: currentPage,
            ...overrides,
        };

        if (params.outlet_id === 'all') delete params.outlet_id;
        if (params.location === 'all') delete params.location;
        if (params.status === 'all') delete params.status;
        if (!params.search) delete params.search;
        if (Number(params.per_page) === 8) delete params.per_page;
        if (Number(params.page) <= 1) delete params.page;

        router.get(route('admin.tables.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search, page: 1 });
    };

    const handleStatusChange = (table, newStatus) => {
        router.patch(
            route('admin.tables.update-status', table.id),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const handleRegenerateQr = (table) => {
        if (!window.confirm(`Generate a new QR scanner link for ${table.name}? Old printed QR codes for this table will stop working.`)) {
            return;
        }
        router.post(route('admin.tables.regenerate-qr', table.id), {}, {
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page?.props?.tables?.find((t) => t.id === table.id);
                if (updated) setActiveQrTable(updated);
            },
        });
    };

    const handleDelete = (table) => {
        if (!window.confirm(`Delete "${table.name}" from ${table.outlet?.name || 'Outlet'}?`)) {
            return;
        }
        router.delete(route('admin.tables.destroy', table.id), {
            preserveScroll: true,
        });
    };

    const handleCopyLink = (table) => {
        const url = `${window.location.origin}/scan/${table.qr_token}`;
        navigator.clipboard?.writeText(url);
        setCopiedId(table.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleQuickCreateSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        const finalLocation = form.location === '__custom__' ? customLocation : form.location;

        router.post(
            route('admin.tables.store'),
            {
                ...form,
                location: finalLocation || 'Main Dining Hall',
                return_back: true,
            },
            {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
                onSuccess: () => {
                    setQuickAddOpen(false);
                    setForm((prev) => ({
                        ...prev,
                        table_number: '',
                        name: '',
                        notes: '',
                    }));
                },
            }
        );
    };

    const statusBadgeStyle = (status) => {
        switch (status) {
            case 'available':
                return { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0', label: 'Available' };
            case 'occupied':
                return { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA', label: 'Occupied' };
            case 'reserved':
                return { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A', label: 'Reserved' };
            default:
                return { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1', label: 'Inactive' };
        }
    };

    return (
        <AdminLayout>
            <Head title="Dining Tables & QR Scanners - Admin" />

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
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Dining Tables</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Outlet Dining Tables &amp; QR Scanners
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                            Manage seating capacity, floor locations, and table QR code scanners across all outlets.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
                            href={route('admin.tables.scanners', { outlet_id: outletFilter !== 'all' ? outletFilter : undefined })}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 0.9rem',
                                borderRadius: '0.5rem',
                                background: '#FDF8F0',
                                color: '#8C6226',
                                border: '1px solid #E6D2B5',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            <span>Print All QR Scanners</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setQuickAddOpen(true)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 0.9rem',
                                borderRadius: '0.5rem',
                                background: '#7A1C1C',
                                color: '#FFFFFF',
                                border: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            + Quick Add Table
                        </button>

                        <Link
                            href={route('admin.tables.create')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 0.9rem',
                                borderRadius: '0.5rem',
                                background: '#B88E4B',
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                            }}
                        >
                            + Full Create Page
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
                        {/* 1. Total Tables */}
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
                                Total Tables
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                                {stats.total_tables || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem', fontWeight: 600 }}>
                                Active QR ordering tables
                            </div>
                        </div>

                        {/* 2. Total Seating Capacity */}
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
                                Total Seating Capacity
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#8C6226', marginTop: '0.35rem' }}>
                                {stats.total_capacity || 0} Guests
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                People who can sit simultaneously
                            </div>
                        </div>

                        {/* 3. Available Now */}
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
                                Available Now
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>
                                {stats.available || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>
                                Ready to seat guests
                            </div>
                        </div>

                        {/* 4. Occupied / Dining */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Occupied / Dining
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#DC2626', marginTop: '0.35rem' }}>
                                {(stats.occupied || 0) + (stats.reserved || 0)}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                {stats.occupied || 0} occupied • {stats.reserved || 0} reserved
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Filter Buttons without count - Clicks happen here */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {[
                        { key: 'all', label: 'All Tables' },
                        { key: 'available', label: 'Available' },
                        { key: 'occupied', label: 'Occupied' },
                        { key: 'reserved', label: 'Reserved' },
                        { key: 'inactive', label: 'Inactive' },
                    ].map((tab) => {
                        const isActive = statusFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(tab.key);
                                    applyFilters({ status: tab.key, page: 1 });
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
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: '1 1 320px', maxWidth: '420px' }}>
                        <input
                            type="text"
                            placeholder="Search table #, name, location..."
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
                                    applyFilters({ search: '', page: 1 });
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
                            <span>Outlet:</span>
                            <select
                                value={outletFilter}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setOutletFilter(val);
                                    applyFilters({ outlet_id: val, page: 1 });
                                }}
                                style={{ padding: '0.45rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                            >
                                <option value="all">All Outlets</option>
                                {outlets.map((o) => (
                                    <option key={o.id} value={String(o.id)}>
                                        {o.name} ({o.city})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Location:</span>
                            <select
                                value={locationFilter}
                                onChange={(e) => {
                                    setLocationFilter(e.target.value);
                                    applyFilters({ location: e.target.value, page: 1 });
                                }}
                                style={{ padding: '0.45rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                            >
                                <option value="all">All Locations</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    applyFilters({ status: e.target.value, page: 1 });
                                }}
                                style={{ padding: '0.45rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="reserved">Reserved</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Per page:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    applyFilters({ per_page: val, page: 1 });
                                }}
                                style={{ padding: '0.45rem 0.6rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                            >
                                <option value={8}>8</option>
                                <option value={10}>10</option>
                                <option value={12}>12</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tables Data Grid */}
            <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                {tableList.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>No Dining Tables Found</h3>
                        <p style={{ fontSize: '0.88rem', marginBottom: '1rem' }}>Create dining tables with seating capacities and locations to generate QR code scanners for direct table ordering.</p>
                        <button
                            type="button"
                            onClick={() => setQuickAddOpen(true)}
                            style={{ padding: '0.6rem 1.2rem', borderRadius: '0.5rem', background: '#5A1E1E', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                        >
                            + Create First Table
                        </button>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    <th style={{ padding: '0.85rem 1rem' }}>Table # &amp; Name</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Outlet</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Location / Zone</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Seating Capacity</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>QR Scanner</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Orders</th>
                                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableList.map((table) => {
                                    const badge = statusBadgeStyle(table.status);
                                    const scanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${table.qr_token}`;

                                    return (
                                        <tr key={table.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '0.9rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', height: '36px', padding: '0 0.5rem', borderRadius: '0.5rem', background: '#FDF8F0', border: '1px solid #E6D2B5', color: '#5A1E1E', fontWeight: 800, fontSize: '0.85rem' }}>
                                                        {table.table_number}
                                                    </span>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{table.name}</div>
                                                        {table.notes && (
                                                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{table.notes}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={{ padding: '0.9rem 1rem' }}>
                                                <Link
                                                    href={route('admin.outlets.show', table.outlet_id)}
                                                    style={{ fontWeight: 700, color: '#5A1E1E', textDecoration: 'none' }}
                                                >
                                                    {table.outlet?.name || `Outlet #${table.outlet_id}`}
                                                </Link>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{table.outlet?.city}</div>
                                            </td>

                                            <td style={{ padding: '0.9rem 1rem' }}>
                                                <span style={{ display: 'inline-block', padding: '0.25rem 0.65rem', borderRadius: '999px', background: '#F1F5F9', color: '#334155', fontWeight: 600, fontSize: '0.78rem' }}>
                                                    {table.location}
                                                </span>
                                            </td>

                                            <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                                                👥 {table.capacity} {table.capacity === 1 ? 'Person' : 'People'}
                                            </td>

                                            <td style={{ padding: '0.9rem 1rem' }}>
                                                <select
                                                    value={table.status}
                                                    onChange={(e) => handleStatusChange(table, e.target.value)}
                                                    style={{
                                                        padding: '0.28rem 0.6rem',
                                                        borderRadius: '0.4rem',
                                                        background: badge.bg,
                                                        color: badge.color,
                                                        border: `1px solid ${badge.border}`,
                                                        fontWeight: 700,
                                                        fontSize: '0.78rem',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <option value="available">Available</option>
                                                    <option value="occupied">Occupied</option>
                                                    <option value="reserved">Reserved</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </td>

                                            <td style={{ padding: '0.9rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveQrTable(table)}
                                                        style={{ padding: '0.35rem 0.7rem', borderRadius: '0.4rem', background: '#5A1E1E', color: '#FFFFFF', border: 'none', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                                                    >
                                                        QR Scanner
                                                    </button>

                                                    <a
                                                        href={`/scan/${table.qr_token}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ padding: '0.35rem 0.7rem', borderRadius: '0.4rem', background: '#FDF8F0', color: '#8C6226', border: '1px solid #E6D2B5', fontSize: '0.76rem', fontWeight: 700, textDecoration: 'none' }}
                                                        title="Open customer scan-to-order panel"
                                                    >
                                                        Open Panel ↗
                                                    </a>
                                                </div>
                                            </td>

                                            <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#334155' }}>
                                                {table.orders_count || 0}
                                            </td>

                                            <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                                    <Link
                                                        href={route('admin.tables.edit', table.id)}
                                                        style={{ padding: '0.35rem 0.65rem', borderRadius: '0.4rem', border: '1px solid #CBD5E1', color: '#334155', textDecoration: 'none', fontSize: '0.76rem', fontWeight: 600 }}
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(table)}
                                                        style={{ padding: '0.35rem 0.65rem', borderRadius: '0.4rem', border: '1px solid #FECACA', background: '#FEF2F2', color: '#B91C1C', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination Footer */}
                        {totalItems > 0 && (
                            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', background: '#FAFAFA', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#475569' }}>
                                    <span>Rows per page:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            const newSize = Number(e.target.value);
                                            applyFilters({ per_page: newSize, page: 1 });
                                        }}
                                        style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 600, background: '#FFFFFF' }}
                                    >
                                        <option value={8}>8</option>
                                        <option value={10}>10</option>
                                        <option value={12}>12</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={(page) => applyFilters({ page })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            </div>

            {/* QR Code Scanner Modal */}
            <Modal show={Boolean(activeQrTable)} onClose={() => setActiveQrTable(null)}>
                {activeQrTable && (
                    <div style={{ padding: '1.75rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B88E4B' }}>
                            {activeQrTable.outlet?.name || 'Dayal Sweets'} • Table QR Scanner
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3E1C1A', margin: '0.25rem 0' }}>
                            {activeQrTable.name} ({activeQrTable.table_number})
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1.25rem' }}>
                            📍 {activeQrTable.location} • 👥 Seats {activeQrTable.capacity} People
                        </p>

                        <div style={{ display: 'inline-block', padding: '1.25rem', borderRadius: '1rem', background: '#FFFFFF', border: '2px solid #E6D2B5', boxShadow: '0 10px 25px rgba(90, 30, 30, 0.08)' }}>
                            <QrCodeSvg
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${activeQrTable.qr_token}`}
                                size={220}
                            />
                            <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', fontWeight: 700, color: '#5A1E1E' }}>
                                SCAN TO ORDER DIRECTLY FROM TABLE
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#64748B', wordBreak: 'break-all', background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '0.5rem' }}>
                            {`${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${activeQrTable.qr_token}`}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginTop: '1.25rem' }}>
                            <a
                                href={`/scan/${activeQrTable.qr_token}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ padding: '0.55rem 1rem', borderRadius: '0.5rem', background: '#5A1E1E', color: '#FFFFFF', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700 }}
                            >
                                Open Customer Ordering Panel ↗
                            </a>

                            <button
                                type="button"
                                onClick={() => handleCopyLink(activeQrTable)}
                                style={{ padding: '0.55rem 1rem', borderRadius: '0.5rem', background: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                {copiedId === activeQrTable.id ? '✓ Link Copied!' : 'Copy Scanner Link'}
                            </button>

                            <button
                                type="button"
                                onClick={() => window.print()}
                                style={{ padding: '0.55rem 1rem', borderRadius: '0.5rem', background: '#B88E4B', color: '#FFFFFF', border: 'none', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Print QR Card
                            </button>

                            <button
                                type="button"
                                onClick={() => handleRegenerateQr(activeQrTable)}
                                style={{ padding: '0.55rem 0.85rem', borderRadius: '0.5rem', background: '#FFFFFF', color: '#64748B', border: '1px solid #E2E8F0', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                                Regenerate QR
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Quick Add Table Modal */}
            <Modal show={quickAddOpen} onClose={() => !submitting && setQuickAddOpen(false)}>
                <form onSubmit={handleQuickCreateSubmit} style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem' }}>
                        Create Dining Table &amp; Generate QR Scanner
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1.2rem' }}>
                        Specify the outlet, table number, how many people can sit, and the floor/hall location.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                Select Outlet *
                            </label>
                            <select
                                required
                                value={form.outlet_id}
                                onChange={(e) => setForm({ ...form, outlet_id: e.target.value })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}
                            >
                                {outlets.map((o) => (
                                    <option key={o.id} value={o.id}>{o.name} ({o.city})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                Table Number / Code *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. T-05 or VIP-02"
                                value={form.table_number}
                                onChange={(e) => setForm({ ...form, table_number: e.target.value })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                Table Display Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Window Family Table 5"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                Seating Capacity (How Many People Can Sit) *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                required
                                value={form.capacity}
                                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                Location / Section *
                            </label>
                            <select
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}
                            >
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                                <option value="__custom__">+ Custom Location...</option>
                            </select>
                        </div>

                        {form.location === '__custom__' && (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                    Enter Custom Location Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Garden Lawn / 2nd Floor Balcony"
                                    value={customLocation}
                                    onChange={(e) => setCustomLocation(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}
                                />
                            </div>
                        )}

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                Notes / Landmark (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Near Sweet Display Counter"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.35rem' }}>
                        <button
                            type="button"
                            onClick={() => setQuickAddOpen(false)}
                            style={{ padding: '0.55rem 1rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{ padding: '0.55rem 1.2rem', borderRadius: '0.5rem', border: 'none', background: '#5A1E1E', color: '#FFFFFF', cursor: 'pointer', fontWeight: 700 }}
                        >
                            {submitting ? 'Creating...' : 'Create Table & Generate QR'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
