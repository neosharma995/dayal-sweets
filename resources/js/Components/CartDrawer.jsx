import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useCart } from '@/Context/CartContext';
import { X } from 'lucide-react';

export default function CartDrawer() {
    const {
        cart,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart,
        cartSubtotal,
    } = useCart();

    // Close on Escape key
    useEffect(() => {
        if (!isCartOpen) return undefined;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeCart();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCartOpen, closeCart]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <div className="dayal-cart-overlay" onClick={closeCart} role="presentation">
            <aside
                className="dayal-cart-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Your Cart"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drawer Header */}
                <header className="dayal-cart-header">
                    <div className="dayal-cart-header-top">
                        <h2 className="dayal-cart-title">Your Cart</h2>
                        <button
                            type="button"
                            className="dayal-cart-close-btn"
                            onClick={closeCart}
                            aria-label="Close cart"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="dayal-cart-column-labels">
                        <span className="col-label-product">PRODUCT</span>
                        <span className="col-label-total">TOTAL</span>
                    </div>
                </header>

                {/* Drawer Items Body */}
                <div className="dayal-cart-body">
                    {cart.length === 0 ? (
                        <div className="dayal-cart-empty">
                            <div className="empty-icon-circle">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </div>
                            <h3>Your Cart is Empty</h3>
                            <p>Looks like you haven't added any authentic sweets or savouries yet.</p>
                            <Link href="/shop" className="dayal-btn dayal-btn--primary" onClick={closeCart}>
                                Explore Shop
                            </Link>
                        </div>
                    ) : (
                        <ul className="dayal-cart-items-list">
                            {cart.map((item) => {
                                const lineTotal = (item.price * item.quantity).toFixed(2);
                                return (
                                    <li key={item.id} className="dayal-cart-item">
                                        <div className="dayal-cart-item-img-wrapper">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="dayal-cart-item-img"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/uploads/2026/07/kaaju-katli.png';
                                                }}
                                            />
                                        </div>

                                        <div className="dayal-cart-item-details">
                                            <h3 className="dayal-cart-item-name">{item.name}</h3>
                                            <p className="dayal-cart-item-unit-price">
                                                &#8377;{Number(item.price).toFixed(2)}
                                            </p>

                                            {item.variationLabel && (
                                                <p className="dayal-cart-item-variation">
                                                    {item.variationLabel}
                                                </p>
                                            )}

                                            <div className="dayal-cart-item-controls-row">
                                                {/* Quantity selector */}
                                                <div className="dayal-cart-qty-selector">
                                                    <button
                                                        type="button"
                                                        className="dayal-cart-qty-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        aria-label="Decrease quantity"
                                                        style={item.quantity <= 1 ? { opacity: 0.35, cursor: 'not-allowed' } : {}}
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="999"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === '') {
                                                                updateQuantity(item.id, 1);
                                                            } else {
                                                                const num = parseInt(val, 10);
                                                                if (!isNaN(num)) {
                                                                    updateQuantity(item.id, Math.max(1, Math.min(999, num)));
                                                                }
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        className="dayal-cart-qty-input"
                                                        aria-label={`Quantity for ${item.name}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="dayal-cart-qty-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="dayal-cart-item-right-col">
                                            {/* X button to delete item from cart */}
                                            <button
                                                type="button"
                                                className="dayal-cart-remove-x-btn"
                                                onClick={() => removeFromCart(item.id)}
                                                title="Delete item from cart"
                                                aria-label={`Delete ${item.name} from cart`}
                                            >
                                                <X size={16} strokeWidth={2.2} />
                                            </button>

                                            <div className="dayal-cart-item-total">
                                                &#8377;{lineTotal}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Drawer Footer */}
                {cart.length > 0 && (
                    <footer className="dayal-cart-footer">
                        <div className="dayal-cart-estimated-row">
                            <span className="estimated-label">Estimated total</span>
                            <span className="estimated-amount">&#8377;{cartSubtotal.toFixed(2)}</span>
                        </div>

                        <p className="dayal-cart-tax-notice">
                            Taxes included. Discounts and shipping calculated at checkout.
                        </p>

                        <div className="dayal-cart-actions">
                            <Link
                                href="/checkout"
                                className="dayal-cart-btn-checkout"
                                onClick={closeCart}
                            >
                                CHECK OUT
                            </Link>

                            <Link
                                href="/cart"
                                className="dayal-cart-btn-view"
                                onClick={closeCart}
                            >
                                VIEW CART
                            </Link>
                        </div>
                    </footer>
                )}
            </aside>
        </div>
    );
}
