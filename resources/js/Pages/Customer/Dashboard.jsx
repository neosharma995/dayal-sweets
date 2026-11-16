import React, { useState, useMemo } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import FlashToaster from '@/Components/FlashToaster';
import Modal from '@/Components/Modal';
import { useCart } from '@/Context/CartContext';
import {
    LayoutDashboard,
    PackageCheck,
    ShoppingBag,
    MapPin,
    UserCheck,
    LogOut,
    CheckCircle2,
    Clock,
    Search,
    RotateCcw,
    Truck,
    Star,
    PhoneCall,
    Eye,
    ExternalLink,
    Lock,
    Key
} from 'lucide-react';

export default function CustomerDashboard({
    overview = {},
    activeOrder = null,
    allOrders = [],
    userCreatedProducts = [],
    savedAddress = {},
    customer = {},
}) {
    const { auth } = usePage().props;
    const user = auth?.user || customer;
    const { addToCart } = useCart();

    // Default to 'dashboard' tab (or 'orders' / 'products' if query param set)
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleConfirmLogout = () => {
        setLoggingOut(true);
        router.post(route('logout'), {}, {
            onFinish: () => {
                setLoggingOut(false);
                setLogoutModalOpen(false);
            },
        });
    };

    // Search and filter for purchased products
    const [productSearch, setProductSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toastMessage, setToastMessage] = useState('');

    // Profile form
    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.patch(route('customer.account.profile'), {
            preserveScroll: true,
            onSuccess: () => {
                setToastMessage('Account details updated successfully!');
                setTimeout(() => setToastMessage(''), 4500);
            },
        });
    };

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route('customer.account.password'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setToastMessage('Password updated successfully!');
                setTimeout(() => setToastMessage(''), 4500);
            },
        });
    };

    // Calculate counts for Myntra-style status filter tabs
    const statusCounts = useMemo(() => {
        return {
            all: userCreatedProducts.length,
            pending: userCreatedProducts.filter((p) => p.delivery_status === 'pending').length,
            shipping: userCreatedProducts.filter((p) => p.delivery_status === 'shipping').length,
            delivered: userCreatedProducts.filter((p) => p.delivery_status === 'delivered').length,
        };
    }, [userCreatedProducts]);

    // Star rating state for purchased sweets (Myntra feature)
    const [itemRatings, setItemRatings] = useState({});
    const handleItemRating = (itemId, starValue) => {
        setItemRatings((prev) => ({ ...prev, [itemId]: starValue }));
        setToastMessage(`Thank you for rating ${starValue} star${starValue > 1 ? 's' : ''}!`);
        setTimeout(() => setToastMessage(''), 3500);
    };

    // Filter user created / purchased products
    const filteredUserProducts = useMemo(() => {
        return userCreatedProducts.filter((p) => {
            const matchesSearch =
                !productSearch.trim() ||
                p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                p.order_id.toLowerCase().includes(productSearch.toLowerCase()) ||
                (p.variation_name && p.variation_name.toLowerCase().includes(productSearch.toLowerCase()));

            const matchesStatus =
                statusFilter === 'all' || p.delivery_status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [userCreatedProducts, productSearch, statusFilter]);

    // 1-Click Reorder Sweet
    const handleReorder = (product) => {
        addToCart(
            {
                id: product.product_id || product.id,
                name: product.name,
                price: product.unit_price,
                image: product.image,
            },
            1,
            product.variation_name
                ? { label: product.variation_name, price: product.unit_price }
                : null
        );

        setToastMessage(`Added "${product.name}" to your shopping bag!`);
        setTimeout(() => setToastMessage(''), 4500);
    };

    // Open detailed order view by order object
    const handleViewOrder = (order) => {
        setSelectedOrderDetails(order);
        setOrderModalOpen(true);
    };

    // Open detailed order view by order number (from Myntra item card)
    const handleViewOrderByNumber = (orderNumber) => {
        const found = allOrders.find(
            (o) => o.order_number === orderNumber || o.order_id === orderNumber
        );
        if (found) {
            setSelectedOrderDetails(found);
            setOrderModalOpen(true);
        } else {
            setActiveTab('orders');
        }
    };

    const getMyntraStatusInfo = (prod) => {
        switch (prod.delivery_status) {
            case 'delivered':
                return {
                    dotClass: 'delivered',
                    title: `Delivered on ${prod.delivered_date || prod.order_date}`,
                    desc: 'Your pure desi ghee sweet box was delivered',
                    color: '#16A34A',
                };
            case 'shipping':
                return {
                    dotClass: 'shipping',
                    title: 'In Transit • Out for Delivery',
                    desc: 'Dispatched from Una kitchen with express courier',
                    color: '#2563EB',
                };
            case 'pending':
                return {
                    dotClass: 'pending',
                    title: 'Kitchen Preparation',
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
                    title: prod.delivery_status || 'Order Placed',
                    desc: 'Order confirmed',
                    color: '#475569',
                };
        }
    };

    const getDeliveryBadge = (status) => {
        switch (status) {
            case 'pending':
                return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'Kitchen Prep' };
            case 'shipping':
                return { bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE', label: 'In Transit / Shipping' };
            case 'delivered':
                return { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0', label: 'Delivered' };
            case 'cancelled':
                return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', label: 'Cancelled' };
            default:
                return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', label: status };
        }
    };

    return (
        <div className="dayal-site dayal-dashboard-page">
            <Head title="My Account - Dayal Sweets" />

            {/* Modular Site Header with Cart Trigger */}
            <Header />

            {/* Global Flash Toaster */}
            <FlashToaster />

            {/* In-page Toast Feedback */}
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

            <main>
                {/* Hero Banner matching Cart & Checkout Page Design */}
                <section className="dayal-dashboard-hero">
                    <div className="dayal-dashboard-hero-inner">
                        <nav className="dayal-dashboard-breadcrumb" aria-label="Breadcrumb">
                            <Link href="/">Home</Link>
                            <span aria-hidden="true">/</span>
                            <span className="current">My Account</span>
                        </nav>
                        <span className="dayal-dashboard-hero-eyebrow">
                            — PURE DESI GHEE SWEETS • SINCE 1952 —
                        </span>
                        <h1 className="dayal-dashboard-hero-title">
                            My Account
                        </h1>
                        <p className="dayal-dashboard-hero-subtitle">
                            Manage your sweet orders, view purchased products, track dispatches, and edit your account details.
                        </p>
                    </div>
                </section>

                <div className="dayal-dashboard-container">
                    {/* Classic WooCommerce 2-Column Layout */}
                    <div className="dayal-myaccount-layout">
                        {/* ========================================================= */}
                        {/* LEFT COLUMN: WooCommerce Sidebar Navigation               */}
                        {/* ========================================================= */}
                        <aside className="dayal-myaccount-sidebar">
                            <div className="myaccount-user-card">
                                <div className="myaccount-avatar">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="myaccount-meta">
                                    <h3>{user?.name || 'Customer'}</h3>
                                    <p>{user?.email}</p>
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            marginTop: '4px',
                                            background: 'rgba(212, 175, 55, 0.2)',
                                            color: '#E6CA92',
                                            padding: '2px 8px',
                                            borderRadius: '999px',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {overview.tier || 'Gold Mithai Club'}
                                    </span>
                                </div>
                            </div>

                            <ul className="myaccount-nav-list">
                                <li className="myaccount-nav-item">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('dashboard')}
                                        className={activeTab === 'dashboard' ? 'active' : ''}
                                    >
                                        <LayoutDashboard size={17} />
                                        <span>Dashboard</span>
                                    </button>
                                </li>

                                <li className="myaccount-nav-item">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('orders')}
                                        className={activeTab === 'orders' ? 'active' : ''}
                                    >
                                        <PackageCheck size={17} />
                                        <span>Orders</span>
                                        {allOrders.length > 0 && (
                                            <span className="nav-badge">{allOrders.length}</span>
                                        )}
                                    </button>
                                </li>

                                <li className="myaccount-nav-item">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('products')}
                                        className={activeTab === 'products' ? 'active' : ''}
                                    >
                                        <ShoppingBag size={17} />
                                        <span>Purchased Sweets</span>
                                        {userCreatedProducts.length > 0 && (
                                            <span className="nav-badge">{userCreatedProducts.length}</span>
                                        )}
                                    </button>
                                </li>

                                <li className="myaccount-nav-item">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('addresses')}
                                        className={activeTab === 'addresses' ? 'active' : ''}
                                    >
                                        <MapPin size={17} />
                                        <span>Addresses</span>
                                    </button>
                                </li>

                                <li className="myaccount-nav-item">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('account')}
                                        className={activeTab === 'account' ? 'active' : ''}
                                    >
                                        <UserCheck size={17} />
                                        <span>Account Details</span>
                                    </button>
                                </li>

                                <li className="myaccount-nav-item" style={{ borderTop: '1px solid #F1E9DF', marginTop: '6px', paddingTop: '6px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setLogoutModalOpen(true)}
                                        style={{ color: '#DC2626' }}
                                    >
                                        <LogOut size={17} color="#DC2626" />
                                        <span>Log Out</span>
                                    </button>
                                </li>
                            </ul>
                        </aside>

                        {/* ========================================================= */}
                        {/* RIGHT COLUMN: Active Content Area                         */}
                        {/* ========================================================= */}
                        <div className="dayal-myaccount-content">
                            {/* 1. DASHBOARD OVERVIEW TAB */}
                            {activeTab === 'dashboard' && (
                                <div>
                                    <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                                        Hello <strong>{user?.name}</strong> (not <strong>{user?.name}</strong>?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setLogoutModalOpen(true)}
                                            style={{ background: 'none', border: 'none', color: '#631826', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                                        >
                                            Log out
                                        </button>
                                        )
                                    </p>

                                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: '0 0 28px 0' }}>
                                        From your account dashboard you can view your{' '}
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('orders')}
                                            style={{ background: 'none', border: 'none', color: '#631826', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                                        >
                                            recent orders
                                        </button>
                                        , browse all{' '}
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('products')}
                                            style={{ background: 'none', border: 'none', color: '#631826', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                                        >
                                            purchased sweets
                                        </button>
                                        , manage your{' '}
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('addresses')}
                                            style={{ background: 'none', border: 'none', color: '#631826', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                                        >
                                            shipping addresses
                                        </button>
                                        , and edit your{' '}
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('account')}
                                            style={{ background: 'none', border: 'none', color: '#631826', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                                        >
                                            password and account details
                                        </button>
                                        .
                                    </p>

                                    {/* 3 Quick Navigation Summary Cards */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                                        <div
                                            onClick={() => setActiveTab('orders')}
                                            style={{
                                                padding: '20px',
                                                borderRadius: '8px',
                                                border: '1px solid #EBE4D8',
                                                background: '#FAF7F2',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#631826', marginBottom: '8px' }}>
                                                <PackageCheck size={20} />
                                                <strong style={{ fontSize: '15px' }}>Orders</strong>
                                            </div>
                                            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                                                {allOrders.length}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                                                View order history &amp; invoices →
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => setActiveTab('products')}
                                            style={{
                                                padding: '20px',
                                                borderRadius: '8px',
                                                border: '1px solid #EBE4D8',
                                                background: '#FAF7F2',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#631826', marginBottom: '8px' }}>
                                                <ShoppingBag size={20} />
                                                <strong style={{ fontSize: '15px' }}>Purchased Sweets</strong>
                                            </div>
                                            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                                                {userCreatedProducts.length}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                                                Reorder favorite sweets →
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => setActiveTab('addresses')}
                                            style={{
                                                padding: '20px',
                                                borderRadius: '8px',
                                                border: '1px solid #EBE4D8',
                                                background: '#FAF7F2',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#631826', marginBottom: '8px' }}>
                                                <MapPin size={20} />
                                                <strong style={{ fontSize: '15px' }}>Shipping Address</strong>
                                            </div>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '4px', textTransform: 'capitalize' }}>
                                                {savedAddress.city || 'Una'}, {savedAddress.state || 'Himachal'}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                                                PIN: {savedAddress.pincode || '174303'} →
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Order In-Progress Tracker (if any) */}
                                    {activeOrder && (
                                        <div
                                            style={{
                                                border: '1.5px solid #E2D9CC',
                                                borderLeft: '4px solid #631826',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                background: '#FFFFFF',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                                <div>
                                                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#631826', letterSpacing: '0.05em' }}>
                                                        Active Order In-Progress
                                                    </span>
                                                    <h3 style={{ margin: '4px 0 0', fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#0F172A' }}>
                                                        Order #{activeOrder.order_id}
                                                    </h3>
                                                </div>
                                                <span
                                                    style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '999px',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        background: '#FEF3C7',
                                                        color: '#92400E',
                                                    }}
                                                >
                                                    {activeOrder.status}
                                                </span>
                                            </div>

                                            {/* Stepper */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', margin: '20px 0 16px 0', textAlign: 'center' }}>
                                                {[
                                                    { step: 1, title: 'Confirmed' },
                                                    { step: 2, title: 'Kitchen Prep' },
                                                    { step: 3, title: 'In Transit' },
                                                    { step: 4, title: 'Delivered' },
                                                ].map((s) => (
                                                    <div
                                                        key={s.step}
                                                        style={{
                                                            padding: '8px 4px',
                                                            borderRadius: '6px',
                                                            background: activeOrder.current_step >= s.step ? '#F0FDF4' : '#F8FAFC',
                                                            border: activeOrder.current_step >= s.step ? '1px solid #86EFAC' : '1px dashed #CBD5E1',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%',
                                                                margin: '0 auto 4px auto',
                                                                background: activeOrder.current_step >= s.step ? '#16A34A' : '#E2E8F0',
                                                                color: activeOrder.current_step >= s.step ? '#FFFFFF' : '#64748B',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '11px',
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {activeOrder.current_step >= s.step ? '✓' : s.step}
                                                        </div>
                                                        <div style={{ fontSize: '11px', fontWeight: 700, color: activeOrder.current_step >= s.step ? '#166534' : '#64748B' }}>
                                                            {s.title}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ fontSize: '13px', color: '#64748B' }}>
                                                Destination: <strong>{activeOrder.delivery_address}</strong>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 2. ORDERS TABLE TAB (WooCommerce Standard) */}
                            {activeTab === 'orders' && (
                                <div>
                                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#631826', margin: '0 0 4px 0' }}>
                                        Orders
                                    </h2>
                                    <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0' }}>
                                        Complete record of sweet boxes ordered through your account.
                                    </p>

                                    {allOrders && allOrders.length > 0 ? (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '2px solid #EBE4D8', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        <th style={{ padding: '12px 16px' }}>Order</th>
                                                        <th style={{ padding: '12px 16px' }}>Date</th>
                                                        <th style={{ padding: '12px 16px' }}>Status</th>
                                                        <th style={{ padding: '12px 16px' }}>Total</th>
                                                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {allOrders.map((ord) => {
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
                                                                    ₹{ord.total_amount.toFixed(2)}
                                                                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
                                                                        for {ord.items_count} item{ord.items_count === 1 ? '' : 's'}
                                                                    </div>
                                                                </td>
                                                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleViewOrder(ord)}
                                                                        className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748B' }}>
                                            <p style={{ margin: '0 0 16px 0', fontSize: '15px' }}>No orders placed yet.</p>
                                            <Link href="/shop" className="dayal-btn dayal-btn--primary dayal-btn--sm">
                                                Browse Sweets Catalog
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 3. USER PURCHASED & CREATED SWEETS / PRODUCTS TAB (Myntra List Format) */}
                            {activeTab === 'products' && (
                                <div className="dayal-myntra-container">
                                    <div className="dayal-myntra-header-row">
                                        <div>
                                            <h2 className="myntra-heading">
                                                Purchased Sweets
                                            </h2>
                                            <p className="myntra-subheading">
                                                Track each purchased sweet box, check preparation &amp; dispatch status, and reorder in 1-click.
                                            </p>
                                        </div>

                                        <Link href="/shop" className="dayal-btn dayal-btn--outline dayal-btn--sm">
                                            + Order New Sweets
                                        </Link>
                                    </div>

                                    {/* Myntra Status Filter Tabs & Search Bar */}
                                    <div className="dayal-myntra-toolbar">
                                        <div className="myntra-tabs-nav">
                                            {[
                                                { id: 'all', label: 'All Items', count: statusCounts.all },
                                                { id: 'pending', label: 'Pending', count: statusCounts.pending },
                                                { id: 'shipping', label: 'In Transit', count: statusCounts.shipping },
                                                { id: 'delivered', label: 'Delivered', count: statusCounts.delivered },
                                            ].map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    type="button"
                                                    onClick={() => setStatusFilter(tab.id)}
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
                                                onChange={(e) => setProductSearch(e.target.value)}
                                                placeholder="Search sweets by name or order #..."
                                            />
                                            <Search size={15} className="search-icon" />
                                        </div>
                                    </div>

                                    {/* Myntra-Style List of Items */}
                                    {filteredUserProducts.length > 0 ? (
                                        <div className="dayal-myntra-items-list">
                                            {filteredUserProducts.map((prod) => {
                                                const statusInfo = getMyntraStatusInfo(prod);
                                                const currentRating = itemRatings[prod.id] || 5;

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
                                                                <span>• Ordered on {prod.order_date}</span>
                                                            </div>
                                                        </div>

                                                        {/* Main Content Body */}
                                                        <div className="myntra-card-main">
                                                            <div className="myntra-image-box">
                                                                <img
                                                                    src={prod.image}
                                                                    alt={prod.name}
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = '/uploads/2026/07/kaaju-katli.png';
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="myntra-content-box">
                                                                <h3 className="myntra-item-name">
                                                                    {prod.name}
                                                                </h3>
                                                                <div className="myntra-variant-line">
                                                                    <span>Pack / Size: <strong>{prod.variation_name}</strong></span>
                                                                    <span className="sep">•</span>
                                                                    <span>Quantity: <strong>{prod.quantity}</strong></span>
                                                                    <span className="sep">•</span>
                                                                    <span>₹{prod.unit_price.toFixed(2)} per box</span>
                                                                </div>

                                                                <div className="myntra-quality-tag">
                                                                    <span>✨ 100% Pure Desi Ghee</span>
                                                                    <span>•</span>
                                                                    <span>Una Traditional Recipe</span>
                                                                </div>

                                                                <div className="myntra-rating-prompt">
                                                                    <span>Rate sweet:</span>
                                                                    <div className="star-row" title="Click to rate this sweet">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <Star
                                                                                key={star}
                                                                                size={14}
                                                                                onClick={() => handleItemRating(prod.id, star)}
                                                                                fill={star <= currentRating ? '#D4AF37' : 'none'}
                                                                                color="#D4AF37"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="myntra-actions-box">
                                                                <div className="myntra-pricing">
                                                                    <div className="price-val">
                                                                        ₹{prod.total.toFixed(2)}
                                                                    </div>
                                                                    <span className="price-note">
                                                                        Total for {prod.quantity} {prod.quantity === 1 ? 'box' : 'boxes'}
                                                                    </span>
                                                                </div>

                                                                <div className="myntra-buttons-row">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleReorder(prod)}
                                                                        className="dayal-btn dayal-btn--primary dayal-btn--sm"
                                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                                    >
                                                                        <RotateCcw size={13} />
                                                                        <span>Order Again</span>
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleViewOrderByNumber(prod.order_id)}
                                                                        className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                                    >
                                                                        <Eye size={13} />
                                                                        <span>View Details</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748B', background: '#FAF7F2', borderRadius: '10px', border: '1px solid #EBE4D8' }}>
                                            <ShoppingBag size={40} color="#B88E4B" style={{ margin: '0 auto 12px' }} />
                                            <h4 style={{ fontSize: '18px', color: '#0F172A', margin: '0 0 6px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>
                                                {productSearch
                                                    ? `No sweets match "${productSearch}"`
                                                    : statusFilter !== 'all'
                                                    ? `No sweets currently in "${statusFilter === 'shipping' ? 'In Transit' : statusFilter === 'pending' ? 'Pending' : 'Delivered'}" status`
                                                    : 'No Purchased Sweets Yet'}
                                            </h4>
                                            <p style={{ margin: '0 0 16px', fontSize: '13px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
                                                {productSearch || statusFilter !== 'all'
                                                    ? 'Try clearing your search or switching to "All Items" tab to see all your ordered sweets.'
                                                    : 'Every sweet box you purchase through our store will appear here for tracking and 1-click reordering.'}
                                            </p>
                                            {productSearch || statusFilter !== 'all' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProductSearch('');
                                                        setStatusFilter('all');
                                                    }}
                                                    className="dayal-btn dayal-btn--primary dayal-btn--sm"
                                                >
                                                    View All Sweets
                                                </button>
                                            ) : (
                                                <Link href="/shop" className="dayal-btn dayal-btn--primary dayal-btn--sm">
                                                    Explore Sweet Shop
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 4. ADDRESSES TAB (WooCommerce Standard) */}
                            {activeTab === 'addresses' && (
                                <div>
                                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#631826', margin: '0 0 4px 0' }}>
                                        Addresses
                                    </h2>
                                    <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0' }}>
                                        The following addresses will be used on the checkout page by default.
                                    </p>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                                        {/* Shipping Address */}
                                        <div
                                            style={{
                                                border: '1px solid #EBE4D8',
                                                borderRadius: '8px',
                                                padding: '24px',
                                                background: '#FAF7F2',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                                                    Shipping Address
                                                </h3>
                                                <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, background: '#DCFCE7', padding: '2px 8px', borderRadius: '999px' }}>
                                                    Default
                                                </span>
                                            </div>

                                            <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                                                <div style={{ fontWeight: 700, color: '#0F172A' }}>
                                                    {savedAddress.name || user?.name}
                                                </div>
                                                <div>{savedAddress.address || 'Civil Lines Road'}</div>
                                                {savedAddress.apartment && <div>{savedAddress.apartment}</div>}
                                                <div>
                                                    {savedAddress.city || 'Una'}, {savedAddress.state || 'Himachal Pradesh'} - <strong>{savedAddress.pincode || '174303'}</strong>
                                                </div>
                                                <div style={{ marginTop: '8px' }}>
                                                    📞 {savedAddress.phone || '+91 98765 43210'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Billing Address */}
                                        <div
                                            style={{
                                                border: '1px solid #EBE4D8',
                                                borderRadius: '8px',
                                                padding: '24px',
                                                background: '#FAF7F2',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                                                    Billing Address
                                                </h3>
                                                <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                                                    Same as Shipping
                                                </span>
                                            </div>

                                            <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                                                <div style={{ fontWeight: 700, color: '#0F172A' }}>
                                                    {user?.name}
                                                </div>
                                                <div>✉️ {user?.email}</div>
                                                <div>{savedAddress.address || 'Civil Lines Road'}</div>
                                                <div>
                                                    {savedAddress.city || 'Una'}, {savedAddress.state || 'Himachal Pradesh'} - <strong>{savedAddress.pincode || '174303'}</strong>
                                                </div>
                                                <div style={{ marginTop: '8px' }}>
                                                    🇮🇳 India
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 5. ACCOUNT DETAILS TAB (WooCommerce Standard) */}
                            {activeTab === 'account' && (
                                <div>
                                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#631826', margin: '0 0 4px 0' }}>
                                        Account Details
                                    </h2>
                                    <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0' }}>
                                        Update your personal profile information and login password.
                                    </p>

                                    {/* Personal Profile Form */}
                                    <form onSubmit={handleProfileSubmit} style={{ marginBottom: '32px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                                    Full Name <span style={{ color: '#E11D48' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.name}
                                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                                                    required
                                                />
                                                {profileForm.errors.name && (
                                                    <p style={{ color: '#E11D48', fontSize: '12px', marginTop: '4px' }}>{profileForm.errors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                                    Email Address <span style={{ color: '#E11D48' }}>*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileForm.data.email}
                                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                                                    required
                                                />
                                                {profileForm.errors.email && (
                                                    <p style={{ color: '#E11D48', fontSize: '12px', marginTop: '4px' }}>{profileForm.errors.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="dayal-btn dayal-btn--primary dayal-btn--sm"
                                        >
                                            {profileForm.processing ? 'Saving...' : 'Save Profile Changes'}
                                        </button>
                                    </form>

                                    <hr style={{ border: 'none', borderTop: '1px solid #EBE4D8', margin: '32px 0' }} />

                                    {/* Password Change Form */}
                                    <form onSubmit={handlePasswordSubmit}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
                                            Password Change
                                        </h3>

                                        <div style={{ marginBottom: '16px', maxWidth: '420px' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                                Current Password (leave blank to leave unchanged)
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                                            />
                                            {passwordForm.errors.current_password && (
                                                <p style={{ color: '#E11D48', fontSize: '12px', marginTop: '4px' }}>{passwordForm.errors.current_password}</p>
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '16px', maxWidth: '420px' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                                            />
                                            {passwordForm.errors.password && (
                                                <p style={{ color: '#E11D48', fontSize: '12px', marginTop: '4px' }}>{passwordForm.errors.password}</p>
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '20px', maxWidth: '420px' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="dayal-btn dayal-btn--secondary dayal-btn--sm"
                                        >
                                            {passwordForm.processing ? 'Updating Password...' : 'Change Password'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* ORDER DETAILS MODAL */}
            <Modal show={orderModalOpen} onClose={() => setOrderModalOpen(false)}>
                {selectedOrderDetails && (
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #EBE4D8', paddingBottom: '12px' }}>
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#631826' }}>
                                    Order Details
                                </span>
                                <h3 style={{ margin: '2px 0 0', fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#0F172A' }}>
                                    #{selectedOrderDetails.order_number}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOrderModalOpen(false)}
                                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                            Placed on {selectedOrderDetails.created_at_formatted || selectedOrderDetails.order_date} • Payment:{' '}
                            <strong style={{ color: selectedOrderDetails.payment_status === 'paid' ? '#15803D' : '#92400E' }}>
                                {selectedOrderDetails.payment_method?.toUpperCase()} ({selectedOrderDetails.payment_status})
                            </strong>
                        </div>

                        {/* Items List */}
                        <div style={{ border: '1px solid #EBE4D8', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: '#FAF7F2', borderBottom: '1px solid #EBE4D8', color: '#64748B', fontSize: '11px', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '10px 14px', textAlign: 'left' }}>Sweet</th>
                                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>Qty</th>
                                        <th style={{ padding: '10px 14px', textAlign: 'right' }}>Price</th>
                                        <th style={{ padding: '10px 14px', textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrderDetails.items?.map((it) => (
                                        <tr key={it.id} style={{ borderBottom: '1px solid #F1E9DF' }}>
                                            <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0F172A' }}>
                                                {it.product_name}
                                                {it.variation_name && (
                                                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block', fontWeight: 400 }}>
                                                        {it.variation_name}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '10px 14px', textAlign: 'center' }}>{it.quantity}</td>
                                            <td style={{ padding: '10px 14px', textAlign: 'right' }}>₹{it.unit_price.toFixed(2)}</td>
                                            <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#631826' }}>
                                                ₹{it.total.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Financials & Address */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ fontSize: '12px', color: '#475569', background: '#FAF7F2', padding: '12px', borderRadius: '6px' }}>
                                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Shipping Address:</div>
                                <div>{selectedOrderDetails.shipping_address}</div>
                                {selectedOrderDetails.apartment && <div>{selectedOrderDetails.apartment}</div>}
                                <div>{selectedOrderDetails.city}, {selectedOrderDetails.state} - {selectedOrderDetails.pincode}</div>
                                <div>📞 {selectedOrderDetails.customer_phone}</div>
                            </div>

                            <div style={{ fontSize: '13px', background: '#FAF7F2', padding: '12px', borderRadius: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#64748B' }}>
                                    <span>Subtotal:</span>
                                    <span>₹{selectedOrderDetails.subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#64748B' }}>
                                    <span>Shipping:</span>
                                    <span>{selectedOrderDetails.shipping_cost > 0 ? `₹${selectedOrderDetails.shipping_cost.toFixed(2)}` : 'FREE'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #EBE4D8', paddingTop: '6px', fontWeight: 700, fontSize: '15px', color: '#631826' }}>
                                    <span>Total Amount:</span>
                                    <span>₹{selectedOrderDetails.total_amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setOrderModalOpen(false)}
                                className="dayal-btn dayal-btn--outline dayal-btn--sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* LOGOUT CONFIRMATION MODAL */}
            <Modal show={logoutModalOpen} onClose={() => !loggingOut && setLogoutModalOpen(false)}>
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: '#FEE2E2',
                                border: '1px solid #FECACA',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#DC2626',
                                flexShrink: 0,
                            }}
                        >
                            <LogOut size={22} color="#DC2626" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0F172A', fontFamily: 'Cormorant Garamond, serif' }}>
                                Confirm Sign Out
                            </h3>
                            <span style={{ fontSize: '12px', color: '#64748B' }}>
                                Dayal Sweets Customer Account
                            </span>
                        </div>
                    </div>

                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                        Are you sure you want to log out of your account, <strong>{user?.name}</strong>? Any items in your active shopping bag and saved addresses will remain preserved for your next visit.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={() => setLogoutModalOpen(false)}
                            className="dayal-btn dayal-btn--outline dayal-btn--sm"
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={handleConfirmLogout}
                            className="dayal-btn dayal-btn--primary dayal-btn--sm"
                            style={{
                                padding: '8px 18px',
                                fontSize: '13px',
                                background: '#DC2626',
                                borderColor: '#DC2626',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            <LogOut size={14} />
                            <span>{loggingOut ? 'Logging Out...' : 'Yes, Log Out'}</span>
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modular Site Footer */}
            <Footer />
        </div>
    );
}
