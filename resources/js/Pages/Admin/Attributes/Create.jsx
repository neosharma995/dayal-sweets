import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AttributeCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        values: [],
    });

    const [newValueInput, setNewValueInput] = useState('');

    const handleNameChange = (e) => {
        const val = e.target.value;
        const generatedSlug = val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        setData((prev) => ({
            ...prev,
            name: val,
            slug: generatedSlug,
        }));
    };

    const handleAddValue = (valToAdd = null) => {
        const value = typeof valToAdd === 'string' ? valToAdd.trim() : newValueInput.trim();
        if (!value) return;

        // Prevent duplicate value strings
        const exists = data.values.some((item) => (typeof item === 'string' ? item : item.value).toLowerCase() === value.toLowerCase());
        if (exists) {
            setNewValueInput('');
            return;
        }

        setData('values', [...data.values, { value, slug: value.toLowerCase().replace(/[^a-z0-9]/g, '-') }]);
        setNewValueInput('');
    };

    const handleRemoveValue = (index) => {
        setData('values', data.values.filter((_, idx) => idx !== index));
    };

    const applyPreset = (presetName) => {
        if (presetName === 'weight') {
            setData((prev) => ({
                ...prev,
                name: 'Weight',
                slug: 'weight',
                description: 'Standard packaged sweet and mithai weights',
                values: [
                    { value: '250g', slug: '250g' },
                    { value: '500g', slug: '500g' },
                    { value: '1kg', slug: '1kg' },
                    { value: '2kg', slug: '2kg' },
                    { value: '5kg', slug: '5kg' },
                ],
            }));
        } else if (presetName === 'packaging') {
            setData((prev) => ({
                ...prev,
                name: 'Packaging Type',
                slug: 'packaging-type',
                description: 'Container packaging format',
                values: [
                    { value: 'Standard Box', slug: 'standard-box' },
                    { value: 'Royal Tin', slug: 'royal-tin' },
                    { value: 'Airtight Pouch', slug: 'airtight-pouch' },
                    { value: 'Velvet Gift Box', slug: 'velvet-gift-box' },
                ],
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.attributes.store'));
    };

    return (
        <AdminLayout header="Add New Attribute">
            <Head title="Create Product Attribute - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ maxWidth: '850px', margin: '0 auto' }}>
                {/* Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.attributes.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Attributes
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Create</span>
                        </div>
                        <h1>Create Product Attribute</h1>
                        <p>Define a reusable attribute (e.g. Weight, Packaging) and its available values.</p>
                    </div>

                    <Link
                        href={route('admin.attributes.index')}
                        className="dayal-admin-head-btn"
                        style={{ textDecoration: 'none' }}
                    >
                        &larr; Back to Attributes
                    </Link>
                </div>

                {/* Quick Presets Bar */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.65rem' }}>
                        ⚡ Quick Presets (Click to autofill):
                    </div>
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => applyPreset('weight')}
                            style={{
                                padding: '0.45rem 0.85rem',
                                borderRadius: '999px',
                                background: '#F5EBD7',
                                border: '1px solid rgba(184, 142, 75, 0.4)',
                                color: '#8C6226',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            + Weight (250g, 500g, 1kg, 2kg, 5kg)
                        </button>
                        <button
                            type="button"
                            onClick={() => applyPreset('packaging')}
                            style={{
                                padding: '0.45rem 0.85rem',
                                borderRadius: '999px',
                                background: '#F5EBD7',
                                border: '1px solid rgba(184, 142, 75, 0.4)',
                                color: '#8C6226',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            + Packaging Type (Standard Box, Royal Tin, Pouch, Velvet Box)
                        </button>
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
                                    onChange={handleNameChange}
                                    placeholder="e.g. Weight or Packaging Type"
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
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Explain how this attribute will be used across product variations..."
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

                        {/* Attribute Values Section */}
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                    Attribute Values / Terms
                                </label>
                                <span style={{ fontSize: '0.75rem', color: '#B88E4B', fontWeight: 600 }}>
                                    {data.values.length} value{data.values.length === 1 ? '' : 's'} added
                                </span>
                            </div>
                            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0 0 1rem' }}>
                                Add the individual values for this attribute (e.g. "250g", "500g", "1kg"). These will appear as quick selection pills inside product forms.
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
                                    placeholder="Type a value (e.g. 500g) and press Enter or Add..."
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
                                    onClick={() => handleAddValue()}
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
                                        No values added yet. Type a value above or click a Quick Preset.
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
                                {processing ? 'Creating Attribute...' : 'Save & Publish Attribute'}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
