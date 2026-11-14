import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BoxIcon, StoreIcon, TruckIcon, ClockIcon, AlertIcon, CheckCircleIcon } from '@/Components/Icons';

export default function AdminDashboard({ metrics, recentOrders, topProducts, inventoryAlerts }) {
    return (
        <AdminLayout
            header={
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Dayal Sweets Store Manager</h1>
                    <p className="text-xs text-slate-400">Real-time revenue, live sweet orders, inventory and fulfillment</p>
                </div>
            }
        >
            <Head title="Admin Dashboard - Dayal Sweets" />

            <div className="space-y-8">
                {/* Inventory Alert Banner */}
                {inventoryAlerts && inventoryAlerts.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                                <AlertIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-amber-300">Inventory Alert: Fresh Sweet Stock Running Low</h3>
                                <p className="text-xs text-slate-300">
                                    {inventoryAlerts.map(alert => `${alert.item} (${alert.stock})`).join(' • ')}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route('admin.account')}
                            className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors self-start md:self-auto"
                        >
                            Review Kitchen Stock
                        </Link>
                    </div>
                )}

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Sales</span>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+18.4%</span>
                        </div>
                        <p className="text-2xl font-black text-white mt-2">₹{metrics.today_sales.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-slate-400 mt-1">From 48 online & counter orders</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Month-to-Date Revenue</span>
                            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Diwali Season</span>
                        </div>
                        <p className="text-2xl font-black text-white mt-2">₹{metrics.month_sales.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-slate-400 mt-1">Target achievement: 92%</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Fulfillment</span>
                            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">Urgent</span>
                        </div>
                        <p className="text-2xl font-black text-white mt-2">{metrics.pending_orders} Orders</p>
                        <p className="text-xs text-slate-400 mt-1">Awaiting packaging or dispatch</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Customers</span>
                            <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">Active</span>
                        </div>
                        <p className="text-2xl font-black text-white mt-2">{metrics.total_customers.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-slate-400 mt-1">68 new registrations this week</p>
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h2 className="text-base font-bold text-white">Live Sweet Orders Dispatch Desk</h2>
                            <p className="text-xs text-slate-400">Real-time incoming customer orders across Delhi NCR</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => alert('Dispatch batch list generated.')}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                            >
                                Print Dispatch Labels
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                <tr>
                                    <th className="px-5 py-3.5">Order ID</th>
                                    <th className="px-5 py-3.5">Customer</th>
                                    <th className="px-5 py-3.5">Mithai Items</th>
                                    <th className="px-5 py-3.5">Amount</th>
                                    <th className="px-5 py-3.5">Payment</th>
                                    <th className="px-5 py-3.5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {recentOrders.map((order) => (
                                    <tr key={order.order_number} className="hover:bg-slate-900/30 transition-colors">
                                        <td className="px-5 py-4 font-mono font-bold text-amber-400">
                                            {order.order_number}
                                            <span className="block text-[11px] font-sans font-normal text-slate-500">{order.placed_at}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-white">{order.customer_name}</p>
                                            <span className="text-xs text-slate-400">{order.customer_phone}</span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-300 max-w-xs truncate">
                                            {order.items}
                                        </td>
                                        <td className="px-5 py-4 font-bold text-white">
                                            ₹{order.total.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center text-xs font-medium text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md">
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                                                order.status === 'Delivered'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : order.status === 'Out for Delivery'
                                                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                                    : order.status === 'Processing'
                                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            }`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Selling Products */}
                    <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
                        <h2 className="text-base font-bold text-white mb-1">Top Selling Sweets (Performance)</h2>
                        <p className="text-xs text-slate-400 mb-4">Volume sold and revenue contribution this week</p>

                        <div className="space-y-3">
                            {topProducts.map((product) => (
                                <div key={product.name} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                                    <div>
                                        <p className="text-sm font-bold text-white">{product.name}</p>
                                        <span className="text-xs text-slate-400">{product.category} • Sold: {product.sold_qty}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-amber-400">{product.revenue}</p>
                                        <span className={`text-[11px] font-semibold ${
                                            product.stock_status.includes('Low') ? 'text-rose-400' : 'text-emerald-400'
                                        }`}>
                                            {product.stock_status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Store Operations Actions */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <h2 className="text-base font-bold text-white mb-1">Store Controls</h2>
                            <p className="text-xs text-slate-400 mb-4">Dayal Sweets Kitchen & Dispatch tools</p>

                            <div className="space-y-2.5">
                                <button
                                    onClick={() => alert('New Sweet Catalog dialog opened.')}
                                    className="w-full text-left p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-between transition-colors"
                                >
                                    <span>+ Add New Sweet Item / Variety</span>
                                    <span>→</span>
                                </button>

                                <button
                                    onClick={() => alert('Kitchen batch recipe updater.')}
                                    className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-between transition-colors"
                                >
                                    <span>Update Daily Ghee & Raw Stock</span>
                                    <span>→</span>
                                </button>

                                <button
                                    onClick={() => alert('Exporting sales GST report.')}
                                    className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-between transition-colors"
                                >
                                    <span>Export Monthly GST Report (Excel)</span>
                                    <span>↓</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-800 text-xs text-slate-400">
                            <p className="font-semibold text-slate-300">Need direct kitchen help?</p>
                            <p className="mt-0.5">Call Store Manager Hotline: <span className="text-amber-400 font-bold">+91 11 4567 8900</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
