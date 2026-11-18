import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminFooter from '@/Components/Admin/AdminFooter';
import EditorLayout from '@/Layouts/EditorLayout';
import FlashToaster from '@/Components/FlashToaster';
import { AlertIcon, CheckCircleIcon, LogOutIcon } from '@/Components/Icons';
import Modal from '@/Components/Modal';

export default function AdminLayout({ header, children }) {
    const { flash, auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // If logged in as editor or inside editor route, delegate directly to the dedicated EditorLayout
    const isEditor = auth?.user?.role === 'editor' || (typeof route !== 'undefined' && route().current && route().current('editor.*'));
    if (isEditor) {
        return (
            <EditorLayout header={header}>
                {children}
            </EditorLayout>
        );
    }

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

                {/* Floating Flash Toaster with 4500ms auto-dismiss & close button */}
                <FlashToaster />

                {/* Page Content */}
                <main className="dayal-admin-body">
                    {children}
                </main>

                {/* Modular Admin Footer Component */}
                <AdminFooter />
            </div>

            {/* Logout Confirmation Modal */}
            <Modal show={logoutModalOpen} onClose={() => !loggingOut && setLogoutModalOpen(false)}>
                <div className="dayal-admin-modal-content">
                    <div className="modal-header-row">
                        <div className="modal-icon-badge">
                            <LogOutIcon width="24" height="24" />
                        </div>
                        <div className="modal-title-text">
                            <h3>Confirm Sign Out</h3>
                            <span>Administrator Session</span>
                        </div>
                    </div>

                    <p className="modal-desc-text">
                        Are you sure you want to end your administrative session? You will be signed out of the <strong>Dayal Sweets Store Manager</strong> console and returned to the login screen.
                    </p>

                    <div className="modal-actions-row">
                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={() => setLogoutModalOpen(false)}
                            className="dayal-admin-head-btn modal-cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={handleConfirmLogout}
                            className="modal-confirm-btn"
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
