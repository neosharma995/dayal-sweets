import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import ProductCard from '../ProductCard';
import Testimonials from '../Testimonials';
import Outlets from '../Outlets';
import Opportunities from '../Opportunities';
import { useCart } from '@/Context/CartContext';

const trustItems = [
    ['SINCE 1962', '60+ Years of Tradition', 'Frame-34.svg'],
    ['FRESH INGREDIENTS', 'Finest Quality Ingredients', 'Frame-34-1.svg'],
    ['HYGIENIC PREPARATION', 'Prepared With Care', 'Frame-34-2.svg'],
    ['FAST DELIVERY', 'Fresh To Your Doorstep', 'Frame-34-3.svg'],
];

const productCategories = [
    { name: 'Sweets', slug: 'sweets', description: 'Traditional sweet made with pure love and purity', image: '/uploads/2026/07/image-62.png' },
    { name: 'South Indian', slug: 'south-indian', description: 'Authentic Flavors, Southern Culinary Delights', image: '/uploads/2026/09/39de7fca-c160-4487-91ff-d2fe87b868cb.png' },
    { name: 'Snacks', slug: 'snacks', description: 'Hot, crispy and perfect to satisfy cravings', image: '/uploads/2026/07/image-58.png' },
    { name: 'North Indian', slug: 'north-indian', description: 'Rich Flavors, Timeless Traditions', image: '/uploads/2026/09/40acb6a2-6bfe-4f5f-b741-4fa56207df16.png' },
    { name: 'Namkeen', slug: 'namkeen', description: 'Crispy, crunchy and full of flavour', image: '/uploads/2026/07/d9d5fb317e661ab4dd3c92f437cdeafd61cbe426.webp' },
    { name: 'Bakery', slug: 'bakery', description: 'Freshly baked delights for every mood', image: '/uploads/2026/07/image-59.png' },
    { name: 'Beverages', slug: 'beverages', description: 'Refreshing drinks crafted to quench your thirst and complement every meal.', image: '/uploads/2026/07/images__1_-removebg-preview.png' },
    { name: 'Best Seller', slug: 'best-seller', description: 'Customer favorites loved for their exceptional taste and quality.', image: '/uploads/woocommerce-placeholder.webp' },
    { name: 'Gift hampers', slug: 'gift-hampers', description: 'Thoughtfully Curated Gifts for Every Occasion', image: '/uploads/2026/08/Gift-Hamper-img.png' },
    { name: 'Himachali Special', slug: 'himachali-special', description: 'Authentic Himachali Flavors, Made with Love', image: '/uploads/2026/09/c18eaaf3-39b9-4392-9f9a-0c9f0dafec86.png' },
    { name: 'Chinese', slug: 'chinese', description: 'Delicious Flavors, Asian-Inspired Delights', image: '/uploads/2026/09/a4a43e59-a217-42d7-8117-5f654e1660fd.png' },
    { name: 'Desserts', slug: 'desserts', description: 'Sweet Treats, Pure Happiness', image: '/uploads/2026/09/310f8065-fcb6-4b1f-ad85-2d3ec7b64a70.png' },
];

function CategorySlider({ categories = [] }) {
    const activeCategories = categories && categories.length > 0 && categories.some((c) => c.image)
        ? categories
        : productCategories;
    const viewportRef = useRef(null);
    const trackRef = useRef(null);
    const progressTrackRef = useRef(null);
    const dragRef = useRef(null);
    const progressDragRef = useRef(null);
    const [progress, setProgress] = useState({ width: 0, left: 0, enabled: false, atStart: true, atEnd: true });

    useEffect(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return undefined;

        const refresh = () => {
            const scrollable = track.scrollWidth - viewport.clientWidth;
            const visibleRatio = track.scrollWidth ? viewport.clientWidth / track.scrollWidth : 1;
            const progressWidth = progressTrackRef.current?.clientWidth ?? 0;
            const thumbWidth = Math.max(progressWidth * visibleRatio, 30);
            const progressRatio = scrollable > 0 ? viewport.scrollLeft / scrollable : 0;
            setProgress({
                width: scrollable > 0 ? thumbWidth : 0,
                left: scrollable > 0 ? progressRatio * (progressWidth - thumbWidth) : 0,
                enabled: scrollable > 2,
                atStart: viewport.scrollLeft <= 2,
                atEnd: viewport.scrollLeft + viewport.clientWidth >= track.scrollWidth - 2,
            });
        };

        refresh();
        viewport.addEventListener('scroll', refresh, { passive: true });
        window.addEventListener('resize', refresh);
        window.addEventListener('load', refresh);
        const observer = new ResizeObserver(refresh);
        observer.observe(viewport);
        observer.observe(track);
        if (progressTrackRef.current) observer.observe(progressTrackRef.current);

        const moveThumb = (event) => {
            const drag = progressDragRef.current;
            if (!drag) return;
            const x = event.touches?.[0]?.pageX ?? event.pageX;
            const scrollable = track.scrollWidth - viewport.clientWidth;
            const progressWidth = progressTrackRef.current?.clientWidth ?? 0;
            const visibleRatio = track.scrollWidth ? viewport.clientWidth / track.scrollWidth : 1;
            const thumbWidth = Math.max(progressWidth * visibleRatio, 30);
            const maxThumbLeft = progressWidth - thumbWidth;
            if (maxThumbLeft <= 0) return;
            viewport.scrollLeft = drag.scrollLeft + ((x - drag.x) / maxThumbLeft) * scrollable;
        };
        const stopThumbDrag = () => {
            if (!progressDragRef.current) return;
            progressDragRef.current = null;
            document.body.style.userSelect = '';
        };
        document.addEventListener('mousemove', moveThumb);
        document.addEventListener('mouseup', stopThumbDrag);
        document.addEventListener('touchmove', moveThumb, { passive: true });
        document.addEventListener('touchend', stopThumbDrag);

        return () => {
            viewport.removeEventListener('scroll', refresh);
            window.removeEventListener('resize', refresh);
            window.removeEventListener('load', refresh);
            document.removeEventListener('mousemove', moveThumb);
            document.removeEventListener('mouseup', stopThumbDrag);
            document.removeEventListener('touchmove', moveThumb);
            document.removeEventListener('touchend', stopThumbDrag);
            observer.disconnect();
        };
    }, [progress.enabled]);

    const scrollByCard = (direction) => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        const card = track?.querySelector('.dayal-category-card');
        if (!viewport || !track || !card) return;
        const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
        viewport.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    };

    const handleMouseDown = (event) => {
        if (event.button !== 0) return;
        const viewport = viewportRef.current;
        dragRef.current = { x: event.pageX - viewport.offsetLeft, left: viewport.scrollLeft };
        viewport.style.scrollBehavior = 'auto';
        viewport.style.cursor = 'grabbing';
    };
    const handleMouseMove = (event) => {
        if (!dragRef.current) return;
        event.preventDefault();
        const viewport = viewportRef.current;
        const x = event.pageX - viewport.offsetLeft;
        viewport.scrollLeft = dragRef.current.left - (x - dragRef.current.x) * 1.5;
    };
    const stopMouseDrag = () => {
        if (!dragRef.current || !viewportRef.current) return;
        dragRef.current = null;
        viewportRef.current.style.cursor = '';
        viewportRef.current.style.scrollBehavior = 'smooth';
    };
    const startThumbDrag = (event) => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const x = event.touches?.[0]?.pageX ?? event.pageX;
        progressDragRef.current = { x, scrollLeft: viewport.scrollLeft };
        document.body.style.userSelect = 'none';
    };

    return (
        <section className="dayal-home-category" aria-label="Shop by category">
            <img className="dayal-home-category-decoration" src="/uploads/2026/07/image-48-1.png" alt="" />
            <header className="dayal-home-category-heading">
                <div><i aria-hidden="true" /><p>what would you like today</p><i aria-hidden="true" /></div>
                <span aria-hidden="true">DELIGHTS</span>
            </header>
            <div className="dayal-home-category-widget">
                <div className="dayal-category-wrapper">
                    <div
                        className="dayal-category-viewport"
                        ref={viewportRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={stopMouseDrag}
                        onMouseLeave={stopMouseDrag}
                    >
                        <div className="dayal-category-track" ref={trackRef}>
                            {activeCategories.map((category) => (
                                <article className="dayal-category-card" key={category.slug}>
                                    <Link className="dayal-category-image" href={`/shop?cats=${category.slug}`}>
                                        <img src={category.image} alt={category.name} loading="lazy" draggable="false" />
                                    </Link>
                                    <div className="dayal-category-diamond" aria-hidden="true"><img src="/uploads/2026/08/flower.png" alt="" /></div>
                                    <h3>{category.name}</h3>
                                    <p>{category.description}</p>
                                    <Link className="dayal-category-link" href={`/shop?cats=${category.slug}`}>
                                        Order Now <img src="/uploads/2026/07/Icon-4.png" alt="" />
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                    {progress.enabled && <div className="dayal-category-controls">
                        <button type="button" aria-label="Previous categories" className={progress.atStart ? 'is-disabled' : ''} onClick={() => scrollByCard(-1)}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="dayal-category-progress" ref={progressTrackRef}><span onMouseDown={startThumbDrag} onTouchStart={startThumbDrag} style={{ width: `${progress.width}px`, left: `${progress.left}px` }} /></div>
                        <button type="button" aria-label="Next categories" className={progress.atEnd ? 'is-disabled' : ''} onClick={() => scrollByCard(1)}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>}
                </div>
            </div>
        </section>
    );
}

const processSteps = [
    {
        number: '01',
        image: 'Frame-81.svg',
        title: 'Fresh Milk Selection',
        description: 'Fresh milk sourced daily from trusted farms. Carefully selected for purity and richness.',
    },
    {
        number: '02',
        image: 'image-196.svg',
        title: 'Traditional Preparation',
        description: 'Time-honoured recipes passed through generations. Prepared by skilled halwais with dedication.',
    },
    {
        number: '03',
        image: 'image-197.svg',
        title: 'Slow Cooking Process',
        description: 'Slow-cooked to develop rich flavour and perfect texture. Patience and tradition bring every batch to life.',
    },
    {
        number: '04',
        image: 'image-199.svg',
        title: 'Quality & Hygiene',
        description: 'Every sweet is carefully inspected for quality and freshness. Prepared under strict hygiene standards.',
    },
    {
        number: '05',
        image: 'image-198.svg',
        title: 'Packaging & Delivery',
        description: 'Packed with care to preserve taste, freshness and quality. Ready to delight every celebration.',
    },
];

const heroCommitments = [
    ['Fast Delivery', 'Container-4.svg'],
    ['Trusted by Thousands', 'Container-5.svg'],
    ['Pure & Fresh', 'Container-6.svg'],
    ['Hygienic Kitchen', 'Container-7.svg'],
];

export function HeroCommitments() {
    return (
        <div className="dayal-home-hero-line" aria-label="Dayal Sweets service qualities">
            {heroCommitments.map(([label, icon]) => (
                <div className="dayal-home-hero-line-item" key={label}>
                    <img src={`/uploads/2026/07/${icon}`} alt="" />
                    <span>{label}</span>
                </div>
            ))}
        </div>
    );
}

const launchBanners = [
    {
        id: 'blue-bottle',
        tag: 'New Arrival',
        tagClass: 'dayal-home-launch-tag-bottle',
        title: 'Blue Bottle',
        subtitle: 'Pure Himalayan Drinking Water',
        description: 'Naturally purified and enriched with essential minerals for a refreshing and healthy lifestyle.',
        desktopProduct: '/uploads/2026/09/a351fcd017b6d21208fd17488591d4da0a6e675b-e1789536890762.png',
        mobileProduct: '/uploads/2026/07/image-216.avif',
        bulletPoints: [
            'Available in 500ml & 1L',
            'Chilled & Ready to Drink',
        ],
        features: [
            { icon: '/uploads/2026/07/Frame-86.svg', title: 'Pure & safe\ningredients' },
            { icon: '/uploads/2026/07/Frame-88.svg', title: 'Fresh From\nHimalayas' },
            { icon: '/uploads/2026/07/Frame-89.svg', title: 'No Added \nPreservatives' },
            { icon: '/uploads/2026/07/Frame-90.svg', title: 'Trusted \nQuality' },
        ],
        buttonText: 'Shop Now',
        buttonUrl: '/shop',
        outletText: 'Available at all outlets',
    },
    {
        id: 'blueberry-cake',
        tag: 'Premium Cake',
        tagClass: 'dayal-home-launch-tag-cake',
        title: 'Blueberry Cake',
        subtitle: 'Crafted For Every Celebration',
        description: 'A rich blend of creamy cheesecake and handpicked blueberries, finished with a smooth, indulgent texture.',
        desktopProduct: '/uploads/2026/09/318d6fa899e1eae6f78c3e1dfe6897110110cec2-e1789538227876.png',
        mobileProduct: '/uploads/2026/09/cake-mobile.png',
        bulletPoints: null,
        features: [
            { icon: '/uploads/2026/07/Frame-86-1.svg', title: 'Real \nBlueberries' },
            { icon: '/uploads/2026/07/Frame-88-1.svg', title: 'Soft & Rich\nCream' },
            { icon: '/uploads/2026/07/Frame-89-1.svg', title: 'No Added \nPreservatives' },
            { icon: '/uploads/2026/07/Frame-90-1.svg', title: 'Trusted \nQuality' },
        ],
        buttonText: 'Order Now',
        buttonUrl: '/shop',
        outletText: null,
    },
];

const bestSellers = [
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
        badge: 'BEST SELLER',
        description: 'Rich, moist, and fudgy brownies made with premium chocolate, freshly baked to deliver an irresistible treat for every chocolate lover.',
        image: '/uploads/2026/07/Brownies-768x512.jpg',
        price: 'From ₹70.00',
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
        badge: 'BEST SELLER',
        description: 'Brighten up your workday with our Office Tea Combo — a perfect pairing of refreshing tea and delicious snacks.',
        image: '/uploads/2026/09/Office-Tea-Combo-600x450.png',
        price: 150,
        variations: [],
    },
    {
        id: 4,
        name: 'Donuts',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'donuts',
        badge: 'BEST SELLER',
        description: 'Soft, fluffy, and freshly baked donuts topped with delicious glazes and delightful flavors, making them the perfect treat for every occasion.',
        image: '/uploads/2026/07/Donuts-600x750.jpg',
        price: 'From ₹60.00',
        variations: [
            { label: '1 Piece', price: 60 },
            { label: '2 Pieces', price: 120 },
            { label: '4 Pieces', price: 240 },
        ],
    },
    {
        id: 5,
        name: 'Engagement Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'engagement-combo',
        badge: 'BEST SELLER',
        description: 'Celebrate your special day with our Engagement Combo, featuring a delightful selection of delicious favorites perfect for your celebration.',
        image: '/uploads/2026/09/Engagement-Combo-600x400.png',
        price: 250,
        variations: [],
    },
    {
        id: 6,
        name: 'Birthday Party Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'birthday-party-combo',
        badge: 'BEST SELLER',
        description: 'Make every birthday celebration extra special with our Birthday Party Combo! A delicious selection of crowd-pleasing favorites.',
        image: '/uploads/2026/09/Birthday-Party-Combo-600x400.png',
        price: 200,
        variations: [],
    },
    {
        id: 7,
        name: 'Puff Patties',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'puff-patties',
        badge: 'BEST SELLER',
        description: 'Crispy, flaky Puff Patties filled with a delicious savory stuffing, freshly baked to golden perfection for a flavorful and satisfying bite.',
        image: '/uploads/2026/07/Puff-Patties-600x900.jpg',
        price: 'From ₹40.00',
        variations: [
            { label: '1 Piece', price: 40 },
            { label: '2 Pieces', price: 80 },
            { label: '4 Pieces', price: 160 },
        ],
    },
    {
        id: 8,
        name: 'Garlic Bread',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'garlic-bread',
        badge: 'BEST SELLER',
        description: 'Freshly baked Garlic Bread with a crispy crust, soft center, buttery garlic, and aromatic herbs, perfect as a savory snack.',
        image: '/uploads/2026/07/Garlic-Bread-600x800.jpg',
        price: 'From ₹80.00',
        variations: [
            { label: '2 Pieces', price: 80 },
            { label: '4 Pieces', price: 160 },
            { label: '6 Pieces', price: 240 },
        ],
    },
    {
        id: 9,
        name: 'Cakes',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'cakes',
        badge: 'BEST SELLER',
        description: 'Freshly baked cakes crafted with premium ingredients, offering a soft texture, rich flavor, and perfect sweetness for birthdays.',
        image: '/uploads/2026/07/Cakes-768x512.jpg',
        price: 'From ₹450.00',
        variations: [
            { label: '500g', price: 450 },
            { label: '1kg', price: 900 },
            { label: '2kg', price: 1800 },
        ],
    },
    {
        id: 10,
        name: 'Dhokla',
        category: 'SNACKS',
        categorySlug: 'snacks',
        slug: 'dhokla',
        badge: 'BEST SELLER',
        description: 'Soft, fluffy, and freshly prepared Dhokla made from premium gram flour, offering a light, healthy, and flavorful snack.',
        image: '/uploads/2026/07/Dhokla-768x562.jpg',
        price: 'From ₹70.00',
        variations: [
            { label: '250g', price: 70 },
            { label: '500g', price: 140 },
            { label: '1kg', price: 280 },
        ],
    },
];

const serviceCards = [
    { title: 'Festival Gifting', description: 'Luxury sweet hampers, festive gift boxes, and curated collections crafted to make every celebration memorable.', points: ['Premium Gift Hampers', 'Corporate Gifting', 'Custom Packaging', 'Bulk Festival Orders'], action: 'Explore Collection', href: '/shop', image: '85febe95b2f68483bbe3d2740da348076827bcea.png', background: '1-1.png', icon: 'gift-2.png' },
    { title: 'Catering', description: 'From intimate family functions to grand celebrations, enjoy authentic flavours and impeccable service.', points: ['Live Food Counters', 'Wedding Catering', 'Corporate Events', 'Customized Menus'], action: 'Request Quote', href: '/contact-us', image: 'cafbdb05b860e369184358b6c53ff29ec6bd4ef1.png', background: '2.png', icon: 'dish-01.png' },
    { title: 'Wedding', description: 'Beautifully curated mithai collections, luxury packaging, and bespoke wedding gifting solutions.', points: ['Premium Wedding Sweets', 'Luxury Packaging', 'Bulk Orders', 'Timely Delivery'], action: 'Request Quote', href: '/contact-us', image: '1e042ce16b4adfb2ec672c88677de25f8e161238.png', background: '3.png', icon: 'wedding.png' },
    { title: 'Birthday', description: 'Designer cakes, party desserts, and handcrafted treats made to make birthdays unforgettable.', points: ['Custom Celebration Cakes', 'Theme-Based Desserts', 'Fresh Daily Preparation', 'Doorstep Delivery'], action: 'Order Cakes', href: '/shop', image: '1208e29127df94840c76deb4a669846d282b099a.png', background: '4.png', icon: 'elements.png' },
];

const videos = [
    ['Festive Sweet Preparation', 'Fresh ingredients and traditional recipes come together for every celebration.'],
    ['Traditional Sweet Making', 'Time-honored techniques bring authentic Dayal sweets to life.'],
    ['Diwali festival', 'enjoying purchasing with friends and colleagues in dayal sweets'],
    ['Festival Gift Platters', 'Bespoke gifting for every celebration'],
    ['Jalebi Frying Fresh', 'Fried fresh every morning, served warm'],
    ['Khoya Pedas Magic', '100% desi ghee, Pure milk, no preservatives'],
    ['Spounch', 'Each peda shaped by hand, one at a time'],
    ['Slow Cooking Tradition', 'Traditional wood-fire methods since 1952'],
    ['Kaju katli', '100% cashew, no preservatives, pure silver vark'],
    ['Fresh Milk Poured Daily', 'Pure A2 milk sourced fresh every morning'],
];

function SectionHeading({ eyebrow, children }) {
    return <header className="dayal-home-section-heading"><p>{eyebrow}</p><h2>{children}</h2></header>;
}

function BestSellers({ products = [], categories = [] }) {
    const { addToCart } = useCart();

    const fallbackFilters = [
        'All', 'Bakery', 'Best Seller', 'Beverages', 'Chinese', 'Combo', 'Desserts',
        'Gift hampers', 'Himachali Special', 'Namkeen', 'North Indian', 'Snacks',
        'South Indian', 'Sweets'
    ];

    const filters = categories && categories.length > 0
        ? ['All', ...categories.map((c) => c.name)]
        : fallbackFilters;

    const [selected, setSelected] = useState('All');

    const displayProducts = products && products.length > 0 ? products : bestSellers;

    const filteredProducts = selected === 'All'
        ? displayProducts
        : selected.toLowerCase() === 'best seller'
            ? displayProducts.filter((p) => (p.badge && p.badge.toUpperCase() === 'BEST SELLER') || (p.category && p.category.toLowerCase().includes('best seller')))
            : displayProducts.filter((product) => {
                const cat = (product.category || '').toLowerCase();
                const slug = (product.categorySlug || '').toLowerCase();
                const sel = selected.toLowerCase();
                return cat === sel || slug === sel || cat.includes(sel) || sel.includes(cat);
            });

    const visibleProducts = filteredProducts.slice(0, 10);

    const handleAddToCart = (product, qty, variation) => {
        // Add to cart with openDrawer = false: only add item, do not show the cart drawer
        addToCart(product, qty, variation, false);
    };

    return (
        <section className="dayal-home-bestsellers dayal-best-sellers-section">
            <div className="dayal-home-bestsellers-inner dayal-best-sellers-wrapper">
                <header className="dayal-best-sellers-header">
                    <div className="dayal-best-sellers-title-box">
                        <span className="dayal-best-sellers-subtitle">— MOST LOVED BY OUR CUSTOMERS —</span>
                        <h2 className="dayal-best-sellers-title">
                            Our Best <span className="dayal-bs-highlight">Sellers</span>
                        </h2>
                    </div>
                    <div className="dayal-best-sellers-filter-bar" role="tablist" aria-label="Product categories">
                        {filters.map((filter) => (
                            <button
                                type="button"
                                className={`dayal-bs-pill ${selected === filter ? 'active' : ''}`}
                                key={filter}
                                onClick={() => setSelected(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="dayal-products-grid dayal-grid-cols-5 dayal-best-sellers-grid">
                    {visibleProducts.length > 0 ? (
                        visibleProducts.map((product) => (
                            <ProductCard
                                key={product.id || product.name}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))
                    ) : (
                        <div className="dayal-bs-filter-no-products" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 15px', color: '#7A6355' }}>
                            No products available in this category.
                        </div>
                    )}
                </div>

                <div className="dayal-home-view-all-wrapper">
                    <Link className="dayal-home-view-all" href="/shop">
                        <span>VIEW ALL</span>
                        <svg aria-hidden="true" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function SpecialServices() {
    return (
        <section className="dayal-home-services" aria-label="Our Support - Special Services">
            {/* Left Decorative Image (bg221.png) */}
            <img
                src="/uploads/2026/09/bg221.png"
                alt=""
                className="dayal-home-services-decor-left"
                aria-hidden="true"
                loading="lazy"
            />

            {/* Right Decorative Image (ChatGPT-Image-Sep-7-2026-07_03_53-PM-e1788788084617.png) */}
            <img
                src="/uploads/2026/09/ChatGPT-Image-Sep-7-2026-07_03_53-PM-e1788788084617.png"
                alt=""
                className="dayal-home-services-decor-right"
                aria-hidden="true"
                loading="lazy"
            />

            <div className="dayal-home-services-inner">
                {/* Section Header */}
                <header className="dayal-home-services-header">
                    <div className="dayal-home-services-eyebrow-wrap">
                        <span className="dayal-home-services-divider" aria-hidden="true" />
                        <p className="dayal-home-services-eyebrow">OUR SUPPORT</p>
                        <span className="dayal-home-services-divider" aria-hidden="true" />
                    </div>
                    <h2 className="dayal-home-services-heading">
                        Special <span className="dayal-highlight">Services</span>
                    </h2>
                    <p className="dayal-home-services-desc">
                        Every celebration deserves something extraordinary. Discover our signature services, crafted with timeless recipes, premium ingredients, and generations of sweet-making excellence.
                    </p>
                </header>

                {/* Service Cards Slider / Grid */}
                <div className="dayal-home-services-grid">
                    {serviceCards.map((service, index) => (
                        <article
                            key={service.title}
                            className={`dayal-home-service-card ${index === 0 ? 'is-first-slide is-featured' : ''}`}
                            style={{ backgroundImage: `url('/uploads/2026/07/${service.background}')` }}
                        >
                            <div className="dayal-home-service-card-content">
                                <div className="dayal-home-service-card-main">
                                    {service.icon && (
                                        <div className="dayal-home-service-card-icon">
                                            <img
                                                src={`/uploads/2026/07/${service.icon}`}
                                                alt=""
                                                aria-hidden="true"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <h3 className="dayal-home-service-card-title">{service.title}</h3>
                                </div>

                                <div className="dayal-home-service-card-desc">
                                    <p>{service.description}</p>
                                </div>

                                <ul className="dayal-home-service-card-points">
                                    {service.points.map((point) => (
                                        <li key={point}>{point}</li>
                                    ))}
                                </ul>

                                <Link className="dayal-home-service-card-btn" href={service.href}>
                                    <span>{service.action}</span>
                                    <img
                                        src="/uploads/2026/07/Icon.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </Link>
                            </div>

                            <div className="dayal-home-service-card-product">
                                <img
                                    src={`/uploads/2026/07/${service.image}`}
                                    alt={`${service.title} Product`}
                                    loading="lazy"
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function VideoGallery() {
    const sliderRef = useRef(null);
    const trackRef = useRef(null);
    const [playing, setPlaying] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);
    const [scrollProgress, setScrollProgress] = useState({ width: 20, left: 0 });

    const updateScrollProgress = () => {
        if (!sliderRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const ratio = scrollWidth ? clientWidth / scrollWidth : 0.2;
        const widthPercent = Math.max(ratio * 100, 15);
        const leftPercent = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - widthPercent) : 0;
        setScrollProgress({ width: widthPercent, left: leftPercent });
    };

    useEffect(() => {
        updateScrollProgress();
        window.addEventListener('resize', updateScrollProgress);
        return () => window.removeEventListener('resize', updateScrollProgress);
    }, []);

    const handleScroll = () => {
        updateScrollProgress();
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeftState(sliderRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        sliderRef.current.scrollLeft = scrollLeftState - walk;
    };

    const handleTrackClick = (e) => {
        if (!trackRef.current || !sliderRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
        const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
        sliderRef.current.scrollTo({
            left: clickRatio * maxScroll,
            behavior: 'smooth',
        });
    };

    const togglePlay = async (index) => {
        if (!sliderRef.current) return;
        const items = sliderRef.current.querySelectorAll('video');
        const targetVideo = items[index];
        if (!targetVideo) return;

        if (playing === index) {
            targetVideo.pause();
            setPlaying(null);
        } else {
            items.forEach((v) => v.pause());
            try {
                await targetVideo.play();
                setPlaying(index);
            } catch {
                setPlaying(null);
            }
        }
    };

    return (
        <section className="dsg-video-section dayal-home-video" aria-label="Watch the Making">
            <div className="dsg-video-header-container dayal-home-video-inner">
                <header className="dsg-video-header">
                    <div className="dsg-video-eyebrow-wrap">
                        <span className="dsg-video-divider" aria-hidden="true" />
                        <p className="dsg-video-eyebrow">WATCH THE MAKING</p>
                        <span className="dsg-video-divider" aria-hidden="true" />
                    </div>
                    <h2 className="dsg-video-heading">
                        The Art Behind <span className="dayal-highlight">Every Sweet Bite</span>
                    </h2>
                    <p className="dsg-video-desc-top">
                        From selecting the finest ingredients to handcrafted preparation and slow cooking, witness the journey that makes every Dayal sweet truly special.
                    </p>
                </header>
            </div>

            <div className="dsg-our-gallery dsg-video-gallery">
                <div
                    className={`dsg-video-slider ${isDragging ? 'dsg-dragging' : ''}`}
                    ref={sliderRef}
                    onScroll={handleScroll}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {videos.map(([title, description], index) => (
                        <div
                            className="dsg-video-item"
                            key={title}
                            onClick={() => togglePlay(index)}
                        >
                            <video
                                className="dsg-video-el"
                                src="/uploads/2026/07/dayal-sweets-showcase.mp4"
                                muted
                                loop
                                playsInline
                                preload="metadata"
                            />
                            <button
                                type="button"
                                className={`dsg-video-play ${playing === index ? 'is-playing' : ''}`}
                                aria-label={playing === index ? `Pause ${title}` : `Play ${title}`}
                            >
                                <span className="dsg-play-icon" aria-hidden="true">
                                    {playing === index ? '❚❚' : '►'}
                                </span>
                            </button>
                            <div className="dsg-video-info">
                                <h4 className="dsg-video-title">{title}</h4>
                                <p className="dsg-video-desc">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className="dsg-scrollbar-track"
                    ref={trackRef}
                    onClick={handleTrackClick}
                >
                    <div
                        className="dsg-scrollbar-thumb"
                        style={{
                            width: `${scrollProgress.width}%`,
                            left: `${scrollProgress.left}%`,
                        }}
                    />
                </div>
            </div>
        </section>
    );
}

function LaunchBanners() {
    return (
        <section className="dayal-home-launch" aria-label="Our New Launch">
            <img
                className="dayal-home-launch-decor"
                src="/uploads/2026/07/image-87-1.avif"
                alt=""
                aria-hidden="true"
                loading="lazy"
            />
            <div className="dayal-home-launch-inner">
                <header className="dayal-home-launch-header">
                    <div className="dayal-home-launch-eyebrow-wrap">
                        <span className="dayal-home-launch-divider" aria-hidden="true" />
                        <p className="dayal-home-launch-eyebrow">New Products</p>
                        <span className="dayal-home-launch-divider" aria-hidden="true" />
                    </div>
                    <h2 className="dayal-home-launch-title">
                        Our New <span className="dayal-home-launch-accent">Launch</span>
                    </h2>
                </header>
                <div className="dayal-home-launch-grid">
                    {launchBanners.map((banner) => (
                        <article
                            className={`dayal-home-launch-card dayal-home-launch-card-${banner.id}`}
                            key={banner.id}
                        >
                            <div className="dayal-home-launch-card-content">
                                <span className={`dayal-home-launch-tag ${banner.tagClass}`}>
                                    {banner.tag}
                                </span>
                                <div className="dayal-home-launch-mobile-image">
                                    <img src={banner.mobileProduct} alt={banner.title} loading="lazy" />
                                </div>
                                <h3 className="dayal-home-launch-product-title">{banner.title}</h3>
                                <h4 className="dayal-home-launch-product-subtitle">{banner.subtitle}</h4>
                                <img
                                    className="dayal-home-launch-frame-divider"
                                    src="/uploads/2026/07/Frame-99.png"
                                    alt=""
                                    aria-hidden="true"
                                />
                                <p className="dayal-home-launch-description">{banner.description}</p>

                                {banner.bulletPoints && (
                                    <ul className="dayal-home-launch-bullet-list">
                                        {banner.bulletPoints.map((point, idx) => (
                                            <li key={idx}>
                                                <img
                                                    src="/uploads/2026/07/Rectangle-5.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                                <span dangerouslySetInnerHTML={{ __html: point }} />
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="dayal-home-launch-features">
                                    {banner.features.map((feat, idx) => (
                                        <div className="dayal-home-launch-feature-group" key={idx}>
                                            {idx > 0 && (
                                                <img
                                                    className="dayal-home-launch-feature-sep"
                                                    src="/uploads/2026/07/Line-12.png"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            )}
                                            <div className="dayal-home-launch-feature-item">
                                                <img
                                                    className="dayal-home-launch-feature-icon"
                                                    src={feat.icon}
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                                <span className="dayal-home-launch-feature-text">
                                                    {feat.title}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="dayal-home-launch-actions">
                                    <Link className="dayal-home-launch-btn-primary" href={banner.buttonUrl}>
                                        <span>{banner.buttonText}</span>
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 448 512"
                                            className="dayal-home-launch-btn-arrow"
                                        >
                                            <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                                        </svg>
                                    </Link>
                                    {banner.outletText && (
                                        <span className="dayal-home-launch-btn-outlet">
                                            {banner.outletText}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="dayal-home-launch-desktop-image">
                                <img
                                    src={banner.desktopProduct}
                                    alt={banner.title}
                                    loading="lazy"
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function HomeSections({ products = [], categories = [] }) {
    return (
        <div className="dayal-home-sections">
            <CategorySlider categories={categories} />
            <LaunchBanners />
            <BestSellers products={products} categories={categories} />
            <section className="dayal-home-trust" aria-label="Dayal Sweets commitments">
                <div className="dayal-home-trust-inner dayal-home-trust-grid">
                    {trustItems.map(([title, description, icon]) => (
                        <article className="dayal-home-trust-item" key={title}>
                            <img src={`/uploads/2026/07/${icon}`} alt="" />
                            <div><strong>{title}</strong><span>{description}</span></div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="dayal-home-process" aria-label="Our Process">
                <div className="dayal-home-process-inner">
                    <header className="dayal-home-process-header">
                        <div className="dayal-home-process-eyebrow-wrap">
                            <span className="dayal-home-process-rule" aria-hidden="true" />
                            <p className="dayal-home-process-eyebrow">Our Process</p>
                            <span className="dayal-home-process-rule" aria-hidden="true" />
                        </div>
                        <h2 className="dayal-home-process-title">
                            <span className="dayal-home-process-title-main">From Fresh Ingredients to</span>
                            <span className="dayal-home-process-title-highlight">Sweet Perfection</span>
                        </h2>
                    </header>
                    <ol className="dayal-home-process-grid">
                        {processSteps.map((step) => (
                            <li className="dayal-home-process-step" key={step.number}>
                                <div className="dayal-home-process-media">
                                    <img src={`/uploads/2026/07/${step.image}`} alt={step.title} loading="lazy" />
                                </div>
                                <span className="dayal-home-process-number">Step {step.number}</span>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
            <SpecialServices />
            <VideoGallery />
            <Testimonials />
            <Outlets />
            <Opportunities />
        </div>
    );
}
