import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageSeoSection from '@/Components/Admin/PageSeoSection';

export default function ContactUs({ page }) {
    const sections = page?.sections || {};

    // Top Bar Section Fields
    const [topBarHeading, setTopBarHeading] = useState(
        sections.top_bar_Heading ?? sections.top_bar?.title ?? 'CONTACT US'
    );
    const [topBarSubHeading, setTopBarSubHeading] = useState(
        sections.top_bar_sub_heading ?? sections.top_bar?.subtitle ?? "We'd Love to Hear From You!"
    );
    const [topBarDescription, setTopBarDescription] = useState(
        sections.top_bar_description ?? sections.top_bar?.description ?? "Have a query, feedback, or a special request? We're here to help and make your experience with Dayal Sweets even better."
    );

    // Contact Information Section Fields
    // Emails Repeater (email[])
    const initialEmails = Array.isArray(sections.emails) && sections.emails.length > 0
        ? sections.emails
        : (Array.isArray(sections.contact_info?.emails) && sections.contact_info.emails.length > 0
            ? sections.contact_info.emails.map((e) => (typeof e === 'object' ? e.email : e))
            : ['info@dayalsweets.com']);
    const [emails, setEmails] = useState(initialEmails);

    // Phones Repeater (phone[])
    const initialPhones = Array.isArray(sections.phones) && sections.phones.length > 0
        ? sections.phones
        : (Array.isArray(sections.contact_info?.phones) && sections.contact_info.phones.length > 0
            ? sections.contact_info.phones.map((p) => (typeof p === 'object' ? p.phone : p))
            : ['+91 98765 43210']);
    const [phones, setPhones] = useState(initialPhones);

    // Opening Hours
    const initialHours = sections.opening_hours ??
        (sections.contact_info?.hours?.[0]
            ? (typeof sections.contact_info.hours[0] === 'object'
                ? `${sections.contact_info.hours[0].days} ( ${sections.contact_info.hours[0].time} )`
                : sections.contact_info.hours[0])
            : 'Mon-Sun ( 07:00 AM - 12:00 AM )');
    const [openingHours, setOpeningHours] = useState(initialHours);

    // Page SEO Information State
    const [seo, setSeo] = useState({
        meta_title: page?.meta_title ?? sections.seo?.meta_title ?? 'Contact Us - Dayal Sweets',
        meta_description: page?.meta_description ?? sections.seo?.meta_description ?? "We'd Love to Hear From You! Have a query, feedback, or a special request? Contact Dayal Sweets.",
        meta_keywords: page?.meta_keywords ?? sections.seo?.meta_keywords ?? 'Contact Dayal Sweets, Dayal Sweets phone number, Dayal Sweets email',
        canonical_url: page?.canonical_url ?? sections.seo?.canonical_url ?? '',
        og_title: page?.og_title ?? sections.seo?.og_title ?? (page?.meta_title || 'Contact Us - Dayal Sweets'),
        og_description: page?.og_description ?? sections.seo?.og_description ?? (page?.meta_description || "We'd Love to Hear From You! Have a query, feedback, or a special request? Contact Dayal Sweets."),
        og_image: page?.og_image ?? sections.seo?.og_image ?? '',
        robots: page?.robots ?? sections.seo?.robots ?? 'index, follow',
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [closeHovered, setCloseHovered] = useState(false);
    const [previewHovered, setPreviewHovered] = useState(false);

    // Repeater handlers: Emails (email[])
    const handleAddEmail = () => {
        setEmails([...emails, '']);
    };
    const handleEmailChange = (index, value) => {
        const next = [...emails];
        next[index] = value;
        setEmails(next);
    };
    const handleRemoveEmail = (index) => {
        if (emails.length <= 1) return;
        setEmails(emails.filter((_, i) => i !== index));
    };

    // Repeater handlers: Phones (phone[])
    const handleAddPhone = () => {
        setPhones([...phones, '']);
    };
    const handlePhoneChange = (index, value) => {
        const next = [...phones];
        next[index] = value;
        setPhones(next);
    };
    const handleRemovePhone = (index) => {
        if (phones.length <= 1) return;
        setPhones(phones.filter((_, i) => i !== index));
    };

    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSaveSuccess(false);

        const payload = {
            top_bar_Heading: topBarHeading,
            top_bar_sub_heading: topBarSubHeading,
            top_bar_description: topBarDescription,
            emails: emails.filter((e) => e && e.trim() !== ''),
            phones: phones.filter((p) => p && p.trim() !== ''),
            opening_hours: openingHours,
            ...seo,
        };

        router.post(route('admin.pages.contact-us.update'), payload, {
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
        <AdminLayout header="Contact Us Page Settings">
            <Head title="Contact Us Page Settings - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <Link href={route('admin.pages.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Pages
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Contact Us</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Contact Us Page Content
                        </h1>
                        <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                            Edit dynamic content for Top Bar and Contact Information (Emails, Phone Numbers, Opening Hours).
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                        {/* Preview Button */}
                        <a
                            href="/contact-us"
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
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
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
                            href={route('admin.pages.index')}
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
                        <span>✓</span> Contact Us content updated successfully! Check the live website.
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
                    {/* ========================================================= */}
                    {/* SECTION 1: TOP BAR                                        */}
                    {/* ========================================================= */}
                    <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                            Top Bar Section
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 1.25rem 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                            Heading, sub-heading, and description displayed inside the top red hero banner.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Heading / Title <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={topBarHeading}
                                    onChange={(e) => setTopBarHeading(e.target.value)}
                                    placeholder="CONTACT US"
                                    required
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                />
                                {errors.top_bar_Heading && (
                                    <span style={{ color: '#E11D48', fontSize: '0.75rem', fontWeight: 600 }}>{errors.top_bar_Heading}</span>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Sub Heading
                                </label>
                                <input
                                    type="text"
                                    value={topBarSubHeading}
                                    onChange={(e) => setTopBarSubHeading(e.target.value)}
                                    placeholder="We'd Love to Hear From You!"
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Description
                                </label>
                                <textarea
                                    rows="3"
                                    value={topBarDescription}
                                    onChange={(e) => setTopBarDescription(e.target.value)}
                                    placeholder="Have a query, feedback, or a special request? We're here to help and make your experience with Dayal Sweets even better."
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* SECTION 2: CONTACT INFORMATION (EMAILS, PHONES, HOURS)    */}
                    {/* ========================================================= */}
                    <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                            Contact Information Section
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 1.25rem 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                            Store email addresses, phone numbers, and opening hours.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* 1. Email Addresses Repeater */}
                            <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                        Email Addresses
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddEmail}
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
                                        + Add Email
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {emails.map((email, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', minWidth: '20px' }}>
                                                {idx + 1}.
                                            </span>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => handleEmailChange(idx, e.target.value)}
                                                placeholder="e.g. info@dayalsweets.com"
                                                required
                                                style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEmail(idx)}
                                                disabled={emails.length <= 1}
                                                title={emails.length <= 1 ? 'At least one email is required' : 'Remove email'}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: emails.length <= 1 ? '#CBD5E1' : '#EF4444',
                                                    cursor: emails.length <= 1 ? 'not-allowed' : 'pointer',
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

                            {/* 2. Phone Numbers Repeater */}
                            <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                        Phone Numbers
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddPhone}
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
                                        + Add Phone
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {phones.map((phone, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', minWidth: '20px' }}>
                                                {idx + 1}.
                                            </span>
                                            <input
                                                type="text"
                                                value={phone}
                                                onChange={(e) => handlePhoneChange(idx, e.target.value)}
                                                placeholder="e.g. +91 98765 43210"
                                                required
                                                style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePhone(idx)}
                                                disabled={phones.length <= 1}
                                                title={phones.length <= 1 ? 'At least one phone is required' : 'Remove phone'}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: phones.length <= 1 ? '#CBD5E1' : '#EF4444',
                                                    cursor: phones.length <= 1 ? 'not-allowed' : 'pointer',
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

                            {/* 3. Opening Hours */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Opening Hours
                                </label>
                                <input
                                    type="text"
                                    value={openingHours}
                                    onChange={(e) => setOpeningHours(e.target.value)}
                                    placeholder="Mon-Sun ( 07:00 AM - 12:00 AM )"
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                />
                                <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem', display: 'block' }}>
                                    Displayed on the Opening Hours card on the Contact Us page.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* SECTION 3: PAGE SEO INFORMATION (META & OPEN GRAPH)       */}
                    {/* ========================================================= */}
                    <PageSeoSection
                        seo={seo}
                        onChange={setSeo}
                        pageSlug="contact-us"
                        pageTitle="Contact Us"
                        errors={errors}
                    />
                </form>
            </div>
        </AdminLayout>
    );
}

