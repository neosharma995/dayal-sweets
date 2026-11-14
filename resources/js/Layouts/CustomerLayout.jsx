import React from 'react';
import { usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { CheckCircleIcon, AlertIcon } from '@/Components/Icons';

export default function CustomerLayout({ header, children }) {
    const { flash } = usePage().props;

    return (
        <div className="dayal-customer-shell">
            {/* Modular Reusable Header Component */}
            <Header />

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

            {/* Page Header (Subheader banner) */}
            {header && (
                <div className="dayal-customer-header">
                    <div className="dayal-customer-header-inner">
                        {header}
                    </div>
                </div>
            )}

            {/* Page Content */}
            <main className="dayal-customer-main">
                <div className="dayal-customer-container">
                    {children}
                </div>
            </main>

            {/* Modular Reusable Footer Component */}
            <Footer />
        </div>
    );
}
