import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import FlashToaster from '@/Components/FlashToaster';

export default function EditorLayout({ children }) {
    const { auth } = usePage().props || {};
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Global Flash Toaster */}
            <FlashToaster />

            {/* Sidebar */}
            <aside
                style={{
                    width: '260px',
                    background: '#FFFFFF',
                    borderRight: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                }}
            >
                <div>
                    {/* Brand Header */}
                    <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #F1F5F9' }}>
                        <Link href={route('editor.dashboard')} style={{ textDecoration: 'none', display: 'block' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <div
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '0.5rem',
                                        background: '#2563EB',
                                        color: '#FFFFFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    DS
                                </div>
                                <div>
                                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                                        Dayal Sweets
                                    </div>
                                    <span
                                        style={{
                                            background: '#EFF6FF',
                                            color: '#1D4ED8',
                                            fontSize: '0.68rem',
                                            fontWeight: 700,
                                            padding: '0.15rem 0.45rem',
                                            borderRadius: '999px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        Content Editor
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.5rem 0.6rem 0.25rem' }}>
                            Content Workspace
                        </div>

                        {/* 1. Dashboard */}
                        <Link
                            href={route('editor.dashboard')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.85rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: route().current('editor.dashboard') ? 700 : 500,
                                background: route().current('editor.dashboard') ? '#EFF6FF' : 'transparent',
                                color: route().current('editor.dashboard') ? '#1D4ED8' : '#475569',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                            <span>Dashboard</span>
                        </Link>

                        {/* 2. All Pages */}
                        <Link
                            href={route('editor.pages.index')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.85rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: route().current('editor.pages.index') ? 700 : 500,
                                background: route().current('editor.pages.index') ? '#EFF6FF' : 'transparent',
                                color: route().current('editor.pages.index') ? '#1D4ED8' : '#475569',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                            <span>All Pages</span>
                        </Link>

                        {/* 2b. Pages SEO Information */}
                        <Link
                            href={route('editor.pages.seo')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.85rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: route().current('editor.pages.seo') ? 700 : 500,
                                background: route().current('editor.pages.seo') ? '#EFF6FF' : 'transparent',
                                color: route().current('editor.pages.seo') ? '#1D4ED8' : '#475569',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                            <span>Pages SEO Information</span>
                        </Link>

                        {/* 3. About Us Page */}
                        <Link
                            href={route('editor.pages.about-us')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.85rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: route().current('editor.pages.about-us*') ? 700 : 500,
                                background: route().current('editor.pages.about-us*') ? '#EFF6FF' : 'transparent',
                                color: route().current('editor.pages.about-us*') ? '#1D4ED8' : '#475569',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <span>Edit About Us</span>
                        </Link>

                        {/* 4. Contact Us Page */}
                        <Link
                            href={route('editor.pages.contact-us')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.85rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: route().current('editor.pages.contact-us*') ? 700 : 500,
                                background: route().current('editor.pages.contact-us*') ? '#EFF6FF' : 'transparent',
                                color: route().current('editor.pages.contact-us*') ? '#1D4ED8' : '#475569',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>Edit Contact Us</span>
                        </Link>

                        {/* 5. Gallery Page */}
                        <Link
                            href={route('editor.pages.gallery')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.85rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: route().current('editor.pages.gallery*') ? 700 : 500,
                                background: route().current('editor.pages.gallery*') ? '#EFF6FF' : 'transparent',
                                color: route().current('editor.pages.gallery*') ? '#1D4ED8' : '#475569',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <span>Edit Gallery</span>
                        </Link>

                        {/* 6. Header & Footer */}
                        <Link
                            href={route('editor.header-footer.index')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.85rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: route().current('editor.header-footer.*') ? 700 : 500,
                                background: route().current('editor.header-footer.*') ? '#EFF6FF' : 'transparent',
                                color: route().current('editor.header-footer.*') ? '#1D4ED8' : '#475569',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                <path d="M2 2l7.586 7.586"></path>
                                <circle cx="11" cy="11" r="2"></circle>
                            </svg>
                            <span>Header &amp; Footer</span>
                        </Link>

                        <div style={{ borderTop: '1px solid #F1F5F9', margin: '0.5rem 0' }} />

                        {/* Live Website Preview */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.85rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                color: '#64748B',
                                fontWeight: 500,
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                            <span>View Live Store ↗</span>
                        </a>

                        {/* If Admin, option to switch back to Admin Panel */}
                        {auth?.user?.roles?.includes('admin') && (
                            <Link
                                href={route('admin.dashboard')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.6rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    color: '#B88E4B',
                                    fontWeight: 700,
                                    background: '#FEF3C7',
                                    marginTop: '0.5rem',
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                                <span>Back to Admin Panel</span>
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Footer User Info & Logout */}
                <div style={{ padding: '1rem', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '999px',
                                    background: '#2563EB',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                }}
                            >
                                {auth?.user?.name?.charAt(0) || 'E'}
                            </div>
                            <div style={{ maxWidth: '120px', overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {auth?.user?.name}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                    Content Editor
                                </div>
                            </div>
                        </div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#94A3B8',
                                cursor: 'pointer',
                                padding: '0.35rem',
                                borderRadius: '0.25rem',
                            }}
                            title="Log Out"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
