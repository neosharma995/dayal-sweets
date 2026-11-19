import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminDataTable, { adminPrimaryBtnStyle, adminTableActionStyles } from '@/Components/Admin/AdminDataTable';
import { AlertIcon } from '@/Components/Icons';

export default function Index({ productTags = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredItems = useMemo(() => {
        if (!search.trim()) return productTags;
        const q = search.toLowerCase();
        return productTags.filter((t) =>
            t.product_tag_name?.toLowerCase().includes(q) ||
            t.product_tag_slug?.toLowerCase().includes(q) ||
            t.product_tag_description?.toLowerCase().includes(q)
        );
    }, [productTags, search]);

    const totalProducts = useMemo(
        () => productTags.reduce((sum, t) => sum + (Number(t.products_count) || 0), 0),
        [productTags]
    );

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        router.delete(route('admin.product-tags.destroy', itemToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setItemToDelete(null);
            },
        });
    };

    const summaryCards = [
        {
            label: 'Total Tags',
            value: productTags.length,
            subtext: 'Highlight tags & badges',
            badge: 'Active',
        },
        {
            label: 'Tagged Products',
            value: totalProducts,
            valueColor: '#059669',
            labelColor: '#059669',
            subtext: 'Products carrying tags',
            badge: 'Linked',
            badgeStyle: { color: '#059669', background: '#ECFDF5' },
        },
    ];

    const columns = [
        {
            key: 'name',
            label: 'Tag Name',
            render: (item) => <strong style={{ color: '#0F172A' }}>{item.product_tag_name}</strong>,
        },
        {
            key: 'slug',
            label: 'Slug',
            render: (item) => (
                <code style={{ padding: '0.2rem 0.45rem', borderRadius: '0.25rem', background: '#F1F5F9', color: '#7A1C1C', fontSize: '0.75rem', border: '1px solid #E2E8F0' }}>
                    /{item.product_tag_slug}
                </code>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            render: (item) => (
                <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>
                    {item.product_tag_description || '—'}
                </span>
            ),
        },
        {
            key: 'products_count',
            label: 'Tagged Products',
            align: 'center',
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
                    <Link href={route('admin.product-tags.edit', item.id)} style={adminTableActionStyles.secondary}>
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
        <AdminLayout header="Product Tags">
            <Head title="Product Tags - Dayal Sweets Admin" />

            <AdminDataTable
                breadcrumb="Product Tags"
                title="Product Tags"
                subtitle="Manage product highlight badges like Bestseller, Pure Desi Ghee, Handcrafted, and Festive Special."
                headerActions={
                    <Link href={route('admin.product-tags.create')} style={adminPrimaryBtnStyle}>
                        <span>+ Add Product Tag</span>
                    </Link>
                }
                summaryCards={summaryCards}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by tag name or slug..."
                hasActiveFilters={Boolean(search.trim())}
                onResetFilters={() => setSearch('')}
                columns={columns}
                rows={filteredItems}
                itemLabel="product tags"
                emptyTitle="No product tags found."
                emptySubtitle="Create your first product highlight tag."
                emptyAction={
                    <Link href={route('admin.product-tags.create')} style={adminPrimaryBtnStyle}>
                        + Add Product Tag
                    </Link>
                }
            />

            {deleteModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '440px', width: '100%', border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <AlertIcon width="24" height="24" style={{ color: '#DC2626' }} />
                            <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.05rem', fontWeight: 700 }}>Delete Product Tag</h3>
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            Are you sure you want to delete <strong>{itemToDelete?.product_tag_name}</strong>?
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
