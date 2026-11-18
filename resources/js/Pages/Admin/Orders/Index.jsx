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
    const [perPage, setPerPage] = useState(filters?.per_page || 15);
    const [showCards, setShowCards] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const applyFilters = (newParams = {}) => {
        const params = {
            search: newParams.search !== undefined ? newParams.search : search,
            delivery_status: newParams.delivery_status !== undefined ? newParams.delivery_status : selectedDeliveryStatus,
            payment_status: newParams.payment_status !== undefined ? newParams.payment_status : selectedPaymentStatus,
            per_page: newParams.per_page !== undefined ? newParams.per_page : perPage,
        };

        router.get(route('admin.orders.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleStatusFilterChange = (status) => {
        setSelectedDeliveryStatus(status);
        applyFilters({ delivery_status: status });
    };

    const handlePerPageChange = (e) => {
        const val = parseInt(e.target.value, 10);
        setPerPage(val);
        applyFilters({ per_page: val });
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
        <AdminLayout>
            <Head title="Orders Management - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
                {/* Header Row */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.dashboard')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Admin
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Orders</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Customer Orders &amp; Delivery Management
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                            View and manage online customer orders, track real-time delivery status &amp; Razorpay payments.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <button
                            type="button"
                            onClick={() => setShowCards(!showCards)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 0.85rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transform: showCards ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                            <span>{showCards ? 'Hide Summary Cards ▲' : 'Expand Summary Cards ▼'}</span>
                        </button>

                        <Link
                            href={route('admin.orders.create')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 1rem',
                                borderRadius: '0.5rem',
                                background: '#7A1C1C',
                                color: '#FFFFFF',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                        >
                            <span>+</span>
                            <span>Create New Order</span>
                        </Link>
                    </div>
                </div>

                {/* Top Metric Cards - Collapsed by default, counts only, NO clicks */}
                {showCards && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {/* 1. Total Orders */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Total Orders
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                                {counts?.total || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem', fontWeight: 600 }}>
                                All time store records
                            </div>
                        </div>

                        {/* 2. Pending Orders */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Pending Orders
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#B45309', marginTop: '0.35rem' }}>
                                {counts?.pending || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.25rem', fontWeight: 600 }}>
                                Awaiting dispatch
                            </div>
                        </div>

                        {/* 3. Shipping Orders */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Shipping / In Transit
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0369A1', marginTop: '0.35rem' }}>
                                {counts?.shipping || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Currently in transit
                            </div>
                        </div>

                        {/* 4. Delivered Orders */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Delivered
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803D', marginTop: '0.35rem' }}>
                                {counts?.delivered || 0}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>
                                Successfully fulfilled
                            </div>
                        </div>

                        {/* 5. Paid Revenue */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7A1C1C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Paid Revenue
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#7A1C1C', marginTop: '0.35rem' }}>
                                ₹{(counts?.total_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Settled payments
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Filter Buttons without count - Clicks happen here */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {[
                        { key: 'all', label: 'All Orders' },
                        { key: 'pending', label: 'Pending' },
                        { key: 'shipping', label: 'Shipping' },
                        { key: 'out_for_delivery', label: 'Out for Delivery' },
                        { key: 'delivered', label: 'Delivered' },
                        { key: 'cancelled', label: 'Cancelled' },
                    ].map((tab) => {
                        const isActive = selectedDeliveryStatus === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleStatusFilterChange(tab.key)}
                                style={{
                                    padding: '0.45rem 0.9rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.8125rem',
                                    fontWeight: isActive ? 700 : 500,
                                    border: isActive ? '1px solid #7A1C1C' : '1px solid #CBD5E1',
                                    background: isActive ? '#7A1C1C' : '#FFFFFF',
                                    color: isActive ? '#FFFFFF' : '#475569',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    transition: 'all 0.15s ease',
                                    boxShadow: isActive ? '0 1px 2px rgba(122, 28, 28, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
                                }}
                            >
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Search & Filter Toolbar */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        padding: '1rem 1.25rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}
                >
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: '1 1 340px', maxWidth: '480px' }}>
                        <input
                            type="text"
                            placeholder="Search by order ID, customer name, email, phone, city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.8125rem',
                                outline: 'none',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '0.5rem 0.85rem',
                                borderRadius: '0.375rem',
                                background: '#7A1C1C',
                                color: '#FFFFFF',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Search
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    applyFilters({ search: '' });
                                }}
                                style={{
                                    padding: '0.5rem 0.65rem',
                                    borderRadius: '0.375rem',
                                    background: '#F1F5F9',
                                    color: '#475569',
                                    fontSize: '0.8125rem',
                                    border: '1px solid #CBD5E1',
                                    cursor: 'pointer',
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Status:</span>
                            <select
                                value={selectedDeliveryStatus}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="shipping">Shipping</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Per page:</span>
                            <select
                                value={perPage}
                                onChange={handlePerPageChange}
                                style={{
                                    padding: '0.45rem 0.6rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
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
                                                {order.order_type === 'dine_in' && (
                                                    <div style={{ marginTop: '0.25rem' }}>
                                                        <span style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '0.35rem', background: '#FDF8F0', border: '1px solid #E6D2B5', color: '#5A1E1E', fontSize: '0.7rem', fontWeight: 800 }}>
                                                            🍽️ DINE-IN • {order.table_number || 'Table'} {order.table_location ? `(${order.table_location})` : ''}
                                                        </span>
                                                    </div>
                                                )}
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
