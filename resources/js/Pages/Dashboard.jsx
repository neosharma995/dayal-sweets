import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div className="dayal-flex-between">
                    <div>
                        <span className="dayal-badge dayal-badge--gold">Customer Center</span>
                        <h1 className="dayal-font-serif">My Account & Orders</h1>
                    </div>
                    <Link
                        method="post"
                        href={route('logout')}
                        as="button"
                        className="dayal-btn dayal-btn--danger dayal-btn--sm"
                    >
                        Sign Out
                    </Link>
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
        </AuthenticatedLayout>
    );
}
