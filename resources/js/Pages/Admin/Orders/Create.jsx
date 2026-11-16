import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ users = [], products = [] }) {
    const [userId, setUserId] = useState(users[0]?.id || '');
    const [customerName, setCustomerName] = useState(users[0]?.name || '');
    const [customerEmail, setCustomerEmail] = useState(users[0]?.email || '');
    const [customerPhone, setCustomerPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('Una');
    const [state, setState] = useState('Himachal Pradesh');
    const [pincode, setPincode] = useState('174303');
    const [shippingMethodTitle, setShippingMethodTitle] = useState('Standard Delivery');
    const [shippingCost, setShippingCost] = useState('0');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [deliveryStatus, setDeliveryStatus] = useState('pending');
    const [orderNotes, setOrderNotes] = useState('');

    const [items, setItems] = useState([
        {
            product_id: products[0]?.id || '',
            product_name: products[0]?.product_name || 'Desi Ghee Besan Laddu',
            unit_price: products[0]?.product_selling_price || products[0]?.product_price || 350,
            quantity: 1,
        },
    ]);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUserSelect = (selectedId) => {
        setUserId(selectedId);
        const selectedUser = users.find((u) => String(u.id) === String(selectedId));
        if (selectedUser) {
            setCustomerName(selectedUser.name);
            setCustomerEmail(selectedUser.email);
        }
    };

    const handleProductSelect = (index, prodId) => {
        const selectedProd = products.find((p) => String(p.id) === String(prodId));
        setItems((prev) => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                product_id: prodId,
                product_name: selectedProd ? selectedProd.product_name : next[index].product_name,
                unit_price: selectedProd
                    ? (selectedProd.product_selling_price || selectedProd.product_price)
                    : next[index].unit_price,
            };
            return next;
        });
    };

    const handleItemChange = (index, field, value) => {
        setItems((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const addItemRow = () => {
        const firstProd = products[0];
        setItems((prev) => [
            ...prev,
            {
                product_id: firstProd?.id || '',
                product_name: firstProd?.product_name || 'Assorted Sweets Box',
                unit_price: firstProd ? (firstProd.product_selling_price || firstProd.product_price) : 300,
                quantity: 1,
            },
        ]);
    };

    const removeItemRow = (index) => {
        if (items.length <= 1) return;
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 1), 0);
    const parsedShipping = parseFloat(shippingCost) || 0;
    const grandTotal = subtotal + parsedShipping;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const payload = {
            user_id: userId,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            shipping_address: shippingAddress,
            apartment,
            city,
            state,
            pincode,
            shipping_method_title: shippingMethodTitle,
            shipping_cost: parsedShipping,
            payment_method: paymentMethod,
            payment_status: paymentStatus,
            delivery_status: deliveryStatus,
            order_notes: orderNotes,
            items: items.map((it) => ({
                product_id: it.product_id ? parseInt(it.product_id) : null,
                product_name: it.product_name,
                unit_price: parseFloat(it.unit_price) || 0,
                quantity: parseInt(it.quantity) || 1,
            })),
        };

        router.post(route('admin.orders.store'), payload, {
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AdminLayout
            title="Create New Order"
            subtitle="Manually create and log customer orders with custom items & delivery details"
        >
            <Head title="Create Order - Dayal Sweets Admin" />

            <div style={{ marginBottom: '1.25rem' }}>
                <Link
                    href={route('admin.orders.index')}
                    className="dayal-btn dayal-btn--outline dayal-btn--sm"
                    style={{ textDecoration: 'none' }}
                >
                    ← Back to Orders List
                </Link>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 2fr) minmax(280px, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
                {/* Left Column: Form Fields */}
                <div>
                    {/* 1. Customer Selection */}
                    <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                            1. Customer Information
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                Link Registered Customer User <span style={{ color: '#E11D48' }}>*</span>
                            </label>
                            <select
                                value={userId}
                                onChange={(e) => handleUserSelect(e.target.value)}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                required
                            >
                                <option value="">-- Select Customer Account --</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.email})
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <div style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.user_id}</div>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Recipient Name <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                    required
                                />
                                {errors.customer_name && <div style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.customer_name}</div>}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Recipient Email <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                    required
                                />
                                {errors.customer_email && <div style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.customer_email}</div>}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                Contact Phone Number <span style={{ color: '#E11D48' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                required
                            />
                            {errors.customer_phone && <div style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.customer_phone}</div>}
                        </div>
                    </div>

                    {/* 2. Delivery Address */}
                    <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                            2. Delivery Address
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                House / Street Address <span style={{ color: '#E11D48' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Plot 12, Main Market Road"
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    City <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    State <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    PIN Code <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Items Ordered */}
                    <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                                3. Order Items ({items.length})
                            </h3>
                            <button
                                type="button"
                                onClick={addItemRow}
                                className="dayal-btn dayal-btn--outline dayal-btn--sm"
                            >
                                + Add Sweet Item
                            </button>
                        </div>

                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(200px, 2fr) 100px 80px 100px 36px',
                                    gap: '0.75rem',
                                    alignItems: 'end',
                                    padding: '0.85rem',
                                    borderRadius: '0.375rem',
                                    background: '#F8FAFC',
                                    border: '1px solid #E2E8F0',
                                    marginBottom: '0.75rem',
                                }}
                            >
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                                        Sweet / Product
                                    </label>
                                    <select
                                        value={item.product_id}
                                        onChange={(e) => handleProductSelect(idx, e.target.value)}
                                        style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem' }}
                                    >
                                        <option value="">-- Custom Item --</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.product_name} (₹{p.product_selling_price || p.product_price})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                                        Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={item.unit_price}
                                        onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                                        style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem' }}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                                        Qty
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                                        style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem' }}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                                        Total
                                    </label>
                                    <div style={{ fontWeight: 700, color: '#0F172A', padding: '0.45rem 0', fontSize: '0.875rem' }}>
                                        ₹{((parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 1)).toFixed(2)}
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => removeItemRow(idx)}
                                        disabled={items.length <= 1}
                                        style={{
                                            background: '#FEE2E2',
                                            border: 'none',
                                            color: '#DC2626',
                                            borderRadius: '0.25rem',
                                            width: '32px',
                                            height: '32px',
                                            cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                                            opacity: items.length <= 1 ? 0.5 : 1,
                                        }}
                                        title="Remove item"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Status & Submit */}
                <div>
                    {/* Status & Method Controls */}
                    <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                        <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase' }}>
                            Order Workflow &amp; Status
                        </h4>

                        {/* Delivery Status */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                Delivery Status <span style={{ color: '#E11D48' }}>*</span>
                            </label>
                            <select
                                value={deliveryStatus}
                                onChange={(e) => setDeliveryStatus(e.target.value)}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                            >
                                <option value="pending">Pending (Kitchen Preparation)</option>
                                <option value="shipping">Shipping (Out for Delivery)</option>
                                <option value="delivered">Delivered (Fulfilled)</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Payment Method */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                Payment Method <span style={{ color: '#E11D48' }}>*</span>
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                            >
                                <option value="razorpay">Razorpay Online</option>
                                <option value="cod">Cash on Delivery (COD)</option>
                                <option value="cash">Direct Cash / Store Pickup</option>
                                <option value="bank_transfer">Bank Transfer / NEFT</option>
                            </select>
                        </div>

                        {/* Payment Status */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                Payment Status <span style={{ color: '#E11D48' }}>*</span>
                            </label>
                            <select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                            >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        {/* Shipping Cost */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                Shipping Fee (₹)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={shippingCost}
                                onChange={(e) => setShippingCost(e.target.value)}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>

                        {/* Order Notes */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                Order Notes / Instructions
                            </label>
                            <textarea
                                rows={2}
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                placeholder="Special sweet packaging notes..."
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>

                        {/* Grand Total Preview */}
                        <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.375rem', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#64748B', marginBottom: '0.35rem' }}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#64748B', marginBottom: '0.5rem' }}>
                                <span>Shipping</span>
                                <span>₹{parsedShipping.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 800, color: '#8B1E28', borderTop: '1px solid #CBD5E1', paddingTop: '0.5rem' }}>
                                <span>Total Amount</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Create Order Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="dayal-btn dayal-btn--primary"
                            style={{ width: '100%', padding: '0.75rem', fontWeight: 700, fontSize: '0.9375rem' }}
                        >
                            {isSubmitting ? 'Creating Order...' : `Create Order (₹${grandTotal.toFixed(2)})`}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
