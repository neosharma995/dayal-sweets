import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminPrimaryBtnStyle, adminSecondaryBtnStyle, adminTableActionStyles } from '@/Components/Admin/AdminDataTable';
import { AlertIcon } from '@/Components/Icons';

export default function Show({ category }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const linkedProductsCount = Math.max(
        Number(category.products_count ?? 0),
        Number(category.many_products_count ?? 0)
    );
    const children = Array.isArray(category.children) ? category.children : [];

    const confirmDelete = () => {
        router.delete(route('admin.categories.destroy', category.id));
    };

    return (
        <AdminLayout header={`Category: ${category.category_name}`}>
            <Head title={`${category.category_name} - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* View Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.dashboard')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Admin
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <Link href={route('admin.categories.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Categories
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>#{category.id}</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            {category.category_name}
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem', marginBottom: 0 }}>
                            Department overview and linked product count.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link href={route('admin.categories.index')} style={adminSecondaryBtnStyle}>
                            &larr; Back
                        </Link>
                        <Link href={route('admin.categories.edit', category.id)} style={adminPrimaryBtnStyle}>
                            Edit Category
                        </Link>
                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(true)}
                            style={{ ...adminTableActionStyles.danger, height: '38px', padding: '0 0.9rem', fontSize: '0.8125rem', borderRadius: '0.5rem' }}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Category Overview Card */}
                <div
                    style={{
                        background: '#FFFFFF',
                        borderRadius: '0.75rem',
                        border: '1px solid #E2E8F0',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {/* Category Thumbnail */}
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '0.75rem',
                                background: '#F8FAFC',
                                border: '1px solid #CBD5E1',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            {(category.category_image_url || category.category_image) && !imgError ? (
                                <img
                                    src={category.category_image_url || category.category_image}
                                    alt={category.category_name}
                                    onError={() => setImgError(true)}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ fontSize: '2rem', color: '#7A1C1C', fontWeight: 800 }}>
                                    {category.category_name?.charAt(0)?.toUpperCase() || 'C'}
                                </span>
                            )}
                        </div>

                        {/* Category Meta */}
                        <div style={{ flex: 1, minWidth: '220px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                    {category.category_name}
                                </h2>
                                <code style={{ padding: '0.2rem 0.5rem', borderRadius: '0.25rem', background: '#F1F5F9', color: '#7A1C1C', fontSize: '0.75rem', border: '1px solid #E2E8F0' }}>
                                    /{category.category_slug}
                                </code>
                                {category.parent && (
                                    <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.18rem 0.55rem', borderRadius: '999px', background: '#F8FAFC', color: '#475569', border: '1px solid #CBD5E1' }}>
                                        Parent: {category.parent.category_name}
                                    </span>
                                )}
                            </div>
                            <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                                {category.category_description || 'No description added for this department.'}
                            </p>
                        </div>

                        {/* Linked Products Count Box */}
                        <div
                            style={{
                                padding: '1rem 1.75rem',
                                borderRadius: '0.75rem',
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                textAlign: 'center',
                                minWidth: '160px',
                            }}
                        >
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Linked Products
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7A1C1C', marginTop: '0.2rem' }}>
                                {linkedProductsCount}
                            </div>
                        </div>
                    </div>

                    {children.length > 0 && (
                        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Sub-Categories:</span>
                            {children.map((child) => (
                                <Link
                                    key={child.id}
                                    href={route('admin.categories.show', child.id)}
                                    style={{
                                        padding: '0.22rem 0.65rem',
                                        borderRadius: '999px',
                                        background: '#FDF2F2',
                                        border: '1px solid #FECACA',
                                        color: '#7A1C1C',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                >
                                    {child.category_name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ maxWidth: '440px', width: '100%', background: '#FFFFFF', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <AlertIcon width="24" height="24" style={{ color: '#DC2626' }} />
                            <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Delete Category</h4>
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                            Are you sure you want to delete <strong>{category.category_name}</strong>? Linked products will remain in the catalog with this category unlinked.
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
