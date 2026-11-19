import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminPrimaryBtnStyle, adminSecondaryBtnStyle } from '@/Components/Admin/AdminDataTable';

const inputStyle = (hasError) => ({
    width: '100%',
    padding: '0.6rem 0.85rem',
    borderRadius: '0.5rem',
    background: '#FFFFFF',
    border: hasError ? '1px solid #DC2626' : '1px solid #CBD5E1',
    color: '#0F172A',
    fontSize: '0.875rem',
    outline: 'none',
});

const labelStyle = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 700,
    color: '#334155',
    marginBottom: '0.4rem',
};

export default function Create({ parentCategories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        parent_id: '',
        category_name: '',
        category_slug: '',
        category_description: '',
        category_image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleNameChange = (e) => {
        const val = e.target.value;
        setData((prev) => ({
            ...prev,
            category_name: val,
            category_slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('category_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'));
    };

    return (
        <AdminLayout header="Add New Category">
            <Head title="Create Product Category - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ maxWidth: '820px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.dashboard')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>Admin</Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <Link href={route('admin.categories.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>Categories</Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Create</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Create Category</h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem', marginBottom: 0 }}>
                            Set up a department (e.g. Traditional Sweets, Dry Fruit Sweets, Namkeen) to link products.
                        </p>
                    </div>

                    <Link href={route('admin.categories.index')} style={adminSecondaryBtnStyle}>
                        &larr; Back to Categories
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    style={{
                        background: '#FFFFFF',
                        borderRadius: '0.75rem',
                        border: '1px solid #E2E8F0',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>
                                Category Name <span style={{ color: '#DC2626' }}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Dry Fruit Sweets"
                                value={data.category_name}
                                onChange={handleNameChange}
                                required
                                style={inputStyle(errors.category_name)}
                            />
                            {errors.category_name && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.category_name}</div>}
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Parent Category <span style={{ color: '#64748B', fontWeight: 500, fontSize: '0.75rem' }}>(Optional — leave empty for top-level)</span>
                            </label>
                            <select
                                value={data.parent_id}
                                onChange={(e) => setData('parent_id', e.target.value)}
                                style={inputStyle(errors.parent_id)}
                            >
                                <option value="">None (Top-Level Category)</option>
                                {parentCategories.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.category_name}
                                    </option>
                                ))}
                            </select>
                            {errors.parent_id && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.parent_id}</div>}
                        </div>

                        <div>
                            <label style={labelStyle}>
                                URL Slug <span style={{ color: '#64748B', fontWeight: 500, fontSize: '0.75rem' }}>(Auto-generated, unique)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="dry-fruit-sweets"
                                value={data.category_slug}
                                onChange={(e) => setData('category_slug', e.target.value)}
                                style={inputStyle(errors.category_slug)}
                            />
                            {errors.category_slug && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.category_slug}</div>}
                        </div>

                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                rows="3"
                                placeholder="Details about this sweet department..."
                                value={data.category_description}
                                onChange={(e) => setData('category_description', e.target.value)}
                                style={inputStyle(errors.category_description)}
                            />
                            {errors.category_description && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.category_description}</div>}
                        </div>

                        <div>
                            <label style={labelStyle}>Category Banner Image</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem 0.75rem',
                                        background: '#F8FAFC',
                                        border: '1px solid #CBD5E1',
                                        borderRadius: '0.5rem',
                                        color: '#334155',
                                        fontSize: '0.8125rem',
                                    }}
                                />
                                {imagePreview && (
                                    <div style={{ width: '54px', height: '54px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #CBD5E1', flexShrink: 0 }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                            <Link href={route('admin.categories.index')} style={adminSecondaryBtnStyle}>
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing} style={{ ...adminPrimaryBtnStyle, opacity: processing ? 0.7 : 1 }}>
                                {processing ? 'Creating...' : 'Save Category'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
