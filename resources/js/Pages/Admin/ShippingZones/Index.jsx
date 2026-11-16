import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { TruckIcon, AlertIcon } from '@/Components/Icons';

export default function Index({ zones = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [zoneToDelete, setZoneToDelete] = useState(null);

    const filteredZones = zones.filter((z) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            z.zone_name?.toLowerCase().includes(q) ||
            z.zone_slug?.toLowerCase().includes(q) ||
            z.description?.toLowerCase().includes(q) ||
            (Array.isArray(z.zone_regions) && z.zone_regions.some((r) => r.toLowerCase().includes(q)))
        );
    });

    const totalMethods = zones.reduce((sum, z) => sum + (Array.isArray(z.methods) ? z.methods.length : 0), 0);
    const activeZones = zones.filter((z) => z.is_active).length;

    const handleDeleteClick = (zone) => {
        setZoneToDelete(zone);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!zoneToDelete) return;
        router.delete(route('admin.shipping-zones.destroy', zoneToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setZoneToDelete(null);
            },
        });
    };

    const toggleZoneActive = (zoneId) => {
        router.patch(route('admin.shipping-zones.toggle', zoneId), {}, {
            preserveScroll: true,
        });
    };

    const getRegionName = (r) => (typeof r === 'object' && r !== null ? (r.name || '') : String(r));
    const getRegionPincode = (r) => (typeof r === 'object' && r !== null ? (r.pincode || null) : null);

    const handleRemoveRegionFromZone = (zone, regionToRemove) => {
        const targetName = getRegionName(regionToRemove).toLowerCase();
        const updatedRegions = (zone.zone_regions || []).filter(
            (r) => getRegionName(r).toLowerCase() !== targetName
        );
        router.put(
            route('admin.shipping-zones.update', zone.id),
            {
                zone_name: zone.zone_name,
                zone_slug: zone.zone_slug,
                description: zone.description,
                zone_regions: updatedRegions,
                zone_postcodes: zone.zone_postcodes,
                is_active: zone.is_active,
                sort_order: zone.sort_order,
            },
            { preserveScroll: true }
        );
    };

    const getMethodBadgeColor = (type) => {
        switch (type) {
            case 'free_shipping':
                return { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' };
            case 'flat_rate':
                return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' };
            case 'local_pickup':
                return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' };
            default:
                return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
        }
    };

    return (
        <AdminLayout header="Shipping Zones">
            <Head title="Shipping Zones - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
                {/* View Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                    <div>
                        <h1>Shipping Zones</h1>
                        <p>Configure geographical delivery regions, flat rate charges, free shipping thresholds, and local store pickups exactly like WooCommerce.</p>
                    </div>

                    <Link
                        href={route('admin.shipping-zones.create')}
                        className="dayal-btn dayal-btn--primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Shipping Zone</span>
                    </Link>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem', width: '100%' }}>
                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Total Shipping Zones</span>
                            <span className="dayal-stat-badge">WooCommerce</span>
                        </div>
                        <div className="dayal-stat-value">{zones.length}</div>
                        <div className="dayal-stat-subtext">Configured geographic zones</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Active Delivery Zones</span>
                            <span className="dayal-stat-badge" style={{ color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>Live</span>
                        </div>
                        <div className="dayal-stat-value">{activeZones}</div>
                        <div className="dayal-stat-subtext">Currently open for delivery</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Shipping Methods</span>
                            <span className="dayal-stat-badge" style={{ color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>Rates</span>
                        </div>
                        <div className="dayal-stat-value">{totalMethods}</div>
                        <div className="dayal-stat-subtext">Flat rates, free shipping &amp; pickups</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Store Delivery</span>
                            <span className="dayal-stat-badge" style={{ color: '#B88E4B', background: '#FDFBF7', border: '1px solid #E6D2B5' }}>Direct Dispatch</span>
                        </div>
                        <div className="dayal-stat-value">Pan-India</div>
                        <div className="dayal-stat-subtext">Local NCR &amp; Express Northern States</div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="dayal-admin-table-card" style={{ width: '100%' }}>
                    <div className="dayal-admin-table-head" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3>Configured Shipping Zones</h3>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                A shipping zone is a geographic region where a specific set of shipping methods and rates apply.
                            </span>
                        </div>

                        {/* Search Input */}
                        <div style={{ position: 'relative', minWidth: '280px' }}>
                            <input
                                type="text"
                                placeholder="Search zones or regions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 1rem 0.55rem 2.25rem',
                                    borderRadius: '0.5rem',
                                    background: '#FFFFFF',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    color: '#0F172A',
                                    outline: 'none',
                                }}
                            />
                            <svg
                                width="16"
                                height="16"
                                fill="none"
                                stroke="#64748B"
                                viewBox="0 0 24 24"
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="dayal-admin-table-responsive">
                        <table className="dayal-admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '22%' }}>Zone Name</th>
                                    <th style={{ width: '30%' }}>Regions</th>
                                    <th style={{ width: '30%' }}>Shipping Methods</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                                    <th style={{ width: '8%', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredZones.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                                            <div style={{ display: 'inline-flex', padding: '1rem', background: '#F1F5F9', borderRadius: '50%', marginBottom: '0.75rem' }}>
                                                <TruckIcon width="32" height="32" />
                                            </div>
                                            <p style={{ fontWeight: 600, color: '#0F172A', marginBottom: '0.25rem' }}>No Shipping Zones Found</p>
                                            <p style={{ fontSize: '0.8125rem' }}>Create delivery zones to allow customers to order sweets online.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredZones.map((zone) => {
                                        const regions = Array.isArray(zone.zone_regions) ? zone.zone_regions : [];
                                        const methods = Array.isArray(zone.methods) ? zone.methods : [];

                                        return (
                                            <tr key={zone.id}>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                        <Link
                                                            href={route('admin.shipping-zones.edit', zone.id)}
                                                            style={{ fontWeight: 700, color: '#0F172A', textDecoration: 'none', fontSize: '0.9rem' }}
                                                        >
                                                            {zone.zone_name}
                                                        </Link>
                                                        {zone.description && (
                                                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                                {zone.description}
                                                            </span>
                                                        )}
                                                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                                                            Slug: <code>{zone.zone_slug}</code>
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    {regions.length === 0 ? (
                                                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                                                            Everywhere (no specific regions)
                                                        </span>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                            {regions.map((r, i) => {
                                                                const rName = getRegionName(r);
                                                                const rPin = getRegionPincode(r);
                                                                return (
                                                                    <span
                                                                        key={i}
                                                                        style={{
                                                                            fontSize: '0.72rem',
                                                                            padding: '0.2rem 0.45rem',
                                                                            borderRadius: '0.25rem',
                                                                            background: '#F1F5F9',
                                                                            color: '#334155',
                                                                            border: '1px solid #E2E8F0',
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            gap: '0.35rem',
                                                                        }}
                                                                    >
                                                                        <span style={{ fontWeight: 600 }}>{rName}</span>
                                                                        {rPin && (
                                                                            <span
                                                                                style={{
                                                                                    fontSize: '0.65rem',
                                                                                    color: '#8C6226',
                                                                                    background: '#FDF8F0',
                                                                                    padding: '0.05rem 0.25rem',
                                                                                    borderRadius: '0.2rem',
                                                                                    border: '1px solid #E6D2B5',
                                                                                    fontWeight: 600,
                                                                                }}
                                                                            >
                                                                                PIN: {rPin}
                                                                            </span>
                                                                        )}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveRegionFromZone(zone, r)}
                                                                            style={{
                                                                                background: 'transparent',
                                                                                border: 'none',
                                                                                color: '#94A3B8',
                                                                                cursor: 'pointer',
                                                                                fontSize: '0.8rem',
                                                                                fontWeight: 700,
                                                                                lineHeight: 1,
                                                                                padding: '0 0.1rem',
                                                                            }}
                                                                            onMouseEnter={(e) => { e.currentTarget.style.color = '#E11D48'; }}
                                                                            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                                                                            title={`Remove ${rName} from zone`}
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                    {zone.zone_postcodes && (
                                                        <div style={{ marginTop: '0.45rem', fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                                                            <strong style={{ color: '#8C6226', background: '#FDF8F0', padding: '0.05rem 0.3rem', borderRadius: '0.2rem', border: '1px solid #E6D2B5' }}>
                                                                PIN Codes:
                                                            </strong>
                                                            <span style={{ fontFamily: 'monospace', color: '#334155', wordBreak: 'break-all' }}>
                                                                {zone.zone_postcodes.length > 60 ? `${zone.zone_postcodes.substring(0, 60)}...` : zone.zone_postcodes}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    {methods.length === 0 ? (
                                                        <span style={{ fontSize: '0.75rem', color: '#E11D48', fontWeight: 600 }}>
                                                            ⚠️ No methods added yet
                                                        </span>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                            {methods.map((m) => {
                                                                const colors = getMethodBadgeColor(m.method_type);
                                                                return (
                                                                    <div
                                                                        key={m.id}
                                                                        style={{
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            gap: '0.35rem',
                                                                            padding: '0.25rem 0.55rem',
                                                                            borderRadius: '0.375rem',
                                                                            background: colors.bg,
                                                                            color: colors.text,
                                                                            border: `1px solid ${colors.border}`,
                                                                            fontSize: '0.725rem',
                                                                        }}
                                                                    >
                                                                        <strong>{m.title}</strong>
                                                                        <span>
                                                                            {Number(m.cost) > 0 ? `(₹${Number(m.cost).toFixed(2)})` : '(Free)'}
                                                                        </span>
                                                                        {m.min_order_amount && (
                                                                            <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>
                                                                                [Min ₹{Number(m.min_order_amount).toFixed(0)}]
                                                                            </span>
                                                                        )}
                                                                        {!m.is_enabled && (
                                                                            <span style={{ color: '#E11D48', fontWeight: 700, marginLeft: '0.2rem' }}>
                                                                                (Off)
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </td>

                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleZoneActive(zone.id)}
                                                        style={{
                                                            padding: '0.25rem 0.65rem',
                                                            borderRadius: '999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            background: zone.is_active ? '#ECFDF5' : '#F1F5F9',
                                                            color: zone.is_active ? '#059669' : '#64748B',
                                                            border: zone.is_active ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                                                        }}
                                                    >
                                                        {zone.is_active ? 'Active' : 'Disabled'}
                                                    </button>
                                                </td>

                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <Link
                                                            href={route('admin.shipping-zones.edit', zone.id)}
                                                            className="dayal-admin-action-btn"
                                                            title="Edit Zone"
                                                        >
                                                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteClick(zone)}
                                                            className="dayal-admin-action-btn delete"
                                                            title="Delete Zone"
                                                        >
                                                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <div className="dayal-admin-modal-content">
                    <div className="modal-header-row">
                        <div className="modal-icon-badge">
                            <AlertIcon width="24" height="24" />
                        </div>
                        <div className="modal-title-text">
                            <h3>Delete Shipping Zone?</h3>
                            <span>Permanent Zone Removal</span>
                        </div>
                    </div>

                    <p className="modal-desc-text">
                        Are you sure you want to delete <strong>&ldquo;{zoneToDelete?.zone_name}&rdquo;</strong>? All associated shipping methods and rates will also be permanently removed.
                    </p>

                    <div className="modal-actions-row">
                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(false)}
                            className="dayal-admin-head-btn modal-cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="modal-confirm-btn"
                        >
                            Delete Shipping Zone
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
