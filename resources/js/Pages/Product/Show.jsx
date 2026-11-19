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
    AlertCircle,
} from 'lucide-react';

export default function ProductShow({ product: propProduct, slug: propSlug, auth, isAvailableInArea = true, isPincodeSet = false }) {
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
        const success = addToCart(
            {
                id: product.id,
                name: product.name,
                price: currentPrice,
                image: product.image,
                variation: activeVariation?.label || null,
            },
            quantity
        );

        if (success !== false) {
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        }
    };

    const handleBuyNow = () => {
        const success = addToCart(
            {
                id: product.id,
                name: product.name,
                price: currentPrice,
                image: product.image,
                variation: activeVariation?.label || null,
            },
            quantity
        );

        if (success !== false) {
            router.visit('/checkout');
        }
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
                {/* Hero Banner matching live design */}
                <section className="pd-hero-wrapper">
                    <div className="pd-hero-content">
                        {/* Breadcrumbs: HOME > CATEGORY > PRODUCT */}
                        <div className="pd-breadcrumb" aria-label="Breadcrumb">
                            <Link href="/">HOME</Link>
                            <span className="breadcrumb-sep">&gt;</span>
                            <Link href={product.categorySlug ? `/shop?category=${product.categorySlug}` : '/shop'}>
                                {product.category || 'UNCATEGORIZED'}
                            </Link>
                            <span className="breadcrumb-sep">&gt;</span>
                            <span className="breadcrumb-current">{product.name.toUpperCase()}</span>
                        </div>

                        <h1>{product.name.toUpperCase()}</h1>
                        <p>{product.tagline || 'Discover Every Festive Delight'}</p>
                    </div>
                </section>

                {/* Main Product Showcase Section in 1720px Container */}
                <section className="dayal-product-showcase-section">
                    <div className="dayal-product-single-container">
                        <div className="product-detail-layout">
                            {/* Left Column: Product Visuals */}
                            <div className="product-gallery-wrap">
                                <div className="main-image-box">
                                    <img
                                        id="main-product-img"
                                        src={activeImage || product.image}
                                        alt={product.name}
                                    />
                                </div>

                                {/* Multiple Thumbnails (Retained as requested) */}
                                {product.gallery && product.gallery.length > 1 && (
                                    <div className="product-thumbnails-row">
                                        {product.gallery.map((imgUrl, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className={`product-thumbnail-btn ${activeImage === imgUrl ? 'is-active' : ''}`}
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
                            <div className="product-info-wrap">
                                <div className="single-category">
                                    {product.category || 'UNCATEGORIZED'}
                                </div>

                                <h1 className="single-title">{product.name}</h1>

                                {/* Rating and Stock Status Row */}
                                <div className="single-rating-row">
                                    <span className="rating-stars">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="#E5A600" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 0L8.57 4.84L13.66 4.84L9.54 7.83L11.11 12.67L7 9.68L2.89 12.67L4.46 7.83L0.34 4.84L5.43 4.84L7 0Z"></path>
                                        </svg>
                                        {Number(product.rating || 0).toFixed(1)}
                                    </span>
                                    <span className="rating-count">
                                        ({product.ratingCount || 0} Verified Reviews)
                                    </span>
                                    <span className="stock-tag">In Stock</span>
                                </div>

                                {/* Price Row */}
                                <div className="single-price-row">
                                    <span className="price-label">Price:</span>
                                    <div className="single-price" id="single-display-price">
                                        <span className="woocommerce-Price-currencySymbol">₹</span>{currentPrice.toFixed(2)}
                                    </div>
                                    {product.originalPrice && product.originalPrice > currentPrice && (
                                        <span className="original-price-amount">
                                            ₹{Number(product.originalPrice).toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Short Description */}
                                <div className="single-excerpt">
                                    <p>{product.description}</p>
                                </div>

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
                                                    <span className="var-price">₹{v.price}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pincode Area Serviceability Status */}
                                {isPincodeSet && !isAvailableInArea && (
                                    <div className="dayal-product-area-serviceable is-unavailable" role="alert">
                                        <AlertCircle size={15} />
                                        <span>Currently not available for delivery from the outlet serving your PIN code.</span>
                                    </div>
                                )}

                                {/* Quantity Counter & Action Buttons */}
                                <div className="cart-form-container">
                                    <div className="action-row">
                                        <div className="qty-wrapper">
                                            <div className="qty-selector">
                                                <button
                                                    type="button"
                                                    className="qty-btn"
                                                    onClick={() => handleQuantityChange(-1)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span className="qty-input">{quantity}</span>
                                                <button
                                                    type="button"
                                                    className="qty-btn"
                                                    onClick={() => handleQuantityChange(1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="action-wrapper">
                                            <button
                                                type="button"
                                                id="btn-single-add-cart"
                                                className={`btn-add-to-cart ${isAdded ? 'is-success' : ''}`}
                                                onClick={handleAddToCart}
                                            >
                                                {isAdded ? (
                                                    <>
                                                        <Check size={18} strokeWidth={2.5} />
                                                        <span>Added!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                                                        </svg>
                                                        <span>Add To Cart</span>
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-buy-now"
                                                onClick={handleBuyNow}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5 6.5V5C5 2.79086 6.79086 1 9 1C11.2091 1 13 2.79086 13 5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    <rect x="2" y="6" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"></rect>
                                                    <path d="M6 9V10C6 11.6569 7.34315 13 9 13C10.6569 13 12 11.6569 12 10V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                </svg>
                                                <span>Buy Now</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 4 Quality & Delivery Guarantees */}
                                <div className="trust-highlights">
                                    <div className="trust-item">
                                        <div className="trust-icon">✓</div>
                                        <span>100% Pure Desi Ghee</span>
                                    </div>
                                    <div className="trust-item">
                                        <div className="trust-icon">✦</div>
                                        <span>Freshly Prepared Daily</span>
                                    </div>
                                    <div className="trust-item">
                                        <div className="trust-icon">⚙</div>
                                        <span>Hygienic Packaging</span>
                                    </div>
                                    <div className="trust-item">
                                        <div className="trust-icon">✈</div>
                                        <span>Express Delivery</span>
                                    </div>
                                </div>

                                {/* Collapsible Accordion Tabs */}
                                <div className="product-tabs">
                                    {/* Tab 1: Product Description */}
                                    <div className="tab-item">
                                        <div
                                            className={`tab-header ${openAccordions.description ? 'open' : ''}`}
                                            onClick={() => toggleAccordion('description')}
                                        >
                                            <span>PRODUCT DESCRIPTION</span>
                                            <span className="chevron-icon">
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{
                                                        transform: openAccordions.description ? 'rotate(180deg)' : 'none',
                                                        transition: 'transform 0.2s',
                                                    }}
                                                >
                                                    <path d="M2 4L6 8L10 4" stroke="#B5B0A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        {openAccordions.description && (
                                            <div className="tab-body">
                                                <p>{product.fullDescription || product.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tab 2: Ingredients & Allergen Info */}
                                    <div className="tab-item">
                                        <div
                                            className={`tab-header ${openAccordions.ingredients ? 'open' : ''}`}
                                            onClick={() => toggleAccordion('ingredients')}
                                        >
                                            <span>INGREDIENTS &amp; ALLERGEN INFO</span>
                                            <span className="chevron-icon">
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{
                                                        transform: openAccordions.ingredients ? 'rotate(180deg)' : 'none',
                                                        transition: 'transform 0.2s',
                                                    }}
                                                >
                                                    <path d="M2 4L6 8L10 4" stroke="#B5B0A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        {openAccordions.ingredients && (
                                            <div className="tab-body">
                                                <p>{product.ingredients || 'Pure Desi Ghee, Quality Cashews / Flour, Sugar, Cardamom, Pistachio, Almonds.'}</p>
                                                {product.allergens && (
                                                    <p><strong>Allergens:</strong> {product.allergens}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* YOU MAY ALSO LIKE Section */}
                <section className="related-products-section">
                    <div className="dayal-product-single-container">
                        <h2>
                            YOU MAY <span>ALSO LIKE</span>
                        </h2>

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
