import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BoxIcon, AlertIcon } from '@/Components/Icons';

export default function Show({ category }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const products = Array.isArray(category.products) ? category.products : [];

    const confirmDelete = () => {
        router.delete(route('admin.categories.destroy', category.id));
    };

    return (
        <AdminLayout header={`Category: ${category.category_name}`}>
            <Head title={`${category.category_name} - Dayal Sweets Admin`} />

            <div className="dayal-container">
                {/* View Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.categories.index')} style={{ color: '#94a3b8', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Categories
                            </Link>
                            <span style={{ color: '#475569', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#F1D7B4', fontSize: '0.8125rem', fontWeight: 600 }}>#{category.id}</span>
                        </div>
                        <h1>{category.category_name}</h1>
                        <p>Department details and all products linked to this category.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                            href={route('admin.categories.edit', category.id)}
                            className="dayal-btn dayal-btn--primary"
                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Category</span>
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

                {/* Category Card Header & Overview */}
                <div className="dayal-admin-card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {/* Category Banner / Avatar */}
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '1rem',
                                background: '#0F172A',
                                border: '1px solid #B88E4B',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            {category.category_image_url || category.category_image ? (
                                <img
                                    src={category.category_image_url || category.category_image}
                                    alt={category.category_name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ fontSize: '2rem', color: '#B88E4B', fontWeight: 800 }}>
                                    {category.category_name.charAt(0)}
                                </span>
                            )}
                        </div>

                        {/* Category Meta */}
                        <div style={{ flex: 1, minWidth: '220px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                                    {category.category_name}
                                </h2>
                                <code style={{ padding: '0.2rem 0.5rem', borderRadius: '0.25rem', background: '#0F172A', color: '#F1D7B4', fontSize: '0.75rem' }}>
                                    /{category.category_slug}
                                </code>
                            </div>
                            <p style={{ color: '#CBD5E1', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                                {category.category_description || 'No description added for this department.'}
                            </p>
                        </div>

                        {/* Products Count Badge */}
                        <div
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '0.75rem',
                                background: '#0F172A',
                                border: '1px solid #334155',
                                textAlign: 'center',
                            }}
                        >
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Linked Products
                            </span>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399' }}>
                                {category.products_count ?? products.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Linked Products Table Card */}
                <div className="dayal-admin-table-card">
                    <div className="dayal-admin-table-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3>Products in "{category.category_name}" ({products.length})</h3>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                Products with foreign key category_id = {category.id}
                            </span>
                        </div>

                        <Link
                            href={route('admin.products.create')}
                            className="dayal-admin-head-btn"
                            style={{ textDecoration: 'none', color: '#F1D7B4', borderColor: 'rgba(184, 142, 75, 0.3)' }}
                        >
                            + Add Product to this Category
                        </Link>
                    </div>

                    <div className="dayal-admin-table-wrap">
                        {products.length === 0 ? (
                            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                                <BoxIcon width="40" height="40" style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                                <h4 style={{ color: '#F8FAFC', fontSize: '1rem', marginBottom: '0.3rem' }}>
                                    No products linked yet
                                </h4>
                                <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                                    When you create or edit a product, select "{category.category_name}" from the category dropdown.
                                </p>
                                <Link
                                    href={route('admin.products.create')}
                                    className="dayal-btn dayal-btn--primary"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Create Product
                                </Link>
                            </div>
                        ) : (
                            <table className="dayal-admin-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Selling Price</th>
                                        <th>Stock Qty</th>
                                        <th>Details</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((prod) => (
                                        <tr key={prod.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div
                                                        style={{
                                                            width: '38px',
                                                            height: '38px',
                                                            borderRadius: '0.375rem',
                                                            background: '#1E293B',
                                                            overflow: 'hidden',
                                                            flexShrink: 0,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {prod.product_image_url || prod.product_image ? (
                                                            <img
                                                                src={prod.product_image_url || prod.product_image}
                                                                alt={prod.product_name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                            />
                                                        ) : (
                                                            <BoxIcon width="16" height="16" style={{ color: '#B88E4B' }} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={route('admin.products.show', prod.id)}
                                                            style={{ color: '#F8FAFC', fontWeight: 600, textDecoration: 'none' }}
                                                        >
                                                            {prod.product_name}
                                                        </Link>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                            MRP: ₹{Number(prod.product_price).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ color: '#F1D7B4', fontWeight: 700 }}>
                                                    ₹{Number(prod.product_selling_price).toFixed(2)}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        padding: '0.2rem 0.5rem',
                                                        borderRadius: '999px',
                                                        background: Number(prod.product_qty) > 0 ? 'rgba(5, 150, 105, 0.12)' : 'rgba(239, 68, 68, 0.15)',
                                                        color: Number(prod.product_qty) > 0 ? '#34D399' : '#F87171',
                                                    }}
                                                >
                                                    {prod.product_qty} in stock
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                    {Array.isArray(prod.product_details) ? prod.product_details.length : 0} specs
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                                    <Link
                                                        href={route('admin.products.show', prod.id)}
                                                        className="dayal-admin-head-btn"
                                                        style={{ textDecoration: 'none', padding: '0.3rem 0.55rem' }}
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('admin.products.edit', prod.id)}
                                                        className="dayal-admin-head-btn"
                                                        style={{ textDecoration: 'none', padding: '0.3rem 0.55rem', color: '#F1D7B4' }}
                                                    >
                                                        Edit
                                                    </Link>
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
                {deleteModalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
                            style={{ maxWidth: '440px', width: '100%', background: '#0F172A', border: '1px solid #334155' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(239, 68, 68, 0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#F87171',
                                        flexShrink: 0,
                                    }}
                                >
                                    <AlertIcon width="20" height="20" />
                                </div>
                                <div>
                                    <h4 style={{ color: '#F8FAFC', margin: 0, fontSize: '1.1rem' }}>Delete Category</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Are you sure?</span>
                                </div>
                            </div>

                            <p style={{ color: '#CBD5E1', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                                Deleting <strong>{category.category_name}</strong> will remove the category.
                                Products in this category will become unassigned.
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
