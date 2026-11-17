import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';

/**
 * Reusable Product Card Component
 * Shared across "Our Best Sellers" (homepage) and the Shop catalog page.
 */
export default function ProductCard({ product, onAddToCart }) {
    const hasVariations = product.variations && product.variations.length > 0;
    const [selectedVarIndex, setSelectedVarIndex] = useState(hasVariations ? 0 : null);
    const [qty, setQty] = useState(1);

    const pillsRef = useRef(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const hasDraggedRef = useRef(false);
    const isFirstMount = useRef(true);

    // Mouse wheel horizontal scrolling listener
    useEffect(() => {
        const el = pillsRef.current;
        if (!el || !hasVariations) return;

        const onWheel = (e) => {
            if (e.deltaY !== 0) {
                const maxScrollLeft = el.scrollWidth - el.clientWidth;
                if (maxScrollLeft > 0) {
                    const canScrollRight = e.deltaY > 0 && el.scrollLeft < maxScrollLeft - 1;
                    const canScrollLeft = e.deltaY < 0 && el.scrollLeft > 1;

                    if (canScrollRight || canScrollLeft) {
                        e.preventDefault();
                        el.scrollLeft += e.deltaY;
                    }
                }
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [hasVariations]);

    // Keep active pill scrolled into visible area inside its container (never scroll the window)
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        if (pillsRef.current && selectedVarIndex !== null && pillsRef.current.children[selectedVarIndex]) {
            const container = pillsRef.current;
            const activePill = container.children[selectedVarIndex];
            const pillLeft = activePill.offsetLeft;
            const pillWidth = activePill.offsetWidth;
            const containerWidth = container.clientWidth;

            if (pillLeft < container.scrollLeft) {
                container.scrollTo({ left: pillLeft, behavior: 'smooth' });
            } else if (pillLeft + pillWidth > container.scrollLeft + containerWidth) {
                container.scrollTo({ left: pillLeft + pillWidth - containerWidth, behavior: 'smooth' });
            }
        }
    }, [selectedVarIndex]);

    // Click & Drag-to-scroll handlers
    const handleMouseDown = (e) => {
        if (!pillsRef.current) return;
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        startXRef.current = e.pageX - pillsRef.current.offsetLeft;
        scrollLeftRef.current = pillsRef.current.scrollLeft;
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current || !pillsRef.current) return;
        const x = e.pageX - pillsRef.current.offsetLeft;
        const walk = x - startXRef.current;
        if (Math.abs(walk) > 4) {
            hasDraggedRef.current = true;
        }
        pillsRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
    };

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

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product, qty, activeVariation);
        }
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
                        ref={pillsRef}
                        className="product-card__variations dayal-variation-pills-row"
                        role="radiogroup"
                        aria-label="Product variations"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {product.variations.map((v, i) => (
                            <button
                                key={v.label}
                                type="button"
                                className={`product-card__var-pill dayal-var-pill-mini ${selectedVarIndex === i ? 'active' : ''}`}
                                role="radio"
                                aria-checked={selectedVarIndex === i}
                                onClick={(e) => {
                                    if (hasDraggedRef.current) {
                                        e.preventDefault();
                                        return;
                                    }
                                    setSelectedVarIndex(i);
                                }}
                            >
                                {v.label}
                            </button>
                        ))}
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
                            className="product-card__add-btn dayal-add-circle-btn dayal-add-btn"
                            title="Add to Cart"
                            aria-label={`Add ${product.name} to Cart`}
                            onClick={handleAddToCart}
                        >
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
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
