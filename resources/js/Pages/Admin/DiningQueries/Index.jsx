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

    // Trigger server-side filtering
    const applyFilters = (newParams = {}) => {
        const params = {
            search: newParams.search !== undefined ? newParams.search : search,
            status: newParams.status !== undefined ? newParams.status : selectedStatus,
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
        <AdminLayout
            title="Dining Queries & Reservations"
            subtitle="Manage restaurant dining bookings, customer requests & table arrangements"
        >
            <Head title="Dining Queries - Dayal Sweets Admin" />

            {/* Top Metric Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                }}
            >
                {/* Total */}
                <div
                    onClick={() => handleStatusFilterChange('all')}
                    style={{
                        background: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '0.5rem',
                        border: selectedStatus === 'all' ? '2px solid #8B1E28' : '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Queries
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                        {counts?.total || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                        All dining requests
                    </div>
                </div>

                {/* Pending */}
                <div
                    onClick={() => handleStatusFilterChange('pending')}
                    style={{
                        background: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '0.5rem',
                        border: selectedStatus === 'pending' ? '2px solid #D97706' : '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Pending Reservations
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B45309', marginTop: '0.35rem' }}>
                        {counts?.pending || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                        Awaiting staff confirmation
                    </div>
                </div>

                {/* Confirmed */}
                <div
                    onClick={() => handleStatusFilterChange('confirmed')}
                    style={{
                        background: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '0.5rem',
                        border: selectedStatus === 'confirmed' ? '2px solid #10B981' : '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Confirmed Bookings
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '0.35rem' }}>
                        {counts?.confirmed || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                        Table reserved
                    </div>
                </div>

                {/* Completed */}
                <div
                    onClick={() => handleStatusFilterChange('completed')}
                    style={{
                        background: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '0.5rem',
                        border: selectedStatus === 'completed' ? '2px solid #2563EB' : '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Completed Dining
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E40AF', marginTop: '0.35rem' }}>
                        {counts?.completed || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                        Guests served
                    </div>
                </div>
            </div>

            {/* Filter Tabs & Search Header */}
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '0.5rem',
                    border: '1px solid #E2E8F0',
                    padding: '1.25rem',
                    marginBottom: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Status Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {[
                            { key: 'all', label: 'All Queries', count: counts?.total },
                            { key: 'pending', label: 'Pending', count: counts?.pending },
                            { key: 'confirmed', label: 'Confirmed', count: counts?.confirmed },
                            { key: 'completed', label: 'Completed', count: counts?.completed },
                            { key: 'cancelled', label: 'Cancelled', count: counts?.cancelled },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleStatusFilterChange(tab.key)}
                                style={{
                                    padding: '0.45rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.8125rem',
                                    fontWeight: selectedStatus === tab.key ? 700 : 500,
                                    border: selectedStatus === tab.key ? '1px solid #8B1E28' : '1px solid #E2E8F0',
                                    background: selectedStatus === tab.key ? '#8B1E28' : '#F8FAFC',
                                    color: selectedStatus === tab.key ? '#FFFFFF' : '#475569',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <span>{tab.label}</span>
                                {tab.count !== undefined && (
                                    <span
                                        style={{
                                            fontSize: '0.6875rem',
                                            padding: '0.1rem 0.35rem',
                                            borderRadius: '999px',
                                            background: selectedStatus === tab.key ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                                            color: selectedStatus === tab.key ? '#FFFFFF' : '#475569',
                                        }}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Active Outlet Scope Badge */}
                    {activeOutlet && (
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                color: '#065F46',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.785rem',
                                fontWeight: 600,
                            }}
                        >
                            <span>Scoped to: {activeOutlet.name}</span>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 250px', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search by customer name, phone, email, special requests..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.55rem 0.85rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.875rem',
                                outline: 'none',
                            }}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    applyFilters({ search: '' });
                                }}
                                style={{
                                    position: 'absolute',
                                    right: '0.6rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#94A3B8',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="dayal-btn dayal-btn--primary"
                        style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
                    >
                        Search
                    </button>
                </form>
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
