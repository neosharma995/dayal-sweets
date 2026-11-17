import React, { useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import Pagination from '@/Components/Pagination';
import ReviewModal from '@/Components/ReviewModal';
import { Search, ShoppingBag, CheckCircle2, Star } from 'lucide-react';

export default function CustomerPurchasedSweets({
    sweets = [],
    userCreatedProducts = [],
    tier = 'Gold Mithai Club Member',
    ordersCount = 0,
    sweetsCount = 0,
}) {
    const { paginationLimit = 20 } = usePage().props || {};
    const itemsPerPage = paginationLimit || 20;

    const rawSweets = sweets.length > 0 ? sweets : userCreatedProducts;
    const [statusFilter, setStatusFilter] = useState('all');
    const [productSearch, setProductSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState('');
    const [reviewingProduct, setReviewingProduct] = useState(null);

    const getDeliveryBadge = (status) => {
        switch (status) {
            case 'pending':
                return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'Pending' };
            case 'shipping':
                return { bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE', label: 'In Transit' };
            case 'out_for_delivery':
                return { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF', label: 'Out for Delivery' };
            case 'delivered':
                return { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0', label: 'Delivered' };
            case 'cancelled':
                return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', label: 'Cancelled' };
            default:
                return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', label: status || 'Pending' };
        }
    };

    const filteredSweets = useMemo(() => {
        return rawSweets.filter((prod) => {
            const matchesStatus = statusFilter === 'all' || prod.delivery_status === statusFilter;
            const searchLower = productSearch.trim().toLowerCase();
            const matchesSearch =
                !searchLower ||
                prod.name.toLowerCase().includes(searchLower) ||
                (prod.order_id && prod.order_id.toLowerCase().includes(searchLower));
            return matchesStatus && matchesSearch;
        });
    }, [rawSweets, statusFilter, productSearch]);

    const totalPages = Math.ceil(filteredSweets.length / itemsPerPage) || 1;
    const paginatedSweets = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSweets.slice(start, start + itemsPerPage);
    }, [filteredSweets, currentPage, itemsPerPage]);

    return (
        <CustomerPortalLayout
            title="Purchased Items - Dayal Sweets"
            breadcrumbTitle="Purchased Items"
            heroTitle="Purchased Items"
            heroSubtitle="Track each purchased sweet, inspect fulfillment status, and share product ratings."
            activeNav="items"
            tier={tier}
            ordersCount={ordersCount}
            sweetsCount={sweetsCount || rawSweets.length}
        >
            {/* Toast notification */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        background: '#631826',
                        color: '#ffffff',
                        padding: '14px 20px',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 9999,
                        fontSize: '14px',
                        fontWeight: 600,
                    }}
                >
                    <CheckCircle2 size={18} color="#D4AF37" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div>
                {/* Heading & Browse Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#631826', margin: '0 0 4px 0' }}>
                            Purchased Items
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                            Review your sweet items, track fulfillment status, and share product feedback.
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
                            { id: 'all', label: 'All Items' },
                            { id: 'pending', label: 'Pending' },
                            { id: 'shipping', label: 'In Transit' },
                            { id: 'out_for_delivery', label: 'Out for Delivery' },
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

                    <div style={{ position: 'relative', minWidth: '240px' }}>
                        <input
                            type="text"
                            value={productSearch}
                            onChange={(e) => {
                                setProductSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by item or order #..."
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

                {/* Purchased Items Table */}
                {rawSweets && rawSweets.length > 0 ? (
                    <>
                        {paginatedSweets.length > 0 ? (
                            <div style={{ overflowX: 'auto', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #EBE4D8' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #EBE4D8', background: '#FAF7F2', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            <th style={{ padding: '14px 16px' }}>Item</th>
                                            <th style={{ padding: '14px 16px' }}>Order Date</th>
                                            <th style={{ padding: '14px 16px' }}>Status</th>
                                            <th style={{ padding: '14px 16px' }}>Total</th>
                                            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedSweets.map((prod) => {
                                            const badge = getDeliveryBadge(prod.delivery_status);
                                            return (
                                                <tr key={prod.id} style={{ borderBottom: '1px solid #F1E9DF' }}>
                                                    <td style={{ padding: '16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <img
                                                                src={prod.image || '/uploads/2026/07/kaaju-katli.png'}
                                                                alt={prod.name}
                                                                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #EBE4D8', flexShrink: 0 }}
                                                                onError={(e) => { e.currentTarget.src = '/uploads/2026/07/kaaju-katli.png'; }}
                                                            />
                                                            <div>
                                                                <strong style={{ color: '#0F172A', fontSize: '14px', display: 'block' }}>
                                                                    {prod.name}
                                                                </strong>
                                                                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <span style={{ color: '#631826', fontWeight: 600 }}>#{prod.order_id}</span>
                                                                    <span>•</span>
                                                                    <span>Pack: {prod.variation_name || 'Standard Pack'}</span>
                                                                </div>
                                                                {prod.user_review && (
                                                                    <div style={{ fontSize: '11px', color: '#78350F', fontStyle: 'italic', marginTop: '4px', background: '#FEF3C7', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
                                                                        “{prod.user_review}”
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px', color: '#475569', fontSize: '13px' }}>
                                                        {prod.order_date}
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
                                                            {prod.payment_status ? (prod.payment_status.charAt(0).toUpperCase() + prod.payment_status.slice(1)) : 'Paid'}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px', fontWeight: 700, color: '#0F172A' }}>
                                                        ₹{Number(prod.total).toFixed(2)}
                                                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
                                                            Qty: {prod.quantity}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                                        {prod.user_rating ? (
                                                            <span
                                                                style={{
                                                                    padding: '4px 10px',
                                                                    fontSize: '11px',
                                                                    fontWeight: 700,
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    border: '1px solid #FDE68A',
                                                                    color: '#92400E',
                                                                    background: '#FFFBEB',
                                                                    borderRadius: '999px',
                                                                }}
                                                            >
                                                                <Star size={11} fill="#F59E0B" color="#F59E0B" />
                                                                <span>Rated {Number(prod.user_rating).toFixed(1)}</span>
                                                            </span>
                                                        ) : (
                                                            prod.delivery_status === 'delivered' ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setReviewingProduct(prod)}
                                                                    className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                                                    style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                                >
                                                                    <Star size={13} color="#631826" />
                                                                    <span>Rate</span>
                                                                </button>
                                                            ) : (
                                                                <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                                                                    In Transit
                                                                </span>
                                                            )
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748B', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #EBE4D8' }}>
                                <p style={{ margin: 0, fontSize: '15px' }}>No items found matching your search or filter.</p>
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredSweets.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(p) => setCurrentPage(p)}
                            className="mt-6"
                        />
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 16px', color: '#64748B', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #EBE4D8' }}>
                        <ShoppingBag size={48} color="#C9A96E" style={{ margin: '0 auto 16px auto' }} />
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#0F172A', margin: '0 0 8px 0' }}>
                            No Purchased Items Yet
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

            {/* Product Rating & Review Modal */}
            <ReviewModal
                show={Boolean(reviewingProduct)}
                product={reviewingProduct}
                onClose={(submitted) => {
                    if (submitted) {
                        setToastMessage('Thank you! Your rating and review have been submitted.');
                        setTimeout(() => setToastMessage(''), 4500);
                    }
                    setReviewingProduct(null);
                }}
            />
        </CustomerPortalLayout>
    );
}
