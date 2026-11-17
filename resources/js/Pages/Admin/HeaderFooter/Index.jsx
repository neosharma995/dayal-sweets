import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// CSRF helper for file uploads
const getCsrfToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaTag) return metaTag;
    const cookieMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return cookieMatch ? decodeURIComponent(cookieMatch[1]) : '';
};

// Reusable Image Upload with Dotted Border & Preview (No Blue Background, No Raw URL)
function ImageUploadField({
    label,
    required = false,
    hint = '',
    value = '',
    onChange,
    maxHeight = '75px',
}) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('image_file', file);

        try {
            const token = getCsrfToken();
            const res = await fetch(route('admin.header-footer.upload-image'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await res.json();
            if (data.success && data.url) {
                onChange(data.url);
            } else {
                setUploadError(data.message || 'Image upload failed. Please try again.');
            }
        } catch (err) {
            console.error('Image upload error:', err);
            setUploadError('Network error while uploading image.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) handleUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    {label} {required && <span style={{ color: '#E11D48' }}>*</span>}
                </label>
                {hint && (
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {hint}
                    </span>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {value ? (
                /* State with existing image: Dotted border container with preview and action buttons (Clean white bg, no blue) */
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        border: isDragging ? '2px dashed #7A1C1C' : '2px dashed #CBD5E1',
                        borderRadius: '0.5rem',
                        padding: '1rem 1.25rem',
                        background: isDragging ? '#FEF2F2' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.25rem',
                        flexWrap: 'wrap',
                        transition: 'all 0.15s ease',
                    }}
                >
                    {/* Image Preview Box (Clean white/subtle bg, NO dark blue) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '180px' }}>
                        <div
                            style={{
                                minWidth: '120px',
                                height: '76px',
                                padding: '0.4rem 0.6rem',
                                borderRadius: '0.375rem',
                                backgroundColor: '#FAFAFA',
                                border: '1px solid #E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={value}
                                alt={label}
                                style={{
                                    maxHeight: maxHeight,
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                }}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.2rem' }}>
                                Image Loaded
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                Drag &amp; drop new image or click Change
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#0F172A',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s ease',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>{uploading ? 'Uploading...' : 'Change Image'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onChange('')}
                            disabled={uploading}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#DC2626',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                padding: '0.5rem 0.5rem',
                            }}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                /* Empty state: Clickable Dotted border upload dropzone */
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        border: isDragging ? '2px dashed #7A1C1C' : '2px dashed #CBD5E1',
                        borderRadius: '0.5rem',
                        padding: '1.75rem 1.5rem',
                        background: isDragging ? '#FEF2F2' : '#F8FAFC',
                        textAlign: 'center',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#7A1C1C',
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>

                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                        {uploading ? (
                            <span>Uploading image, please wait...</span>
                        ) : (
                            <>
                                <span style={{ color: '#7A1C1C', textDecoration: 'underline' }}>Click to upload {label}</span> or drag and drop
                            </>
                        )}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        PNG, JPG, WebP, SVG (Max 5MB)
                    </div>
                </div>
            )}

            {uploadError && (
                <div style={{ color: '#DC2626', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.35rem' }}>
                    {uploadError}
                </div>
            )}
        </div>
    );
}

export default function Index({ settings = {}, page = {} }) {
    // 3 Tabs state: 'header' | 'footer-cta' | 'footer'
    const [activeTab, setActiveTab] = useState('header');

    // Header State
    const [headerLogo, setHeaderLogo] = useState(
        settings.header_logo || '/uploads/2026/07/Frame-51-2-e1789985433447.png'
    );

    // Footer Bar (CTA) State
    const footerBar = settings.footer_bar || {};
    const [subHeading, setSubHeading] = useState(footerBar.sub_heading ?? 'craving something sweet');
    const [heading, setHeading] = useState(footerBar.heading ?? 'Order your favorites Anytime, Anywhere');
    const [description, setDescription] = useState(
        footerBar.description ?? "From our kitchen to your doorstep,\nwe make every order special."
    );
    const [phoneNumber, setPhoneNumber] = useState(footerBar.phone_number ?? '+91 98765 43210');
    const [footerBarImage, setFooterBarImage] = useState(
        footerBar.image || '/uploads/2026/07/25a75be7cdf9333748b57b1e795b01d57a04548a.webp'
    );

    // Benefits Repeater [heading, para]
    const initialItems = Array.isArray(footerBar.items) && footerBar.items.length > 0
        ? footerBar.items
        : [
            { heading: '100% SECURE', para: 'Safe & Secure Payments' },
            { heading: 'LIVE TRACKING', para: 'Real-time Updates' },
            { heading: 'FAST DELIVERY', para: 'On Time, Every Time' },
            { heading: 'PREMIUM QUALITY', para: 'Handcrafted with Love & Purity' },
        ];
    const [items, setItems] = useState(initialItems);

    // Footer Main State
    const [footerLogo, setFooterLogo] = useState(
        settings.footer_logo || '/uploads/2026/07/Frame-51-1-1.png'
    );
    const [footerDescription, setFooterDescription] = useState(
        settings.footer_description ??
        "Crafting India's most loved sweet moments since 1962. Pure ingredients, authentic recipes, and a legacy of taste."
    );

    // Certified Badges (array of URLs)
    const initialCertificates = Array.isArray(settings.certified_groups) && settings.certified_groups.length > 0
        ? settings.certified_groups
        : ['/uploads/2026/07/kindpng_2513820-1.png', '/uploads/2026/07/Asset-1-2-1.png'];
    const [certifiedGroups, setCertifiedGroups] = useState(initialCertificates);
    const [badgeUploadingIndex, setBadgeUploadingIndex] = useState(null);
    const badgeFileInputRef = useRef(null);
    const [targetBadgeIndex, setTargetBadgeIndex] = useState(null);

    // Social Links [name, link]
    const initialSocialLinks = Array.isArray(settings.social_links) && settings.social_links.length > 0
        ? settings.social_links
        : [
            { name: 'Instagram', link: 'https://www.instagram.com/' },
            { name: 'Facebook', link: 'https://www.facebook.com/' },
            { name: 'YouTube', link: 'https://www.youtube.com/' },
        ];
    const [socialLinks, setSocialLinks] = useState(initialSocialLinks);

    // Copyright Text
    const [copyrightDescription, setCopyrightDescription] = useState(
        settings.copyright_description ?? '© 2026 Dayal Sweets. All rights reserved.'
    );

    // UI state
    const [processing, setProcessing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [previewHovered, setPreviewHovered] = useState(false);
    const [closeHovered, setCloseHovered] = useState(false);

    // Benefits Repeater Handlers
    const handleAddItem = () => {
        setItems([...items, { heading: '', para: '' }]);
    };
    const handleItemChange = (index, field, value) => {
        const next = [...items];
        next[index] = { ...next[index], [field]: value };
        setItems(next);
    };
    const handleRemoveItem = (index) => {
        if (items.length <= 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    // Certified Badges Handlers
    const handleAddCertificate = () => {
        setCertifiedGroups([...certifiedGroups, '']);
    };
    const handleRemoveCertificate = (index) => {
        if (certifiedGroups.length <= 1) return;
        setCertifiedGroups(certifiedGroups.filter((_, i) => i !== index));
    };

    const handleBadgeUploadClick = (index) => {
        setTargetBadgeIndex(index);
        badgeFileInputRef.current?.click();
    };

    const handleBadgeFileSelected = async (e) => {
        const file = e.target.files?.[0];
        if (!file || targetBadgeIndex === null) return;

        setBadgeUploadingIndex(targetBadgeIndex);

        const formData = new FormData();
        formData.append('image_file', file);

        try {
            const token = getCsrfToken();
            const res = await fetch(route('admin.header-footer.upload-image'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await res.json();
            if (data.success && data.url) {
                const next = [...certifiedGroups];
                next[targetBadgeIndex] = data.url;
                setCertifiedGroups(next);
            }
        } catch (err) {
            console.error('Badge upload error:', err);
        } finally {
            setBadgeUploadingIndex(null);
            setTargetBadgeIndex(null);
            if (badgeFileInputRef.current) {
                badgeFileInputRef.current.value = '';
            }
        }
    };

    // Social Links Handlers
    const handleAddSocialLink = () => {
        setSocialLinks([...socialLinks, { name: '', link: '' }]);
    };
    const handleSocialLinkChange = (index, field, value) => {
        const next = [...socialLinks];
        next[index] = { ...next[index], [field]: value };
        setSocialLinks(next);
    };
    const handleRemoveSocialLink = (index) => {
        if (socialLinks.length <= 1) return;
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    // Submit Handler
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSaveSuccess(false);

        const payload = {
            header_logo: headerLogo,
            footer_bar: {
                sub_heading: subHeading,
                heading: heading,
                description: description,
                phone_number: phoneNumber,
                image: footerBarImage,
                items: items.filter((item) => (item.heading || '').trim() !== '' || (item.para || '').trim() !== ''),
            },
            footer_logo: footerLogo,
            footer_description: footerDescription,
            certified_groups: certifiedGroups.filter((c) => c && c.trim() !== ''),
            social_links: socialLinks.filter((s) => (s.name || '').trim() !== '' || (s.link || '').trim() !== ''),
            copyright_description: copyrightDescription,
        };

        router.post(route('admin.header-footer.update'), payload, {
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
        <AdminLayout header="Header & Footer Settings">
            <Head title="Header & Footer Settings - Dayal Sweets Admin" />

            {/* Hidden file input for certified badges */}
            <input
                ref={badgeFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBadgeFileSelected}
                style={{ display: 'none' }}
            />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                {/* Header Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <Link href={route('admin.dashboard')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Dashboard
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Header &amp; Footer</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Header &amp; Footer Content
                        </h1>
                        <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                            Edit dynamic content for Header Logo, Footer Bar, and Footer Information.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                        {/* Preview Button */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            onMouseEnter={() => setPreviewHovered(true)}
                            onMouseLeave={() => setPreviewHovered(false)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 1rem',
                                borderRadius: '0.5rem',
                                border: previewHovered ? '1px solid #94A3B8' : '1px solid #CBD5E1',
                                backgroundColor: previewHovered ? '#F8FAFC' : '#FFFFFF',
                                color: '#1E293B',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.15s ease',
                            }}
                            title="Live Preview in new tab"
                        >
                            <span>Preview</span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </a>

                        {/* Save Button */}
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
                                transition: 'all 0.15s ease',
                                minWidth: '95px',
                            }}
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>

                        {/* Close / X Button */}
                        <Link
                            href={route('admin.dashboard')}
                            onMouseEnter={() => setCloseHovered(true)}
                            onMouseLeave={() => setCloseHovered(false)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '38px',
                                height: '38px',
                                borderRadius: '0.5rem',
                                border: closeHovered ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                                backgroundColor: closeHovered ? '#FEF2F2' : '#FFFFFF',
                                color: closeHovered ? '#DC2626' : '#64748B',
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.15s ease',
                                cursor: 'pointer',
                            }}
                            title="Close"
                            aria-label="Close"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {saveSuccess && (
                    <div style={{ padding: '0.85rem 1.25rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '0.5rem', color: '#065F46', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>✓</span> Header &amp; Footer content updated successfully! Check the live website.
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

                {/* ========================================================= */}
                {/* 3 TABS SWITCHER: Header | Footer CTA | Footer             */}
                {/* ========================================================= */}
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        borderBottom: '2px solid #E2E8F0',
                        marginBottom: '1.5rem',
                        background: '#FFFFFF',
                        padding: '0.25rem 0.5rem 0',
                        borderRadius: '0.5rem 0.5rem 0 0',
                    }}
                >
                    {/* Tab 1: Header Section */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('header')}
                        style={{
                            padding: '0.75rem 1.25rem',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '0.875rem',
                            fontWeight: activeTab === 'header' ? 700 : 500,
                            color: activeTab === 'header' ? '#7A1C1C' : '#64748B',
                            borderBottom: activeTab === 'header' ? '3px solid #7A1C1C' : '3px solid transparent',
                            marginBottom: '-2px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <span>Header section</span>
                    </button>

                    {/* Tab 2: Footer CTA Section */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('footer-cta')}
                        style={{
                            padding: '0.75rem 1.25rem',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '0.875rem',
                            fontWeight: activeTab === 'footer-cta' ? 700 : 500,
                            color: activeTab === 'footer-cta' ? '#7A1C1C' : '#64748B',
                            borderBottom: activeTab === 'footer-cta' ? '3px solid #7A1C1C' : '3px solid transparent',
                            marginBottom: '-2px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <span>Footer CTA section</span>
                    </button>

                    {/* Tab 3: Footer Section */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('footer')}
                        style={{
                            padding: '0.75rem 1.25rem',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '0.875rem',
                            fontWeight: activeTab === 'footer' ? 700 : 500,
                            color: activeTab === 'footer' ? '#7A1C1C' : '#64748B',
                            borderBottom: activeTab === 'footer' ? '3px solid #7A1C1C' : '3px solid transparent',
                            marginBottom: '-2px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <span>Footer section</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* ========================================================= */}
                    {/* TAB 1: HEADER SECTION                                     */}
                    {/* ========================================================= */}
                    {activeTab === 'header' && (
                        <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                                Header Section
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 1.25rem 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                                Website navigation logo and branding asset.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                                <ImageUploadField
                                    label="Header Logo"
                                    required={true}
                                    hint="Primary logo displayed on website header"
                                    value={headerLogo}
                                    onChange={setHeaderLogo}
                                    maxHeight="65px"
                                />
                            </div>

                            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    style={{
                                        padding: '0.55rem 1.25rem',
                                        borderRadius: '0.375rem',
                                        background: '#7A1C1C',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {processing ? 'Saving...' : 'Save Header Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 2: FOOTER CTA SECTION                                 */}
                    {/* ========================================================= */}
                    {activeTab === 'footer-cta' && (
                        <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                                Footer CTA Section
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 1.25rem 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                                Heading, sub-heading, description, phone number, CTA image, and trust points displayed inside the promotional banner.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Heading / Title <span style={{ color: '#E11D48' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={heading}
                                        onChange={(e) => setHeading(e.target.value)}
                                        placeholder="Order your favorites Anytime, Anywhere"
                                        required
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Sub Heading
                                    </label>
                                    <input
                                        type="text"
                                        value={subHeading}
                                        onChange={(e) => setSubHeading(e.target.value)}
                                        placeholder="craving something sweet"
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="From our kitchen to your doorstep, we make every order special."
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        WhatsApp / Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+91 98765 43210"
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                </div>

                                {/* CTA Image with Dotted Border Upload */}
                                <ImageUploadField
                                    label="CTA Banner Image"
                                    hint="Promotional illustration/photo shown on the right side of the footer banner"
                                    value={footerBarImage}
                                    onChange={setFooterBarImage}
                                    maxHeight="85px"
                                />

                                {/* Trust Benefits Repeater */}
                                <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', marginTop: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                            Trust Benefits &amp; Points
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            style={{
                                                padding: '0.3rem 0.65rem',
                                                borderRadius: '0.375rem',
                                                background: '#B88E4B',
                                                color: '#FFFFFF',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            + Add Benefit
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', minWidth: '20px' }}>
                                                    {idx + 1}.
                                                </span>
                                                <input
                                                    type="text"
                                                    value={item.heading}
                                                    onChange={(e) => handleItemChange(idx, 'heading', e.target.value)}
                                                    placeholder="Heading (e.g. 100% SECURE)"
                                                    style={{ width: '38%', padding: '0.45rem 0.65rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF', fontWeight: 600 }}
                                                />
                                                <input
                                                    type="text"
                                                    value={item.para}
                                                    onChange={(e) => handleItemChange(idx, 'para', e.target.value)}
                                                    placeholder="Paragraph (e.g. Safe & Secure Payments)"
                                                    style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(idx)}
                                                    disabled={items.length <= 1}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: items.length <= 1 ? '#CBD5E1' : '#EF4444',
                                                        cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                                                        fontSize: '1.15rem',
                                                        fontWeight: 700,
                                                        padding: '0 0.4rem',
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    style={{
                                        padding: '0.55rem 1.25rem',
                                        borderRadius: '0.375rem',
                                        background: '#7A1C1C',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {processing ? 'Saving...' : 'Save Footer CTA Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 3: FOOTER SECTION                                     */}
                    {/* ========================================================= */}
                    {activeTab === 'footer' && (
                        <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                                Footer Section
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 1.25rem 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                                Footer logo, company description, certified trust badges, social links, and copyright notice.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Footer Logo with Dotted Border Upload (Clean white bg, no blue) */}
                                <ImageUploadField
                                    label="Footer Logo"
                                    hint="Logo displayed on the website footer"
                                    value={footerLogo}
                                    onChange={setFooterLogo}
                                    maxHeight="65px"
                                />

                                {/* Footer Bio Description */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Footer Bio Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={footerDescription}
                                        onChange={(e) => setFooterDescription(e.target.value)}
                                        placeholder="Crafting India's most loved sweet moments since 1962. Pure ingredients, authentic recipes, and a legacy of taste."
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                </div>

                                {/* Certified Badges Repeater with Dotted Border Upload (NO BLUE BG) */}
                                <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                                Certified Badges
                                            </label>
                                            <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                                                Trust &amp; quality certification badges displayed next to the footer logo.
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddCertificate}
                                            style={{
                                                padding: '0.3rem 0.65rem',
                                                borderRadius: '0.375rem',
                                                background: '#B88E4B',
                                                color: '#FFFFFF',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            + Add Badge
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                        {certifiedGroups.map((certUrl, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    background: '#FFFFFF',
                                                    padding: '0.65rem 0.85rem',
                                                    borderRadius: '0.5rem',
                                                    border: '2px dashed #CBD5E1', // Proper dotted/dashed border!
                                                }}
                                            >
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', minWidth: '20px' }}>
                                                    {idx + 1}.
                                                </span>

                                                {/* Badge Thumbnail Preview (Clean white/subtle bg, NO blue) */}
                                                <div
                                                    style={{
                                                        width: '56px',
                                                        height: '44px',
                                                        borderRadius: '0.375rem',
                                                        background: '#FAFAFA',
                                                        border: '1px solid #E2E8F0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {certUrl ? (
                                                        <img
                                                            src={certUrl}
                                                            alt={`Badge ${idx + 1}`}
                                                            style={{ maxHeight: '36px', maxWidth: '48px', objectFit: 'contain' }}
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>No Image</span>
                                                    )}
                                                </div>

                                                {/* Upload Button */}
                                                <div style={{ flex: 1 }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleBadgeUploadClick(idx)}
                                                        disabled={badgeUploadingIndex === idx}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            padding: '0.4rem 0.85rem',
                                                            borderRadius: '0.375rem',
                                                            border: '1px solid #CBD5E1',
                                                            background: '#FFFFFF',
                                                            color: '#0F172A',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            cursor: badgeUploadingIndex === idx ? 'not-allowed' : 'pointer',
                                                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                                        }}
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                            <polyline points="17 8 12 3 7 8" />
                                                            <line x1="12" y1="3" x2="12" y2="15" />
                                                        </svg>
                                                        <span>
                                                            {badgeUploadingIndex === idx ? 'Uploading...' : (certUrl ? 'Change Badge Image' : 'Upload Badge Image')}
                                                        </span>
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveCertificate(idx)}
                                                    disabled={certifiedGroups.length <= 1}
                                                    title={certifiedGroups.length <= 1 ? 'At least one badge entry' : 'Remove badge'}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: certifiedGroups.length <= 1 ? '#CBD5E1' : '#EF4444',
                                                        cursor: certifiedGroups.length <= 1 ? 'not-allowed' : 'pointer',
                                                        fontSize: '1.25rem',
                                                        fontWeight: 700,
                                                        padding: '0 0.4rem',
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Social Links Repeater */}
                                <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                            Social Media Links
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddSocialLink}
                                            style={{
                                                padding: '0.3rem 0.65rem',
                                                borderRadius: '0.375rem',
                                                background: '#B88E4B',
                                                color: '#FFFFFF',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            + Add Link
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {socialLinks.map((social, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', minWidth: '20px' }}>
                                                    {idx + 1}.
                                                </span>
                                                <input
                                                    type="text"
                                                    value={social.name}
                                                    onChange={(e) => handleSocialLinkChange(idx, 'name', e.target.value)}
                                                    placeholder="Platform (e.g. Instagram)"
                                                    style={{ width: '30%', padding: '0.45rem 0.65rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF', fontWeight: 600 }}
                                                />
                                                <input
                                                    type="url"
                                                    value={social.link}
                                                    onChange={(e) => handleSocialLinkChange(idx, 'link', e.target.value)}
                                                    placeholder="https://instagram.com/dayalsweets"
                                                    style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSocialLink(idx)}
                                                    disabled={socialLinks.length <= 1}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: socialLinks.length <= 1 ? '#CBD5E1' : '#EF4444',
                                                        cursor: socialLinks.length <= 1 ? 'not-allowed' : 'pointer',
                                                        fontSize: '1.15rem',
                                                        fontWeight: 700,
                                                        padding: '0 0.4rem',
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Copyright Notice */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Copyright Notice
                                    </label>
                                    <input
                                        type="text"
                                        value={copyrightDescription}
                                        onChange={(e) => setCopyrightDescription(e.target.value)}
                                        placeholder="© 2026 Dayal Sweets. All rights reserved."
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    style={{
                                        padding: '0.55rem 1.25rem',
                                        borderRadius: '0.375rem',
                                        background: '#7A1C1C',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {processing ? 'Saving...' : 'Save Footer Changes'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </AdminLayout>
    );
}
