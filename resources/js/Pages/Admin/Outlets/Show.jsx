import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { MapPinIcon, PhoneIcon, AlertIcon } from '@/Components/Icons';

export default function Show({ outlet }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const confirmDelete = () => {
        router.delete(route('admin.outlets.destroy', outlet.id));
    };

    const toggleStatus = () => {
        router.patch(route('admin.outlets.toggle', outlet.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout header={`Outlet: ${outlet.name}`}>
            <Head title={`${outlet.name} - Outlet Details - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
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
        </AdminLayout>
    );
}
