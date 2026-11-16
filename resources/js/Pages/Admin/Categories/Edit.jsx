import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ category }) {
    const { data, setData, processing, errors } = useForm({
        _method: 'put',
        category_name: category.category_name || '',
        category_slug: category.category_slug || '',
        category_description: category.category_description || '',
        category_image: null,
    });

    const [imagePreview, setImagePreview] = useState(
        category.category_image_url || category.category_image || null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('category_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.categories.update', category.id), {
            ...data,
            _method: 'put',
        });
    };

    return (
        <AdminLayout header="Edit Category">
            <Head title={`Edit ${category.category_name} - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* View Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.categories.index')} style={{ color: '#94a3b8', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Categories
                            </Link>
                            <span style={{ color: '#475569', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#F1D7B4', fontSize: '0.8125rem', fontWeight: 600 }}>Edit #{category.id}</span>
                        </div>
                        <h1>Edit Category: {category.category_name}</h1>
                        <p>Modify department branding, description, and link.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                            href={route('admin.categories.show', category.id)}
                            className="dayal-admin-head-btn"
                            style={{ textDecoration: 'none' }}
                        >
                            View Linked Products ({category.products_count ?? 0})
                        </Link>
                        <Link
                            href={route('admin.categories.index')}
                            className="dayal-admin-head-btn"
                            style={{ textDecoration: 'none' }}
                        >
                            &larr; Back
                        </Link>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="dayal-admin-card" encType="multipart/form-data">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Category Name */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                Category Name <span style={{ color: '#F87171' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={data.category_name}
                                onChange={(e) => setData('category_name', e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 1rem',
                                    borderRadius: '0.5rem',
                                    background: '#0F172A',
                                    border: errors.category_name ? '1px solid #F87171' : '1px solid #334155',
                                    color: '#F8FAFC',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                }}
                            />
                            {errors.category_name && (
                                <div style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.category_name}</div>
                            )}
                        </div>

                        {/* Category Slug */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                URL Slug
                            </label>
                            <input
                                type="text"
                                value={data.category_slug}
                                onChange={(e) => setData('category_slug', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 1rem',
                                    borderRadius: '0.5rem',
                                    background: '#0F172A',
                                    border: errors.category_slug ? '1px solid #F87171' : '1px solid #334155',
                                    color: '#F8FAFC',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                }}
                            />
                            {errors.category_slug && (
                                <div style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.category_slug}</div>
                            )}
                        </div>

                        {/* Category Description */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                Description
                            </label>
                            <textarea
                                rows="3"
                                value={data.category_description}
                                onChange={(e) => setData('category_description', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 1rem',
                                    borderRadius: '0.5rem',
                                    background: '#0F172A',
                                    border: errors.category_description ? '1px solid #F87171' : '1px solid #334155',
                                    color: '#F8FAFC',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                }}
                            />
                            {errors.category_description && (
                                <div style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.category_description}</div>
                            )}
                        </div>

                        {/* Category Image */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                Category Banner Image
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        background: '#0F172A',
                                        border: '1px solid #334155',
                                        borderRadius: '0.5rem',
                                        color: '#CBD5E1',
                                        fontSize: '0.8125rem',
                                    }}
                                />
                                {imagePreview && (
                                    <div
                                        style={{
                                            width: '54px',
                                            height: '54px',
                                            borderRadius: '0.5rem',
                                            overflow: 'hidden',
                                            border: '1px solid #B88E4B',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button Bar */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #334155', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                            <Link
                                href={route('admin.categories.index')}
                                className="dayal-admin-head-btn"
                                style={{ textDecoration: 'none', padding: '0.65rem 1.25rem' }}
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="dayal-btn dayal-btn--primary"
                                style={{
                                    padding: '0.65rem 1.75rem',
                                    opacity: processing ? 0.7 : 1,
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {processing ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
