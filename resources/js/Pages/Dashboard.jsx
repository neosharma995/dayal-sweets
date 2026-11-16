import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
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

    return (
        <AuthenticatedLayout
            header={
                <div className="dayal-flex-between">
                    <div>
                        <span className="dayal-badge dayal-badge--gold">Customer Center</span>
                        <h1 className="dayal-font-serif">My Account & Orders</h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => setLogoutModalOpen(true)}
                        className="dayal-btn dayal-btn--danger dayal-btn--sm"
                    >
                        Sign Out
                    </button>
                </div>
            }
        >
            <Head title="Dashboard - Dayal Sweets" />

            <div className="dayal-card">
                <h3 className="dayal-font-serif">Namaste & Welcome to Dayal Sweets!</h3>
                <p className="dayal-text-muted dayal-mt-2">
                    You are signed in to your Dayal Sweets customer account. You can view your recent sweet orders, manage saved delivery addresses, or explore fresh handcrafted sweets.
                </p>
                <div className="dayal-mt-5">
                    <Link href="/" className="dayal-btn dayal-btn--primary">
                        Browse Fresh Sweets →
                    </Link>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
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
                        Are you sure you want to log out of your account? Any items in your active shopping bag will remain preserved for your next visit.
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
        </AuthenticatedLayout>
    );
}
