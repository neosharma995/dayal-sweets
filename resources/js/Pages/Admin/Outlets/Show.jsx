import React, { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import {
    MapPinIcon,
    PhoneIcon,
    AlertIcon,
    TruckIcon,
    BoxIcon,
    CartIcon,
    CheckCircleIcon,
    ClockIcon,
} from '@/Components/Icons';

export default function Show({ outlet, unassignedProducts = [], stats = {} }) {
    const { activeOutletId } = usePage().props;
    const isCurrentActive = Number(activeOutletId) === Number(outlet.id);

    // Active Tab state
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'delivery'

    // Products Tab State
    const [productSearch, setProductSearch] = useState('');
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [assignStockQty, setAssignStockQty] = useState(50);
    const [assignSearch, setAssignSearch] = useState('');
    const [editingStockId, setEditingStockId] = useState(null);
    const [editingStockVal, setEditingStockVal] = useState('');

    // Orders Tab State
    const [orderFilterStatus, setOrderFilterStatus] = useState('all');
    const [orderSearch, setOrderSearch] = useState('');

    // Delete Modals State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [zoneToDelete, setZoneToDelete] = useState(null);
    const [deleteZoneModalOpen, setDeleteZoneModalOpen] = useState(false);

    // Context Switcher Handlers
    const handleSwitchContext = () => {
        router.post(
            route('admin.outlets.switch-context'),
            { outlet_id: outlet.id },
            { preserveScroll: true }
        );
    };

    const handleClearContext = () => {
        router.post(
            route('admin.outlets.clear-context'),
            {},
            { preserveScroll: true }
        );
    };

    const toggleStatus = () => {
        router.patch(route('admin.outlets.toggle', outlet.id), {}, {
            preserveScroll: true,
        });
    };

    const confirmDelete = () => {
        router.delete(route('admin.outlets.destroy', outlet.id));
    };

    // Shipping Zone Handlers
    const handleDeleteZoneClick = (zone) => {
        setZoneToDelete(zone);
        setDeleteZoneModalOpen(true);
    };

    const confirmDeleteZone = () => {
        if (!zoneToDelete) return;
        router.delete(route('admin.outlets.shipping-zones.destroy', [outlet.id, zoneToDelete.id]), {
            onSuccess: () => {
                setDeleteZoneModalOpen(false);
                setZoneToDelete(null);
            },
        });
    };

    const toggleZoneActive = (zoneId) => {
        router.patch(route('admin.outlets.shipping-zones.toggle', [outlet.id, zoneId]), {}, {
            preserveScroll: true,
        });
    };

    // Product Assignment Handlers
    const handleOpenAssignModal = () => {
        setSelectedProductIds([]);
        setAssignSearch('');
        setAssignStockQty(50);
        setAssignModalOpen(true);
    };

    const toggleSelectProduct = (id) => {
        setSelectedProductIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAllFiltered = (filtered) => {
        const ids = filtered.map((p) => p.id);
        const allSelected = ids.every((id) => selectedProductIds.includes(id));
        if (allSelected) {
            setSelectedProductIds((prev) => prev.filter((id) => !ids.includes(id)));
        } else {
            setSelectedProductIds((prev) => Array.from(new Set([...prev, ...ids])));
        }
    };

    const submitAssignProducts = (e) => {
        e.preventDefault();
        if (selectedProductIds.length === 0) return;

        router.post(
            route('admin.outlets.products.sync', outlet.id),
            {
                product_ids: selectedProductIds,
                stock_qty: Number(assignStockQty) || 50,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAssignModalOpen(false);
                    setSelectedProductIds([]);
                },
            }
        );
    };

    const handleDetachProduct = (product) => {
        if (!window.confirm(`Remove "${product.product_name}" from ${outlet.name} outlet?`)) {
            return;
        }
        router.delete(route('admin.outlets.products.detach', [outlet.id, product.id]), {
            preserveScroll: true,
        });
    };

    const handleToggleProductAvailability = (product) => {
        const currentAvailability = product.pivot?.is_available ?? true;
        router.patch(
            route('admin.outlets.products.update-pivot', [outlet.id, product.id]),
            { is_available: !currentAvailability },
            { preserveScroll: true }
        );
    };

    const handleSaveStock = (product) => {
        const val = parseInt(editingStockVal, 10);
        if (isNaN(val) || val < 0) {
            setEditingStockId(null);
            return;
        }
        router.patch(
            route('admin.outlets.products.update-pivot', [outlet.id, product.id]),
            { stock_qty: val },
            {
                preserveScroll: true,
                onSuccess: () => setEditingStockId(null),
            }
        );
    };

    // Filtered Products
    const filteredProducts = useMemo(() => {
        const list = outlet.products || [];
        if (!productSearch.trim()) return list;
        const q = productSearch.toLowerCase();
        return list.filter(
            (p) =>
                p.product_name?.toLowerCase().includes(q) ||
                p.category?.category_name?.toLowerCase().includes(q)
        );
    }, [outlet.products, productSearch]);

    // Filtered Unassigned for modal
    const filteredUnassigned = useMemo(() => {
        if (!assignSearch.trim()) return unassignedProducts;
        const q = assignSearch.toLowerCase();
        return unassignedProducts.filter(
            (p) =>
                p.product_name?.toLowerCase().includes(q) ||
                p.category?.category_name?.toLowerCase().includes(q)
        );
    }, [unassignedProducts, assignSearch]);

    // Filtered Orders
    const filteredOrders = useMemo(() => {
        const list = outlet.orders || [];
        return list.filter((order) => {
            if (orderFilterStatus !== 'all' && order.delivery_status !== orderFilterStatus) {
                return false;
            }
            if (orderSearch.trim()) {
                const q = orderSearch.toLowerCase();
                const matchNumber = order.order_number?.toLowerCase().includes(q);
                const matchCust = order.customer_name?.toLowerCase().includes(q);
                const matchPhone = order.customer_phone?.toLowerCase().includes(q);
                const matchCity = order.city?.toLowerCase().includes(q);
                return matchNumber || matchCust || matchPhone || matchCity;
            }
            return true;
        });
    }, [outlet.orders, orderFilterStatus, orderSearch]);

    // Helpers
    const getRegionName = (r) => (typeof r === 'object' && r !== null ? (r.name || '') : String(r));
    const getRegionPincode = (r) => (typeof r === 'object' && r !== null ? (r.pincode || null) : null);

    const getMethodBadgeColor = (type) => {
        switch (type) {
            case 'free_shipping':
                return { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' };
            case 'flat_rate':
                return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' };
            case 'local_pickup':
                return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' };
            default:
                return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
        }
    };

    const getDeliveryStatusBadge = (status) => {
        switch (status) {
            case 'delivered':
                return { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', label: 'Delivered' };
            case 'shipping':
            case 'out_for_delivery':
                return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', label: 'Shipping' };
            case 'cancelled':
                return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', label: 'Cancelled' };
            default:
                return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'Pending' };
        }
    };

    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', label: 'Paid' };
            case 'failed':
                return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', label: 'Failed' };
            default:
                return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'Pending' };
        }
    };

    const totalProductsCount = stats?.total_products ?? outlet.products?.length ?? 0;
    const totalOrdersCount = stats?.total_orders ?? outlet.orders?.length ?? 0;
    const totalRevenue = stats?.total_revenue ?? 0;
    const pendingOrdersCount = stats?.pending_orders ?? 0;
    const zonesCount = stats?.shipping_zones ?? outlet.shipping_zones?.length ?? 0;

    return (
        <AdminLayout header={`Outlet: ${outlet.name}`}>
            <Head title={`${outlet.name} - Outlet Management - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
                {/* Header breadcrumb & top navigation */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1.25rem',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link
                                href={route('admin.outlets.index')}
                                style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}
                            >
                                Outlets
                            </Link>
                            <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#B88E4B', fontSize: '0.8125rem', fontWeight: 600 }}>
                                {outlet.name}
                            </span>
                            {isCurrentActive && (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '9999px',
                                        background: '#FEF3C7',
                                        color: '#92400E',
                                        border: '1px solid #FDE68A',
                                        fontSize: '0.6875rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.03em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    ● Active Filter
                                </span>
                            )}
                        </div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.5rem', color: '#0F172A', fontWeight: 800 }}>
                            <MapPinIcon width="24" height="24" style={{ color: '#B88E4B' }} />
                            <span>{outlet.name}</span>
                        </h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={toggleStatus}
                            style={{
                                padding: '0.5rem 0.85rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: outlet.is_active ? '#059669' : '#64748B',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {outlet.is_active ? 'Active' : 'Inactive'}
                        </button>

                        <Link
                            href={route('admin.outlets.edit', outlet.id)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                background: '#B88E4B',
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                            }}
                        >
                            Edit Outlet
                        </Link>
                        <Link
                            href={route('admin.outlets.index')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 0.85rem',
                                borderRadius: '0.375rem',
                                background: '#F1F5F9',
                                border: '1px solid #CBD5E1',
                                color: '#334155',
                                textDecoration: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                            }}
                        >
                            &larr; All Outlets
                        </Link>
                    </div>
                </div>

                {/* 5 Top KPI Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    {/* Products KPI */}
                    <div
                        onClick={() => setActiveTab('products')}
                        style={{
                            background: '#FFFFFF',
                            border: activeTab === 'products' ? '2px solid #B88E4B' : '1px solid #E2E8F0',
                            borderRadius: '0.5rem',
                            padding: '1rem 1.25rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                                Products
                            </span>
                            <div style={{ width: '32px', height: '32px', borderRadius: '0.375rem', background: '#F5EBD7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B88E4B' }}>
                                <BoxIcon width="18" height="18" />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                            {totalProductsCount}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                            Catalog items assigned
                        </div>
                    </div>

                    {/* Orders KPI */}
                    <div
                        onClick={() => setActiveTab('orders')}
                        style={{
                            background: '#FFFFFF',
                            border: activeTab === 'orders' ? '2px solid #B88E4B' : '1px solid #E2E8F0',
                            borderRadius: '0.5rem',
                            padding: '1rem 1.25rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                                Orders
                            </span>
                            <div style={{ width: '32px', height: '32px', borderRadius: '0.375rem', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E40AF' }}>
                                <CartIcon width="18" height="18" />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                            {totalOrdersCount}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                            Total routed orders
                        </div>
                    </div>

                    {/* Paid Revenue KPI */}
                    <div
                        onClick={() => setActiveTab('orders')}
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.5rem',
                            padding: '1rem 1.25rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                                Outlet Revenue
                            </span>
                            <div style={{ width: '32px', height: '32px', borderRadius: '0.375rem', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065F46' }}>
                                ₹
                            </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                            ₹{Number(totalRevenue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                            Paid customer orders
                        </div>
                    </div>

                    {/* Pending Orders KPI */}
                    <div
                        onClick={() => {
                            setActiveTab('orders');
                            setOrderFilterStatus('pending');
                        }}
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.5rem',
                            padding: '1rem 1.25rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                                Pending Orders
                            </span>
                            <div style={{ width: '32px', height: '32px', borderRadius: '0.375rem', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#92400E' }}>
                                <ClockIcon width="18" height="18" />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: pendingOrdersCount > 0 ? '#D97706' : '#0F172A' }}>
                            {pendingOrdersCount}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                            Require fulfillment
                        </div>
                    </div>

                    {/* Delivery Zones KPI */}
                    <div
                        onClick={() => setActiveTab('delivery')}
                        style={{
                            background: '#FFFFFF',
                            border: activeTab === 'delivery' ? '2px solid #B88E4B' : '1px solid #E2E8F0',
                            borderRadius: '0.5rem',
                            padding: '1rem 1.25rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                                Delivery Zones
                            </span>
                            <div style={{ width: '32px', height: '32px', borderRadius: '0.375rem', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                                <TruckIcon width="18" height="18" />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                            {zonesCount}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                            Active delivery regions
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation Bar */}
                <div
                    style={{
                        display: 'flex',
                        borderBottom: '2px solid #E2E8F0',
                        marginBottom: '1.5rem',
                        gap: '0.5rem',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.75rem 1.25rem',
                            border: 'none',
                            borderBottom: activeTab === 'overview' ? '3px solid #B88E4B' : '3px solid transparent',
                            background: 'transparent',
                            color: activeTab === 'overview' ? '#B88E4B' : '#64748B',
                            fontWeight: activeTab === 'overview' ? 700 : 500,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            marginBottom: '-2px',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <MapPinIcon width="18" height="18" />
                        <span>Store Overview</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.75rem 1.25rem',
                            border: 'none',
                            borderBottom: activeTab === 'products' ? '3px solid #B88E4B' : '3px solid transparent',
                            background: 'transparent',
                            color: activeTab === 'products' ? '#B88E4B' : '#64748B',
                            fontWeight: activeTab === 'products' ? 700 : 500,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            marginBottom: '-2px',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <BoxIcon width="18" height="18" />
                        <span>Products &amp; Inventory</span>
                        <span
                            style={{
                                padding: '0.1rem 0.45rem',
                                borderRadius: '9999px',
                                background: activeTab === 'products' ? '#F5EBD7' : '#F1F5F9',
                                color: activeTab === 'products' ? '#8C6226' : '#64748B',
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                            }}
                        >
                            {totalProductsCount}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.75rem 1.25rem',
                            border: 'none',
                            borderBottom: activeTab === 'orders' ? '3px solid #B88E4B' : '3px solid transparent',
                            background: 'transparent',
                            color: activeTab === 'orders' ? '#B88E4B' : '#64748B',
                            fontWeight: activeTab === 'orders' ? 700 : 500,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            marginBottom: '-2px',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <CartIcon width="18" height="18" />
                        <span>Orders &amp; Shipments</span>
                        <span
                            style={{
                                padding: '0.1rem 0.45rem',
                                borderRadius: '9999px',
                                background: activeTab === 'orders' ? '#F5EBD7' : '#F1F5F9',
                                color: activeTab === 'orders' ? '#8C6226' : '#64748B',
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                            }}
                        >
                            {totalOrdersCount}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('delivery')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.75rem 1.25rem',
                            border: 'none',
                            borderBottom: activeTab === 'delivery' ? '3px solid #B88E4B' : '3px solid transparent',
                            background: 'transparent',
                            color: activeTab === 'delivery' ? '#B88E4B' : '#64748B',
                            fontWeight: activeTab === 'delivery' ? 700 : 500,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            marginBottom: '-2px',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <TruckIcon width="18" height="18" />
                        <span>Delivery Zones</span>
                        <span
                            style={{
                                padding: '0.1rem 0.45rem',
                                borderRadius: '9999px',
                                background: activeTab === 'delivery' ? '#F5EBD7' : '#F1F5F9',
                                color: activeTab === 'delivery' ? '#8C6226' : '#64748B',
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                            }}
                        >
                            {zonesCount}
                        </span>
                    </button>
                </div>

                {/* TAB 1: STORE OVERVIEW */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 360px', gap: '1.5rem', alignItems: 'start' }}>
                        {/* Left Details Card */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '0.5rem',
                                padding: '1.5rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <h3 style={{ margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                                Outlet Information
                            </h3>

                            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: '1rem', fontSize: '0.875rem' }}>
                                <dt style={{ fontWeight: 600, color: '#64748B' }}>Outlet Name</dt>
                                <dd style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>{outlet.name}</dd>

                                <dt style={{ fontWeight: 600, color: '#64748B' }}>Subtitle</dt>
                                <dd style={{ margin: 0, color: '#334155' }}>{outlet.subtitle || '-'}</dd>

                                <dt style={{ fontWeight: 600, color: '#64748B' }}>URL Identifier</dt>
                                <dd style={{ margin: 0, color: '#334155', fontFamily: 'monospace' }}>{outlet.slug}</dd>

                                <dt style={{ fontWeight: 600, color: '#64748B' }}>Address</dt>
                                <dd style={{ margin: 0, color: '#334155', lineHeight: 1.5 }}>{outlet.address}</dd>

                                <dt style={{ fontWeight: 600, color: '#64748B' }}>City / State</dt>
                                <dd style={{ margin: 0, color: '#334155' }}>{outlet.city ? `${outlet.city}, ` : ''}{outlet.state} {outlet.pincode ? `(${outlet.pincode})` : ''}</dd>

                                <dt style={{ fontWeight: 600, color: '#64748B' }}>Phone</dt>
                                <dd style={{ margin: 0, color: '#334155' }}>{outlet.phone || '-'}</dd>

                                <dt style={{ fontWeight: 600, color: '#64748B' }}>WhatsApp</dt>
                                <dd style={{ margin: 0, color: '#059669', fontWeight: 600 }}>{outlet.whatsapp || '-'}</dd>

                                <dt style={{ fontWeight: 600, color: '#64748B' }}>Timings</dt>
                                <dd style={{ margin: 0, color: '#334155' }}>{outlet.timings || '-'}</dd>

                                <dt style={{ fontWeight: 600, color: '#64748B' }}>Status</dt>
                                <dd style={{ margin: 0 }}>
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            padding: '0.2rem 0.65rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: outlet.status === 'active' ? '#ECFDF5' : (outlet.status === 'coming_soon' ? '#FEF3C7' : '#F1F5F9'),
                                            color: outlet.status === 'active' ? '#065F46' : (outlet.status === 'coming_soon' ? '#92400E' : '#64748B'),
                                            border: '1px solid rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        {outlet.status?.toUpperCase() || (outlet.is_active ? 'ACTIVE' : 'INACTIVE')}
                                    </span>
                                </dd>

                                {outlet.expected_opening && (
                                    <>
                                        <dt style={{ fontWeight: 600, color: '#D97706' }}>Opening Note</dt>
                                        <dd style={{ margin: 0, color: '#D97706', fontWeight: 600 }}>{outlet.expected_opening}</dd>
                                    </>
                                )}

                                <dt style={{ fontWeight: 600, color: '#64748B' }}>Sort Order</dt>
                                <dd style={{ margin: 0, color: '#334155' }}>{outlet.sort_order}</dd>

                                <dt style={{ fontWeight: 600, color: '#64748B' }}>Google Maps</dt>
                                <dd style={{ margin: 0 }}>
                                    {outlet.map_url ? (
                                        <a
                                            href={outlet.map_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#B88E4B', fontWeight: 600, textDecoration: 'none' }}
                                        >
                                            Open in Google Maps &rarr;
                                        </a>
                                    ) : (
                                        <span style={{ color: '#94A3B8' }}>Not provided</span>
                                    )}
                                </dd>
                            </dl>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setDeleteModalOpen(true)}
                                    style={{
                                        padding: '0.45rem 1rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #FCA5A5',
                                        background: '#FEE2E2',
                                        color: '#DC2626',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Delete Outlet
                                </button>
                            </div>
                        </div>

                        {/* Right Live Outlet Card Preview */}
                        <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Live Outlet Card Preview
                            </div>

                            <div
                                style={{
                                    background: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.08)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div style={{ position: 'relative', width: '100%', height: '185px', background: 'linear-gradient(135deg, #FBF6EE 0%, #F5E8D3 100%)', overflow: 'hidden' }}>
                                    <img
                                        src={outlet.image_url || outlet.image || '/uploads/woocommerce-placeholder.webp'}
                                        alt={outlet.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.currentTarget.src = '/uploads/woocommerce-placeholder.webp';
                                        }}
                                    />

                                    {/* Gradient Scrim */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.3) 100%)',
                                            pointerEvents: 'none',
                                        }}
                                    />

                                    {/* Top Status Badge */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '0.75rem',
                                            left: '0.75rem',
                                            zIndex: 2,
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                padding: '0.25rem 0.65rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.725rem',
                                                fontWeight: 700,
                                                background: outlet.is_active ? 'rgba(236, 253, 245, 0.95)' : 'rgba(241, 245, 249, 0.95)',
                                                color: outlet.is_active ? '#065F46' : '#64748B',
                                                backdropFilter: 'blur(8px)',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            }}
                                        >
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: outlet.is_active ? '#059669' : '#94A3B8' }} />
                                            {outlet.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Bottom City Pill */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '0.75rem',
                                            left: '0.75rem',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            background: 'rgba(15, 23, 42, 0.75)',
                                            backdropFilter: 'blur(8px)',
                                            color: '#FFFFFF',
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.725rem',
                                            fontWeight: 600,
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            zIndex: 2,
                                        }}
                                    >
                                        <MapPinIcon width="12" height="12" style={{ color: '#FCD34D' }} />
                                        <span>{outlet.city || 'Himachal'}{outlet.state ? `, ${outlet.state}` : ''}</span>
                                    </div>
                                </div>

                                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.2rem', fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                                            {outlet.name}
                                        </h4>
                                        {outlet.subtitle && (
                                            <div style={{ fontSize: '0.8125rem', fontStyle: 'italic', color: '#B88E4B' }}>
                                                {outlet.subtitle}
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            background: '#F8FAFC',
                                            border: '1px solid #F1F5F9',
                                            borderRadius: '0.625rem',
                                            padding: '0.75rem',
                                            fontSize: '0.8125rem',
                                            color: '#334155',
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                                            <MapPinIcon width="14" height="14" style={{ color: '#B88E4B', marginTop: '2px', flexShrink: 0 }} />
                                            <span>{outlet.address}</span>
                                        </div>
                                    </div>

                                    {/* Contact Strip */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                                        {outlet.phone && (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.55rem', borderRadius: '0.375rem', background: '#F1F5F9', color: '#334155', fontWeight: 600 }}>
                                                <PhoneIcon width="12" height="12" style={{ color: '#64748B' }} />
                                                <span>{outlet.phone}</span>
                                            </span>
                                        )}
                                        {outlet.whatsapp && (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.55rem', borderRadius: '0.375rem', background: '#ECFDF5', color: '#065F46', fontWeight: 600, border: '1px solid #A7F3D0' }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                                                <span>WA: {outlet.whatsapp}</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* 3-Column Metrics Strip */}
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '0.5rem',
                                            background: '#FDF8F0',
                                            border: '1px solid #F3EDE4',
                                            borderRadius: '0.625rem',
                                            padding: '0.65rem 0.5rem',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#8C6226' }}>
                                                {totalProductsCount}
                                            </div>
                                            <div style={{ fontSize: '0.6875rem', color: '#A17D49', fontWeight: 600, textTransform: 'uppercase' }}>
                                                Products
                                            </div>
                                        </div>
                                        <div style={{ borderLeft: '1px solid #E6D2B5', borderRight: '1px solid #E6D2B5' }}>
                                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E40AF' }}>
                                                {totalOrdersCount}
                                            </div>
                                            <div style={{ fontSize: '0.6875rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>
                                                Orders
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                                                {zonesCount}
                                            </div>
                                            <div style={{ fontSize: '0.6875rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>
                                                Zones
                                            </div>
                                        </div>
                                    </div>

                                    {outlet.map_url && (
                                        <a
                                            href={outlet.map_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'block',
                                                textAlign: 'center',
                                                padding: '0.5rem',
                                                border: '1px solid #B88E4B',
                                                color: '#B88E4B',
                                                borderRadius: '0.375rem',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                fontSize: '0.8125rem',
                                                background: '#FFFDF9',
                                            }}
                                        >
                                            View in Google Maps &nearr;
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: PRODUCTS & INVENTORY */}
                {activeTab === 'products' && (
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.5rem',
                            padding: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                    >
                        {/* Header bar */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                marginBottom: '1.25rem',
                                borderBottom: '1px solid #F1F5F9',
                                paddingBottom: '0.75rem',
                            }}
                        >
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BoxIcon width="20" height="20" style={{ color: '#B88E4B' }} />
                                    <span>Products Available at {outlet.name}</span>
                                </h3>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#64748B' }}>
                                    Showing {filteredProducts.length} of {outlet.products?.length || 0} assigned item(s) with location inventory.
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                    style={{
                                        padding: '0.45rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.8125rem',
                                        width: '200px',
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={handleOpenAssignModal}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.375rem',
                                        background: '#B88E4B',
                                        color: '#FFFFFF',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    + Assign Products to Outlet
                                </button>
                            </div>
                        </div>

                        {/* Products Table */}
                        {filteredProducts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: '#94A3B8' }}>
                                    <BoxIcon width="24" height="24" />
                                </div>
                                <p style={{ margin: 0, fontWeight: 700, color: '#334155' }}>
                                    {productSearch ? 'No products match your search' : `No products assigned to ${outlet.name} yet.`}
                                </p>
                                <p style={{ margin: '0.25rem 0 1.25rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                                    Assign catalog products to this outlet to manage local stock and availability.
                                </p>
                                {!productSearch && (
                                    <button
                                        type="button"
                                        onClick={handleOpenAssignModal}
                                        style={{
                                            padding: '0.5rem 1.25rem',
                                            borderRadius: '0.375rem',
                                            background: '#B88E4B',
                                            color: '#FFFFFF',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Assign First Product
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Product
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Category
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Base Price
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Outlet Stock
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>
                                                Outlet Availability
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => {
                                            const isAvailable = product.pivot?.is_available ?? true;
                                            const stockQty = product.pivot?.stock_qty ?? 0;
                                            const isEditingStock = editingStockId === product.id;

                                            return (
                                                <tr key={product.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    borderRadius: '0.375rem',
                                                                    background: '#F1F5F9',
                                                                    border: '1px solid #E2E8F0',
                                                                    overflow: 'hidden',
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {product.product_image_url || product.product_image ? (
                                                                    <img
                                                                        src={product.product_image_url || product.product_image}
                                                                        alt={product.product_name}
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                                    />
                                                                ) : (
                                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B88E4B', fontSize: '0.85rem' }}>
                                                                        🍬
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <Link
                                                                    href={route('admin.products.show', product.id)}
                                                                    style={{ fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}
                                                                >
                                                                    {product.product_name}
                                                                </Link>
                                                                {product.product_description && (
                                                                    <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                        {product.product_description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>
                                                        {product.category ? (
                                                            <span style={{ fontSize: '0.75rem', background: '#F5EBD7', color: '#8C6226', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                                                                {product.category.category_name}
                                                            </span>
                                                        ) : (
                                                            <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>—</span>
                                                        )}
                                                    </td>

                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle', fontWeight: 700, color: '#0F172A' }}>
                                                        ₹{Number(product.product_selling_price || product.product_price || 0).toFixed(2)}
                                                    </td>

                                                    {/* Outlet Stock Qty with inline update */}
                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>
                                                        {isEditingStock ? (
                                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={editingStockVal}
                                                                    onChange={(e) => setEditingStockVal(e.target.value)}
                                                                    style={{
                                                                        width: '70px',
                                                                        padding: '0.25rem 0.4rem',
                                                                        borderRadius: '0.25rem',
                                                                        border: '1px solid #B88E4B',
                                                                        fontSize: '0.8125rem',
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSaveStock(product)}
                                                                    style={{
                                                                        padding: '0.25rem 0.5rem',
                                                                        borderRadius: '0.25rem',
                                                                        border: 'none',
                                                                        background: '#059669',
                                                                        color: '#FFFFFF',
                                                                        fontSize: '0.75rem',
                                                                        cursor: 'pointer',
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditingStockId(null)}
                                                                    style={{
                                                                        padding: '0.25rem 0.4rem',
                                                                        borderRadius: '0.25rem',
                                                                        border: '1px solid #CBD5E1',
                                                                        background: '#FFFFFF',
                                                                        color: '#64748B',
                                                                        fontSize: '0.75rem',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                onClick={() => {
                                                                    setEditingStockId(product.id);
                                                                    setEditingStockVal(String(stockQty));
                                                                }}
                                                                title="Click to edit stock for this outlet"
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.4rem',
                                                                    padding: '0.2rem 0.55rem',
                                                                    borderRadius: '0.25rem',
                                                                    background: stockQty > 0 ? '#F1F5F9' : '#FEE2E2',
                                                                    border: '1px dashed #CBD5E1',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <span style={{ fontWeight: 700, color: stockQty > 0 ? '#0F172A' : '#DC2626' }}>
                                                                    {stockQty} units
                                                                </span>
                                                                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>✎</span>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Outlet Availability Toggle */}
                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleProductAvailability(product)}
                                                            style={{
                                                                border: 'none',
                                                                background: isAvailable ? '#ECFDF5' : '#F1F5F9',
                                                                color: isAvailable ? '#065F46' : '#64748B',
                                                                padding: '0.2rem 0.65rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            {isAvailable ? 'In Stock / Active' : 'Disabled'}
                                                        </button>
                                                    </td>

                                                    {/* Actions */}
                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle', textAlign: 'right' }}>
                                                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                                            <Link
                                                                href={route('admin.products.edit', product.id)}
                                                                style={{
                                                                    padding: '0.25rem 0.55rem',
                                                                    borderRadius: '0.25rem',
                                                                    background: '#F1F5F9',
                                                                    border: '1px solid #CBD5E1',
                                                                    color: '#0F172A',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    textDecoration: 'none',
                                                                }}
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDetachProduct(product)}
                                                                style={{
                                                                    padding: '0.25rem 0.55rem',
                                                                    borderRadius: '0.25rem',
                                                                    background: '#FEE2E2',
                                                                    border: '1px solid #FCA5A5',
                                                                    color: '#DC2626',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    cursor: 'pointer',
                                                                }}
                                                                title="Remove this product from this outlet"
                                                            >
                                                                Detach
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: ORDERS & SHIPMENTS */}
                {activeTab === 'orders' && (
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.5rem',
                            padding: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                    >
                        {/* Header bar */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                marginBottom: '1.25rem',
                                borderBottom: '1px solid #F1F5F9',
                                paddingBottom: '0.75rem',
                            }}
                        >
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CartIcon width="20" height="20" style={{ color: '#B88E4B' }} />
                                    <span>Orders Placed for {outlet.name}</span>
                                </h3>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#64748B' }}>
                                    Showing {filteredOrders.length} customer order(s) routed to this outlet location.
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input
                                    type="text"
                                    placeholder="Search by order #, customer..."
                                    value={orderSearch}
                                    onChange={(e) => setOrderSearch(e.target.value)}
                                    style={{
                                        padding: '0.45rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.8125rem',
                                        width: '220px',
                                    }}
                                />

                                <select
                                    value={orderFilterStatus}
                                    onChange={(e) => setOrderFilterStatus(e.target.value)}
                                    style={{
                                        padding: '0.45rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.8125rem',
                                        background: '#FFFFFF',
                                    }}
                                >
                                    <option value="all">All Delivery Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="shipping">Shipping</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {/* Orders Table */}
                        {filteredOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: '#94A3B8' }}>
                                    <CartIcon width="24" height="24" />
                                </div>
                                <p style={{ margin: 0, fontWeight: 700, color: '#334155' }}>
                                    {orderSearch || orderFilterStatus !== 'all'
                                        ? 'No orders match your filter criteria'
                                        : `No orders routed to ${outlet.name} yet.`}
                                </p>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#94A3B8' }}>
                                    Customer orders placed within this outlet&apos;s delivery zones or picked up here will appear in this list.
                                </p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Order Number
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Date
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Customer
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Items
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Total
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>
                                                Payment
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>
                                                Fulfillment
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => {
                                            const payBadge = getPaymentStatusBadge(order.payment_status);
                                            const delBadge = getDeliveryStatusBadge(order.delivery_status);

                                            return (
                                                <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>
                                                        <Link
                                                            href={route('admin.orders.show', order.id)}
                                                            style={{ fontWeight: 700, color: '#B88E4B', textDecoration: 'none' }}
                                                        >
                                                            {order.order_number || `#${order.id}`}
                                                        </Link>
                                                    </td>

                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle', color: '#64748B', fontSize: '0.8125rem' }}>
                                                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                                    </td>

                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>
                                                        <div style={{ fontWeight: 600, color: '#0F172A' }}>
                                                            {order.customer_name || 'Guest'}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                            {order.customer_phone || order.city || ''}
                                                        </div>
                                                    </td>

                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle', fontSize: '0.8125rem', color: '#334155' }}>
                                                        {order.items && order.items.length > 0 ? (
                                                            <span>
                                                                {order.items.length} item(s)
                                                                {order.items[0]?.product_name && (
                                                                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                        {order.items[0].product_name}
                                                                        {order.items.length > 1 && ` +${order.items.length - 1} more`}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span style={{ color: '#94A3B8' }}>—</span>
                                                        )}
                                                    </td>

                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle', fontWeight: 700, color: '#0F172A' }}>
                                                        ₹{Number(order.total_amount || 0).toFixed(2)}
                                                    </td>

                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                                        <span
                                                            style={{
                                                                display: 'inline-block',
                                                                padding: '0.15rem 0.5rem',
                                                                borderRadius: '9999px',
                                                                background: payBadge.bg,
                                                                color: payBadge.text,
                                                                border: `1px solid ${payBadge.border}`,
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {payBadge.label}
                                                        </span>
                                                    </td>

                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                                        <span
                                                            style={{
                                                                display: 'inline-block',
                                                                padding: '0.15rem 0.5rem',
                                                                borderRadius: '9999px',
                                                                background: delBadge.bg,
                                                                color: delBadge.text,
                                                                border: `1px solid ${delBadge.border}`,
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {delBadge.label}
                                                        </span>
                                                    </td>

                                                    <td style={{ padding: '0.75rem', verticalAlign: 'middle', textAlign: 'right' }}>
                                                        <Link
                                                            href={route('admin.orders.show', order.id)}
                                                            style={{
                                                                padding: '0.25rem 0.65rem',
                                                                borderRadius: '0.25rem',
                                                                background: '#F1F5F9',
                                                                border: '1px solid #CBD5E1',
                                                                color: '#0F172A',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                textDecoration: 'none',
                                                            }}
                                                        >
                                                            View &rarr;
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 4: DELIVERY ZONES */}
                {activeTab === 'delivery' && (
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.5rem',
                            padding: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                marginBottom: '1.25rem',
                                borderBottom: '1px solid #F1F5F9',
                                paddingBottom: '0.75rem',
                            }}
                        >
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <TruckIcon width="20" height="20" style={{ color: '#B88E4B' }} />
                                    <span>Shipping &amp; Delivery Zones ({outlet.name})</span>
                                </h3>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#64748B' }}>
                                    Delivery regions, postal PIN code filters, and shipping rates configured exclusively for {outlet.name} outlet.
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link
                                    href={route('admin.outlets.shipping-zones.index', outlet.id)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.45rem 0.85rem',
                                        borderRadius: '0.375rem',
                                        background: '#F1F5F9',
                                        border: '1px solid #CBD5E1',
                                        color: '#334155',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                >
                                    Full Zones View &rarr;
                                </Link>
                                <Link
                                    href={route('admin.outlets.shipping-zones.create', outlet.id)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.45rem 1rem',
                                        borderRadius: '0.375rem',
                                        background: '#B88E4B',
                                        color: '#FFFFFF',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        boxShadow: '0 1px 2px rgba(184, 142, 75, 0.2)',
                                    }}
                                >
                                    + Add Shipping Zone
                                </Link>
                            </div>
                        </div>

                        {!outlet.shipping_zones || outlet.shipping_zones.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: '#94A3B8' }}>
                                    <TruckIcon width="22" height="22" />
                                </div>
                                <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>No shipping zones configured for {outlet.name} yet.</p>
                                <p style={{ margin: '0.25rem 0 1rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                                    Configure local city delivery, store pickup, and express courier for this outlet.
                                </p>
                                <Link
                                    href={route('admin.outlets.shipping-zones.create', outlet.id)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '0.45rem 1rem',
                                        borderRadius: '0.375rem',
                                        background: '#B88E4B',
                                        color: '#FFFFFF',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                >
                                    Add First Zone for {outlet.name}
                                </Link>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Zone Name
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Regions &amp; Postcodes
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Shipping Methods &amp; Rates
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>
                                                Status
                                            </th>
                                            <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {outlet.shipping_zones.map((zone) => (
                                            <tr key={zone.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                                                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.875rem' }}>
                                                        <Link
                                                            href={route('admin.outlets.shipping-zones.edit', [outlet.id, zone.id])}
                                                            style={{ color: '#0F172A', textDecoration: 'none' }}
                                                        >
                                                            {zone.zone_name}
                                                        </Link>
                                                    </div>
                                                    {zone.description && (
                                                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35 }}>
                                                            {zone.description}
                                                        </p>
                                                    )}
                                                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                                                        Slug: {zone.zone_slug}
                                                    </span>
                                                </td>

                                                <td style={{ padding: '0.75rem', verticalAlign: 'top', maxWidth: '320px' }}>
                                                    {Array.isArray(zone.zone_regions) && zone.zone_regions.length > 0 ? (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                                            {zone.zone_regions.map((region, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        padding: '0.15rem 0.45rem',
                                                                        background: '#F1F5F9',
                                                                        border: '1px solid #CBD5E1',
                                                                        borderRadius: '0.25rem',
                                                                        fontSize: '0.75rem',
                                                                        color: '#1E293B',
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    {getRegionName(region)}
                                                                    {getRegionPincode(region) && (
                                                                        <span style={{ color: '#64748B', fontSize: '0.6875rem', marginLeft: '0.2rem' }}>
                                                                            ({getRegionPincode(region)})
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontStyle: 'italic' }}>
                                                            Everywhere (Catch-All)
                                                        </span>
                                                    )}

                                                    {zone.zone_postcodes && (
                                                        <div style={{ marginTop: '0.35rem', fontSize: '0.6875rem', color: '#B45309', background: '#FEF3C7', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', display: 'inline-block' }}>
                                                            PIN: {zone.zone_postcodes}
                                                        </div>
                                                    )}
                                                </td>

                                                <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                                                    {Array.isArray(zone.methods) && zone.methods.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                            {zone.methods.map((method) => {
                                                                const colors = getMethodBadgeColor(method.method_type);
                                                                return (
                                                                    <div
                                                                        key={method.id}
                                                                        style={{
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            gap: '0.35rem',
                                                                            fontSize: '0.75rem',
                                                                            padding: '0.15rem 0.45rem',
                                                                            borderRadius: '0.25rem',
                                                                            background: colors.bg,
                                                                            color: colors.text,
                                                                            border: `1px solid ${colors.border}`,
                                                                            width: 'fit-content',
                                                                        }}
                                                                    >
                                                                        <span style={{ fontWeight: 600 }}>{method.title}</span>
                                                                        <span style={{ opacity: 0.85 }}>
                                                                            {Number(method.cost) === 0 ? '(Free)' : `(₹${Number(method.cost).toFixed(2)})`}
                                                                        </span>
                                                                        {method.min_order_amount && (
                                                                            <span style={{ fontSize: '0.6875rem', opacity: 0.75 }}>
                                                                                [Min: ₹{Number(method.min_order_amount).toFixed(0)}]
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                                                            No methods configured
                                                        </span>
                                                    )}
                                                </td>

                                                <td style={{ padding: '0.75rem', verticalAlign: 'top', textAlign: 'center' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleZoneActive(zone.id)}
                                                        style={{
                                                            border: 'none',
                                                            background: zone.is_active ? '#ECFDF5' : '#F1F5F9',
                                                            color: zone.is_active ? '#065F46' : '#64748B',
                                                            padding: '0.2rem 0.6rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        {zone.is_active ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>

                                                <td style={{ padding: '0.75rem', verticalAlign: 'top', textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                                        <Link
                                                            href={route('admin.outlets.shipping-zones.edit', [outlet.id, zone.id])}
                                                            style={{
                                                                padding: '0.25rem 0.55rem',
                                                                borderRadius: '0.25rem',
                                                                background: '#F1F5F9',
                                                                border: '1px solid #CBD5E1',
                                                                color: '#0F172A',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                textDecoration: 'none',
                                                            }}
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteZoneClick(zone)}
                                                            style={{
                                                                padding: '0.25rem 0.55rem',
                                                                borderRadius: '0.25rem',
                                                                background: '#FEE2E2',
                                                                border: '1px solid #FCA5A5',
                                                                color: '#DC2626',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ASSIGN PRODUCTS MODAL */}
            <Modal show={assignModalOpen} onClose={() => setAssignModalOpen(false)} maxWidth="2xl">
                <form onSubmit={submitAssignProducts} style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>
                                Assign Products to {outlet.name}
                            </h3>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#64748B' }}>
                                Select products from the store catalog to make available at this location.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAssignModalOpen(false)}
                            style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', color: '#64748B', cursor: 'pointer' }}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0.75rem', marginBottom: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Search catalog products..."
                            value={assignSearch}
                            onChange={(e) => setAssignSearch(e.target.value)}
                            style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.8125rem',
                            }}
                        />

                        <div>
                            <input
                                type="number"
                                min="0"
                                placeholder="Default Stock"
                                value={assignStockQty}
                                onChange={(e) => setAssignStockQty(e.target.value)}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    width: '100%',
                                }}
                                title="Initial stock quantity for assigned products"
                            />
                        </div>
                    </div>

                    {filteredUnassigned.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#64748B' }}>
                            <span>
                                {selectedProductIds.length} of {filteredUnassigned.length} selected
                            </span>
                            <button
                                type="button"
                                onClick={() => handleSelectAllFiltered(filteredUnassigned)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#B88E4B',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                {filteredUnassigned.every((p) => selectedProductIds.includes(p.id))
                                    ? 'Deselect All'
                                    : 'Select All Filtered'}
                            </button>
                        </div>
                    )}

                    {/* Unassigned products scroll list */}
                    <div
                        style={{
                            maxHeight: '320px',
                            overflowY: 'auto',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.375rem',
                            marginBottom: '1.25rem',
                        }}
                    >
                        {filteredUnassigned.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>
                                {unassignedProducts.length === 0
                                    ? 'All catalog products are already assigned to this outlet.'
                                    : 'No unassigned products match your search.'}
                            </div>
                        ) : (
                            filteredUnassigned.map((product) => {
                                const isChecked = selectedProductIds.includes(product.id);
                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => toggleSelectProduct(product.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.65rem 0.85rem',
                                            borderBottom: '1px solid #F1F5F9',
                                            background: isChecked ? '#FDF8F0' : '#FFFFFF',
                                            cursor: 'pointer',
                                            transition: 'background 0.1s ease',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {}} // Handled by row click
                                                style={{ cursor: 'pointer', accentColor: '#B88E4B' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>
                                                    {product.product_name}
                                                </div>
                                                {product.category && (
                                                    <span style={{ fontSize: '0.6875rem', color: '#8C6226', background: '#F5EBD7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                                        {product.category.category_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.875rem' }}>
                                            ₹{Number(product.product_selling_price || product.product_price || 0).toFixed(2)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => setAssignModalOpen(false)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={selectedProductIds.length === 0}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                background: selectedProductIds.length === 0 ? '#CBD5E1' : '#B88E4B',
                                color: '#FFFFFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: selectedProductIds.length === 0 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Assign {selectedProductIds.length} Product(s)
                        </button>
                    </div>
                </form>
            </Modal>

            {/* DELETE OUTLET MODAL */}
            <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <div style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#FEE2E2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#DC2626',
                            }}
                        >
                            <AlertIcon width="20" height="20" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>
                                Confirm Delete
                            </h3>
                            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                                {outlet.name}
                            </span>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        Are you sure you want to permanently delete the <strong>&ldquo;{outlet.name}&rdquo;</strong> outlet?
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(false)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                background: '#DC2626',
                                color: '#FFFFFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* DELETE ZONE MODAL */}
            <Modal show={deleteZoneModalOpen} onClose={() => setDeleteZoneModalOpen(false)}>
                <div style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#FEE2E2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#DC2626',
                            }}
                        >
                            <AlertIcon width="20" height="20" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>
                                Delete Shipping Zone?
                            </h3>
                            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                                {zoneToDelete?.zone_name} &bull; {outlet.name} Outlet
                            </span>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        Are you sure you want to delete the shipping zone <strong>&ldquo;{zoneToDelete?.zone_name}&rdquo;</strong> from {outlet.name}? All rates and methods configured under this zone will be deleted.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => setDeleteZoneModalOpen(false)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDeleteZone}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                background: '#DC2626',
                                color: '#FFFFFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Delete Zone
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
