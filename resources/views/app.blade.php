<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="icon" type="image/png" sizes="32x32" href="/uploads/2026/07/cropped-Frame-51-2-1-32x32.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/uploads/2026/07/cropped-Frame-51-2-1-192x192.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/uploads/2026/07/cropped-Frame-51-2-1-180x180.png">
        <meta name="msapplication-TileImage" content="/uploads/2026/07/cropped-Frame-51-2-1-270x270.png">

        @php
            $seoPage = $page['props']['page'] ?? $page['props']['pageSeo'] ?? null;
            if (is_object($seoPage)) {
                $seoPage = $seoPage->toArray();
            }
            $seoMetaTitle = $seoPage['meta_title'] ?? $seoPage['sections']['seo']['meta_title'] ?? config('app.name', 'Dayal Sweets');
            $seoMetaDesc = $seoPage['meta_description'] ?? $seoPage['sections']['seo']['meta_description'] ?? null;
            $seoMetaKeywords = $seoPage['meta_keywords'] ?? $seoPage['sections']['seo']['meta_keywords'] ?? null;
            $seoRobots = $seoPage['robots'] ?? $seoPage['sections']['seo']['robots'] ?? 'index, follow';
            $seoCanonical = $seoPage['canonical_url'] ?? $seoPage['sections']['seo']['canonical_url'] ?? null;
            $seoOgTitle = $seoPage['og_title'] ?? $seoPage['sections']['seo']['og_title'] ?? $seoMetaTitle;
            $seoOgDesc = $seoPage['og_description'] ?? $seoPage['sections']['seo']['og_description'] ?? $seoMetaDesc;
            $seoOgImage = $seoPage['og_image'] ?? $seoPage['sections']['seo']['og_image'] ?? null;
        @endphp

        <title inertia>{{ $seoMetaTitle }}</title>
        @if($seoMetaDesc)
        <meta inertia="description" name="description" content="{{ $seoMetaDesc }}">
        @endif
        @if($seoMetaKeywords)
        <meta inertia="keywords" name="keywords" content="{{ $seoMetaKeywords }}">
        @endif
        @if($seoRobots)
        <meta inertia="robots" name="robots" content="{{ $seoRobots }}">
        @endif
        @if($seoCanonical)
        <link inertia="canonical" rel="canonical" href="{{ $seoCanonical }}">
        @endif
        @if($seoOgTitle)
        <meta inertia="og:title" property="og:title" content="{{ $seoOgTitle }}">
        @endif
        @if($seoOgDesc)
        <meta inertia="og:description" property="og:description" content="{{ $seoOgDesc }}">
        @endif
        @if($seoOgImage)
        <meta inertia="og:image" property="og:image" content="{{ $seoOgImage }}">
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,300..900;1,14..32,300..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Rozha+One&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="dayal-body">
        @inertia
    </body>
</html>
