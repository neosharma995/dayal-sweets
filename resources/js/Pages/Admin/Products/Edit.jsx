import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import WooCommerceProductForm from '@/Components/Admin/WooCommerceProductForm';

export default function Edit({ product, categories = [], attributes = [] }) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const initialData = {
        category_id: product.category_id || '',
        product_name: product.product_name || '',
        product_description: product.product_description || '',
        product_price: product.product_price || '',
        product_selling_price: product.product_selling_price || '',
        product_qty: product.product_qty ?? 1,
        product_image: product.product_image || null,
        product_gallaries: Array.isArray(product.product_gallaries) ? product.product_gallaries : [],
        product_details: Array.isArray(product.product_details) ? product.product_details : [],
        variations: Array.isArray(product.variations)
            ? product.variations.map((v) => ({
                  id: v.id,
                  attribute_value_id: v.attribute_value_id || null,
                  variation_name: v.variation_name || '',
                  price: v.price || '',
                  selling_price: v.selling_price || '',
                  product_qty: v.product_qty ?? 1,
                  weight_value: v.weight_value ?? '',
                  weight_unit: v.weight_unit || 'g',
                  sku: v.sku || '',
                  is_default: Boolean(v.is_default),
                  _attribute_value_label: v.attribute_value ? v.attribute_value.value : null,
              }))
            : [],
    };

    const handleSubmit = (payload) => {
        setProcessing(true);
        setErrors({});

        // Send multipart update with _method=put to support file uploads in PHP
        router.post(
            route('admin.products.update', product.id),
            {
                ...payload,
                _method: 'put',
            },
            {
                onFinish: () => setProcessing(false),
                onError: (errs) => {
                    setErrors(errs);
                    setProcessing(false);
                },
            }
        );
    };

    return (
        <AdminLayout header={`Edit Product: ${product.product_name}`}>
            <Head title={`Edit ${product.product_name} - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
                <WooCommerceProductForm
                    initialData={initialData}
                    product={product}
                    categories={categories}
                    attributes={attributes}
                    isEdit={true}
                    onSubmit={handleSubmit}
                    processing={processing}
                    errors={errors}
                />
            </div>
        </AdminLayout>
    );
}
