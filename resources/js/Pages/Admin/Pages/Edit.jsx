import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageSeoSummaryCard } from '@/Components/Admin/PageSeoSection';

export default function Edit({ page }) {
    const sections = page?.sections || {};
    const slug = page?.slug || 'home';

    const [title, setTitle] = useState(page?.title || 'Page');
    const [isActive, setIsActive] = useState(page?.is_active ?? true);

    // Top Bar / Hero Section Fields
    const [topBarHeading, setTopBarHeading] = useState(
        sections.top_bar_Heading ?? (page?.title || 'DAYAL SWEETS').toUpperCase()
    );
    const [topBarSubHeading, setTopBarSubHeading] = useState(
        sections.top_bar_sub_heading ?? 'Crafting Sweet Traditions Since 1962'
    );
    const [topBarDescription, setTopBarDescription] = useState(
        sections.top_bar_description ?? ''
    );

    // Page SEO Information State
    const [seo, setSeo] = useState({
        meta_title: page?.meta_title ?? sections.seo?.meta_title ?? `${page?.title || 'Page'} | Dayal Sweets`,
        meta_description: page?.meta_description ?? sections.seo?.meta_description ?? '',
        meta_keywords: page?.meta_keywords ?? sections.seo?.meta_keywords ?? '',
        canonical_url: page?.canonical_url ?? sections.seo?.canonical_url ?? '',
        og_title: page?.og_title ?? sections.seo?.og_title ?? (page?.meta_title || `${page?.title || 'Page'} | Dayal Sweets`),
        og_description: page?.og_description ?? sections.seo?.og_description ?? (page?.meta_description || ''),
        og_image: page?.og_image ?? sections.seo?.og_image ?? '',
        robots: page?.robots ?? sections.seo?.robots ?? 'index, follow',
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [saveSuccess, setSaveSuccess] = useState(false);

    const publicUrl = slug === 'home' ? '/' : `/${slug}`;

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSaveSuccess(false);

        const payload = {
            title,
            is_active: isActive,
            top_bar_Heading: topBarHeading,
            top_bar_sub_heading: topBarSubHeading,
            top_bar_description: topBarDescription,
            ...seo,
        };

        router.post(route('admin.pages.update', slug), payload, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 4000);
            },
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
        });
    };

    return (
        <AdminLayout header={`${page?.title || 'Page'} Settings & SEO`}>
            <Head title={`${page?.title || 'Page'} Settings & SEO - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '940px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <Link href={route('admin.pages.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Website Pages
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>{page?.title}</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            {page?.title} — Page Content &amp; SEO Information
                        </h1>
                        <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                            Edit the hero banner content and search engine SEO metadata for <strong>{publicUrl}</strong>.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                        <Link
                            href={route('admin.pages.seo')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 0.9rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E6D2B5',
                                backgroundColor: '#FDF8F0',
                                color: '#8C6226',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            <span>All Pages SEO</span>
                        </Link>

                        <a
                            href={publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 1rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                color: '#1E293B',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <span>Preview Page</span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                        </a>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '38px',
                                padding: '0 1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #7A1C1C',
                                backgroundColor: processing ? '#991B1B' : '#7A1C1C',
                                color: '#FFFFFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                boxShadow: '0 1px 2px 0 rgba(122, 28, 28, 0.25)',
                                minWidth: '105px',
                            }}
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>

                        <Link
                            href={route('admin.pages.index')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '38px',
                                height: '38px',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                backgroundColor: '#FFFFFF',
                                color: '#64748B',
                                textDecoration: 'none',
                            }}
                            title="Back to Pages"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {saveSuccess && (
                    <div style={{ padding: '0.85rem 1.25rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '0.5rem', color: '#065F46', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>✓</span> {page?.title} content and SEO information saved! Changes are live on the website.
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div style={{ padding: '0.85rem 1.25rem', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '0.5rem', color: '#DC2626', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Please correct the errors:</strong>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem' }}>
                            {Object.entries(errors).map(([key, msg]) => (
                                <li key={key}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* SECTION 1: PAGE IDENTITY & HERO BANNER */}
                    <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                    Page Identity &amp; Hero Banner Section
                                </h3>
                                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                                    Configure the page title, public status, and top hero banner heading, sub-heading, and description.
                                </p>
                            </div>

                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={Boolean(isActive)}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    style={{ width: '16px', height: '16px', accentColor: '#7A1C1C' }}
                                />
                                <span>Active on Storefront</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Internal Page Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Public Route / Slug
                                    </label>
                                    <input
                                        type="text"
                                        value={publicUrl}
                                        disabled
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #E2E8F0', fontSize: '0.875rem', background: '#F8FAFC', color: '#64748B' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Hero Banner Heading <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={topBarHeading}
                                    onChange={(e) => setTopBarHeading(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Hero Banner Sub-Heading
                                </label>
                                <input
                                    type="text"
                                    value={topBarSubHeading}
                                    onChange={(e) => setTopBarSubHeading(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Hero Banner Description
                                </label>
                                <textarea
                                    rows="3"
                                    value={topBarDescription}
                                    onChange={(e) => setTopBarDescription(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: PAGE SEO SUMMARY (VIEW ONLY - EDIT SEPARATELY) */}
                    <PageSeoSummaryCard
                        seo={seo}
                        pageSlug={slug}
                        pageTitle={title}
                    />
                </form>
            </div>
        </AdminLayout>
    );
}
