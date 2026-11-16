import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { useCart } from '@/Context/CartContext';
import {
    CheckCircle2,
    ShieldCheck,
    Truck,
    CreditCard,
    QrCode,
    Banknote,
    ArrowLeft,
    PackageCheck,
    AlertCircle,
    Lock,
    ExternalLink
} from 'lucide-react';
import axios from 'axios';

export default function Checkout({ razorpayKey }) {
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
        paymentMethod: 'razorpay', // 'razorpay' or 'cod'
        orderNotes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(null);

    // Keep formData synced if user logs in or profile changes
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                email: prev.email || user.email || '',
                firstName: prev.firstName || (user.name ? user.name.split(' ')[0] : ''),
                lastName: prev.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
            }));
        }
    }, [user]);

    // Dynamically load Razorpay checkout script
    useEffect(() => {
        if (!document.getElementById('razorpay-sdk-script')) {
            const script = document.createElement('script');
            script.id = 'razorpay-sdk-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const FREE_SHIPPING_THRESHOLD = 999;
    const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
    const shippingCost = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 50);
    const grandTotal = Math.max(0, cartSubtotal + shippingCost);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!user) {
            setErrorMessage('You must be logged in to place an order. Please log in or create an account to proceed.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (cart.length === 0) {
            setErrorMessage('Your cart is empty. Please add sweets before placing an order.');
            return;
        }

        setIsSubmitting(true);

        const customerName = `${formData.firstName} ${formData.lastName}`.trim() || user.name;
        const payload = {
            customer_name: customerName,
            customer_email: formData.email,
            customer_phone: formData.phone,
            shipping_address: formData.address,
            apartment: formData.apartment || null,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            shipping_method_title: formData.deliveryMethod === 'express' ? 'Fresh Express Dispatch' : 'Standard Delivery',
            shipping_cost: shippingCost,
            order_notes: formData.orderNotes || null,
            items: cart.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                variationId: item.variationId || null,
                variationLabel: item.variationLabel || null,
                image: item.image || null,
            })),
        };

        // Case 1: Cash on Delivery
        if (formData.paymentMethod === 'cod') {
            try {
                const response = await axios.post(route('checkout.cod.place'), payload);
                if (response.data.success) {
                    setOrderPlaced({
                        orderId: response.data.order_number,
                        internalId: response.data.order_id,
                        items: [...cart],
                        subtotal: cartSubtotal,
                        shipping: shippingCost,
                        total: grandTotal,
                        customer: { ...formData, customerName, paymentMethodName: 'Cash on Delivery (Pending)' },
                        placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    });
                    clearCart();
                } else {
                    setErrorMessage(response.data.message || 'Failed to place COD order.');
                }
            } catch (err) {
                console.error(err);
                setErrorMessage(err.response?.data?.message || 'Failed to place order. Please check all details and try again.');
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        // Case 2: Online Payment via Razorpay
        try {
            const createRes = await axios.post(route('checkout.razorpay.create'), payload);
            const rzpData = createRes.data;

            if (!rzpData.success) {
                setErrorMessage(rzpData.message || 'Unable to start online payment session.');
                setIsSubmitting(false);
                return;
            }

            const razorpayKeyToUse = rzpData.key || razorpayKey;

            const options = {
                key: razorpayKeyToUse,
                amount: rzpData.amount,
                currency: rzpData.currency || 'INR',
                name: 'Dayal Sweets',
                description: `Order #${rzpData.order_number} - Pure Desi Ghee Sweets`,
                order_id: rzpData.razorpay_order_id,
                prefill: {
                    name: rzpData.customer.name,
                    email: rzpData.customer.email,
                    contact: rzpData.customer.contact,
                },
                notes: {
                    order_number: rzpData.order_number,
                },
                theme: {
                    color: '#8B1E28', // Dayal Sweets Royal Maroon
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(route('checkout.razorpay.verify'), {
                            order_id: rzpData.order_id || null,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            checkout_payload: orderPayload,
                        });

                        if (verifyRes.data.success) {
                            setOrderPlaced({
                                orderId: verifyRes.data.order_number,
                                internalId: verifyRes.data.order_id,
                                items: [...cart],
                                subtotal: cartSubtotal,
                                shipping: shippingCost,
                                total: grandTotal,
                                customer: { ...formData, customerName, paymentMethodName: 'Razorpay Online (Paid)' },
                                paymentId: response.razorpay_payment_id,
                                placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            });
                            clearCart();
                        } else {
                            setErrorMessage(verifyRes.data.message || 'Payment verification failed.');
                        }
                    } catch (verifyErr) {
                        console.error('Verification error:', verifyErr);
                        setErrorMessage(
                            verifyErr.response?.data?.message ||
                            'Payment was charged but verification failed. Please contact Dayal Sweets support.'
                        );
                    } finally {
                        setIsSubmitting(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsSubmitting(false);
                        setErrorMessage('Payment was cancelled or closed. No order was created and your cart is preserved.');
                    },
                },
            };

            if (typeof window.Razorpay === 'undefined') {
                setErrorMessage('Razorpay payment gateway is loading. Please click "Pay Now" again in a moment.');
                setIsSubmitting(false);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (resp) {
                setIsSubmitting(false);
                setErrorMessage(resp.error?.description || 'Payment failed. No order was created. You may try again or pick Cash on Delivery.');
            });
            rzp.open();
        } catch (err) {
            console.error('Razorpay creation error:', err);
            setErrorMessage(err.response?.data?.message || 'Could not initiate Razorpay checkout.');
            setIsSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="dayal-site dayal-checkout-page">
                <Head title="Order Confirmed - Dayal Sweets" />
                <Header />

                <main className="dayal-checkout-success">
                    <div className="success-card">
                        <div className="success-icon-wrap" style={{ background: '#DCFCE7', color: '#15803D' }}>
                            <PackageCheck size={52} />
                        </div>
                        <span className="success-badge" style={{ background: '#DCFCE7', color: '#15803D' }}>
                            ORDER CONFIRMED &amp; SAVED
                        </span>
                        <h1>Thank You for Your Order!</h1>
                        <p className="order-number">
                            Order ID: <strong>{orderPlaced.orderId}</strong>
                        </p>
                        <p className="success-desc">
                            Your handcrafted batch is now in our kitchen, being prepared in 100% pure desi ghee.
                            We have recorded this purchase in your account dashboard and sent confirmation to{' '}
                            <strong>{orderPlaced.customer.phone || orderPlaced.customer.email}</strong>.
                        </p>

                        <div className="success-summary-box">
                            <h3>Items Ordered</h3>
                            <ul className="success-items-list">
                                {orderPlaced.items.map((item, idx) => (
                                    <li key={idx} className="success-item">
                                        <span>
                                            {item.name} {item.variationLabel ? `(${item.variationLabel})` : ''} × {item.quantity}
                                        </span>
                                        <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                                    </li>
                                ))}
                            </ul>
                            <div className="success-total-row">
                                <span>Grand Total ({orderPlaced.customer.paymentMethodName})</span>
                                <strong>₹{orderPlaced.total.toFixed(2)}</strong>
                            </div>
                        </div>

                        <div className="success-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href={route('customer.dashboard')} className="dayal-btn dayal-btn--primary">
                                View Order in Dashboard →
                            </Link>
                            <Link href="/shop" className="dayal-btn dayal-btn--outline">
                                Continue Shopping
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
                            Pure Desi Ghee Sweets • Fast, safe &amp; temperature-controlled doorstep dispatch
                        </p>
                    </div>
                </section>

                <div className="dayal-checkout-container">
                    {/* Error Banner */}
                    {errorMessage && (
                        <div
                            style={{
                                background: '#FEF2F2',
                                border: '1.5px solid #FECACA',
                                color: '#991B1B',
                                padding: '1rem 1.25rem',
                                borderRadius: '0.5rem',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.875rem',
                            }}
                        >
                            <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
                            <div>{errorMessage}</div>
                        </div>
                    )}

                    {/* Login Notice Banner if Guest */}
                    {!user && (
                        <div
                            style={{
                                background: '#FFFBEB',
                                border: '1.5px solid #FDE68A',
                                borderRadius: '0.75rem',
                                padding: '1.25rem 1.5rem',
                                marginBottom: '1.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '1rem',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <div
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '50%',
                                        background: '#FEF3C7',
                                        color: '#B45309',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: '#92400E', fontSize: '0.9375rem', fontWeight: 700 }}>
                                        Account Login Required to Place Order
                                    </h4>
                                    <p style={{ margin: '0.2rem 0 0 0', color: '#B45309', fontSize: '0.8125rem' }}>
                                        Please log in or register so your purchase records, invoice history, and delivery tracking are saved to your customer dashboard.
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link
                                    href="/login"
                                    className="dayal-btn dayal-btn--primary dayal-btn--sm"
                                    style={{ textDecoration: 'none', padding: '0.5rem 1.25rem' }}
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                    style={{ textDecoration: 'none', padding: '0.5rem 1.25rem' }}
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    )}

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
                                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                <option value="Rajasthan">Rajasthan</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Gujarat">Gujarat</option>
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
                                        {/* Razorpay Online */}
                                        <label
                                            className={`payment-option-card ${
                                                formData.paymentMethod === 'razorpay' ? 'selected' : ''
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="razorpay"
                                                checked={formData.paymentMethod === 'razorpay'}
                                                onChange={handleChange}
                                            />
                                            <div className="payment-card-content">
                                                <div style={{ display: 'flex', gap: '0.5rem', color: '#8B1E28' }}>
                                                    <CreditCard size={22} className="payment-icon" />
                                                    <QrCode size={22} className="payment-icon" />
                                                </div>
                                                <div className="payment-text">
                                                    <strong>Online Payment via Razorpay</strong>
                                                    <span>UPI (GPay, PhonePe, Paytm), Cards (Visa, RuPay), NetBanking</span>
                                                </div>
                                                <span
                                                    style={{
                                                        marginLeft: 'auto',
                                                        background: '#ECFDF5',
                                                        color: '#065F46',
                                                        padding: '0.2rem 0.5rem',
                                                        borderRadius: '0.25rem',
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Instant &amp; Secure
                                                </span>
                                            </div>
                                        </label>

                                        {/* Cash on Delivery */}
                                        <label
                                            className={`payment-option-card ${
                                                formData.paymentMethod === 'cod' ? 'selected' : ''
                                            }`}
                                        >
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
                                                    <strong>Cash / Pay on Delivery (COD)</strong>
                                                    <span>Pay cash or UPI upon doorstep arrival</span>
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
                                    disabled={isSubmitting || !user}
                                    className="btn-place-order"
                                    style={{
                                        opacity: (!user || isSubmitting) ? 0.75 : 1,
                                        cursor: (!user || isSubmitting) ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {isSubmitting
                                        ? 'Processing Order...'
                                        : !user
                                        ? 'Login Required to Place Order'
                                        : formData.paymentMethod === 'razorpay'
                                        ? `Pay Securely via Razorpay (₹${grandTotal.toFixed(2)})`
                                        : `Place Order with COD (₹${grandTotal.toFixed(2)})`}
                                </button>
                                {!user && (
                                    <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8125rem', color: '#B45309' }}>
                                        Please <Link href="/login" style={{ textDecoration: 'underline', fontWeight: 600 }}>log in</Link> to enable order placement.
                                    </p>
                                )}
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
                                        {cart.map((item, idx) => (
                                            <li key={idx} className="review-item">
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
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Price Breakdown */}
                                    <div className="review-totals">
                                        <div className="review-total-row">
                                            <span>Subtotal</span>
                                            <span>₹{cartSubtotal.toFixed(2)}</span>
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
                                            <span className="final-price">₹{grandTotal.toFixed(2)}</span>
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
