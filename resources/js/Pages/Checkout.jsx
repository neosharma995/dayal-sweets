import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { useCart } from '@/Context/CartContext';
import { CheckCircle2, ShieldCheck, Truck, CreditCard, QrCode, Banknote, ArrowLeft, PackageCheck } from 'lucide-react';

export default function Checkout() {
    const { props } = usePage();
    const user = props?.auth?.user;
    const { cart, cartSubtotal, clearCart } = useCart();

    const [formData, setFormData] = useState({
        email: user?.email || '',
        phone: '',
        firstName: user?.name ? user.name.split(' ')[0] : '',
        lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
        address: '',
        apartment: '',
        city: 'Una',
        state: 'Himachal Pradesh',
        pincode: '174303',
        deliveryMethod: 'express',
        paymentMethod: 'cod',
        orderNotes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(null);

    const FREE_SHIPPING_THRESHOLD = 999;
    const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
    const shippingCost = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 50);
    const grandTotal = Math.max(0, cartSubtotal + shippingCost);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const orderId = 'DS-' + Math.floor(100000 + Math.random() * 900000);
            const placedOrder = {
                orderId,
                items: [...cart],
                subtotal: cartSubtotal,
                shipping: shippingCost,
                total: grandTotal,
                customer: { ...formData },
                placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setOrderPlaced(placedOrder);
            clearCart();
            setIsSubmitting(false);
        }, 1200);
    };

    if (orderPlaced) {
        return (
            <div className="dayal-site dayal-checkout-page">
                <Head title="Order Confirmed - Dayal Sweets" />
                <Header />

                <main className="dayal-checkout-success">
                    <div className="success-card">
                        <div className="success-icon-wrap">
                            <PackageCheck size={52} />
                        </div>
                        <span className="success-badge">ORDER CONFIRMED</span>
                        <h1>Thank You for Your Order!</h1>
                        <p className="order-number">
                            Order ID: <strong>{orderPlaced.orderId}</strong>
                        </p>
                        <p className="success-desc">
                            Your handcrafted batch is being carefully prepared in pure desi ghee.
                            We have dispatched a WhatsApp confirmation with live tracking to{' '}
                            <strong>{orderPlaced.customer.phone || 'your phone number'}</strong>.
                        </p>

                        <div className="success-summary-box">
                            <h3>Items Ordered</h3>
                            <ul className="success-items-list">
                                {orderPlaced.items.map((item) => (
                                    <li key={item.id} className="success-item">
                                        <span>
                                            {item.name} × {item.quantity}
                                        </span>
                                        <strong>&#8377;{(item.price * item.quantity).toFixed(2)}</strong>
                                    </li>
                                ))}
                            </ul>
                            <div className="success-total-row">
                                <span>Grand Total Paid ({orderPlaced.customer.paymentMethod.toUpperCase()})</span>
                                <strong>&#8377;{orderPlaced.total.toFixed(2)}</strong>
                            </div>
                        </div>

                        <div className="success-actions">
                            <Link href="/shop" className="dayal-btn dayal-btn--primary">
                                Continue Shopping
                            </Link>
                            <Link href="/my-account" className="dayal-btn dayal-btn--outline">
                                View In My Account
                            </Link>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="dayal-site dayal-checkout-page">
            <Head title="Checkout - Dayal Sweets" />
            <Header />

            <main className="dayal-checkout-main">
                {/* Hero Banner */}
                <section className="dayal-checkout-hero">
                    <div className="dayal-checkout-hero-inner">
                        <nav className="dayal-checkout-breadcrumb" aria-label="Breadcrumb">
                            <Link href="/">Home</Link>
                            <span aria-hidden="true">/</span>
                            <Link href="/cart">Cart</Link>
                            <span aria-hidden="true">/</span>
                            <span className="current">Checkout</span>
                        </nav>
                        <span className="dayal-checkout-hero-eyebrow">— SECURE CHECKOUT —</span>
                        <h1 className="dayal-checkout-hero-title">Shipping &amp; Payment</h1>
                        <p className="dayal-checkout-hero-subtitle">
                            Fast, safe &amp; temperature-controlled dispatch directly to your doorstep
                        </p>
                    </div>
                </section>

                <div className="dayal-checkout-container">
                    {cart.length === 0 ? (
                        <div className="dayal-checkout-empty">
                            <h2>Your Cart is Empty</h2>
                            <p>Please add items to your cart before proceeding to checkout.</p>
                            <Link href="/shop" className="dayal-btn dayal-btn--primary">
                                Back to Shop
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handlePlaceOrder} className="dayal-checkout-form-grid">
                            {/* Left Column: Form Fields */}
                            <div className="checkout-fields-column">
                                {/* 1. Contact Information */}
                                <section className="checkout-section">
                                    <h2 className="section-title">
                                        <span className="step-num">1</span> Contact Information
                                    </h2>
                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                placeholder="yourname@gmail.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone / WhatsApp Number *</label>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                required
                                                placeholder="e.g. +91 98765 43210"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* 2. Delivery Address */}
                                <section className="checkout-section">
                                    <h2 className="section-title">
                                        <span className="step-num">2</span> Delivery Address
                                    </h2>
                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name *</label>
                                            <input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                required
                                                placeholder="First name"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                placeholder="Last name"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address">Street Address / House No. *</label>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            required
                                            placeholder="House / Flat / Street / Landmark"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="apartment">Apartment, Suite, Unit (Optional)</label>
                                        <input
                                            id="apartment"
                                            name="apartment"
                                            type="text"
                                            placeholder="Apartment or suite number"
                                            value={formData.apartment}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-row-3">
                                        <div className="form-group">
                                            <label htmlFor="city">City / Town *</label>
                                            <input
                                                id="city"
                                                name="city"
                                                type="text"
                                                required
                                                placeholder="City"
                                                value={formData.city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="state">State *</label>
                                            <select
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                            >
                                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                                <option value="Punjab">Punjab</option>
                                                <option value="Chandigarh">Chandigarh</option>
                                                <option value="Haryana">Haryana</option>
                                                <option value="Delhi">Delhi</option>
                                                <option value="Uttarakhand">Uttarakhand</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="pincode">PIN Code *</label>
                                            <input
                                                id="pincode"
                                                name="pincode"
                                                type="text"
                                                required
                                                placeholder="PIN Code"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* 3. Payment Method */}
                                <section className="checkout-section">
                                    <h2 className="section-title">
                                        <span className="step-num">3</span> Payment Method
                                    </h2>

                                    <div className="payment-options-grid">
                                        <label className={`payment-option-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={handleChange}
                                            />
                                            <div className="payment-card-content">
                                                <Banknote size={22} className="payment-icon" />
                                                <div className="payment-text">
                                                    <strong>Cash / Pay on Delivery</strong>
                                                    <span>Pay cash or UPI upon doorstep arrival</span>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`payment-option-card ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="upi"
                                                checked={formData.paymentMethod === 'upi'}
                                                onChange={handleChange}
                                            />
                                            <div className="payment-card-content">
                                                <QrCode size={22} className="payment-icon" />
                                                <div className="payment-text">
                                                    <strong>Instant UPI / QR Code</strong>
                                                    <span>Google Pay, PhonePe, Paytm, BHIM</span>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`payment-option-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="card"
                                                checked={formData.paymentMethod === 'card'}
                                                onChange={handleChange}
                                            />
                                            <div className="payment-card-content">
                                                <CreditCard size={22} className="payment-icon" />
                                                <div className="payment-text">
                                                    <strong>Credit / Debit Card / Net Banking</strong>
                                                    <span>Visa, MasterCard, RuPay, All Indian Banks</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </section>

                                {/* 4. Order Notes */}
                                <section className="checkout-section">
                                    <h2 className="section-title">
                                        <span className="step-num">4</span> Special Instructions / Gift Message
                                    </h2>
                                    <div className="form-group">
                                        <textarea
                                            id="orderNotes"
                                            name="orderNotes"
                                            rows="3"
                                            placeholder="Write special delivery instructions, gift box greeting message, or dietary notes..."
                                            value={formData.orderNotes}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </section>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-place-order"
                                >
                                    {isSubmitting ? 'Placing Order...' : `Place Order (₹${grandTotal.toFixed(2)})`}
                                </button>
                            </div>

                            {/* Right Column: Order Review Sidebar */}
                            <aside className="checkout-review-column">
                                <div className="checkout-review-card">
                                    <div className="review-header">
                                        <h2>Order Summary</h2>
                                        <Link href="/cart" className="review-edit-link">
                                            Edit Cart
                                        </Link>
                                    </div>

                                    {/* Items List */}
                                    <ul className="review-items-list">
                                        {cart.map((item) => (
                                            <li key={item.id} className="review-item">
                                                <div className="review-item-img">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/uploads/2026/07/kaaju-katli.png';
                                                        }}
                                                    />
                                                    <span className="review-item-badge">{item.quantity}</span>
                                                </div>
                                                <div className="review-item-info">
                                                    <h4>{item.name}</h4>
                                                    {item.variationLabel && (
                                                        <span className="review-item-var">{item.variationLabel}</span>
                                                    )}
                                                </div>
                                                <div className="review-item-price">
                                                    &#8377;{(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Price Breakdown */}
                                    <div className="review-totals">
                                        <div className="review-total-row">
                                            <span>Subtotal</span>
                                            <span>&#8377;{cartSubtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="review-total-row">
                                            <span>Shipping &amp; Packaging</span>
                                            <span>
                                                {shippingCost === 0 ? (
                                                    <strong className="free-tag">FREE</strong>
                                                ) : (
                                                    `₹${shippingCost.toFixed(2)}`
                                                )}
                                            </span>
                                        </div>
                                        <div className="review-divider" />
                                        <div className="review-total-row final-total-row">
                                            <span>Total</span>
                                            <span className="final-price">&#8377;{grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Quality Assurance Badges */}
                                    <div className="review-perks">
                                        <div className="perk">
                                            <CheckCircle2 size={16} />
                                            <span>100% Pure Desi Ghee &amp; FSSAI Certified</span>
                                        </div>
                                        <div className="perk">
                                            <Truck size={16} />
                                            <span>Aroma-Lock Insulated City Dispatch</span>
                                        </div>
                                        <div className="perk">
                                            <ShieldCheck size={16} />
                                            <span>Zero Preservatives &amp; Fresh Kitchen Batches</span>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
