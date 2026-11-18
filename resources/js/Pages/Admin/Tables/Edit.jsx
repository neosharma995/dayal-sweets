import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import QrCodeSvg from '@/Components/QrCodeSvg';

export default function Edit({ table, outlets = [], locations = [] }) {
    const [isCustomLocation, setIsCustomLocation] = useState(!locations.includes(table.location));

    const { data, setData, put, processing, errors } = useForm({
        outlet_id: table.outlet_id,
        table_number: table.table_number || '',
        name: table.name || '',
        capacity: table.capacity || 4,
        location: table.location || 'Main Dining Hall',
        status: table.status || 'available',
        notes: table.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.tables.update', table.id));
    };

    const capacityPresets = [2, 4, 6, 8, 10, 12];
    const scanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${table.qr_token}`;

    return (
        <AdminLayout
            header={
                <div>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Edit Dining Table: {table.name} ({table.table_number})
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.15rem 0 0' }}>
                        Update seating capacity, location, or print table QR scanner
                    </p>
                </div>
            }
        >
            <Head title={`Edit ${table.name} - Admin`} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.15rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                    Select Outlet *
                                </label>
                                <select
                                    value={data.outlet_id}
                                    onChange={(e) => setData('outlet_id', e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                                >
                                    {outlets.map((o) => (
                                        <option key={o.id} value={o.id}>
                                            {o.name} ({o.city})
                                        </option>
                                    ))}
                                </select>
                                {errors.outlet_id && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.25rem' }}>{errors.outlet_id}</p>}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                    Table Number / Code *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.table_number}
                                    onChange={(e) => setData('table_number', e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                                />
                                {errors.table_number && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.25rem' }}>{errors.table_number}</p>}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                    Table Display Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                    Seating Capacity (How Many People Can Sit) *
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                                    {capacityPresets.map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setData('capacity', num)}
                                            style={{
                                                padding: '0.45rem 0.9rem',
                                                borderRadius: '0.5rem',
                                                border: Number(data.capacity) === num ? '2px solid #5A1E1E' : '1px solid #CBD5E1',
                                                background: Number(data.capacity) === num ? '#FDF8F0' : '#FFFFFF',
                                                color: Number(data.capacity) === num ? '#5A1E1E' : '#334155',
                                                fontWeight: 700,
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            👥 {num} People
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    required
                                    value={data.capacity}
                                    onChange={(e) => setData('capacity', Number(e.target.value))}
                                    style={{ width: '180px', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                    Location / Floor / Zone *
                                </label>
                                {!isCustomLocation ? (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <select
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                                        >
                                            {locations.map((loc) => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsCustomLocation(true)}
                                            style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            + Custom
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            required
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCustomLocation(false);
                                                setData('location', locations[0] || 'Main Dining Hall');
                                            }}
                                            style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Presets
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                    Table Status *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="reserved">Reserved</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                    Notes (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
                            <Link
                                href={route('admin.tables.index')}
                                style={{ padding: '0.6rem 1.1rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', color: '#334155', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem' }}
                            >
                                ← Back to Tables
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                style={{ padding: '0.65rem 1.4rem', borderRadius: '0.5rem', background: '#5A1E1E', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live QR Scanner Standee Card */}
                <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', border: '2px solid #E6D2B5', padding: '1.75rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B88E4B' }}>
                        {table.outlet?.name || 'Dayal Sweets'} • Table QR Scanner
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#3E1C1A', margin: '0.25rem 0' }}>
                        {data.name || table.name} ({data.table_number})
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 1.25rem' }}>
                        📍 {data.location} • 👥 Seats {data.capacity} People
                    </p>

                    <div style={{ display: 'inline-block', padding: '1.15rem', borderRadius: '0.85rem', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                        <QrCodeSvg value={scanUrl} size={200} />
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <a
                            href={`/scan/${table.qr_token}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ padding: '0.65rem 1rem', borderRadius: '0.5rem', background: '#5A1E1E', color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '0.86rem' }}
                        >
                            Open Customer Ordering Panel ↗
                        </a>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', background: '#FDF8F0', color: '#8C6226', border: '1px solid #E6D2B5', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer' }}
                        >
                            Print Table Standee Card
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
