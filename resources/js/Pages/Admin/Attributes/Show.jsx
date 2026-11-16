import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BoxIcon, AlertIcon, TagIcon } from '@/Components/Icons';

export default function AttributeShow({ attribute }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const values = attribute.values || [];

    const confirmDelete = () => {
        router.delete(route('admin.attributes.destroy', attribute.id));
    };

    return (
        <AdminLayout header={attribute.name}>
            <Head title={`Attribute: ${attribute.name} - Dayal Sweets Admin`} />

            <div className="dayal-container">
                {/* View Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.attributes.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Attributes
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>#{attribute.id}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <h1>{attribute.name}</h1>
                            <code style={{ padding: '0.2rem 0.5rem', borderRadius: '0.25rem', background: '#F1F5F9', color: '#B88E4B', fontSize: '0.8125rem', border: '1px solid #E2E8F0' }}>
                                /{attribute.slug}
                            </code>
                        </div>
                        <p>Detailed view of attribute configuration and associated terms used across product variations.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                            href={route('admin.attributes.edit', attribute.id)}
                            className="dayal-btn dayal-btn--primary"
                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Attribute</span>
                        </Link>
                        <Link
                            href={route('admin.attributes.index')}
                            className="dayal-admin-head-btn"
                            style={{ textDecoration: 'none' }}
                        >
                            &larr; Attributes
                        </Link>
                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(true)}
                            className="dayal-admin-head-logout"
                            style={{ cursor: 'pointer', padding: '0.5rem 0.85rem' }}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* 2-Column Detail Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>

                    {/* Left: Attribute Overview Card */}
                    <div className="dayal-admin-card">
                        <div className="dayal-admin-card-header">
                            <TagIcon width="18" height="18" style={{ color: '#B88E4B' }} />
                            <h3 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>Attribute Details</h3>
                        </div>

                        <div className="dayal-admin-info-row">
                            <span style={{ color: '#64748B' }}>Attribute Name:</span>
                            <span style={{ color: '#0F172A', fontWeight: 600 }}>{attribute.name}</span>
                        </div>

                        <div className="dayal-admin-info-row">
                            <span style={{ color: '#64748B' }}>URL Slug:</span>
                            <code style={{ color: '#B88E4B', background: '#F1F5F9', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', border: '1px solid #E2E8F0' }}>
                                {attribute.slug}
                            </code>
                        </div>

                        <div className="dayal-admin-info-row">
                            <span style={{ color: '#64748B' }}>Total Configured Terms:</span>
                            <span style={{ color: '#059669', fontWeight: 700 }}>
                                {values.length} value{values.length === 1 ? '' : 's'}
                            </span>
                        </div>

                        <div className="dayal-admin-info-row">
                            <span style={{ color: '#64748B' }}>Created Timestamp:</span>
                            <span style={{ color: '#0F172A' }}>
                                {new Date(attribute.created_at).toLocaleString()}
                            </span>
                        </div>

                        <div className="dayal-admin-info-row">
                            <span style={{ color: '#64748B' }}>Last Updated:</span>
                            <span style={{ color: '#0F172A' }}>
                                {new Date(attribute.updated_at).toLocaleString()}
                            </span>
                        </div>

                        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                                Description / Usage Note
                            </span>
                            <p style={{ color: '#334155', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                                {attribute.description || 'No description provided for this attribute.'}
                            </p>
                        </div>
                    </div>

                    {/* Right: Values / Terms List Card */}
                    <div className="dayal-admin-card">
                        <div className="dayal-admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BoxIcon width="18" height="18" style={{ color: '#B88E4B' }} />
                                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>
                                    Configured Values ({values.length})
                                </h3>
                            </div>
                            <Link
                                href={route('admin.attributes.edit', attribute.id)}
                                style={{ fontSize: '0.75rem', color: '#B88E4B', textDecoration: 'none', fontWeight: 600 }}
                            >
                                + Manage Terms &rarr;
                            </Link>
                        </div>

                        {values.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B' }}>
                                <BoxIcon width="36" height="36" style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                                <p style={{ fontSize: '0.8125rem', margin: 0 }}>No values configured for this attribute yet.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left', background: '#F8FAFC' }}>
                                            <th style={{ padding: '0.5rem 0.6rem' }}>Term / Value</th>
                                            <th style={{ padding: '0.5rem 0.6rem' }}>Slug</th>
                                            <th style={{ padding: '0.5rem 0.6rem', textAlign: 'right' }}>Badge Preview</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {values.map((v) => (
                                            <tr key={v.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                <td style={{ padding: '0.6rem', color: '#0F172A', fontWeight: 600 }}>
                                                    {v.value}
                                                </td>
                                                <td style={{ padding: '0.6rem', color: '#64748B' }}>
                                                    <code style={{ fontSize: '0.75rem', color: '#334155' }}>{v.slug}</code>
                                                </td>
                                                <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                                                    <span
                                                        style={{
                                                            padding: '0.2rem 0.65rem',
                                                            borderRadius: '999px',
                                                            background: '#F5EBD7',
                                                            border: '1px solid rgba(184, 142, 75, 0.4)',
                                                            color: '#8C6226',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {v.value}
                                                    </span>
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
                {deleteModalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(15, 23, 42, 0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem',
                        }}
                    >
                        <div
                            className="dayal-admin-card"
                            style={{ maxWidth: '440px', width: '100%', background: '#FFFFFF', border: '1px solid #CBD5E1', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#FFF1F2',
                                        border: '1px solid #FECDD3',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#E11D48',
                                        flexShrink: 0,
                                    }}
                                >
                                    <AlertIcon width="20" height="20" />
                                </div>
                                <div>
                                    <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.1rem' }}>Delete Attribute</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Are you sure?</span>
                                </div>
                            </div>

                            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                                This will permanently delete <strong>{attribute.name}</strong> and all its associated terms.
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="dayal-admin-head-btn"
                                    style={{ cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        borderRadius: '0.375rem',
                                        background: '#E11D48',
                                        color: '#FFFFFF',
                                        fontWeight: 600,
                                        fontSize: '0.8125rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
