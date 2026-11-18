import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ outlets = [], locations = [], defaultOutletId = null }) {
    const [isCustomLocation, setIsCustomLocation] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        outlet_id: defaultOutletId || outlets[0]?.id || '',
        table_number: '',
        name: '',
        capacity: 4,
        location: locations[0] || 'Main Dining Hall',
        status: 'available',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.tables.store'));
    };

    const capacityPresets = [2, 4, 6, 8, 10, 12];

    return (
        <AdminLayout
            header={
                <div>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Add New Outlet Dining Table
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.15rem 0 0' }}>
                        Create a dining table inside an outlet and automatically generate its QR code scanner
                    </p>
                </div>
            }
        >
            <Head title="Add New Dining Table - Admin" />

            <div style={{ maxWidth: '760px', background: '#FFFFFF', borderRadius: '0.75rem', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.15rem' }}>
                        {/* Outlet Selection */}
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

                        {/* Table Number */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                Table Number / Code *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. T-01, T-02, VIP-01"
                                value={data.table_number}
                                onChange={(e) => setData('table_number', e.target.value)}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                            />
                            {errors.table_number && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.25rem' }}>{errors.table_number}</p>}
                        </div>

                        {/* Table Friendly Name */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                Table Display Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Table T-01 or Royal Family Booth"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                            />
                            {errors.name && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.25rem' }}>{errors.name}</p>}
                        </div>

                        {/* How many people can sit */}
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
                            {errors.capacity && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.25rem' }}>{errors.capacity}</p>}
                        </div>

                        {/* Table Location / Section */}
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
                                        onClick={() => {
                                            setIsCustomLocation(true);
                                            setData('location', '');
                                        }}
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
                                        placeholder="Enter floor, room, or zone name..."
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
                            {errors.location && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.25rem' }}>{errors.location}</p>}
                        </div>

                        {/* Status */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                Initial Status *
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                            >
                                <option value="available">Available (Ready for QR Orders)</option>
                                <option value="occupied">Occupied</option>
                                <option value="reserved">Reserved</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                                Location Landmark / Notes (Optional)
                            </label>
                            <textarea
                                rows={2}
                                placeholder="e.g. Window seat overlooking garden, power socket available..."
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
                            ← Back to All Tables
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{ padding: '0.65rem 1.4rem', borderRadius: '0.5rem', background: '#5A1E1E', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                        >
                            {processing ? 'Creating Table...' : 'Create Table & Generate QR Scanner'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
