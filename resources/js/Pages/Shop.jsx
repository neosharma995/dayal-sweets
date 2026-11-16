import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ProductCard from '@/Components/ProductCard';

// Dummy Shop Products spanning all categories
const initialShopProducts = [
    {
        id: 1,
        name: 'Marwadi Ladoo',
        category: 'SWEETS',
        categorySlug: 'sweets',
        slug: 'marwadi-ladoo',
        badge: 'BEST SELLER',
        description: 'Traditional Rajasthani Marwadi Ladoo prepared with pure desi ghee and premium ingredients, offering an authentic rich taste in every bite.',
        image: '/uploads/2026/07/Marwadi-ladoo.avif',
        price: 'From ₹120.00',
        rating: 5,
        ratingCount: 18,
        tags: ['Diwali', 'Wedding Collection'],
        diet: 'Vegetarian',
        variations: [
            { label: '250g', price: 120 },
            { label: '500g', price: 240 },
            { label: '1kg', price: 480 },
        ],
    },
    {
        id: 2,
        name: 'Brownies',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'brownies',
        badge: 'POPULAR',
        description: 'Rich, moist, and fudgy brownies made with premium chocolate, freshly baked to deliver an irresistible treat for every chocolate lover.',
        image: '/uploads/2026/07/Brownies-768x512.jpg',
        price: 'From ₹70.00',
        rating: 4.8,
        ratingCount: 14,
        tags: ['Birthday'],
        diet: 'Vegetarian',
        variations: [
            { label: '1 Piece', price: 70 },
            { label: '2 Pieces', price: 140 },
            { label: '4 Pieces', price: 280 },
        ],
    },
    {
        id: 3,
        name: 'Office Tea Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'office-tea-combo',
        badge: 'COMBO',
        description: 'Brighten up your workday with our Office Tea Combo — a perfect pairing of refreshing tea and delicious snacks.',
        image: '/uploads/2026/09/Office-Tea-Combo-600x450.png',
        price: 150,
        rating: 4.5,
        ratingCount: 9,
        tags: ['Corporate Gifting'],
        diet: 'Vegetarian',
        variations: [],
    },
    {
        id: 4,
        name: 'Donuts',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'donuts',
        badge: 'FRESH',
        description: 'Soft, fluffy, and freshly baked donuts topped with delicious glazes and delightful flavors, making them the perfect treat for every occasion.',
        image: '/uploads/2026/07/Donuts-600x750.jpg',
        price: 'From ₹60.00',
        rating: 4.7,
        ratingCount: 11,
        tags: ['Birthday'],
        diet: 'Vegetarian',
        variations: [
            { label: '1 Piece', price: 60 },
            { label: '2 Pieces', price: 120 },
            { label: '4 Pieces', price: 240 },
        ],
    },
    {
        id: 5,
        name: 'Garlic Bread',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'garlic-bread',
        badge: 'HOT',
        description: 'Freshly baked artisanal bread infused with rich garlic butter and herbs, crispy on the outside and wonderfully soft inside.',
        image: '/uploads/2026/07/Garlic-Bread-600x800.jpg',
        price: 'From ₹80.00',
        rating: 4.6,
        ratingCount: 8,
        tags: [],
        diet: 'Vegetarian',
        variations: [
            { label: '2 Pieces', price: 80 },
            { label: '4 Pieces', price: 150 },
        ],
    },
    {
        id: 6,
        name: 'Dhokla',
        category: 'SNACKS',
        categorySlug: 'snacks',
        slug: 'dhokla',
        badge: 'FRESH',
        description: 'Light, spongy, and mildly spiced fermented snack tempered with mustard seeds and curry leaves, served fresh with tangy chutney.',
        image: '/uploads/2026/07/Dhokla-768x562.jpg',
        price: 'From ₹50.00',
        rating: 4.9,
        ratingCount: 22,
        tags: ['Holi'],
        diet: 'Vegetarian',
        variations: [
            { label: '250g', price: 50 },
            { label: '500g', price: 95 },
            { label: '1kg', price: 180 },
        ],
    },
    {
        id: 7,
        name: 'Puff Patties',
        category: 'SNACKS',
        categorySlug: 'snacks',
        slug: 'puff-patties',
        badge: 'CRISPY',
        description: 'Golden-crusted, flaky puff pastry generously packed with a savory spiced potato and pea filling.',
        image: '/uploads/2026/07/Puff-Patties-600x900.jpg',
        price: 'From ₹30.00',
        rating: 4.5,
        ratingCount: 16,
        tags: [],
        diet: 'Vegetarian',
        variations: [
            { label: '1 Piece', price: 30 },
            { label: '2 Pieces', price: 55 },
        ],
    },
    {
        id: 8,
        name: 'Cakes',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'cakes',
        badge: 'CUSTOM',
        description: 'Exquisite, multi-layered celebration cakes baked to perfection with fresh cream, premium chocolates, and natural fruit purees.',
        image: '/uploads/2026/07/Cakes-768x512.jpg',
        price: 'From ₹450.00',
        rating: 5,
        ratingCount: 34,
        tags: ['Birthday', 'Anniversary'],
        diet: 'Vegetarian',
        variations: [
            { label: '500g', price: 450 },
            { label: '1kg', price: 850 },
        ],
    },
    {
        id: 9,
        name: 'Birthday Party Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'birthday-party-combo',
        badge: 'PARTY PACK',
        description: 'Complete celebration combo packed with cake, assorted savoury snacks, and premium handcrafted sweets to make every birthday memorable.',
        image: '/uploads/2026/09/Birthday-Party-Combo-600x400.png',
        price: 999,
        rating: 4.9,
        ratingCount: 15,
        tags: ['Birthday'],
        diet: 'Vegetarian',
        variations: [],
    },
    {
        id: 10,
        name: 'Engagement Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'engagement-combo',
        badge: 'SPECIAL',
        description: 'Royal assortment of signature dry fruit sweets and celebration packs created specially for engagements and auspicious milestones.',
        image: '/uploads/2026/09/Engagement-Combo-600x400.png',
        price: 1499,
        rating: 5,
        ratingCount: 20,
        tags: ['Wedding Collection'],
        diet: 'Vegetarian',
        variations: [],
    },
    {
        id: 11,
        name: 'Gulab Jamun',
        category: 'SWEETS',
        categorySlug: 'sweets',
        slug: 'gulab-jamun',
        badge: 'BEST SELLER',
        description: 'Soft, melt-in-the-mouth khoya dumplings soaked in fragrant cardamom and saffron infused sugar syrup.',
        image: '/uploads/2026/07/Image-Gulab-Jamun.png',
        price: 'From ₹110.00',
        rating: 5,
        ratingCount: 40,
        tags: ['Diwali', 'Raksha Bandhan'],
        diet: 'Vegetarian',
        variations: [
            { label: '250g', price: 110 },
            { label: '500g', price: 220 },
            { label: '1kg', price: 420 },
        ],
    },
    {
        id: 12,
        name: 'Signature Namkeen',
        category: 'NAMKEEN',
        categorySlug: 'namkeen',
        slug: 'signature-namkeen',
        badge: 'CRUNCHY',
        description: 'Crisp and savoury handcrafted namkeen blend spiced with traditional Himachali herbs and roasted spices.',
        image: '/uploads/2026/07/Image-Namkeen.png',
        price: 'From ₹80.00',
        rating: 4.8,
        ratingCount: 25,
        tags: ['Holi'],
        diet: 'Vegetarian',
        variations: [
            { label: '200g', price: 80 },
            { label: '400g', price: 155 },
        ],
    },
];

const categoryList = [
    { name: 'Sweets', slug: 'sweets', count: 42 },
    { name: 'Bakery', slug: 'bakery', count: 24 },
    { name: 'Snacks', slug: 'snacks', count: 18 },
    { name: 'Combo', slug: 'combo', count: 6 },
    { name: 'Namkeen', slug: 'namkeen', count: 14 },
    { name: 'Beverages', slug: 'beverages', count: 9 },
    { name: 'South Indian', slug: 'south-indian', count: 8 },
    { name: 'North Indian', slug: 'north-indian', count: 10 },
    { name: 'Gift Hampers', slug: 'gift-hampers', count: 16 },
];

const seasonalTags = [
    'Raksha Bandhan',
    'Diwali',
    'Holi',
    'Winter Specials',
    'Summer Specials',
    'Mango Specials',
    'Navratri',
    'Wedding Collection',
];

const occasionOptions = [
    'Birthday',
    'Wedding',
    'Anniversary',
    'Corporate Gifting',
    'Festival',
    'Family Celebration',
    'Housewarming',
];

const dietPreferences = [
    'Sugar Free',
    'Low Sugar',
    'Jain Friendly',
    'Vegan',
    'Gluten Free',
];

export default function Shop({ auth }) {
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

    // UI States
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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

    // Filter & Sort Logic
    const filteredProducts = useMemo(() => {
        return initialShopProducts.filter((product) => {
            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchName = product.name.toLowerCase().includes(q);
                const matchDesc = product.description?.toLowerCase().includes(q);
                const matchCat = product.category.toLowerCase().includes(q);
                if (!matchName && !matchDesc && !matchCat) return false;
            }

            // Categories
            if (selectedCats.length > 0 && !selectedCats.includes(product.categorySlug)) {
                return false;
            }

            // Seasonal Tag
            if (selectedTag && (!product.tags || !product.tags.includes(selectedTag))) {
                return false;
            }

            // Rating
            if (minRating > 0 && (product.rating || 0) < minRating) {
                return false;
            }

            return true;
        }).sort((a, b) => {
            const getPriceVal = (p) => {
                if (typeof p.price === 'number') return p.price;
                const m = String(p.price).match(/[\d.]+/);
                return m ? parseFloat(m[0]) : 0;
            };

            if (sortOption === 'price') {
                return getPriceVal(a) - getPriceVal(b);
            }
            if (sortOption === 'price-desc') {
                return getPriceVal(b) - getPriceVal(a);
            }
            if (sortOption === 'title') {
                return a.name.localeCompare(b.name);
            }
            if (sortOption === 'rating') {
                return (b.rating || 0) - (a.rating || 0);
            }
            return a.id - b.id; // Default newest / order
        });
    }, [searchQuery, selectedCats, selectedTag, sortOption, minRating]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const startCount = filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endCount = Math.min(currentPage * itemsPerPage, filteredProducts.length);

    return (
        <>
            <Head title="Shop - Traditional Indian Sweets & Savouries | Dayal Sweets" />

            <div className="dayal-site">
                <Header auth={auth} />

                <div className="dayal-sweets-shop oto-shop-container">
                    {/* 01. Hero Banner */}
                    <div className="dayal-shop-hero oto-shop-hero-wrapper">
                        <div className="dayal-shop-hero-inner oto-shop-hero-content">
                            <div className="dayal-shop-breadcrumb oto-breadcrumb">
                                <Link href="/">HOME</Link> &gt; <span>SHOP</span>
                            </div>
                            <h1>SWEETS &amp; SAVOURIES</h1>
                            <img
                                src="/uploads/2026/07/Group-2.png"
                                alt=""
                                className="dayal-shop-hero-arrow"
                            />
                            <p>Discover Every Festive Delight</p>
                        </div>
                    </div>

                    {/* 02. Shop Layout */}
                    <div className="dayal-shop-layout oto-shop-layout">
                        {/* Mobile Backdrop */}
                        <div
                            className={`dayal-shop-overlay oto-filter-overlay ${mobileSidebarOpen ? 'is-active active' : ''}`}
                            onClick={() => setMobileSidebarOpen(false)}
                        />

                        {/* Sidebar */}
                        <aside className={`dayal-shop-sidebar oto-shop-sidebar ${mobileSidebarOpen ? 'is-open open' : ''}`}>
                            <div className="dayal-shop-sidebar-header oto-sidebar-header">
                                <span>
                                    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 3H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M13 3H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M11 1V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M2 9H5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M9 9H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M7 7V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M2 15H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M14 15H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M12 13V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                    FILTERS
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        type="button"
                                        className="dayal-shop-clear-all oto-clear-filters-btn"
                                        onClick={handleClearAll}
                                    >
                                        &#8634; Clear All
                                    </button>
                                    <button
                                        type="button"
                                        className="dayal-shop-close-sidebar"
                                        onClick={() => setMobileSidebarOpen(false)}
                                        aria-label="Close filters"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* SEARCH PRODUCTS */}
                            <div className="dayal-shop-filter-group oto-filter-group">
                                <h4
                                    className="dayal-shop-filter-toggle oto-filter-toggle"
                                    onClick={() => toggleSection('search')}
                                >
                                    SEARCH PRODUCTS
                                    <span className={`dayal-shop-caret oto-caret ${collapsed.search ? 'is-rotated rotated' : ''}`}>
                                        <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </h4>
                                <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.search ? 'is-collapsed oto-collapsed' : ''}`}>
                                    <div className="dayal-shop-search-box oto-search-pill">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="7" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            placeholder="Search sweets, snacks, gifts..."
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                className="dayal-shop-search-clear oto-search-clear-btn"
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
                                <h4
                                    className="dayal-shop-filter-toggle oto-filter-toggle"
                                    onClick={() => toggleSection('sort')}
                                >
                                    SORT BY
                                    <span className={`dayal-shop-caret oto-caret ${collapsed.sort ? 'is-rotated rotated' : ''}`}>
                                        <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </h4>
                                <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.sort ? 'is-collapsed oto-collapsed' : ''}`}>
                                    <select
                                        className="dayal-shop-sort-select oto-sort-select"
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
                                <h4
                                    className="dayal-shop-filter-toggle oto-filter-toggle"
                                    onClick={() => toggleSection('categories')}
                                >
                                    CATEGORIES
                                    <span className={`dayal-shop-caret oto-caret ${collapsed.categories ? 'is-rotated rotated' : ''}`}>
                                        <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </h4>
                                <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.categories ? 'is-collapsed oto-collapsed' : ''}`}>
                                    <ul className="dayal-shop-cat-list oto-category-filter-list">
                                        {categoryList.map((cat) => (
                                            <li key={cat.slug} className="oto-cat-item">
                                                <label className="oto-filter-option">
                                                    <input
                                                        type="checkbox"
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
                                <h4
                                    className="dayal-shop-filter-toggle oto-filter-toggle"
                                    onClick={() => toggleSection('price')}
                                >
                                    PRICE RANGE
                                    <span className={`dayal-shop-caret oto-caret ${collapsed.price ? 'is-rotated rotated' : ''}`}>
                                        <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </h4>
                                <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.price ? 'is-collapsed oto-collapsed' : ''}`}>
                                    <div className="dayal-shop-price-values oto-price-values-row">
                                        <span>₹{minPrice}</span>
                                        <span>₹{maxPrice}</span>
                                    </div>
                                    <div className="dayal-shop-slider-track oto-range-slider">
                                        <div
                                            className="dayal-shop-slider-range oto-range-fill"
                                            style={{
                                                left: `${(minPrice / 5000) * 100}%`,
                                                right: `${100 - (maxPrice / 5000) * 100}%`,
                                            }}
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="5000"
                                            step="50"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 50))}
                                            className="oto-range-min"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="5000"
                                            step="50"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 50))}
                                            className="oto-range-max"
                                        />
                                    </div>
                                    <div className="dayal-shop-price-range-labels oto-price-range-labels">
                                        <span>₹0</span>
                                        <span>₹5000+</span>
                                    </div>
                                </div>
                            </div>

                            {/* SEASONAL MITHAI */}
                            <div className="dayal-shop-filter-group oto-filter-group">
                                <h4
                                    className="dayal-shop-filter-toggle oto-filter-toggle"
                                    onClick={() => toggleSection('seasonal')}
                                >
                                    SEASONAL MITHAI
                                    <span className={`dayal-shop-caret oto-caret ${collapsed.seasonal ? 'is-rotated rotated' : ''}`}>
                                        <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </h4>
                                <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.seasonal ? 'is-collapsed oto-collapsed' : ''}`}>
                                    <div className="dayal-shop-tags oto-tag-pills">
                                        {seasonalTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={`dayal-shop-tag-pill oto-tag-pill ${selectedTag === tag ? 'is-active active' : ''}`}
                                                onClick={() => handleTagClick(tag)}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* OCCASION */}
                            <div className="dayal-shop-filter-group oto-filter-group">
                                <h4
                                    className="dayal-shop-filter-toggle oto-filter-toggle"
                                    onClick={() => toggleSection('occasion')}
                                >
                                    OCCASION
                                    <span className={`dayal-shop-caret oto-caret ${collapsed.occasion ? 'is-rotated rotated' : ''}`}>
                                        <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </h4>
                                <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.occasion ? 'is-collapsed oto-collapsed' : ''}`}>
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
                                <h4
                                    className="dayal-shop-filter-toggle oto-filter-toggle"
                                    onClick={() => toggleSection('diet')}
                                >
                                    DIET PREFERENCE
                                    <span className={`dayal-shop-caret oto-caret ${collapsed.diet ? 'is-rotated rotated' : ''}`}>
                                        <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </h4>
                                <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.diet ? 'is-collapsed oto-collapsed' : ''}`}>
                                    <div className="dayal-shop-filter-options">
                                        {dietPreferences.map((diet) => (
                                            <label key={diet} className="oto-filter-option">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDiet.includes(diet)}
                                                    onChange={() => {
                                                        setSelectedDiet((prev) =>
                                                            prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
                                                        );
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
                                <h4
                                    className="dayal-shop-filter-toggle oto-filter-toggle"
                                    onClick={() => toggleSection('rating')}
                                >
                                    RATING
                                    <span className={`dayal-shop-caret oto-caret ${collapsed.rating ? 'is-rotated rotated' : ''}`}>
                                        <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </h4>
                                <div className={`dayal-shop-filter-content oto-filter-content ${collapsed.rating ? 'is-collapsed oto-collapsed' : ''}`}>
                                    <div className="dayal-shop-filter-options">
                                        {[5, 4, 3].map((stars) => (
                                            <label key={stars} className="oto-filter-option">
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    checked={minRating === stars}
                                                    onChange={() => setMinRating(stars)}
                                                />
                                                <span className="dayal-shop-stars oto-stars">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <svg
                                                            key={s}
                                                            viewBox="0 0 14 14"
                                                            fill={s <= stars ? '#E5A600' : '#D3D3D3'}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path d="M7 0L8.854 4.545L13.66 4.908L10 8.016L11.118 12.727L7 10.2L2.882 12.727L4 8.016L0.34 4.908L5.146 4.545L7 0Z" />
                                                        </svg>
                                                    ))}
                                                </span>
                                                {stars < 5 && <span className="dayal-shop-rating-label oto-rating-label">&amp; above</span>}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* APPLY BUTTON */}
                            <button
                                type="button"
                                className="dayal-shop-apply-btn oto-apply-price-btn"
                                onClick={() => {
                                    setMobileSidebarOpen(false);
                                    setCurrentPage(1);
                                }}
                            >
                                Apply Filters
                            </button>
                        </aside>

                        {/* 03. Main Shop Content */}
                        <main className="dayal-shop-main oto-shop-main">
                            <div className="dayal-shop-toolbar oto-shop-toolbar">
                                <div className="dayal-shop-results-count oto-results-count">
                                    Showing {startCount}–{endCount} of {filteredProducts.length} results
                                </div>

                                <button
                                    type="button"
                                    className="dayal-shop-filter-trigger oto-filter-toggle-btn"
                                    onClick={() => setMobileSidebarOpen(true)}
                                >
                                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    Filters
                                </button>
                            </div>

                            {/* Product Grid */}
                            {paginatedProducts.length > 0 ? (
                                <div className="dayal-shop-products-grid oto-products-grid oto-grid-cols-4">
                                    {paginatedProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={(p, qty, variation) => {
                                                console.log('Added to cart:', p.name, qty, variation);
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="dayal-shop-empty oto-no-products">
                                    <h3>No Products Found</h3>
                                    <p>Try clearing some filters or searching with different keywords.</p>
                                    <button
                                        type="button"
                                        className="dayal-shop-apply-btn"
                                        style={{ maxWidth: '200px', margin: '20px auto 0' }}
                                        onClick={handleClearAll}
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav className="dayal-shop-pagination oto-pagination" aria-label="Product catalog navigation">
                                    <button
                                        type="button"
                                        className={`dayal-shop-page-btn is-arrow oto-page-btn oto-page-arrow ${currentPage === 1 ? 'is-disabled oto-page-disabled' : ''}`}
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        aria-label="First page"
                                    >
                                        «
                                    </button>
                                    <button
                                        type="button"
                                        className={`dayal-shop-page-btn is-arrow oto-page-btn oto-page-arrow ${currentPage === 1 ? 'is-disabled oto-page-disabled' : ''}`}
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        aria-label="Previous page"
                                    >
                                        ‹
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            className={`dayal-shop-page-btn oto-page-btn ${currentPage === page ? 'is-active active' : ''}`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        className={`dayal-shop-page-btn is-arrow oto-page-btn oto-page-arrow ${currentPage === totalPages ? 'is-disabled oto-page-disabled' : ''}`}
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        aria-label="Next page"
                                    >
                                        ›
                                    </button>
                                    <button
                                        type="button"
                                        className={`dayal-shop-page-btn is-arrow oto-page-btn oto-page-arrow ${currentPage === totalPages ? 'is-disabled oto-page-disabled' : ''}`}
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
                </div>

                <Footer />
            </div>
        </>
    );
}
