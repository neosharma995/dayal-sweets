import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import QrCodeSvg from '@/Components/QrCodeSvg';
import Pagination from '@/Components/Pagination';

export default function Scanners({ tables = [], outlets = [], locations = [], filters = {} }) {
    const [outletFilter, setOutletFilter] = useState(filters.outlet_id || 'all');
    const [locationFilter, setLocationFilter] = useState(filters.location || 'all');
    const [copiedId, setCopiedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    const totalPages = Math.ceil(tables.length / itemsPerPage) || 1;
    const paginatedTables = useMemo(() => {
        const safePage = Math.min(currentPage, totalPages);
        const start = (safePage - 1) * itemsPerPage;
        return tables.slice(start, start + itemsPerPage);
    }, [tables, currentPage, itemsPerPage, totalPages]);

    const handleFilterChange = (nextOutlet, nextLocation) => {
        router.get(
            route('admin.tables.scanners'),
            {
                outlet_id: nextOutlet,
                location: nextLocation,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleCopy = (table) => {
        const url = `${window.location.origin}/scan/${table.qr_token}`;
        navigator.clipboard?.writeText(url);
        setCopiedId(table.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <AdminLayout
            header={
                <div>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Table QR Scanners &amp; Printable Standees
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.15rem 0 0' }}>
                        Print table standee QR cards or click any scanner to test the customer dine-in ordering panel
                    </p>
                </div>
            }
        >
            <Head title="Table QR Scanners - Admin" />

            {/* Toolbar */}
            <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '1rem 1.25rem', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
                    <select
                        value={outletFilter}
                        onChange={(e) => {
                            setOutletFilter(e.target.value);
                            handleFilterChange(e.target.value, locationFilter);
                        }}
                        style={{ padding: '0.55rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.86rem', fontWeight: 600 }}
                    >
                        <option value="all">All Outlets</option>
                        {outlets.map((o) => (
                            <option key={o.id} value={o.id}>{o.name} ({o.city})</option>
                        ))}
                    </select>

                    <select
                        value={locationFilter}
                        onChange={(e) => {
                            setLocationFilter(e.target.value);
                            handleFilterChange(outletFilter, e.target.value);
                        }}
                        style={{ padding: '0.55rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.86rem' }}
                    >
                        <option value="all">All Floor / Hall Locations</option>
                        {locations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <Link
                        href={route('admin.tables.index')}
                        style={{ padding: '0.55rem 1rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', color: '#334155', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                        ← Manage Tables
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        style={{ padding: '0.55rem 1.15rem', borderRadius: '0.5rem', background: '#5A1E1E', color: '#FFFFFF', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                        🖨️ Print All QR Standees ({tables.length})
                    </button>
                </div>
            </div>

            {/* Standees Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))', gap: '1.25rem' }}>
                {paginatedTables.map((table) => {
                    const scanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${table.qr_token}`;

                    return (
                        <div
                            key={table.id}
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '1rem',
                                border: '2px solid #E6D2B5',
                                padding: '1.4rem',
                                textAlign: 'center',
                                boxShadow: '0 6px 18px rgba(90, 30, 30, 0.06)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B88E4B' }}>
                                    DAYAL SWEETS • {table.outlet?.name || 'OUTLET'}
                                </div>

                                <div style={{ margin: '0.45rem 0 0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
                                    <span style={{ padding: '0.2rem 0.65rem', borderRadius: '0.45rem', background: '#5A1E1E', color: '#FFFFFF', fontWeight: 800, fontSize: '0.9rem' }}>
                                        {table.table_number}
                                    </span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                                        {table.name}
                                    </span>
                                </div>

                                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '1rem' }}>
                                    📍 {table.location} • 👥 {table.capacity} Seats
                                </div>

                                <div style={{ display: 'inline-block', padding: '0.85rem', borderRadius: '0.85rem', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                                    <QrCodeSvg value={scanUrl} size={175} />
                                </div>

                                <div style={{ marginTop: '0.65rem', fontSize: '0.73rem', fontWeight: 800, color: '#5A1E1E', letterSpacing: '0.04em' }}>
                                    SCAN QR TO ORDER FROM YOUR TABLE
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '0.45rem' }}>
                                <a
                                    href={`/scan/${table.qr_token}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ flex: 1, padding: '0.5rem 0.6rem', borderRadius: '0.45rem', background: '#5A1E1E', color: '#FFFFFF', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700 }}
                                >
                                    Open Order Panel ↗
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(table)}
                                    style={{ padding: '0.5rem 0.7rem', borderRadius: '0.45rem', background: '#F8FAFC', color: '#334155', border: '1px solid #CBD5E1', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    {copiedId === table.id ? '✓ Copied' : 'Copy URL'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {tables.length > 0 && (
                <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                    <Pagination
                        currentPage={Math.min(currentPage, totalPages)}
                        totalPages={totalPages}
                        totalItems={tables.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}
        </AdminLayout>
    );
}
