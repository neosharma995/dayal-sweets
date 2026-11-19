import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminDataTable, { adminPrimaryBtnStyle, adminTableActionStyles } from '@/Components/Admin/AdminDataTable';
import { AlertIcon } from '@/Components/Icons';

export default function Index({ occasions = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredItems = useMemo(() => {
        if (!search.trim()) return occasions;
        const q = search.toLowerCase();
        return occasions.filter((c) =>
            c.category_name?.toLowerCase().includes(q) ||
            c.category_slug?.toLowerCase().includes(q) ||
            c.category_description?.toLowerCase().includes(q)
        );
    }, [occasions, search]);

    const totalProducts = useMemo(
        () => occasions.reduce((sum, c) => sum + (Number(c.products_count) || 0), 0),
        [occasions]
    );

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        router.delete(route('admin.occasions.destroy', itemToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setItemToDelete(null);
            },
        });
    };

    const summaryCards = [
        {
            label: 'Total Occasions',
            value: occasions.length,
            subtext: 'Celebration occasions',
            badge: 'Active',
        },
        {
            label: 'Linked Sweets',
            value: totalProducts,
            valueColor: '#059669',
            labelColor: '#059669',
            subtext: 'Products under occasions',
            badge: 'Linked',
            badgeStyle: { color: '#059669', background: '#ECFDF5' },
        },
    ];

    const columns = [
        {
            key: 'name',
            label: 'Occasion Name',
            render: (item) => <strong style={{ color: '#0F172A' }}>{item.category_name}</strong>,
        },
        {
            key: 'slug',
            label: 'Slug',
            render: (item) => (
                <code style={{ padding: '0.2rem 0.45rem', borderRadius: '0.25rem', background: '#F1F5F9', color: '#7A1C1C', fontSize: '0.75rem', border: '1px solid #E2E8F0' }}>
                    /{item.category_slug}
                </code>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            render: (item) => (
                <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>
                    {item.category_description || '—'}
                </span>
            ),
        },
        {
            key: 'products_count',
            label: 'Products Count',
            render: (item) => (
                <span
                    style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.22rem 0.65rem',
                        borderRadius: '999px',
                        background: '#ECFDF5',
                        color: '#059669',
                        border: '1px solid #A7F3D0',
                    }}
                >
                    {item.products_count || 0} products
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            render: (item) => (
                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <Link href={route('admin.occasions.edit', item.id)} style={adminTableActionStyles.secondary}>
                        Edit
                    </Link>
                    <button type="button" onClick={() => handleDeleteClick(item)} style={adminTableActionStyles.danger}>
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout header="Occasion Categories">
            <Head title="Occasion Categories - Dayal Sweets Admin" />

            <AdminDataTable
                breadcrumb="Occasion Categories"
                title="Occasion Categories"
                subtitle="Manage celebrations and gifting occasions (e.g. Birthday, Wedding, Anniversary, Festival)."
                headerActions={
                    <Link href={route('admin.occasions.create')} style={adminPrimaryBtnStyle}>
                        <span>+ Add Occasion Category</span>
                    </Link>
                }
                summaryCards={summaryCards}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search occasion by name or slug..."
                hasActiveFilters={Boolean(search.trim())}
                onResetFilters={() => setSearch('')}
                columns={columns}
                rows={filteredItems}
                itemLabel="occasion categories"
                emptyTitle="No occasion categories found."
                emptySubtitle="Create your first occasion category for celebrations and gifting."
                emptyAction={
                    <Link href={route('admin.occasions.create')} style={adminPrimaryBtnStyle}>
                        + Add Occasion Category
                    </Link>
                }
            />

            {deleteModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '440px', width: '100%', border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <AlertIcon width="24" height="24" style={{ color: '#DC2626' }} />
                            <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.05rem', fontWeight: 700 }}>Delete Occasion</h3>
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            Are you sure you want to delete <strong>{itemToDelete?.category_name}</strong>?
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button type="button" style={adminTableActionStyles.secondary} onClick={() => setDeleteModalOpen(false)}>
                                Cancel
                            </button>
                            <button type="button" style={{ ...adminTableActionStyles.primary, background: '#DC2626' }} onClick={confirmDelete}>
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
