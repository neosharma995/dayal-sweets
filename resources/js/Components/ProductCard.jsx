import React, { useState } from 'react';

/**
 * Reusable Product Card Component
 * Shared across "Our Best Sellers" (homepage) and the Shop catalog page.
 */
export default function ProductCard({ product, onAddToCart }) {
    const hasVariations = product.variations && product.variations.length > 0;
    const [selectedVarIndex, setSelectedVarIndex] = useState(hasVariations ? 0 : null);
    const [qty, setQty] = useState(1);

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
                    <small className="oto-price-from">From </small>
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
        <article className="product-card oto-product-card" data-cat={product.categorySlug || ''}>
            <a href={productHref} className="product-card__link oto-product-link" aria-label={product.name}>
                <div className="product-card__img-wrapper oto-product-img-wrapper">
                    {product.badge && (
                        <span className="product-card__badge oto-product-cat-badge">
                            {product.badge}
                        </span>
                    )}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card__img oto-product-img"
                        decoding="async"
                    />
                </div>
            </a>

            <div className="product-card__body oto-product-body">
                <div className="product-card__meta oto-product-meta-row">
                    <span className="product-card__category oto-product-category">
                        {product.category}
                    </span>
                </div>

                <a href={productHref} className="product-card__title-link oto-product-title-link">
                    <h3 className="product-card__name oto-product-name">{product.name}</h3>
                </a>

                {product.description && (
                    <div className="product-card__desc oto-product-desc">
                        {product.description}
                    </div>
                )}

                {hasVariations && (
                    <div className="product-card__variations oto-variation-pills-row" role="radiogroup" aria-label="Product variations">
                        {product.variations.map((v, i) => (
                            <button
                                key={v.label}
                                type="button"
                                className={`product-card__var-pill oto-var-pill-mini ${selectedVarIndex === i ? 'active' : ''}`}
                                role="radio"
                                aria-checked={selectedVarIndex === i}
                                onClick={() => setSelectedVarIndex(i)}
                            >
                                {v.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="product-card__footer oto-product-footer">
                    <div className="product-card__price oto-product-price">
                        {priceDisplay}
                    </div>

                    <div className="product-card__controls oto-product-cart-controls">
                        <div className="product-card__qty-box oto-qty-box" aria-label="Select quantity">
                            <button
                                type="button"
                                className="product-card__qty-btn oto-qty-minus"
                                aria-label="Decrease quantity"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                disabled={qty <= 1}
                            >
                                −
                            </button>
                            <input
                                type="number"
                                className="product-card__qty-input oto-qty-input"
                                value={qty}
                                min="1"
                                step="1"
                                inputMode="numeric"
                                aria-label="Quantity"
                                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            />
                            <button
                                type="button"
                                className="product-card__qty-btn oto-qty-plus"
                                aria-label="Increase quantity"
                                onClick={() => setQty((q) => q + 1)}
                            >
                                +
                            </button>
                        </div>

                        <button
                            type="button"
                            className="product-card__add-btn oto-add-circle-btn oto-add-btn"
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
