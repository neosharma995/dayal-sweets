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
        post(route('admin.diet-preferences.store'));
    };

    return (
        <AdminLayout header="Add Diet Preference Category">
            <Head title="Create Diet Preference - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.diet-preferences.index')} style={{ color: '#94a3b8', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Diet Preferences
                            </Link>
                            <span style={{ color: '#475569', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#F1D7B4', fontSize: '0.8125rem', fontWeight: 600 }}>Create</span>
                        </div>
                        <h1>Create Diet Preference Category</h1>
                        <p>Set up dietary classification (e.g. Sugar Free, Low Sugar, Jain Friendly, Vegan, Gluten Free).</p>
                    </div>

                    <Link href={route('admin.diet-preferences.index')} className="dayal-admin-head-btn" style={{ textDecoration: 'none' }}>
                        &larr; Back to List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="dayal-admin-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                Diet Preference Name <span style={{ color: '#F87171' }}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sugar Free"
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
                                placeholder="sugar-free"
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
                                placeholder="Describe dietary compliance and preparation care..."
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
                            <Link href={route('admin.diet-preferences.index')} className="dayal-btn dayal-btn--secondary">
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing} className="dayal-btn dayal-btn--primary">
                                {processing ? 'Saving...' : 'Create Diet Category'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
