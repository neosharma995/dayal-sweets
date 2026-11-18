import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';

export default function Index({ orders, counts, filters }) {
    const { activeOutlet } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(filters?.delivery_status || 'all');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(filters?.payment_status || 'all');

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(
            route('admin.orders.index'),
            {
                search,
                delivery_status: selectedDeliveryStatus,
                payment_status: selectedPaymentStatus,
            },
            { preserveState: true }
        );
    };

    const handleStatusFilterChange = (status) => {
        setSelectedDeliveryStatus(status);
        router.get(
            route('admin.orders.index'),
            {
                search,
                delivery_status: status,
                payment_status: selectedPaymentStatus,
            },
            { preserveState: true }
        );
    };

    const handleQuickStatusChange = (orderId, newDeliveryStatus) => {
        router.patch(
            route('admin.orders.update-status', orderId),
            { delivery_status: newDeliveryStatus },
            { preserveScroll: true }
        );
    };

    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!orderToDelete) return;
        router.delete(route('admin.orders.destroy', orderToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setOrderToDelete(null);
            },
        });
    };

    const getDeliveryBadge = (status) => {
        switch (status) {
            case 'pending':
                return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'Pending' };
            case 'shipping':
                return { bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE', label: 'Shipping / In Transit' };
            case 'out_for_delivery':
                return { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF', label: 'Out for Delivery' };
            case 'delivered':
                return { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0', label: 'Delivered' };
            case 'cancelled':
                return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', label: 'Cancelled' };
            default:
                return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', label: status };
        }
    };

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'paid':
                return { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0', label: 'Paid' };
            case 'pending':
                return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', label: 'Pending' };
            case 'failed':
                return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', label: 'Failed' };
            case 'refunded':
                return { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF', label: 'Refunded' };
            default:
                return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', label: status };
        }
    };

    return (
        <AdminLayout
            title="Customer Orders"
            subtitle="Manage online orders, track delivery status & live Razorpay transactions"
        >
            <Head title="Orders Management - Dayal Sweets Admin" />

            {/* Top Metric Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                }}
            >
                {/* Total Orders */}
                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Orders
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                        {counts?.total || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem', fontWeight: 600 }}>
                        All time store records
                    </div>
                </div>

                {/* Pending Orders */}
                <div
                    onClick={() => handleStatusFilterChange('pending')}
                    style={{
                        background: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '0.5rem',
                        border: selectedDeliveryStatus === 'pending' ? '2px solid #D97706' : '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Pending Orders
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B45309', marginTop: '0.35rem' }}>
                        {counts?.pending || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                        Awaiting dispatch
                    </div>
                </div>

                {/* Shipping Orders */}
                <div
                    onClick={() => handleStatusFilterChange('shipping')}
                    style={{
                        background: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '0.5rem',
                        border: selectedDeliveryStatus === 'shipping' ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Shipping / In Transit
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3730A3', marginTop: '0.35rem' }}>
                        {counts?.shipping || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                        Currently in transit
                    </div>
                </div>

                {/* Delivered Orders */}
                <div
                    onClick={() => handleStatusFilterChange('delivered')}
                    style={{
                        background: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '0.5rem',
                        border: selectedDeliveryStatus === 'delivered' ? '2px solid #10B981' : '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Delivered
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803D', marginTop: '0.35rem' }}>
                        {counts?.delivered || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                        Successfully fulfilled
                    </div>
                </div>

                {/* Paid Revenue */}
                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8B1E28', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Paid Revenue
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8B1E28', marginTop: '0.35rem' }}>
                        ₹{(counts?.total_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                        Settled payments
                    </div>
                </div>
            </div>

            {/* Filter Tabs & Search Header */}
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '0.5rem',
                    border: '1px solid #E2E8F0',
                    padding: '1.25rem',
                    marginBottom: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Status Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {[
                            { key: 'all', label: 'All Orders', count: counts?.total },
                            { key: 'pending', label: 'Pending', count: counts?.pending },
                            { key: 'shipping', label: 'Shipping', count: counts?.shipping },
                            { key: 'out_for_delivery', label: 'Out for Delivery', count: counts?.out_for_delivery },
                            { key: 'delivered', label: 'Delivered', count: counts?.delivered },
                            { key: 'cancelled', label: 'Cancelled', count: counts?.cancelled },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleStatusFilterChange(tab.key)}
                                style={{
                                    padding: '0.45rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.8125rem',
                                    fontWeight: selectedDeliveryStatus === tab.key ? 700 : 500,
                                    border: selectedDeliveryStatus === tab.key ? '1px solid #8B1E28' : '1px solid #E2E8F0',
                                    background: selectedDeliveryStatus === tab.key ? '#8B1E28' : '#F8FAFC',
                                    color: selectedDeliveryStatus === tab.key ? '#FFFFFF' : '#475569',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <span>{tab.label}</span>
                                {tab.count !== undefined && (
                                    <span
                                        style={{
                                            fontSize: '0.6875rem',
                                            padding: '0.1rem 0.35rem',
                                            borderRadius: '999px',
                                            background: selectedDeliveryStatus === tab.key ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                                            color: selectedDeliveryStatus === tab.key ? '#FFFFFF' : '#475569',
                                        }}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Action: Create Manual Order */}
                    <Link
                        href={route('admin.orders.create')}
                        className="dayal-btn dayal-btn--primary dayal-btn--sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                    >
                        <span>+</span>
                        <span>Create New Order</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by order ID, customer name, email, phone, or city..."
                            style={{
                                width: '100%',
                                padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.875rem',
                            }}
                        />
                        <svg
                            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>

                    <button
                        type="submit"
                        className="dayal-btn dayal-btn--outline dayal-btn--sm"
                    >
                        Search
                    </button>

                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                router.get(route('admin.orders.index'), { delivery_status: selectedDeliveryStatus });
                            }}
                            className="dayal-btn dayal-btn--ghost dayal-btn--sm"
                        >
                            Reset
                        </button>
                    )}
                </form>
            </div>

            {/* Orders Table */}
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '0.5rem',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '0.85rem 1rem' }}>Order Details</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Items Summary</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Outlet</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Total</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Payment</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Delivery Status</th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data && orders.data.length > 0 ? (
                                orders.data.map((order) => {
                                    const deliveryBadge = getDeliveryBadge(order.delivery_status);
                                    const paymentBadge = getPaymentBadge(order.payment_status);

                                    return (
                                        <tr
                                            key={order.id}
                                            style={{
                                                borderBottom: '1px solid #F1F5F9',
                                                transition: 'background 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                                        >
                                            {/* Order Number & Date */}
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <Link
                                                    href={route('admin.orders.show', order.id)}
                                                    style={{
                                                        color: '#8B1E28',
                                                        fontWeight: 700,
                                                        fontSize: '0.875rem',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    {order.order_number}
                                                </Link>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                                                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </td>

                                            {/* Customer */}
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <div style={{ fontWeight: 600, color: '#0F172A' }}>
                                                    {order.customer_name}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                    {order.customer_email}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                    📞 {order.customer_phone}
                                                </div>
                                            </td>

                                            {/* Items */}
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <div style={{ fontSize: '0.8125rem', color: '#334155' }}>
                                                    {order.items && order.items.length > 0 ? (
                                                        <>
                                                            <span>{order.items[0].product_name} × {order.items[0].quantity}</span>
                                                            {order.items.length > 1 && (
                                                                <span style={{ color: '#8B1E28', fontWeight: 600, marginLeft: '0.35rem' }}>
                                                                    (+{order.items.length - 1} more)
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span style={{ color: '#94A3B8' }}>No items</span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                                                    {order.city}, {order.state}
                                                </div>
                                            </td>

                                            {/* Outlet */}
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                {order.outlet ? (
                                                    <div>
                                                        <Link
                                                            href={route('admin.outlets.show', order.outlet.id)}
                                                            style={{
                                                                fontWeight: 700,
                                                                color: '#0F172A',
                                                                textDecoration: 'none',
                                                                fontSize: '0.8125rem',
                                                                display: 'inline-block',
                                                            }}
                                                            onMouseEnter={(e) => (e.currentTarget.style.color = '#8B1E28')}
                                                            onMouseLeave={(e) => (e.currentTarget.style.color = '#0F172A')}
                                                            title={`View ${order.outlet.name} hub`}
                                                        >
                                                            {order.outlet.name}
                                                        </Link>
                                                        {order.outlet.city && order.outlet.city.toLowerCase() !== order.outlet.name.toLowerCase() && (
                                                            <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.15rem' }}>
                                                                {order.outlet.city}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>—</span>
                                                )}
                                            </td>

                                            {/* Total */}
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem' }}>
                                                    ₹{parseFloat(order.total_amount).toFixed(2)}
                                                </div>
                                                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                                                    {order.shipping_cost > 0 ? `+ ₹${order.shipping_cost} ship` : 'Free shipping'}
                                                </div>
                                            </td>

                                            {/* Payment */}
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '0.2rem 0.55rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 700,
                                                        background: paymentBadge.bg,
                                                        color: paymentBadge.text,
                                                        border: `1px solid ${paymentBadge.border}`,
                                                    }}
                                                >
                                                    {paymentBadge.label}
                                                </span>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem', textTransform: 'uppercase' }}>
                                                    {order.payment_method === 'razorpay' ? 'Razorpay' : order.payment_method}
                                                </div>
                                            </td>

                                            {/* Delivery Status & Quick Changer */}
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '0.2rem 0.55rem',
                                                            borderRadius: '999px',
                                                            fontSize: '0.6875rem',
                                                            fontWeight: 700,
                                                            background: deliveryBadge.bg,
                                                            color: deliveryBadge.text,
                                                            border: `1px solid ${deliveryBadge.border}`,
                                                        }}
                                                    >
                                                        {deliveryBadge.label}
                                                    </span>

                                                    {/* Quick Status Select */}
                                                    <select
                                                        value={order.delivery_status}
                                                        onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            padding: '0.2rem 0.4rem',
                                                            borderRadius: '0.25rem',
                                                            border: '1px solid #CBD5E1',
                                                            background: '#FFFFFF',
                                                            color: '#334155',
                                                            cursor: 'pointer',
                                                        }}
                                                        title="Quick change delivery status"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shipping">Shipping (In Transit)</option>
                                                        <option value="out_for_delivery">Out for Delivery</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                                                    <Link
                                                        href={route('admin.orders.show', order.id)}
                                                        className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                                        style={{ textDecoration: 'none', padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                                                    >
                                                        View Order
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(order)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#EF4444',
                                                            cursor: 'pointer',
                                                            padding: '0.25rem',
                                                            fontSize: '0.75rem',
                                                        }}
                                                        title="Delete order"
                                                    >
                                                        🗑
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem', color: '#334155' }}>
                                            {activeOutlet
                                                ? `No orders found matching your criteria - ${activeOutlet.name}`
                                                : 'No orders found matching your criteria.'}
                                        </p>
                                        <p style={{ margin: '0.25rem 0 1rem 0', fontSize: '0.8125rem' }}>
                                            {activeOutlet
                                                ? `No orders match the selected filters for ${activeOutlet.name}.`
                                                : 'Try adjusting your status tab filter or search query.'}
                                        </p>
                                        <Link href={route('admin.orders.create')} className="dayal-btn dayal-btn--primary dayal-btn--sm">
                                            Create Order Manually
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders && orders.total > 0 && (
                    <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                        <Pagination
                            currentPage={orders.current_page}
                            totalPages={orders.last_page}
                            totalItems={orders.total}
                            itemsPerPage={orders.per_page}
                            onPageChange={(page) => {
                                router.get(
                                    route('admin.orders.index'),
                                    {
                                        search,
                                        delivery_status: selectedDeliveryStatus,
                                        payment_status: selectedPaymentStatus,
                                        page,
                                    },
                                    { preserveState: true }
                                );
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                        Confirm Order Deletion
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0 0 1.25rem 0' }}>
                        Are you sure you want to permanently delete order{' '}
                        <strong>{orderToDelete?.order_number}</strong>? All associated item records will also be removed.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(false)}
                            className="dayal-btn dayal-btn--outline dayal-btn--sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="dayal-btn dayal-btn--danger dayal-btn--sm"
                        >
                            Delete Permanently
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
