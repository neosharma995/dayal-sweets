import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function AuthenticatedLayout({ header, children }) {
    return (
        <CustomerLayout header={header}>
            {children}
        </CustomerLayout>
    );
}
