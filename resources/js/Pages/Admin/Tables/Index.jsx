import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import QrCodeSvg from '@/Components/QrCodeSvg';
import Pagination from '@/Components/Pagination';

export default function Index({
    tables = [],
    outlets = [],
    locations = [],
    stats = {},
    filters = {},
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [outletFilter, setOutletFilter] = useState(filters.outlet_id || 'all');
    const [locationFilter, setLocationFilter] = useState(filters.location || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    const totalPages = Math.ceil(tables.length / itemsPerPage) || 1;
    const paginatedTables = useMemo(() => {
        const safePage = Math.min(currentPage, totalPages);
        const start = (safePage - 1) * itemsPerPage;
        return tables.slice(start, start + itemsPerPage);
    }, [tables, currentPage, itemsPerPage, totalPages]);

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
            ...overrides,
        };
        router.get(route('admin.tables.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
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
        <AdminLayout
            header={
                <div>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Outlet Dining Tables &amp; QR Scanners
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.15rem 0 0' }}>
                        Manage seating capacity, floor locations, and table QR code scanners across all outlets
                    </p>
                </div>
            }
        >
            <Head title="Dining Tables & QR Scanners - Admin" />

            {/* Top Summary Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '1.1rem 1.25rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>Total Tables</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>{stats.total_tables || 0}</div>
                    <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600 }}>Active QR ordering tables</div>
                </div>

                <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '1.1rem 1.25rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>Total Seating Capacity</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8C6226', marginTop: '0.25rem' }}>{stats.total_capacity || 0} Guests</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>People who can sit simultaneously</div>
                </div>

                <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '1.1rem 1.25rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#047857' }}>Available Now</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '0.25rem' }}>{stats.available || 0}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Ready to seat guests</div>
                </div>

                <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '1.1rem 1.25rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#B91C1C' }}>Occupied / Dining</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B91C1C', marginTop: '0.25rem' }}>{(stats.occupied || 0) + (stats.reserved || 0)}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{stats.occupied || 0} occupied • {stats.reserved || 0} reserved</div>
                </div>
            </div>

            {/* Filter & Action Toolbar */}
            <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '1rem 1.25rem', border: '1px solid #E2E8F0', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center', flex: 1 }}>
                    <select
                        value={outletFilter}
                        onChange={(e) => {
                            setOutletFilter(e.target.value);
                            applyFilters({ outlet_id: e.target.value });
                        }}
                        style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600 }}
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
                            applyFilters({ location: e.target.value });
                        }}
                        style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                        <option value="all">All Floor / Hall Locations</option>
                        {locations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            applyFilters({ status: e.target.value });
                        }}
                        style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="reserved">Reserved</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search table #, name, location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ padding: '0.5rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', minWidth: '210px' }}
                    />

                    <button
                        type="submit"
                        style={{ padding: '0.5rem 0.95rem', borderRadius: '0.5rem', background: '#0F172A', color: '#FFFFFF', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Filter
                    </button>
                </form>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <Link
                        href={route('admin.tables.scanners', { outlet_id: outletFilter !== 'all' ? outletFilter : undefined })}
                        style={{ padding: '0.55rem 1rem', borderRadius: '0.5rem', background: '#FDF8F0', color: '#8C6226', border: '1px solid #E6D2B5', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <span>Print All QR Scanners</span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setQuickAddOpen(true)}
                        style={{ padding: '0.55rem 1rem', borderRadius: '0.5rem', background: '#5A1E1E', color: '#FFFFFF', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                        + Quick Add Table
                    </button>

                    <Link
                        href={route('admin.tables.create')}
                        style={{ padding: '0.55rem 1rem', borderRadius: '0.5rem', background: '#B88E4B', color: '#FFFFFF', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}
                    >
                        + Full Create Page
                    </Link>
                </div>
            </div>

            {/* Tables Data Grid */}
            <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                {tables.length === 0 ? (
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
                                {paginatedTables.map((table) => {
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
                        {tables.length > 0 && (
                            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', background: '#FAFAFA', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#475569' }}>
                                    <span>Rows per page:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 600 }}
                                    >
                                        <option value={8}>8</option>
                                        <option value={12}>12</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <Pagination
                                        currentPage={Math.min(currentPage, totalPages)}
                                        totalPages={totalPages}
                                        totalItems={tables.length}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={(page) => setCurrentPage(page)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
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
