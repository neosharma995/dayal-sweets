import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { MapPinIcon, PhoneIcon, AlertIcon, TruckIcon, ClockIcon, BoxIcon, CartIcon } from '@/Components/Icons';

export default function Index({ outlets = [], filters = {}, stats = {} }) {
    const { activeOutletId } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [viewMode, setViewMode] = useState('table'); // Default to table format as requested
    const [expandedOutletIds, setExpandedOutletIds] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [outletToDelete, setOutletToDelete] = useState(null);

    const toggleExpand = (outletId) => {
        setExpandedOutletIds((prev) =>
            prev.includes(outletId) ? prev.filter((id) => id !== outletId) : [...prev, outletId]
        );
    };

    const handleSwitchContext = (outletId) => {
        router.post(
            route('admin.outlets.switch-context'),
            { outlet_id: outletId },
            { preserveScroll: true }
        );
    };

    const handleClearContext = () => {
        router.post(
            route('admin.outlets.clear-context'),
            {},
            { preserveScroll: true }
        );
    };

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

    const isAllExpanded = filteredOutlets.length > 0 && filteredOutlets.every((o) => expandedOutletIds.includes(o.id));

    const toggleExpandAll = () => {
        if (isAllExpanded) {
            setExpandedOutletIds([]);
        } else {
            setExpandedOutletIds(filteredOutlets.map((o) => o.id));
        }
    };

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
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        background: 'rgba(241, 245, 249, 0.95)',
                        color: '#475569',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8' }} />
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
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        background: 'rgba(254, 243, 199, 0.95)',
                        color: '#92400E',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D97706' }} />
                    Coming Soon
                </span>
            );
        }

        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    background: 'rgba(236, 253, 245, 0.95)',
                    color: '#065F46',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
            >
                <span
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#059669',
                        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.35)',
                    }}
                />
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

                        {/* Right Controls: Search, View Mode, Count */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {/* Search Input */}
                            <div style={{ position: 'relative', minWidth: '240px' }}>
                                <input
                                    type="text"
                                    placeholder="Search by name, city, address..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.45rem 0.75rem 0.45rem 2.25rem',
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

                            {/* View Switcher: Table (default) vs Cards */}
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    background: '#F1F5F9',
                                    borderRadius: '0.375rem',
                                    padding: '2px',
                                    border: '1px solid #E2E8F0',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setViewMode('table')}
                                    title="Table View (with Expandable Rows)"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                                        color: viewMode === 'table' ? '#B88E4B' : '#64748B',
                                        boxShadow: viewMode === 'table' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                    }}
                                >
                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 4h18v3H3V4zm0 6h18v3H3v-3zm0 6h18v3H3v-3z" />
                                    </svg>
                                    <span>Table</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('cards')}
                                    title="Modern Cards View"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: viewMode === 'cards' ? '#FFFFFF' : 'transparent',
                                        color: viewMode === 'cards' ? '#B88E4B' : '#64748B',
                                        boxShadow: viewMode === 'cards' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                    }}
                                >
                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm11 0h7v7h-7v-7z" />
                                    </svg>
                                    <span>Cards</span>
                                </button>
                            </div>

                            {/* Expand / Collapse All (when in table mode) */}
                            {viewMode === 'table' && filteredOutlets.length > 0 && (
                                <button
                                    type="button"
                                    onClick={toggleExpandAll}
                                    style={{
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '0.375rem',
                                        background: '#FFFFFF',
                                        border: '1px solid #CBD5E1',
                                        color: '#334155',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isAllExpanded ? 'Collapse All ▲' : 'Expand All ▼'}
                                </button>
                            )}

                            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                                Showing <strong>{filteredOutlets.length}</strong> of {outlets.length}
                            </span>
                        </div>
                    </div>

                    {/* Responsive Grid & Modern Card Styles */}
                    <style>{`
                        .dayal-outlets-modern-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
                            gap: 1.5rem;
                            padding: 1.25rem 0;
                            box-sizing: border-box;
                        }
                        @media (max-width: 640px) {
                            .dayal-outlets-modern-grid {
                                grid-template-columns: 1fr !important;
                                gap: 1rem !important;
                            }
                        }
                        .dayal-outlet-modern-card {
                            background: #FFFFFF;
                            border-radius: 1rem;
                            border: 1px solid #E2E8F0;
                            overflow: hidden;
                            display: flex;
                            flex-direction: column;
                            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
                            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                            position: relative;
                        }
                        .dayal-outlet-modern-card:hover {
                            transform: translateY(-5px);
                            box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
                            border-color: #CBD5E1;
                        }
                        .dayal-outlet-modern-card--active-context {
                            border-color: #10B981 !important;
                            background-color: #ECFDF5 !important;
                            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25), 0 16px 24px -4px rgba(16, 185, 129, 0.12) !important;
                        }
                        .dayal-card-zoom-img {
                            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                        .dayal-outlet-modern-card:hover .dayal-card-zoom-img {
                            transform: scale(1.05);
                        }
                    `}</style>

                    {/* Empty State */}
                    {filteredOutlets.length === 0 ? (
                        <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                <MapPinIcon width="44" height="44" style={{ color: '#CBD5E1' }} />
                                <div>
                                    <p style={{ fontWeight: 700, color: '#334155', fontSize: '1.05rem', margin: 0 }}>No outlets found</p>
                                    <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                                        {search ? 'Try clearing your search filters' : 'Get started by creating your first outlet location.'}
                                    </p>
                                </div>
                                <Link
                                    href={route('admin.outlets.create')}
                                    style={{
                                        marginTop: '0.5rem',
                                        padding: '0.5rem 1.25rem',
                                        background: '#B88E4B',
                                        color: '#FFFFFF',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.8125rem',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 4px rgba(184, 142, 75, 0.25)',
                                    }}
                                >
                                    + Add First Outlet
                                </Link>
                            </div>
                        </div>
                    ) : viewMode === 'cards' ? (
                        /* Modern Spacious Outlet Cards Grid */
                        <div className="dayal-outlets-modern-grid">
                            {filteredOutlets.map((outlet) => {
                                const isActiveContext = Number(activeOutletId) === Number(outlet.id);

                                return (
                                    <div
                                        key={outlet.id}
                                        className={`dayal-outlet-modern-card ${isActiveContext ? 'dayal-outlet-modern-card--active-context' : ''}`}
                                    >
                                        {/* Card Visual Header / Image Banner (185px) */}
                                        <div
                                            style={{
                                                position: 'relative',
                                                height: '185px',
                                                background: 'linear-gradient(135deg, #FBF6EE 0%, #F5E8D3 100%)',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {outlet.image_url || outlet.image ? (
                                                <img
                                                    src={outlet.image_url || outlet.image}
                                                    alt={outlet.name}
                                                    className="dayal-card-zoom-img"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ textAlign: 'center', color: '#B88E4B' }}>
                                                    <MapPinIcon width="44" height="44" style={{ opacity: 0.75 }} />
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.35rem', opacity: 0.85 }}>
                                                        Dayal Sweets
                                                    </div>
                                                </div>
                                            )}

                                            {/* Gradient Scrim for crisp text readability */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.3) 100%)',
                                                    pointerEvents: 'none',
                                                }}
                                            />

                                            {/* Top Badges Overlay */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '0.75rem',
                                                    left: '0.75rem',
                                                    zIndex: 2,
                                                }}
                                            >
                                                {/* Status Badge */}
                                                <div>
                                                    {getStatusBadge(outlet)}
                                                </div>
                                            </div>

                                            {/* Bottom Overlay Pill: City & State */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '0.75rem',
                                                    left: '0.75rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    background: 'rgba(15, 23, 42, 0.75)',
                                                    backdropFilter: 'blur(8px)',
                                                    color: '#FFFFFF',
                                                    padding: '0.25rem 0.65rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.725rem',
                                                    fontWeight: 600,
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    zIndex: 2,
                                                }}
                                            >
                                                <MapPinIcon width="12" height="12" style={{ color: '#FCD34D' }} />
                                                <span>{outlet.city || 'Himachal'}{outlet.state ? `, ${outlet.state}` : ''}</span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.85rem' }}>
                                            {/* Title & Subtitle */}
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                                                    <Link
                                                        href={route('admin.outlets.show', outlet.id)}
                                                        style={{
                                                            margin: 0,
                                                            fontSize: '1.15rem',
                                                            fontWeight: 700,
                                                            color: '#0F172A',
                                                            lineHeight: 1.3,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        {outlet.name}
                                                    </Link>
                                                </div>
                                                {outlet.subtitle && !outlet.subtitle.toLowerCase().includes('storefront') && (
                                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8125rem', color: '#B88E4B', fontStyle: 'italic', fontWeight: 500 }}>
                                                        {outlet.subtitle}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Location Info Box */}
                                            <div
                                                style={{
                                                    background: '#F8FAFC',
                                                    border: '1px solid #F1F5F9',
                                                    borderRadius: '0.625rem',
                                                    padding: '0.75rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.4rem',
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.8125rem', color: '#334155', lineHeight: 1.45 }}>
                                                    <MapPinIcon width="14" height="14" style={{ color: '#B88E4B', marginTop: '2px', flexShrink: 0 }} />
                                                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                                                        {outlet.address || 'Address not configured'}
                                                    </span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
                                                    {outlet.pincode && (
                                                        <span style={{ fontSize: '0.6875rem', color: '#64748B', background: '#FFFFFF', padding: '0.15rem 0.45rem', borderRadius: '0.25rem', border: '1px solid #E2E8F0', fontWeight: 600 }}>
                                                            PIN: {outlet.pincode}
                                                        </span>
                                                    )}
                                                    {outlet.map_url && (
                                                        <a
                                                            href={outlet.map_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                fontSize: '0.75rem',
                                                                color: '#B88E4B',
                                                                fontWeight: 600,
                                                                textDecoration: 'none',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.25rem',
                                                                marginLeft: 'auto',
                                                            }}
                                                        >
                                                            <span>View Map</span>
                                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Contact & Hours Quick Strip */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                                                {outlet.phone && (
                                                    <a
                                                        href={`tel:${outlet.phone}`}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem',
                                                            padding: '0.25rem 0.55rem',
                                                            borderRadius: '0.375rem',
                                                            background: '#F1F5F9',
                                                            color: '#334155',
                                                            textDecoration: 'none',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        <PhoneIcon width="12" height="12" style={{ color: '#64748B' }} />
                                                        <span>{outlet.phone}</span>
                                                    </a>
                                                )}
                                                {outlet.whatsapp && (
                                                    <a
                                                        href={`https://wa.me/${outlet.whatsapp_raw || outlet.whatsapp.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem',
                                                            padding: '0.25rem 0.55rem',
                                                            borderRadius: '0.375rem',
                                                            background: '#ECFDF5',
                                                            color: '#065F46',
                                                            border: '1px solid #A7F3D0',
                                                            textDecoration: 'none',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                                                        <span>WA</span>
                                                    </a>
                                                )}
                                                {outlet.timings && (
                                                    <span
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem',
                                                            color: '#64748B',
                                                            fontSize: '0.725rem',
                                                            marginLeft: 'auto',
                                                        }}
                                                        title={outlet.timings}
                                                    >
                                                        <ClockIcon width="12" height="12" />
                                                        <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {outlet.timings}
                                                        </span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Modern 3-Column Metrics Strip */}
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                                    gap: '0.5rem',
                                                    background: '#FDF8F0',
                                                    border: '1px solid #F3EDE4',
                                                    borderRadius: '0.625rem',
                                                    padding: '0.65rem 0.5rem',
                                                    textAlign: 'center',
                                                    marginTop: 'auto',
                                                }}
                                            >
                                                <Link
                                                    href={route('admin.outlets.show', outlet.id)}
                                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                                    title="Products assigned to this outlet"
                                                >
                                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#8C6226' }}>
                                                        {outlet.products_count ?? 0}
                                                    </div>
                                                    <div style={{ fontSize: '0.6875rem', color: '#A17D49', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                                        Products
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={route('admin.outlets.show', outlet.id)}
                                                    style={{ textDecoration: 'none', color: 'inherit', borderLeft: '1px solid #E6D2B5', borderRight: '1px solid #E6D2B5' }}
                                                    title="Orders routed to this outlet"
                                                >
                                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E40AF' }}>
                                                        {outlet.orders_count ?? 0}
                                                    </div>
                                                    <div style={{ fontSize: '0.6875rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                                        Orders
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={route('admin.outlets.shipping-zones.index', outlet.id)}
                                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                                    title="Shipping zones configured for this outlet"
                                                >
                                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                                                        {outlet.shipping_zones_count ?? 0}
                                                    </div>
                                                    <div style={{ fontSize: '0.6875rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                                        Zones
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Card Footer Toolbar */}
                                        <div
                                            style={{
                                                padding: '0.75rem 1.25rem',
                                                background: '#FAFAFA',
                                                borderTop: '1px solid #F1F5F9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '0.5rem',
                                            }}
                                        >
                                            {/* Quick Toggle Status */}
                                            <button
                                                type="button"
                                                onClick={() => toggleStatus(outlet.id)}
                                                style={{
                                                    border: outlet.is_active ? '1px solid #A7F3D0' : '1px solid #CBD5E1',
                                                    background: outlet.is_active ? '#ECFDF5' : '#FFFFFF',
                                                    color: outlet.is_active ? '#065F46' : '#64748B',
                                                    padding: '0.35rem 0.65rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.725rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                }}
                                            >
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: outlet.is_active ? '#059669' : '#94A3B8' }} />
                                                <span>{outlet.is_active ? 'Active' : 'Inactive'}</span>
                                            </button>

                                            {/* Primary Manage & Action Icons */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Link
                                                    href={route('admin.outlets.show', outlet.id)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        padding: '0.35rem 0.85rem',
                                                        borderRadius: '0.375rem',
                                                        background: '#B88E4B',
                                                        color: '#FFFFFF',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        textDecoration: 'none',
                                                        boxShadow: '0 1px 2px rgba(184, 142, 75, 0.25)',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    <span>Manage Hub</span>
                                                    <span>&rarr;</span>
                                                </Link>

                                                <Link
                                                    href={route('admin.outlets.edit', outlet.id)}
                                                    title="Edit Outlet"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '30px',
                                                        height: '30px',
                                                        borderRadius: '0.375rem',
                                                        background: '#FFFFFF',
                                                        border: '1px solid #CBD5E1',
                                                        color: '#334155',
                                                        textDecoration: 'none',
                                                        fontSize: '0.8125rem',
                                                    }}
                                                >
                                                    ✎
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(outlet)}
                                                    title="Delete Outlet"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '30px',
                                                        height: '30px',
                                                        borderRadius: '0.375rem',
                                                        background: '#FEF2F2',
                                                        border: '1px solid #FECACA',
                                                        color: '#DC2626',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8125rem',
                                                    }}
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Modern Table View with Expandable Rows */
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #E2E8F0', background: '#F8FAFC' }}>
                                        <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', width: '76px' }}>
                                            Image
                                        </th>
                                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                            Outlet / Description
                                        </th>
                                        <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                                            Products
                                        </th>
                                        <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                                            Orders
                                        </th>
                                        <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                                            Zones
                                        </th>
                                        <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                                            Status
                                        </th>
                                        <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                                            Actions
                                        </th>
                                        <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', width: '110px' }}>
                                            Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOutlets.map((outlet) => {
                                        const isExpanded = expandedOutletIds.includes(outlet.id);
                                        const isActiveContext = Number(activeOutletId) === Number(outlet.id);

                                        return (
                                            <React.Fragment key={outlet.id}>
                                                <tr
                                                    style={{
                                                        borderBottom: isActiveContext
                                                            ? '1px solid #A7F3D0'
                                                            : isExpanded
                                                            ? '1px dashed #E2E8F0'
                                                            : '1px solid #F1F5F9',
                                                        background: isActiveContext
                                                            ? '#ECFDF5'
                                                            : isExpanded
                                                            ? '#FFFDF9'
                                                            : 'transparent',
                                                        transition: 'background-color 0.15s ease',
                                                    }}
                                                >
                                                    {/* 1. Image */}
                                                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                                                        <div
                                                            style={{
                                                                width: '56px',
                                                                height: '42px',
                                                                borderRadius: '0.5rem',
                                                                overflow: 'hidden',
                                                                background: '#F8FAFC',
                                                                border: '1px solid #E2E8F0',
                                                                flexShrink: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
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
                                                                <MapPinIcon width="20" height="20" style={{ color: '#B88E4B' }} />
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* 2. Name / Description */}
                                                    <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle', maxWidth: '340px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            <Link
                                                                href={route('admin.outlets.show', outlet.id)}
                                                                style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem', textDecoration: 'none' }}
                                                            >
                                                                {outlet.name}
                                                            </Link>
                                                        </div>
                                                        {outlet.subtitle && !outlet.subtitle.toLowerCase().includes('storefront') && (
                                                            <div style={{ fontSize: '0.75rem', color: '#B88E4B', fontStyle: 'italic', fontWeight: 500, marginTop: '0.15rem' }}>
                                                                {outlet.subtitle}
                                                            </div>
                                                        )}
                                                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {outlet.city ? `${outlet.city} • ` : ''}{outlet.address}
                                                        </div>
                                                    </td>

                                                    {/* 3. Products Count */}
                                                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                                        <Link
                                                            href={route('admin.outlets.show', outlet.id)}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.35rem',
                                                                padding: '0.25rem 0.65rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700,
                                                                background: '#FDF8F0',
                                                                color: '#8C6226',
                                                                border: '1px solid #E6D2B5',
                                                                textDecoration: 'none',
                                                                transition: 'all 0.15s ease',
                                                            }}
                                                            title={`View ${outlet.name} products`}
                                                        >
                                                            <BoxIcon width="13" height="13" />
                                                            <span>{outlet.products_count ?? 0}</span>
                                                        </Link>
                                                    </td>

                                                    {/* 4. Orders Count */}
                                                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                                        <Link
                                                            href={route('admin.outlets.show', outlet.id)}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.35rem',
                                                                padding: '0.25rem 0.65rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700,
                                                                background: '#EFF6FF',
                                                                color: '#1D4ED8',
                                                                border: '1px solid #BFDBFE',
                                                                textDecoration: 'none',
                                                                transition: 'all 0.15s ease',
                                                            }}
                                                            title={`View ${outlet.name} orders`}
                                                        >
                                                            <CartIcon width="13" height="13" />
                                                            <span>{outlet.orders_count ?? 0}</span>
                                                        </Link>
                                                    </td>

                                                    {/* 5. Zones Count */}
                                                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                                        <Link
                                                            href={route('admin.outlets.shipping-zones.index', outlet.id)}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.35rem',
                                                                padding: '0.25rem 0.65rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700,
                                                                background: '#ECFDF5',
                                                                color: '#047857',
                                                                border: '1px solid #A7F3D0',
                                                                textDecoration: 'none',
                                                                transition: 'all 0.15s ease',
                                                            }}
                                                            title={`Manage delivery zones for ${outlet.name}`}
                                                        >
                                                            <TruckIcon width="13" height="13" />
                                                            <span>{outlet.shipping_zones_count ?? 0}</span>
                                                        </Link>
                                                    </td>

                                                    {/* 6. Status Toggle */}
                                                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleStatus(outlet.id)}
                                                            style={{
                                                                border: 'none',
                                                                background: 'transparent',
                                                                cursor: 'pointer',
                                                                padding: 0,
                                                            }}
                                                            title={outlet.is_active ? 'Click to deactivate' : 'Click to activate'}
                                                        >
                                                            {getStatusBadge(outlet)}
                                                        </button>
                                                    </td>

                                                    {/* 7. Actions (View, Edit, Delete) */}
                                                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                                            {/* View / Hub */}
                                                            <Link
                                                                href={route('admin.outlets.show', outlet.id)}
                                                                style={{
                                                                    padding: '0.35rem 0.65rem',
                                                                    borderRadius: '0.375rem',
                                                                    background: '#B88E4B',
                                                                    color: '#FFFFFF',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 700,
                                                                    textDecoration: 'none',
                                                                    boxShadow: '0 1px 2px rgba(184, 142, 75, 0.2)',
                                                                }}
                                                                title="View Outlet Hub"
                                                            >
                                                                View
                                                            </Link>

                                                            {/* Edit */}
                                                            <Link
                                                                href={route('admin.outlets.edit', outlet.id)}
                                                                style={{
                                                                    padding: '0.35rem 0.65rem',
                                                                    borderRadius: '0.375rem',
                                                                    background: '#F8FAFC',
                                                                    border: '1px solid #CBD5E1',
                                                                    color: '#334155',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    textDecoration: 'none',
                                                                }}
                                                                title="Edit Store Details"
                                                            >
                                                                Edit
                                                            </Link>

                                                            {/* Delete */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteClick(outlet)}
                                                                style={{
                                                                    padding: '0.35rem 0.65rem',
                                                                    borderRadius: '0.375rem',
                                                                    background: '#FEF2F2',
                                                                    border: '1px solid #FECACA',
                                                                    color: '#DC2626',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    cursor: 'pointer',
                                                                }}
                                                                title="Delete Outlet"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>

                                                    {/* 8. Expand Button */}
                                                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleExpand(outlet.id)}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '0.35rem',
                                                                padding: '0.35rem 0.75rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700,
                                                                cursor: 'pointer',
                                                                border: isExpanded ? '1px solid #B88E4B' : '1px solid #CBD5E1',
                                                                background: isExpanded ? '#B88E4B' : '#FFFFFF',
                                                                color: isExpanded ? '#FFFFFF' : '#334155',
                                                                boxShadow: isExpanded ? '0 1px 3px rgba(184, 142, 75, 0.25)' : 'none',
                                                                transition: 'all 0.15s ease',
                                                            }}
                                                            title={isExpanded ? 'Collapse info' : 'Expand full store information'}
                                                        >
                                                            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                                                            <span style={{ fontSize: '0.65rem' }}>{isExpanded ? '▲' : '▼'}</span>
                                                        </button>
                                                    </td>
                                                </tr>

                                                {/* EXPANDABLE ROW (Location & Contact Details) */}
                                                {isExpanded && (
                                                    <tr style={{ background: isActiveContext ? '#ECFDF5' : '#FAF8F5', borderBottom: '2px solid #E2E8F0' }}>
                                                        <td colSpan={8} style={{ padding: '1rem 1.5rem' }}>
                                                            <div
                                                                style={{
                                                                    background: '#FFFFFF',
                                                                    border: '1px solid #E2E8F0',
                                                                    borderRadius: '0.75rem',
                                                                    padding: '1.25rem 1.5rem',
                                                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                                                                }}
                                                            >
                                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
                                                                    {/* Panel 1: Location & Google Maps */}
                                                                    <div>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem', color: '#B88E4B', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                            <MapPinIcon width="16" height="16" />
                                                                            <span>Location &amp; Address</span>
                                                                        </div>
                                                                        <p style={{ margin: '0 0 0.65rem', fontSize: '0.875rem', color: '#1E293B', lineHeight: 1.5, fontWeight: 500 }}>
                                                                            {outlet.address || 'No address specified'}
                                                                        </p>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                                                                            <span style={{ fontSize: '0.75rem', color: '#475569', background: '#F1F5F9', padding: '0.25rem 0.6rem', borderRadius: '0.375rem', fontWeight: 600 }}>
                                                                                {outlet.city ? `${outlet.city}, ` : ''}{outlet.state || 'Himachal Pradesh'}
                                                                            </span>
                                                                            {outlet.pincode && (
                                                                                <span style={{ fontSize: '0.75rem', color: '#8C6226', background: '#FDF8F0', border: '1px solid #E6D2B5', padding: '0.25rem 0.6rem', borderRadius: '0.375rem', fontWeight: 600 }}>
                                                                                    PIN: {outlet.pincode}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {outlet.map_url ? (
                                                                            <a
                                                                                href={outlet.map_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                style={{
                                                                                    display: 'inline-flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '0.4rem',
                                                                                    padding: '0.4rem 0.85rem',
                                                                                    borderRadius: '0.375rem',
                                                                                    background: '#F8FAFC',
                                                                                    border: '1px solid #CBD5E1',
                                                                                    color: '#334155',
                                                                                    fontSize: '0.775rem',
                                                                                    fontWeight: 600,
                                                                                    textDecoration: 'none',
                                                                                    transition: 'all 0.15s ease',
                                                                                }}
                                                                            >
                                                                                <span>Open in Google Maps</span>
                                                                                <span>↗</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>No Google Maps link added</span>
                                                                        )}
                                                                    </div>

                                                                    {/* Panel 2: Contact Info & Store Timings */}
                                                                    <div>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem', color: '#B88E4B', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                            <PhoneIcon width="16" height="16" />
                                                                            <span>Contact &amp; Store Timings</span>
                                                                        </div>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                                <span style={{ color: '#64748B', fontSize: '0.8125rem', minWidth: '75px', fontWeight: 500 }}>Phone:</span>
                                                                                {outlet.phone ? (
                                                                                    <a href={`tel:${outlet.phone}`} style={{ color: '#0F172A', fontWeight: 600, textDecoration: 'none' }}>
                                                                                        {outlet.phone}
                                                                                    </a>
                                                                                ) : (
                                                                                    <span style={{ color: '#94A3B8' }}>—</span>
                                                                                )}
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                                <span style={{ color: '#64748B', fontSize: '0.8125rem', minWidth: '75px', fontWeight: 500 }}>WhatsApp:</span>
                                                                                {outlet.whatsapp ? (
                                                                                    <a
                                                                                        href={`https://wa.me/${outlet.whatsapp_raw || outlet.whatsapp.replace(/\D/g, '')}`}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        style={{ color: '#059669', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                                                                    >
                                                                                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                                                                                        <span>{outlet.whatsapp}</span>
                                                                                    </a>
                                                                                ) : (
                                                                                    <span style={{ color: '#94A3B8' }}>—</span>
                                                                                )}
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                                <span style={{ color: '#64748B', fontSize: '0.8125rem', minWidth: '75px', fontWeight: 500 }}>Timings:</span>
                                                                                <span style={{ color: '#334155', fontWeight: 500 }}>
                                                                                    {outlet.timings || 'Standard Operating Hours'}
                                                                                </span>
                                                                            </div>
                                                                            {outlet.expected_opening && (
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                                    <span style={{ color: '#D97706', fontSize: '0.8125rem', minWidth: '75px', fontWeight: 600 }}>Note:</span>
                                                                                    <span style={{ color: '#D97706', fontWeight: 600 }}>
                                                                                        {outlet.expected_opening}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
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
