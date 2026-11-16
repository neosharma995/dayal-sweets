import React from 'react';
import { usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import FlashToaster from '@/Components/FlashToaster';
import { CheckCircleIcon, AlertIcon } from '@/Components/Icons';

export default function CustomerLayout({ header, children }) {
    const { flash } = usePage().props;

    return (
        <div className="dayal-customer-shell">
            {/* Modular Reusable Header Component */}
            <Header />

            {/* Floating Flash Toaster with 4500ms auto-dismiss & close button */}
            <FlashToaster />

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
