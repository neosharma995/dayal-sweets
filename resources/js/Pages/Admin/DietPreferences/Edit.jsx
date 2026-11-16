import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ dietPreference }) {
    const { data, setData, put, processing, errors } = useForm({
        category_name: dietPreference.category_name || '',
        category_slug: dietPreference.category_slug || '',
        category_description: dietPreference.category_description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.diet-preferences.update', dietPreference.id));
    };

    return (
        <AdminLayout header={`Edit: ${dietPreference.category_name}`}>
            <Head title={`Edit Diet Preference - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.diet-preferences.index')} style={{ color: '#94a3b8', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Diet Preferences
                            </Link>
                            <span style={{ color: '#475569', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#F1D7B4', fontSize: '0.8125rem', fontWeight: 600 }}>Edit</span>
                        </div>
                        <h1>Edit Diet Preference Category</h1>
                        <p>Updating diet category {dietPreference.category_name}</p>
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
                                value={data.category_name}
                                onChange={(e) => setData('category_name', e.target.value)}
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
                                {processing ? 'Updating...' : 'Update Diet Category'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
