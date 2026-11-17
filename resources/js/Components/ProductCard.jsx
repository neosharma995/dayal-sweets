import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@inertiajs/react';
import { useCart } from '@/Context/CartContext';

/**
 * Reusable Product Card Component
 * Shared across "Our Best Sellers" (homepage) and the Shop catalog page.
 */
export default function ProductCard({ product, onAddToCart }) {
    const hasVariations = Boolean(product?.variations && product.variations.length > 0);
    const [selectedVarIndex, setSelectedVarIndex] = useState(hasVariations ? 0 : null);
    const [showVariationsModal, setShowVariationsModal] = useState(false);
    const [qty, setQty] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    // Close modal on Escape key
    useEffect(() => {
        if (!showVariationsModal) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowVariationsModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showVariationsModal]);

    const activeVariation = hasVariations && selectedVarIndex !== null ? product.variations[selectedVarIndex] : null;

    // Price display logic
    let priceDisplay;
    if (activeVariation) {
        priceDisplay = (
            <span>
                <span className="currency-symbol">&#8377;</span>
                {typeof activeVariation.price === 'number' ? activeVariation.price.toFixed(2) : activeVariation.price}
            </span>
        );
    } else if (typeof product.price === 'number') {
        priceDisplay = (
            <span>
                <span className="currency-symbol">&#8377;</span>
                {product.price.toFixed(2)}
            </span>
        );
    } else if (typeof product.price === 'string') {
        if (product.price.toLowerCase().startsWith('from')) {
            const rawAmount = product.price.replace(/^from\s*/i, '');
            priceDisplay = (
                <>
                    <small className="dayal-price-from">From </small>
                    <span>{rawAmount}</span>
                </>
            );
        } else {
            priceDisplay = <span>{product.price}</span>;
        }
    }

    const cartContext = useCart();
    const fallbackAddToCart = cartContext?.addToCart;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product, qty, activeVariation);
        } else if (fallbackAddToCart) {
            fallbackAddToCart(product, qty, activeVariation);
        }
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1200);
    };

    const productHref = product.slug ? `/product/${product.slug}/` : '/shop';

    return (
        <article className="product-card dayal-product-card" data-cat={product.categorySlug || ''}>
            <Link href={productHref} className="product-card__link dayal-product-link" aria-label={product.name}>
                <div className="product-card__img-wrapper dayal-product-img-wrapper">
                    {product.badge && (
                        <span className="product-card__badge dayal-product-cat-badge">
                            {product.badge}
                        </span>
                    )}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card__img dayal-product-img"
                        decoding="async"
                    />
                </div>
            </Link>

            <div className="product-card__body dayal-product-body">
                <div className="product-card__meta dayal-product-meta-row">
                    <span className="product-card__category dayal-product-category">
                        {product.category}
                    </span>
                    <div className="product-card__rating dayal-product-card-rating">
                        <svg
                            className="dayal-product-rating-star"
                            viewBox="0 0 24 24"
                            fill="#E5A600"
                            width="12"
                            height="12"
                            aria-hidden="true"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className="dayal-product-rating-num">
                            {product.rating !== undefined && product.rating !== null && !isNaN(product.rating)
                                ? Number(product.rating).toFixed(1)
                                : '0.0'}
                        </span>
                    </div>
                </div>

                <Link href={productHref} className="product-card__title-link dayal-product-title-link">
                    <h3 className="product-card__name dayal-product-name">{product.name}</h3>
                </Link>

                {product.description && (
                    <div className="product-card__desc dayal-product-desc">
                        {product.description}
                    </div>
                )}

                {hasVariations && (
                    <div
                        className="product-card__variations dayal-variation-pills-row"
                        role="group"
                        aria-label="Product variations"
                    >
                        <button
                            type="button"
                            className="product-card__var-pill dayal-var-pill-mini active"
                            onClick={() => product.variations.length > 1 && setShowVariationsModal(true)}
                            aria-haspopup={product.variations.length > 1 ? 'dialog' : undefined}
                            title={product.variations.length > 1 ? 'Click to change variation' : undefined}
                        >
                            <span>{activeVariation?.label || product.variations[0]?.label}</span>
                            {product.variations.length > 1 && (
                                <svg
                                    className="dayal-var-pill-chevron"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    width="12"
                                    height="12"
                                    aria-hidden="true"
                                >
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        {product.variations.length > 1 && (
                            <button
                                type="button"
                                className="product-card__var-more-pill dayal-var-more-pill"
                                onClick={() => setShowVariationsModal(true)}
                                aria-haspopup="dialog"
                                title={`View all ${product.variations.length} variations`}
                            >
                                +{product.variations.length - 1} more
                            </button>
                        )}
                    </div>
                )}

                <div className="product-card__footer dayal-product-footer">
                    <div className="product-card__price dayal-product-price">
                        {priceDisplay}
                    </div>

                    <div className="product-card__controls dayal-product-cart-controls">
                        <div className="product-card__qty-box dayal-qty-box" aria-label="Select quantity">
                            <button
                                type="button"
                                className="product-card__qty-btn dayal-qty-minus"
                                aria-label="Decrease quantity"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                disabled={qty <= 1}
                            >
                                −
                            </button>
                            <input
                                type="number"
                                className="product-card__qty-input dayal-qty-input"
                                value={qty}
                                min="1"
                                step="1"
                                inputMode="numeric"
                                aria-label="Quantity"
                                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            />
                            <button
                                type="button"
                                className="product-card__qty-btn dayal-qty-plus"
                                aria-label="Increase quantity"
                                onClick={() => setQty((q) => q + 1)}
                            >
                                +
                            </button>
                        </div>

                        <button
                            type="button"
                            className={`product-card__add-btn dayal-add-circle-btn dayal-add-btn ${isAdded ? 'is-added' : ''}`}
                            title={isAdded ? 'Added to Cart!' : 'Add to Cart'}
                            aria-label={`Add ${product.name} to Cart`}
                            onClick={handleAddToCart}
                        >
                            {isAdded ? (
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {showVariationsModal && typeof document !== 'undefined' && createPortal(
                <div
                    className="dayal-var-modal-overlay"
                    onClick={() => setShowVariationsModal(false)}
                    role="presentation"
                >
                    <div
                        className="dayal-var-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`var-title-${product.id || product.name}`}
                    >
                        <div className="dayal-var-modal-header">
                            <div>
                                <span className="dayal-var-modal-badge">Available Options</span>
                                <h3 id={`var-title-${product.id || product.name}`} className="dayal-var-modal-title">
                                    {product.name}
                                </h3>
                            </div>
                            <button
                                type="button"
                                className="dayal-var-modal-close"
                                onClick={() => setShowVariationsModal(false)}
                                aria-label="Close dialog"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="dayal-var-modal-body">
                            {product.variations.map((v, i) => {
                                const isSelected = selectedVarIndex === i;
                                const priceFormatted = typeof v.price === 'number' ? v.price.toFixed(2) : v.price;
                                return (
                                    <button
                                        key={v.label}
                                        type="button"
                                        className={`dayal-var-modal-item ${isSelected ? 'is-selected' : ''}`}
                                        onClick={() => {
                                            setSelectedVarIndex(i);
                                            setShowVariationsModal(false);
                                        }}
                                    >
                                        <span className="dayal-var-modal-radio">
                                            {isSelected && <span className="dayal-var-modal-radio-inner" />}
                                        </span>
                                        <span className="dayal-var-modal-label">{v.label}</span>
                                        <span className="dayal-var-modal-price">&#8377;{priceFormatted}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </article>
    );
}
