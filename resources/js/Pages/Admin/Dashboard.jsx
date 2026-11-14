import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { AlertIcon } from '@/Components/Icons';

export default function AdminDashboard({ metrics, recentOrders, topProducts, inventoryAlerts }) {
    return (
        <AdminLayout
            header={
                <div>
                    <h1 className="dayal-font-serif">Dayal Sweets Store Manager</h1>
                    <p className="dayal-text-muted">Real-time revenue, live sweet orders, inventory and fulfillment</p>
                </div>
            }
        >
            <Head title="Admin Dashboard - Dayal Sweets" />

            {/* Inventory Alert Banner */}
            {inventoryAlerts && inventoryAlerts.length > 0 && (
                <div className="dayal-alert dayal-alert--warning dayal-mb-6">
                    <AlertIcon width="20" height="20" />
                    <div className="dayal-flex-between dayal-btn--full">
                        <div>
                            <strong>Inventory Alert: Fresh Sweet Stock Running Low</strong>
                            <p>{inventoryAlerts.map(alert => `${alert.item} (${alert.stock})`).join(' • ')}</p>
                        </div>
                        <Link
                            href={route('admin.account')}
                            className="dayal-btn dayal-btn--secondary dayal-btn--sm"
                        >
                            Review Kitchen Stock
                        </Link>
                    </div>
                </div>
            )}

            {/* Key Metrics Cards */}
            <div className="dayal-grid-4 dayal-mb-6">
                <div className="dayal-admin-stat-card">
                    <div className="dayal-stat-top">
                        <span className="dayal-stat-label">Today's Sales</span>
                        <span className="dayal-stat-badge">+18.4%</span>
                    </div>
                    <p className="dayal-stat-value">₹{metrics.today_sales.toLocaleString('en-IN')}</p>
                    <p className="dayal-stat-subtext">From 48 online & counter orders</p>
                </div>

                <div className="dayal-admin-stat-card">
                    <div className="dayal-stat-top">
                        <span className="dayal-stat-label">Month-to-Date Revenue</span>
                        <span className="dayal-badge dayal-badge--gold">Diwali Season</span>
                    </div>
                    <p className="dayal-stat-value">₹{metrics.month_sales.toLocaleString('en-IN')}</p>
                    <p className="dayal-stat-subtext">Target achievement: 92%</p>
                </div>

                <div className="dayal-admin-stat-card">
                    <div className="dayal-stat-top">
                        <span className="dayal-stat-label">Pending Fulfillment</span>
                        <span className="dayal-badge dayal-badge--danger">Urgent</span>
                    </div>
                    <p className="dayal-stat-value">{metrics.pending_orders} Orders</p>
                    <p className="dayal-stat-subtext">Awaiting packaging or dispatch</p>
                </div>

                <div className="dayal-admin-stat-card">
                    <div className="dayal-stat-top">
                        <span className="dayal-stat-label">Total Customers</span>
                        <span className="dayal-badge dayal-badge--green">Active</span>
                    </div>
                    <p className="dayal-stat-value">{metrics.total_customers.toLocaleString('en-IN')}</p>
                    <p className="dayal-stat-subtext">68 new registrations this week</p>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="dayal-admin-table-card dayal-mb-6">
                <div className="dayal-admin-table-head">
                    <div>
                        <h3>Live Sweet Orders Dispatch Desk</h3>
                        <p className="dayal-text-muted">Real-time incoming customer orders across Delhi NCR</p>
                    </div>
                    <button
                        onClick={() => alert('Dispatch batch list generated.')}
                        className="dayal-btn dayal-btn--outline dayal-btn--sm"
                    >
                        Print Dispatch Labels
                    </button>
                </div>

                <div className="dayal-admin-table-wrap">
                    <table className="dayal-admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Mithai Items</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.order_number}>
                                    <td>
                                        <strong className="dayal-text-gold">{order.order_number}</strong>
                                        <span className="dayal-text-muted dayal-fs-sm dayal-block">{order.placed_at}</span>
                                    </td>
                                    <td>
                                        <strong>{order.customer_name}</strong>
                                        <span className="dayal-text-muted dayal-fs-sm dayal-block">{order.customer_phone}</span>
                                    </td>
                                    <td>{order.items}</td>
                                    <td><strong>₹{order.total.toLocaleString('en-IN')}</strong></td>
                                    <td>
                                        <span className="dayal-badge dayal-badge--gold-subtle">
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`dayal-badge ${
                                            order.status === 'Delivered'
                                                ? 'dayal-badge--green'
                                                : order.status === 'Processing'
                                                ? 'dayal-badge--warning'
                                                : 'dayal-badge--maroon'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Selling Mithai & Quick Store Actions */}
            <div className="dayal-grid-3">
                <div className="dayal-card dayal-col-span-2">
                    <h3 className="dayal-font-serif">Top Selling Sweets (Performance)</h3>
                    <p className="dayal-text-muted dayal-mb-4">Volume sold and revenue contribution this week</p>

                    <div>
                        {topProducts.map((product) => (
                            <div key={product.name} className="dayal-admin-product-row">
                                <div>
                                    <strong>{product.name}</strong>
                                    <span className="dayal-text-muted dayal-fs-sm dayal-block">{product.category} • Sold: {product.sold_qty}</span>
                                </div>
                                <div className="dayal-text-right">
                                    <strong className="dayal-text-gold">{product.revenue}</strong>
                                    <span className="dayal-badge dayal-badge--green dayal-block dayal-mt-1">
                                        {product.stock_status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dayal-card">
                    <h3 className="dayal-font-serif">Store Controls</h3>
                    <p className="dayal-text-muted dayal-mb-4">Dayal Sweets Kitchen & Dispatch tools</p>

                    <div>
                        <button
                            onClick={() => alert('New Sweet Catalog dialog opened.')}
                            className="dayal-btn dayal-btn--primary dayal-btn--full dayal-mb-2"
                        >
                            + Add New Sweet Item
                        </button>

                        <button
                            onClick={() => alert('Kitchen batch recipe updater.')}
                            className="dayal-btn dayal-btn--outline dayal-btn--full dayal-mb-2"
                        >
                            Update Daily Ghee & Stock
                        </button>

                        <button
                            onClick={() => alert('Exporting sales GST report.')}
                            className="dayal-btn dayal-btn--secondary dayal-btn--full"
                        >
                            Export GST Report (Excel)
                        </button>
                    </div>

                    <div className="dayal-mt-6">
                        <p className="dayal-text-muted">Need direct kitchen help?</p>
                        <p>Call Hotline: <strong className="dayal-text-gold">+91 98765 43210</strong></p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
