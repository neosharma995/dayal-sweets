import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PageSeoSection from '@/Components/Admin/PageSeoSection';

export default function Seo({ pages, stats = {}, filters = {} }) {
    const isPaginator = !Array.isArray(pages) && pages?.total !== undefined;
    const pageList = Array.isArray(pages) ? pages : (pages?.data || []);

    const totalItems = isPaginator ? pages.total : pageList.length;
    const currentPage = isPaginator ? pages.current_page : Number(filters.page || 1);
    const totalPages = isPaginator ? pages.last_page : 1;
    const itemsPerPage = isPaginator ? pages.per_page : Number(filters.per_page || 15);

    const [search, setSearch] = useState(filters.search || '');
    const [robotsFilter, setRobotsFilter] = useState(filters.robots || 'all');
    const [showCards, setShowCards] = useState(false);

    // SEO Editor Modal State
    const [activePage, setActivePage] = useState(null);
    const [seoForm, setSeoForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    useEffect(() => {
        setRobotsFilter(filters.robots || 'all');
    }, [filters.robots]);

    const applyFilters = (overrides = {}) => {
        const params = {
            search: search || undefined,
            robots: robotsFilter,
            per_page: itemsPerPage,
            page: currentPage,
            ...overrides,
        };

        if (params.robots === 'all') delete params.robots;
        if (!params.search) delete params.search;
        if (Number(params.per_page) === 15) delete params.per_page;
        if (Number(params.page) <= 1) delete params.page;

        router.get(route('admin.pages.seo'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search, page: 1 });
    };

    const openSeoEditor = (page) => {
        const secSeo = page?.sections?.seo || {};
        setActivePage(page);
        setErrors({});
        setSeoForm({
            meta_title: page.meta_title ?? secSeo.meta_title ?? `${page.title} | Dayal Sweets`,
            meta_description: page.meta_description ?? secSeo.meta_description ?? '',
            meta_keywords: page.meta_keywords ?? secSeo.meta_keywords ?? '',
            canonical_url: page.canonical_url ?? secSeo.canonical_url ?? '',
            og_title: page.og_title ?? secSeo.og_title ?? (page.meta_title || `${page.title} | Dayal Sweets`),
            og_description: page.og_description ?? secSeo.og_description ?? (page.meta_description || ''),
            og_image: page.og_image ?? secSeo.og_image ?? '',
            robots: page.robots ?? secSeo.robots ?? 'index, follow',
        });
    };

    const handleSaveSeo = (e) => {
        if (e) e.preventDefault();
        if (!activePage) return;
        setSaving(true);
        setErrors({});

        router.post(route('admin.pages.seo.update', activePage.id), seoForm, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
            onSuccess: () => {
                setActivePage(null);
            },
            onError: (errs) => {
                setErrors(errs);
                setSaving(false);
            },
        });
    };

    const getEditUrl = (page) => {
        if (page.slug === 'contact-us') return route('admin.pages.contact-us');
        if (page.slug === 'gallery') return route('admin.pages.gallery');
        if (page.slug === 'about-us') return route('admin.pages.about-us');
        return route('admin.pages.edit', page.slug);
    };

    return (
        <AdminLayout header="Pages SEO Information">
            <Head title="Pages SEO Information - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
                {/* Header Row */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.dashboard')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Admin
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <Link href={route('admin.pages.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Website Pages
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Pages SEO Information</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Pages SEO Information &amp; Meta Manager
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                            Edit Meta Titles, Meta Descriptions, Focus Keywords, Open Graph tags, and Robots rules fetched dynamically on all front website pages.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => setShowCards(!showCards)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 0.85rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transform: showCards ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                            <span>{showCards ? 'Hide Summary Cards ▲' : 'Expand Summary Cards ▼'}</span>
                        </button>

                        <Link
                            href={route('admin.pages.index')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 1rem',
                                borderRadius: '0.5rem',
                                background: '#FDF8F0',
                                color: '#8C6226',
                                border: '1px solid #E6D2B5',
                                fontSize: '0.8125rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                            }}
                        >
                            <span>← All Website Pages</span>
                        </Link>
                    </div>
                </div>

                {/* Collapsible Summary Cards */}
                {showCards && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.15rem 1.25rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Total Frontend Pages
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
                                {stats.total_pages ?? totalItems}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem', fontWeight: 500 }}>
                                Connected to live SEO head
                            </div>
                        </div>

                        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.15rem 1.25rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Meta Title &amp; Desc Ready
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
                                {stats.meta_complete ?? totalItems}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Optimized for Google search
                            </div>
                        </div>

                        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.15rem 1.25rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8C6226', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Focus Keywords Set
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8C6226', marginTop: '0.25rem' }}>
                                {stats.with_keywords ?? totalItems}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Targeted keyword tags
                            </div>
                        </div>

                        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.15rem 1.25rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Search Indexed Pages
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginTop: '0.25rem' }}>
                                {stats.indexed_pages ?? totalItems}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Robots index, follow enabled
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter Tabs + Search Bar */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.75rem',
                        padding: '1rem 1.25rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                    }}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
                        {[
                            { key: 'all', label: 'All Pages SEO' },
                            { key: 'indexed', label: 'Search Indexed (index, follow)' },
                            { key: 'noindex', label: 'No-Index Pages' },
                        ].map((tab) => {
                            const isActive = robotsFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => {
                                        setRobotsFilter(tab.key);
                                        applyFilters({ robots: tab.key, page: 1 });
                                    }}
                                    style={{
                                        padding: '0.45rem 0.9rem',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.8125rem',
                                        fontWeight: isActive ? 700 : 500,
                                        border: isActive ? '1px solid #7A1C1C' : '1px solid #CBD5E1',
                                        background: isActive ? '#7A1C1C' : '#FFFFFF',
                                        color: isActive ? '#FFFFFF' : '#475569',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
                            <input
                                type="text"
                                placeholder="Search SEO by page name, slug, meta title, meta description, or keywords..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '0.55rem 1rem',
                                    borderRadius: '0.375rem',
                                    background: '#7A1C1C',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Search
                            </button>
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        applyFilters({ search: '', page: 1 });
                                    }}
                                    style={{
                                        padding: '0.55rem 0.85rem',
                                        borderRadius: '0.375rem',
                                        background: '#F1F5F9',
                                        color: '#475569',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Clear
                                </button>
                            )}
                        </form>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Per page:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => applyFilters({ per_page: Number(e.target.value), page: 1 })}
                                style={{ padding: '0.45rem 0.6rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                            >
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SEO Data Table */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    <th style={{ padding: '0.875rem 1.15rem' }}>Page &amp; Route</th>
                                    <th style={{ padding: '0.875rem 1.15rem' }}>Google Search Snippet (Meta Title &amp; Description)</th>
                                    <th style={{ padding: '0.875rem 1.15rem' }}>Keywords &amp; Open Graph</th>
                                    <th style={{ padding: '0.875rem 1.15rem' }}>Robots Rule</th>
                                    <th style={{ padding: '0.875rem 1.15rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageList.map((page) => {
                                    const publicPath = page.slug === 'home' ? '/' : `/${page.slug}`;
                                    const metaTitle = page.meta_title || page.sections?.seo?.meta_title || `${page.title} | Dayal Sweets`;
                                    const metaDesc = page.meta_description || page.sections?.seo?.meta_description || '';
                                    const metaKeywords = page.meta_keywords || page.sections?.seo?.meta_keywords || '';
                                    const ogImage = page.og_image || page.sections?.seo?.og_image || '';
                                    const robots = page.robots || page.sections?.seo?.robots || 'index, follow';
                                    const isNoIndex = robots.includes('noindex');

                                    return (
                                        <tr key={page.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '1rem 1.15rem', minWidth: '175px' }}>
                                                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                                                    {page.title}
                                                </div>
                                                <a
                                                    href={publicPath}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        color: '#2563EB',
                                                        textDecoration: 'none',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 600,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        marginTop: '0.15rem',
                                                    }}
                                                >
                                                    <span>{publicPath}</span>
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                                    </svg>
                                                </a>
                                            </td>

                                            <td style={{ padding: '1rem 1.15rem', maxWidth: '460px' }}>
                                                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.5rem', padding: '0.65rem 0.85rem' }}>
                                                    <div style={{ fontSize: '0.7rem', color: '#5F6368', marginBottom: '0.15rem' }}>
                                                        Dayal Sweets • {publicPath}
                                                    </div>
                                                    <div style={{ fontWeight: 700, color: '#1A0DAB', fontSize: '0.88rem', lineHeight: 1.3, marginBottom: '0.2rem' }}>
                                                        {metaTitle}
                                                    </div>
                                                    <div
                                                        style={{
                                                            color: '#4D5156',
                                                            fontSize: '0.78rem',
                                                            lineHeight: 1.4,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {metaDesc || 'No meta description configured.'}
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={{ padding: '1rem 1.15rem', maxWidth: '280px' }}>
                                                {metaKeywords ? (
                                                    <div style={{ fontSize: '0.76rem', color: '#334155', lineHeight: 1.4, marginBottom: '0.35rem' }}>
                                                        <strong style={{ color: '#8C6226' }}>Keywords:</strong> {metaKeywords}
                                                    </div>
                                                ) : (
                                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
                                                        No keywords set
                                                    </div>
                                                )}
                                                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                                    OG Image: <strong>{ogImage ? 'Configured ✓' : 'Default'}</strong>
                                                </div>
                                            </td>

                                            <td style={{ padding: '1rem 1.15rem' }}>
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '0.22rem 0.6rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 700,
                                                        background: isNoIndex ? '#FEF2F2' : '#ECFDF5',
                                                        color: isNoIndex ? '#DC2626' : '#059669',
                                                        border: isNoIndex ? '1px solid #FECACA' : '1px solid #A7F3D0',
                                                    }}
                                                >
                                                    {robots}
                                                </span>
                                            </td>

                                            <td style={{ padding: '1rem 1.15rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => openSeoEditor(page)}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            padding: '0.45rem 0.85rem',
                                                            borderRadius: '0.375rem',
                                                            backgroundColor: '#7A1C1C',
                                                            color: '#FFFFFF',
                                                            border: 'none',
                                                            fontSize: '0.78rem',
                                                            fontWeight: 700,
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <span>Edit SEO</span>
                                                    </button>

                                                    <Link
                                                        href={getEditUrl(page)}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            padding: '0.45rem 0.75rem',
                                                            borderRadius: '0.375rem',
                                                            backgroundColor: '#FFFFFF',
                                                            color: '#334155',
                                                            border: '1px solid #CBD5E1',
                                                            fontSize: '0.78rem',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        <span>Page Content</span>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {totalItems > 0 && (
                            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', background: '#FAFAFA', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#475569' }}>
                                    <span>Rows per page:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => applyFilters({ per_page: Number(e.target.value), page: 1 })}
                                        style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 600, background: '#FFFFFF' }}
                                    >
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={(page) => applyFilters({ page })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit SEO Modal */}
            <Modal show={Boolean(activePage)} onClose={() => !saving && setActivePage(null)} maxWidth="2xl">
                {activePage && (
                    <form onSubmit={handleSaveSeo} style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                    Edit SEO Information — {activePage.title}
                                </h3>
                                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                                    Frontend URL: {activePage.slug === 'home' ? '/' : `/${activePage.slug}`}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActivePage(null)}
                                style={{ background: 'transparent', border: 'none', fontSize: '1.4rem', color: '#64748B', cursor: 'pointer' }}
                            >
                                &times;
                            </button>
                        </div>

                        <PageSeoSection
                            seo={seoForm}
                            onChange={setSeoForm}
                            pageSlug={activePage.slug}
                            pageTitle={activePage.title}
                            errors={errors}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                            <button
                                type="button"
                                onClick={() => setActivePage(null)}
                                disabled={saving}
                                style={{ padding: '0.55rem 1.1rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#334155', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{ padding: '0.55rem 1.25rem', borderRadius: '0.45rem', border: 'none', background: '#7A1C1C', color: '#FFFFFF', fontWeight: 700, fontSize: '0.84rem', cursor: saving ? 'not-allowed' : 'pointer' }}
                            >
                                {saving ? 'Saving SEO...' : 'Save SEO Information'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </AdminLayout>
    );
}
