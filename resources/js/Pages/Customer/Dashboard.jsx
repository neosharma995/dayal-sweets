import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { StarIcon, TruckIcon, CheckCircleIcon, ClockIcon, MapPinIcon, BoxIcon, PhoneIcon } from '@/Components/Icons';

export default function CustomerDashboard({ overview, activeOrder, recentPastOrders, recommendedSweets }) {
    return (
        <CustomerLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Namaste & Welcome Back</span>
                        <h1 className="font-serif text-2xl md:text-3xl font-black text-stone-900">Your Sweets Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('customer.account')}
                            className="px-4 py-2 rounded-xl bg-white border border-amber-200 text-stone-800 text-xs font-bold hover:bg-amber-50 shadow-sm transition-colors"
                        >
                            Manage Saved Addresses & Profile
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Customer Dashboard - Dayal Sweets" />

            <div className="space-y-8">
                {/* Sweet Rewards & Overview Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Rewards Card */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 text-white shadow-lg shadow-amber-600/20 relative overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Sweet Rewards Balance</span>
                                <span className="p-1.5 rounded-full bg-white/20">
                                    <StarIcon className="w-4 h-4 text-white fill-white" />
                                </span>
                            </div>
                            <p className="font-serif text-3xl font-black mt-2">{overview.sweet_rewards_points} Points</p>
                            <p className="text-xs text-amber-100 font-medium mt-1">Worth {overview.points_cash_value}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                            <span className="font-bold">{overview.tier}</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">Earn 10 pts per ₹100</span>
                        </div>
                    </div>

                    {/* Total Orders Card */}
                    <div className="p-6 rounded-3xl bg-white border border-amber-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Past Orders Placed</span>
                            <p className="font-serif text-3xl font-black text-stone-900 mt-2">{overview.total_orders_placed}</p>
                            <p className="text-xs text-stone-500 mt-1">All orders crafted fresh in 100% pure desi ghee</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                            <span className="text-stone-500 font-medium">Saved Addresses: {overview.saved_addresses_count}</span>
                            <Link href={route('customer.account')} className="text-amber-700 font-bold hover:underline">
                                View Details →
                            </Link>
                        </div>
                    </div>

                    {/* Freshness & Support Guarantee */}
                    <div className="p-6 rounded-3xl bg-amber-900 text-amber-50 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Dayal Sweets Quality Pledge</span>
                            <h3 className="font-serif text-lg font-bold mt-1 text-white">Daily Kitchen Fresh Guarantee</h3>
                            <p className="text-xs text-amber-200/80 mt-1">Every sweet box is prepared in morning batches without artificial preservatives.</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-amber-800 flex items-center justify-between text-xs">
                            <span>Same-Day City Dispatch</span>
                            <span className="text-amber-300 font-bold">100% Vegetarian</span>
                        </div>
                    </div>
                </div>

                {/* Active Live Order Tracker */}
                {activeOrder && (
                    <div className="bg-white rounded-3xl border border-amber-200 p-6 md:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-amber-100 gap-3">
                            <div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                                    Active Order Live Progress
                                </span>
                                <h2 className="font-serif text-xl font-black text-stone-900 mt-2">
                                    Order #{activeOrder.order_id}
                                </h2>
                                <p className="text-xs text-stone-500">
                                    Placed on {activeOrder.order_date} • Estimated: <strong className="text-stone-800">{activeOrder.estimated_delivery}</strong>
                                </p>
                            </div>

                            <div className="text-left sm:text-right">
                                <span className="text-xs text-stone-500 block">Total Order Value</span>
                                <span className="font-serif text-2xl font-black text-amber-700">₹{activeOrder.total_amount}</span>
                                <span className="text-[11px] text-stone-500 block font-medium">{activeOrder.payment_mode}</span>
                            </div>
                        </div>

                        {/* Visual Progress Steps */}
                        <div className="py-8">
                            <div className="grid grid-cols-4 gap-2 relative">
                                <div className="absolute top-5 left-10 right-10 h-1 bg-amber-100 -z-0">
                                    <div
                                        className="h-full bg-amber-600 transition-all duration-500"
                                        style={{ width: `${((activeOrder.current_step - 1) / 3) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Step 1 */}
                                <div className="text-center relative z-10">
                                    <div className="w-10 h-10 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-amber-600/30">
                                        ✓
                                    </div>
                                    <p className="text-xs font-bold text-stone-900 mt-2">Order Confirmed</p>
                                    <span className="text-[10px] text-stone-500 hidden sm:block">Payment received</span>
                                </div>

                                {/* Step 2 */}
                                <div className="text-center relative z-10">
                                    <div className="w-10 h-10 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-amber-600/30 animate-pulse">
                                        2
                                    </div>
                                    <p className="text-xs font-bold text-amber-700 mt-2">Kitchen Preparation</p>
                                    <span className="text-[10px] text-stone-500 hidden sm:block">Freshly crafted & packed</span>
                                </div>

                                {/* Step 3 */}
                                <div className="text-center relative z-10">
                                    <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center font-bold text-xs">
                                        3
                                    </div>
                                    <p className="text-xs font-medium text-stone-500 mt-2">Out for Delivery</p>
                                    <span className="text-[10px] text-stone-400 hidden sm:block">Express dispatch van</span>
                                </div>

                                {/* Step 4 */}
                                <div className="text-center relative z-10">
                                    <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center font-bold text-xs">
                                        4
                                    </div>
                                    <p className="text-xs font-medium text-stone-500 mt-2">Delivered</p>
                                    <span className="text-[10px] text-stone-400 hidden sm:block">Enjoy sweet moments</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items & Destination Address */}
                        <div className="bg-amber-50/50 rounded-2xl p-4 md:p-5 border border-amber-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <h4 className="font-bold text-stone-900 mb-2 uppercase tracking-wider text-[11px]">Items in this sweet box:</h4>
                                <ul className="space-y-1.5 text-stone-700">
                                    {activeOrder.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100">
                                            <span className="font-medium">{item.name} ({item.weight}) × {item.qty}</span>
                                            <span className="font-bold text-stone-900">₹{item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col justify-between bg-white p-4 rounded-xl border border-amber-100">
                                <div>
                                    <h4 className="font-bold text-stone-900 mb-1 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                        <MapPinIcon className="w-4 h-4 text-amber-600" />
                                        Delivery Destination:
                                    </h4>
                                    <p className="text-stone-700 mt-1 leading-relaxed">{activeOrder.delivery_address}</p>
                                </div>

                                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                                    <span className="text-stone-500 text-[11px]">Questions about this delivery?</span>
                                    <a
                                        href="tel:+911145678900"
                                        className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                                    >
                                        <PhoneIcon className="w-3.5 h-3.5" />
                                        Call Store Hotline
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Handcrafted Bestsellers & Recommendations */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-serif text-xl font-bold text-stone-900">Recommended For You</h2>
                            <p className="text-xs text-stone-500">Popular traditional sweets prepared fresh today in our Chandni Chowk kitchen</p>
                        </div>
                        <Link href="/" className="text-xs font-bold text-amber-700 hover:underline">
                            View All Sweets →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendedSweets.map((sweet) => (
                            <div key={sweet.id} className="bg-white rounded-3xl border border-amber-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                            {sweet.tag}
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                            <StarIcon className="w-3.5 h-3.5 fill-current" />
                                            <span>{sweet.rating}</span>
                                        </div>
                                    </div>

                                    <h3 className="font-serif font-bold text-stone-900 text-base">{sweet.name}</h3>
                                    <p className="text-xs text-stone-500 mt-1">{sweet.description}</p>
                                </div>

                                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] text-stone-400 block">{sweet.weight}</span>
                                        <span className="font-serif text-lg font-black text-amber-700">₹{sweet.price}</span>
                                    </div>
                                    <button
                                        onClick={() => alert(`Added ${sweet.name} to your cart!`)}
                                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Past Orders History Summary */}
                <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                        <div>
                            <h2 className="font-serif text-lg font-bold text-stone-900">Recent Sweet Orders</h2>
                            <p className="text-xs text-stone-500">Fast 1-click reorder for your favorite celebrations</p>
                        </div>
                        <Link href={route('customer.account')} className="text-xs font-bold text-amber-700 hover:underline">
                            View Full Order History →
                        </Link>
                    </div>

                    <div className="divide-y divide-stone-100 mt-2">
                        {recentPastOrders.map((order) => (
                            <div key={order.order_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-amber-700 text-xs">#{order.order_id}</span>
                                        <span className="text-xs text-stone-400">• {order.order_date}</span>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-stone-700 mt-1">{order.items_summary}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="font-serif font-black text-stone-900 text-sm">
                                        ₹{order.total_amount}
                                    </span>
                                    <button
                                        onClick={() => alert(`Reordering items from #${order.order_id}`)}
                                        className="px-3.5 py-1.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold transition-colors"
                                    >
                                        Reorder
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
