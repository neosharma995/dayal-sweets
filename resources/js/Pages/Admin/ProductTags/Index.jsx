import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { AlertIcon, TagIcon } from '@/Components/Icons';

export default function Index({ productTags = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredItems = productTags.filter((t) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            t.product_tag_name?.toLowerCase().includes(q) ||
            t.product_tag_slug?.toLowerCase().includes(q) ||
            t.product_tag_description?.toLowerCase().includes(q)
        );
    });

    const totalProducts = productTags.reduce(
        (sum, t) => sum + (Number(t.products_count) || 0),
        0
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

    return (
        <AdminLayout header="Product Tags">
            <Head title="Product Tags - Dayal Sweets Admin" />

            <div className="dayal-container">
                {/* View Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1>Product Tags</h1>
                        <p>Manage product highlight badges like Bestseller, Pure Desi Ghee, Handcrafted, and Festive Special.</p>
                    </div>

                    <Link
                        href={route('admin.product-tags.create')}
                        className="dayal-btn dayal-btn--primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Product Tag</span>
                    </Link>
                </div>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Total Tags</span>
                            <span className="dayal-stat-badge">Active</span>
                        </div>
                        <div className="dayal-stat-value">{productTags.length}</div>
                        <div className="dayal-stat-subtext">Highlight tags & badges</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Tagged Products</span>
                            <span className="dayal-stat-badge" style={{ color: '#34D399', background: 'rgba(5, 150, 105, 0.15)' }}>Linked</span>
                        </div>
                        <div className="dayal-stat-value">{totalProducts}</div>
                        <div className="dayal-stat-subtext">Products carrying tags</div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="dayal-admin-table-card">
                    <div className="dayal-admin-table-head" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3>All Tags</h3>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                Showing {filteredItems.length} of {productTags.length} total
                            </span>
                        </div>

                        <div style={{ position: 'relative', minWidth: '260px' }}>
                            <input
                                type="text"
                                placeholder="Search by tag name or slug..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="dayal-form-input"
                                style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
                            />
                            <svg
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="dayal-admin-table-wrapper">
                        <table className="dayal-admin-table">
                            <thead>
                                <tr>
                                    <th>Tag Name</th>
                                    <th>Slug</th>
                                    <th>Description</th>
                                    <th style={{ textAlign: 'center' }}>Tagged Products</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                                            No product tags found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <span style={{ display: 'inline-block', padding: '0.25rem 0.65rem', background: '#FDF8F0', border: '1px solid #E6D2B5', borderRadius: '9999px', color: '#8C6226', fontWeight: 600, fontSize: '0.75rem' }}>
                                                        {item.product_tag_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748B' }}>
                                                {item.product_tag_slug}
                                            </td>
                                            <td style={{ maxWidth: '280px', fontSize: '0.8125rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.product_tag_description || '—'}
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 600 }}>
                                                {item.products_count ?? 0}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <Link
                                                        href={route('admin.product-tags.edit', item.id)}
                                                        className="dayal-admin-action-btn"
                                                        title="Edit Tag"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="dayal-admin-action-btn delete"
                                                        title="Delete Tag"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {deleteModalOpen && itemToDelete && (
                <div className="dayal-admin-modal-overlay">
                    <div className="dayal-admin-modal" style={{ maxWidth: '420px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                                <AlertIcon width="24" height="24" />
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                                Delete Tag?
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
                                Are you sure you want to delete tag <strong>{itemToDelete.product_tag_name}</strong>?
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(false)}
                                className="dayal-btn dayal-btn--secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="dayal-btn"
                                style={{ background: '#EF4444', color: '#FFFFFF', borderColor: '#EF4444' }}
                            >
                                Delete Tag
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
