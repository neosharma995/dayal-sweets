import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import WooCommerceProductForm from '@/Components/Admin/WooCommerceProductForm';

export default function Create({
    categories = [],
    seasonalMithais = [],
    occasions = [],
    dietPreferences = [],
    tags = [],
    attributes = [],
    taxRates = [],
    outlets = [],
}) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = (payload) => {
        setProcessing(true);
        setErrors({});

        router.post(route('admin.products.store'), payload, {
            onFinish: () => setProcessing(false),
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
        });
    };

    return (
        <AdminLayout header="Add New Product">
            <Head title="Add New Product - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
                <WooCommerceProductForm
                    categories={categories}
                    seasonalMithais={seasonalMithais}
                    occasions={occasions}
                    dietPreferences={dietPreferences}
                    tags={tags}
                    attributes={attributes}
                    taxRates={taxRates}
                    outlets={outlets}
                    isEdit={false}
                    onSubmit={handleSubmit}
                    processing={processing}
                    errors={errors}
                />
            </div>
        </AdminLayout>
    );
}
