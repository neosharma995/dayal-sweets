import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { StoreIcon, BoxIcon, MapPinIcon, TruckIcon } from '@/Components/Icons';

export default function AdminDashboard({ metrics, recentOrders = [], recentProducts = [], activeOutlet = null }) {
    const getDeliveryStatusBadge = (status) => {
        const normalized = (status || '').toLowerCase();
        if (normalized === 'delivered') {
            return (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.725rem', fontWeight: 700, background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                    Delivered
                </span>
            );
        }
        if (normalized === 'cancelled') {
            return (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.725rem', fontWeight: 700, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
                    Cancelled
                </span>
            );
        }
        if (normalized === 'shipping' || normalized === 'out_for_delivery') {
            return (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.725rem', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6' }} />
                    {normalized === 'out_for_delivery' ? 'Out for Delivery' : 'In Transit'}
                </span>
            );
        }
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.725rem', fontWeight: 700, background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                Pending
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const normalized = (status || '').toLowerCase();
        if (normalized === 'paid') {
            return (
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: '#ECFDF5', color: '#047857' }}>
                    Paid
                </span>
            );
        }
        if (normalized === 'failed' || normalized === 'refunded') {
            return (
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: '#FEF2F2', color: '#DC2626' }}>
                    {normalized === 'refunded' ? 'Refunded' : 'Failed'}
                </span>
            );
        }
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: '#F1F5F9', color: '#475569' }}>
                Pending
            </span>
        );
    };

    return (
        <AdminLayout
            header={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', fontFamily: 'serif' }}>
                            Store Dashboard
                        </h1>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                            {activeOutlet ? (
                                <span>
                                    Filtered by outlet: <strong style={{ color: '#0F172A' }}>{activeOutlet.name}</strong> ({activeOutlet.city})
                                </span>
                            ) : (
                                <span>Overview across all store locations &amp; products</span>
                            )}
                        </p>
                    </div>

                    {activeOutlet && (
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '9999px',
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                color: '#047857',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                            }}
                        >
                            <MapPinIcon width="14" height="14" style={{ color: '#059669' }} />
                            <span>Active Outlet: {activeOutlet.name}</span>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Admin Dashboard - Dayal Sweets" />

            {/* Custom Modern Dashboard Styles */}
            <style>{`
                .dayal-stat-nav-card {
                    background: #FFFFFF;
                    border: 1px solid #E2E8F0;
                    border-radius: 0.75rem;
                    padding: 1.25rem 1.35rem;
                    display: flex;
                    flex-direction: column;
                    justifyContent: space-between;
                    text-decoration: none;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                }
                .dayal-stat-nav-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 20px -5px rgba(15, 23, 42, 0.08);
                    border-color: #CBD5E1;
                }
                .dayal-stat-nav-card .nav-arrow {
                    opacity: 0;
                    transform: translateX(-4px);
                    transition: all 0.15s ease;
                }
                .dayal-stat-nav-card:hover .nav-arrow {
                    opacity: 1;
                    transform: translateX(0);
                }
            `}</style>

            {/* 4 Interactive Navigate Stat Cards (Outlets, Orders, Products, Revenue) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {/* 1. Total Outlets */}
                <Link href={route('admin.outlets.index')} className="dayal-stat-nav-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>Total Outlets</span>
                        <div style={{ width: '34px', height: '34px', borderRadius: '0.5rem', background: '#FDF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B88E4B' }}>
                            <MapPinIcon width="18" height="18" />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                        {metrics.total_outlets}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.775rem' }}>
                        <span style={{ color: '#059669', fontWeight: 600 }}>{metrics.active_outlets} Active Locations</span>
                        <span className="nav-arrow" style={{ color: '#B88E4B', fontWeight: 700 }}>Manage &rarr;</span>
                    </div>
                </Link>

                {/* 2. Total Orders */}
                <Link href={route('admin.orders.index')} className="dayal-stat-nav-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>
                            {activeOutlet ? `${activeOutlet.name} Orders` : 'Total Orders'}
                        </span>
                        <div style={{ width: '34px', height: '34px', borderRadius: '0.5rem', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </div>
                    </div>
                    <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                        {metrics.total_orders}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.775rem' }}>
                        <span style={{ color: metrics.pending_orders > 0 ? '#D97706' : '#64748B', fontWeight: 600 }}>
                            {metrics.pending_orders} Pending Dispatch
                        </span>
                        <span className="nav-arrow" style={{ color: '#1D4ED8', fontWeight: 700 }}>View All &rarr;</span>
                    </div>
                </Link>

                {/* 3. Total Products */}
                <Link href={route('admin.products.index')} className="dayal-stat-nav-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>
                            {activeOutlet ? `${activeOutlet.name} Products` : 'Total Products'}
                        </span>
                        <div style={{ width: '34px', height: '34px', borderRadius: '0.5rem', background: '#FDF2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BE185D' }}>
                            <BoxIcon width="18" height="18" />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                        {metrics.total_products}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.775rem' }}>
                        <span style={{ color: '#64748B', fontWeight: 600 }}>
                            {activeOutlet ? 'Assigned to this branch' : 'In store catalog'}
                        </span>
                        <span className="nav-arrow" style={{ color: '#BE185D', fontWeight: 700 }}>Catalog &rarr;</span>
                    </div>
                </Link>

                {/* 4. Total Paid Revenue */}
                <Link href={route('admin.orders.index')} className="dayal-stat-nav-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>
                            {activeOutlet ? `${activeOutlet.name} Revenue` : 'Total Revenue'}
                        </span>
                        <div style={{ width: '34px', height: '34px', borderRadius: '0.5rem', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>₹</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                        ₹{metrics.total_revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.775rem' }}>
                        <span style={{ color: '#059669', fontWeight: 600 }}>From paid customer orders</span>
                        <span className="nav-arrow" style={{ color: '#047857', fontWeight: 700 }}>Orders &rarr;</span>
                    </div>
                </Link>
            </div>

            {/* Recent Orders Table (Filtered by Outlet) */}
            <div className="dayal-admin-table-card" style={{ marginBottom: '2rem' }}>
                <div
                    className="dayal-admin-table-head"
                    style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                    }}
                >
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                            {activeOutlet ? `${activeOutlet.name} - Recent Orders` : 'Recent Orders'}
                        </h3>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                            {activeOutlet
                                ? `Showing live customer orders scoped to ${activeOutlet.name}`
                                : 'Live incoming customer orders across all Dayal Sweets branches'}
                        </p>
                    </div>

                    <Link
                        href={route('admin.orders.index')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '0.375rem',
                            background: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            color: '#334155',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <span>View All Orders</span>
                        <span>&rarr;</span>
                    </Link>
                </div>

                <div className="dayal-admin-table-wrap" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Order ID
                                </th>
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Customer
                                </th>
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Items
                                </th>
                                {!activeOutlet && (
                                    <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Outlet
                                    </th>
                                )}
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Amount
                                </th>
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                                    Payment
                                </th>
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                                    Status
                                </th>
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={activeOutlet ? 7 : 8} style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                            <svg width="36" height="36" fill="none" stroke="#CBD5E1" viewBox="0 0 24 24" strokeWidth="1.5">
                                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                                <line x1="3" y1="6" x2="21" y2="6" />
                                                <path d="M16 10a4 4 0 0 1-8 0" />
                                            </svg>
                                            <div style={{ fontWeight: 600, color: '#334155' }}>No orders found</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                                                {activeOutlet ? `No customer orders have been placed for ${activeOutlet.name} yet.` : 'No customer orders have been placed yet.'}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                                            <Link
                                                href={route('admin.orders.show', order.id)}
                                                style={{ fontWeight: 700, color: '#B88E4B', textDecoration: 'none', fontSize: '0.875rem' }}
                                            >
                                                {order.order_number}
                                            </Link>
                                            <span style={{ display: 'block', fontSize: '0.725rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                                                {order.placed_at}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                                            <strong style={{ color: '#0F172A', fontSize: '0.85rem' }}>{order.customer_name}</strong>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                                                {order.customer_phone}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle', maxWidth: '280px' }}>
                                            <span style={{ fontSize: '0.8125rem', color: '#334155', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {order.items}
                                            </span>
                                        </td>
                                        {!activeOutlet && (
                                            <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                                                <span style={{ fontSize: '0.775rem', fontWeight: 600, color: '#475569', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                                                    {order.outlet_name || 'All Outlets'}
                                                </span>
                                            </td>
                                        )}
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                                            <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>
                                                ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </strong>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                            {getPaymentStatusBadge(order.payment_status)}
                                        </td>
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                            {getDeliveryStatusBadge(order.delivery_status)}
                                        </td>
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle', textAlign: 'right' }}>
                                            <Link
                                                href={route('admin.orders.show', order.id)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    padding: '0.3rem 0.65rem',
                                                    borderRadius: '0.375rem',
                                                    background: '#F1F5F9',
                                                    color: '#334155',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                    border: '1px solid #CBD5E1',
                                                }}
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Products Catalog Table (Filtered by Outlet) */}
            <div className="dayal-admin-table-card">
                <div
                    className="dayal-admin-table-head"
                    style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                    }}
                >
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                            {activeOutlet ? `${activeOutlet.name} - Products Catalog` : 'Products Catalog'}
                        </h3>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                            {activeOutlet
                                ? `Showing products assigned to ${activeOutlet.name}`
                                : 'Overview of products available across the Dayal Sweets network'}
                        </p>
                    </div>

                    <Link
                        href={route('admin.products.index')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '0.375rem',
                            background: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            color: '#334155',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <span>View All Products</span>
                        <span>&rarr;</span>
                    </Link>
                </div>

                <div className="dayal-admin-table-wrap" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '60px' }}>
                                    Image
                                </th>
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Product Name / Category
                                </th>
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Price
                                </th>
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                                    Stock
                                </th>
                                {!activeOutlet && (
                                    <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                                        Outlets
                                    </th>
                                )}
                                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={activeOutlet ? 5 : 6} style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                            <BoxIcon width="36" height="36" style={{ color: '#CBD5E1' }} />
                                            <div style={{ fontWeight: 600, color: '#334155' }}>No products found</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                                                {activeOutlet ? `No products are assigned to ${activeOutlet.name} yet.` : 'No products available.'}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                recentProducts.map((product) => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                                            <div
                                                style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '0.375rem',
                                                    overflow: 'hidden',
                                                    background: '#F1F5F9',
                                                    border: '1px solid #E2E8F0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <BoxIcon width="18" height="18" style={{ color: '#94A3B8' }} />
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                                            <Link
                                                href={route('admin.products.index')}
                                                style={{ fontWeight: 700, color: '#0F172A', textDecoration: 'none', fontSize: '0.875rem' }}
                                            >
                                                {product.name}
                                            </Link>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                                                {product.category_name}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                                            <strong style={{ color: '#0F172A', fontSize: '0.875rem' }}>
                                                ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </strong>
                                            {product.regular_price > product.price && (
                                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                                                    ₹{product.regular_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                            {product.stock_quantity > 0 ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.725rem', fontWeight: 600, background: '#ECFDF5', color: '#047857' }}>
                                                    In Stock ({product.stock_quantity})
                                                </span>
                                            ) : (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.725rem', fontWeight: 600, background: '#FEF2F2', color: '#DC2626' }}>
                                                    Out of Stock
                                                </span>
                                            )}
                                        </td>
                                        {!activeOutlet && (
                                            <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle', textAlign: 'center' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.725rem', fontWeight: 600, background: '#FDF8F0', color: '#8C6226', border: '1px solid #E6D2B5' }}>
                                                    <MapPinIcon width="11" height="11" />
                                                    <span>{product.outlets_count} Outlets</span>
                                                </span>
                                            </td>
                                        )}
                                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle', textAlign: 'right' }}>
                                            <Link
                                                href={route('admin.products.index')}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    padding: '0.3rem 0.65rem',
                                                    borderRadius: '0.375rem',
                                                    background: '#F1F5F9',
                                                    color: '#334155',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                    border: '1px solid #CBD5E1',
                                                }}
                                            >
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
