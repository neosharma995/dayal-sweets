import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BoxIcon, AlertIcon, TagIcon } from '@/Components/Icons';

export default function AttributeIndex({ attributes, filters = {}, totalAttributes = 0, totalValues = 0 }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [attributeToDelete, setAttributeToDelete] = useState(null);

    const items = attributes?.data || [];

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(
            route('admin.attributes.index'),
            { search: search.trim() || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get(
            route('admin.attributes.index'),
            {},
            { preserveState: true, replace: true }
        );
    };

    const handleDeleteClick = (attribute) => {
        setAttributeToDelete(attribute);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!attributeToDelete) return;
        router.delete(route('admin.attributes.destroy', attributeToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setAttributeToDelete(null);
            },
        });
    };

    return (
        <AdminLayout header="Product Attributes">
            <Head title="Product Attributes - Dayal Sweets Admin" />

            <div className="dayal-container">
                {/* Header Title & Action Button */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <Link href={route('admin.dashboard')} style={{ color: '#94a3b8', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Dashboard
                            </Link>
                            <span style={{ color: '#475569', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#F1D7B4', fontSize: '0.8125rem', fontWeight: 600 }}>Attributes</span>
                        </div>
                        <h1>Product Attributes</h1>
                        <p>Manage reusable attributes (e.g. Weight, Packaging Type) and their terms to configure variations in products.</p>
                    </div>

                    <Link
                        href={route('admin.attributes.create')}
                        className="dayal-btn dayal-btn--primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New Attribute</span>
                    </Link>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Total Attributes</span>
                            <span className="dayal-stat-badge">Active</span>
                        </div>
                        <div className="dayal-stat-value">{totalAttributes ?? attributes?.total ?? items.length}</div>
                        <div className="dayal-stat-subtext">Weight, Packaging, Sizes, etc.</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Configured Values</span>
                            <span className="dayal-stat-badge" style={{ color: '#F1D7B4', background: 'rgba(184, 142, 75, 0.15)' }}>Terms</span>
                        </div>
                        <div className="dayal-stat-value" style={{ color: '#F1D7B4' }}>{totalValues}</div>
                        <div className="dayal-stat-subtext">Reusable across product variations</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Integration Mode</span>
                            <span className="dayal-stat-badge" style={{ color: '#34D399', background: 'rgba(5, 150, 105, 0.15)' }}>Direct</span>
                        </div>
                        <div className="dayal-stat-value" style={{ fontSize: '1.25rem', marginTop: '0.85rem', color: '#E2E8F0' }}>
                            In Product Forms
                        </div>
                        <div className="dayal-stat-subtext">Linked directly during product creation</div>
                    </div>
                </div>

                {/* Attributes Table Card */}
                <div className="dayal-admin-table-card">
                    <div className="dayal-admin-table-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>All Global Attributes</h3>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                Showing {items.length} of {attributes?.total ?? items.length} total attributes
                            </span>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', minWidth: '260px', display: 'flex', gap: '0.5rem' }}>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <input
                                    type="text"
                                    placeholder="Search attribute by name or slug..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 1.75rem 0.5rem 2.25rem',
                                        borderRadius: '0.5rem',
                                        background: '#FFFFFF',
                                        border: '1px solid #CBD5E1',
                                        color: '#0F172A',
                                        fontSize: '0.8125rem',
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
                                {search && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        style={{
                                            position: 'absolute',
                                            right: '0.65rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#64748B',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            lineHeight: 1,
                                        }}
                                        title="Clear search"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="dayal-admin-head-btn"
                                style={{ cursor: 'pointer', padding: '0.5rem 0.85rem' }}
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    <div className="dayal-admin-table-wrap">
                        {items.length === 0 ? (
                            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                                <BoxIcon width="48" height="48" style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                <h4 style={{ color: '#F8FAFC', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No attributes found</h4>
                                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                    {filters?.search ? `No attributes matching "${filters.search}".` : 'Create your first attribute (e.g. Weight or Packaging Type).'}
                                </p>
                                <Link
                                    href={route('admin.attributes.create')}
                                    className="dayal-btn dayal-btn--primary"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Create Attribute
                                </Link>
                            </div>
                        ) : (
                            <table className="dayal-admin-table">
                                <thead>
                                    <tr>
                                        <th>Attribute Details</th>
                                        <th>Slug Identifier</th>
                                        <th>Configured Values / Terms</th>
                                        <th>Total Values</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((attr) => {
                                        const values = attr.values || [];
                                        const displayValues = values.slice(0, 5);
                                        const remainingCount = values.length - displayValues.length;

                                        return (
                                            <tr key={attr.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                                        <div
                                                            style={{
                                                                width: '42px',
                                                                height: '42px',
                                                                borderRadius: '0.5rem',
                                                                background: '#F8FAFC',
                                                                border: '1px solid #E2E8F0',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#B88E4B',
                                                                fontWeight: 700,
                                                                fontSize: '0.875rem',
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            <TagIcon width="18" height="18" style={{ color: '#B88E4B' }} />
                                                        </div>
                                                        <div>
                                                            <Link
                                                                href={route('admin.attributes.show', attr.id)}
                                                                style={{ color: '#0F172A', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}
                                                            >
                                                                {attr.name}
                                                            </Link>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                                                                {attr.description || 'No description provided.'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <code style={{ padding: '0.2rem 0.45rem', borderRadius: '0.25rem', background: '#F1F5F9', color: '#B88E4B', fontSize: '0.75rem', border: '1px solid #E2E8F0' }}>
                                                        /{attr.slug}
                                                    </code>
                                                </td>

                                                <td>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxWidth: '360px', alignItems: 'center' }}>
                                                        {displayValues.length > 0 ? (
                                                            displayValues.map((v) => (
                                                                <span
                                                                    key={v.id}
                                                                    style={{
                                                                        padding: '0.2rem 0.55rem',
                                                                        borderRadius: '999px',
                                                                        background: '#F8FAFC',
                                                                        border: '1px solid #CBD5E1',
                                                                        color: '#0F172A',
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    {v.value}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span style={{ color: '#64748B', fontSize: '0.75rem', fontStyle: 'italic' }}>
                                                                No values configured
                                                            </span>
                                                        )}

                                                        {remainingCount > 0 && (
                                                            <Link
                                                                href={route('admin.attributes.show', attr.id)}
                                                                style={{
                                                                    fontSize: '0.7rem',
                                                                    color: '#B88E4B',
                                                                    textDecoration: 'none',
                                                                    padding: '0.15rem 0.45rem',
                                                                    borderRadius: '999px',
                                                                    background: 'rgba(184, 142, 75, 0.1)',
                                                                }}
                                                            >
                                                                +{remainingCount} more
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            padding: '0.25rem 0.65rem',
                                                            borderRadius: '999px',
                                                            background: values.length > 0 ? 'rgba(5, 150, 105, 0.12)' : 'rgba(148, 163, 184, 0.12)',
                                                            color: values.length > 0 ? '#34D399' : '#94A3B8',
                                                        }}
                                                    >
                                                        {values.length} term{values.length === 1 ? '' : 's'}
                                                    </span>
                                                </td>

                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <Link
                                                            href={route('admin.attributes.show', attr.id)}
                                                            className="dayal-admin-head-btn"
                                                            title="View Attribute & Terms"
                                                            style={{ textDecoration: 'none', padding: '0.35rem 0.65rem' }}
                                                        >
                                                            View
                                                        </Link>

                                                        <Link
                                                            href={route('admin.attributes.edit', attr.id)}
                                                            className="dayal-admin-head-btn"
                                                            title="Edit Attribute"
                                                            style={{
                                                                textDecoration: 'none',
                                                                padding: '0.35rem 0.65rem',
                                                                color: '#F1D7B4',
                                                                borderColor: 'rgba(184, 142, 75, 0.3)',
                                                            }}
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteClick(attr)}
                                                            className="dayal-admin-head-logout"
                                                            title="Delete Attribute"
                                                            style={{
                                                                padding: '0.35rem 0.65rem',
                                                                border: '1px solid rgba(225, 29, 72, 0.3)',
                                                                background: 'rgba(225, 29, 72, 0.12)',
                                                                color: '#FB7185',
                                                                cursor: 'pointer',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.35rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    {attributes?.links && attributes.links.length > 3 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', padding: '1.25rem', borderTop: '1px solid #1E293B' }}>
                            {attributes.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    style={{
                                        padding: '0.4rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        background: link.active ? '#B88E4B' : '#0F172A',
                                        color: link.active ? '#0F172A' : link.url ? '#CBD5E1' : '#64748B',
                                        fontWeight: link.active ? 700 : 500,
                                        fontSize: '0.8125rem',
                                        textDecoration: 'none',
                                        border: '1px solid #334155',
                                        pointerEvents: link.url ? 'auto' : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModalOpen && attributeToDelete && (
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
                                This will permanently delete the attribute <strong>{attributeToDelete.name}</strong> and its values. Any variations linked to this attribute will have their attribute association detached.
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
