import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminFooter from '@/Components/Admin/AdminFooter';
import { AlertIcon } from '@/Components/Icons';

export default function AdminLayout({ header, children }) {
    const { flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
            {/* Modular Sidebar Component */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                onCloseSidebar={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Modular Header Component */}
                <AdminHeader
                    header={header}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-4 md:mx-8 mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="mx-4 md:mx-8 mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
                        <AlertIcon className="w-5 h-5 flex-shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>

                {/* Modular Footer Component */}
                <AdminFooter />
            </div>
        </div>
    );
}
