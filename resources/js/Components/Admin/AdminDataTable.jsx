import React, { useEffect, useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';

export const ADMIN_CRM_COLORS = {
    primary: '#7A1C1C',
    primaryBorder: '#7A1C1C',
    textDark: '#0F172A',
    textBody: '#334155',
    textMuted: '#64748B',
    border: '#E2E8F0',
    borderControl: '#CBD5E1',
    bgSurface: '#FFFFFF',
    bgSubtle: '#F8FAFC',
};

export const adminPrimaryBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    height: '38px',
    padding: '0 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    background: '#7A1C1C',
    color: '#FFFFFF',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 1px 2px rgba(122, 28, 28, 0.2)',
    whiteSpace: 'nowrap',
};

export const adminSecondaryBtnStyle = {
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
    textDecoration: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    whiteSpace: 'nowrap',
};

export const adminTableActionStyles = {
    primary: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.3rem',
        padding: '0.35rem 0.65rem',
        borderRadius: '0.375rem',
        border: 'none',
        background: '#7A1C1C',
        color: '#FFFFFF',
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
    },
    secondary: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.3rem',
        padding: '0.35rem 0.65rem',
        borderRadius: '0.375rem',
        border: '1px solid #CBD5E1',
        background: '#FFFFFF',
        color: '#1E293B',
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
    },
    danger: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.3rem',
        padding: '0.35rem 0.65rem',
        borderRadius: '0.375rem',
        border: '1px solid #FECACA',
        background: '#FEF2F2',
        color: '#DC2626',
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
    },
};

function getInitialUrlParam(key, fallback) {
    if (typeof window === 'undefined') return fallback;
    try {
        const params = new URLSearchParams(window.location.search);
        return params.get(key) ?? fallback;
    } catch {
        return fallback;
    }
}

function syncUrlParams(updates = {}) {
    if (typeof window === 'undefined') return;
    try {
        const url = new URL(window.location.href);
        Object.entries(updates).forEach(([k, v]) => {
            if (v === null || v === undefined || v === '' || (k === 'page' && Number(v) <= 1)) {
                url.searchParams.delete(k);
            } else {
                url.searchParams.set(k, String(v));
            }
        });
        window.history.replaceState(window.history.state, '', url.toString());
    } catch {
        // Ignore history errors in restricted environments
    }
}

export default function AdminDataTable({
    breadcrumb,
    title,
    subtitle,
    headerActions = null,
    summaryCards = null,
    topTabs = null,
    filterTabs = null,
    activeFilterTab = 'all',
    onFilterTabChange = null,
    showSearch = true,
    search = '',
    onSearchChange = null,
    onSearchSubmit = null,
    searchPlaceholder = 'Search...',
    toolbarRight = null,
    hasActiveFilters = false,
    onResetFilters = null,
    columns = [],
    rows = [],
    rowKey = (row, idx) => row?.id ?? idx,
    renderRow = null,
    emptyTitle = 'No records found matching criteria.',
    emptySubtitle = '',
    emptyAction = null,
    itemLabel = 'items',
    // Server-side paginator (Laravel paginate)
    paginator = null,
    perPage: controlledPerPage = null,
    onPerPageChange = null,
    onPageChange = null,
    perPageOptions = [10, 15, 25, 50, 100],
    defaultPerPage = 15,
    showPerPage = true,
    syncClientPaginationToUrl = true,
    children = null,
}) {
    const [showCards, setShowCards] = useState(false);

    // Client-side pagination state (only used when `paginator` is not provided)
    const isServerPaginated = Boolean(paginator && Array.isArray(paginator.links));

    const [clientPage, setClientPage] = useState(() => {
        if (isServerPaginated || !syncClientPaginationToUrl) return 1;
        const fromUrl = parseInt(getInitialUrlParam('page', '1'), 10);
        return Number.isFinite(fromUrl) && fromUrl > 0 ? fromUrl : 1;
    });

    const [clientPerPage, setClientPerPage] = useState(() => {
        if (controlledPerPage) return Number(controlledPerPage);
        if (isServerPaginated || !syncClientPaginationToUrl) return defaultPerPage;
        const fromUrl = parseInt(getInitialUrlParam('per_page', String(defaultPerPage)), 10);
        return perPageOptions.includes(fromUrl) ? fromUrl : defaultPerPage;
    });

    const effectivePerPage = controlledPerPage ? Number(controlledPerPage) : clientPerPage;

    // Reset client page if rows shrink below current page
    const totalClientPages = useMemo(() => {
        if (isServerPaginated) return 1;
        return Math.max(1, Math.ceil(rows.length / effectivePerPage));
    }, [isServerPaginated, rows.length, effectivePerPage]);

    const safeClientPage = Math.min(clientPage, totalClientPages);

    useEffect(() => {
        if (!isServerPaginated && clientPage > totalClientPages) {
            setClientPage(totalClientPages);
        }
    }, [isServerPaginated, clientPage, totalClientPages]);

    const displayedRows = useMemo(() => {
        if (isServerPaginated) {
            return Array.isArray(rows) && rows.length > 0 ? rows : (paginator?.data || []);
        }
        const start = (safeClientPage - 1) * effectivePerPage;
        return rows.slice(start, start + effectivePerPage);
    }, [isServerPaginated, rows, paginator, safeClientPage, effectivePerPage]);

    const handleClientPageChange = (nextPage) => {
        const clamped = Math.max(1, Math.min(totalClientPages, nextPage));
        setClientPage(clamped);
        if (syncClientPaginationToUrl) {
            syncUrlParams({ page: clamped });
        }
    };

    const handlePerPageSelect = (nextPerPage) => {
        const num = Number(nextPerPage);
        if (onPerPageChange) {
            onPerPageChange(num);
            return;
        }
        setClientPerPage(num);
        setClientPage(1);
        if (syncClientPaginationToUrl) {
            syncUrlParams({ per_page: num === defaultPerPage ? null : num, page: 1 });
        }
    };

    const handleSearchFormSubmit = (e) => {
        e.preventDefault();
        if (onSearchSubmit) {
            onSearchSubmit(search);
        } else if (!isServerPaginated) {
            setClientPage(1);
            if (syncClientPaginationToUrl) {
                syncUrlParams({ search: search.trim(), page: 1 });
            }
        }
    };

    const handleClearSearch = () => {
        if (onSearchChange) onSearchChange('');
        if (onSearchSubmit) {
            onSearchSubmit('');
        } else if (!isServerPaginated) {
            setClientPage(1);
            if (syncClientPaginationToUrl) {
                syncUrlParams({ search: '', page: 1 });
            }
        }
    };

    const handleServerPageClick = (url) => {
        if (!url) return;
        if (onPageChange) {
            onPageChange(url);
        } else {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    // Build client-side page buttons (with ellipsis if many pages)
    const clientPageNumbers = useMemo(() => {
        if (isServerPaginated || totalClientPages <= 1) return [];
        const pages = [];
        for (let p = 1; p <= totalClientPages; p++) {
            if (
                p === 1 ||
                p === totalClientPages ||
                Math.abs(p - safeClientPage) <= 1
            ) {
                pages.push(p);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    }, [isServerPaginated, totalClientPages, safeClientPage]);

    // Breadcrumb rendering
    const breadcrumbItems = Array.isArray(breadcrumb)
        ? breadcrumb
        : [
            { label: 'Admin', href: route('admin.dashboard') },
            { label: breadcrumb || title },
        ];

    // Pagination stats
    const totalCount = isServerPaginated ? (paginator.total ?? 0) : rows.length;
    const fromCount = isServerPaginated
        ? (paginator.from ?? 0)
        : (rows.length === 0 ? 0 : (safeClientPage - 1) * effectivePerPage + 1);
    const toCount = isServerPaginated
        ? (paginator.to ?? 0)
        : Math.min(safeClientPage * effectivePerPage, rows.length);

    return (
        <div className="dayal-container" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
            {/* 1. Unified Header Row */}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        {breadcrumbItems.map((item, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>}
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>
                                        {item.label}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0, fontFamily: 'inherit' }}>
                        {title}
                    </h1>
                    {subtitle && (
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem', marginBottom: 0 }}>
                            {subtitle}
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {Array.isArray(summaryCards) && summaryCards.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowCards((prev) => !prev)}
                            style={{
                                ...adminSecondaryBtnStyle,
                                backgroundColor: showCards ? '#F8FAFC' : '#FFFFFF',
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
                                style={{
                                    transform: showCards ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.2s ease',
                                }}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                            <span>{showCards ? 'Hide Summary Cards ▲' : 'Expand Summary Cards ▼'}</span>
                        </button>
                    )}

                    {headerActions}
                </div>
            </div>

            {/* 2. Collapsible Summary Cards (Display-only, collapsed by default) */}
            {showCards && Array.isArray(summaryCards) && summaryCards.length > 0 && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    {summaryCards.map((card, idx) => (
                        <div
                            key={card.key ?? idx}
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                    style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: card.labelColor || '#64748B',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {card.label}
                                </div>
                                {card.badge && (
                                    <span
                                        style={{
                                            fontSize: '0.68rem',
                                            fontWeight: 700,
                                            padding: '0.15rem 0.45rem',
                                            borderRadius: '999px',
                                            background: '#F1F5F9',
                                            color: '#475569',
                                            ...(card.badgeStyle || {}),
                                        }}
                                    >
                                        {card.badge}
                                    </span>
                                )}
                            </div>
                            <div
                                style={{
                                    fontSize: '1.85rem',
                                    fontWeight: 800,
                                    color: card.valueColor || '#0F172A',
                                    marginTop: '0.35rem',
                                }}
                            >
                                {card.value}
                            </div>
                            {card.subtext && (
                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                    {card.subtext}
                                </div>
                            )}
                            {card.link && (
                                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                    <Link
                                        href={card.link.href}
                                        style={{ color: card.valueColor || '#7A1C1C', textDecoration: 'none', fontWeight: 600 }}
                                    >
                                        {card.link.label}
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* 3. Optional Top Section Tabs (e.g., Reservation Queries / Contact Queries) */}
            {Array.isArray(topTabs) && topTabs.length > 0 && (
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    {topTabs.map((tab) => {
                        const style = {
                            padding: '0.45rem 0.95rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.8125rem',
                            fontWeight: tab.active ? 700 : 500,
                            border: tab.active ? '1px solid #7A1C1C' : '1px solid #CBD5E1',
                            background: tab.active ? '#7A1C1C' : '#FFFFFF',
                            color: tab.active ? '#FFFFFF' : '#475569',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.15s ease',
                        };
                        return tab.href ? (
                            <Link key={tab.key} href={tab.href} style={style}>
                                {tab.label}
                            </Link>
                        ) : (
                            <button key={tab.key} type="button" onClick={tab.onClick} style={style}>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* 4. Status / Category Filter Button Tabs (Unified CRM Maroon/White) */}
            {Array.isArray(filterTabs) && filterTabs.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {filterTabs.map((tab) => {
                        const isActive = activeFilterTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => {
                                    if (onFilterTabChange) onFilterTabChange(tab.key);
                                    if (!isServerPaginated) setClientPage(1);
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
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    transition: 'all 0.15s ease',
                                    boxShadow: isActive ? '0 1px 2px rgba(122, 28, 28, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
                                }}
                            >
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* 5. Unified Search & Filter Toolbar */}
            {(showSearch || toolbarRight || showPerPage || hasActiveFilters) && (
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        padding: '0.9rem 1.25rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}
                >
                    {showSearch ? (
                        <form
                            onSubmit={handleSearchFormSubmit}
                            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: '1 1 320px', maxWidth: '480px' }}
                        >
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    if (onSearchChange) onSearchChange(e.target.value);
                                    if (!isServerPaginated) setClientPage(1);
                                }}
                                placeholder={searchPlaceholder}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    color: '#0F172A',
                                    outline: 'none',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '0.5rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    background: '#7A1C1C',
                                    color: '#FFFFFF',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Search
                            </button>
                            {search && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    style={{
                                        padding: '0.5rem 0.65rem',
                                        borderRadius: '0.375rem',
                                        background: '#F1F5F9',
                                        color: '#475569',
                                        fontSize: '0.8125rem',
                                        border: '1px solid #CBD5E1',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Clear
                                </button>
                            )}
                        </form>
                    ) : (
                        <div />
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {toolbarRight}

                        {showPerPage && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                                <span>Per Page:</span>
                                <select
                                    value={effectivePerPage}
                                    onChange={(e) => handlePerPageSelect(e.target.value)}
                                    style={{
                                        padding: '0.45rem 0.65rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.8125rem',
                                        background: '#FFFFFF',
                                        color: '#0F172A',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {perPageOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {hasActiveFilters && onResetFilters && (
                            <button
                                type="button"
                                onClick={() => {
                                    onResetFilters();
                                    if (!isServerPaginated) {
                                        setClientPage(1);
                                        if (syncClientPaginationToUrl) {
                                            syncUrlParams({ search: '', page: 1 });
                                        }
                                    }
                                }}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    background: '#F1F5F9',
                                    color: '#475569',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                }}
                            >
                                Reset All
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 6. Unified Table Card & Pagination */}
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '0.5rem',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
            >
                {children ? (
                    children
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                            <thead>
                                <tr
                                    style={{
                                        background: '#F8FAFC',
                                        borderBottom: '1px solid #E2E8F0',
                                        color: '#475569',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            style={{
                                                padding: '0.85rem 1.15rem',
                                                textAlign: col.align || 'left',
                                                width: col.width || undefined,
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayedRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={Math.max(1, columns.length)} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
                                            <div style={{ fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>{emptyTitle}</div>
                                            {emptySubtitle && (
                                                <div style={{ fontSize: '0.8125rem', marginTop: '0.3rem', color: '#64748B' }}>
                                                    {emptySubtitle}
                                                </div>
                                            )}
                                            {emptyAction && <div style={{ marginTop: '1rem' }}>{emptyAction}</div>}
                                        </td>
                                    </tr>
                                ) : (
                                    displayedRows.map((row, idx) => {
                                        if (renderRow) {
                                            return renderRow(row, idx);
                                        }
                                        return (
                                            <tr
                                                key={rowKey(row, idx)}
                                                style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}
                                            >
                                                {columns.map((col) => (
                                                    <td
                                                        key={col.key}
                                                        style={{
                                                            padding: '0.85rem 1.15rem',
                                                            textAlign: col.align || 'left',
                                                            verticalAlign: 'middle',
                                                        }}
                                                    >
                                                        {col.render ? col.render(row, idx) : (row[col.key] ?? '—')}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Unified Pagination Footer */}
                <div
                    style={{
                        padding: '0.9rem 1.25rem',
                        borderTop: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        background: '#FFFFFF',
                    }}
                >
                    <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                        Showing <strong style={{ color: '#0F172A' }}>{fromCount}</strong> to{' '}
                        <strong style={{ color: '#0F172A' }}>{toCount}</strong> of{' '}
                        <strong style={{ color: '#0F172A' }}>{totalCount}</strong> {itemLabel}
                    </div>

                    {isServerPaginated ? (
                        paginator.links && paginator.links.length > 3 && (
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                {paginator.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={!link.url || link.active}
                                        onClick={() => handleServerPageClick(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{
                                            padding: '0.38rem 0.7rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid',
                                            borderColor: link.active ? '#7A1C1C' : '#E2E8F0',
                                            background: link.active ? '#7A1C1C' : '#FFFFFF',
                                            color: link.active ? '#FFFFFF' : link.url ? '#334155' : '#CBD5E1',
                                            fontSize: '0.8rem',
                                            cursor: link.url && !link.active ? 'pointer' : 'default',
                                            fontWeight: link.active ? 700 : 500,
                                        }}
                                    />
                                ))}
                            </div>
                        )
                    ) : (
                        totalClientPages > 1 && (
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    disabled={safeClientPage <= 1}
                                    onClick={() => handleClientPageChange(safeClientPage - 1)}
                                    style={{
                                        padding: '0.38rem 0.7rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #E2E8F0',
                                        background: '#FFFFFF',
                                        color: safeClientPage <= 1 ? '#CBD5E1' : '#334155',
                                        fontSize: '0.8rem',
                                        cursor: safeClientPage <= 1 ? 'default' : 'pointer',
                                        fontWeight: 500,
                                    }}
                                >
                                    &laquo; Previous
                                </button>

                                {clientPageNumbers.map((p, idx) =>
                                    p === '...' ? (
                                        <span key={`dots-${idx}`} style={{ padding: '0 0.35rem', color: '#94A3B8', fontSize: '0.8rem' }}>
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            type="button"
                                            disabled={p === safeClientPage}
                                            onClick={() => handleClientPageChange(p)}
                                            style={{
                                                padding: '0.38rem 0.7rem',
                                                borderRadius: '0.375rem',
                                                border: '1px solid',
                                                borderColor: p === safeClientPage ? '#7A1C1C' : '#E2E8F0',
                                                background: p === safeClientPage ? '#7A1C1C' : '#FFFFFF',
                                                color: p === safeClientPage ? '#FFFFFF' : '#334155',
                                                fontSize: '0.8rem',
                                                cursor: p === safeClientPage ? 'default' : 'pointer',
                                                fontWeight: p === safeClientPage ? 700 : 500,
                                            }}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}

                                <button
                                    type="button"
                                    disabled={safeClientPage >= totalClientPages}
                                    onClick={() => handleClientPageChange(safeClientPage + 1)}
                                    style={{
                                        padding: '0.38rem 0.7rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #E2E8F0',
                                        background: '#FFFFFF',
                                        color: safeClientPage >= totalClientPages ? '#CBD5E1' : '#334155',
                                        fontSize: '0.8rem',
                                        cursor: safeClientPage >= totalClientPages ? 'default' : 'pointer',
                                        fontWeight: 500,
                                    }}
                                >
                                    Next &raquo;
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
