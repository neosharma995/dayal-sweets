import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { AlertIcon } from '@/Components/Icons';

export default function Index({ occasions = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredItems = occasions.filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            c.category_name?.toLowerCase().includes(q) ||
            c.category_slug?.toLowerCase().includes(q) ||
            c.category_description?.toLowerCase().includes(q)
        );
    });

    const totalProducts = occasions.reduce(
        (sum, c) => sum + (Number(c.products_count) || 0),
        0
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

    return (
        <AdminLayout header="Occasion Categories">
            <Head title="Occasion Categories - Dayal Sweets Admin" />

            <div className="dayal-container">
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1>Occasion Categories</h1>
                        <p>Manage celebrations and gifting occasions (e.g. Birthday, Wedding, Anniversary, Festival).</p>
                    </div>

                    <Link
                        href={route('admin.occasions.create')}
                        className="dayal-btn dayal-btn--primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Occasion Category</span>
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Total Occasions</span>
                            <span className="dayal-stat-badge">Active</span>
                        </div>
                        <div className="dayal-stat-value">{occasions.length}</div>
                        <div className="dayal-stat-subtext">Celebration occasions</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Linked Sweets</span>
                            <span className="dayal-stat-badge" style={{ color: '#34D399', background: 'rgba(5, 150, 105, 0.15)' }}>Linked</span>
                        </div>
                        <div className="dayal-stat-value">{totalProducts}</div>
                        <div className="dayal-stat-subtext">Products under occasions</div>
                    </div>
                </div>

                <div className="dayal-admin-table-card">
                    <div className="dayal-admin-table-head" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3>All Occasions</h3>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                Showing {filteredItems.length} of {occasions.length} total
                            </span>
                        </div>

                        <div style={{ position: 'relative', minWidth: '260px' }}>
                            <input
                                type="text"
                                placeholder="Search occasion..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="dayal-admin-search-input"
                            />
                        </div>
                    </div>

                    <div className="dayal-admin-table-responsive">
                        <table className="dayal-admin-table">
                            <thead>
                                <tr>
                                    <th>Occasion Name</th>
                                    <th>Slug</th>
                                    <th>Description</th>
                                    <th>Products Count</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                            No occasion categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <strong style={{ color: '#F8FAFC' }}>{item.category_name}</strong>
                                            </td>
                                            <td>
                                                <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                                                    {item.category_slug}
                                                </code>
                                            </td>
                                            <td style={{ color: '#94a3b8', maxWidth: '300px' }}>
                                                {item.category_description || '—'}
                                            </td>
                                            <td>
                                                <span className="dayal-admin-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                                                    {item.products_count || 0} products
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                                    <Link
                                                        href={route('admin.occasions.edit', item.id)}
                                                        className="dayal-btn dayal-btn--secondary dayal-btn--sm"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="dayal-btn dayal-btn--danger dayal-btn--sm"
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

            {deleteModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#1E293B', borderRadius: '12px', padding: '1.5rem', maxWidth: '440px', width: '100%', border: '1px solid #334155' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <AlertIcon width="24" height="24" style={{ color: '#EF4444' }} />
                            <h3 style={{ margin: 0, color: '#F8FAFC' }}>Delete Occasion</h3>
                        </div>
                        <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            Are you sure you want to delete <strong>{itemToDelete?.category_name}</strong>?
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button type="button" className="dayal-btn dayal-btn--secondary" onClick={() => setDeleteModalOpen(false)}>
                                Cancel
                            </button>
                            <button type="button" className="dayal-btn dayal-btn--danger" onClick={confirmDelete}>
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
