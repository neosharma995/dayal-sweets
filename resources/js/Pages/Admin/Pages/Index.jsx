import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FileTextIcon } from '@/Components/Icons';

export default function Index({ pages = [] }) {
    const [search, setSearch] = useState('');

    const filteredPages = pages.filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            p.title?.toLowerCase().includes(q) ||
            p.slug?.toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout header="Dynamic Pages">
            <Head title="Dynamic Pages - Dayal Sweets Admin" />

            <div className="dayal-container">
                {/* View Header */}
                <div
                    className="dayal-admin-view-header"
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
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Website Pages
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            Manage editable dynamic sections and settings for public storefront pages.
                        </p>
                    </div>
                </div>

                {/* Filter / Search Bar */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.75rem',
                        padding: '1rem 1.25rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                    }}
                >
                    <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
                        <input
                            type="text"
                            placeholder="Search pages by name or slug..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.625rem 0.875rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.875rem',
                                outline: 'none',
                            }}
                        />
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                        Total: <strong>{filteredPages.length}</strong> pages
                    </div>
                </div>

                {/* Table */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#475569' }}>Page Name</th>
                                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#475569' }}>Slug / Public URL</th>
                                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#475569' }}>Dynamic Fields</th>
                                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#475569' }}>Status</th>
                                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPages.map((page) => {
                                const editUrl = page.slug === 'contact-us'
                                    ? route('admin.pages.contact-us')
                                    : '#';
                                const publicUrl = page.slug === 'contact-us'
                                    ? route('contact')
                                    : `/${page.slug}`;

                                return (
                                    <tr
                                        key={page.id}
                                        style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s ease' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                        <td style={{ padding: '1rem 1.25rem' }}>
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
                                                    }}
                                                >
                                                    <FileTextIcon width="18" height="18" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{page.title}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>ID: #{page.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <a
                                                href={publicUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    color: '#2563EB',
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                }}
                                            >
                                                <span>/{page.slug}</span>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                                </svg>
                                            </a>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#64748B', fontSize: '0.8125rem' }}>
                                            {page.slug === 'contact-us' ? (
                                                <span>Top Bar (Heading, Subheading, Description) + Contact Info (Emails, Phone Numbers, Opening Hours)</span>
                                            ) : (
                                                <span>Standard dynamic content</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: page.is_active ? '#DCFCE7' : '#F1F5F9',
                                                    color: page.is_active ? '#15803D' : '#64748B',
                                                }}
                                            >
                                                {page.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                                            <Link
                                                href={editUrl}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.375rem',
                                                    padding: '0.5rem 0.875rem',
                                                    borderRadius: '0.375rem',
                                                    backgroundColor: '#7A1C1C',
                                                    color: '#FFFFFF',
                                                    fontSize: '0.8125rem',
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <span>Edit Page</span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

