import React, { useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import Pagination from '@/Components/Pagination';
import ReviewModal from '@/Components/ReviewModal';
import { Search, ShoppingBag, CheckCircle2, Star, Sparkles } from 'lucide-react';

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

    const getStatusInfo = (prod) => {
        switch (prod.delivery_status) {
            case 'delivered':
                return {
                    dotClass: 'delivered',
                    title: `Delivered on ${prod.delivered_date || prod.order_date}`,
                    desc: 'Your pure desi ghee sweet box was delivered',
                    color: '#16A34A',
                };
            case 'out_for_delivery':
                return {
                    dotClass: 'out_for_delivery',
                    title: 'Out for Delivery',
                    desc: 'Your package is out for delivery with our delivery partner',
                    color: '#7C3AED',
                };
            case 'shipping':
                return {
                    dotClass: 'shipping',
                    title: 'In Transit • Dispatched',
                    desc: 'Dispatched from kitchen with express courier',
                    color: '#2563EB',
                };
            case 'pending':
                return {
                    dotClass: 'pending',
                    title: 'Pending',
                    desc: 'Fresh batch being prepared with pure desi ghee',
                    color: '#D97706',
                };
            case 'cancelled':
                return {
                    dotClass: 'cancelled',
                    title: 'Order Cancelled',
                    desc: 'This item was cancelled',
                    color: '#DC2626',
                };
            default:
                return {
                    dotClass: 'pending',
                    title: prod.delivery_status ? prod.delivery_status.charAt(0).toUpperCase() + prod.delivery_status.slice(1) : 'Pending',
                    desc: 'Order confirmed',
                    color: '#475569',
                };
        }
    };

    const statusCounts = useMemo(() => {
        return {
            all: rawSweets.length,
            pending: rawSweets.filter((p) => p.delivery_status === 'pending').length,
            shipping: rawSweets.filter((p) => p.delivery_status === 'shipping').length,
            out_for_delivery: rawSweets.filter((p) => p.delivery_status === 'out_for_delivery').length,
            delivered: rawSweets.filter((p) => p.delivery_status === 'delivered').length,
        };
    }, [rawSweets]);

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
            heroSubtitle="Track each purchased item, check dispatch status, and reorder your favorites in 1-click."
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

            <div className="dayal-myntra-container">
                <div className="dayal-myntra-header-row">
                    <div>
                        <h2 className="myntra-heading">
                            Purchased Items
                        </h2>
                        <p className="myntra-subheading">
                            Every item freshly crafted with 100% pure desi ghee.
                        </p>
                    </div>

                    <Link href="/shop" className="dayal-btn dayal-btn--primary dayal-btn--sm">
                        + Browse Items
                    </Link>
                </div>

                {/* Status Tabs & Search Toolbar */}
                <div className="dayal-myntra-toolbar">
                    <div className="myntra-tabs-nav">
                        {[
                            { id: 'all', label: 'All Items', count: statusCounts.all },
                            { id: 'pending', label: 'Pending', count: statusCounts.pending },
                            { id: 'shipping', label: 'In Transit', count: statusCounts.shipping },
                            { id: 'out_for_delivery', label: 'Out for Delivery', count: statusCounts.out_for_delivery },
                            { id: 'delivered', label: 'Delivered', count: statusCounts.delivered },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(tab.id);
                                    setCurrentPage(1);
                                }}
                                className={`myntra-tab-pill ${statusFilter === tab.id ? 'active' : ''}`}
                            >
                                <span>{tab.label}</span>
                                <span className="myntra-count-badge">{tab.count}</span>
                            </button>
                        ))}
                    </div>

                    <div className="myntra-search-box">
                        <input
                            type="text"
                            value={productSearch}
                            onChange={(e) => {
                                setProductSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search items by name or order #..."
                        />
                        <Search size={15} className="search-icon" />
                    </div>
                </div>

                {/* Myntra Items List */}
                {rawSweets.length > 0 ? (
                    <>
                        {paginatedSweets.length > 0 ? (
                            <div className="dayal-myntra-items-list">
                                {paginatedSweets.map((prod) => {
                                    const statusInfo = getStatusInfo(prod);

                                    return (
                                        <div key={prod.id} className="dayal-myntra-card">
                                            {/* Top Status Bar */}
                                            <div className="myntra-card-topbar">
                                                <div className="myntra-status-left">
                                                    <span className={`status-indicator-dot ${statusInfo.dotClass}`} />
                                                    <div>
                                                        <span className="status-main-label" style={{ color: statusInfo.color }}>
                                                            {statusInfo.title}
                                                        </span>
                                                        <span style={{ margin: '0 8px', color: '#CBD5E1' }}>•</span>
                                                        <span className="status-desc-text">
                                                            {statusInfo.desc}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="myntra-order-meta">
                                                    <span>Order:</span>
                                                    <span className="order-pill">#{prod.order_id}</span>
                                                    <span className="order-date-text">• Ordered on {prod.order_date}</span>
                                                </div>
                                            </div>

                                            {/* Main Content Body */}
                                            <div className="myntra-card-main">
                                                <div className="myntra-product-left">
                                                    <div className="myntra-image-box">
                                                        <img
                                                            src={prod.image || '/uploads/2026/07/kaaju-katli.png'}
                                                            alt={prod.name}
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/uploads/2026/07/kaaju-katli.png';
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="myntra-content-box">
                                                        {/* Show rating on top of this product after rating is provided */}
                                                        {prod.user_rating && (
                                                            <div className="myntra-top-rating-badge">
                                                                <div className="myntra-stars-row">
                                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                                        <Star
                                                                            key={s}
                                                                            size={12}
                                                                            fill={s <= prod.user_rating ? '#F59E0B' : '#E2E8F0'}
                                                                            color={s <= prod.user_rating ? '#F59E0B' : '#CBD5E1'}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <strong className="myntra-rating-score">
                                                                    {Number(prod.user_rating).toFixed(1)} / 5
                                                                </strong>
                                                                <span className="myntra-rating-label">• Your Rating</span>
                                                            </div>
                                                        )}

                                                        <h3 className="myntra-item-name">
                                                            {prod.name}
                                                        </h3>

                                                        <div className="myntra-tags-row">
                                                            <span className="myntra-tag-pill myntra-tag-pill--variant">
                                                                Pack: <strong>{prod.variation_name || 'Standard Pack'}</strong>
                                                            </span>
                                                            <span className="myntra-tag-pill">
                                                                Qty: <strong>{prod.quantity}</strong>
                                                            </span>
                                                            <span className="myntra-tag-pill myntra-tag-pill--quality">
                                                                <Sparkles size={11} color="#C9A96E" />
                                                                <span>100% Desi Ghee</span>
                                                            </span>
                                                        </div>

                                                        <div className="myntra-price-row">
                                                            <span className="item-price">
                                                                ₹{Number(prod.total).toFixed(2)}
                                                            </span>
                                                            <span className="unit-rate">
                                                                (₹{Number(prod.unit_price).toFixed(2)} per pack)
                                                            </span>
                                                        </div>

                                                        {prod.user_review && (
                                                            <div className="myntra-review-quote">
                                                                “{prod.user_review}”
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right Action: Show single Rate Product button only when Delivered & not yet rated */}
                                                {prod.delivery_status === 'delivered' && !prod.user_rating && (
                                                    <div className="myntra-actions-box">
                                                        <button
                                                            type="button"
                                                            onClick={() => setReviewingProduct(prod)}
                                                            className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                        >
                                                            <Star
                                                                size={13}
                                                                color="#631826"
                                                            />
                                                            <span>Rate Product</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
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
                            Browse Dayal Sweets collection and place your first order.
                        </p>
                        <Link href="/shop" className="dayal-btn dayal-btn--primary dayal-btn--sm">
                            Browse Items Now
                        </Link>
                    </div>
                )}
            </div>

            {/* Product Rating & Review Modal (Myntra/Amazon style) */}
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
