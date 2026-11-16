import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

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

            <div className="dayal-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.occasions.index')} style={{ color: '#94a3b8', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Occasions
                            </Link>
                            <span style={{ color: '#475569', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#F1D7B4', fontSize: '0.8125rem', fontWeight: 600 }}>Create</span>
                        </div>
                        <h1>Create Occasion Category</h1>
                        <p>Set up an occasion (e.g. Wedding, Birthday, Corporate Gifting, Family Celebration).</p>
                    </div>

                    <Link href={route('admin.occasions.index')} className="dayal-admin-head-btn" style={{ textDecoration: 'none' }}>
                        &larr; Back to List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="dayal-admin-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                Occasion Name <span style={{ color: '#F87171' }}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Corporate Gifting"
                                value={data.category_name}
                                onChange={handleNameChange}
                                required
                                style={{
                                    width: '100%',
                                    background: '#0F172A',
                                    border: errors.category_name ? '1px solid #EF4444' : '1px solid #334155',
                                    borderRadius: '8px',
                                    padding: '0.625rem 0.875rem',
                                    color: '#F8FAFC',
                                    fontSize: '0.875rem',
                                }}
                            />
                            {errors.category_name && (
                                <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.category_name}</p>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                Slug (URL Identifier)
                            </label>
                            <input
                                type="text"
                                placeholder="corporate-gifting"
                                value={data.category_slug}
                                onChange={(e) => setData('category_slug', e.target.value)}
                                style={{
                                    width: '100%',
                                    background: '#0F172A',
                                    border: errors.category_slug ? '1px solid #EF4444' : '1px solid #334155',
                                    borderRadius: '8px',
                                    padding: '0.625rem 0.875rem',
                                    color: '#F8FAFC',
                                    fontSize: '0.875rem',
                                }}
                            />
                            {errors.category_slug && (
                                <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.category_slug}</p>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                Description
                            </label>
                            <textarea
                                rows="3"
                                placeholder="Describe celebration treats for this occasion..."
                                value={data.category_description}
                                onChange={(e) => setData('category_description', e.target.value)}
                                style={{
                                    width: '100%',
                                    background: '#0F172A',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    padding: '0.625rem 0.875rem',
                                    color: '#F8FAFC',
                                    fontSize: '0.875rem',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                            <Link href={route('admin.occasions.index')} className="dayal-btn dayal-btn--secondary">
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing} className="dayal-btn dayal-btn--primary">
                                {processing ? 'Saving...' : 'Create Occasion'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
