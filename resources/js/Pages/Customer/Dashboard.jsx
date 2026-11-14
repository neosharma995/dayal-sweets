import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { StarIcon, MapPinIcon, PhoneIcon, LogOutIcon } from '@/Components/Icons';

export default function CustomerDashboard({ overview, activeOrder, recentPastOrders, recommendedSweets }) {
    return (
        <CustomerLayout
            header={
                <div className="dayal-flex-between">
                    <div>
                        <span className="dayal-badge dayal-badge--gold">Namaste & Welcome Back</span>
                        <h1 className="dayal-font-serif">Your Sweets Dashboard</h1>
                    </div>
                    <div className="dayal-header-actions">
                        <Link
                            href={route('customer.account')}
                            className="dayal-btn dayal-btn--outline dayal-btn--sm"
                        >
                            Manage Saved Addresses & Profile
                        </Link>
                        <Link
                            method="post"
                            href={route('logout')}
                            as="button"
                            className="dayal-btn dayal-btn--danger dayal-btn--sm"
                        >
                            <LogOutIcon width="14" height="14" />
                            <span>Logout</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Customer Dashboard - Dayal Sweets" />

            {/* Sweet Rewards & Overview Banner */}
            <div className="dayal-overview-grid">
                {/* Rewards Card */}
                <div className="dayal-rewards-card">
                    <div className="dayal-rewards-top">
                        <span className="dayal-rewards-label">Sweet Rewards Balance</span>
                        <div className="dayal-rewards-star">
                            <StarIcon width="16" height="16" />
                        </div>
                    </div>
                    <div>
                        <p className="dayal-rewards-points">{overview.sweet_rewards_points} Points</p>
                        <p className="dayal-rewards-value">Worth {overview.points_cash_value}</p>
                    </div>
                    <div className="dayal-rewards-footer">
                        <span className="dayal-tier-pill">{overview.tier}</span>
                        <span>Earn 10 pts per ₹100</span>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className="dayal-metric-card">
                    <div>
                        <span className="dayal-metric-label">Past Orders Placed</span>
                        <p className="dayal-metric-value">{overview.total_orders_placed}</p>
                        <p className="dayal-metric-subtext">All orders crafted fresh in 100% pure desi ghee</p>
                    </div>
                    <div className="dayal-metric-footer">
                        <span>Saved Addresses: {overview.saved_addresses_count}</span>
                        <Link href={route('customer.account')}>
                            View Details →
                        </Link>
                    </div>
                </div>

                {/* Freshness & Support Guarantee */}
                <div className="dayal-metric-card">
                    <div>
                        <span className="dayal-metric-label">Dayal Sweets Quality Pledge</span>
                        <p className="dayal-font-serif dayal-fs-md dayal-mt-2">
                            Daily Kitchen Fresh Guarantee
                        </p>
                        <p className="dayal-metric-subtext">Every sweet box is prepared in morning batches without artificial preservatives.</p>
                    </div>
                    <div className="dayal-metric-footer">
                        <span>Same-Day City Dispatch</span>
                        <span className="dayal-badge dayal-badge--gold-subtle">100% Vegetarian</span>
                    </div>
                </div>
            </div>

            {/* Active Live Order Tracker */}
            {activeOrder && (
                <div className="dayal-tracker-card">
                    <div className="dayal-tracker-header">
                        <div>
                            <span className="dayal-badge dayal-badge--gold">
                                Active Order Live Progress
                            </span>
                            <h2 className="dayal-font-serif dayal-mt-1">
                                Order #{activeOrder.order_id}
                            </h2>
                            <p className="dayal-text-muted">
                                Placed on {activeOrder.order_date} • Estimated: <strong>{activeOrder.estimated_delivery}</strong>
                            </p>
                        </div>

                        <div>
                            <span className="dayal-text-muted">Total Order Value</span>
                            <p className="dayal-font-serif dayal-text-maroon dayal-fs-xl">
                                ₹{activeOrder.total_amount}
                            </p>
                            <span className="dayal-badge dayal-badge--gold-subtle">{activeOrder.payment_mode}</span>
                        </div>
                    </div>

                    {/* Visual Progress Steps */}
                    <div className="dayal-tracker-timeline">
                        <div className="dayal-progress-track">
                            <div className={`dayal-progress-bar dayal-progress-bar--${activeOrder.current_step}`} />
                        </div>

                        <div className="dayal-timeline-steps-grid">
                            <div className="dayal-timeline-step">
                                <div className={`dayal-step-circle ${activeOrder.current_step >= 1 ? 'dayal-step-circle--done' : 'dayal-step-circle--pending'}`}>
                                    ✓
                                </div>
                                <div className="dayal-step-info">
                                    <h5>Order Confirmed</h5>
                                    <span>Payment received</span>
                                </div>
                            </div>

                            <div className="dayal-timeline-step">
                                <div className={`dayal-step-circle ${activeOrder.current_step === 2 ? 'dayal-step-circle--active' : activeOrder.current_step > 2 ? 'dayal-step-circle--done' : 'dayal-step-circle--pending'}`}>
                                    2
                                </div>
                                <div className="dayal-step-info">
                                    <h5>Kitchen Prep</h5>
                                    <span>Freshly crafted</span>
                                </div>
                            </div>

                            <div className="dayal-timeline-step">
                                <div className={`dayal-step-circle ${activeOrder.current_step === 3 ? 'dayal-step-circle--active' : activeOrder.current_step > 3 ? 'dayal-step-circle--done' : 'dayal-step-circle--pending'}`}>
                                    3
                                </div>
                                <div className="dayal-step-info">
                                    <h5>Out for Delivery</h5>
                                    <span>Express dispatch</span>
                                </div>
                            </div>

                            <div className="dayal-timeline-step">
                                <div className={`dayal-step-circle ${activeOrder.current_step === 4 ? 'dayal-step-circle--done' : 'dayal-step-circle--pending'}`}>
                                    4
                                </div>
                                <div className="dayal-step-info">
                                    <h5>Delivered</h5>
                                    <span>Enjoy sweets</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items & Destination Address */}
                    <div className="dayal-order-items-grid">
                        <div>
                            <h4 className="dayal-mb-2">Items in this sweet box:</h4>
                            <div>
                                {activeOrder.items.map((item, idx) => (
                                    <div key={idx} className="dayal-order-item-row">
                                        <span>{item.name} ({item.weight}) × {item.qty}</span>
                                        <strong>₹{item.price}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="dayal-card dayal-card--subtle">
                            <div>
                                <h4 className="dayal-flex-start dayal-mb-1">
                                    <MapPinIcon width="16" height="16" />
                                    <span>Delivery Destination:</span>
                                </h4>
                                <p className="dayal-text-muted">{activeOrder.delivery_address}</p>
                            </div>

                            <div className="dayal-flex-between dayal-mt-4">
                                <span className="dayal-text-muted">Questions?</span>
                                <a href="tel:+919876543210" className="dayal-flex-start dayal-text-maroon">
                                    <PhoneIcon width="14" height="14" />
                                    <span>Call Hotline</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Handcrafted Bestsellers & Recommendations */}
            <div>
                <div className="dayal-flex-between dayal-mb-4">
                    <div>
                        <h2 className="dayal-font-serif">Recommended For You</h2>
                        <p className="dayal-text-muted">Popular traditional sweets prepared fresh today in our kitchen</p>
                    </div>
                    <Link href="/" className="dayal-btn dayal-btn--outline dayal-btn--sm">
                        View All Sweets →
                    </Link>
                </div>

                <div className="dayal-grid-3">
                    {recommendedSweets.map((sweet) => (
                        <div key={sweet.id} className="dayal-card dayal-card--interactive">
                            <div className="dayal-flex-between dayal-mb-2">
                                <span className="dayal-badge dayal-badge--gold-subtle">
                                    {sweet.tag}
                                </span>
                                <div className="dayal-flex-start dayal-text-gold">
                                    <StarIcon width="14" height="14" />
                                    <span>{sweet.rating}</span>
                                </div>
                            </div>

                            <h3 className="dayal-font-serif">{sweet.name}</h3>
                            <p className="dayal-text-muted dayal-mt-1">{sweet.description}</p>

                            <div className="dayal-flex-between dayal-mt-5">
                                <div>
                                    <span className="dayal-text-muted">{sweet.weight}</span>
                                    <p className="dayal-font-serif dayal-text-maroon dayal-fs-lg">
                                        ₹{sweet.price}
                                    </p>
                                </div>
                                <button
                                    onClick={() => alert(`Added ${sweet.name} to your cart!`)}
                                    className="dayal-btn dayal-btn--primary dayal-btn--sm"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Past Orders History Summary */}
            <div className="dayal-order-history-card">
                <div className="dayal-flex-between dayal-mb-3">
                    <div>
                        <h2 className="dayal-font-serif">Recent Sweet Orders</h2>
                        <p className="dayal-text-muted">Fast 1-click reorder for your celebrations</p>
                    </div>
                    <Link href={route('customer.account')} className="dayal-btn dayal-btn--outline dayal-btn--sm">
                        View Full History →
                    </Link>
                </div>

                <div>
                    {recentPastOrders.map((order) => (
                        <div key={order.order_id} className="dayal-history-row">
                            <div>
                                <div className="dayal-flex-start">
                                    <strong className="dayal-text-maroon">#{order.order_id}</strong>
                                    <span className="dayal-text-muted">• {order.order_date}</span>
                                    <span className="dayal-badge dayal-badge--green">
                                        {order.status}
                                    </span>
                                </div>
                                <p className="dayal-text-muted dayal-mt-1">{order.items_summary}</p>
                            </div>

                            <div className="dayal-flex-start">
                                <strong className="dayal-font-serif dayal-fs-md">₹{order.total_amount}</strong>
                                <button
                                    onClick={() => alert(`Reordering items from #${order.order_id}`)}
                                    className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                >
                                    Reorder
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}
