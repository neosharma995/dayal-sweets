import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminDataTable, { adminPrimaryBtnStyle, adminTableActionStyles } from '@/Components/Admin/AdminDataTable';
import { AlertIcon } from '@/Components/Icons';

export default function Index({ categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const filteredCategories = useMemo(() => {
        if (!search.trim()) return categories;
        const q = search.toLowerCase();
        return categories.filter((c) =>
            c.category_name?.toLowerCase().includes(q) ||
            c.category_slug?.toLowerCase().includes(q) ||
            c.category_description?.toLowerCase().includes(q)
        );
    }, [categories, search]);

    const totalProductsAcrossCategories = useMemo(
        () => categories.reduce((sum, c) => sum + (Number(c.products_count) || 0), 0),
        [categories]
    );

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!categoryToDelete) return;
        router.delete(route('admin.categories.destroy', categoryToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setCategoryToDelete(null);
            },
        });
    };

    const summaryCards = [
        {
            label: 'Total Categories',
            value: categories.length,
            subtext: 'Product departments',
            badge: 'Active',
        },
        {
            label: 'Categorized Products',
            value: totalProductsAcrossCategories,
            valueColor: '#059669',
            labelColor: '#059669',
            subtext: 'Assigned across categories',
            badge: 'Linked',
            badgeStyle: { color: '#059669', background: '#ECFDF5' },
        },
    ];

    const columns = [
        {
            key: 'category',
            label: 'Category',
            render: (category) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '0.5rem',
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            overflow: 'hidden',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {category.category_image_url || category.category_image ? (
                            <img
                                src={category.category_image_url || category.category_image}
                                alt={category.category_name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        ) : (
                            <span style={{ color: '#7A1C1C', fontWeight: 700, fontSize: '0.9rem' }}>
                                {category.category_name?.charAt(0)?.toUpperCase() || 'C'}
                            </span>
                        )}
                    </div>
                    <div>
                        <Link
                            href={route('admin.categories.show', category.id)}
                            style={{ color: '#0F172A', fontWeight: 600, textDecoration: 'none' }}
                        >
                            {category.category_name}
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {category.category_description || 'No description provided'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'slug',
            label: 'URL Slug',
            render: (category) => (
                <code style={{ padding: '0.2rem 0.45rem', borderRadius: '0.25rem', background: '#F1F5F9', color: '#7A1C1C', fontSize: '0.75rem', border: '1px solid #E2E8F0' }}>
                    /{category.category_slug}
                </code>
            ),
        },
        {
            key: 'products_count',
            label: 'Assigned Products',
            render: (category) => (
                <Link href={route('admin.categories.show', category.id)} style={{ textDecoration: 'none' }}>
                    <span
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.22rem 0.65rem',
                            borderRadius: '999px',
                            background: Number(category.products_count) > 0 ? '#ECFDF5' : '#F1F5F9',
                            color: Number(category.products_count) > 0 ? '#059669' : '#64748B',
                            border: Number(category.products_count) > 0 ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                        }}
                    >
                        {category.products_count || 0} products
                    </span>
                </Link>
            ),
        },
        {
            key: 'created_at',
            label: 'Created Date',
            render: (category) => (
                <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                    {category.created_at ? new Date(category.created_at).toLocaleDateString() : '—'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            render: (category) => (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Link
                        href={route('admin.categories.show', category.id)}
                        style={adminTableActionStyles.primary}
                        title="View Category & Products"
                    >
                        View ({category.products_count || 0})
                    </Link>
                    <Link
                        href={route('admin.categories.edit', category.id)}
                        style={adminTableActionStyles.secondary}
                        title="Edit Category"
                    >
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={() => handleDeleteClick(category)}
                        style={adminTableActionStyles.danger}
                        title="Delete Category"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout header="Product Categories">
            <Head title="Product Categories - Dayal Sweets Admin" />

            <AdminDataTable
                breadcrumb="Product Categories"
                title="Product Categories"
                subtitle="Organize mithai, namkeen, and bakery items into customer-facing departments."
                headerActions={
                    <Link href={route('admin.categories.create')} style={adminPrimaryBtnStyle}>
                        <span>+ Add New Category</span>
                    </Link>
                }
                summaryCards={summaryCards}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search category by name, slug, or description..."
                hasActiveFilters={Boolean(search.trim())}
                onResetFilters={() => setSearch('')}
                columns={columns}
                rows={filteredCategories}
                itemLabel="categories"
                emptyTitle="No categories found"
                emptySubtitle={search ? `No categories matching "${search}".` : 'Create your first product category to organize sweets.'}
                emptyAction={
                    <Link href={route('admin.categories.create')} style={adminPrimaryBtnStyle}>
                        + Create Category
                    </Link>
                }
            />

            {deleteModalOpen && categoryToDelete && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.55)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '440px',
                            width: '100%',
                            background: '#FFFFFF',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: '#FEF2F2',
                                    border: '1px solid #FECACA',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#DC2626',
                                    flexShrink: 0,
                                }}
                            >
                                <AlertIcon width="20" height="20" />
                            </div>
                            <div>
                                <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Delete Category</h4>
                                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Confirm Action</span>
                            </div>
                        </div>

                        <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                            Are you sure you want to delete category <strong>{categoryToDelete.category_name}</strong>? Associated products will have their category unlinked.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(false)}
                                style={adminTableActionStyles.secondary}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                style={{
                                    ...adminTableActionStyles.primary,
                                    background: '#DC2626',
                                }}
                            >
                                Yes, Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
