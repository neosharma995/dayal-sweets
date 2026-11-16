import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BoxIcon, CheckCircleIcon, AlertIcon } from '@/Components/Icons';

export default function Show({ product }) {
    const variations = Array.isArray(product.variations) ? product.variations : [];
    const minPrice = product.min_price;
    const maxPrice = product.max_price;
    const totalStock = product.total_stock ?? product.product_qty ?? 0;

    const [activeImage, setActiveImage] = useState(
        product.product_image_url || product.product_image || null
    );
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const confirmDelete = () => {
        router.delete(route('admin.products.destroy', product.id));
    };

    const allImages = [];
    if (product.product_image_url || product.product_image) {
        allImages.push(product.product_image_url || product.product_image);
    }
    if (Array.isArray(product.product_gallaries_urls) && product.product_gallaries_urls.length > 0) {
        allImages.push(...product.product_gallaries_urls);
    } else if (Array.isArray(product.product_gallaries) && product.product_gallaries.length > 0) {
        allImages.push(...product.product_gallaries);
    }

    return (
        <AdminLayout header={product.product_name}>
            <Head title={`${product.product_name} - Dayal Sweets Admin`} />

            <div className="dayal-container">
                {/* View Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.products.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Products
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>#{product.id}</span>
                        </div>
                        <h1>{product.product_name}</h1>
                        <p>Detailed product view, inventory statistics, and media assets.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                            href={route('admin.products.edit', product.id)}
                            className="dayal-btn dayal-btn--primary"
                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Product</span>
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

                {/* 2-Column Detail Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>

                    {/* Left: Product Images & Galleries */}
                    <div className="dayal-admin-card">
                        <div className="dayal-admin-card-header">
                            <BoxIcon width="18" height="18" style={{ color: '#B88E4B' }} />
                            <h3 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>Media &amp; Visual Showcase</h3>
                        </div>

                        {/* Main Featured Photo */}
                        <div
                            style={{
                                width: '100%',
                                height: '320px',
                                borderRadius: '0.75rem',
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem',
                            }}
                        >
                            {activeImage ? (
                                <img
                                    src={activeImage.startsWith('/') ? activeImage : `/storage/${activeImage}`}
                                    alt={product.product_name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <div style={{ textAlign: 'center', color: '#64748B' }}>
                                    <BoxIcon width="48" height="48" style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                                    <span>No primary image uploaded</span>
                                </div>
                            )}
                        </div>

                        {/* Gallery Thumbnails List */}
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>
                                Gallery Assets ({allImages.length})
                            </span>
                            {allImages.length === 0 ? (
                                <p style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.5rem' }}>No gallery photos attached.</p>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.6rem' }}>
                                    {allImages.map((imgUrl, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setActiveImage(imgUrl)}
                                            style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '0.5rem',
                                                overflow: 'hidden',
                                                border: activeImage === imgUrl ? '2px solid #B88E4B' : '1px solid #CBD5E1',
                                                padding: 0,
                                                background: '#F8FAFC',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <img
                                                src={typeof imgUrl === 'string' && imgUrl.startsWith('/') ? imgUrl : `/storage/${imgUrl}`}
                                                alt={`Thumbnail ${idx + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Specifications, Pricing & Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Pricing & Variations Card */}
                        <div className="dayal-admin-card">
                            <div className="dayal-admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>
                                    Pack Sizes &amp; Price Variations ({variations.length})
                                </h3>
                                <Link
                                    href={route('admin.products.edit', product.id)}
                                    style={{ fontSize: '0.75rem', color: '#B88E4B', textDecoration: 'none', fontWeight: 600 }}
                                >
                                    + Manage Variations
                                </Link>
                            </div>

                            {/* Summary row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Price Range</span>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                                        {minPrice != null ? (
                                            minPrice === maxPrice ? `₹${Number(minPrice).toFixed(2)}` : `₹${Number(minPrice).toFixed(2)} - ₹${Number(maxPrice).toFixed(2)}`
                                        ) : (
                                            `₹${Number(product.product_selling_price).toFixed(2)}`
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Total Inventory</span>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: totalStock > 10 ? '#059669' : totalStock > 0 ? '#D97706' : '#E11D48' }}>
                                        {totalStock} Units
                                    </div>
                                </div>
                            </div>

                            {/* Variations Table */}
                            {variations.length === 0 ? (
                                <p style={{ color: '#64748B', fontSize: '0.8125rem' }}>No variations configured.</p>
                            ) : (
                                <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left', background: '#F8FAFC' }}>
                                                <th style={{ padding: '0.5rem 0.6rem' }}>Pack / Size</th>
                                                <th style={{ padding: '0.5rem 0.6rem' }}>MRP</th>
                                                <th style={{ padding: '0.5rem 0.6rem' }}>Selling Price</th>
                                                <th style={{ padding: '0.5rem 0.6rem' }}>Stock</th>
                                                <th style={{ padding: '0.5rem 0.6rem', textAlign: 'right' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variations.map((v) => {
                                                const reg = Number(v.price);
                                                const sell = Number(v.selling_price);
                                                const disc = reg > sell ? Math.round(((reg - sell) / reg) * 100) : 0;

                                                return (
                                                    <tr key={v.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                        <td style={{ padding: '0.6rem', color: '#0F172A', fontWeight: 600 }}>
                                                            <div>{v.variation_name}</div>
                                                            <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem', alignItems: 'center' }}>
                                                                {v.is_default && (
                                                                    <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '0.2rem', background: '#F5EBD7', color: '#8C6226', border: '1px solid rgba(184, 142, 75, 0.4)' }}>
                                                                        Default
                                                                    </span>
                                                                )}
                                                                {v.attribute_value && (
                                                                    <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '0.2rem', background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1' }}>
                                                                        {v.attribute_value.attribute ? `${v.attribute_value.attribute.name}: ` : ''}{v.attribute_value.value}
                                                                    </span>
                                                                )}
                                                                {v.sku && (
                                                                    <span style={{ fontSize: '0.65rem', color: '#64748B' }}>
                                                                        {v.sku}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '0.6rem', color: '#64748B', textDecoration: disc > 0 ? 'line-through' : 'none' }}>
                                                            ₹{reg.toFixed(2)}
                                                        </td>
                                                        <td style={{ padding: '0.6rem', color: '#0F172A', fontWeight: 700 }}>
                                                            ₹{sell.toFixed(2)}
                                                            {disc > 0 && (
                                                                <span style={{ marginLeft: '0.35rem', fontSize: '0.65rem', color: '#E11D48' }}>
                                                                    ({disc}% OFF)
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td style={{ padding: '0.6rem', color: Number(v.product_qty) > 0 ? '#059669' : '#E11D48', fontWeight: 600 }}>
                                                            {v.product_qty} pcs
                                                        </td>
                                                        <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                                                            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '999px', background: Number(v.product_qty) > 0 ? '#ECFDF5' : '#FFF1F2', color: Number(v.product_qty) > 0 ? '#059669' : '#E11D48' }}>
                                                                {Number(v.product_qty) > 0 ? 'In Stock' : 'Out of Stock'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Category row */}
                            <div className="dayal-admin-info-row">
                                <span style={{ color: '#64748B' }}>Category:</span>
                                {product.category ? (
                                    <Link
                                        href={route('admin.categories.show', product.category.id)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            padding: '0.2rem 0.65rem',
                                            borderRadius: '999px',
                                            background: '#F5EBD7',
                                            border: '1px solid rgba(184, 142, 75, 0.3)',
                                            color: '#8C6226',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {product.category.category_name} &rarr;
                                    </Link>
                                ) : (
                                    <span style={{ color: '#64748B', fontSize: '0.8125rem', fontStyle: 'italic' }}>Unassigned</span>
                                )}
                            </div>

                            <div className="dayal-admin-info-row">
                                <span style={{ color: '#64748B' }}>Created Timestamp:</span>
                                <span style={{ color: '#0F172A' }}>
                                    {new Date(product.created_at).toLocaleString()}
                                </span>
                            </div>

                            <div className="dayal-admin-info-row">
                                <span style={{ color: '#64748B' }}>Last Updated:</span>
                                <span style={{ color: '#0F172A' }}>
                                    {new Date(product.updated_at).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="dayal-admin-card">
                            <div className="dayal-admin-card-header">
                                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>Description</h3>
                            </div>
                            <p style={{ color: '#334155', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                                {product.product_description || 'No description provided for this product item.'}
                            </p>
                        </div>

                        {/* Specifications List Card */}
                        <div className="dayal-admin-card">
                            <div className="dayal-admin-card-header">
                                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>Specifications (product_details)</h3>
                            </div>

                            {!Array.isArray(product.product_details) || product.product_details.length === 0 ? (
                                <p style={{ color: '#64748B', fontSize: '0.8125rem', margin: 0 }}>No specifications or details listed.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {product.product_details.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.65rem',
                                                padding: '0.5rem 0.75rem',
                                                background: '#F8FAFC',
                                                border: '1px solid #E2E8F0',
                                                borderRadius: '0.375rem',
                                            }}
                                        >
                                            <CheckCircleIcon width="16" height="16" style={{ color: '#059669', flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.85rem', color: '#0F172A' }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModalOpen && (
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
                                    <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.1rem' }}>Delete Product</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Are you sure?</span>
                                </div>
                            </div>

                            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                                This will permanently delete <strong>{product.product_name}</strong> and remove its media files from storage.
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
