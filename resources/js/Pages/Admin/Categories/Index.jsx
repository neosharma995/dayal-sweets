import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BoxIcon, AlertIcon } from '@/Components/Icons';

export default function Index({ categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const filteredCategories = categories.filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            c.category_name?.toLowerCase().includes(q) ||
            c.category_slug?.toLowerCase().includes(q) ||
            c.category_description?.toLowerCase().includes(q)
        );
    });

    const totalProductsAcrossCategories = categories.reduce(
        (sum, c) => sum + (Number(c.products_count) || 0),
        0
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

    return (
        <AdminLayout header="Product Categories">
            <Head title="Product Categories - Dayal Sweets Admin" />

            <div className="dayal-container">
                {/* View Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1>Product Categories</h1>
                        <p>Organize mithai, namkeen, and bakery items into customer-facing departments.</p>
                    </div>

                    <Link
                        href={route('admin.categories.create')}
                        className="dayal-btn dayal-btn--primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New Category</span>
                    </Link>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Total Categories</span>
                            <span className="dayal-stat-badge">Active</span>
                        </div>
                        <div className="dayal-stat-value">{categories.length}</div>
                        <div className="dayal-stat-subtext">Product departments</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Categorized Products</span>
                            <span className="dayal-stat-badge" style={{ color: '#34D399', background: 'rgba(5, 150, 105, 0.15)' }}>Linked</span>
                        </div>
                        <div className="dayal-stat-value">{totalProductsAcrossCategories}</div>
                        <div className="dayal-stat-subtext">Assigned across categories</div>
                    </div>
                </div>

                {/* Categories Table Card */}
                <div className="dayal-admin-table-card">
                    <div className="dayal-admin-table-head" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3>All Store Departments</h3>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                Showing {filteredCategories.length} of {categories.length} total categories
                            </span>
                        </div>

                        {/* Search Input */}
                        <div style={{ position: 'relative', minWidth: '260px' }}>
                            <input
                                type="text"
                                placeholder="Search category by name or slug..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 1rem 0.5rem 2.25rem',
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
                                stroke="#94a3b8"
                                viewBox="0 0 24 24"
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                    }}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="dayal-admin-table-wrap">
                        {filteredCategories.length === 0 ? (
                            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                                <BoxIcon width="48" height="48" style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                <h4 style={{ color: '#F8FAFC', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No categories found</h4>
                                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                    {search ? `No categories matching "${search}".` : 'Create your first product category to organize sweets.'}
                                </p>
                                <Link
                                    href={route('admin.categories.create')}
                                    className="dayal-btn dayal-btn--primary"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Create Category
                                </Link>
                            </div>
                        ) : (
                            <table className="dayal-admin-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>URL Slug</th>
                                        <th>Assigned Products</th>
                                        <th>Created Date</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.map((category) => (
                                        <tr key={category.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                                    <div
                                                        style={{
                                                            width: '44px',
                                                            height: '44px',
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
                                                            <span style={{ color: '#B88E4B', fontWeight: 800 }}>
                                                                {category.category_name.charAt(0)}
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
                                            </td>
                                            <td>
                                                <code style={{ padding: '0.2rem 0.4rem', borderRadius: '0.25rem', background: '#F1F5F9', color: '#B88E4B', fontSize: '0.75rem' }}>
                                                    /{category.category_slug}
                                                </code>
                                            </td>
                                            <td>
                                                <Link
                                                    href={route('admin.categories.show', category.id)}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            padding: '0.25rem 0.65rem',
                                                            borderRadius: '999px',
                                                            background: Number(category.products_count) > 0
                                                                ? 'rgba(5, 150, 105, 0.12)'
                                                                : 'rgba(148, 163, 184, 0.12)',
                                                            color: Number(category.products_count) > 0
                                                                ? '#34D399'
                                                                : '#94A3B8',
                                                        }}
                                                    >
                                                        {category.products_count || 0} products
                                                    </span>
                                                </Link>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                    {new Date(category.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <Link
                                                        href={route('admin.categories.show', category.id)}
                                                        className="dayal-admin-head-btn"
                                                        title="View Category & Products"
                                                        style={{ textDecoration: 'none', padding: '0.35rem 0.6rem' }}
                                                    >
                                                        View ({category.products_count || 0})
                                                    </Link>
                                                    <Link
                                                        href={route('admin.categories.edit', category.id)}
                                                        className="dayal-admin-head-btn"
                                                        title="Edit Category"
                                                        style={{ textDecoration: 'none', padding: '0.35rem 0.6rem', color: '#F1D7B4', borderColor: 'rgba(184, 142, 75, 0.3)' }}
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(category)}
                                                        className="dayal-admin-head-logout"
                                                        title="Delete Category"
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
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModalOpen && categoryToDelete && (
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
                                    <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.1rem' }}>Delete Category</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Confirm Action</span>
                                </div>
                            </div>

                            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                                Are you sure you want to delete category <strong>{categoryToDelete.category_name}</strong>?
                                Associated products will have their category unlinked.
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
                                    Yes, Delete Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
