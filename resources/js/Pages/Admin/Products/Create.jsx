import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BoxIcon, CheckCircleIcon } from '@/Components/Icons';

export default function Create({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        product_name: '',
        product_price: '',
        product_selling_price: '',
        product_qty: 1, // Initial set 1
        product_description: '',
        product_image: null,
        product_gallaries: [],
        product_details: ['100% Pure Desi Ghee', 'Fresh Daily Batch'],
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [newDetailInput, setNewDetailInput] = useState('');

    // Handle primary image file change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('product_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle multiple galleries file change
    const handleGalleriesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setData('product_gallaries', [...data.product_gallaries, ...files]);

            const newPreviews = files.map((f) => ({
                name: f.name,
                url: URL.createObjectURL(f),
            }));
            setGalleryPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    // Remove single gallery image
    const removeGalleryItem = (index) => {
        setData('product_gallaries', data.product_gallaries.filter((_, idx) => idx !== index));
        setGalleryPreviews((prev) => prev.filter((_, idx) => idx !== index));
    };

    // Handle details list
    const addDetailItem = () => {
        if (newDetailInput.trim()) {
            setData('product_details', [...data.product_details, newDetailInput.trim()]);
            setNewDetailInput('');
        }
    };

    const removeDetailItem = (index) => {
        setData('product_details', data.product_details.filter((_, idx) => idx !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <AdminLayout header="Add New Product">
            <Head title="Create Product - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* View Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.products.index')} style={{ color: '#94a3b8', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Products
                            </Link>
                            <span style={{ color: '#475569', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#F1D7B4', fontSize: '0.8125rem', fontWeight: 600 }}>Create</span>
                        </div>
                        <h1>Add New Product</h1>
                        <p>Create a new product item with pricing, inventory quantity, gallery images, and details.</p>
                    </div>

                    <Link
                        href={route('admin.products.index')}
                        className="dayal-admin-head-btn"
                        style={{ textDecoration: 'none' }}
                    >
                        &larr; Back to Catalog
                    </Link>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="dayal-admin-card" encType="multipart/form-data">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>

                        {/* 1. Basic Info Section */}
                        <div>
                            <h4 style={{ color: '#F8FAFC', fontSize: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                                1. Product Basic Information
                            </h4>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                    Product Name <span style={{ color: '#F87171' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Royal Kaju Katli (500g)"
                                    value={data.product_name}
                                    onChange={(e) => setData('product_name', e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem 1rem',
                                        borderRadius: '0.5rem',
                                        background: '#0F172A',
                                        border: errors.product_name ? '1px solid #F87171' : '1px solid #334155',
                                        color: '#F8FAFC',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                    }}
                                />
                                {errors.product_name && (
                                    <div style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.product_name}</div>
                                )}
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                    Product Category <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem 1rem',
                                        borderRadius: '0.5rem',
                                        background: '#0F172A',
                                        border: errors.category_id ? '1px solid #F87171' : '1px solid #334155',
                                        color: '#F8FAFC',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                    }}
                                >
                                    <option value="">-- No Category (Unassigned) --</option>
                                    {categories && categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.category_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <div style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.category_id}</div>
                                )}
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                    Product Description
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Describe taste, ingredients, craft, and heritage..."
                                    value={data.product_description}
                                    onChange={(e) => setData('product_description', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem 1rem',
                                        borderRadius: '0.5rem',
                                        background: '#0F172A',
                                        border: errors.product_description ? '1px solid #F87171' : '1px solid #334155',
                                        color: '#F8FAFC',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                    }}
                                />
                                {errors.product_description && (
                                    <div style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.product_description}</div>
                                )}
                            </div>
                        </div>

                        {/* 2. Pricing & Inventory */}
                        <div>
                            <h4 style={{ color: '#F8FAFC', fontSize: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                                2. Pricing &amp; Stock Inventory
                            </h4>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                                {/* Regular / MRP Price */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                        Regular Price (₹) <span style={{ color: '#F87171' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={data.product_price}
                                        onChange={(e) => setData('product_price', e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem 1rem',
                                            borderRadius: '0.5rem',
                                            background: '#0F172A',
                                            border: errors.product_price ? '1px solid #F87171' : '1px solid #334155',
                                            color: '#F8FAFC',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                        }}
                                    />
                                    {errors.product_price && (
                                        <div style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.product_price}</div>
                                    )}
                                </div>

                                {/* Selling / Discounted Price */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                        Selling Price (₹) <span style={{ color: '#F87171' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={data.product_selling_price}
                                        onChange={(e) => setData('product_selling_price', e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem 1rem',
                                            borderRadius: '0.5rem',
                                            background: '#0F172A',
                                            border: errors.product_selling_price ? '1px solid #F87171' : '1px solid #334155',
                                            color: '#F8FAFC',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                        }}
                                    />
                                    {errors.product_selling_price && (
                                        <div style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.product_selling_price}</div>
                                    )}
                                </div>

                                {/* Initial Quantity (default 1) */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                        Initial Quantity <span style={{ color: '#B88E4B', fontSize: '0.7rem' }}>(Default: 1)</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="1"
                                        value={data.product_qty}
                                        onChange={(e) => setData('product_qty', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem 1rem',
                                            borderRadius: '0.5rem',
                                            background: '#0F172A',
                                            border: errors.product_qty ? '1px solid #F87171' : '1px solid #334155',
                                            color: '#F8FAFC',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                        }}
                                    />
                                    {errors.product_qty && (
                                        <div style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.product_qty}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Media: Product Image & Galleries */}
                        <div>
                            <h4 style={{ color: '#F8FAFC', fontSize: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                                3. Product Media &amp; Galleries
                            </h4>

                            {/* Main Product Image */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                    Primary Product Image
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{
                                            padding: '0.5rem',
                                            background: '#0F172A',
                                            border: '1px solid #334155',
                                            borderRadius: '0.5rem',
                                            color: '#CBD5E1',
                                            fontSize: '0.8125rem',
                                            flex: 1,
                                        }}
                                    />
                                    {imagePreview && (
                                        <div
                                            style={{
                                                width: '54px',
                                                height: '54px',
                                                borderRadius: '0.5rem',
                                                overflow: 'hidden',
                                                border: '1px solid #B88E4B',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.3rem', display: 'block' }}>
                                    JPG, PNG, or WEBP up to 5MB recommended
                                </span>
                            </div>

                            {/* Galleries Multiple Upload */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                                    Product Galleries (product_gallaries[])
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleGalleriesChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        background: '#0F172A',
                                        border: '1px solid #334155',
                                        borderRadius: '0.5rem',
                                        color: '#CBD5E1',
                                        fontSize: '0.8125rem',
                                        marginBottom: '0.75rem',
                                    }}
                                />

                                {/* Gallery Thumbnails Preview */}
                                {galleryPreviews.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {galleryPreviews.map((item, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    position: 'relative',
                                                    width: '64px',
                                                    height: '64px',
                                                    borderRadius: '0.375rem',
                                                    overflow: 'hidden',
                                                    border: '1px solid #334155',
                                                }}
                                            >
                                                <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryItem(idx)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '2px',
                                                        right: '2px',
                                                        background: 'rgba(239, 68, 68, 0.85)',
                                                        color: '#FFF',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '18px',
                                                        height: '18px',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Product Details List */}
                        <div>
                            <h4 style={{ color: '#F8FAFC', fontSize: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                                4. Product Details &amp; Specifications (product_details list[])
                            </h4>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Add specification item (e.g. Shelf Life: 30 days)..."
                                    value={newDetailInput}
                                    onChange={(e) => setNewDetailInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addDetailItem();
                                        }
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '0.65rem 1rem',
                                        borderRadius: '0.5rem',
                                        background: '#0F172A',
                                        border: '1px solid #334155',
                                        color: '#F8FAFC',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={addDetailItem}
                                    className="dayal-admin-head-btn"
                                    style={{ padding: '0.65rem 1.25rem', cursor: 'pointer', background: '#1E293B', color: '#F1D7B4' }}
                                >
                                    + Add Item
                                </button>
                            </div>

                            {/* Added Details Pills/Rows */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {data.product_details.map((detail, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: '#0F172A',
                                            border: '1px solid #1E293B',
                                            padding: '0.5rem 0.85rem',
                                            borderRadius: '0.375rem',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CheckCircleIcon width="16" height="16" style={{ color: '#34D399', flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>{detail}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDetailItem(idx)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#FB7185',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                            }}
                                            title="Remove detail"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button Bar */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #334155', paddingTop: '1.25rem', marginTop: '1rem' }}>
                            <Link
                                href={route('admin.products.index')}
                                className="dayal-admin-head-btn"
                                style={{ textDecoration: 'none', padding: '0.65rem 1.25rem' }}
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="dayal-btn dayal-btn--primary"
                                style={{
                                    padding: '0.65rem 1.75rem',
                                    opacity: processing ? 0.7 : 1,
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {processing ? 'Creating Product...' : 'Save & Publish Product'}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
