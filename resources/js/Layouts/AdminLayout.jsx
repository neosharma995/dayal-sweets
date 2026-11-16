import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminFooter from '@/Components/Admin/AdminFooter';
import { AlertIcon, CheckCircleIcon, LogOutIcon } from '@/Components/Icons';
import Modal from '@/Components/Modal';

export default function AdminLayout({ header, children }) {
    const { flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleConfirmLogout = () => {
        setLoggingOut(true);
        router.post(route('admin.logout'), {}, {
            onFinish: () => {
                setLoggingOut(false);
                setLogoutModalOpen(false);
            },
        });
    };

    return (
        <div className="dayal-admin-shell">
            {/* Modular Sidebar Component */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                onCloseSidebar={() => setSidebarOpen(false)}
                onRequestLogout={() => setLogoutModalOpen(true)}
            />

            {/* Main Content Area */}
            <div className="dayal-admin-main-wrap">
                {/* Modular Header Component */}
                <AdminHeader
                    header={header}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    onRequestLogout={() => setLogoutModalOpen(true)}
                />

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="dayal-container dayal-flash-wrapper">
                        <div className="dayal-alert dayal-alert--success">
                            <CheckCircleIcon width="20" height="20" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="dayal-container dayal-flash-wrapper">
                        <div className="dayal-alert dayal-alert--danger">
                            <AlertIcon width="20" height="20" />
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="dayal-admin-body">
                    {children}
                </main>

                {/* Modular Admin Footer Component */}
                <AdminFooter />
            </div>

            {/* Logout Confirmation Modal */}
            <Modal show={logoutModalOpen} onClose={() => !loggingOut && setLogoutModalOpen(false)}>
                <div style={{ padding: '0.5rem 0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: '#FFF1F2',
                                border: '1px solid #FECDD3',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#E11D48',
                                flexShrink: 0,
                                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.15)',
                            }}
                        >
                            <LogOutIcon width="24" height="24" />
                        </div>
                        <div>
                            <h3 style={{ color: '#0F172A', margin: 0, fontSize: '1.2rem', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>
                                Confirm Sign Out
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Administrator Session
                            </span>
                        </div>
                    </div>

                    <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                        Are you sure you want to end your administrative session? You will be signed out of the <strong>Dayal Sweets Store Manager</strong> console and returned to the login screen.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={() => setLogoutModalOpen(false)}
                            className="dayal-admin-head-btn"
                            style={{ padding: '0.6rem 1.25rem', cursor: 'pointer', fontSize: '0.8125rem' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={handleConfirmLogout}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem 1.35rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.8125rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                backgroundColor: '#E11D48',
                                color: '#FFFFFF',
                                border: 'none',
                                cursor: loggingOut ? 'not-allowed' : 'pointer',
                                opacity: loggingOut ? 0.7 : 1,
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
                            }}
                        >
                            <LogOutIcon width="16" height="16" />
                            <span>{loggingOut ? 'Signing Out...' : 'Yes, Sign Out'}</span>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
