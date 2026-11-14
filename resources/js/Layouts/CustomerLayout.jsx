import React from 'react';
import { usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { CheckCircleIcon, AlertIcon } from '@/Components/Icons';

export default function CustomerLayout({ header, children }) {
    const { flash } = usePage().props;

    return (
        <div className="min-h-screen bg-amber-50/40 text-stone-800 flex flex-col font-sans">
            {/* Modular Reusable Header Component */}
            <Header />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 shadow-sm">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="font-medium">{flash.success}</span>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 shadow-sm">
                        <AlertIcon className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        <span className="font-medium">{flash.error}</span>
                    </div>
                </div>
            )}

            {/* Page Header (Subheader banner) */}
            {header && (
                <div className="bg-amber-100/50 border-b border-amber-200/60 py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </div>
            )}

            {/* Page Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Modular Reusable Footer Component */}
            <Footer />
        </div>
    );
}
