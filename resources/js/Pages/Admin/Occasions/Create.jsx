import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { adminPrimaryBtnStyle, adminSecondaryBtnStyle } from '@/Components/Admin/AdminDataTable';

const inputStyle = (hasError) => ({
    width: '100%',
    background: '#FFFFFF',
    border: hasError ? '1px solid #DC2626' : '1px solid #CBD5E1',
    borderRadius: '0.5rem',
    padding: '0.6rem 0.85rem',
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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        category_name: '',
        category_slug: '',
        category_description: '',
    });

    const handleNameChange = (e) => {
        const val = e.target.value;
        setData((prev) => ({
            ...prev,
            category_name: val,
            category_slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.occasions.store'));
    };

    return (
        <AdminLayout header="Add Occasion Category">
            <Head title="Create Occasion Category - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ maxWidth: '820px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.dashboard')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>Admin</Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <Link href={route('admin.occasions.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>Occasions</Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Create</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Create Occasion Category</h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem', marginBottom: 0 }}>
                            Set up an occasion (e.g. Wedding, Birthday, Corporate Gifting, Family Celebration).
                        </p>
                    </div>

                    <Link href={route('admin.occasions.index')} style={adminSecondaryBtnStyle}>
                        &larr; Back to List
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
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
                                Occasion Name <span style={{ color: '#DC2626' }}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Wedding"
                                value={data.category_name}
                                onChange={handleNameChange}
                                required
                                style={inputStyle(errors.category_name)}
                            />
                            {errors.category_name && <p style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.category_name}</p>}
                        </div>

                        <div>
                            <label style={labelStyle}>Slug (URL Identifier)</label>
                            <input
                                type="text"
                                placeholder="wedding"
                                value={data.category_slug}
                                onChange={(e) => setData('category_slug', e.target.value)}
                                style={inputStyle(errors.category_slug)}
                            />
                            {errors.category_slug && <p style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.category_slug}</p>}
                        </div>

                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                rows="3"
                                placeholder="Describe the occasion collection..."
                                value={data.category_description}
                                onChange={(e) => setData('category_description', e.target.value)}
                                style={inputStyle(errors.category_description)}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
                            <Link href={route('admin.occasions.index')} style={adminSecondaryBtnStyle}>
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing} style={{ ...adminPrimaryBtnStyle, opacity: processing ? 0.7 : 1 }}>
                                {processing ? 'Saving...' : 'Create Occasion Category'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
