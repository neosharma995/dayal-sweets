import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { useCart } from '@/Context/CartContext';
import { X, Trash2, ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal, cartCount } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState(null);

    const FREE_SHIPPING_THRESHOLD = 999;
    const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
    const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
    const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        const code = couponCode.trim().toUpperCase();
        if (code === 'DAYAL10') {
            const discount = Math.round(cartSubtotal * 0.1);
            setAppliedDiscount(discount);
            setCouponMessage({ type: 'success', text: 'Coupon DAYAL10 applied! 10% discount granted.' });
        } else if (code === 'FESTIVE50' && cartSubtotal >= 500) {
            setAppliedDiscount(50);
            setCouponMessage({ type: 'success', text: 'Coupon FESTIVE50 applied! ₹50 off your order.' });
        } else {
            setAppliedDiscount(0);
            setCouponMessage({ type: 'error', text: 'Invalid coupon code. Try DAYAL10 for 10% off!' });
        }
    };

    const shippingCost = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 50);
    const grandTotal = Math.max(0, cartSubtotal - appliedDiscount + shippingCost);

    return (
        <div className="dayal-site dayal-cart-page">
            <Head title="Shopping Cart - Dayal Sweets" />
            <Header />

            <main className="dayal-cart-main">
                {/* Hero Banner */}
                <section className="dayal-cart-hero">
                    <div className="dayal-cart-hero-inner">
                        <nav className="dayal-cart-breadcrumb" aria-label="Breadcrumb">
                            <Link href="/">Home</Link>
                            <span aria-hidden="true">/</span>
                            <Link href="/shop">Shop</Link>
                            <span aria-hidden="true">/</span>
                            <span className="current">Cart</span>
                        </nav>
                        <span className="dayal-cart-hero-eyebrow">— YOUR SELECTION —</span>
                        <h1 className="dayal-cart-hero-title">Shopping Cart</h1>
                        <p className="dayal-cart-hero-subtitle">
                            Review your freshly handcrafted sweets, savouries &amp; celebration combos
                        </p>
                    </div>
                </section>

                <div className="dayal-cart-container">
                    {cart.length === 0 ? (
                        <div className="dayal-cart-empty-state">
                            <div className="empty-icon-box">
                                <ShoppingBag size={48} strokeWidth={1.5} />
                            </div>
                            <h2>Your Cart is Currently Empty</h2>
                            <p>
                                Explore our authentic collection of traditional Himachali sweets,
                                pure desi ghee laddus, kaju katli, and chef's curated combos.
                            </p>
                            <Link href="/shop" className="dayal-btn dayal-btn--primary">
                                Explore Our Shop
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Free Delivery Milestone Progress */}
                            <div className="dayal-cart-shipping-milestone">
                                <div className="milestone-text">
                                    {isFreeShipping ? (
                                        <span className="milestone-unlocked">
                                            <Sparkles size={16} />
                                            <strong>Congratulations!</strong> You have unlocked <strong>FREE Express Delivery</strong> on this order!
                                        </span>
                                    ) : (
                                        <span>
                                            Add <strong>&#8377;{amountNeededForFreeShipping.toFixed(2)}</strong> more to get <strong>FREE Express Delivery</strong>!
                                        </span>
                                    )}
                                </div>
                                <div className="milestone-bar-track">
                                    <div
                                        className="milestone-bar-fill"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Two-Column Layout */}
                            <div className="dayal-cart-layout">
                                {/* Left: Items Table */}
                                <div className="dayal-cart-items-column">
                                    <div className="dayal-cart-table-wrapper">
                                        <table className="dayal-cart-table">
                                            <thead>
                                                <tr>
                                                    <th className="th-product">Product</th>
                                                    <th className="th-price">Price</th>
                                                    <th className="th-qty">Quantity</th>
                                                    <th className="th-subtotal">Subtotal</th>
                                                    <th className="th-remove"><span className="sr-only">Remove</span></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.map((item) => {
                                                    const lineTotal = item.price * item.quantity;
                                                    return (
                                                        <tr key={item.id} className="dayal-cart-row">
                                                            <td className="td-product">
                                                                <div className="cart-item-info">
                                                                    <div className="cart-item-img-box">
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            onError={(e) => {
                                                                                e.currentTarget.src = '/uploads/2026/07/kaaju-katli.png';
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="cart-item-text">
                                                                        <h3 className="cart-item-title">
                                                                            <Link href={`/product/${item.slug || 'shop'}`}>
                                                                                {item.name}
                                                                            </Link>
                                                                        </h3>
                                                                        {item.variationLabel && (
                                                                            <span className="cart-item-variation">
                                                                                {item.variationLabel}
                                                                            </span>
                                                                        )}
                                                                        <span className="cart-item-unit-mobile">
                                                                            &#8377;{Number(item.price).toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="td-price">
                                                                &#8377;{Number(item.price).toFixed(2)}
                                                            </td>
                                                            <td className="td-qty">
                                                                <div className="cart-qty-control">
                                                                    <button
                                                                        type="button"
                                                                        className="qty-btn"
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
                                                                        className="qty-number qty-input"
                                                                        aria-label={`Quantity for ${item.name}`}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="qty-btn"
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        aria-label="Increase quantity"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="td-subtotal">
                                                                <strong>&#8377;{lineTotal.toFixed(2)}</strong>
                                                            </td>
                                                            <td className="td-remove">
                                                                <button
                                                                    type="button"
                                                                    className="cart-remove-btn"
                                                                    onClick={() => removeFromCart(item.id)}
                                                                    title="Delete item from cart"
                                                                    aria-label={`Delete ${item.name} from cart`}
                                                                >
                                                                    <X size={18} strokeWidth={2.5} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Action Row */}
                                    <div className="dayal-cart-actions-row">
                                        <Link href="/shop" className="cart-continue-link">
                                            <ArrowLeft size={16} />
                                            <span>Continue Shopping</span>
                                        </Link>

                                        <button
                                            type="button"
                                            className="cart-clear-btn"
                                            onClick={clearCart}
                                        >
                                            Clear Cart
                                        </button>
                                    </div>

                                    {/* Coupon Code Card */}
                                    <div className="dayal-cart-coupon-box">
                                        <div className="coupon-box-header">
                                            <Sparkles size={16} />
                                            <span>Have a Promo or Festive Coupon?</span>
                                        </div>
                                        <form onSubmit={handleApplyCoupon} className="coupon-form">
                                            <input
                                                type="text"
                                                placeholder="Enter coupon code (try DAYAL10)"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="coupon-input"
                                            />
                                            <button type="submit" className="coupon-btn">
                                                Apply Coupon
                                            </button>
                                        </form>
                                        {couponMessage && (
                                            <div className={`coupon-feedback ${couponMessage.type}`}>
                                                {couponMessage.text}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Order Summary Sidebar */}
                                <aside className="dayal-cart-summary-column">
                                    <div className="dayal-cart-summary-card">
                                        <h2 className="summary-title">Order Summary</h2>

                                        <div className="summary-rows">
                                            <div className="summary-row">
                                                <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                                                <span>&#8377;{cartSubtotal.toFixed(2)}</span>
                                            </div>

                                            {appliedDiscount > 0 && (
                                                <div className="summary-row discount-row">
                                                    <span>Coupon Discount</span>
                                                    <span>−&#8377;{appliedDiscount.toFixed(2)}</span>
                                                </div>
                                            )}

                                            <div className="summary-row">
                                                <span>Shipping &amp; Packaging</span>
                                                <span>
                                                    {shippingCost === 0 ? (
                                                        <strong className="free-shipping-text">FREE</strong>
                                                    ) : (
                                                        `₹${shippingCost.toFixed(2)}`
                                                    )}
                                                </span>
                                            </div>

                                            <div className="summary-divider" />

                                            <div className="summary-row grand-total-row">
                                                <span>Total Amount</span>
                                                <span className="grand-total">&#8377;{grandTotal.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <p className="summary-tax-note">
                                            * Inclusive of all applicable GST &amp; fresh batch packing.
                                        </p>

                                        <Link href="/checkout" className="btn-proceed-checkout">
                                            Proceed to Checkout
                                        </Link>

                                        {/* Security & Guarantee Pills */}
                                        <div className="summary-guarantees">
                                            <div className="guarantee-item">
                                                <CheckCircle2 size={16} />
                                                <span>100% Pure Desi Ghee &amp; Pure Veg Kitchen</span>
                                            </div>
                                            <div className="guarantee-item">
                                                <Truck size={16} />
                                                <span>Express Insulated Aroma-Lock Dispatch</span>
                                            </div>
                                            <div className="guarantee-item">
                                                <ShieldCheck size={16} />
                                                <span>FSSAI Certified Fresh Batches</span>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
