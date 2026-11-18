import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { AlertIcon } from '@/Components/Icons';

export default function Index({ queries, counts, filters }) {
    const data = queries?.data || [];
    const paginationLinks = queries?.links || [];

    // Filter controls
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');
    const [perPage, setPerPage] = useState(filters?.per_page || 15);
    const [showCards, setShowCards] = useState(false);

    // Detail Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [activeQuery, setActiveQuery] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [queryToDelete, setQueryToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Trigger server-side filtering
    const applyFilters = (newParams = {}) => {
        const params = {
            search: newParams.search !== undefined ? newParams.search : search,
            status: newParams.status !== undefined ? newParams.status : selectedStatus,
            per_page: newParams.per_page !== undefined ? newParams.per_page : perPage,
        };

        router.get(route('admin.contact-queries.index'), params, {
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

    // Open detail modal and mark as read if unread
    const handleViewDetails = (query) => {
        setActiveQuery(query);
        setDetailModalOpen(true);

        if (query.status === 'unread') {
            router.patch(
                route('admin.contact-queries.update-status', query.id),
                { status: 'read' },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        setActiveQuery((prev) => (prev ? { ...prev, status: 'read' } : null));
                    },
                }
            );
        }
    };

    // Change status from table or modal
    const handleStatusUpdate = (queryId, newStatus) => {
        setUpdatingStatus(true);
        router.patch(
            route('admin.contact-queries.update-status', queryId),
            { status: newStatus },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setUpdatingStatus(false);
                    if (activeQuery && activeQuery.id === queryId) {
                        setActiveQuery((prev) => ({ ...prev, status: newStatus }));
                    }
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
        router.delete(route('admin.contact-queries.destroy', queryToDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteModalOpen(false);
                if (activeQuery && activeQuery.id === queryToDelete.id) {
                    setDetailModalOpen(false);
                    setActiveQuery(null);
                }
                setQueryToDelete(null);
            },
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'unread':
                return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', label: 'Unread' };
            case 'read':
                return { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD', label: 'Read' };
            case 'replied':
                return { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0', label: 'Replied' };
            default:
                return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', label: status };
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <AdminLayout header="Customer Contact Inquiries">
            <Head title="Contact Queries - Dayal Sweets Admin" />

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
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Contact Queries</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Customer Inquiries &amp; Messages
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                            View and manage messages, catering requests, and customer feedback submitted from the public Contact Us form.
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
                            href={route('contact')}
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
                            <span>Open Contact Form</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Top Metrics Cards - Collapsed by default, counts only, NO clicks */}
                {showCards && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {/* 1. Total Queries */}
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
                                Total Inquiries
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                                {counts?.total || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                All messages received
                            </div>
                        </div>

                        {/* 2. Unread Queries */}
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
                                New / Unread
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#B45309', marginTop: '0.35rem' }}>
                                {counts?.unread || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.25rem', fontWeight: 600 }}>
                                Awaiting initial review
                            </div>
                        </div>

                        {/* 3. Read Queries */}
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
                                Reviewed / Read
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0369A1', marginTop: '0.35rem' }}>
                                {counts?.read || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Opened &amp; reviewed
                            </div>
                        </div>

                        {/* 4. Replied Queries */}
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
                                Replied / Contacted
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803D', marginTop: '0.35rem' }}>
                                {counts?.replied || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>
                                Customer contacted
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Filter Buttons without count - Clicks happen here */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {[
                        { key: 'all', label: 'All Inquiries' },
                        { key: 'unread', label: 'New / Unread' },
                        { key: 'read', label: 'Reviewed / Read' },
                        { key: 'replied', label: 'Replied / Contacted' },
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
                            placeholder="Search by name, email, phone, or subject..."
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
                                <option value="all">All Inquiries</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
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

                {/* Table Container */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        marginBottom: '1.5rem',
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#475569', width: '60px' }}>#ID</th>
                                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#475569' }}>Sender</th>
                                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#475569' }}>Subject</th>
                                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#475569' }}>Requirements / Message</th>
                                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#475569' }}>Received</th>
                                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#475569' }}>Status</th>
                                <th style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item) => {
                                    const badge = getStatusBadge(item.status);
                                    const isUnread = item.status === 'unread';

                                    return (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderBottom: '1px solid #F1F5F9',
                                                backgroundColor: isUnread ? '#FFFBEB' : 'transparent',
                                                transition: 'background-color 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isUnread ? '#FEF3C7' : '#F8FAFC')}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isUnread ? '#FFFBEB' : 'transparent')}
                                        >
                                            {/* 1. ID */}
                                            <td style={{ padding: '0.95rem 1.15rem', fontWeight: 700, color: '#64748B', fontSize: '0.8125rem' }}>
                                                #{item.id}
                                            </td>

                                            {/* 2. Sender Info */}
                                            <td style={{ padding: '0.95rem 1.15rem' }}>
                                                <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <span>{item.name}</span>
                                                    {isUnread && (
                                                        <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '9999px', background: '#D97706' }} title="New message" />
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
                                                    <a href={`mailto:${item.email}`} style={{ color: '#2563EB', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                                                        {item.email}
                                                    </a>
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                                                    <a href={`tel:${item.phone}`} style={{ color: '#475569', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                                                        {item.phone}
                                                    </a>
                                                </div>
                                            </td>

                                            {/* 3. Subject */}
                                            <td style={{ padding: '0.95rem 1.15rem', fontWeight: 600, color: '#1E293B', maxWidth: '200px' }}>
                                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.subject}>
                                                    {item.subject}
                                                </div>
                                            </td>

                                            {/* 4. Requirements Preview */}
                                            <td style={{ padding: '0.95rem 1.15rem', color: '#475569', fontSize: '0.8125rem', maxWidth: '280px' }}>
                                                <div
                                                    onClick={() => handleViewDetails(item)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        lineHeight: '1.4',
                                                    }}
                                                    title="Click to view full message"
                                                >
                                                    {item.requirements || item.message || '-'}
                                                </div>
                                            </td>

                                            {/* 5. Received Date */}
                                            <td style={{ padding: '0.95rem 1.15rem', color: '#64748B', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                                                {formatDate(item.created_at)}
                                            </td>

                                            {/* 6. Status Badge with Dropdown */}
                                            <td style={{ padding: '0.95rem 1.15rem' }}>
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                                                    style={{
                                                        padding: '0.2rem 0.55rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        background: badge.bg,
                                                        color: badge.text,
                                                        border: `1px solid ${badge.border}`,
                                                        cursor: 'pointer',
                                                        outline: 'none',
                                                    }}
                                                >
                                                    <option value="unread">Unread</option>
                                                    <option value="read">Read</option>
                                                    <option value="replied">Replied</option>
                                                </select>
                                            </td>

                                            {/* 7. Actions */}
                                            <td style={{ padding: '0.95rem 1.15rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    {/* View Details Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewDetails(item)}
                                                        style={{
                                                            padding: '0.4rem 0.75rem',
                                                            borderRadius: '0.375rem',
                                                            background: '#7A1C1C',
                                                            color: '#FFFFFF',
                                                            border: 'none',
                                                            fontSize: '0.78rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem',
                                                        }}
                                                        title="View full query details"
                                                    >
                                                        <span>View</span>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRequestDelete(item)}
                                                        style={{
                                                            padding: '0.4rem 0.6rem',
                                                            borderRadius: '0.375rem',
                                                            background: '#FEE2E2',
                                                            color: '#DC2626',
                                                            border: '1px solid #FECACA',
                                                            fontSize: '0.78rem',
                                                            cursor: 'pointer',
                                                        }}
                                                        title="Delete inquiry"
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
                                        <div style={{ maxWidth: '360px', margin: '0 auto' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#94A3B8' }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                    <polyline points="22,6 12,13 2,6" />
                                                </svg>
                                            </div>
                                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '1rem', marginBottom: '0.35rem' }}>
                                                No inquiries found
                                            </div>
                                            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                                                {search || selectedStatus !== 'all'
                                                    ? 'No inquiries match your current search or status filter. Try resetting filters.'
                                                    : 'When customers fill out the Contact Us form on your website, their messages will appear here in descending order.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Footer */}
                    {paginationLinks && paginationLinks.length > 3 && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 1.25rem',
                                borderTop: '1px solid #E2E8F0',
                                background: '#F8FAFC',
                                flexWrap: 'wrap',
                                gap: '0.75rem',
                            }}
                        >
                            <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                                Showing <strong>{queries.from || 0}</strong> to <strong>{queries.to || 0}</strong> of <strong>{queries.total || 0}</strong> inquiries
                            </div>

                            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                {paginationLinks.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        preserveScroll
                                        preserveState
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{
                                            padding: '0.38rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            background: link.active ? '#7A1C1C' : link.url ? '#FFFFFF' : '#F1F5F9',
                                            color: link.active ? '#FFFFFF' : link.url ? '#1E293B' : '#94A3B8',
                                            fontWeight: link.active ? 700 : 500,
                                            fontSize: '0.8125rem',
                                            textDecoration: 'none',
                                            border: '1px solid ' + (link.active ? '#7A1C1C' : '#E2E8F0'),
                                            pointerEvents: link.url ? 'auto' : 'none',
                                            cursor: link.url ? 'pointer' : 'default',
                                            transition: 'all 0.15s ease',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* View Query Details Modal */}
            <Modal show={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
                {activeQuery && (
                    <div className="dayal-admin-modal-content" style={{ padding: '1.75rem' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                                    Customer Inquiry #{activeQuery.id}
                                </div>
                                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', margin: '0.25rem 0 0 0' }}>
                                    {activeQuery.subject}
                                </h3>
                                <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.25rem' }}>
                                    Received on {formatDate(activeQuery.created_at)}
                                </div>
                            </div>

                            {/* Status Tag */}
                            <div>
                                <select
                                    value={activeQuery.status}
                                    onChange={(e) => handleStatusUpdate(activeQuery.id, e.target.value)}
                                    disabled={updatingStatus}
                                    style={{
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.8125rem',
                                        fontWeight: 700,
                                        border: '1px solid #CBD5E1',
                                        background: '#FFFFFF',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="unread">Status: Unread</option>
                                    <option value="read">Status: Read</option>
                                    <option value="replied">Status: Replied</option>
                                </select>
                            </div>
                        </div>

                        {/* Customer Information Grid */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                borderRadius: '0.5rem',
                                padding: '1rem',
                                marginBottom: '1.25rem',
                            }}
                        >
                            <div>
                                <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Customer Name
                                </span>
                                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                                    {activeQuery.name}
                                </span>
                            </div>

                            <div>
                                <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Email Address
                                </span>
                                <a href={`mailto:${activeQuery.email}`} style={{ fontSize: '0.9rem', color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                                    {activeQuery.email}
                                </a>
                            </div>

                            <div>
                                <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Mobile Number
                                </span>
                                <a href={`tel:${activeQuery.phone}`} style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 600, textDecoration: 'none' }}>
                                    {activeQuery.phone}
                                </a>
                            </div>

                            {activeQuery.ip_address && (
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                                        IP Address
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                                        {activeQuery.ip_address}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Requirements / Message Body */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                                Full Requirements / Message Content:
                            </label>
                            <div
                                style={{
                                    padding: '1rem 1.25rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #CBD5E1',
                                    background: '#FFFFFF',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6,
                                    color: '#0F172A',
                                    whiteSpace: 'pre-wrap',
                                    minHeight: '120px',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                }}
                            >
                                {activeQuery.requirements || activeQuery.message || 'No requirements text provided.'}
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <a
                                    href={`mailto:${activeQuery.email}?subject=${encodeURIComponent('Re: ' + activeQuery.subject)}&body=${encodeURIComponent('\n\n--- Original Inquiry ---\n' + (activeQuery.requirements || activeQuery.message))}`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '0.55rem 1rem',
                                        borderRadius: '0.375rem',
                                        background: '#7A1C1C',
                                        color: '#FFFFFF',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <span>Reply via Email</span>
                                </a>

                                <a
                                    href={`tel:${activeQuery.phone}`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '0.55rem 1rem',
                                        borderRadius: '0.375rem',
                                        background: '#F1F5F9',
                                        color: '#1E293B',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <span>Call Sender</span>
                                </a>
                            </div>

                            <button
                                type="button"
                                onClick={() => setDetailModalOpen(false)}
                                style={{
                                    padding: '0.55rem 1rem',
                                    borderRadius: '0.375rem',
                                    background: '#FFFFFF',
                                    color: '#64748B',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalOpen} onClose={() => !deleting && setDeleteModalOpen(false)}>
                {queryToDelete && (
                    <div className="dayal-admin-modal-content" style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <AlertIcon width="22" height="22" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                    Delete Contact Inquiry #{queryToDelete.id}?
                                </h3>
                                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                                    Inquiry from <strong>{queryToDelete.name}</strong> ({queryToDelete.subject})
                                </p>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                            Are you sure you want to permanently delete this customer inquiry? This action cannot be undone.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setDeleteModalOpen(false)}
                                style={{
                                    padding: '0.55rem 1rem',
                                    borderRadius: '0.375rem',
                                    background: '#FFFFFF',
                                    color: '#475569',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleConfirmDelete}
                                style={{
                                    padding: '0.55rem 1rem',
                                    borderRadius: '0.375rem',
                                    background: '#DC2626',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete Inquiry'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
