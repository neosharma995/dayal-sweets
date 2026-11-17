import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ order }) {
    const [deliveryStatus, setDeliveryStatus] = useState(order.delivery_status);
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        setIsUpdating(true);
        router.patch(
            route('admin.orders.update-status', order.id),
            {
                delivery_status: deliveryStatus,
                payment_status: paymentStatus,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsUpdating(false),
            }
        );
    };

    const getDeliveryStep = (status) => {
        switch (status) {
            case 'pending':
                return order.payment_status === 'paid' ? 2 : 1;
            case 'shipping':
                return 3;
            case 'out_for_delivery':
                return 4;
            case 'delivered':
                return 5;
            default:
                return 1;
        }
    };

    const currentStep = getDeliveryStep(order.delivery_status);

    return (
        <AdminLayout
            title={`Order #${order.order_number}`}
            subtitle={`Placed on ${new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}`}
        >
            <Head title={`Order #${order.order_number} - Admin Portal`} />

            {/* Top Navigation & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <Link
                    href={route('admin.orders.index')}
                    className="dayal-btn dayal-btn--outline dayal-btn--sm"
                    style={{ textDecoration: 'none' }}
                >
                    ← Back to All Orders
                </Link>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="dayal-btn dayal-btn--outline dayal-btn--sm"
                    >
                        🖨 Print Invoice / Packing Slip
                    </button>
                </div>
            </div>

            {/* Visual Delivery Stepper Card */}
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '0.5rem',
                    border: '1px solid #E2E8F0',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8B1E28', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Order Fulfillment Progress
                        </span>
                        <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.125rem', color: '#0F172A', fontWeight: 700 }}>
                            Current Status: <span style={{ color: '#8B1E28', textTransform: 'capitalize' }}>{order.delivery_status}</span>
                        </h3>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span
                            style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: order.payment_status === 'paid' ? '#DCFCE7' : '#FEF3C7',
                                color: order.payment_status === 'paid' ? '#15803D' : '#92400E',
                                border: order.payment_status === 'paid' ? '1px solid #BBF7D0' : '1px solid #FDE68A',
                            }}
                        >
                            Payment: {order.payment_status.toUpperCase()} ({order.payment_method.toUpperCase()})
                        </span>
                    </div>
                </div>

                {/* Progress Steps Timeline */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', position: 'relative' }}>
                    {[
                        { step: 1, title: 'Order Received', desc: 'Order placed & recorded', isDone: currentStep >= 1 },
                        { step: 2, title: 'Pending', desc: 'Order confirmed & pending', isDone: currentStep >= 2 },
                        { step: 3, title: 'Shipping', desc: 'Dispatched from kitchen', isDone: currentStep >= 3 },
                        { step: 4, title: 'Out for Delivery', desc: 'With delivery partner', isDone: currentStep >= 4 },
                        { step: 5, title: 'Delivered', desc: 'Doorstep arrival confirmed', isDone: currentStep >= 5 },
                    ].map((s) => (
                        <div
                            key={s.step}
                            style={{
                                textAlign: 'center',
                                padding: '1rem 0.5rem',
                                borderRadius: '0.375rem',
                                background: s.isDone ? '#F0FDF4' : '#F8FAFC',
                                border: s.isDone ? '1.5px solid #86EFAC' : '1px dashed #CBD5E1',
                            }}
                        >
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    margin: '0 auto 0.5rem auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    background: s.isDone ? '#16A34A' : '#E2E8F0',
                                    color: s.isDone ? '#FFFFFF' : '#64748B',
                                }}
                            >
                                {s.isDone ? '✓' : s.step}
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: s.isDone ? '#166534' : '#475569' }}>
                                {s.title}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '0.2rem' }}>
                                {s.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Status Update Form */}
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '0.5rem',
                    border: '1.5px solid #E2E8F0',
                    padding: '1.25rem 1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
            >
                <form onSubmit={handleUpdateStatus} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Update Delivery Status
                        </label>
                        <select
                            value={deliveryStatus}
                            onChange={(e) => setDeliveryStatus(e.target.value)}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="shipping">Shipping (In Transit)</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered (Completed)</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Update Payment Status
                        </label>
                        <select
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="dayal-btn dayal-btn--primary"
                        style={{ height: '40px', padding: '0 1.25rem', fontSize: '0.875rem' }}
                    >
                        {isUpdating ? 'Saving...' : 'Update Status'}
                    </button>
                </form>
            </div>

            {/* 2-Column Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 2fr) minmax(280px, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
                {/* Left Column: Items Table & Customer Notes */}
                <div>
                    <div
                        style={{
                            background: '#FFFFFF',
                            borderRadius: '0.5rem',
                            border: '1px solid #E2E8F0',
                            overflow: 'hidden',
                            marginBottom: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                    >
                        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                            <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>
                                Items Ordered ({order.items?.length || 0})
                            </h3>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#FFFFFF', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left' }}>Item</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Price</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Qty</th>
                                    <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item) => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '0.85rem 1.25rem' }}>
                                                <div style={{ fontWeight: 600, color: '#0F172A' }}>
                                                    {item.product_name}
                                                </div>
                                                {item.variation_name && (
                                                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                        Variant: {item.variation_name}
                                                    </div>
                                                )}
                                                {item.sku && (
                                                    <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                                                        SKU: {item.sku}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#475569' }}>
                                                ₹{parseFloat(item.unit_price).toFixed(2)}
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 600 }}>
                                                {item.quantity}
                                            </td>
                                            <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                                                ₹{parseFloat(item.total).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                                            No items in this order.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Order Notes / Instructions */}
                    {order.order_notes && (
                        <div
                            style={{
                                background: '#FFFBEB',
                                border: '1px solid #FDE68A',
                                borderRadius: '0.5rem',
                                padding: '1.25rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.875rem', fontWeight: 700, color: '#92400E' }}>
                                📝 Customer Delivery Notes / Gift Message
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#78350F', whiteSpace: 'pre-wrap' }}>
                                {order.order_notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column: Customer Info, Payment & Summary */}
                <div>
                    {/* Customer Information Card */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            borderRadius: '0.5rem',
                            border: '1px solid #E2E8F0',
                            padding: '1.25rem',
                            marginBottom: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                    >
                        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Customer &amp; Shipping
                        </h4>
                        <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem' }}>
                                {order.customer_name}
                            </div>
                            <div style={{ color: '#475569' }}>
                                ✉️ {order.customer_email}
                            </div>
                            <div style={{ color: '#475569' }}>
                                📞 {order.customer_phone}
                            </div>
                            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '0.75rem 0' }} />
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                                Delivery Destination:
                            </div>
                            <div style={{ color: '#334155', marginTop: '0.25rem' }}>
                                {order.shipping_address}
                                {order.apartment && <div>{order.apartment}</div>}
                                <div>
                                    {order.city}, {order.state} - <strong>{order.pincode}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Financials Breakdown */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            borderRadius: '0.5rem',
                            border: '1px solid #E2E8F0',
                            padding: '1.25rem',
                            marginBottom: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                    >
                        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Payment &amp; Totals
                        </h4>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', color: '#475569' }}>
                            <span>Subtotal</span>
                            <span>₹{parseFloat(order.subtotal).toFixed(2)}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', color: '#475569' }}>
                            <span>Shipping ({order.shipping_method_title || 'Standard'})</span>
                            <span>{parseFloat(order.shipping_cost) > 0 ? `₹${parseFloat(order.shipping_cost).toFixed(2)}` : 'FREE'}</span>
                        </div>

                        {parseFloat(order.tax_amount) > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', color: '#475569' }}>
                                <span>Taxes / GST</span>
                                <span>₹{parseFloat(order.tax_amount).toFixed(2)}</span>
                            </div>
                        )}

                        <div style={{ borderTop: '1.5px solid #E2E8F0', margin: '0.75rem 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 800, color: '#8B1E28' }}>
                            <span>Grand Total</span>
                            <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Razorpay Online Payment Verification Details */}
                    <div
                        style={{
                            background: '#F8FAFC',
                            borderRadius: '0.5rem',
                            border: '1px solid #E2E8F0',
                            padding: '1.25rem',
                            fontSize: '0.8125rem',
                        }}
                    >
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                            Gateway Reference
                        </h4>
                        <div style={{ color: '#475569', marginBottom: '0.35rem' }}>
                            <strong>Method:</strong> {order.payment_method.toUpperCase()}
                        </div>
                        {order.razorpay_order_id && (
                            <div style={{ color: '#475569', marginBottom: '0.35rem', wordBreak: 'break-all' }}>
                                <strong>Razorpay Order:</strong> <code>{order.razorpay_order_id}</code>
                            </div>
                        )}
                        {order.razorpay_payment_id && (
                            <div style={{ color: '#475569', marginBottom: '0.35rem', wordBreak: 'break-all' }}>
                                <strong>Payment ID:</strong> <code>{order.razorpay_payment_id}</code>
                            </div>
                        )}
                        {order.paid_at && (
                            <div style={{ color: '#15803D', marginTop: '0.5rem', fontWeight: 600 }}>
                                ✓ Paid at: {new Date(order.paid_at).toLocaleString('en-IN')}
                            </div>
                        )}
                        {order.shipped_at && (
                            <div style={{ color: '#3730A3', marginTop: '0.25rem' }}>
                                🚚 Dispatched at: {new Date(order.shipped_at).toLocaleString('en-IN')}
                            </div>
                        )}
                        {order.delivered_at && (
                            <div style={{ color: '#15803D', marginTop: '0.25rem' }}>
                                📦 Delivered at: {new Date(order.delivered_at).toLocaleString('en-IN')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
