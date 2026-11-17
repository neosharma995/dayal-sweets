import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { TruckIcon, AlertIcon, MapPinIcon } from '@/Components/Icons';

export default function Index({ zones = [], outlet = null, outlets = [], filters = {} }) {
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
        const deleteUrl = outlet
            ? route('admin.outlets.shipping-zones.destroy', [outlet.id, zoneToDelete.id])
            : route('admin.shipping-zones.destroy', zoneToDelete.id);

        router.delete(deleteUrl, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setZoneToDelete(null);
            },
        });
    };

    const toggleZoneActive = (zoneId) => {
        const toggleUrl = outlet
            ? route('admin.outlets.shipping-zones.toggle', [outlet.id, zoneId])
            : route('admin.shipping-zones.toggle', zoneId);

        router.patch(toggleUrl, {}, {
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
        const updateUrl = outlet
            ? route('admin.outlets.shipping-zones.update', [outlet.id, zone.id])
            : route('admin.shipping-zones.update', zone.id);

        router.put(
            updateUrl,
            {
                outlet_id: zone.outlet_id || outlet?.id,
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
        <AdminLayout header={outlet ? `Shipping Zones — ${outlet.name} Outlet` : 'Shipping Zones'}>
            <Head title={`Shipping Zones${outlet ? ` - ${outlet.name}` : ''} - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
                {/* Outlet Selector Bar */}
                {outlets && outlets.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginBottom: '1.25rem',
                            padding: '0.75rem 1rem',
                            background: '#FFFFFF',
                            borderRadius: '0.5rem',
                            border: '1px solid #E2E8F0',
                        }}
                    >
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.25rem' }}>
                            Select Outlet:
                        </span>

                        {outlets.map((o) => {
                            const isSelected = outlet?.id === o.id;
                            return (
                                <Link
                                    key={o.id}
                                    href={route('admin.outlets.shipping-zones.index', o.id)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.8125rem',
                                        fontWeight: isSelected ? 700 : 500,
                                        background: isSelected ? '#B88E4B' : '#F1F5F9',
                                        color: isSelected ? '#FFFFFF' : '#334155',
                                        textDecoration: 'none',
                                        border: isSelected ? '1px solid #B88E4B' : '1px solid #E2E8F0',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <MapPinIcon width="13" height="13" />
                                    <span>{o.name}</span>
                                    {o.city && (
                                        <span style={{ fontSize: '0.6875rem', opacity: isSelected ? 0.9 : 0.6 }}>
                                            ({o.city})
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* View Header with Breadcrumbs */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <Link href={route('admin.outlets.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Outlets
                            </Link>
                            <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>/</span>
                            {outlet && (
                                <>
                                    <Link href={route('admin.outlets.show', outlet.id)} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                        {outlet.name}
                                    </Link>
                                    <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>/</span>
                                </>
                            )}
                            <span style={{ color: '#B88E4B', fontSize: '0.8125rem', fontWeight: 600 }}>Shipping Zones</span>
                        </div>

                        <h1>{outlet ? `${outlet.name} — Shipping Zones` : 'Shipping Zones'}</h1>
                        <p>
                            Configure geographical delivery regions, flat rate charges, free shipping thresholds, and local store pickups for{' '}
                            <strong>{outlet ? `${outlet.name} Outlet` : 'all outlets'}</strong>.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {outlet && (
                            <Link
                                href={route('admin.outlets.show', outlet.id)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.625rem 1rem',
                                    borderRadius: '0.375rem',
                                    background: '#FFFFFF',
                                    border: '1px solid #CBD5E1',
                                    color: '#334155',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                Outlet Details &rarr;
                            </Link>
                        )}

                        <Link
                            href={outlet ? route('admin.outlets.shipping-zones.create', outlet.id) : route('admin.shipping-zones.create')}
                            className="dayal-btn dayal-btn--primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Shipping Zone</span>
                        </Link>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem', width: '100%' }}>
                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Outlet Zones</span>
                            <span className="dayal-stat-badge">{outlet?.name || 'Store'}</span>
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
                        <div className="dayal-stat-value">{outlet ? outlet.name : 'Pan-India'}</div>
                        <div className="dayal-stat-subtext">{outlet?.city || 'Local & Regional'} Coverage</div>
                    </div>
                </div>

                {/* Zones Table Card */}
                <div className="dayal-admin-table-card">
                    <div className="dayal-admin-table-head" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3>Configured Shipping Zones {outlet && `(${outlet.name})`}</h3>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                A shipping zone is a geographic region where a specific set of shipping methods and rates apply.
                            </span>
                        </div>

                        <div style={{ position: 'relative', minWidth: '260px' }}>
                            <input
                                type="text"
                                placeholder="Search zones or regions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                                    fontSize: '0.8125rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    background: '#FFFFFF',
                                    color: '#0F172A',
                                }}
                            />
                            <svg
                                width="15"
                                height="15"
                                fill="none"
                                stroke="#94A3B8"
                                viewBox="0 0 24 24"
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table className="dayal-admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '22%' }}>Zone Name</th>
                                    <th style={{ width: '32%' }}>Regions</th>
                                    <th style={{ width: '26%' }}>Shipping Methods</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                                    <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredZones.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                                                    <TruckIcon width="24" height="24" />
                                                </div>
                                                <div style={{ maxWidth: '380px' }}>
                                                    <p style={{ fontWeight: 600, color: '#334155', margin: 0, fontSize: '0.9375rem' }}>
                                                        No shipping zones configured for {outlet ? outlet.name : 'this view'}
                                                    </p>
                                                    <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                                                        {search ? 'Try clearing your search keyword.' : 'Add your first delivery region, shipping methods, and rates.'}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={outlet ? route('admin.outlets.shipping-zones.create', outlet.id) : route('admin.shipping-zones.create')}
                                                    className="dayal-btn dayal-btn--primary"
                                                    style={{ marginTop: '0.5rem', textDecoration: 'none' }}
                                                >
                                                    Add Shipping Zone
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredZones.map((zone) => {
                                        const editHref = outlet
                                            ? route('admin.outlets.shipping-zones.edit', [outlet.id, zone.id])
                                            : route('admin.shipping-zones.edit', zone.id);

                                        return (
                                            <tr key={zone.id}>
                                                {/* 1. Zone Name & Description */}
                                                <td>
                                                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem' }}>
                                                        <Link href={editHref} style={{ color: '#0F172A', textDecoration: 'none' }}>
                                                            {zone.zone_name}
                                                        </Link>
                                                    </div>
                                                    {zone.description && (
                                                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>
                                                            {zone.description}
                                                        </p>
                                                    )}
                                                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                                                        Slug: {zone.zone_slug}
                                                    </span>
                                                </td>

                                                {/* 2. Regions & PIN codes tags */}
                                                <td>
                                                    {Array.isArray(zone.zone_regions) && zone.zone_regions.length > 0 ? (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
                                                            {zone.zone_regions.map((region, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.25rem',
                                                                        padding: '0.2rem 0.5rem',
                                                                        background: '#F1F5F9',
                                                                        border: '1px solid #CBD5E1',
                                                                        borderRadius: '0.25rem',
                                                                        fontSize: '0.75rem',
                                                                        color: '#1E293B',
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    <span>{getRegionName(region)}</span>
                                                                    {getRegionPincode(region) && (
                                                                        <span style={{ color: '#64748B', fontSize: '0.6875rem' }}>
                                                                            ({getRegionPincode(region)})
                                                                        </span>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveRegionFromZone(zone, region)}
                                                                        style={{
                                                                            background: 'transparent',
                                                                            border: 'none',
                                                                            color: '#94A3B8',
                                                                            fontSize: '0.85rem',
                                                                            cursor: 'pointer',
                                                                            lineHeight: 1,
                                                                            padding: 0,
                                                                            marginLeft: '0.2rem',
                                                                        }}
                                                                        title="Remove region from zone"
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontStyle: 'italic' }}>
                                                            Everywhere (Default Catch-All)
                                                        </span>
                                                    )}

                                                    {/* Pincode summary row if any */}
                                                    {zone.zone_postcodes && (
                                                        <div style={{ marginTop: '0.4rem', fontSize: '0.6875rem', color: '#B45309', background: '#FEF3C7', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', display: 'inline-block' }}>
                                                            <strong>PIN Codes:</strong> {zone.zone_postcodes}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* 3. Shipping Methods List */}
                                                <td>
                                                    {Array.isArray(zone.methods) && zone.methods.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                            {zone.methods.map((method) => {
                                                                const colors = getMethodBadgeColor(method.method_type);
                                                                return (
                                                                    <div
                                                                        key={method.id}
                                                                        style={{
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            gap: '0.4rem',
                                                                            fontSize: '0.75rem',
                                                                            padding: '0.2rem 0.5rem',
                                                                            borderRadius: '0.25rem',
                                                                            background: colors.bg,
                                                                            color: colors.text,
                                                                            border: `1px solid ${colors.border}`,
                                                                            width: 'fit-content',
                                                                        }}
                                                                    >
                                                                        <span style={{ fontWeight: 600 }}>{method.title}</span>
                                                                        <span style={{ opacity: 0.85 }}>
                                                                            {Number(method.cost) === 0 ? '(Free)' : `(₹${Number(method.cost).toFixed(2)})`}
                                                                        </span>
                                                                        {method.min_order_amount && (
                                                                            <span style={{ fontSize: '0.6875rem', opacity: 0.75 }}>
                                                                                [Min: ₹{Number(method.min_order_amount).toFixed(0)}]
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                                                            No methods configured
                                                        </span>
                                                    )}
                                                </td>

                                                {/* 4. Active/Inactive Status Toggle */}
                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleZoneActive(zone.id)}
                                                        style={{
                                                            border: 'none',
                                                            background: zone.is_active ? '#ECFDF5' : '#F1F5F9',
                                                            color: zone.is_active ? '#065F46' : '#64748B',
                                                            padding: '0.25rem 0.65rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                        title="Click to toggle status"
                                                    >
                                                        {zone.is_active ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>

                                                {/* 5. Actions */}
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                                        <Link
                                                            href={editHref}
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
