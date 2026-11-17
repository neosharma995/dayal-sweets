import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { MapPinIcon } from '@/Components/Icons';

export default function Edit({ outlet }) {
    const { data, setData, errors, processing } = useForm({
        name: outlet.name || '',
        slug: outlet.slug || '',
        subtitle: outlet.subtitle || '',
        address: outlet.address || '',
        city: outlet.city || '',
        state: outlet.state || 'Himachal Pradesh',
        pincode: outlet.pincode || '',
        phone: outlet.phone || '',
        phone_raw: outlet.phone_raw || '',
        whatsapp: outlet.whatsapp || '',
        whatsapp_raw: outlet.whatsapp_raw || '',
        email: outlet.email || '',
        timings: outlet.timings || '',
        image: outlet.image || '',
        image_file: null,
        map_url: outlet.map_url || '',
        status: outlet.status || (outlet.is_coming_soon ? 'coming_soon' : (outlet.is_active ? 'active' : 'inactive')),
        is_active: Boolean(outlet.is_active),
        is_coming_soon: Boolean(outlet.is_coming_soon),
        expected_opening: outlet.expected_opening || '',
        sort_order: outlet.sort_order ?? 0,
    });

    const [previewUrl, setPreviewUrl] = useState(outlet.image_url || outlet.image || null);

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        const isComingSoon = newStatus === 'coming_soon';
        const isActive = newStatus !== 'inactive';

        setData((prev) => ({
            ...prev,
            status: newStatus,
            is_active: isActive,
            is_coming_soon: isComingSoon,
            timings: isComingSoon && prev.timings === 'Mon - Sun: 8:00 AM - 10:00 PM' ? 'Coming Soon' : prev.timings,
            expected_opening: isComingSoon && !prev.expected_opening ? 'Expected Opening Coming Soon' : prev.expected_opening,
        }));
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_file', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // If file is attached, submit via POST with _method PUT for multipart/form-data support in PHP
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('slug', data.slug || '');
        formData.append('subtitle', data.subtitle || '');
        formData.append('address', data.address);
        formData.append('city', data.city || '');
        formData.append('state', data.state || 'Himachal Pradesh');
        formData.append('pincode', data.pincode || '');
        formData.append('phone', data.phone || '');
        formData.append('phone_raw', data.phone_raw || '');
        formData.append('whatsapp', data.whatsapp || '');
        formData.append('whatsapp_raw', data.whatsapp_raw || '');
        formData.append('email', data.email || '');
        formData.append('timings', data.timings || '');
        formData.append('map_url', data.map_url || '');
        formData.append('status', data.status);
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('is_coming_soon', data.is_coming_soon ? '1' : '0');
        formData.append('expected_opening', data.expected_opening || '');
        formData.append('sort_order', String(data.sort_order));

        if (data.image_file) {
            formData.append('image_file', data.image_file);
        } else if (data.image) {
            formData.append('image', data.image);
        }

        router.post(route('admin.outlets.update', outlet.id), formData, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout header={`Edit Outlet: ${outlet.name}`}>
            <Head title={`Edit ${outlet.name} - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                {/* Header breadcrumb & navigation */}
                <div
                    className="dayal-admin-view-header"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.outlets.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Outlets
                            </Link>
                            <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#B88E4B', fontSize: '0.8125rem', fontWeight: 600 }}>Edit</span>
                        </div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.5rem', color: '#0F172A' }}>
                            <MapPinIcon width="24" height="24" style={{ color: '#B88E4B' }} />
                            <span>Edit Outlet &mdash; {outlet.name}</span>
                        </h1>
                        <p style={{ margin: '0.25rem 0 0', color: '#64748B', fontSize: '0.875rem' }}>
                            Update store information, phone numbers, map link, or status.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                            href={route('admin.outlets.show', outlet.id)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                background: '#FFFFFF',
                                border: '1px solid #CBD5E1',
                                color: '#334155',
                                textDecoration: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                            }}
                        >
                            View Preview
                        </Link>
                        <Link
                            href={route('admin.outlets.index')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                background: '#F1F5F9',
                                border: '1px solid #CBD5E1',
                                color: '#334155',
                                textDecoration: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                            }}
                        >
                            &larr; Back to List
                        </Link>
                    </div>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        padding: '1.75rem',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Section 1: Basic Info */}
                        <div>
                            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                                1. Basic Outlet Details
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        Outlet Name <span style={{ color: '#EF4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: errors.name ? '1px solid #EF4444' : '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                        }}
                                    />
                                    {errors.name && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</p>}
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        Subtitle / Location Note
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Main Market, Gandhi Chowk, Opp. Bus Stand"
                                        value={data.subtitle}
                                        onChange={(e) => setData('subtitle', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        Status <span style={{ color: '#EF4444' }}>*</span>
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={handleStatusChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                            background: '#FFFFFF',
                                        }}
                                    >
                                        <option value="active">Active (Open &amp; Serving)</option>
                                        <option value="coming_soon">Coming Soon (Opening Soon)</option>
                                        <option value="inactive">Inactive (Temporarily Closed)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Address & Geography */}
                        <div>
                            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                                2. Address &amp; Location
                            </h3>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                    Full Address <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <textarea
                                    rows="2"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem 0.875rem',
                                        borderRadius: '0.375rem',
                                        border: errors.address ? '1px solid #EF4444' : '1px solid #CBD5E1',
                                        fontSize: '0.875rem',
                                        color: '#0F172A',
                                    }}
                                />
                                {errors.address && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.address}</p>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        City / Town
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        PIN Code
                                    </label>
                                    <input
                                        type="text"
                                        value={data.pincode}
                                        onChange={(e) => setData('pincode', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Contact & Hours */}
                        <div>
                            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                                3. Contact &amp; Operating Hours
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        WhatsApp Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        Store Timings
                                    </label>
                                    <input
                                        type="text"
                                        value={data.timings}
                                        onChange={(e) => setData('timings', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        Google Maps Link / URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.map_url}
                                        onChange={(e) => setData('map_url', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                        }}
                                    />
                                </div>

                                {data.status === 'coming_soon' && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#D97706', marginBottom: '0.35rem' }}>
                                            Coming Soon Badge / Expected Opening Text
                                        </label>
                                        <input
                                            type="text"
                                            value={data.expected_opening}
                                            onChange={(e) => setData('expected_opening', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem 0.875rem',
                                                borderRadius: '0.375rem',
                                                border: '1px solid #FCD34D',
                                                background: '#FFFBEB',
                                                fontSize: '0.875rem',
                                                color: '#92400E',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 4: Image & Display */}
                        <div>
                            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                                4. Outlet Image &amp; Display Order
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        Upload New Outlet Photo
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImageFileChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.8125rem',
                                        }}
                                    />
                                    {errors.image_file && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.image_file}</p>}

                                    <div style={{ marginTop: '0.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '0.2rem' }}>
                                            Or relative / external image path:
                                        </label>
                                        <input
                                            type="text"
                                            value={data.image}
                                            onChange={(e) => {
                                                setData('image', e.target.value);
                                                setPreviewUrl(e.target.value);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '0.375rem',
                                                border: '1px solid #E2E8F0',
                                                fontSize: '0.8125rem',
                                                color: '#475569',
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value, 10) || 0)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            color: '#0F172A',
                                        }}
                                    />
                                    <p style={{ color: '#94A3B8', fontSize: '0.6875rem', marginTop: '0.2rem' }}>Lower numbers appear first on the website.</p>
                                </div>
                            </div>

                            {/* Image Preview */}
                            {previewUrl && (
                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Current Preview:</span>
                                    <img
                                        src={previewUrl}
                                        alt={outlet.name}
                                        style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Row */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                gap: '0.75rem',
                                paddingTop: '1.25rem',
                                borderTop: '1px solid #E2E8F0',
                            }}
                        >
                            <Link
                                href={route('admin.outlets.index')}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    background: '#FFFFFF',
                                    color: '#475569',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.625rem 1.5rem',
                                    borderRadius: '0.375rem',
                                    border: 'none',
                                    background: '#B88E4B',
                                    color: '#FFFFFF',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    opacity: processing ? 0.7 : 1,
                                    boxShadow: '0 2px 4px rgba(184, 142, 75, 0.25)',
                                }}
                            >
                                <span>{processing ? 'Saving Changes...' : 'Update Outlet'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
