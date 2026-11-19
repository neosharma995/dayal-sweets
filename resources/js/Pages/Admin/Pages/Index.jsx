import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PageSeoSection from '@/Components/Admin/PageSeoSection';
import { FileTextIcon } from '@/Components/Icons';

export default function Index({ pages, stats = {}, filters = {} }) {
    const isPaginator = !Array.isArray(pages) && pages?.total !== undefined;
    const pageList = Array.isArray(pages) ? pages : (pages?.data || []);

    const totalItems = isPaginator ? pages.total : pageList.length;
    const currentPage = isPaginator ? pages.current_page : Number(filters.page || 1);
    const totalPages = isPaginator ? pages.last_page : 1;
    const itemsPerPage = isPaginator ? pages.per_page : Number(filters.per_page || 10);

    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [showCards, setShowCards] = useState(false);

    // Quick SEO Edit Modal
    const [seoModalPage, setSeoModalPage] = useState(null);
    const [seoForm, setSeoForm] = useState({});
    const [savingSeo, setSavingSeo] = useState(false);
    const [seoErrors, setSeoErrors] = useState({});

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    useEffect(() => {
        setStatusFilter(filters.status || 'all');
    }, [filters.status]);

    const applyFilters = (overrides = {}) => {
        const params = {
            search: search || undefined,
            status: statusFilter,
            per_page: itemsPerPage,
            page: currentPage,
            ...overrides,
        };

        if (params.status === 'all') delete params.status;
        if (!params.search) delete params.search;
        if (Number(params.per_page) === 10) delete params.per_page;
        if (Number(params.page) <= 1) delete params.page;

        router.get(route('admin.pages.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search, page: 1 });
    };

    const openQuickSeoModal = (page) => {
        const secSeo = page?.sections?.seo || {};
        setSeoModalPage(page);
        setSeoErrors({});
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

    const handleSaveQuickSeo = (e) => {
        if (e) e.preventDefault();
        if (!seoModalPage) return;
        setSavingSeo(true);
        setSeoErrors({});

        router.post(route('admin.pages.seo.update', seoModalPage.id), seoForm, {
            preserveScroll: true,
            onFinish: () => setSavingSeo(false),
            onSuccess: () => {
                setSeoModalPage(null);
            },
            onError: (errs) => {
                setSeoErrors(errs);
                setSavingSeo(false);
            },
        });
    };

    const getEditUrl = (page) => {
        if (page.slug === 'contact-us') return route('admin.pages.contact-us');
        if (page.slug === 'gallery') return route('admin.pages.gallery');
        if (page.slug === 'about-us') return route('admin.pages.about-us');
        return route('admin.pages.edit', page.slug);
    };

    const getPublicUrl = (page) => {
        if (page.slug === 'home') return '/';
        if (page.slug === 'contact-us') return route('contact');
        if (page.slug === 'gallery') return route('gallery');
        return `/${page.slug}`;
    };

    return (
        <AdminLayout header="Website Pages & SEO">
            <Head title="Website Pages & SEO - Dayal Sweets Admin" />

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
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Website Pages</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Website Pages &amp; SEO Information
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                            Manage dynamic page sections, hero banners, and search engine SEO metadata across all storefront pages.
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
                            href={route('admin.pages.seo')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 1rem',
                                borderRadius: '0.5rem',
                                background: '#7A1C1C',
                                color: '#FFFFFF',
                                border: '1px solid #7A1C1C',
                                fontSize: '0.8125rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px rgba(122, 28, 28, 0.2)',
                            }}
                        >
                            <span>Pages SEO Manager →</span>
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
                                Total Website Pages
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
                                {stats.total ?? totalItems}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem', fontWeight: 500 }}>
                                Connected to live storefront
                            </div>
                        </div>

                        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.15rem 1.25rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Active Pages
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
                                {stats.active ?? totalItems}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Published on website
                            </div>
                        </div>

                        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.15rem 1.25rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                SEO Configured
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginTop: '0.25rem' }}>
                                {stats.seo_configured ?? totalItems}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Meta title &amp; description ready
                            </div>
                        </div>

                        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.15rem 1.25rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8C6226', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Search Indexed
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8C6226', marginTop: '0.25rem' }}>
                                {stats.indexed ?? totalItems}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Robots index, follow active
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
                            { key: 'all', label: 'All Pages' },
                            { key: 'active', label: 'Active' },
                            { key: 'seo_ready', label: 'SEO Configured' },
                            { key: 'inactive', label: 'Inactive' },
                        ].map((tab) => {
                            const isActive = statusFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter(tab.key);
                                        applyFilters({ status: tab.key, page: 1 });
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
                                placeholder="Search pages by title, slug, meta title, or SEO keywords..."
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

                {/* Pages & SEO Table */}
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
                                    <th style={{ padding: '0.875rem 1.15rem' }}>Page Name</th>
                                    <th style={{ padding: '0.875rem 1.15rem' }}>Slug / Public URL</th>
                                    <th style={{ padding: '0.875rem 1.15rem' }}>SEO Information (Meta Title &amp; Description)</th>
                                    <th style={{ padding: '0.875rem 1.15rem' }}>Status &amp; Indexing</th>
                                    <th style={{ padding: '0.875rem 1.15rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageList.map((page) => {
                                    const editUrl = getEditUrl(page);
                                    const publicUrl = getPublicUrl(page);
                                    const metaTitle = page.meta_title || page.sections?.seo?.meta_title || `${page.title} | Dayal Sweets`;
                                    const metaDesc = page.meta_description || page.sections?.seo?.meta_description || '';
                                    const robots = page.robots || page.sections?.seo?.robots || 'index, follow';
                                    const isNoIndex = robots.includes('noindex');

                                    return (
                                        <tr key={page.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '1rem 1.15rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '0.5rem',
                                                            background: '#FEF3C7',
                                                            color: '#B45309',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <FileTextIcon width="18" height="18" />
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={editUrl}
                                                            style={{ fontWeight: 700, color: '#0F172A', textDecoration: 'none', fontSize: '0.9rem' }}
                                                        >
                                                            {page.title}
                                                        </Link>
                                                        <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.1rem' }}>
                                                            Hero: {page.sections?.top_bar_Heading || page.title}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={{ padding: '1rem 1.15rem' }}>
                                                <a
                                                    href={publicUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        color: '#2563EB',
                                                        textDecoration: 'none',
                                                        fontWeight: 600,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                    }}
                                                >
                                                    <span>{page.slug === 'home' ? '/' : `/${page.slug}`}</span>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                                    </svg>
                                                </a>
                                            </td>

                                            <td style={{ padding: '1rem 1.15rem', maxWidth: '420px' }}>
                                                <div style={{ fontWeight: 700, color: '#1A0DAB', fontSize: '0.84rem', marginBottom: '0.2rem' }}>
                                                    {metaTitle}
                                                </div>
                                                <div
                                                    style={{
                                                        color: '#475569',
                                                        fontSize: '0.78rem',
                                                        lineHeight: 1.4,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {metaDesc || 'No meta description set'}
                                                </div>
                                                {page.meta_keywords && (
                                                    <div style={{ fontSize: '0.7rem', color: '#8C6226', marginTop: '0.25rem', fontWeight: 600 }}>
                                                        Keywords: {page.meta_keywords}
                                                    </div>
                                                )}
                                            </td>

                                            <td style={{ padding: '1rem 1.15rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
                                                    <span
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '0.18rem 0.55rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.72rem',
                                                            fontWeight: 700,
                                                            background: page.is_active ? '#DCFCE7' : '#F1F5F9',
                                                            color: page.is_active ? '#15803D' : '#64748B',
                                                        }}
                                                    >
                                                        {page.is_active ? 'Active' : 'Inactive'}
                                                    </span>

                                                    <span
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '0.15rem 0.5rem',
                                                            borderRadius: '0.35rem',
                                                            fontSize: '0.68rem',
                                                            fontWeight: 700,
                                                            background: isNoIndex ? '#FEF2F2' : '#EFF6FF',
                                                            color: isNoIndex ? '#DC2626' : '#1D4ED8',
                                                            border: isNoIndex ? '1px solid #FECACA' : '1px solid #BFDBFE',
                                                        }}
                                                    >
                                                        {robots}
                                                    </span>
                                                </div>
                                            </td>

                                            <td style={{ padding: '1rem 1.15rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    {page.slug === 'contact-us' && (
                                                        <Link
                                                            href={route('admin.contact-queries.index')}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                padding: '0.42rem 0.7rem',
                                                                borderRadius: '0.375rem',
                                                                backgroundColor: '#FEF3C7',
                                                                color: '#92400E',
                                                                border: '1px solid #FDE68A',
                                                                fontSize: '0.78rem',
                                                                fontWeight: 600,
                                                                textDecoration: 'none',
                                                            }}
                                                        >
                                                            <span>Queries</span>
                                                        </Link>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => openQuickSeoModal(page)}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem',
                                                            padding: '0.42rem 0.75rem',
                                                            borderRadius: '0.375rem',
                                                            backgroundColor: '#FDF8F0',
                                                            color: '#8C6226',
                                                            border: '1px solid #E6D2B5',
                                                            fontSize: '0.78rem',
                                                            fontWeight: 700,
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <span>Edit SEO</span>
                                                    </button>

                                                    <Link
                                                        href={editUrl}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            padding: '0.45rem 0.8rem',
                                                            borderRadius: '0.375rem',
                                                            backgroundColor: '#7A1C1C',
                                                            color: '#FFFFFF',
                                                            fontSize: '0.78rem',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        <span>Edit Page</span>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                        </svg>
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

            {/* Quick Edit Page SEO Modal */}
            <Modal show={Boolean(seoModalPage)} onClose={() => !savingSeo && setSeoModalPage(null)} maxWidth="4xl">
                {seoModalPage && (
                    <form onSubmit={handleSaveQuickSeo} style={{ padding: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E2E8F0' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                    Edit SEO — {seoModalPage.title}
                                </h3>
                                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                    Public Route: {seoModalPage.slug === 'home' ? '/' : `/${seoModalPage.slug}`}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSeoModalPage(null)}
                                style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '0.5rem',
                                    background: '#F8FAFC',
                                    border: '1px solid #E2E8F0',
                                    fontSize: '1.25rem',
                                    color: '#475569',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        <PageSeoSection
                            seo={seoForm}
                            onChange={setSeoForm}
                            pageSlug={seoModalPage.slug}
                            pageTitle={seoModalPage.title}
                            errors={seoErrors}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #E2E8F0' }}>
                            <button
                                type="button"
                                onClick={() => setSeoModalPage(null)}
                                disabled={savingSeo}
                                style={{ padding: '0.55rem 1.15rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#334155', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={savingSeo}
                                style={{ padding: '0.55rem 1.35rem', borderRadius: '0.45rem', border: 'none', background: '#7A1C1C', color: '#FFFFFF', fontWeight: 700, fontSize: '0.84rem', cursor: savingSeo ? 'not-allowed' : 'pointer' }}
                            >
                                {savingSeo ? 'Saving SEO...' : 'Save SEO Information'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </AdminLayout>
    );
}
