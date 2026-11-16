import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ProductCard from '@/Components/ProductCard';
import ContactHero from '@/Components/contact/ContactHero';
import '../../scss/pages/_contact.scss';

// 12 Catalog Products matching exact live store items
const initialShopProducts = [
    {
        id: 8558,
        name: 'Office Tea Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'office-tea-combo',
        badge: 'COMBO',
        description: 'Brighten up your workday with our Office Tea Combo — a perfect pairing of refreshing tea and delicious snacks.',
        image: '/uploads/2026/09/Office-Tea-Combo.png',
        price: 150,
        rating: 4.8,
        ratingCount: 16,
        tags: ['Office', 'Tea Time'],
        diet: 'Vegetarian',
        variations: [],
    },
    {
        id: 8556,
        name: 'Engagement Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'engagement-combo',
        badge: 'COMBO',
        description: 'Celebrate your special day with our Engagement Combo, thoughtfully curated with rich traditional sweets and savouries.',
        image: '/uploads/2026/09/Engagement-Combo.png',
        price: 450,
        rating: 5,
        ratingCount: 22,
        tags: ['Wedding Collection', 'Celebration'],
        diet: 'Vegetarian',
        variations: [],
    },
    {
        id: 8554,
        name: 'Birthday Party Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'birthday-party-combo',
        badge: 'COMBO',
        description: 'Make every birthday celebration sweeter and memorable with our Birthday Party Combo! A delicious selection of crowd-pleasing sweets.',
        image: '/uploads/2026/09/Birthday-Party-Combo.png',
        price: 200,
        rating: 4.9,
        ratingCount: 30,
        tags: ['Birthday', 'Celebration'],
        diet: 'Vegetarian',
        variations: [],
    },
    {
        id: 8553,
        name: 'Family Evening Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'family-evening-combo',
        badge: 'COMBO',
        description: 'Enjoy a delicious evening together with our Family Evening Combo, featuring a heartwarming assortment of fresh sweets and savouries.',
        image: '/uploads/2026/09/Family-Evening-combo.png',
        price: 300,
        rating: 4.7,
        ratingCount: 19,
        tags: ['Family', 'Evening Snacks'],
        diet: 'Vegetarian',
        variations: [],
    },
    {
        id: 8550,
        name: 'Tea Time Delight',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'tea-time-delight',
        badge: 'COMBO',
        description: 'Because the best conversations happen over tea and delicious snacks! Our Tea Time Delight brings together classic crispy bites.',
        image: '/uploads/2026/09/Tea-Time-Delight.png',
        price: 75,
        rating: 4.6,
        ratingCount: 14,
        tags: ['Tea Time', 'Snacks'],
        diet: 'Vegetarian',
        variations: [],
    },
    {
        id: 7540,
        name: 'Masala Dosa',
        category: 'SOUTH INDIAN',
        categorySlug: 'south-indian',
        slug: 'masala-dosa',
        badge: 'SOUTH INDIAN',
        description: 'Crispy golden dosa filled with spiced mashed potato stuffing, served piping hot with flavorful sambar and coconut chutney.',
        image: '/uploads/2026/09/Masala-Dosa.png',
        price: 110,
        rating: 4.9,
        ratingCount: 28,
        tags: ['Breakfast', 'South Indian'],
        diet: 'Vegetarian',
        variations: [
            { label: '1 Piece', price: 110 },
        ],
    },
    {
        id: 7537,
        name: 'Chilli Paneer',
        category: 'CHINESE',
        categorySlug: 'chinese',
        slug: 'chilli-paneer',
        badge: 'CHINESE',
        description: 'Crispy fried paneer cubes tossed with crunchy bell peppers, onions, and a spicy, tangy Indo-Chinese sauce.',
        image: '/uploads/2026/09/chilipanner.png',
        price: 250,
        rating: 4.8,
        ratingCount: 35,
        tags: ['Chinese', 'Starters'],
        diet: 'Vegetarian',
        variations: [
            { label: 'Full', price: 250 },
        ],
    },
    {
        id: 7533,
        name: 'Paneer Butter Masala',
        category: 'NORTH INDIAN',
        categorySlug: 'north-indian',
        slug: 'paneer-butter-masala',
        badge: 'NORTH INDIAN',
        description: 'Soft cottage cheese simmered in a velvety rich tomato, butter, and cashew gravy, subtly spiced with aromatic herbs.',
        image: '/uploads/2026/09/panner.png',
        price: 165,
        rating: 4.9,
        ratingCount: 42,
        tags: ['North Indian', 'Main Course'],
        diet: 'Vegetarian',
        variations: [
            { label: 'Full', price: 165 },
        ],
    },
    {
        id: 7530,
        name: 'Himachali Special',
        category: 'HIMACHALI SPECIAL',
        categorySlug: 'himachali-special',
        slug: 'himachali-special',
        badge: 'HIMACHALI SPECIAL',
        description: 'Discover the authentic taste of Himachal with our traditional special platter made using heritage mountain recipes and pure ghee.',
        image: '/uploads/2026/08/Himachali-Special-1.png',
        price: 1500,
        rating: 5,
        ratingCount: 50,
        tags: ['Himachali Special', 'Heritage'],
        diet: 'Vegetarian',
        variations: [],
    },
    {
        id: 622,
        name: 'Marwadi Ladoo',
        category: 'SWEETS',
        categorySlug: 'sweets',
        slug: 'marwadi-ladoo',
        badge: 'SWEETS',
        description: 'Traditional Rajasthani Marwadi Ladoo prepared with pure desi ghee and premium ingredients, offering an authentic rich taste.',
        image: '/uploads/2026/07/Marwadi-ladoo.avif',
        price: 'From ₹120.00',
        rating: 5,
        ratingCount: 24,
        tags: ['Diwali', 'Festive Specials'],
        diet: 'Vegetarian',
        variations: [
            { label: '250g', price: 120 },
            { label: '500g', price: 240 },
            { label: '1kg', price: 480 },
        ],
    },
    {
        id: 322,
        name: 'Brownies',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'brownies',
        badge: 'BAKERY',
        description: 'Rich, moist, and fudgy brownies made with premium chocolate, freshly baked to deliver an irresistible treat for every chocolate lover.',
        image: '/uploads/2026/07/Brownies.jpg',
        price: 'From ₹70.00',
        rating: 4.8,
        ratingCount: 18,
        tags: ['Bakery', 'Dessert'],
        diet: 'Vegetarian',
        variations: [
            { label: '1 Piece', price: 70 },
            { label: '2 Pieces', price: 140 },
            { label: '4 Pieces', price: 280 },
        ],
    },
    {
        id: 321,
        name: 'Cakes',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'cakes',
        badge: 'BAKERY',
        description: 'Freshly baked cakes crafted with premium ingredients, offering a soft texture, rich flavor, and perfect sweetness for every celebration.',
        image: '/uploads/2026/07/Cakes.jpg',
        price: 'From ₹450.00',
        rating: 4.9,
        ratingCount: 38,
        tags: ['Birthday', 'Celebration'],
        diet: 'Vegetarian',
        variations: [
            { label: '500g', price: 450 },
            { label: '1kg', price: 850 },
        ],
    },
];

// Curated Combos Section Products
const curatedCombos = [
    initialShopProducts[1], // Engagement Combo
    initialShopProducts[2], // Birthday Party Combo
    initialShopProducts[3], // Family Evening Combo
    initialShopProducts[4], // Tea Time Delight
];

const categoryList = [
    { name: 'Bakery', slug: 'bakery', count: 24 },
    { name: 'Best Seller', slug: 'best-seller', count: 12 },
    { name: 'Beverages', slug: 'beverages', count: 9 },
    { name: 'Chinese', slug: 'chinese', count: 8 },
    { name: 'Combo', slug: 'combo', count: 6 },
    { name: 'Desserts', slug: 'desserts', count: 7 },
    { name: 'Gift hampers', slug: 'gift-hampers', count: 16 },
    { name: 'Himachali Special', slug: 'himachali-special', count: 10 },
    { name: 'Namkeen', slug: 'namkeen', count: 14 },
    { name: 'North Indian', slug: 'north-indian', count: 11 },
    { name: 'Snacks', slug: 'snacks', count: 18 },
    { name: 'South Indian', slug: 'south-indian', count: 8 },
    { name: 'Sweets', slug: 'sweets', count: 42 },
];

const defaultSeasonalTags = [
    'Baisakhi',
    'Christmas',
    'Diwali',
    'Eid',
    'Holi',
    'Navratri',
    'New Year',
    'Raksha Bandhan',
    'Summer Specials',
    'Wedding Collection',
    'Winter Specials',
];

const defaultOccasionOptions = [
    'Birthday',
    'Wedding',
    'Anniversary',
    'Corporate Gifting',
    'Festival',
    'Family Celebration',
    'Housewarming',
];

const defaultDietOptions = [
    'Sugar Free',
    'Low Sugar',
    'Jain Friendly',
    'Vegan',
    'Gluten Free',
];

const qrSteps = [
    {
        num: 1,
        title: 'SCAN',
        desc: 'Open camera & scan\nthe QR code.',
        icon: '/uploads/2026/09/Container_margin-1.png',
    },
    {
        num: 2,
        title: 'YOUR LOCATION',
        desc: 'Find the nearest Dayal\nSweets dining outlet.',
        icon: '/uploads/2026/09/Container_margin.png',
    },
    {
        num: 3,
        title: 'BOOK YOUR TABLE',
        desc: 'Reserve your table in\njust a few taps.',
        icon: '/uploads/2026/09/Container_margin-2.png',
    },
    {
        num: 4,
        title: 'EXPLORE MENU',
        desc: 'Discover our wide range\nof delicious dishes.',
        icon: '/uploads/2026/09/Container-1.png',
    },
];

export default function Shop({
    auth,
    products = [],
    categories = [],
    seasonalTags: propSeasonalTags = [],
    occasionTags: propOccasionTags = [],
    dietTags: propDietTags = [],
}) {
    // Dynamic / Default Tag options from separate category tables
    const seasonalTags = useMemo(() => {
        if (Array.isArray(propSeasonalTags) && propSeasonalTags.length > 0) {
            return propSeasonalTags.map((t) => (typeof t === 'string' ? t : t.name));
        }
        return defaultSeasonalTags;
    }, [propSeasonalTags]);

    const occasionOptions = useMemo(() => {
        if (Array.isArray(propOccasionTags) && propOccasionTags.length > 0) {
            return propOccasionTags.map((t) => (typeof t === 'string' ? t : t.name));
        }
        return defaultOccasionOptions;
    }, [propOccasionTags]);

    const dietOptions = useMemo(() => {
        if (Array.isArray(propDietTags) && propDietTags.length > 0) {
            return propDietTags.map((t) => (typeof t === 'string' ? t : t.name));
        }
        return defaultDietOptions;
    }, [propDietTags]);
    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCats, setSelectedCats] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [sortOption, setSortOption] = useState('date');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(5000);
    const [minRating, setMinRating] = useState(0);
    const [selectedOccasions, setSelectedOccasions] = useState([]);
    const [selectedDiet, setSelectedDiet] = useState([]);
    const [copiedCode, setCopiedCode] = useState(false);

    // UI States
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const { url } = usePage();

    useEffect(() => {
        try {
            const searchParams = new URL(url, 'http://localhost').searchParams;
            const catsParam = searchParams.get('cats') || searchParams.get('category');
            if (catsParam) {
                const cats = catsParam.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean);
                setSelectedCats(cats);
            }
            const sParam = searchParams.get('s') || searchParams.get('search');
            if (sParam) {
                setSearchQuery(sParam);
            }
        } catch {
            // ignore
        }
    }, [url]);

    // Collapsible Accordion Sections
    const [collapsed, setCollapsed] = useState({
        search: false,
        sort: false,
        categories: false,
        price: false,
        seasonal: false,
        occasion: false,
        diet: false,
        rating: false,
    });

    const toggleSection = (section) => {
        setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCategoryToggle = (slug) => {
        setSelectedCats((prev) =>
            prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
        setCurrentPage(1);
    };

    const handleTagClick = (tag) => {
        setSelectedTag((prev) => (prev === tag ? '' : tag));
        setCurrentPage(1);
    };

    const handleClearAll = (e) => {
        e?.preventDefault();
        setSearchQuery('');
        setSelectedCats([]);
        setSelectedTag('');
        setSortOption('date');
        setMinPrice(0);
        setMaxPrice(5000);
        setMinRating(0);
        setSelectedOccasions([]);
        setSelectedDiet([]);
        setCurrentPage(1);
    };

    const handleCopyCode = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText('DAYAL10');
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2500);
        }
    };

    const sourceProducts = useMemo(() => {
        return Array.isArray(products) && products.length > 0 ? products : initialShopProducts;
    }, [products]);

    const displayCategories = useMemo(() => {
        if (Array.isArray(categories) && categories.length > 0) {
            return categories.map((cat) => {
                const count = sourceProducts.filter((p) => {
                    const pSlug = (p.categorySlug || '').toLowerCase();
                    const cSlug = (cat.slug || '').toLowerCase();
                    return pSlug === cSlug || pSlug.startsWith(cSlug) || cSlug.startsWith(pSlug);
                }).length;

                return {
                    ...cat,
                    count: count > 0 ? count : (cat.count || 0),
                };
            });
        }
        return categoryList;
    }, [categories, sourceProducts]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return sourceProducts.filter((product) => {
            // Search query filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchName = product.name.toLowerCase().includes(query);
                const matchDesc = product.description?.toLowerCase().includes(query);
                const matchCat = product.category.toLowerCase().includes(query);
                if (!matchName && !matchDesc && !matchCat) return false;
            }

            // Categories filter (multi-select)
            if (selectedCats.length > 0) {
                const matchCat = selectedCats.some((c) => {
                    const normalized = c.toLowerCase();
                    const pCatSlug = (product.categorySlug || '').toLowerCase();
                    return pCatSlug === normalized || pCatSlug.startsWith(normalized) || normalized.startsWith(pCatSlug);
                });
                if (!matchCat) return false;
            }

            // Seasonal category filter
            if (selectedTag) {
                const matchSeasonal = product.seasonal === selectedTag ||
                    product.seasonalSlug === selectedTag.toLowerCase().replace(/\s+/g, '-') ||
                    (product.tags && product.tags.includes(selectedTag));
                if (!matchSeasonal) return false;
            }

            // Occasion category filter
            if (selectedOccasions.length > 0) {
                const matchOccasion = selectedOccasions.includes(product.occasion) ||
                    (product.tags && product.tags.some((t) => selectedOccasions.includes(t)));
                if (!matchOccasion) return false;
            }

            // Diet Preference category filter
            if (selectedDiet.length > 0) {
                const matchDiet = selectedDiet.includes(product.diet) ||
                    (product.tags && product.tags.some((t) => selectedDiet.includes(t)));
                if (!matchDiet) return false;
            }

            // Rating filter
            if (minRating > 0) {
                if (product.rating < minRating) return false;
            }

            // Price filter
            let effectiveMin = typeof product.min_price === 'number' ? product.min_price : null;
            let effectiveMax = typeof product.max_price === 'number' ? product.max_price : null;

            if (effectiveMin === null || effectiveMax === null) {
                if (product.variations && product.variations.length > 0) {
                    const prices = product.variations.map((v) => typeof v.price === 'number' ? v.price : parseFloat(String(v.price).replace(/[^0-9.]/g, ''))).filter((p) => !isNaN(p));
                    if (prices.length > 0) {
                        effectiveMin = Math.min(...prices);
                        effectiveMax = Math.max(...prices);
                    }
                }
            }

            if (effectiveMin === null) {
                let p = 0;
                if (typeof product.price === 'number') {
                    p = product.price;
                } else if (typeof product.price === 'string') {
                    const num = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                    p = isNaN(num) ? 0 : num;
                }
                effectiveMin = p;
                effectiveMax = p;
            }

            // Item must overlap with the user's selected [minPrice, maxPrice] range
            if (effectiveMax < minPrice) return false;
            if (maxPrice < 5000 && effectiveMin > maxPrice) return false;

            return true;
        });
    }, [searchQuery, selectedCats, selectedTag, selectedOccasions, selectedDiet, minRating, minPrice, maxPrice]);

    // Sorting Logic
    const sortedProducts = useMemo(() => {
        const list = [...filteredProducts];
        switch (sortOption) {
            case 'price':
                return list.sort((a, b) => {
                    const priceA = typeof a.min_price === 'number' ? a.min_price : (typeof a.price === 'number' ? a.price : parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0);
                    const priceB = typeof b.min_price === 'number' ? b.min_price : (typeof b.price === 'number' ? b.price : parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0);
                    return priceA - priceB;
                });
            case 'price-desc':
                return list.sort((a, b) => {
                    const priceA = typeof a.max_price === 'number' ? a.max_price : (typeof a.price === 'number' ? a.price : parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0);
                    const priceB = typeof b.max_price === 'number' ? b.max_price : (typeof b.price === 'number' ? b.price : parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0);
                    return priceB - priceA;
                });
            case 'rating':
                return list.sort((a, b) => b.rating - a.rating);
            case 'popularity':
                return list.sort((a, b) => b.ratingCount - a.ratingCount);
            case 'title':
                return list.sort((a, b) => a.name.localeCompare(b.name));
            case 'date':
            default:
                return list;
        }
    }, [filteredProducts, sortOption]);

    // Pagination Calculation
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedProducts.slice(start, start + itemsPerPage);
    }, [sortedProducts, currentPage, itemsPerPage]);

    const startCount = sortedProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endCount = Math.min(currentPage * itemsPerPage, sortedProducts.length);

    return (
        <div className="dayal-sweets-shop oto-shop-container">
            <Head title="Shop | Dayal Sweets - Pure Traditional Sweets & Snacks" />

            {/* Global Header */}
            <Header auth={auth} />

            {/* 1. HERO BANNER (Reusable Hero matching Gifting, About Us, Contact) */}
            <ContactHero
                className="dayal-shop-hero"
                breadcrumbs={[
                    { label: 'HOME', url: '/' },
                    { label: 'SHOP', url: null },
                ]}
                title="SHOP"
                subtitle="Discover Every Festive Delight"
                description=""
            />

            {/* 2. MAIN LAYOUT: SIDEBAR + PRODUCT CATALOG */}
            <div className="dayal-shop-layout oto-shop-layout">
                {/* Mobile Filter Backdrop */}
                <div
                    className={`dayal-shop-overlay oto-filter-overlay ${mobileSidebarOpen ? 'is-active' : ''}`}
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-hidden="true"
                />

                {/* SIDEBAR FILTERS */}
                <aside
                    className={`dayal-shop-sidebar oto-shop-sidebar ${mobileSidebarOpen ? 'is-open' : ''}`}
                    id="sidebar"
                    aria-label="Product filters"
                >
                    <div className="dayal-shop-sidebar-header oto-sidebar-header">
                        <span>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M2 3H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                <path d="M13 3H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                <path d="M11 1V5" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" />
                                <path d="M2 9H5" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" />
                                <path d="M9 9H16" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" />
                                <path d="M7 7V11" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" />
                                <path d="M2 15H10" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" />
                                <path d="M14 15H16" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" />
                                <path d="M12 13V17" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" />
                            </svg>
                            FILTERS
                        </span>
                        <button type="button" className="dayal-shop-clear-all oto-clear-filters-btn" onClick={handleClearAll}>
                            &#8634; Clear All
                        </button>
                        <button
                            type="button"
                            className="dayal-shop-close-sidebar"
                            aria-label="Close filters"
                            onClick={() => setMobileSidebarOpen(false)}
                        >
                            ✕
                        </button>
                    </div>

                    {/* SEARCH PRODUCTS */}
                    <div className="dayal-shop-filter-group oto-filter-group">
                        <div
                            className="dayal-shop-filter-toggle oto-filter-toggle"
                            onClick={() => toggleSection('search')}
                            role="button"
                            tabIndex={0}
                        >
                            <span>SEARCH PRODUCTS</span>
                            <span className={`dayal-shop-caret oto-caret ${collapsed.search ? 'is-rotated' : ''}`}>
                                <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                        <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.search ? 'is-collapsed' : ''}`}>
                            <div className="dayal-shop-search-box oto-search-pill">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="11" cy="11" r="7" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    placeholder="Search sweets, snacks, gifts..."
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="dayal-shop-search-clear oto-search-clear-btn"
                                        aria-label="Clear search text"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SORT BY */}
                    <div className="dayal-shop-filter-group oto-filter-group">
                        <div
                            className="dayal-shop-filter-toggle oto-filter-toggle"
                            onClick={() => toggleSection('sort')}
                            role="button"
                            tabIndex={0}
                        >
                            <span>SORT BY</span>
                            <span className={`dayal-shop-caret oto-caret ${collapsed.sort ? 'is-rotated' : ''}`}>
                                <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                        <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.sort ? 'is-collapsed' : ''}`}>
                            <select
                                className="dayal-shop-sort-select oto-sort-select oto-sort-select-full"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="date">Default Sorting (Newest)</option>
                                <option value="popularity">Popularity</option>
                                <option value="rating">Average Rating</option>
                                <option value="price">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="title">Product Name</option>
                            </select>
                        </div>
                    </div>

                    {/* CATEGORIES */}
                    <div className="dayal-shop-filter-group oto-filter-group">
                        <div
                            className="dayal-shop-filter-toggle oto-filter-toggle"
                            onClick={() => toggleSection('categories')}
                            role="button"
                            tabIndex={0}
                        >
                            <span>CATEGORIES</span>
                            <span className={`dayal-shop-caret oto-caret ${collapsed.categories ? 'is-rotated' : ''}`}>
                                <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                        <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.categories ? 'is-collapsed' : ''}`}>
                            <ul className="dayal-shop-cat-list oto-category-filter-list">
                                {displayCategories.map((cat) => (
                                    <li key={cat.slug} className="oto-cat-item">
                                        <label className="oto-filter-option oto-cat-checkbox-label">
                                            <input
                                                type="checkbox"
                                                className="oto-cat-checkbox"
                                                checked={selectedCats.includes(cat.slug)}
                                                onChange={() => handleCategoryToggle(cat.slug)}
                                            />
                                            <span>{cat.name}</span>
                                            <span className="dayal-shop-cat-count oto-cat-count">({cat.count})</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* PRICE RANGE */}
                    <div className="dayal-shop-filter-group oto-filter-group">
                        <div
                            className="dayal-shop-filter-toggle oto-filter-toggle"
                            onClick={() => toggleSection('price')}
                            role="button"
                            tabIndex={0}
                        >
                            <span>PRICE RANGE</span>
                            <span className={`dayal-shop-caret oto-caret ${collapsed.price ? 'is-rotated' : ''}`}>
                                <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                        <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.price ? 'is-collapsed' : ''}`}>
                            <div className="dayal-shop-price-values oto-price-values-row">
                                <div className="oto-price-value oto-price-value-min">
                                    MIN<br />
                                    <strong id="priceMinDisplay">&#8377;{minPrice}</strong>
                                </div>
                                <div className="oto-price-value oto-price-value-max">
                                    MAX<br />
                                    <strong id="priceMaxDisplay">&#8377;{maxPrice}+</strong>
                                </div>
                            </div>
                            <div className="dayal-shop-slider-track oto-range-slider">
                                <div
                                    className="dayal-shop-slider-range oto-range-fill"
                                    style={{
                                        left: `${(minPrice / 5000) * 100}%`,
                                        width: `${((maxPrice - minPrice) / 5000) * 100}%`,
                                    }}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="50"
                                    value={minPrice}
                                    className="oto-range-input oto-range-min"
                                    onChange={(e) => {
                                        const val = Math.min(Number(e.target.value), maxPrice - 50);
                                        setMinPrice(val);
                                        setCurrentPage(1);
                                    }}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="50"
                                    value={maxPrice}
                                    className="oto-range-input oto-range-max"
                                    onChange={(e) => {
                                        const val = Math.max(Number(e.target.value), minPrice + 50);
                                        setMaxPrice(val);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEASONAL MITHAI */}
                    <div className="dayal-shop-filter-group oto-filter-group">
                        <div
                            className="dayal-shop-filter-toggle oto-filter-toggle"
                            onClick={() => toggleSection('seasonal')}
                            role="button"
                            tabIndex={0}
                        >
                            <span>SEASONAL MITHAI</span>
                            <span className={`dayal-shop-caret oto-caret ${collapsed.seasonal ? 'is-rotated' : ''}`}>
                                <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                        <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.seasonal ? 'is-collapsed' : ''}`}>
                            <div className="dayal-shop-tags oto-tag-pills">
                                {seasonalTags.map((tag) => (
                                    <button
                                        type="button"
                                        key={tag}
                                        className={`dayal-shop-tag-pill oto-tag-pill ${selectedTag === tag ? 'active is-active' : ''}`}
                                        onClick={() => handleTagClick(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* OCCASION */}
                    <div className="dayal-shop-filter-group oto-filter-group">
                        <div
                            className="dayal-shop-filter-toggle oto-filter-toggle"
                            onClick={() => toggleSection('occasion')}
                            role="button"
                            tabIndex={0}
                        >
                            <span>OCCASION</span>
                            <span className={`dayal-shop-caret oto-caret ${collapsed.occasion ? 'is-rotated' : ''}`}>
                                <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                        <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.occasion ? 'is-collapsed' : ''}`}>
                            <div className="dayal-shop-filter-options">
                                {occasionOptions.map((occ) => (
                                    <label key={occ} className="oto-filter-option">
                                        <input
                                            type="checkbox"
                                            checked={selectedOccasions.includes(occ)}
                                            onChange={() => {
                                                setSelectedOccasions((prev) =>
                                                    prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
                                                );
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <span>{occ}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DIET PREFERENCE */}
                    <div className="dayal-shop-filter-group oto-filter-group">
                        <div
                            className="dayal-shop-filter-toggle oto-filter-toggle"
                            onClick={() => toggleSection('diet')}
                            role="button"
                            tabIndex={0}
                        >
                            <span>DIET PREFERENCE</span>
                            <span className={`dayal-shop-caret oto-caret ${collapsed.diet ? 'is-rotated' : ''}`}>
                                <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                        <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.diet ? 'is-collapsed' : ''}`}>
                            <div className="dayal-shop-filter-options">
                                {dietOptions.map((diet) => (
                                    <label key={diet} className="oto-filter-option">
                                        <input
                                            type="checkbox"
                                            checked={selectedDiet.includes(diet)}
                                            onChange={() => {
                                                setSelectedDiet((prev) =>
                                                    prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
                                                );
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <span>{diet}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RATING */}
                    <div className="dayal-shop-filter-group oto-filter-group">
                        <div
                            className="dayal-shop-filter-toggle oto-filter-toggle"
                            onClick={() => toggleSection('rating')}
                            role="button"
                            tabIndex={0}
                        >
                            <span>RATING</span>
                            <span className={`dayal-shop-caret oto-caret ${collapsed.rating ? 'is-rotated' : ''}`}>
                                <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                        <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.rating ? 'is-collapsed' : ''}`}>
                            <div className="dayal-shop-filter-options">
                                {[5, 4, 3].map((stars) => (
                                    <label key={stars} className="oto-filter-option">
                                        <input
                                            type="radio"
                                            name="ratingFilter"
                                            checked={minRating === stars}
                                            onChange={() => {
                                                setMinRating(minRating === stars ? 0 : stars);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <span className="dayal-shop-stars oto-stars">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <svg
                                                    key={s}
                                                    viewBox="0 0 24 24"
                                                    fill={s <= stars ? '#F59E0B' : '#D1D5DB'}
                                                    stroke="none"
                                                    width="14"
                                                    height="14"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </span>
                                        {stars < 5 && <span className="dayal-shop-rating-label">&amp; above</span>}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN CATALOG COLUMN */}
                <main className="dayal-shop-main oto-shop-main">
                    {/* TOOLBAR */}
                    <div className="dayal-shop-toolbar oto-shop-toolbar">
                        <div className="dayal-shop-results-count oto-results-count">
                            Showing {startCount}–{endCount} of {sortedProducts.length} results
                        </div>

                        <div className="oto-toolbar-actions">
                            <button
                                type="button"
                                className="dayal-shop-filter-trigger oto-filter-toggle-btn"
                                onClick={() => setMobileSidebarOpen(true)}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span>Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* PRODUCT GRID */}
                    {paginatedProducts.length > 0 ? (
                        <div className="dayal-shop-products-grid oto-products-grid-archive">
                            {paginatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="dayal-shop-empty oto-no-products">
                            <h3>No Products Found</h3>
                            <p>Try clearing some filters or searching with a different term.</p>
                            <button type="button" className="dayal-shop-apply-btn" onClick={handleClearAll} style={{ maxWidth: '200px', margin: '20px auto 0' }}>
                                Reset All Filters
                            </button>
                        </div>
                    )}

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <nav className="dayal-shop-pagination oto-pagination" aria-label="Catalog pages">
                            <button
                                type="button"
                                className={`dayal-shop-page-btn oto-page-btn oto-page-arrow oto-page-double-arrow ${currentPage === 1 ? 'is-disabled oto-page-disabled' : ''}`}
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                aria-label="First page"
                            >
                                «
                            </button>
                            <button
                                type="button"
                                className={`dayal-shop-page-btn oto-page-btn oto-page-arrow ${currentPage === 1 ? 'is-disabled oto-page-disabled' : ''}`}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                            >
                                ‹
                            </button>

                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    type="button"
                                    className={`dayal-shop-page-btn oto-page-btn ${currentPage === pageNum ? 'is-active active' : ''}`}
                                    onClick={() => setCurrentPage(pageNum)}
                                    aria-current={currentPage === pageNum ? 'page' : undefined}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                type="button"
                                className={`dayal-shop-page-btn oto-page-btn oto-page-arrow ${currentPage === totalPages ? 'is-disabled oto-page-disabled' : ''}`}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                            >
                                ›
                            </button>
                            <button
                                type="button"
                                className={`dayal-shop-page-btn oto-page-btn oto-page-arrow oto-page-double-arrow ${currentPage === totalPages ? 'is-disabled oto-page-disabled' : ''}`}
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                aria-label="Last page"
                            >
                                »
                            </button>
                        </nav>
                    )}
                </main>
            </div>

            {/* 3. CURATED COMBOS SECTION */}
            <section className="dayal-shop-combos-section oto-shop-coupon-template" aria-label="Curated Combos">
                <div className="dayal-shop-section-container">
                    <header className="dayal-shop-section-header">
                        <span className="dayal-shop-section-eyebrow">— CURATED COMBOS —</span>
                        <h2 className="dayal-shop-section-title">
                            Perfect Pairing <br />
                            <span className="rt-span-color">Made For Every Moment</span>
                        </h2>
                        <p className="dayal-shop-section-subtitle">
                            From traditional mithai to festive gift boxes, explore offers made just for you.
                        </p>
                    </header>

                    <div className="oto-products-grid-archive oto-latest-combo-products">
                        {curatedCombos.map((combo) => (
                            <ProductCard key={combo.id} product={combo} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. EXCLUSIVE OFFERS / TODAY'S SWEETEST DEALS */}
            <section className="dayal-shop-deals-section" aria-label="Exclusive Offers">
                <div className="dayal-shop-section-container">
                    <header className="dayal-shop-section-header">
                        <span className="dayal-shop-section-eyebrow">— EXCLUSIVE OFFERS —</span>
                        <h2 className="dayal-shop-section-title">
                            Today's <span className="rt-span-color">Sweetest Deals</span>
                        </h2>
                        <p className="dayal-shop-section-subtitle">
                            From traditional mithai to festive gift boxes, explore offers made just for you.
                        </p>
                    </header>

                    <div className="dayal-shop-deals-grid">
                        {/* Deal 1: 20% OFF Flash Deal */}
                        <div className="dayal-shop-deal-card is-flash-deal">
                            <div className="dayal-deal-card-content">
                                <div className="dayal-deal-flash-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                        <path d="M5.97203 1.22726C5.7941 1.04929 5.55277 0.949272 5.30112 0.949219H1.89817C1.64649 0.949219 1.40512 1.0492 1.22716 1.22716C1.0492 1.40512 0.949219 1.64649 0.949219 1.89817V5.30112C0.949272 5.55277 1.04929 5.7941 1.22726 5.97203L5.3571 10.1019C5.57276 10.3162 5.86444 10.4364 6.16846 10.4364C6.47248 10.4364 6.76416 10.3162 6.97981 10.1019L10.1019 6.97981C10.3162 6.76416 10.4364 6.47248 10.4364 6.16846C10.4364 5.86444 10.3162 5.57276 10.1019 5.3571L5.97203 1.22726Z" stroke="#FEDD7D" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="3.56" cy="3.56" r="1" fill="#3A1A1A" stroke="#FEDD7D" strokeWidth="0.95" />
                                    </svg>
                                    <span>FLASH DEAL</span>
                                </div>
                                <h3 className="dayal-deal-big-heading">
                                    <span className="big-num">20%</span> OFF
                                </h3>
                                <p className="dayal-deal-category-label">ON SELECTED SWEETS</p>
                                <img
                                    src="/uploads/2026/09/Group-2.png"
                                    alt=""
                                    className="dayal-deal-divider"
                                    aria-hidden="true"
                                />
                                <Link href="/shop?category=sweets" className="dayal-deal-btn-link is-light">
                                    <span>Shop Now</span>
                                    <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                            <div className="dayal-deal-card-image">
                                <img
                                    src="/uploads/2026/09/20277557511ebef6fe8151f59a459df7ce4dbdb9-e1789540195108.png"
                                    alt="Selected sweets platter"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Deal 2: 10% OFF First Order */}
                        <div className="dayal-shop-deal-card is-coupon-card">
                            <div className="dayal-deal-icon">
                                <img src="/uploads/2026/09/Frame-130.svg" alt="" aria-hidden="true" />
                            </div>
                            <p className="dayal-deal-eyebrow">FIRST ORDER OFFER</p>
                            <h3 className="dayal-deal-title"><span className="deal-strong">10%</span> OFF</h3>
                            <p className="dayal-deal-sub">On Your First Order</p>
                            <div className="dayal-deal-coupon-box">
                                <span className="dayal-deal-coupon-label">USE CODE</span>
                                <strong className="dayal-deal-coupon-code">DAYAL10</strong>
                            </div>
                            <button
                                type="button"
                                className="dayal-deal-action-btn"
                                onClick={handleCopyCode}
                            >
                                {copiedCode ? '✓ Copied!' : 'Copy Code'}
                            </button>
                        </div>

                        {/* Deal 3: Buy 2 Get 1 Free */}
                        <div className="dayal-shop-deal-card is-coupon-card">
                            <div className="dayal-deal-icon">
                                <img src="/uploads/2026/09/Frame-130-1.svg" alt="" aria-hidden="true" />
                            </div>
                            <p className="dayal-deal-eyebrow">COMBO OFFER</p>
                            <h3 className="dayal-deal-title">Buy 2<br />Get 1 Free</h3>
                            <p className="dayal-deal-sub">On Your First Order</p>
                            <Link href="/shop?category=combo" className="dayal-deal-action-btn">
                                <span>Explore Combos</span>
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>

                        {/* Deal 4: Free Delivery */}
                        <div className="dayal-shop-deal-card is-coupon-card">
                            <div className="dayal-deal-icon">
                                <img src="/uploads/2026/09/Frame-130-2.svg" alt="" aria-hidden="true" />
                            </div>
                            <p className="dayal-deal-eyebrow">GET ON YOUR DOOR</p>
                            <h3 className="dayal-deal-title">Free delivery</h3>
                            <p className="dayal-deal-sub">On Order Above</p>
                            <div className="dayal-deal-highlight-val">&#8377; 999</div>
                            <Link href="/shop" className="dayal-deal-action-btn">
                                <span>Order now</span>
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>

                        {/* Deal 5: Coming Soon */}
                        <div className="dayal-shop-deal-card is-coming-soon">
                            <div className="dayal-deal-icon">
                                <img src="/uploads/2026/09/Frame-130-3.svg" alt="" aria-hidden="true" />
                            </div>
                            <p className="dayal-deal-eyebrow">Festival Sale</p>
                            <h3 className="dayal-deal-title">Coming Soon</h3>
                            <button type="button" className="dayal-deal-action-btn is-outlined">
                                Stay Tuned
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. QR TABLE ORDERING SECTION */}
            <section className="dayal-shop-qr-section oto-qr-order-section" aria-label="Book Your Table Online">
                {/* QR CODE CARD */}
                <div className="dayal-shop-qr-card oto-qr-code-card">
                    <span className="oto-qr-badge">SCAN TO BOOK TABLE</span>
                    <img
                        src="/uploads/2026/09/image-305.png"
                        alt="Scan QR code to view dining menu"
                        className="dayal-shop-qr-img oto-qr-image"
                        loading="lazy"
                    />
                    <p>
                        Scan the QR code to view<br />
                        <strong>our in-store dining menu</strong>
                    </p>
                </div>

                {/* CONTENT AREA */}
                <div className="dayal-shop-qr-content oto-qr-content">
                    <div className="dayal-shop-qr-row oto-qr-heading-row">
                        <div className="oto-qr-heading-content">
                            <span className="oto-qr-eyebrow">— BOOK YOUR TABLE —</span>
                            <h2>
                                Skip The Wait, <span>Order Instantly</span>
                            </h2>
                            <p className="oto-qr-description">
                                Scan the QR code to explore our full menu, place your order and get it delivered fresh to your doorstep.
                            </p>
                            <p className="oto-qr-subheading">Just Follow these steps:</p>
                        </div>

                        {/* WHATSAPP ORDER BOX */}
                        <div className="dayal-shop-qr-whatsapp oto-qr-whatsapp-box">
                            <span>Order by WhatsApp</span>
                            <a
                                href="https://wa.me/919876543210"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="oto-qr-whatsapp-button"
                            >
                                <span className="oto-whatsapp-icon">
                                    <img src="/uploads/2026/09/WhatsAppIcon.png" alt="" className="oto-image" />
                                </span>
                                <span>+91 98765 43210</span>
                            </a>
                            <small>We're Open</small>
                            <strong>8:00 AM to 9:00PM</strong>
                            <small>Everyday</small>
                        </div>
                    </div>

                    {/* 4 ORDERING STEPS */}
                    <div className="dayal-shop-qr-steps oto-qr-steps">
                        {qrSteps.map((step, idx) => (
                            <React.Fragment key={step.num}>
                                <div className="oto-qr-step">
                                    <div className="oto-qr-step-icon">
                                        <img src={step.icon} alt="" />
                                    </div>
                                    <div className="oto-qr-step-text">
                                        <h4>{step.title}</h4>
                                        <p>{step.desc}</p>
                                    </div>
                                </div>
                                {idx < qrSteps.length - 1 && (
                                    <span className="oto-qr-arrow" aria-hidden="true">→</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Decorative background mandalas */}
                <img
                    src="/uploads/2026/09/decorative-golden-mandala-white-background-2.png"
                    alt=""
                    className="decorative-img"
                    aria-hidden="true"
                />
            </section>

            {/* Global Footer (includes Call To Action banner with Counter Image) */}
            <Footer />
        </div>
    );
}
