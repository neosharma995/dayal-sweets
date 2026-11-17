import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { MapPinIcon, PhoneIcon, AlertIcon, TruckIcon } from '@/Components/Icons';

export default function Show({ outlet }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [zoneToDelete, setZoneToDelete] = useState(null);
    const [deleteZoneModalOpen, setDeleteZoneModalOpen] = useState(false);

    const confirmDelete = () => {
        router.delete(route('admin.outlets.destroy', outlet.id));
    };

    const toggleStatus = () => {
        router.patch(route('admin.outlets.toggle', outlet.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteZoneClick = (zone) => {
        setZoneToDelete(zone);
        setDeleteZoneModalOpen(true);
    };

    const confirmDeleteZone = () => {
        if (!zoneToDelete) return;
        router.delete(route('admin.outlets.shipping-zones.destroy', [outlet.id, zoneToDelete.id]), {
            onSuccess: () => {
                setDeleteZoneModalOpen(false);
                setZoneToDelete(null);
            },
        });
    };

    const toggleZoneActive = (zoneId) => {
        router.patch(route('admin.outlets.shipping-zones.toggle', [outlet.id, zoneId]), {}, {
            preserveScroll: true,
        });
    };

    const getRegionName = (r) => (typeof r === 'object' && r !== null ? (r.name || '') : String(r));
    const getRegionPincode = (r) => (typeof r === 'object' && r !== null ? (r.pincode || null) : null);

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
        <AdminLayout header={`Outlet: ${outlet.name}`}>
            <Head title={`${outlet.name} - Outlet Details - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                {/* Header breadcrumb & navigation */}
                <div
                    className="dayal-admin-view-header"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.outlets.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Outlets
                            </Link>
                            <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#B88E4B', fontSize: '0.8125rem', fontWeight: 600 }}>{outlet.name}</span>
                        </div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.5rem', color: '#0F172A' }}>
                            <MapPinIcon width="24" height="24" style={{ color: '#B88E4B' }} />
                            <span>{outlet.name} Outlet</span>
                        </h1>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={toggleStatus}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: outlet.is_active ? '#059669' : '#64748B',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {outlet.is_active ? 'Status: Active (Click to Deactivate)' : 'Status: Inactive (Click to Activate)'}
                        </button>
                        <Link
                            href={route('admin.outlets.edit', outlet.id)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '0.375rem',
                                background: '#B88E4B',
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                            }}
                        >
                            Edit Outlet
                        </Link>
                        <Link
                            href={route('admin.outlets.index')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                background: '#F1F5F9',
                                border: '1px solid #CBD5E1',
                                color: '#334155',
                                textDecoration: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                            }}
                        >
                            &larr; All Outlets
                        </Link>
                    </div>
                </div>

                {/* Content Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 340px', gap: '1.5rem', alignItems: 'start' }}>
                    {/* Left Details Card */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.5rem',
                            padding: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                            Outlet Information
                        </h3>

                        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: '1rem', fontSize: '0.875rem' }}>
                            <dt style={{ fontWeight: 600, color: '#64748B' }}>Outlet Name</dt>
                            <dd style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>{outlet.name}</dd>

                            <dt style={{ fontWeight: 600, color: '#64748B' }}>Subtitle</dt>
                            <dd style={{ margin: 0, color: '#334155' }}>{outlet.subtitle || '-'}</dd>

                            <dt style={{ fontWeight: 600, color: '#64748B' }}>URL Identifier</dt>
                            <dd style={{ margin: 0, color: '#334155', fontFamily: 'monospace' }}>{outlet.slug}</dd>

                            <dt style={{ fontWeight: 600, color: '#64748B' }}>Address</dt>
                            <dd style={{ margin: 0, color: '#334155', lineHeight: 1.5 }}>{outlet.address}</dd>

                            <dt style={{ fontWeight: 600, color: '#64748B' }}>City / State</dt>
                            <dd style={{ margin: 0, color: '#334155' }}>{outlet.city ? `${outlet.city}, ` : ''}{outlet.state} {outlet.pincode ? `(${outlet.pincode})` : ''}</dd>

                            <dt style={{ fontWeight: 600, color: '#64748B' }}>Phone</dt>
                            <dd style={{ margin: 0, color: '#334155' }}>{outlet.phone || '-'}</dd>

                            <dt style={{ fontWeight: 600, color: '#64748B' }}>WhatsApp</dt>
                            <dd style={{ margin: 0, color: '#059669', fontWeight: 600 }}>{outlet.whatsapp || '-'}</dd>

                            <dt style={{ fontWeight: 600, color: '#64748B' }}>Timings</dt>
                            <dd style={{ margin: 0, color: '#334155' }}>{outlet.timings || '-'}</dd>

                            <dt style={{ fontWeight: 600, color: '#64748B' }}>Status</dt>
                            <dd style={{ margin: 0 }}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: '0.2rem 0.65rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: outlet.status === 'active' ? '#ECFDF5' : (outlet.status === 'coming_soon' ? '#FEF3C7' : '#F1F5F9'),
                                        color: outlet.status === 'active' ? '#065F46' : (outlet.status === 'coming_soon' ? '#92400E' : '#64748B'),
                                        border: '1px solid rgba(0,0,0,0.05)',
                                    }}
                                >
                                    {outlet.status?.toUpperCase() || (outlet.is_active ? 'ACTIVE' : 'INACTIVE')}
                                </span>
                            </dd>

                            {outlet.expected_opening && (
                                <>
                                    <dt style={{ fontWeight: 600, color: '#D97706' }}>Opening Note</dt>
                                    <dd style={{ margin: 0, color: '#D97706', fontWeight: 600 }}>{outlet.expected_opening}</dd>
                                </>
                            )}

                            <dt style={{ fontWeight: 600, color: '#64748B' }}>Sort Order</dt>
                            <dd style={{ margin: 0, color: '#334155' }}>{outlet.sort_order}</dd>

                            <dt style={{ fontWeight: 600, color: '#64748B' }}>Google Maps</dt>
                            <dd style={{ margin: 0 }}>
                                {outlet.map_url ? (
                                    <a
                                        href={outlet.map_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#B88E4B', fontWeight: 600, textDecoration: 'none' }}
                                    >
                                        Open in Google Maps &rarr;
                                    </a>
                                ) : (
                                    <span style={{ color: '#94A3B8' }}>Not provided</span>
                                )}
                            </dd>
                        </dl>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(true)}
                                style={{
                                    padding: '0.45rem 1rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #FCA5A5',
                                    background: '#FEE2E2',
                                    color: '#DC2626',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Delete this Outlet
                            </button>
                        </div>
                    </div>

                    {/* Right Live Storefront Card Preview */}
                    <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Storefront Card Preview
                        </div>

                        {/* Customer-facing card styled identically to Outlets.jsx */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '0.75rem',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <div style={{ position: 'relative', width: '100%', height: '180px', background: '#F1F5F9' }}>
                                {(outlet.status === 'coming_soon' || outlet.is_coming_soon) && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '12px',
                                            left: '12px',
                                            zIndex: 2,
                                            background: '#881337',
                                            color: '#FFFFFF',
                                            fontSize: '0.6875rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '0.25rem',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        Coming Soon
                                    </div>
                                )}
                                <img
                                    src={outlet.image_url || outlet.image || '/uploads/woocommerce-placeholder.webp'}
                                    alt={outlet.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            <div style={{ padding: '1.25rem' }}>
                                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: 700, color: '#881337' }}>
                                    {outlet.name}
                                </h4>
                                {outlet.subtitle && (
                                    <div style={{ fontSize: '0.8125rem', fontStyle: 'italic', color: '#B88E4B', marginBottom: '0.75rem' }}>
                                        {outlet.subtitle}
                                    </div>
                                )}

                                <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.4 }}>
                                    {outlet.address}
                                </p>

                                {outlet.phone && (
                                    <div style={{ fontSize: '0.8125rem', color: '#334155', marginBottom: '0.25rem' }}>
                                        📞 {outlet.phone}
                                    </div>
                                )}
                                {outlet.whatsapp && (
                                    <div style={{ fontSize: '0.8125rem', color: '#059669', marginBottom: '1rem' }}>
                                        💬 {outlet.whatsapp}
                                    </div>
                                )}

                                {outlet.map_url && (
                                    <a
                                        href={outlet.map_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'block',
                                            textAlign: 'center',
                                            padding: '0.5rem',
                                            border: '1px solid #881337',
                                            color: '#881337',
                                            borderRadius: '0.375rem',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.8125rem',
                                        }}
                                    >
                                        View Map &nearr;
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configured Shipping & Delivery Zones Section for this Outlet */}
                <div
                    style={{
                        marginTop: '2rem',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            marginBottom: '1.25rem',
                            borderBottom: '1px solid #F1F5F9',
                            paddingBottom: '0.75rem',
                        }}
                    >
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <TruckIcon width="20" height="20" style={{ color: '#B88E4B' }} />
                                <span>Shipping &amp; Delivery Zones ({outlet.name})</span>
                            </h3>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#64748B' }}>
                                Delivery regions, postal PIN code filters, and shipping rates configured exclusively for {outlet.name} outlet.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link
                                href={route('admin.outlets.shipping-zones.index', outlet.id)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    padding: '0.45rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    background: '#F1F5F9',
                                    border: '1px solid #CBD5E1',
                                    color: '#334155',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                Full Zones View &rarr;
                            </Link>
                            <Link
                                href={route('admin.outlets.shipping-zones.create', outlet.id)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    padding: '0.45rem 1rem',
                                    borderRadius: '0.375rem',
                                    background: '#B88E4B',
                                    color: '#FFFFFF',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    boxShadow: '0 1px 2px rgba(184, 142, 75, 0.2)',
                                }}
                            >
                                + Add Shipping Zone
                            </Link>
                        </div>
                    </div>

                    {!outlet.shipping_zones || outlet.shipping_zones.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: '#94A3B8' }}>
                                <TruckIcon width="22" height="22" />
                            </div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>No shipping zones configured for {outlet.name} yet.</p>
                            <p style={{ margin: '0.25rem 0 1rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                                Configure local city delivery, store pickup, and express courier for this outlet.
                            </p>
                            <Link
                                href={route('admin.outlets.shipping-zones.create', outlet.id)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.45rem 1rem',
                                    borderRadius: '0.375rem',
                                    background: '#B88E4B',
                                    color: '#FFFFFF',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                Add First Zone for {outlet.name}
                            </Link>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                                        <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                            Zone Name
                                        </th>
                                        <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                            Regions &amp; Postcodes
                                        </th>
                                        <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                            Shipping Methods &amp; Rates
                                        </th>
                                        <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>
                                            Status
                                        </th>
                                        <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {outlet.shipping_zones.map((zone) => (
                                        <tr key={zone.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                                                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.875rem' }}>
                                                    <Link
                                                        href={route('admin.outlets.shipping-zones.edit', [outlet.id, zone.id])}
                                                        style={{ color: '#0F172A', textDecoration: 'none' }}
                                                    >
                                                        {zone.zone_name}
                                                    </Link>
                                                </div>
                                                {zone.description && (
                                                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35 }}>
                                                        {zone.description}
                                                    </p>
                                                )}
                                                <span style={{ fontSize: '0.6875rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                                                    Slug: {zone.zone_slug}
                                                </span>
                                            </td>

                                            <td style={{ padding: '0.75rem', verticalAlign: 'top', maxWidth: '320px' }}>
                                                {Array.isArray(zone.zone_regions) && zone.zone_regions.length > 0 ? (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                                        {zone.zone_regions.map((region, idx) => (
                                                            <span
                                                                key={idx}
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    padding: '0.15rem 0.45rem',
                                                                    background: '#F1F5F9',
                                                                    border: '1px solid #CBD5E1',
                                                                    borderRadius: '0.25rem',
                                                                    fontSize: '0.75rem',
                                                                    color: '#1E293B',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {getRegionName(region)}
                                                                {getRegionPincode(region) && (
                                                                    <span style={{ color: '#64748B', fontSize: '0.6875rem', marginLeft: '0.2rem' }}>
                                                                        ({getRegionPincode(region)})
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontStyle: 'italic' }}>
                                                        Everywhere (Catch-All)
                                                    </span>
                                                )}

                                                {zone.zone_postcodes && (
                                                    <div style={{ marginTop: '0.35rem', fontSize: '0.6875rem', color: '#B45309', background: '#FEF3C7', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', display: 'inline-block' }}>
                                                        PIN: {zone.zone_postcodes}
                                                    </div>
                                                )}
                                            </td>

                                            <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                                                {Array.isArray(zone.methods) && zone.methods.length > 0 ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                        {zone.methods.map((method) => {
                                                            const colors = getMethodBadgeColor(method.method_type);
                                                            return (
                                                                <div
                                                                    key={method.id}
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.35rem',
                                                                        fontSize: '0.75rem',
                                                                        padding: '0.15rem 0.45rem',
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

                                            <td style={{ padding: '0.75rem', verticalAlign: 'top', textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleZoneActive(zone.id)}
                                                    style={{
                                                        border: 'none',
                                                        background: zone.is_active ? '#ECFDF5' : '#F1F5F9',
                                                        color: zone.is_active ? '#065F46' : '#64748B',
                                                        padding: '0.2rem 0.6rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {zone.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>

                                            <td style={{ padding: '0.75rem', verticalAlign: 'top', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                                    <Link
                                                        href={route('admin.outlets.shipping-zones.edit', [outlet.id, zone.id])}
                                                        style={{
                                                            padding: '0.25rem 0.55rem',
                                                            borderRadius: '0.25rem',
                                                            background: '#F1F5F9',
                                                            border: '1px solid #CBD5E1',
                                                            color: '#0F172A',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteZoneClick(zone)}
                                                        style={{
                                                            padding: '0.25rem 0.55rem',
                                                            borderRadius: '0.25rem',
                                                            background: '#FEE2E2',
                                                            border: '1px solid #FCA5A5',
                                                            color: '#DC2626',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
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

                {/* Available Products Section */}
                <div
                    style={{
                        marginTop: '2rem',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            marginBottom: '1.25rem',
                            borderBottom: '1px solid #F1F5F9',
                            paddingBottom: '0.75rem',
                        }}
                    >
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>
                                Products Available at {outlet.name}
                            </h3>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#64748B' }}>
                                Total {outlet.products?.length || outlet.products_count || 0} catalog item(s) mapped to this outlet location
                            </p>
                        </div>
                        <Link
                            href={route('admin.products.create')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.45rem 1rem',
                                borderRadius: '0.375rem',
                                background: '#B88E4B',
                                color: '#FFFFFF',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            + Create &amp; Assign Product
                        </Link>
                    </div>

                    {!outlet.products || outlet.products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B' }}>
                            <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>No products assigned to this outlet yet.</p>
                            <p style={{ margin: '0.25rem 0 1rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                                Edit existing products or create a new product to assign it to this outlet.
                            </p>
                            <Link
                                href={route('admin.products.index')}
                                style={{
                                    fontSize: '0.8125rem',
                                    color: '#B88E4B',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                Browse All Products &rarr;
                            </Link>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                                        <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                            Product
                                        </th>
                                        <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                            Category
                                        </th>
                                        <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                            Selling Price
                                        </th>
                                        <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                            Variations
                                        </th>
                                        <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {outlet.products.map((product) => (
                                        <tr key={product.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '0.375rem',
                                                            background: '#F1F5F9',
                                                            border: '1px solid #E2E8F0',
                                                            overflow: 'hidden',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {product.product_image_url || product.product_image ? (
                                                            <img
                                                                src={product.product_image_url || product.product_image}
                                                                alt={product.product_name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B88E4B', fontSize: '0.85rem' }}>
                                                                🍬
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={route('admin.products.show', product.id)}
                                                            style={{ fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}
                                                        >
                                                            {product.product_name}
                                                        </Link>
                                                        {product.product_description && (
                                                            <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {product.product_description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>
                                                {product.category ? (
                                                    <span style={{ fontSize: '0.75rem', background: '#F5EBD7', color: '#8C6226', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                                                        {product.category.category_name}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>—</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'middle', fontWeight: 700, color: '#0F172A' }}>
                                                ₹{Number(product.product_selling_price || product.product_price || 0).toFixed(2)}
                                            </td>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>
                                                {Array.isArray(product.variations) && product.variations.length > 0 ? (
                                                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                                                        {product.variations.length} sizes ({product.variations.map((v) => v.variation_name).join(', ')})
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Standard</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'middle', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                                    <Link
                                                        href={route('admin.products.edit', product.id)}
                                                        style={{
                                                            padding: '0.25rem 0.55rem',
                                                            borderRadius: '0.25rem',
                                                            background: '#F1F5F9',
                                                            border: '1px solid #CBD5E1',
                                                            color: '#0F172A',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={route('admin.products.show', product.id)}
                                                        style={{
                                                            padding: '0.25rem 0.55rem',
                                                            borderRadius: '0.25rem',
                                                            background: '#B88E4B',
                                                            color: '#FFFFFF',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        View
                                                    </Link>
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
                                Confirm Delete
                            </h3>
                            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                                {outlet.name}
                            </span>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        Are you sure you want to permanently delete the <strong>&ldquo;{outlet.name}&rdquo;</strong> outlet?
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
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
            {/* Delete Zone Confirmation Modal */}
            <Modal show={deleteZoneModalOpen} onClose={() => setDeleteZoneModalOpen(false)}>
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
                                Delete Shipping Zone?
                            </h3>
                            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                                {zoneToDelete?.zone_name} &bull; {outlet.name} Outlet
                            </span>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        Are you sure you want to delete the shipping zone <strong>&ldquo;{zoneToDelete?.zone_name}&rdquo;</strong> from {outlet.name}? All rates and methods configured under this zone will be deleted.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => setDeleteZoneModalOpen(false)}
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
                            onClick={confirmDeleteZone}
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
                            Delete Zone
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
