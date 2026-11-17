import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BoxIcon, AlertIcon } from '@/Components/Icons';
import Pagination from '@/Components/Pagination';

export default function Index({ products = [], filters = {} }) {
    const { paginationLimit = 20 } = usePage().props || {};
    const itemsPerPage = Number(paginationLimit) || 20;

    const [search, setSearch] = useState(filters.search || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Filter products locally if search query is typed
    const filteredProducts = products.filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            p.product_name?.toLowerCase().includes(q) ||
            p.product_description?.toLowerCase().includes(q) ||
            p.category?.category_name?.toLowerCase().includes(q) ||
            String(p.id).includes(q)
        );
    });

    // Compute pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Compute basic statistics
    const totalCount = products.length;
    const inStockCount = products.filter((p) => Number(p.total_stock ?? p.product_qty ?? 0) > 0).length;
    const lowStockCount = products.filter((p) => {
        const stock = Number(p.total_stock ?? p.product_qty ?? 0);
        return stock > 0 && stock <= 10;
    }).length;
    const outOfStockCount = products.filter((p) => Number(p.total_stock ?? p.product_qty ?? 0) === 0).length;

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!productToDelete) return;
        router.delete(route('admin.products.destroy', productToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setProductToDelete(null);
            },
        });
    };

    return (
        <AdminLayout header="Products">
            <Head title="Products - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
                {/* Header Title */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                    <div>
                        <h1>Products</h1>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem', width: '100%' }}>
                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Total Products</span>
                            <span className="dayal-stat-badge">Active</span>
                        </div>
                        <div className="dayal-stat-value">{totalCount}</div>
                        <div className="dayal-stat-subtext">Registered catalog items</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">In Stock</span>
                            <span className="dayal-stat-badge" style={{ color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>Available</span>
                        </div>
                        <div className="dayal-stat-value">{inStockCount}</div>
                        <div className="dayal-stat-subtext">Ready for immediate dispatch</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Low Stock Alert</span>
                            <span className="dayal-stat-badge" style={{ color: '#D97706', background: '#FFFBEB', border: '1px solid #FDE68A' }}>Needs Reorder</span>
                        </div>
                        <div className="dayal-stat-value">{lowStockCount}</div>
                        <div className="dayal-stat-subtext">10 units or fewer remaining</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Out of Stock</span>
                            <span className="dayal-stat-badge" style={{ color: '#E11D48', background: '#FFF1F2', border: '1px solid #FECDD3' }}>Sold Out</span>
                        </div>
                        <div className="dayal-stat-value">{outOfStockCount}</div>
                        <div className="dayal-stat-subtext">Requires kitchen replenishment</div>
                    </div>
                </div>

                {/* Search Bar & Table Card */}
                <div className="dayal-admin-table-card" style={{ width: '100%' }}>
                    <div className="dayal-admin-table-head" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3>All Sweet &amp; Savory Products</h3>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                Showing {filteredProducts.length} of {totalCount} total items
                            </span>
                        </div>

                        {/* Search Input */}
                        <div style={{ position: 'relative', minWidth: '280px' }}>
                            <input
                                type="text"
                                placeholder="Search by name, desc, or ID..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 1rem 0.55rem 2.25rem',
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
                                    onClick={() => {
                                        setSearch('');
                                        setCurrentPage(1);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#64748B',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                    }}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="dayal-admin-table-wrap">
                        {filteredProducts.length === 0 ? (
                            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
                                <BoxIcon width="48" height="48" style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                <h4 style={{ color: '#0F172A', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No products found</h4>
                                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                    {search ? `No products matching "${search}".` : 'Get started by creating your first product in Dayal Sweets.'}
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
                                        <th>Category</th>
                                        <th>Regular Price</th>
                                        <th>Selling Price</th>
                                        <th>Stock Qty</th>
                                        <th>Variations</th>
                                        <th>Galleries</th>
                                        <th>Details</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map((product) => {
                                        const regularPrice = Number(product.product_price);
                                        const sellingPrice = Number(product.product_selling_price);
                                        const discount = regularPrice > sellingPrice
                                            ? Math.round(((regularPrice - sellingPrice) / regularPrice) * 100)
                                            : 0;

                                        return (
                                            <tr key={product.id}>
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
                                                            {product.product_image_url || product.product_image ? (
                                                                <img
                                                                    src={product.product_image_url || product.product_image}
                                                                    alt={product.product_name}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                                />
                                                            ) : (
                                                                <BoxIcon width="20" height="20" style={{ color: '#B88E4B' }} />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Link
                                                                href={route('admin.products.show', product.id)}
                                                                style={{ color: '#0F172A', fontWeight: 600, textDecoration: 'none' }}
                                                            >
                                                                {product.product_name}
                                                            </Link>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {product.product_description || 'No description provided'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {product.category ? (
                                                        <Link
                                                            href={route('admin.categories.show', product.category.id)}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.35rem',
                                                                padding: '0.2rem 0.65rem',
                                                                borderRadius: '9999px',
                                                                background: '#F5EBD7',
                                                                border: '1px solid rgba(184, 142, 75, 0.3)',
                                                                color: '#8C6226',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                textDecoration: 'none',
                                                            }}
                                                        >
                                                            {product.category.category_name}
                                                        </Link>
                                                    ) : (
                                                        <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontStyle: 'italic' }}>Unassigned</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span style={{ color: '#64748B', textDecoration: discount > 0 ? 'line-through' : 'none' }}>
                                                        ₹{regularPrice.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <span style={{ color: '#0F172A', fontWeight: 700 }}>
                                                            ₹{sellingPrice.toFixed(2)}
                                                        </span>
                                                        {discount > 0 && (
                                                            <span
                                                                style={{
                                                                    fontSize: '0.65rem',
                                                                    padding: '0.1rem 0.35rem',
                                                                    borderRadius: '0.25rem',
                                                                    background: '#FFF1F2',
                                                                    border: '1px solid #FECDD3',
                                                                    color: '#E11D48',
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {discount}% OFF
                                                            </span>
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
                                                            background: Number(product.product_qty) > 5
                                                                ? '#ECFDF5'
                                                                : Number(product.product_qty) > 0
                                                                ? '#FFFBEB'
                                                                : '#FFF1F2',
                                                            border: Number(product.product_qty) > 5
                                                                ? '1px solid #A7F3D0'
                                                                : Number(product.product_qty) > 0
                                                                ? '1px solid #FDE68A'
                                                                : '1px solid #FECDD3',
                                                            color: Number(product.product_qty) > 5
                                                                ? '#059669'
                                                                : Number(product.product_qty) > 0
                                                                ? '#D97706'
                                                                : '#E11D48',
                                                        }}
                                                    >
                                                        {product.product_qty} in stock
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link
                                                        href={route('admin.products.edit', product.id)}
                                                        title="Configure Variations in Edit Form"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            padding: '0.2rem 0.55rem',
                                                            borderRadius: '0.375rem',
                                                            background: '#F8FAFC',
                                                            border: '1px solid #CBD5E1',
                                                            color: '#334155',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        {Array.isArray(product.variations) ? product.variations.length : 0} pack size{Array.isArray(product.variations) && product.variations.length === 1 ? '' : 's'}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                        {Array.isArray(product.product_gallaries) ? product.product_gallaries.length : 0} photos
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                        {Array.isArray(product.product_details) ? product.product_details.length : 0} items
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <Link
                                                            href={route('admin.products.show', product.id)}
                                                            className="dayal-admin-head-btn"
                                                            title="View Product"
                                                            style={{ textDecoration: 'none', padding: '0.35rem 0.65rem' }}
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('admin.products.edit', product.id)}
                                                            className="dayal-admin-head-btn"
                                                            title="Edit Product & Variations"
                                                            style={{ textDecoration: 'none', padding: '0.35rem 0.65rem' }}
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteClick(product)}
                                                            title="Delete Product"
                                                            style={{
                                                                padding: '0.35rem 0.65rem',
                                                                borderRadius: '0.375rem',
                                                                background: '#FFF1F2',
                                                                border: '1px solid #FECDD3',
                                                                color: '#E11D48',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.25rem',
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

                        {filteredProducts.length > 0 && (
                            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#FAFAFA' }}>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={filteredProducts.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModalOpen && productToDelete && (
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
                                    <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.1rem' }}>Confirm Deletion</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Permanent action</span>
                                </div>
                            </div>

                            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                                Are you sure you want to delete <strong>{productToDelete.product_name}</strong>?
                                All product pricing, pack variations, gallery photos, and details will be permanently removed.
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
                                    Yes, Delete Product
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
