import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ProductCard from '@/Components/ProductCard';
import { useCart } from '@/Context/CartContext';
import { allProducts, findProductBySlug, getRelatedProducts } from '@/data/productCatalog';
import {
    ShoppingBag,
    Zap,
    Check,
    Star,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Truck,
    Sparkles,
    CheckCircle2,
    Heart,
    Share2,
} from 'lucide-react';

export default function ProductShow({ product: propProduct, slug: propSlug, auth }) {
    // Resolve product from prop or fallback to catalog
    const product = useMemo(() => {
        if (propProduct && propProduct.id) {
            return {
                ...findProductBySlug(propProduct.slug || propProduct.id),
                ...propProduct,
            };
        }
        return findProductBySlug(propSlug || 'office-tea-combo');
    }, [propProduct, propSlug]);

    const hasVariations = Boolean(product.variations && product.variations.length > 0);
    const [selectedVarIndex, setSelectedVarIndex] = useState(hasVariations ? 0 : null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(product.image);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        setActiveImage(product.image);
        setSelectedVarIndex(product.variations && product.variations.length > 0 ? 0 : null);
        setQuantity(1);
    }, [product.id, product.slug, product.image]);

    // Accordion state
    const [openAccordions, setOpenAccordions] = useState({
        description: true,
        ingredients: false,
        storage: false,
    });

    const toggleAccordion = (key) => {
        setOpenAccordions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const activeVariation = hasVariations && selectedVarIndex !== null
        ? product.variations[selectedVarIndex]
        : null;

    const currentPrice = activeVariation
        ? (typeof activeVariation.price === 'number' ? activeVariation.price : parseFloat(activeVariation.price))
        : (typeof product.price === 'number' ? product.price : parseFloat(product.price) || 150);

    const { addToCart, openCart } = useCart();

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        addToCart(
            {
                id: product.id,
                name: product.name,
                price: currentPrice,
                image: product.image,
                variation: activeVariation?.label || null,
            },
            quantity
        );

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(
            {
                id: product.id,
                name: product.name,
                price: currentPrice,
                image: product.image,
                variation: activeVariation?.label || null,
            },
            quantity
        );

        router.visit('/checkout');
    };

    const relatedProducts = useMemo(() => getRelatedProducts(product, 4), [product]);

    return (
        <div className="dayal-site dayal-product-single-page">
            <Head>
                <title>{`${product.name} | Dayal Sweets - Pure Traditional Taste`}</title>
                <meta name="description" content={product.description} />
            </Head>

            {/* Global Store Header */}
            <Header auth={auth} />

            <main className="dayal-product-single-main">
                {/* Hero Banner matching user reference image */}
                <section className="dayal-product-single-hero">
                    <div className="dayal-product-hero-overlay" aria-hidden="true" />

                    {/* Decorative Sweets and Rose Petals graphics on left */}
                    <img
                        src="/uploads/2026/07/image-262.png"
                        alt=""
                        className="dayal-hero-decor-sweet-1"
                        aria-hidden="true"
                    />
                    <img
                        src="/uploads/2026/07/image-261.png"
                        alt=""
                        className="dayal-hero-decor-sweet-2"
                        aria-hidden="true"
                    />
                    <img
                        src="/uploads/2026/07/image-263.png"
                        alt=""
                        className="dayal-hero-decor-sweet-3"
                        aria-hidden="true"
                    />

                    {/* Decorative Peacock Feather graphic on right */}
                    <img
                        src="/uploads/2026/07/image-48.png"
                        alt=""
                        className="dayal-hero-decor-peacock"
                        aria-hidden="true"
                    />

                    <div className="dayal-product-hero-inner">
                        {/* Breadcrumbs: HOME > CATEGORY > PRODUCT */}
                        <nav className="dayal-product-breadcrumb" aria-label="Breadcrumb">
                            <Link href="/">HOME</Link>
                            <span className="breadcrumb-sep">&gt;</span>
                            <Link href={product.categorySlug ? `/shop?category=${product.categorySlug}` : '/shop'}>
                                {product.category || 'SWEETS'}
                            </Link>
                            <span className="breadcrumb-sep">&gt;</span>
                            <span className="breadcrumb-current">{product.name.toUpperCase()}</span>
                        </nav>

                        <h1 className="dayal-product-hero-title">
                            {product.name.toUpperCase()}
                        </h1>
                        <p className="dayal-product-hero-subtitle">
                            {product.tagline || 'Discover Every Festive Delight'}
                        </p>
                    </div>
                </section>

                {/* Main Product Showcase Section in 1720px Container */}
                <section className="dayal-product-showcase-section">
                    <div className="dayal-product-single-container">
                        <div className="dayal-product-layout">
                            {/* Left Column: Product Visuals */}
                            <div className="dayal-product-gallery-column">
                                <div className="dayal-product-main-card">
                                    <img
                                        src={activeImage || product.image}
                                        alt={product.name}
                                        className="dayal-product-featured-img"
                                    />
                                </div>

                                {product.gallery && product.gallery.length > 1 && (
                                    <div className="dayal-product-thumbnails-row">
                                        {product.gallery.map((imgUrl, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className={`dayal-thumbnail-btn ${activeImage === imgUrl ? 'is-active' : ''}`}
                                                onClick={() => setActiveImage(imgUrl)}
                                                aria-label={`View image ${idx + 1}`}
                                            >
                                                <img src={imgUrl} alt="" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Product Information & Purchase Controls */}
                            <div className="dayal-product-details-column">
                                <div className="product-category-eyebrow">
                                    {product.category || 'SWEETS'}
                                </div>

                                <h2 className="product-single-title">{product.name}</h2>

                                {/* Rating and Stock Status Row */}
                                <div className="product-meta-row">
                                    <div className="product-stars-rating">
                                        <div className="stars-cluster">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < Math.floor(product.rating || 0) ? 'star-filled' : 'star-empty'}
                                                    fill={i < Math.floor(product.rating || 0) ? '#D4AF37' : 'none'}
                                                />
                                            ))}
                                        </div>
                                        <span className="rating-text">
                                            {Number(product.rating || 0).toFixed(1)} ({product.ratingCount || 0} Verified Reviews)
                                        </span>
                                    </div>

                                    <div className="product-stock-badge">
                                        <span>In Stock</span>
                                    </div>
                                </div>

                                {/* Price Row */}
                                <div className="product-price-row">
                                    <span className="price-label">Price:</span>
                                    <span className="price-amount">
                                        &#8377;{currentPrice.toFixed(2)}
                                    </span>
                                    {product.originalPrice && product.originalPrice > currentPrice && (
                                        <span className="original-price-amount">
                                            &#8377;{Number(product.originalPrice).toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Short Description */}
                                <p className="product-short-description">
                                    {product.description}
                                </p>

                                {/* Variation Pills (if applicable) */}
                                {hasVariations && (
                                    <div className="product-variations-group">
                                        <label className="variations-label">Select Option:</label>
                                        <div className="variations-pills">
                                            {product.variations.map((v, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className={`variation-pill-btn ${selectedVarIndex === idx ? 'is-selected' : ''}`}
                                                    onClick={() => setSelectedVarIndex(idx)}
                                                >
                                                    <span className="var-title">{v.label}</span>
                                                    <span className="var-price">&#8377;{v.price}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity Counter & Action Buttons */}
                                <div className="product-actions-cluster">
                                    <div className="product-quantity-counter">
                                        <button
                                            type="button"
                                            className="qty-btn minus"
                                            onClick={() => handleQuantityChange(-1)}
                                            aria-label="Decrease quantity"
                                        >
                                            -
                                        </button>
                                        <span className="qty-value">{quantity}</span>
                                        <button
                                            type="button"
                                            className="qty-btn plus"
                                            onClick={() => handleQuantityChange(1)}
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className={`btn-add-to-cart ${isAdded ? 'is-success' : ''}`}
                                        onClick={handleAddToCart}
                                    >
                                        {isAdded ? (
                                            <>
                                                <Check size={16} strokeWidth={2.5} />
                                                <span>ADDED TO CART!</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag size={16} />
                                                <span>ADD TO CART</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-buy-now"
                                        onClick={handleBuyNow}
                                    >
                                        <Zap size={16} />
                                        <span>BUY NOW</span>
                                    </button>
                                </div>

                                {/* 4 Quality & Delivery Guarantees */}
                                <div className="product-guarantees-grid">
                                    <div className="guarantee-cell">
                                        <span className="guarantee-check-icon">
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                        <span className="guarantee-label">100% Pure Desi Ghee</span>
                                    </div>

                                    <div className="guarantee-cell">
                                        <span className="guarantee-check-icon">
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                        <span className="guarantee-label">Freshly Prepared Daily</span>
                                    </div>

                                    <div className="guarantee-cell">
                                        <span className="guarantee-check-icon">
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                        <span className="guarantee-label">Hygienic Packaging</span>
                                    </div>

                                    <div className="guarantee-cell">
                                        <span className="guarantee-check-icon">
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                        <span className="guarantee-label">Express Delivery</span>
                                    </div>
                                </div>

                                {/* Collapsible Accordion Tabs */}
                                <div className="product-accordions-group">
                                    {/* Tab 1: Product Description */}
                                    <div className="accordion-item">
                                        <button
                                            type="button"
                                            className="accordion-trigger"
                                            onClick={() => toggleAccordion('description')}
                                            aria-expanded={openAccordions.description}
                                        >
                                            <span className="accordion-title">PRODUCT DESCRIPTION</span>
                                            {openAccordions.description ? (
                                                <ChevronUp size={16} className="accordion-icon" />
                                            ) : (
                                                <ChevronDown size={16} className="accordion-icon" />
                                            )}
                                        </button>
                                        {openAccordions.description && (
                                            <div className="accordion-content">
                                                <p>{product.fullDescription || product.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tab 2: Ingredients & Allergen Info */}
                                    <div className="accordion-item">
                                        <button
                                            type="button"
                                            className="accordion-trigger"
                                            onClick={() => toggleAccordion('ingredients')}
                                            aria-expanded={openAccordions.ingredients}
                                        >
                                            <span className="accordion-title">INGREDIENTS &amp; ALLERGEN INFO</span>
                                            {openAccordions.ingredients ? (
                                                <ChevronUp size={16} className="accordion-icon" />
                                            ) : (
                                                <ChevronDown size={16} className="accordion-icon" />
                                            )}
                                        </button>
                                        {openAccordions.ingredients && (
                                            <div className="accordion-content">
                                                <p><strong>Ingredients:</strong> {product.ingredients || 'Handcrafted with 100% pure desi ghee, premium grade dry fruits, saffron, and natural aromatics.'}</p>
                                                {product.allergens && (
                                                    <p><strong>Allergens:</strong> {product.allergens}</p>
                                                )}
                                                <p className="facility-note">Prepared with utmost care in an FSSAI certified 100% vegetarian facility.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tab 3: Storage & Shelf Life */}
                                    <div className="accordion-item">
                                        <button
                                            type="button"
                                            className="accordion-trigger"
                                            onClick={() => toggleAccordion('storage')}
                                            aria-expanded={openAccordions.storage}
                                        >
                                            <span className="accordion-title">STORAGE &amp; SHELF LIFE</span>
                                            {openAccordions.storage ? (
                                                <ChevronUp size={16} className="accordion-icon" />
                                            ) : (
                                                <ChevronDown size={16} className="accordion-icon" />
                                            )}
                                        </button>
                                        {openAccordions.storage && (
                                            <div className="accordion-content">
                                                <p>{product.storage || 'Store in a cool, dry place away from direct sunlight. To preserve maximum aroma and taste, keep sealed in an airtight container.'}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* YOU MAY ALSO LIKE Section */}
                <section className="dayal-product-related-section">
                    <div className="dayal-product-single-container">
                        <header className="dayal-related-header">
                            <h2 className="related-title">
                                YOU MAY <span className="title-accent">ALSO LIKE</span>
                            </h2>
                        </header>

                        <div className="dayal-related-grid">
                            {relatedProducts.map((relProduct) => (
                                <ProductCard
                                    key={relProduct.id}
                                    product={relProduct}
                                    onAddToCart={(p, qty, variation) => {
                                        addToCart(
                                            {
                                                id: p.id,
                                                name: p.name,
                                                price: variation ? variation.price : p.price,
                                                image: p.image,
                                                variation: variation?.label || null,
                                            },
                                            qty
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Global Store Footer with Promotional CTA */}
            <Footer />
        </div>
    );
}
