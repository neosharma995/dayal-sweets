import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AttributeEdit({ attribute }) {
    const { data, setData, put, processing, errors } = useForm({
        name: attribute.name || '',
        slug: attribute.slug || '',
        description: attribute.description || '',
        values: attribute.values || [],
    });

    const [newValueInput, setNewValueInput] = useState('');

    const handleAddValue = () => {
        const val = newValueInput.trim();
        if (!val) return;

        // Check if value already exists
        const exists = data.values.some((item) => (typeof item === 'string' ? item : item.value).toLowerCase() === val.toLowerCase());
        if (exists) {
            setNewValueInput('');
            return;
        }

        setData('values', [
            ...data.values,
            { value: val, slug: val.toLowerCase().replace(/[^a-z0-9]/g, '-') },
        ]);
        setNewValueInput('');
    };

    const handleRemoveValue = (index) => {
        setData('values', data.values.filter((_, idx) => idx !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.attributes.update', attribute.id));
    };

    return (
        <AdminLayout header="Edit Attribute">
            <Head title={`Edit ${attribute.name} - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ maxWidth: '850px', margin: '0 auto' }}>
                {/* Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.attributes.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Attributes
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Edit #{attribute.id}</span>
                        </div>
                        <h1>Edit Attribute: {attribute.name}</h1>
                        <p>Modify attribute details and manage available values for product variations.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                            href={route('admin.attributes.show', attribute.id)}
                            className="dayal-admin-head-btn"
                            style={{ textDecoration: 'none' }}
                        >
                            View Attribute
                        </Link>
                        <Link
                            href={route('admin.attributes.index')}
                            className="dayal-admin-head-btn"
                            style={{ textDecoration: 'none' }}
                        >
                            &larr; Attributes
                        </Link>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="dayal-admin-card">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>

                        {/* Name & Slug */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                    Attribute Name <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Weight"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem 1rem',
                                        borderRadius: '0.5rem',
                                        background: '#FFFFFF',
                                        border: errors.name ? '1px solid #E11D48' : '1px solid #CBD5E1',
                                        color: '#0F172A',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                    }}
                                />
                                {errors.name && (
                                    <div style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.name}</div>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                    Slug / Identifier
                                </label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="e.g. weight"
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem 1rem',
                                        borderRadius: '0.5rem',
                                        background: '#FFFFFF',
                                        border: errors.slug ? '1px solid #E11D48' : '1px solid #CBD5E1',
                                        color: '#0F172A',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                    }}
                                />
                                {errors.slug && (
                                    <div style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.slug}</div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                Description <span style={{ color: '#64748B', fontWeight: 400 }}>(Optional)</span>
                            </label>
                            <textarea
                                rows="3"
                                value={data.description || ''}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Short description explaining this attribute..."
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 1rem',
                                    borderRadius: '0.5rem',
                                    background: '#FFFFFF',
                                    border: errors.description ? '1px solid #E11D48' : '1px solid #CBD5E1',
                                    color: '#0F172A',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                }}
                            />
                            {errors.description && (
                                <div style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.description}</div>
                            )}
                        </div>

                        {/* Values Configuration */}
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                    Attribute Values / Terms
                                </label>
                                <span style={{ fontSize: '0.75rem', color: '#B88E4B', fontWeight: 600 }}>
                                    {data.values.length} value{data.values.length === 1 ? '' : 's'}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0 0 1rem' }}>
                                Manage the available values for this attribute. Removing a value detaches it from future variation generation.
                            </p>

                            {/* Add input */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    value={newValueInput}
                                    onChange={(e) => setNewValueInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddValue();
                                        }
                                    }}
                                    placeholder="Type a new value (e.g. 750g) and press Enter or Add..."
                                    style={{
                                        flex: 1,
                                        padding: '0.65rem 1rem',
                                        borderRadius: '0.5rem',
                                        background: '#FFFFFF',
                                        border: '1px solid #CBD5E1',
                                        color: '#0F172A',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddValue}
                                    className="dayal-admin-head-btn"
                                    style={{ padding: '0.65rem 1.25rem', cursor: 'pointer', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1' }}
                                >
                                    + Add Value
                                </button>
                            </div>

                            {/* Value chips */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '48px', padding: '0.85rem', background: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                                {data.values.length > 0 ? (
                                    data.values.map((item, idx) => {
                                        const text = typeof item === 'string' ? item : item.value;
                                        return (
                                            <span
                                                key={idx}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    background: '#FFFFFF',
                                                    color: '#0F172A',
                                                    border: '1px solid #CBD5E1',
                                                    borderRadius: '999px',
                                                    padding: '0.35rem 0.85rem',
                                                    fontSize: '0.8125rem',
                                                    fontWeight: 600,
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                                }}
                                            >
                                                <span>{text}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveValue(idx)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#E11D48',
                                                        cursor: 'pointer',
                                                        fontWeight: 700,
                                                        fontSize: '1rem',
                                                        lineHeight: 1,
                                                        padding: 0,
                                                    }}
                                                    title="Remove this value"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        );
                                    })
                                ) : (
                                    <span style={{ color: '#64748B', fontSize: '0.8125rem', fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
                                        No values configured. Type a value above to add it.
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Submit Button Bar */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                            <Link
                                href={route('admin.attributes.index')}
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
                                {processing ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
