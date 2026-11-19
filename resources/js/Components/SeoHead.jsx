import React from 'react';
import { Head, usePage } from '@inertiajs/react';

export default function SeoHead({
    page = null,
    fallbackTitle = 'Dayal Sweets',
    fallbackDescription = "Order authentic handmade Indian sweets, pure desi ghee mithai, namkeen, bakery treats, and festive gift hampers online from Dayal Sweets.",
}) {
    const sharedProps = usePage().props || {};
    const resolvedPage = page || sharedProps.page || sharedProps.pageSeo || null;
    const secSeo = resolvedPage?.sections?.seo || {};

    const metaTitle =
        resolvedPage?.meta_title ||
        secSeo.meta_title ||
        fallbackTitle ||
        'Dayal Sweets';

    const metaDescription =
        resolvedPage?.meta_description ||
        secSeo.meta_description ||
        fallbackDescription ||
        '';

    const metaKeywords =
        resolvedPage?.meta_keywords ||
        secSeo.meta_keywords ||
        '';

    const canonicalUrl =
        resolvedPage?.canonical_url ||
        secSeo.canonical_url ||
        '';

    const ogTitle =
        resolvedPage?.og_title ||
        secSeo.og_title ||
        metaTitle;

    const ogDescription =
        resolvedPage?.og_description ||
        secSeo.og_description ||
        metaDescription;

    const ogImage =
        resolvedPage?.og_image ||
        secSeo.og_image ||
        '';

    const robots =
        resolvedPage?.robots ||
        secSeo.robots ||
        'index, follow';

    return (
        <Head title={metaTitle}>
            {metaDescription && (
                <meta head-key="description" name="description" content={metaDescription} />
            )}
            {metaKeywords && (
                <meta head-key="keywords" name="keywords" content={metaKeywords} />
            )}
            {robots && (
                <meta head-key="robots" name="robots" content={robots} />
            )}
            {canonicalUrl && (
                <link head-key="canonical" rel="canonical" href={canonicalUrl} />
            )}
            <meta head-key="og:type" property="og:type" content="website" />
            {ogTitle && (
                <meta head-key="og:title" property="og:title" content={ogTitle} />
            )}
            {ogDescription && (
                <meta head-key="og:description" property="og:description" content={ogDescription} />
            )}
            {ogImage && (
                <meta head-key="og:image" property="og:image" content={ogImage} />
            )}
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            {ogTitle && (
                <meta head-key="twitter:title" name="twitter:title" content={ogTitle} />
            )}
            {ogDescription && (
                <meta head-key="twitter:description" name="twitter:description" content={ogDescription} />
            )}
            {ogImage && (
                <meta head-key="twitter:image" name="twitter:image" content={ogImage} />
            )}
        </Head>
    );
}
