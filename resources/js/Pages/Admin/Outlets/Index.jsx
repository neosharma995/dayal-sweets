import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { MapPinIcon, PhoneIcon, AlertIcon } from '@/Components/Icons';

export default function Index({ outlets = [], filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [outletToDelete, setOutletToDelete] = useState(null);

    const filteredOutlets = outlets.filter((item) => {
        const matchesStatus =
            selectedStatus === 'all' ||
            (selectedStatus === 'active' && item.status === 'active' && item.is_active) ||
            (selectedStatus === 'coming_soon' && (item.status === 'coming_soon' || item.is_coming_soon)) ||
            (selectedStatus === 'inactive' && (item.status === 'inactive' || !item.is_active));

        if (!matchesStatus) return false;

        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            item.name?.toLowerCase().includes(q) ||
            item.subtitle?.toLowerCase().includes(q) ||
            item.address?.toLowerCase().includes(q) ||
            item.city?.toLowerCase().includes(q) ||
            item.phone?.toLowerCase().includes(q)
        );
    });

    const handleDeleteClick = (outlet) => {
        setOutletToDelete(outlet);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!outletToDelete) return;
        router.delete(route('admin.outlets.destroy', outletToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setOutletToDelete(null);
            },
        });
    };

    const toggleStatus = (outletId) => {
        router.patch(route('admin.outlets.toggle', outletId), {}, {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (outlet) => {
        if (!outlet.is_active || outlet.status === 'inactive') {
            return (
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#F1F5F9',
                        color: '#64748B',
                        border: '1px solid #CBD5E1',
                    }}
                >
                    Inactive
                </span>
            );
        }

        if (outlet.status === 'coming_soon' || outlet.is_coming_soon) {
            return (
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#FEF3C7',
                        color: '#92400E',
                        border: '1px solid #FDE68A',
                    }}
                >
                    Coming Soon
                </span>
            );
        }

        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: '#ECFDF5',
                    color: '#065F46',
                    border: '1px solid #A7F3D0',
                }}
            >
                Active
            </span>
        );
    };

    return (
        <AdminLayout header="Outlets Management">
            <Head title="Outlets - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
                {/* View Header */}
                <div
                    className="dayal-admin-view-header"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        width: '100%',
                    }}
                >
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPinIcon width="24" height="24" style={{ color: '#B88E4B' }} />
                            <span>Store Outlets</span>
                        </h1>
                        <p>Manage Dayal Sweets flagship physical stores, addresses, contact details, map links, and opening statuses.</p>
                    </div>

                    <Link
                        href={route('admin.outlets.create')}
                        className="dayal-btn dayal-btn--primary"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none',
                            background: '#B88E4B',
                            color: '#FFFFFF',
                            padding: '0.625rem 1.25rem',
                            borderRadius: '0.375rem',
                            fontWeight: 600,
                            boxShadow: '0 2px 4px rgba(184, 142, 75, 0.25)',
                        }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New Outlet</span>
                    </Link>
                </div>

                {/* Metrics Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.75rem',
                    }}
                >
                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Total Outlets</span>
                            <span className="dayal-stat-badge">All</span>
                        </div>
                        <div className="dayal-stat-value">{stats.total ?? outlets.length}</div>
                        <div className="dayal-stat-subtext">Configured locations</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Active Outlets</span>
                            <span className="dayal-stat-badge" style={{ color: '#059669', background: '#ECFDF5' }}>
                                Open
                            </span>
                        </div>
                        <div className="dayal-stat-value" style={{ color: '#059669' }}>
                            {stats.active ?? outlets.filter((o) => o.is_active && o.status === 'active').length}
                        </div>
                        <div className="dayal-stat-subtext">Currently serving customers</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Coming Soon</span>
                            <span className="dayal-stat-badge" style={{ color: '#D97706', background: '#FEF3C7' }}>
                                Upcoming
                            </span>
                        </div>
                        <div className="dayal-stat-value" style={{ color: '#D97706' }}>
                            {stats.coming_soon ?? outlets.filter((o) => o.is_coming_soon || o.status === 'coming_soon').length}
                        </div>
                        <div className="dayal-stat-subtext">Under setup / expansion</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Regions Covered</span>
                            <span className="dayal-stat-badge" style={{ color: '#4F46E5', background: '#EEF2FF' }}>
                                HP
                            </span>
                        </div>
                        <div className="dayal-stat-value">Himachal</div>
                        <div className="dayal-stat-subtext">Una, Hamirpur, Kangra...</div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="dayal-admin-table-card" style={{ marginBottom: '2rem' }}>
                    <div
                        className="dayal-admin-table-head"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            borderBottom: '1px solid #E2E8F0',
                            paddingBottom: '1rem',
                        }}
                    >
                        {/* Status Pills */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {[
                                { key: 'all', label: 'All Outlets' },
                                { key: 'active', label: 'Active' },
                                { key: 'coming_soon', label: 'Coming Soon' },
                                { key: 'inactive', label: 'Inactive' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setSelectedStatus(tab.key)}
                                    style={{
                                        padding: '0.4rem 0.85rem',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        borderRadius: '0.375rem',
                                        border: selectedStatus === tab.key ? '1px solid #B88E4B' : '1px solid #E2E8F0',
                                        background: selectedStatus === tab.key ? '#B88E4B' : '#FFFFFF',
                                        color: selectedStatus === tab.key ? '#FFFFFF' : '#475569',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div style={{ position: 'relative', minWidth: '260px' }}>
                            <input
                                type="text"
                                placeholder="Search by name, city, address..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                                    fontSize: '0.8125rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    background: '#FFFFFF',
                                    color: '#0F172A',
                                }}
                            />
                            <svg
                                width="16"
                                height="16"
                                fill="none"
                                stroke="#94A3B8"
                                viewBox="0 0 24 24"
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    style={{
                                        position: 'absolute',
                                        right: '0.6rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#94A3B8',
                                        cursor: 'pointer',
                                    }}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table View */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Outlet
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Address &amp; Location
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Contact Info
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Timings / Notes
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Products
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Status
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOutlets.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                                <MapPinIcon width="40" height="40" style={{ color: '#CBD5E1' }} />
                                                <div>
                                                    <p style={{ fontWeight: 600, color: '#334155', margin: 0 }}>No outlets found</p>
                                                    <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                                                        {search ? 'Try clearing your search query' : 'Get started by creating your first outlet'}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={route('admin.outlets.create')}
                                                    style={{
                                                        marginTop: '0.5rem',
                                                        padding: '0.45rem 1rem',
                                                        background: '#B88E4B',
                                                        color: '#FFFFFF',
                                                        borderRadius: '0.375rem',
                                                        fontSize: '0.8125rem',
                                                        textDecoration: 'none',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Add First Outlet
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOutlets.map((outlet) => (
                                        <tr
                                            key={outlet.id}
                                            style={{
                                                borderBottom: '1px solid #F1F5F9',
                                                transition: 'background-color 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                        >
                                            {/* Outlet Info */}
                                            <td style={{ padding: '0.875rem 1rem', verticalAlign: 'top' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                                    <div
                                                        style={{
                                                            width: '56px',
                                                            height: '42px',
                                                            borderRadius: '0.375rem',
                                                            overflow: 'hidden',
                                                            background: '#F1F5F9',
                                                            border: '1px solid #E2E8F0',
                                                            flexShrink: 0,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {outlet.image_url || outlet.image ? (
                                                            <img
                                                                src={outlet.image_url || outlet.image}
                                                                alt={outlet.name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <MapPinIcon width="20" height="20" style={{ color: '#94A3B8' }} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem' }}>
                                                            {outlet.name}
                                                        </div>
                                                        {outlet.subtitle && (
                                                            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                                                                {outlet.subtitle}
                                                            </span>
                                                        )}
                                                        <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                                                            Slug: {outlet.slug}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Address & Location */}
                                            <td style={{ padding: '0.875rem 1rem', verticalAlign: 'top', maxWidth: '300px' }}>
                                                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#334155', lineHeight: 1.4 }}>
                                                    {outlet.address}
                                                </p>
                                                <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {outlet.city && (
                                                        <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                                                            {outlet.city}
                                                        </span>
                                                    )}
                                                    {outlet.pincode && (
                                                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                            PIN: {outlet.pincode}
                                                        </span>
                                                    )}
                                                    {outlet.map_url && (
                                                        <a
                                                            href={outlet.map_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ fontSize: '0.75rem', color: '#B88E4B', fontWeight: 600, textDecoration: 'none' }}
                                                        >
                                                            Map &rarr;
                                                        </a>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Contact Info */}
                                            <td style={{ padding: '0.875rem 1rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                                                {outlet.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: '#334155' }}>
                                                        <PhoneIcon width="14" height="14" style={{ color: '#64748B' }} />
                                                        <span>{outlet.phone}</span>
                                                    </div>
                                                )}
                                                {outlet.whatsapp && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#059669', marginTop: '0.2rem' }}>
                                                        <span>WhatsApp:</span>
                                                        <span>{outlet.whatsapp}</span>
                                                    </div>
                                                )}
                                                {!outlet.phone && !outlet.whatsapp && (
                                                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>None provided</span>
                                                )}
                                            </td>

                                            {/* Timings */}
                                            <td style={{ padding: '0.875rem 1rem', verticalAlign: 'top' }}>
                                                <div style={{ fontSize: '0.8125rem', color: '#334155' }}>
                                                    {outlet.timings || (outlet.is_coming_soon ? 'Opening Soon' : 'Standard store hours')}
                                                </div>
                                                {outlet.expected_opening && (
                                                    <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 500 }}>
                                                        {outlet.expected_opening}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Products Count */}
                                            <td style={{ padding: '0.875rem 1rem', verticalAlign: 'top' }}>
                                                <Link
                                                    href={route('admin.outlets.show', outlet.id)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        padding: '0.25rem 0.65rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        background: '#FDF8F0',
                                                        color: '#8C6226',
                                                        border: '1px solid #E6D2B5',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <span>{outlet.products_count ?? 0} Products</span>
                                                </Link>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: '0.875rem 1rem', verticalAlign: 'top' }}>
                                                {getStatusBadge(outlet)}
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '0.875rem 1rem', verticalAlign: 'top', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    {/* Toggle Active status */}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleStatus(outlet.id)}
                                                        title={outlet.is_active ? 'Click to deactivate' : 'Click to activate'}
                                                        style={{
                                                            background: 'transparent',
                                                            border: '1px solid #CBD5E1',
                                                            borderRadius: '0.375rem',
                                                            padding: '0.35rem 0.5rem',
                                                            fontSize: '0.75rem',
                                                            cursor: 'pointer',
                                                            color: outlet.is_active ? '#059669' : '#64748B',
                                                        }}
                                                    >
                                                        {outlet.is_active ? 'Active' : 'Inactive'}
                                                    </button>

                                                    {/* Edit link */}
                                                    <Link
                                                        href={route('admin.outlets.edit', outlet.id)}
                                                        style={{
                                                            background: '#F1F5F9',
                                                            border: '1px solid #CBD5E1',
                                                            borderRadius: '0.375rem',
                                                            padding: '0.35rem 0.55rem',
                                                            color: '#0F172A',
                                                            fontSize: '0.75rem',
                                                            textDecoration: 'none',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Edit
                                                    </Link>

                                                    {/* Show/View link */}
                                                    <Link
                                                        href={route('admin.outlets.show', outlet.id)}
                                                        style={{
                                                            background: '#F1F5F9',
                                                            border: '1px solid #CBD5E1',
                                                            borderRadius: '0.375rem',
                                                            padding: '0.35rem 0.55rem',
                                                            color: '#0F172A',
                                                            fontSize: '0.75rem',
                                                            textDecoration: 'none',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        View
                                                    </Link>

                                                    {/* Delete button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(outlet)}
                                                        style={{
                                                            background: '#FEE2E2',
                                                            border: '1px solid #FCA5A5',
                                                            borderRadius: '0.375rem',
                                                            padding: '0.35rem 0.55rem',
                                                            color: '#DC2626',
                                                            fontSize: '0.75rem',
                                                            cursor: 'pointer',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <div style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#FEE2E2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#DC2626',
                            }}
                        >
                            <AlertIcon width="20" height="20" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>
                                Delete Outlet
                            </h3>
                            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                                {outletToDelete?.name}
                            </span>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        Are you sure you want to delete the outlet <strong>&ldquo;{outletToDelete?.name}&rdquo;</strong>? This action cannot be undone and will remove it from the store locations list.
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
                                color: '#334155',
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
                                padding: '0.5rem 1.25rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                background: '#DC2626',
                                color: '#FFFFFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Yes, Delete Outlet
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
