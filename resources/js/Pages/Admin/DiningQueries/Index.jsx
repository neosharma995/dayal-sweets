import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';

export default function Index({ queries, counts, filters }) {
    const { activeOutlet } = usePage().props || {};
    const data = queries?.data || [];

    // Filter controls
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');

    // Detail Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [activeQuery, setActiveQuery] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [savingNotes, setSavingNotes] = useState(false);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [queryToDelete, setQueryToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [perPage, setPerPage] = useState(filters?.per_page || 15);
    const [showCards, setShowCards] = useState(false);

    // Trigger server-side filtering
    const applyFilters = (newParams = {}) => {
        const params = {
            search: newParams.search !== undefined ? newParams.search : search,
            status: newParams.status !== undefined ? newParams.status : selectedStatus,
            per_page: newParams.per_page !== undefined ? newParams.per_page : perPage,
        };

        router.get(route('admin.dining-queries.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleStatusFilterChange = (status) => {
        setSelectedStatus(status);
        applyFilters({ status });
    };

    const handlePerPageChange = (e) => {
        const val = parseInt(e.target.value, 10);
        setPerPage(val);
        applyFilters({ per_page: val });
    };

    // Open detail modal
    const handleViewDetails = (query) => {
        setActiveQuery(query);
        setAdminNotes(query.admin_notes || '');
        setDetailModalOpen(true);
    };

    // Change status from table or modal
    const handleStatusUpdate = (queryId, newStatus) => {
        router.patch(
            route('admin.dining-queries.update-status', queryId),
            { status: newStatus },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    if (activeQuery && activeQuery.id === queryId) {
                        setActiveQuery((prev) => ({ ...prev, status: newStatus }));
                    }
                },
            }
        );
    };

    // Save admin notes
    const handleSaveNotes = (e) => {
        e.preventDefault();
        if (!activeQuery) return;
        setSavingNotes(true);

        router.patch(
            route('admin.dining-queries.update-status', activeQuery.id),
            { status: activeQuery.status, admin_notes: adminNotes },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setSavingNotes(false);
                    setActiveQuery((prev) => ({ ...prev, admin_notes: adminNotes }));
                },
            }
        );
    };

    // Delete Confirmation
    const handleRequestDelete = (query) => {
        setQueryToDelete(query);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!queryToDelete) return;
        setDeleting(true);

        router.delete(route('admin.dining-queries.destroy', queryToDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteModalOpen(false);
                setQueryToDelete(null);
                if (activeQuery && activeQuery.id === queryToDelete.id) {
                    setDetailModalOpen(false);
                    setActiveQuery(null);
                }
            },
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'Pending' };
            case 'confirmed':
                return { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', label: 'Confirmed' };
            case 'completed':
                return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', label: 'Completed' };
            case 'cancelled':
                return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', label: 'Cancelled' };
            default:
                return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', label: status || 'Pending' };
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AdminLayout>
            <Head title="Dining Queries - Dayal Sweets Admin" />

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
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Dining Queries</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Dining Queries &amp; Table Reservations
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                            Manage restaurant dining bookings, customer requests &amp; table arrangements.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
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

                        <a
                            href={route('dining')}
                            target="_blank"
                            rel="noreferrer"
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
                            <span>Open Reservation Form</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                        </a>
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
                        {/* 1. Total */}
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
                                Total Queries
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                                {counts?.total || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                All dining requests
                            </div>
                        </div>

                        {/* 2. Pending */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Pending Reservations
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#B45309', marginTop: '0.35rem' }}>
                                {counts?.pending || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.25rem', fontWeight: 600 }}>
                                Awaiting staff confirmation
                            </div>
                        </div>

                        {/* 3. Confirmed */}
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
                                Confirmed Bookings
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803D', marginTop: '0.35rem' }}>
                                {counts?.confirmed || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>
                                Table reserved
                            </div>
                        </div>

                        {/* 4. Completed */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Completed Dining
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0369A1', marginTop: '0.35rem' }}>
                                {counts?.completed || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Guests served
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Filter Buttons without count - Clicks happen here */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {[
                        { key: 'all', label: 'All Queries' },
                        { key: 'pending', label: 'Pending' },
                        { key: 'confirmed', label: 'Confirmed' },
                        { key: 'completed', label: 'Completed' },
                        { key: 'cancelled', label: 'Cancelled' },
                    ].map((tab) => {
                        const isActive = selectedStatus === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleStatusFilterChange(tab.key)}
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
                            placeholder="Search by customer name, phone, email, special requests..."
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
                                    applyFilters({ search: '' });
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
                            <span>Status:</span>
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Queries</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Per page:</span>
                            <select
                                value={perPage}
                                onChange={handlePerPageChange}
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
                    </div>
                </div>

            {/* Table */}
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '0.5rem',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '0.85rem 1rem' }}>Query ID &amp; Date</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Guests</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Outlet</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Message / Requests</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                                data.map((item) => {
                                    const badge = getStatusBadge(item.status);

                                    return (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderBottom: '1px solid #F1F5F9',
                                                transition: 'background 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                                        >
                                            {/* Query ID & Date */}
                                            <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewDetails(item)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        padding: 0,
                                                        color: '#8B1E28',
                                                        fontWeight: 700,
                                                        fontSize: '0.875rem',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    #DQ-{item.id}
                                                </button>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                                                    {formatDate(item.created_at)}
                                                </div>
                                            </td>

                                            {/* Customer */}
                                            <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                                                <div style={{ fontWeight: 600, color: '#0F172A' }}>
                                                    {item.name}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                                                    📞 {item.phone}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                    ✉ {item.email}
                                                </div>
                                            </td>

                                            {/* Guests */}
                                            <td style={{ padding: '0.85rem 1rem', textAlign: 'center', verticalAlign: 'middle' }}>
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '0.25rem 0.65rem',
                                                        borderRadius: '999px',
                                                        background: '#F1F5F9',
                                                        color: '#334155',
                                                        fontWeight: 700,
                                                        fontSize: '0.8125rem',
                                                    }}
                                                >
                                                    {item.guests || 1} {item.guests === 1 ? 'Guest' : 'Guests'}
                                                </span>
                                            </td>

                                            {/* Outlet */}
                                            <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                                                {item.outlet ? (
                                                    <div>
                                                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8125rem' }}>
                                                            {item.outlet.name}
                                                        </span>
                                                        {item.outlet.city && item.outlet.city.toLowerCase() !== item.outlet.name.toLowerCase() && (
                                                            <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.1rem' }}>
                                                                {item.outlet.city}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>—</span>
                                                )}
                                            </td>

                                            {/* Message */}
                                            <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', maxWidth: '280px' }}>
                                                <div
                                                    onClick={() => handleViewDetails(item)}
                                                    style={{
                                                        fontSize: '0.8125rem',
                                                        color: '#334155',
                                                        cursor: 'pointer',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        lineHeight: 1.4,
                                                    }}
                                                    title={item.message || 'No special requests'}
                                                >
                                                    {item.message || <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>No special requests</span>}
                                                </div>
                                            </td>

                                            {/* Status Badge + Quick Changer */}
                                            <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                                                    style={{
                                                        padding: '0.25rem 0.6rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        background: badge.bg,
                                                        color: badge.text,
                                                        border: `1px solid ${badge.border}`,
                                                        cursor: 'pointer',
                                                        outline: 'none',
                                                    }}
                                                    title="Quick change reservation status"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '0.85rem 1rem', textAlign: 'right', verticalAlign: 'middle' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewDetails(item)}
                                                        className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                                                    >
                                                        View Query
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRequestDelete(item)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#EF4444',
                                                            padding: '0.3rem 0.45rem',
                                                            borderRadius: '0.25rem',
                                                        }}
                                                        title="Delete query"
                                                    >
                                                        🗑
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍽</div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem', color: '#334155' }}>
                                            {activeOutlet
                                                ? `No dining queries found matching your criteria - ${activeOutlet.name}`
                                                : 'No dining queries found matching your criteria.'}
                                        </p>
                                        <p style={{ margin: '0.25rem 0 1rem 0', fontSize: '0.8125rem' }}>
                                            {activeOutlet
                                                ? `No table reservations match the selected filters for ${activeOutlet.name}.`
                                                : 'Try adjusting your status tab filter or search query.'}
                                        </p>
                                        <Link href="/dining" target="_blank" className="dayal-btn dayal-btn--primary dayal-btn--sm">
                                            Open Public Dining Page ↗
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {queries && queries.total > 0 && (
                    <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0' }}>
                        <Pagination
                            currentPage={queries.current_page}
                            totalPages={queries.last_page}
                            totalItems={queries.total}
                            itemsPerPage={queries.per_page}
                            onPageChange={(page) => {
                                router.get(
                                    route('admin.dining-queries.index'),
                                    { ...filters, page },
                                    { preserveState: true, preserveScroll: true }
                                );
                            }}
                        />
                    </div>
                )}
            </div>
            </div>

            {/* Detail Modal */}
            <Modal show={detailModalOpen} onClose={() => setDetailModalOpen(false)} maxWidth="2xl">
                {activeQuery && (
                    <div style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8B1E28', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Dining Reservation Details
                                </span>
                                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                                    Query #DQ-{activeQuery.id}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDetailModalOpen(false)}
                                style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748B' }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Customer Info Card */}
                        <div style={{ background: '#F8FAFC', borderRadius: '0.5rem', padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Customer Name</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>{activeQuery.name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Phone Number</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', marginTop: '0.2rem' }}>
                                        <a href={`tel:${activeQuery.phone}`} style={{ color: '#0F172A', textDecoration: 'none' }}>
                                            📞 {activeQuery.phone}
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2563EB', marginTop: '0.2rem' }}>
                                        <a href={`mailto:${activeQuery.email}`} style={{ color: '#2563EB', textDecoration: 'none' }}>
                                            ✉ {activeQuery.email}
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>No. of Guests</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#8B1E28', marginTop: '0.2rem' }}>
                                        🍽 {activeQuery.guests || 1} {activeQuery.guests === 1 ? 'Person' : 'People'}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Action Links */}
                            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                <a
                                    href={`tel:${activeQuery.phone}`}
                                    className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                    style={{ textDecoration: 'none' }}
                                >
                                    📞 Call Customer
                                </a>
                                <a
                                    href={`https://wa.me/91${activeQuery.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                    style={{ textDecoration: 'none', color: '#166534', borderColor: '#BBF7D0', background: '#F0FDF4' }}
                                >
                                    💬 Open WhatsApp
                                </a>
                                <a
                                    href={`mailto:${activeQuery.email}?subject=Regarding Your Table Reservation at Dayal Sweets`}
                                    className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                    style={{ textDecoration: 'none' }}
                                >
                                    ✉ Send Email
                                </a>
                            </div>
                        </div>

                        {/* Special Requests / Message */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                                Special Requests / Customer Message
                            </div>
                            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '0.375rem', padding: '0.85rem 1rem', fontSize: '0.875rem', color: '#1E293B', whiteSpace: 'pre-wrap', minHeight: '60px' }}>
                                {activeQuery.message || <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>No special requests mentioned.</span>}
                            </div>
                        </div>

                        {/* Outlet & Status Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                                    Assigned Outlet
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 600 }}>
                                    {activeQuery.outlet ? activeQuery.outlet.name : 'All Outlets / Not Assigned'}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                                    Current Status
                                </div>
                                <select
                                    value={activeQuery.status}
                                    onChange={(e) => handleStatusUpdate(activeQuery.id, e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        background: '#FFFFFF',
                                    }}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {/* Internal Admin Notes */}
                        <form onSubmit={handleSaveNotes} style={{ marginBottom: '1.25rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                                Internal Staff Notes (Private)
                            </div>
                            <textarea
                                rows="3"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add notes (e.g. Table #4 allocated, confirmed via phone call with Mr. Sharma)..."
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    marginBottom: '0.5rem',
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    type="submit"
                                    disabled={savingNotes}
                                    className="dayal-btn dayal-btn--primary dayal-btn--sm"
                                >
                                    {savingNotes ? 'Saving Notes...' : 'Save Internal Notes'}
                                </button>
                            </div>
                        </form>

                        {/* Modal Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => handleRequestDelete(activeQuery)}
                                style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                            >
                                🗑 Delete Reservation
                            </button>
                            <button
                                type="button"
                                onClick={() => setDetailModalOpen(false)}
                                className="dayal-btn dayal-btn--outline dayal-btn--sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="sm">
                <div style={{ padding: '1.75rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗑</div>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                        Delete Dining Query?
                    </h3>
                    <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: '#64748B' }}>
                        Are you sure you want to delete this table reservation request from <strong>{queryToDelete?.name}</strong>? This action cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(false)}
                            className="dayal-btn dayal-btn--outline"
                            disabled={deleting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            style={{
                                background: '#EF4444',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '0.55rem 1.25rem',
                                borderRadius: '0.375rem',
                                fontWeight: 700,
                                cursor: deleting ? 'wait' : 'pointer',
                            }}
                        >
                            {deleting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
