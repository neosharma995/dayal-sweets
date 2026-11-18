import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import QrCodeSvg from '@/Components/QrCodeSvg';

const DEFAULT_LOCATIONS = [
    'Main Dining Hall',
    'Ground Floor',
    'First Floor (AC Hall)',
    'Family Cabin / VIP Lounge',
    'Outdoor / Rooftop Terrace',
    'Quick Bite Counter Area',
];

export default function OutletTablesTab({ outlet }) {
    const tables = outlet?.tables || [];
    const [activeQrTable, setActiveQrTable] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [customLocation, setCustomLocation] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        outlet_id: outlet.id,
        table_number: '',
        name: '',
        capacity: 4,
        location: 'Main Dining Hall',
        status: 'available',
        notes: '',
    });

    const handleCreateTable = (e) => {
        e.preventDefault();
        setSubmitting(true);
        const finalLocation = form.location === '__custom__' ? customLocation : form.location;

        router.post(
            route('admin.tables.store'),
            {
                ...form,
                outlet_id: outlet.id,
                location: finalLocation || 'Main Dining Hall',
                return_back: true,
            },
            {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
                onSuccess: () => {
                    setCreateModalOpen(false);
                    setForm({
                        outlet_id: outlet.id,
                        table_number: '',
                        name: '',
                        capacity: 4,
                        location: 'Main Dining Hall',
                        status: 'available',
                        notes: '',
                    });
                },
            }
        );
    };

    const handleStatusChange = (table, newStatus) => {
        router.patch(
            route('admin.tables.update-status', table.id),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const handleDeleteTable = (table) => {
        if (!window.confirm(`Delete "${table.name}" from ${outlet.name}?`)) return;
        router.delete(route('admin.tables.destroy', table.id), {
            preserveScroll: true,
        });
    };

    return (
        <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                        Dining Tables &amp; QR Scanners — {outlet.name}
                    </h3>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.8125rem', color: '#64748B' }}>
                        Create dining tables with seating capacities and floor locations. Customers scan the QR code to place direct table orders.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <Link
                        href={route('admin.tables.scanners', { outlet_id: outlet.id })}
                        style={{ padding: '0.5rem 0.95rem', borderRadius: '0.375rem', background: '#FDF8F0', color: '#8C6226', border: '1px solid #E6D2B5', fontSize: '0.8125rem', fontWeight: 700, textDecoration: 'none' }}
                    >
                        🖨️ Print Outlet QR Standees
                    </Link>

                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', background: '#5A1E1E', color: '#FFFFFF', border: 'none', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                        + Add Table &amp; Generate QR
                    </button>
                </div>
            </div>

            {tables.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '0.5rem', border: '1px dashed #CBD5E1' }}>
                    <h4 style={{ margin: '0 0 0.35rem', color: '#0F172A', fontSize: '1rem', fontWeight: 700 }}>
                        No Dining Tables Configured for {outlet.name}
                    </h4>
                    <p style={{ margin: '0 0 1rem', color: '#64748B', fontSize: '0.84rem' }}>
                        Add tables with seating capacities and floor locations to generate QR code scanners.
                    </p>
                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        style={{ padding: '0.55rem 1.15rem', borderRadius: '0.375rem', background: '#5A1E1E', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                        + Create First Table
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: '1rem' }}>
                    {tables.map((table) => {
                        const scanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${table.qr_token}`;
                        return (
                            <div
                                key={table.id}
                                style={{
                                    borderRadius: '0.75rem',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.15rem',
                                    background: '#FFFFFF',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                                        <span style={{ padding: '0.25rem 0.6rem', borderRadius: '0.375rem', background: '#5A1E1E', color: '#FFFFFF', fontWeight: 800, fontSize: '0.8rem' }}>
                                            {table.table_number}
                                        </span>
                                        <select
                                            value={table.status}
                                            onChange={(e) => handleStatusChange(table, e.target.value)}
                                            style={{ padding: '0.2rem 0.5rem', borderRadius: '0.35rem', border: '1px solid #CBD5E1', fontSize: '0.75rem', fontWeight: 700 }}
                                        >
                                            <option value="available">Available</option>
                                            <option value="occupied">Occupied</option>
                                            <option value="reserved">Reserved</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{table.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                                        📍 {table.location}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#8C6226', fontWeight: 700, marginTop: '0.2rem' }}>
                                        👥 Capacity: {table.capacity} People
                                    </div>

                                    <div
                                        onClick={() => setActiveQrTable(table)}
                                        style={{ margin: '0.85rem 0', textAlign: 'center', padding: '0.75rem', borderRadius: '0.5rem', background: '#FDF8F0', border: '1px solid #E6D2B5', cursor: 'pointer' }}
                                        title="Click to enlarge QR Scanner"
                                    >
                                        <QrCodeSvg value={scanUrl} size={135} />
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#5A1E1E', marginTop: '0.35rem' }}>
                                            CLICK TO VIEW / PRINT QR
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                                    <a
                                        href={`/scan/${table.qr_token}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ flex: 1, textAlign: 'center', padding: '0.45rem 0.5rem', borderRadius: '0.375rem', background: '#5A1E1E', color: '#FFFFFF', textDecoration: 'none', fontSize: '0.76rem', fontWeight: 700 }}
                                    >
                                        Open Scanner Panel ↗
                                    </a>
                                    <Link
                                        href={route('admin.tables.edit', table.id)}
                                        style={{ padding: '0.45rem 0.6rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', color: '#334155', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTable(table)}
                                        style={{ padding: '0.45rem 0.6rem', borderRadius: '0.375rem', border: '1px solid #FECACA', background: '#FEF2F2', color: '#B91C1C', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Enlarge QR Modal */}
            <Modal show={Boolean(activeQrTable)} onClose={() => setActiveQrTable(null)}>
                {activeQrTable && (
                    <div style={{ padding: '1.75rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#B88E4B' }}>
                            {outlet.name} • Table QR Scanner
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#3E1C1A', margin: '0.25rem 0' }}>
                            {activeQrTable.name} ({activeQrTable.table_number})
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: '1.1rem' }}>
                            📍 {activeQrTable.location} • 👥 Seats {activeQrTable.capacity} People
                        </p>
                        <div style={{ display: 'inline-block', padding: '1.1rem', borderRadius: '0.85rem', border: '2px solid #E6D2B5' }}>
                            <QrCodeSvg value={`${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${activeQrTable.qr_token}`} size={220} />
                        </div>
                        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '0.6rem' }}>
                            <a
                                href={`/scan/${activeQrTable.qr_token}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ padding: '0.55rem 1.1rem', borderRadius: '0.45rem', background: '#5A1E1E', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '0.84rem' }}
                            >
                                Open Customer Ordering Panel ↗
                            </a>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                style={{ padding: '0.55rem 1.1rem', borderRadius: '0.45rem', background: '#B88E4B', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer' }}
                            >
                                Print QR Standee
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create Table Modal */}
            <Modal show={createModalOpen} onClose={() => !submitting && setCreateModalOpen(false)}>
                <form onSubmit={handleCreateTable} style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                        Add Dining Table to {outlet.name}
                    </h3>
                    <p style={{ margin: '0 0 1.15rem', fontSize: '0.82rem', color: '#64748B' }}>
                        Enter table number, how many people can sit, and location inside {outlet.name}.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Table Number *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. T-05"
                                value={form.table_number}
                                onChange={(e) => setForm({ ...form, table_number: e.target.value })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Display Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Family Table 5"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>How Many People Can Sit *</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                required
                                value={form.capacity}
                                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Location / Floor *</label>
                            <select
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1' }}
                            >
                                {DEFAULT_LOCATIONS.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                                <option value="__custom__">+ Custom Location...</option>
                            </select>
                        </div>
                        {form.location === '__custom__' && (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Custom Location *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Rooftop Garden"
                                    value={customLocation}
                                    onChange={(e) => setCustomLocation(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1' }}
                                />
                            </div>
                        )}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Notes (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Window Booth"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.25rem' }}>
                        <button
                            type="button"
                            onClick={() => setCreateModalOpen(false)}
                            style={{ padding: '0.5rem 1rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{ padding: '0.5rem 1.15rem', borderRadius: '0.45rem', border: 'none', background: '#5A1E1E', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                        >
                            {submitting ? 'Creating...' : 'Create Table & QR'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
