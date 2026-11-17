import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import {
    PackageCheck,
    ShoppingBag,
    MapPin,
    ArrowRight,
    Clock,
    Truck,
    CheckCircle2,
} from 'lucide-react';

export default function CustomerDashboard({
    overview = {},
    activeOrder = null,
    recentPastOrders = [],
    allOrders = [],
    userCreatedProducts = [],
    savedAddress = {},
    customer = {},
    tier = 'Gold Mithai Club Member',
    ordersCount = 0,
    sweetsCount = 0,
}) {
    const { auth } = usePage().props || {};
    const user = auth?.user || customer;
    const resolvedTier = overview.tier || tier || customer?.tier || 'Gold Mithai Club Member';
    const totalOrders = ordersCount || allOrders.length || recentPastOrders.length;
    const totalSweets = sweetsCount || userCreatedProducts.length;

    const getDeliveryBadge = (status) => {
        switch (status) {
            case 'pending':
                return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'Pending' };
            case 'shipping':
                return { bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE', label: 'In Transit / Shipping' };
            case 'delivered':
                return { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0', label: 'Delivered' };
            case 'cancelled':
                return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', label: 'Cancelled' };
            default:
                return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', label: status || 'Pending' };
        }
    };

    const recentOrders = allOrders.slice(0, 3);

    return (
        <CustomerPortalLayout
            title="My Account - Dayal Sweets"
            breadcrumbTitle="Dashboard"
            heroTitle="My Account"
            heroSubtitle="Manage your sweet orders, view purchased products, track dispatches, and edit your account details."
            activeNav="dashboard"
            tier={resolvedTier}
            ordersCount={totalOrders}
            sweetsCount={totalSweets}
        >
            <div>
                {/* Greeting & Quick Summary */}
                <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 12px 0' }}>
                    Hello <strong>{user?.name || 'Customer'}</strong>! Welcome to your Dayal Sweets customer account.
                </p>

                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: '0 0 28px 0' }}>
                    From your account dashboard you can view your{' '}
                    <Link
                        href="/customer/orders"
                        style={{ color: '#631826', fontWeight: 700, textDecoration: 'underline' }}
                    >
                        recent orders
                    </Link>
                    , browse all{' '}
                    <Link
                        href="/customer/purchased-sweets"
                        style={{ color: '#631826', fontWeight: 700, textDecoration: 'underline' }}
                    >
                        purchased items
                    </Link>
                    , manage your{' '}
                    <Link
                        href="/customer/addresses"
                        style={{ color: '#631826', fontWeight: 700, textDecoration: 'underline' }}
                    >
                        shipping addresses
                    </Link>
                    , and edit your{' '}
                    <Link
                        href="/customer/account"
                        style={{ color: '#631826', fontWeight: 700, textDecoration: 'underline' }}
                    >
                        password and account details
                    </Link>
                    .
                </p>

                {/* 3 Quick Navigation Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    <Link
                        href="/customer/orders"
                        style={{
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #EBE4D8',
                            background: '#FAF7F2',
                            textDecoration: 'none',
                            display: 'block',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#631826', marginBottom: '8px' }}>
                            <PackageCheck size={20} />
                            <strong style={{ fontSize: '15px' }}>Orders</strong>
                        </div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                            {totalOrders}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                            View order history &amp; invoices →
                        </div>
                    </Link>

                    <Link
                        href="/customer/purchased-sweets"
                        style={{
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #EBE4D8',
                            background: '#FAF7F2',
                            textDecoration: 'none',
                            display: 'block',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#631826', marginBottom: '8px' }}>
                            <ShoppingBag size={20} />
                            <strong style={{ fontSize: '15px' }}>Purchased Items</strong>
                        </div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                            {totalSweets}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                            Reorder favorite items →
                        </div>
                    </Link>

                    <Link
                        href="/customer/addresses"
                        style={{
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #EBE4D8',
                            background: '#FAF7F2',
                            textDecoration: 'none',
                            display: 'block',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#631826', marginBottom: '8px' }}>
                            <MapPin size={20} />
                            <strong style={{ fontSize: '15px' }}>Shipping Address</strong>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '4px', textTransform: 'capitalize' }}>
                            {savedAddress.city || 'Una'}, {savedAddress.state || 'Himachal'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                            PIN: {savedAddress.pincode || '174303'} →
                        </div>
                    </Link>
                </div>

                {/* Active Order In-Progress Tracker (if any) */}
                {activeOrder && (
                    <div
                        style={{
                            border: '1.5px solid #E2D9CC',
                            borderLeft: '4px solid #631826',
                            borderRadius: '8px',
                            padding: '24px',
                            background: '#FFFFFF',
                            marginBottom: '32px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#631826', letterSpacing: '0.05em' }}>
                                    Active Order In-Progress
                                </span>
                                <h3 style={{ margin: '4px 0 0', fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#0F172A' }}>
                                    Order #{activeOrder.order_id}
                                </h3>
                            </div>
                            <span
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: '999px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    background: '#FEF3C7',
                                    color: '#92400E',
                                }}
                            >
                                {activeOrder.status === 'Kitchen Prep' ? 'Pending' : activeOrder.status}
                            </span>
                        </div>

                        {/* Stepper */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', margin: '20px 0 16px 0', textAlign: 'center' }}>
                            {[
                                { step: 1, title: 'Confirmed' },
                                { step: 2, title: 'Pending' },
                                { step: 3, title: 'In Transit' },
                                { step: 4, title: 'Delivered' },
                            ].map((s) => (
                                <div
                                    key={s.step}
                                    style={{
                                        padding: '8px 4px',
                                        borderRadius: '6px',
                                        background: activeOrder.current_step >= s.step ? 'rgba(99, 24, 38, 0.08)' : '#F8FAFC',
                                        border: activeOrder.current_step >= s.step ? '1px solid #631826' : '1px solid #E2E8F0',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: 800,
                                            color: activeOrder.current_step >= s.step ? '#631826' : '#94A3B8',
                                        }}
                                    >
                                        Step {s.step}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            color: activeOrder.current_step >= s.step ? '#0F172A' : '#94A3B8',
                                            marginTop: '2px',
                                        }}
                                    >
                                        {s.title}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
                            {activeOrder.estimated_delivery}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1E9DF', paddingTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ fontSize: '13px', color: '#475569' }}>
                                Total: <strong>₹{Number(activeOrder.total_amount).toFixed(2)}</strong> via {activeOrder.payment_mode}
                            </div>
                            <Link href="/customer/orders" className="dayal-btn dayal-btn--outline dayal-btn--sm" style={{ padding: '6px 14px', fontSize: '12px' }}>
                                View Order Details →
                            </Link>
                        </div>
                    </div>
                )}

                {/* Recent Orders Overview */}
                <div style={{ background: '#FFFFFF', border: '1px solid #EBE4D8', borderRadius: '8px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#0F172A' }}>
                            Recent Orders
                        </h3>
                        {allOrders.length > 0 && (
                            <Link
                                href="/customer/orders"
                                style={{
                                    fontSize: '13px',
                                    color: '#631826',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}
                            >
                                <span>View all ({totalOrders})</span>
                                <ArrowRight size={14} />
                            </Link>
                        )}
                    </div>

                    {recentOrders.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #EBE4D8', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <th style={{ padding: '10px 12px' }}>Order</th>
                                        <th style={{ padding: '10px 12px' }}>Date</th>
                                        <th style={{ padding: '10px 12px' }}>Status</th>
                                        <th style={{ padding: '10px 12px' }}>Total</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((ord) => {
                                        const badge = getDeliveryBadge(ord.delivery_status);
                                        return (
                                            <tr key={ord.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                                                <td style={{ padding: '12px' }}>
                                                    <strong style={{ color: '#631826' }}>#{ord.order_number}</strong>
                                                    <div style={{ fontSize: '11px', color: '#64748B' }}>{ord.items_summary}</div>
                                                </td>
                                                <td style={{ padding: '12px', color: '#475569' }}>{ord.order_date}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '2px 8px',
                                                            borderRadius: '999px',
                                                            fontSize: '11px',
                                                            fontWeight: 700,
                                                            background: badge.bg,
                                                            color: badge.text,
                                                            border: `1px solid ${badge.border}`,
                                                        }}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px', fontWeight: 700, color: '#0F172A' }}>
                                                    ₹{Number(ord.total_amount).toFixed(2)}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                                    <Link
                                                        href="/customer/orders"
                                                        className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                                        style={{ padding: '4px 10px', fontSize: '11px' }}
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px 16px', color: '#64748B' }}>
                            <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>No orders placed yet.</p>
                            <Link href="/shop" className="dayal-btn dayal-btn--primary dayal-btn--sm">
                                Browse Items
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </CustomerPortalLayout>
    );
}
