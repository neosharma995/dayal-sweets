import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { MapPinIcon, PhoneIcon, AlertIcon, TruckIcon } from '@/Components/Icons';

export default function Index({ outlets = [], filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' (default 4x4) or 'table'
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

                            {/* View Switcher: Cards vs Table */}
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
                                    onClick={() => setViewMode('cards')}
                                    title="Modern 4x4 Cards View"
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
                                    <span>Cards (4x4)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('table')}
                                    title="Table View"
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
                            </div>

                            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                                Showing <strong>{filteredOutlets.length}</strong> of {outlets.length}
                            </span>
                        </div>
                    </div>

                    {/* Responsive Grid & Modern Card Styles */}
                    <style>{`
                        .dayal-outlets-4-grid {
                            display: grid;
                            grid-template-columns: repeat(4, minmax(0, 1fr));
                            gap: 1.25rem;
                            padding: 1.25rem;
                            box-sizing: border-box;
                        }
                        @media (max-width: 1400px) {
                            .dayal-outlets-4-grid {
                                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                                gap: 1rem !important;
                                padding: 1rem !important;
                            }
                        }
                        @media (max-width: 1024px) {
                            .dayal-outlets-4-grid {
                                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                            }
                        }
                        @media (max-width: 640px) {
                            .dayal-outlets-4-grid {
                                grid-template-columns: 1fr !important;
                                padding: 0.75rem !important;
                            }
                        }
                        .dayal-outlet-modern-card {
                            background: #FFFFFF;
                            border-radius: 0.875rem;
                            border: 1px solid #E2E8F0;
                            overflow: hidden;
                            display: flex;
                            flex-direction: column;
                            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
                            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
                            position: relative;
                        }
                        .dayal-outlet-modern-card:hover {
                            transform: translateY(-4px);
                            box-shadow: 0 16px 28px -6px rgba(15, 23, 42, 0.1), 0 4px 10px -2px rgba(15, 23, 42, 0.04);
                            border-color: #CBD5E1;
                        }
                        .dayal-outlet-modern-card:hover .dayal-card-zoom-img {
                            transform: scale(1.06);
                        }
                        .dayal-card-zoom-img {
                            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                        .dayal-card-action-btn {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            gap: 0.25rem;
                            padding: 0.35rem 0.65rem;
                            border-radius: 0.375rem;
                            font-size: 0.75rem;
                            font-weight: 600;
                            text-decoration: none;
                            transition: all 0.15s ease;
                            border: 1px solid #CBD5E1;
                            background: #FFFFFF;
                            color: #334155;
                            cursor: pointer;
                        }
                        .dayal-card-action-btn:hover {
                            background: #F8FAFC;
                            border-color: #94A3B8;
                            color: #0F172A;
                        }
                        .dayal-card-action-delete:hover {
                            background: #FEF2F2 !important;
                            border-color: #FCA5A5 !important;
                            color: #DC2626 !important;
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
                        /* Modern 4 4 4 Cards Grid */
                        <div className="dayal-outlets-4-grid">
                            {filteredOutlets.map((outlet) => (
                                <div key={outlet.id} className="dayal-outlet-modern-card">
                                    {/* Card Visual Header / Image Banner */}
                                    <div
                                        style={{
                                            position: 'relative',
                                            height: '155px',
                                            background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EADB 100%)',
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
                                                <MapPinIcon width="40" height="40" style={{ opacity: 0.75 }} />
                                                <div style={{ fontSize: '0.725rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.25rem', opacity: 0.85 }}>
                                                    Dayal Sweets
                                                </div>
                                            </div>
                                        )}

                                        {/* Subtle Dark Gradient Overlay at Bottom */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.55) 0%, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.25) 100%)',
                                                pointerEvents: 'none',
                                            }}
                                        />

                                        {/* Top Badges Overlay */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '0.65rem',
                                                left: '0.65rem',
                                                right: '0.65rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                pointerEvents: 'none',
                                                zIndex: 2,
                                            }}
                                        >
                                            {/* ID & Flagship Badge */}
                                            <div style={{ display: 'flex', gap: '0.35rem', pointerEvents: 'auto' }}>
                                                <span
                                                    style={{
                                                        background: 'rgba(15, 23, 42, 0.75)',
                                                        color: '#FFFFFF',
                                                        padding: '0.2rem 0.5rem',
                                                        borderRadius: '0.375rem',
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.04em',
                                                        backdropFilter: 'blur(6px)',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    }}
                                                >
                                                    #{outlet.id}
                                                </span>
                                                {outlet.is_flagship && (
                                                    <span
                                                        style={{
                                                            background: 'linear-gradient(135deg, #B88E4B 0%, #D4AF37 100%)',
                                                            color: '#FFFFFF',
                                                            padding: '0.2rem 0.55rem',
                                                            borderRadius: '0.375rem',
                                                            fontSize: '0.6875rem',
                                                            fontWeight: 700,
                                                            letterSpacing: '0.02em',
                                                            boxShadow: '0 2px 6px rgba(184, 142, 75, 0.4)',
                                                        }}
                                                    >
                                                        ★ Flagship
                                                    </span>
                                                )}
                                            </div>

                                            {/* Status Badge */}
                                            <div style={{ pointerEvents: 'auto' }}>
                                                {getStatusBadge(outlet)}
                                            </div>
                                        </div>

                                        {/* Bottom Overlay Pill: City */}
                                        {outlet.city && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '0.6rem',
                                                    left: '0.65rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem',
                                                    background: 'rgba(15, 23, 42, 0.75)',
                                                    backdropFilter: 'blur(6px)',
                                                    color: '#FFFFFF',
                                                    padding: '0.2rem 0.55rem',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                                    zIndex: 2,
                                                }}
                                            >
                                                <MapPinIcon width="11" height="11" style={{ color: '#FCD34D' }} />
                                                <span>{outlet.city}{outlet.state ? `, ${outlet.state}` : ''}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content Body */}
                                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.65rem' }}>
                                        {/* Title & Subtitle */}
                                        <div>
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    fontSize: '1.025rem',
                                                    fontWeight: 700,
                                                    color: '#0F172A',
                                                    lineHeight: 1.35,
                                                }}
                                            >
                                                {outlet.name}
                                            </h3>
                                            {outlet.subtitle && (
                                                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                                                    {outlet.subtitle}
                                                </p>
                                            )}
                                        </div>

                                        {/* Address & Direct Map Link */}
                                        <div style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.45 }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                                                <MapPinIcon width="14" height="14" style={{ color: '#B88E4B', marginTop: '2px', flexShrink: 0 }} />
                                                <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                                                    {outlet.address || 'Address not configured'}
                                                </span>
                                            </div>
                                            <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', flexWrap: 'wrap' }}>
                                                {outlet.pincode && (
                                                    <span style={{ fontSize: '0.7rem', color: '#64748B', background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontWeight: 600 }}>
                                                        PIN: {outlet.pincode}
                                                    </span>
                                                )}
                                                {outlet.map_url && (
                                                    <a
                                                        href={outlet.map_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            fontSize: '0.72rem',
                                                            color: '#B88E4B',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.2rem',
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

                                        {/* Contact & Hours Info Strip */}
                                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.75rem', color: '#475569' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {outlet.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                        <PhoneIcon width="12" height="12" style={{ color: '#64748B' }} />
                                                        <a href={`tel:${outlet.phone}`} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600, fontSize: '0.75rem' }}>
                                                            {outlet.phone}
                                                        </a>
                                                    </div>
                                                )}
                                                {outlet.whatsapp && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#059669', fontSize: '0.72rem', fontWeight: 600 }}>
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                                                        <span>WA: {outlet.whatsapp}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B' }}>
                                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                    <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
                                                </svg>
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.72rem' }}>
                                                    {outlet.timings || (outlet.is_coming_soon ? 'Opening Soon' : 'Standard store hours')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Micro-Metrics Segmented Bar (Products & Shipping Zones) */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                                            <Link
                                                href={route('admin.outlets.show', outlet.id)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.35rem',
                                                    padding: '0.45rem 0.5rem',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.725rem',
                                                    fontWeight: 600,
                                                    background: '#FDF8F0',
                                                    color: '#8C6226',
                                                    border: '1px solid #E6D2B5',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                title={`View ${outlet.name} details & products`}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                                    <line x1="12" y1="22.08" x2="12" y2="12" />
                                                </svg>
                                                <span>{outlet.products_count ?? 0} Products</span>
                                            </Link>

                                            <Link
                                                href={route('admin.outlets.shipping-zones.index', outlet.id)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.35rem',
                                                    padding: '0.45rem 0.5rem',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.725rem',
                                                    fontWeight: 600,
                                                    background: '#EFF6FF',
                                                    color: '#1D4ED8',
                                                    border: '1px solid #BFDBFE',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                title={`Manage delivery zones for ${outlet.name}`}
                                            >
                                                <TruckIcon width="12" height="12" />
                                                <span>{outlet.shipping_zones_count ?? 0} Zones</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Card Footer Actions */}
                                    <div
                                        style={{
                                            padding: '0.65rem 0.85rem',
                                            background: '#F8FAFC',
                                            borderTop: '1px solid #E2E8F0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '0.4rem',
                                        }}
                                    >
                                        {/* Quick Active Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => toggleStatus(outlet.id)}
                                            title={outlet.is_active ? 'Click to deactivate outlet' : 'Click to activate outlet'}
                                            style={{
                                                padding: '0.3rem 0.6rem',
                                                borderRadius: '0.375rem',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                border: outlet.is_active ? '1px solid #A7F3D0' : '1px solid #CBD5E1',
                                                background: outlet.is_active ? '#ECFDF5' : '#FFFFFF',
                                                color: outlet.is_active ? '#065F46' : '#64748B',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: outlet.is_active ? '#059669' : '#94A3B8',
                                                }}
                                            />
                                            <span>{outlet.is_active ? 'Active' : 'Inactive'}</span>
                                        </button>

                                        {/* Action buttons (View, Edit, Delete) */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Link
                                                href={route('admin.outlets.show', outlet.id)}
                                                className="dayal-card-action-btn"
                                                title="View Details"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                <span>View</span>
                                            </Link>

                                            <Link
                                                href={route('admin.outlets.edit', outlet.id)}
                                                className="dayal-card-action-btn"
                                                title="Edit Outlet"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                                <span>Edit</span>
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick(outlet)}
                                                className="dayal-card-action-btn dayal-card-action-delete"
                                                title="Delete Outlet"
                                                style={{ color: '#DC2626', borderColor: '#FECACA', background: '#FEF2F2' }}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Table View */
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
                                            Shipping Zones
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
                                    {filteredOutlets.map((outlet) => (
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

                                            {/* Shipping Zones Count */}
                                            <td style={{ padding: '0.875rem 1rem', verticalAlign: 'top' }}>
                                                <Link
                                                    href={route('admin.outlets.shipping-zones.index', outlet.id)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        padding: '0.25rem 0.65rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        background: '#EFF6FF',
                                                        color: '#1D4ED8',
                                                        border: '1px solid #BFDBFE',
                                                        textDecoration: 'none',
                                                    }}
                                                    title={`Manage delivery zones for ${outlet.name}`}
                                                >
                                                    <TruckIcon width="13" height="13" />
                                                    <span>{outlet.shipping_zones_count ?? 0} Zones</span>
                                                </Link>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: '0.875rem 1rem', verticalAlign: 'top' }}>
                                                {getStatusBadge(outlet)}
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '0.875rem 1rem', verticalAlign: 'top', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    {/* Manage Shipping Zones */}
                                                    <Link
                                                        href={route('admin.outlets.shipping-zones.index', outlet.id)}
                                                        title="Manage Delivery Zones"
                                                        style={{
                                                            background: '#EFF6FF',
                                                            border: '1px solid #BFDBFE',
                                                            borderRadius: '0.375rem',
                                                            padding: '0.35rem 0.55rem',
                                                            color: '#1D4ED8',
                                                            fontSize: '0.75rem',
                                                            textDecoration: 'none',
                                                            fontWeight: 600,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                        }}
                                                    >
                                                        <TruckIcon width="13" height="13" />
                                                        <span>Zones</span>
                                                    </Link>

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
                                    ))}
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
