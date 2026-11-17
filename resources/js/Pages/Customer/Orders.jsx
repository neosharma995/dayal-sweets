import React, { useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import { Search, Eye, PackageCheck } from 'lucide-react';

export default function CustomerOrders({
    orders = [],
    allOrders = [],
    tier = 'Gold Mithai Club Member',
    ordersCount = 0,
    sweetsCount = 0,
}) {
    const { paginationLimit = 20 } = usePage().props || {};
    const itemsPerPage = paginationLimit || 20;

    const rawOrders = orders.length > 0 ? orders : allOrders;
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

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

    // Filter orders
    const filteredOrders = useMemo(() => {
        return rawOrders.filter((ord) => {
            const matchesStatus = statusFilter === 'all' || ord.delivery_status === statusFilter;
            const searchLower = searchTerm.trim().toLowerCase();
            const matchesSearch =
                !searchLower ||
                (ord.order_number && ord.order_number.toLowerCase().includes(searchLower)) ||
                (ord.items_summary && ord.items_summary.toLowerCase().includes(searchLower));
            return matchesStatus && matchesSearch;
        });
    }, [rawOrders, statusFilter, searchTerm]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(start, start + itemsPerPage);
    }, [filteredOrders, currentPage, itemsPerPage]);

    const handleViewOrder = (ord) => {
        setSelectedOrder(ord);
        setModalOpen(true);
    };

    return (
        <CustomerPortalLayout
            title="My Orders - Dayal Sweets"
            breadcrumbTitle="Orders"
            heroTitle="My Orders"
            heroSubtitle="Complete history and live tracking of your fresh orders."
            activeNav="orders"
            tier={tier}
            ordersCount={ordersCount || rawOrders.length}
            sweetsCount={sweetsCount}
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#631826', margin: '0 0 4px 0' }}>
                            Order History
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                            Track item deliveries, download tax invoices, and inspect order details.
                        </p>
                    </div>

                    <Link href="/shop" className="dayal-btn dayal-btn--primary dayal-btn--sm">
                        + Browse Items
                    </Link>
                </div>

                {/* Toolbar: Filters & Search */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[
                            { id: 'all', label: 'All Orders' },
                            { id: 'pending', label: 'Pending' },
                            { id: 'shipping', label: 'In Transit' },
                            { id: 'delivered', label: 'Delivered' },
                            { id: 'cancelled', label: 'Cancelled' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(tab.id);
                                    setCurrentPage(1);
                                }}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '999px',
                                    border: statusFilter === tab.id ? '1px solid #631826' : '1px solid #CBD5E1',
                                    background: statusFilter === tab.id ? '#631826' : '#FFFFFF',
                                    color: statusFilter === tab.id ? '#FFFFFF' : '#475569',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: 'relative', minWidth: '220px' }}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by order #..."
                            style={{
                                width: '100%',
                                padding: '8px 12px 8px 32px',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                fontSize: '13px',
                            }}
                        />
                        <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    </div>
                </div>

                {/* Orders Table */}
                {rawOrders && rawOrders.length > 0 ? (
                    <>
                        {paginatedOrders.length > 0 ? (
                            <div style={{ overflowX: 'auto', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #EBE4D8' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #EBE4D8', background: '#FAF7F2', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            <th style={{ padding: '14px 16px' }}>Order</th>
                                            <th style={{ padding: '14px 16px' }}>Date</th>
                                            <th style={{ padding: '14px 16px' }}>Status</th>
                                            <th style={{ padding: '14px 16px' }}>Total</th>
                                            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedOrders.map((ord) => {
                                            const badge = getDeliveryBadge(ord.delivery_status);
                                            return (
                                                <tr key={ord.id} style={{ borderBottom: '1px solid #F1E9DF' }}>
                                                    <td style={{ padding: '16px' }}>
                                                        <strong style={{ color: '#631826' }}>
                                                            #{ord.order_number}
                                                        </strong>
                                                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                                                            {ord.items_summary}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px', color: '#475569' }}>
                                                        {ord.order_date}
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <span
                                                            style={{
                                                                display: 'inline-block',
                                                                padding: '3px 8px',
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
                                                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
                                                            {ord.payment_method?.toUpperCase()} ({ord.payment_status})
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px', fontWeight: 700, color: '#0F172A' }}>
                                                        ₹{Number(ord.total_amount).toFixed(2)}
                                                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
                                                            for {ord.items_count} item{ord.items_count === 1 ? '' : 's'}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleViewOrder(ord)}
                                                            className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                                            style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                        >
                                                            <Eye size={13} />
                                                            <span>Details</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748B', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #EBE4D8' }}>
                                <p style={{ margin: 0, fontSize: '15px' }}>No orders found matching your search or filter.</p>
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredOrders.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(p) => setCurrentPage(p)}
                            className="mt-6"
                        />
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 16px', color: '#64748B', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #EBE4D8' }}>
                        <PackageCheck size={48} color="#C9A96E" style={{ margin: '0 auto 16px auto' }} />
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#0F172A', margin: '0 0 8px 0' }}>
                            No Orders Yet
                        </h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px' }}>
                            You haven't placed any orders yet. Discover our fresh collection!
                        </p>
                        <Link href="/shop" className="dayal-btn dayal-btn--primary dayal-btn--sm">
                            Browse Items Catalog
                        </Link>
                    </div>
                )}
            </div>

            {/* ORDER DETAILS MODAL */}
            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                {selectedOrder && (
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #EBE4D8', paddingBottom: '12px' }}>
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#631826' }}>
                                    Order Details
                                </span>
                                <h3 style={{ margin: '2px 0 0', fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#0F172A' }}>
                                    #{selectedOrder.order_number}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                            Ordered on: <strong>{selectedOrder.order_date || selectedOrder.created_at_formatted}</strong>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', margin: '0 0 10px 0' }}>
                                Items in Order
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(selectedOrder.items || []).map((it) => (
                                    <div
                                        key={it.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px 12px',
                                            borderRadius: '6px',
                                            background: '#FAF7F2',
                                            border: '1px solid #EBE4D8',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img
                                                src={it.product_image || '/uploads/2026/07/kaaju-katli.png'}
                                                alt={it.product_name}
                                                style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                                                onError={(e) => { e.currentTarget.src = '/uploads/2026/07/kaaju-katli.png'; }}
                                            />
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                                                    {it.product_name}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#64748B' }}>
                                                    {it.variation_name || 'Standard'} • Qty: {it.quantity}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#631826' }}>
                                            ₹{Number(it.total).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '14px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>
                                <span>Subtotal</span>
                                <span>₹{Number(selectedOrder.subtotal || selectedOrder.total_amount).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>
                                <span>Shipping ({selectedOrder.shipping_method_title || 'Express'})</span>
                                <span>{Number(selectedOrder.shipping_cost || 0) > 0 ? `₹${Number(selectedOrder.shipping_cost).toFixed(2)}` : 'FREE'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: '#0F172A', borderTop: '1px solid #CBD5E1', paddingTop: '8px' }}>
                                <span>Total Paid</span>
                                <span style={{ color: '#631826' }}>₹{Number(selectedOrder.total_amount).toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '20px', lineHeight: '1.6' }}>
                            <strong>Delivery Destination:</strong><br />
                            {selectedOrder.shipping_address}{selectedOrder.apartment ? `, ${selectedOrder.apartment}` : ''}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                style={{ padding: '8px 16px', fontSize: '13px' }}
                            >
                                Print Invoice
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="dayal-btn dayal-btn--primary dayal-btn--sm"
                                style={{ padding: '8px 16px', fontSize: '13px' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </CustomerPortalLayout>
    );
}
