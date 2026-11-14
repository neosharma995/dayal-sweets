import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminFooter from '@/Components/Admin/AdminFooter';
import { AlertIcon, CheckCircleIcon } from '@/Components/Icons';

export default function AdminLayout({ header, children }) {
    const { flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dayal-admin-shell">
            {/* Modular Sidebar Component */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                onCloseSidebar={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="dayal-admin-main-wrap">
                {/* Modular Header Component */}
                <AdminHeader
                    header={header}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
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
        </div>
    );
}
