import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        product_tag_name: '',
        product_tag_slug: '',
        product_tag_description: '',
        product_tag_image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('product_tag_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.product-tags.store'));
    };

    return (
        <AdminLayout header="Add Product Tag">
            <Head title="Add Product Tag - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <Link href={route('admin.product-tags.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                            Product Tags
                        </Link>
                        <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                        <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Add New</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', margin: 0, fontFamily: 'var(--font-serif, Georgia, serif)' }}>
                        Add Product Tag
                    </h1>
                </div>

                <div className="dayal-admin-table-card" style={{ padding: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label className="dayal-form-label">
                                Tag Name <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={data.product_tag_name}
                                onChange={(e) => setData('product_tag_name', e.target.value)}
                                placeholder="e.g. Bestseller, Pure Desi Ghee"
                                className={`dayal-form-input ${errors.product_tag_name ? 'is-invalid' : ''}`}
                                required
                            />
                            {errors.product_tag_name && (
                                <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem' }}>{errors.product_tag_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="dayal-form-label">Slug (Optional)</label>
                            <input
                                type="text"
                                value={data.product_tag_slug}
                                onChange={(e) => setData('product_tag_slug', e.target.value)}
                                placeholder="e.g. bestseller (leave blank to auto-generate)"
                                className={`dayal-form-input ${errors.product_tag_slug ? 'is-invalid' : ''}`}
                            />
                            {errors.product_tag_slug && (
                                <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem' }}>{errors.product_tag_slug}</p>
                            )}
                        </div>

                        <div>
                            <label className="dayal-form-label">Description (Optional)</label>
                            <textarea
                                rows={3}
                                value={data.product_tag_description}
                                onChange={(e) => setData('product_tag_description', e.target.value)}
                                placeholder="Brief description of when this tag applies..."
                                className={`dayal-form-input ${errors.product_tag_description ? 'is-invalid' : ''}`}
                            />
                            {errors.product_tag_description && (
                                <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem' }}>{errors.product_tag_description}</p>
                            )}
                        </div>

                        <div>
                            <label className="dayal-form-label">Badge Image / Icon (Optional)</label>
                            {imagePreview && (
                                <div style={{ width: '90px', height: '90px', borderRadius: '0.375rem', overflow: 'hidden', border: '1px solid #CBD5E1', marginBottom: '0.75rem' }}>
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="dayal-form-input"
                                style={{ padding: '0.5rem' }}
                            />
                            {errors.product_tag_image && (
                                <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem' }}>{errors.product_tag_image}</p>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                            <Link href={route('admin.product-tags.index')} className="dayal-btn dayal-btn--secondary">
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing} className="dayal-btn dayal-btn--primary">
                                {processing ? 'Creating...' : 'Create Tag'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
