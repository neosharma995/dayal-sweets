import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import EditorLayout from '@/Layouts/EditorLayout';

export default function EditorDashboard({ stats, pages, headerFooter }) {
    const { auth } = usePage().props || {};

    const editorCards = [
        {
            title: 'About Us Page',
            desc: 'Edit brand heritage, founder story, tradition since 1952, values, and milestone timeline.',
            icon: '🏛️',
            badge: 'Content & Story',
            link: route('editor.pages.about-us'),
            color: '#B88E4B',
        },
        {
            title: 'Contact Us Page',
            desc: 'Manage customer service contacts, Amb/Una/Hamirpur phone numbers, email, and inquiry form settings.',
            icon: '📞',
            badge: 'Customer Touchpoint',
            link: route('editor.pages.contact-us'),
            color: '#2563EB',
        },
        {
            title: 'Visual Gallery',
            desc: 'Upload high-resolution mithai photos, celebration moments, hampers showcase, and sweet boxes.',
            icon: '🖼️',
            badge: 'Media Showcase',
            link: route('editor.pages.gallery'),
            color: '#059669',
        },
        {
            title: 'Header & Footer Branding',
            desc: 'Customize announcement ticker bar, top navigation links, logo, social links, footer columns, and copyright.',
            icon: '🎨',
            badge: 'Global Theme',
            link: route('editor.header-footer.index'),
            color: '#7C3AED',
        },
    ];

    return (
        <EditorLayout>
            <Head title="Content Editor Dashboard - Dayal Sweets" />

            <div style={{ padding: '2rem 2.5rem' }}>
                {/* Welcome Hero */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                        color: '#FFFFFF',
                        borderRadius: '0.75rem',
                        padding: '2rem',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div style={{ display: 'inline-block', background: 'rgba(37, 99, 235, 0.25)', color: '#93C5FD', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        Content Workspace
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
                        Welcome back, {auth?.user?.name}!
                    </h1>
                    <p style={{ color: '#94A3B8', fontSize: '0.925rem', marginTop: '0.4rem', maxWidth: '640px' }}>
                        This dedicated panel allows you to seamlessly update website pages, stories, brand visuals, and header/footer configurations without disturbing store inventory and billing operations.
                    </p>
                </div>

                {/* Metric / Status Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '1.25rem',
                        marginBottom: '2rem',
                    }}
                >
                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Editable Pages</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
                            {stats.total_pages} Pages
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>
                            About Us, Contact Us, Gallery, etc.
                        </div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Last Page Modification</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginTop: '0.5rem' }}>
                            {stats.last_page_updated}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                            Page contents active on live store
                        </div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Header &amp; Footer Status</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginTop: '0.5rem' }}>
                            {stats.header_footer_updated}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#2563EB', marginTop: '0.25rem' }}>
                            Branding &amp; announcements synced
                        </div>
                    </div>
                </div>

                {/* Quick Edit Sections Grid */}
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                    Quick Edit Modules
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.25rem',
                        marginBottom: '2rem',
                    }}
                >
                    {editorCards.map((card, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '0.75rem',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.15s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '2rem' }}>{card.icon}</span>
                                    <span
                                        style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '999px',
                                            background: '#F1F5F9',
                                            color: '#475569',
                                        }}
                                    >
                                        {card.badge}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem' }}>
                                    {card.title}
                                </h3>

                                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                                    {card.desc}
                                </p>
                            </div>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                                <Link
                                    href={card.link}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: card.color,
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <span>Open Editor</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor Scope Notice */}
                <div
                    style={{
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '0.5rem',
                        padding: '1rem 1.25rem',
                        color: '#1E40AF',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
                    <div>
                        <strong>Role Permissions:</strong> You are logged in with the <strong>Content Editor</strong> role. You have permissions to update store public pages, copy, and layout settings. Order processing, financial reports, and outlet catalogs are restricted to Administrators.
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
}
