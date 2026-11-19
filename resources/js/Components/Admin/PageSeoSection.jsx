import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export function PageSeoSummaryCard({ seo = {}, pageSlug = 'home', pageTitle = 'Page' }) {
    const publicPath = pageSlug === 'home' ? '/' : `/${pageSlug}`;
    const metaTitle = seo.meta_title || `${pageTitle} | Dayal Sweets`;
    const metaDescription = seo.meta_description || 'No meta description configured yet.';
    const robots = seo.robots || 'index, follow';

    return (
        <div
            style={{
                background: '#FFFFFF',
                borderRadius: '0.75rem',
                border: '1px solid #E2E8F0',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                        SEO Summary (View Only)
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        SEO metadata is edited separately from page content.
                    </span>
                </div>

                <Link
                    href={route('admin.pages.seo')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '0.375rem',
                        background: '#7A1C1C',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}
                >
                    Edit SEO →
                </Link>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.5rem', padding: '0.9rem 1rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '0.2rem' }}>
                    {publicPath} • Robots: <strong>{robots}</strong>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E40AF', marginBottom: '0.25rem' }}>
                    {metaTitle}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.45 }}>
                    {metaDescription}
                </div>
                {seo.meta_keywords && (
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.4rem' }}>
                        <strong>Keywords:</strong> {seo.meta_keywords}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PageSeoSection({
    seo = {},
    onChange,
    pageSlug = '',
    pageTitle = 'Page',
    errors = {},
}) {
    const [uploadingOg, setUploadingOg] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handleField = (field, value) => {
        if (onChange) {
            onChange({
                ...seo,
                [field]: value,
            });
        }
    };

    const getCsrfToken = () => {
        const metaTag = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (metaTag) return metaTag;
        const cookieMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return cookieMatch ? decodeURIComponent(cookieMatch[1]) : '';
    };

    const handleOgImageUpload = async (file) => {
        if (!file) return;
        setUploadingOg(true);
        setUploadError('');

        try {
            const formData = new FormData();
            formData.append('image_file', file);

            const uploadRoute = typeof route !== 'undefined' && route().has('admin.pages.seo.upload-image')
                ? route('admin.pages.seo.upload-image')
                : '/admin/pages/seo/upload-image';

            const res = await fetch(uploadRoute, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
            });

            const data = await res.json();
            if (data.success && data.url) {
                handleField('og_image', data.url);
            } else {
                setUploadError(data.message || 'Failed to upload image.');
            }
        } catch (err) {
            setUploadError('Error uploading image.');
        } finally {
            setUploadingOg(false);
        }
    };

    const publicPath = pageSlug === 'home' ? '/' : `/${pageSlug}`;
    const previewUrl = seo.canonical_url || `${typeof window !== 'undefined' ? window.location.origin : 'https://dayalsweets.com'}${publicPath}`;
    const previewTitle = seo.meta_title || `${pageTitle} | Dayal Sweets`;
    const previewDesc = seo.meta_description || 'Order authentic handmade Indian sweets, pure desi ghee mithai, namkeen, and festive gift hampers online from Dayal Sweets.';

    const titleLen = (seo.meta_title || '').length;
    const descLen = (seo.meta_description || '').length;

    return (
        <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '0.4rem', background: '#FDF8F0', border: '1px solid #E6D2B5', color: '#7A1C1C', fontWeight: 800, fontSize: '0.8rem' }}>
                            SEO
                        </span>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Page SEO Information &amp; Meta Tags
                        </h3>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                        Configure search engine Meta Title, Meta Description, Keywords, Open Graph social preview, and indexing rules fetched on the live frontend page.
                    </p>
                </div>

                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: (seo.robots || 'index, follow').includes('noindex') ? '#FEF2F2' : '#ECFDF5',
                        color: (seo.robots || 'index, follow').includes('noindex') ? '#DC2626' : '#059669',
                        border: (seo.robots || 'index, follow').includes('noindex') ? '1px solid #FECACA' : '1px solid #A7F3D0',
                    }}
                >
                    <span>●</span>
                    <span>{(seo.robots || 'index, follow').includes('noindex') ? 'No-Index' : 'Search Indexed'}</span>
                </span>
            </div>

            {/* Live Google SERP Preview Box */}
            <div
                style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.6rem',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.35rem',
                }}
            >
                <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', marginBottom: '0.45rem' }}>
                    Google Search Result Preview (Live Frontend SEO)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#202124', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 600 }}>Dayal Sweets</span>
                    <span style={{ color: '#5F6368' }}>•</span>
                    <span style={{ color: '#5F6368', wordBreak: 'break-all' }}>{previewUrl}</span>
                </div>
                <div style={{ fontSize: '1.08rem', fontWeight: 600, color: '#1A0DAB', lineHeight: 1.35, marginBottom: '0.25rem' }}>
                    {previewTitle}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#4D5156', lineHeight: 1.45 }}>
                    {previewDesc}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {/* 1. Meta Title & Robots Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                                SEO Meta Title <span style={{ color: '#E11D48' }}>*</span>
                            </label>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: titleLen > 65 ? '#D97706' : '#64748B' }}>
                                {titleLen} / 60 chars
                            </span>
                        </div>
                        <input
                            type="text"
                            value={seo.meta_title || ''}
                            onChange={(e) => handleField('meta_title', e.target.value)}
                            placeholder={`${pageTitle} | Dayal Sweets`}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                        />
                        {errors.meta_title && (
                            <span style={{ color: '#E11D48', fontSize: '0.75rem', fontWeight: 600 }}>{errors.meta_title}</span>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Robots / Indexing Rule
                        </label>
                        <select
                            value={seo.robots || 'index, follow'}
                            onChange={(e) => handleField('robots', e.target.value)}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem', background: '#FFFFFF' }}
                        >
                            <option value="index, follow">index, follow (Recommended)</option>
                            <option value="noindex, follow">noindex, follow (Hide from Search)</option>
                            <option value="index, nofollow">index, nofollow</option>
                            <option value="noindex, nofollow">noindex, nofollow</option>
                        </select>
                    </div>
                </div>

                {/* 2. Meta Description */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                            SEO Meta Description
                        </label>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: descLen > 165 ? '#D97706' : '#64748B' }}>
                            {descLen} / 160 chars
                        </span>
                    </div>
                    <textarea
                        rows="3"
                        value={seo.meta_description || ''}
                        onChange={(e) => handleField('meta_description', e.target.value)}
                        placeholder="Enter a compelling summary of this page for search engines..."
                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                    {errors.meta_description && (
                        <span style={{ color: '#E11D48', fontSize: '0.75rem', fontWeight: 600 }}>{errors.meta_description}</span>
                    )}
                </div>

                {/* 3. Meta Keywords & Canonical URL */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Focus Meta Keywords (Comma separated)
                        </label>
                        <input
                            type="text"
                            value={seo.meta_keywords || ''}
                            onChange={(e) => handleField('meta_keywords', e.target.value)}
                            placeholder="Dayal Sweets, Indian mithai, desi ghee sweets..."
                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Canonical URL (Optional)
                        </label>
                        <input
                            type="text"
                            value={seo.canonical_url || ''}
                            onChange={(e) => handleField('canonical_url', e.target.value)}
                            placeholder={`https://dayalsweets.com${publicPath}`}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                        />
                    </div>
                </div>

                {/* 4. Open Graph Social Sharing Section */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.5rem', padding: '1rem 1.25rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                        Open Graph / Social Media Share Tags (WhatsApp, Facebook, X/Twitter)
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.85rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                OG Social Title
                            </label>
                            <input
                                type="text"
                                value={seo.og_title || ''}
                                onChange={(e) => handleField('og_title', e.target.value)}
                                placeholder={seo.meta_title || `${pageTitle} | Dayal Sweets`}
                                style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.84rem', background: '#FFFFFF' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                OG Social Share Image (URL or Upload)
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    value={seo.og_image || ''}
                                    onChange={(e) => handleField('og_image', e.target.value)}
                                    placeholder="/uploads/2026/08/Hero-Banner.png"
                                    style={{ flex: 1, padding: '0.5rem 0.7rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.84rem', background: '#FFFFFF' }}
                                />
                                <label
                                    style={{
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        background: '#7A1C1C',
                                        color: '#FFFFFF',
                                        fontSize: '0.76rem',
                                        fontWeight: 600,
                                        cursor: uploadingOg ? 'not-allowed' : 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {uploadingOg ? 'Uploading...' : 'Upload Image'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleOgImageUpload(e.target.files?.[0])}
                                        style={{ display: 'none' }}
                                        disabled={uploadingOg}
                                    />
                                </label>
                            </div>
                            {uploadError && (
                                <span style={{ color: '#DC2626', fontSize: '0.72rem', display: 'block', marginTop: '0.2rem' }}>{uploadError}</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                            OG Social Description
                        </label>
                        <textarea
                            rows="2"
                            value={seo.og_description || ''}
                            onChange={(e) => handleField('og_description', e.target.value)}
                            placeholder={seo.meta_description || 'Social share description...'}
                            style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.84rem', background: '#FFFFFF' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
