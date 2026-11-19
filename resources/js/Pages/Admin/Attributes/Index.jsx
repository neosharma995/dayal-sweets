import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminDataTable, { adminPrimaryBtnStyle, adminTableActionStyles } from '@/Components/Admin/AdminDataTable';
import { AlertIcon, TagIcon } from '@/Components/Icons';

export default function AttributeIndex({ attributes, filters = {}, totalAttributes = 0, totalValues = 0 }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [attributeToDelete, setAttributeToDelete] = useState(null);

    const items = attributes?.data || [];

    const handleSearchSubmit = (val) => {
        router.get(
            route('admin.attributes.index'),
            { search: val?.trim() || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleResetFilters = () => {
        setSearch('');
        router.get(route('admin.attributes.index'), {}, { preserveState: true, replace: true });
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

    const summaryCards = [
        {
            label: 'Total Attributes',
            value: totalAttributes ?? attributes?.total ?? items.length,
            subtext: 'Weight, Packaging, Sizes, etc.',
            badge: 'Active',
        },
        {
            label: 'Configured Values',
            value: totalValues,
            valueColor: '#7A1C1C',
            labelColor: '#7A1C1C',
            subtext: 'Reusable across product variations',
            badge: 'Terms',
            badgeStyle: { color: '#7A1C1C', background: '#FEF2F2' },
        },
        {
            label: 'Integration Mode',
            value: 'Direct',
            valueColor: '#059669',
            labelColor: '#059669',
            subtext: 'Linked directly during product creation',
            badge: 'In Forms',
            badgeStyle: { color: '#059669', background: '#ECFDF5' },
        },
    ];

    const columns = [
        {
            key: 'attribute',
            label: 'Attribute Details',
            render: (attr) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                        style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '0.5rem',
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#7A1C1C',
                            flexShrink: 0,
                        }}
                    >
                        <TagIcon width="16" height="16" />
                    </div>
                    <div>
                        <Link
                            href={route('admin.attributes.show', attr.id)}
                            style={{ color: '#0F172A', fontWeight: 600, textDecoration: 'none' }}
                        >
                            {attr.name}
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {attr.description || 'No description provided.'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'slug',
            label: 'Slug Identifier',
            render: (attr) => (
                <code style={{ padding: '0.2rem 0.45rem', borderRadius: '0.25rem', background: '#F1F5F9', color: '#7A1C1C', fontSize: '0.75rem', border: '1px solid #E2E8F0' }}>
                    /{attr.slug}
                </code>
            ),
        },
        {
            key: 'values',
            label: 'Configured Values / Terms',
            render: (attr) => {
                const values = attr.values || [];
                const displayValues = values.slice(0, 5);
                const remainingCount = values.length - displayValues.length;
                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxWidth: '340px', alignItems: 'center' }}>
                        {displayValues.length > 0 ? (
                            displayValues.map((v) => (
                                <span
                                    key={v.id}
                                    style={{
                                        padding: '0.18rem 0.5rem',
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
                            <span style={{ color: '#64748B', fontSize: '0.75rem', fontStyle: 'italic' }}>No values configured</span>
                        )}
                        {remainingCount > 0 && (
                            <Link
                                href={route('admin.attributes.show', attr.id)}
                                style={{ fontSize: '0.72rem', color: '#7A1C1C', fontWeight: 600, textDecoration: 'none' }}
                            >
                                +{remainingCount} more
                            </Link>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'count',
            label: 'Total Values',
            render: (attr) => {
                const count = (attr.values || []).length;
                return (
                    <span
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.22rem 0.65rem',
                            borderRadius: '999px',
                            background: count > 0 ? '#ECFDF5' : '#F1F5F9',
                            color: count > 0 ? '#059669' : '#64748B',
                            border: count > 0 ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                        }}
                    >
                        {count} term{count === 1 ? '' : 's'}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            render: (attr) => (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Link href={route('admin.attributes.show', attr.id)} style={adminTableActionStyles.primary}>
                        View
                    </Link>
                    <Link href={route('admin.attributes.edit', attr.id)} style={adminTableActionStyles.secondary}>
                        Edit
                    </Link>
                    <button type="button" onClick={() => handleDeleteClick(attr)} style={adminTableActionStyles.danger}>
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout header="Product Attributes">
            <Head title="Product Attributes - Dayal Sweets Admin" />

            <AdminDataTable
                breadcrumb="Product Attributes"
                title="Product Attributes"
                subtitle="Manage reusable attributes (e.g. Weight, Packaging Type) and their terms to configure variations in products."
                headerActions={
                    <Link href={route('admin.attributes.create')} style={adminPrimaryBtnStyle}>
                        <span>+ Add New Attribute</span>
                    </Link>
                }
                summaryCards={summaryCards}
                search={search}
                onSearchChange={setSearch}
                onSearchSubmit={handleSearchSubmit}
                searchPlaceholder="Search attribute by name or slug..."
                hasActiveFilters={Boolean(filters?.search || search.trim())}
                onResetFilters={handleResetFilters}
                columns={columns}
                rows={items}
                paginator={attributes}
                showPerPage={false}
                itemLabel="attributes"
                emptyTitle="No attributes found"
                emptySubtitle={filters?.search ? `No attributes matching "${filters.search}".` : 'Create your first attribute (e.g. Weight or Packaging Type).'}
                emptyAction={
                    <Link href={route('admin.attributes.create')} style={adminPrimaryBtnStyle}>
                        + Create Attribute
                    </Link>
                }
            />

            {deleteModalOpen && attributeToDelete && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ maxWidth: '440px', width: '100%', background: '#FFFFFF', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <AlertIcon width="24" height="24" style={{ color: '#DC2626' }} />
                            <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Delete Attribute</h4>
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                            This will permanently delete the attribute <strong>{attributeToDelete.name}</strong> and its values. Any variations linked to this attribute will have their attribute association detached.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button type="button" onClick={() => setDeleteModalOpen(false)} style={adminTableActionStyles.secondary}>
                                Cancel
                            </button>
                            <button type="button" onClick={confirmDelete} style={{ ...adminTableActionStyles.primary, background: '#DC2626' }}>
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
