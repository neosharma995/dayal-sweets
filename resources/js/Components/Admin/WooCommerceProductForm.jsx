import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { BoxIcon, TagIcon, AlertIcon } from '@/Components/Icons';

export default function WooCommerceProductForm({
    initialData = {},
    categories = [],
    attributes = [],
    isEdit = false,
    product = null,
    onSubmit,
    processing = false,
    errors = {},
}) {
    // Form fields state
    const [title, setTitle] = useState(initialData.product_name || '');
    const [description, setDescription] = useState(initialData.product_description || '');
    const [shortDescription, setShortDescription] = useState(initialData.short_description || '');
    const [categoryId, setCategoryId] = useState(initialData.category_id || '');
    const [regularPrice, setRegularPrice] = useState(initialData.product_price || '');
    const [salePrice, setSalePrice] = useState(initialData.product_selling_price || '');
    const [stockQty, setStockQty] = useState(initialData.product_qty ?? 1);
    const [manageStock, setManageStock] = useState(true);
    const [stockStatus, setStockStatus] = useState('instock');
    const [sku, setSku] = useState(initialData.sku || '');
    const [weight, setWeight] = useState(initialData.weight || '');
    const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });

    // Details / Specifications list
    const [details, setDetails] = useState(
        Array.isArray(initialData.product_details) && initialData.product_details.length > 0
            ? initialData.product_details
            : ['100% Pure Desi Ghee', 'Fresh Daily Batch', 'Store in cool dry place']
    );
    const [newDetail, setNewDetail] = useState('');

    // Product Type: 'variable' or 'simple'
    const [productType, setProductType] = useState(
        Array.isArray(initialData.variations) && initialData.variations.length > 0
            ? 'variable'
            : 'variable' // Default to variable as sweets always have pack sizes
    );

    // Active Tab in Product Data box
    const [activeTab, setActiveTab] = useState('general');

    // Variations state
    const [variations, setVariations] = useState(
        Array.isArray(initialData.variations) ? initialData.variations : []
    );
    const [expandedVariations, setExpandedVariations] = useState(new Set([0]));

    // Attributes state
    const [selectedAttributeId, setSelectedAttributeId] = useState(
        attributes.length > 0 ? String(attributes[0].id) : ''
    );
    const [addedAttributes, setAddedAttributes] = useState(
        attributes.length > 0
            ? [
                  {
                      attributeId: attributes[0].id,
                      name: attributes[0].name,
                      slug: attributes[0].slug,
                      values: attributes[0].values || [],
                      selectedValues: (attributes[0].values || []).map((v) => v.id),
                      visibleOnProductPage: true,
                      usedForVariations: true,
                  },
              ]
            : []
    );

    // Featured Image & Gallery
    const [primaryImageFile, setPrimaryImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        product?.product_image_url || product?.product_image || null
    );

    const [galleryFiles, setGalleryFiles] = useState([]);
    const [existingGalleries, setExistingGalleries] = useState(
        Array.isArray(product?.product_gallaries) ? product.product_gallaries : []
    );
    const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);

    // Auto-calculate discount percentage
    const regNum = Number(regularPrice) || 0;
    const saleNum = Number(salePrice) || 0;
    const discountPercent = regNum > saleNum && regNum > 0 ? Math.round(((regNum - saleNum) / regNum) * 100) : 0;

    // Generated slug for live permalink preview
    const slugPreview = title
        ? title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
        : 'sample-sweet';

    // Helper: Parse weight & unit from strings like "250g", "1kg", "500 gm"
    const parseWeightAndUnit = (str) => {
        if (!str) return { val: '', unit: 'g' };
        const clean = str.trim().toLowerCase();
        const match = clean.match(/^([\d.]+)\s*(kg|g|gm|gms|ml|l|pcs|pc|box)?$/);
        if (match) {
            let unit = match[2] || 'g';
            if (unit === 'gm' || unit === 'gms') unit = 'g';
            if (unit === 'pc') unit = 'pcs';
            return { val: match[1], unit };
        }
        return { val: '', unit: 'g' };
    };

    // Add Attribute to Product
    const handleAddAttribute = () => {
        const found = attributes.find((a) => String(a.id) === String(selectedAttributeId));
        if (!found) return;

        const alreadyAdded = addedAttributes.some((a) => String(a.attributeId) === String(found.id));
        if (alreadyAdded) return;

        setAddedAttributes([
            ...addedAttributes,
            {
                attributeId: found.id,
                name: found.name,
                slug: found.slug,
                values: found.values || [],
                selectedValues: (found.values || []).map((v) => v.id),
                visibleOnProductPage: true,
                usedForVariations: true,
            },
        ]);
    };

    // Toggle a value selection for an attribute
    const toggleAttributeValue = (attrIndex, valId) => {
        const updated = [...addedAttributes];
        const selected = updated[attrIndex].selectedValues;
        if (selected.includes(valId)) {
            updated[attrIndex].selectedValues = selected.filter((id) => id !== valId);
        } else {
            updated[attrIndex].selectedValues = [...selected, valId];
        }
        setAddedAttributes(updated);
    };

    // Select all values for an attribute
    const selectAllAttributeValues = (attrIndex) => {
        const updated = [...addedAttributes];
        updated[attrIndex].selectedValues = updated[attrIndex].values.map((v) => v.id);
        setAddedAttributes(updated);
    };

    // Select none for an attribute
    const selectNoneAttributeValues = (attrIndex) => {
        const updated = [...addedAttributes];
        updated[attrIndex].selectedValues = [];
        setAddedAttributes(updated);
    };

    // Generate variations from selected attribute values
    const handleGenerateVariations = () => {
        const newVars = [];
        let hasDefault = variations.some((v) => v.is_default);

        addedAttributes.forEach((attr) => {
            if (!attr.usedForVariations) return;

            attr.values.forEach((valObj) => {
                if (!attr.selectedValues.includes(valObj.id)) return;

                // Check if variation already exists for this attribute value
                const already = variations.some(
                    (v) => String(v.attribute_value_id) === String(valObj.id)
                );
                if (already) return;

                const parsed = parseWeightAndUnit(valObj.value);
                const isDefault = !hasDefault && newVars.length === 0 && variations.length === 0;
                if (isDefault) hasDefault = true;

                newVars.push({
                    id: null,
                    attribute_value_id: valObj.id,
                    variation_name: `${valObj.value} Pack`,
                    price: regularPrice || '',
                    selling_price: salePrice || '',
                    product_qty: 25,
                    weight_value: parsed.val || '',
                    weight_unit: parsed.unit || 'g',
                    sku: `DS-${valObj.slug.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
                    is_default: isDefault,
                    _attribute_value_label: valObj.value,
                });
            });
        });

        if (newVars.length > 0) {
            setVariations([...variations, ...newVars]);
            setActiveTab('variations');
        }
    };

    // Add single manual variation
    const handleAddManualVariation = () => {
        const isFirst = variations.length === 0;
        const newVar = {
            id: null,
            attribute_value_id: null,
            variation_name: `Custom Pack ${variations.length + 1}`,
            price: regularPrice || '',
            selling_price: salePrice || '',
            product_qty: 20,
            weight_value: '',
            weight_unit: 'g',
            sku: `DS-CUST-${variations.length + 1}`,
            is_default: isFirst,
            _attribute_value_label: 'Custom',
        };
        setVariations([...variations, newVar]);
        setActiveTab('variations');
        setExpandedVariations((prev) => new Set([...prev, variations.length]));
    };

    // Toggle variation expansion
    const toggleVariationExpand = (index) => {
        const next = new Set(expandedVariations);
        if (next.has(index)) {
            next.delete(index);
        } else {
            next.add(index);
        }
        setExpandedVariations(next);
    };

    // Expand or collapse all
    const toggleAllVariations = () => {
        if (expandedVariations.size === variations.length) {
            setExpandedVariations(new Set());
        } else {
            setExpandedVariations(new Set(variations.map((_, i) => i)));
        }
    };

    // Update single variation field
    const handleVariationFieldChange = (index, field, val) => {
        const updated = [...variations];
        updated[index] = { ...updated[index], [field]: val };
        setVariations(updated);
    };

    // Set a variation as default
    const setDefaultVariation = (index) => {
        const updated = variations.map((v, i) => ({
            ...v,
            is_default: i === index,
        }));
        setVariations(updated);

        // Also sync price to main product regular / sale price
        const target = updated[index];
        if (target.price && !regularPrice) setRegularPrice(target.price);
        if (target.selling_price && !salePrice) setSalePrice(target.selling_price);
    };

    // Remove variation
    const removeVariation = (index) => {
        const wasDefault = variations[index]?.is_default;
        const remaining = variations.filter((_, i) => i !== index);
        if (wasDefault && remaining.length > 0) {
            remaining[0].is_default = true;
        }
        setVariations(remaining);
    };

    // Specifications helpers
    const handleAddDetail = () => {
        if (newDetail.trim()) {
            setDetails([...details, newDetail.trim()]);
            setNewDetail('');
        }
    };

    const handleRemoveDetail = (index) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    // Handle primary image
    const handlePrimaryImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPrimaryImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removePrimaryImage = () => {
        setPrimaryImageFile(null);
        setImagePreview(null);
    };

    // Handle galleries
    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setGalleryFiles([...galleryFiles, ...files]);
            const previews = files.map((f) => ({
                name: f.name,
                url: URL.createObjectURL(f),
            }));
            setNewGalleryPreviews([...newGalleryPreviews, ...previews]);
        }
    };

    const removeExistingGallery = (index) => {
        setExistingGalleries(existingGalleries.filter((_, i) => i !== index));
    };

    const removeNewGallery = (index) => {
        setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
        setNewGalleryPreviews(newGalleryPreviews.filter((_, i) => i !== index));
    };

    // Form Submission
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Calculate fallback pricing if base prices were left empty
        let finalRegularPrice = regularPrice;
        let finalSalePrice = salePrice;

        if (variations.length > 0) {
            const def = variations.find((v) => v.is_default) || variations[0];
            if (def) {
                if (!finalRegularPrice && def.price) finalRegularPrice = def.price;
                if (!finalSalePrice && def.selling_price) finalSalePrice = def.selling_price;
            }
        }

        // Prepare combined galleries
        const allGalleries = [...existingGalleries, ...galleryFiles];

        const payload = {
            category_id: categoryId || null,
            product_name: title,
            product_description: description,
            product_price: finalRegularPrice,
            product_selling_price: finalSalePrice,
            product_qty: Number(stockQty) || 1,
            product_details: details,
            variations: productType === 'variable' ? variations : [],
            product_image: primaryImageFile,
            product_gallaries: allGalleries,
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleFormSubmit} className="dayal-wc-form-root">
            {/* View Breadcrumb / Title Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <Link
                        href={route('admin.products.index')}
                        style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}
                    >
                        Products
                    </Link>
                    <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                    <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>
                        {isEdit ? 'Edit Product' : 'Add new product'}
                    </span>
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', margin: 0, fontFamily: 'var(--font-serif, Georgia, serif)' }}>
                    {isEdit ? `Edit Product: ${product?.product_name || title}` : 'Add new product'}
                </h1>
            </div>

            {/* 2-Column WordPress Layout */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) 320px',
                    gap: '1.5rem',
                    alignItems: 'start',
                }}
                className="dayal-wc-layout-grid"
            >
                {/* ========================================================
                    LEFT COLUMN (Main Content Area)
                    ======================================================== */}
                <div className="dayal-wc-main-col">
                    {/* 1. Product Name Title Input */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <input
                            type="text"
                            placeholder="Product name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                fontSize: '1.35rem',
                                fontWeight: 700,
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                border: errors.product_name ? '1px solid #E11D48' : '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#0F172A',
                                outline: 'none',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                        />
                        {errors.product_name && (
                            <p style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>
                                {errors.product_name}
                            </p>
                        )}

                        {/* Permalink Preview */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', fontSize: '0.75rem', color: '#64748B' }}>
                            <strong>Permalink:</strong>
                            <span style={{ color: '#475569', background: '#F1F5F9', padding: '0.15rem 0.5rem', borderRadius: '0.25rem' }}>
                                https://dayalsweets.com/product/<strong>{slugPreview}</strong>
                            </span>
                        </div>
                    </div>

                    {/* 2. Product Long Description Box */}
                    <div className="dayal-wc-meta-box">
                        <div className="dayal-wc-meta-header">
                            <span>Product description</span>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button
                                    type="button"
                                    onClick={() => alert('Media gallery is ready in sidebar.')}
                                    style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.65rem',
                                        background: '#FFFFFF',
                                        border: '1px solid #CBD5E1',
                                        borderRadius: '0.25rem',
                                        color: '#334155',
                                        cursor: 'pointer',
                                    }}
                                >
                                    📷 Add Media
                                </button>
                            </div>
                        </div>
                        <div className="dayal-wc-meta-body">
                            <textarea
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the sweet or savory item: recipe, heritage, authentic ingredients, taste notes..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                    color: '#0F172A',
                                    outline: 'none',
                                    resize: 'vertical',
                                }}
                            />
                            <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: '#64748B' }}>
                                This detailed story is displayed prominently under the description tab on customer product pages.
                            </p>
                        </div>
                    </div>

                    {/* 3. WooCommerce Product Data Meta Box */}
                    <div className="dayal-wc-product-data-box">
                        {/* Header Bar */}
                        <div className="dayal-wc-data-header">
                            <span>Product data —</span>
                            <select
                                value={productType}
                                onChange={(e) => setProductType(e.target.value)}
                                className="dayal-wc-data-type-select"
                            >
                                <option value="variable">Variable product (Weights &amp; Pack Sizes)</option>
                                <option value="simple">Simple product (Fixed Unit)</option>
                            </select>

                            <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: 'auto' }}>
                                {productType === 'variable' ? '✓ Pack size variations enabled' : 'Fixed single product'}
                            </span>
                        </div>

                        {/* Tabs Layout */}
                        <div className="dayal-wc-data-layout">
                            {/* Vertical Tabs Sidebar */}
                            <div className="dayal-wc-data-tabs">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('general')}
                                    className={`dayal-wc-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                                >
                                    <span>⚙️</span>
                                    <span>General</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('inventory')}
                                    className={`dayal-wc-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                                >
                                    <span>📦</span>
                                    <span>Inventory</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('shipping')}
                                    className={`dayal-wc-tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                                >
                                    <span>🚚</span>
                                    <span>Shipping</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('attributes')}
                                    className={`dayal-wc-tab-btn ${activeTab === 'attributes' ? 'active' : ''}`}
                                >
                                    <span>🏷️</span>
                                    <span>Attributes</span>
                                    {addedAttributes.length > 0 && (
                                        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: '#E2E8F0', padding: '0.1rem 0.4rem', borderRadius: '999px', color: '#334155' }}>
                                            {addedAttributes.length}
                                        </span>
                                    )}
                                </button>

                                {productType === 'variable' && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('variations')}
                                        className={`dayal-wc-tab-btn ${activeTab === 'variations' ? 'active' : ''}`}
                                    >
                                        <span>🔀</span>
                                        <span>Variations</span>
                                        {variations.length > 0 && (
                                            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: '#B88E4B', color: '#FFFFFF', padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 700 }}>
                                                {variations.length}
                                            </span>
                                        )}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('specifications')}
                                    className={`dayal-wc-tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                                >
                                    <span>📋</span>
                                    <span>Specifications</span>
                                    {details.length > 0 && (
                                        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: '#E2E8F0', padding: '0.1rem 0.4rem', borderRadius: '999px', color: '#334155' }}>
                                            {details.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Active Tab Panel Content */}
                            <div className="dayal-wc-data-panel">
                                {/* TAB 1: GENERAL */}
                                {activeTab === 'general' && (
                                    <div style={{ maxWidth: '480px' }}>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                                Regular price (₹) <span style={{ color: '#E11D48' }}>*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontWeight: 700 }}>
                                                    ₹
                                                </span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    value={regularPrice}
                                                    onChange={(e) => setRegularPrice(e.target.value)}
                                                    style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 1.85rem' }}
                                                />
                                            </div>
                                            {errors.product_price && (
                                                <span style={{ color: '#E11D48', fontSize: '0.75rem', fontWeight: 600 }}>{errors.product_price}</span>
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                                Sale price (₹) <span style={{ color: '#E11D48' }}>*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontWeight: 700 }}>
                                                    ₹
                                                </span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    value={salePrice}
                                                    onChange={(e) => setSalePrice(e.target.value)}
                                                    style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 1.85rem' }}
                                                />
                                            </div>
                                            {errors.product_selling_price && (
                                                <span style={{ color: '#E11D48', fontSize: '0.75rem', fontWeight: 600 }}>{errors.product_selling_price}</span>
                                            )}
                                        </div>

                                        {discountPercent > 0 && (
                                            <div style={{ padding: '0.75rem 1rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065F46', fontSize: '0.8125rem' }}>
                                                <strong>Live Offer:</strong> {discountPercent}% discount active (Customer saves ₹{(regNum - saleNum).toFixed(2)})
                                            </div>
                                        )}

                                        {productType === 'variable' && (
                                            <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.375rem', fontSize: '0.8125rem', color: '#475569' }}>
                                                💡 <strong>Tip:</strong> In variable products, each individual pack size (e.g. 500g, 1kg) can have its own price under the <strong>Variations</strong> tab.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 2: INVENTORY */}
                                {activeTab === 'inventory' && (
                                    <div style={{ maxWidth: '520px' }}>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                                SKU (Stock Keeping Unit)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. DS-KAJU-KATLI"
                                                value={sku}
                                                onChange={(e) => setSku(e.target.value)}
                                                style={{ width: '100%', padding: '0.55rem 0.75rem' }}
                                            />
                                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Unique identifier for kitchen &amp; store stock management.</span>
                                        </div>

                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={manageStock}
                                                    onChange={(e) => setManageStock(e.target.checked)}
                                                    style={{ width: '16px', height: '16px', accentColor: '#B88E4B' }}
                                                />
                                                Track stock quantity for this product
                                            </label>
                                        </div>

                                        {manageStock && (
                                            <div style={{ marginBottom: '1.25rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                                    Stock quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={stockQty}
                                                    onChange={(e) => setStockQty(e.target.value)}
                                                    style={{ width: '160px', padding: '0.55rem 0.75rem' }}
                                                />
                                            </div>
                                        )}

                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                                Stock status
                                            </label>
                                            <select
                                                value={stockStatus}
                                                onChange={(e) => setStockStatus(e.target.value)}
                                                style={{ width: '220px', padding: '0.55rem 0.75rem' }}
                                            >
                                                <option value="instock">In stock</option>
                                                <option value="outofstock">Out of stock</option>
                                                <option value="onbackorder">On backorder</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: SHIPPING */}
                                {activeTab === 'shipping' && (
                                    <div style={{ maxWidth: '520px' }}>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                                Weight (kg)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="e.g. 0.5"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                                style={{ width: '200px', padding: '0.55rem 0.75rem' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                                Dimensions (cm)
                                            </label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    placeholder="Length"
                                                    value={dimensions.length}
                                                    onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                                                    style={{ width: '100px', padding: '0.55rem 0.75rem' }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Width"
                                                    value={dimensions.width}
                                                    onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                                                    style={{ width: '100px', padding: '0.55rem 0.75rem' }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Height"
                                                    value={dimensions.height}
                                                    onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                                                    style={{ width: '100px', padding: '0.55rem 0.75rem' }}
                                                />
                                            </div>
                                        </div>

                                        <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                            Standard packaging class: Food Grade Sealed Sweet Box.
                                        </p>
                                    </div>
                                )}

                                {/* TAB 4: ATTRIBUTES */}
                                {activeTab === 'attributes' && (
                                    <div>
                                        {/* Attribute Selector Bar */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1rem' }}>
                                            <select
                                                value={selectedAttributeId}
                                                onChange={(e) => setSelectedAttributeId(e.target.value)}
                                                style={{ padding: '0.5rem 0.85rem', minWidth: '220px' }}
                                            >
                                                {attributes.map((attr) => (
                                                    <option key={attr.id} value={attr.id}>
                                                        {attr.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                type="button"
                                                onClick={handleAddAttribute}
                                                className="dayal-btn dayal-btn--secondary dayal-btn--sm"
                                            >
                                                Add Attribute
                                            </button>

                                            <Link
                                                href={route('admin.attributes.index')}
                                                target="_blank"
                                                style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#B88E4B', textDecoration: 'none', fontWeight: 600 }}
                                            >
                                                Configure Global Attributes &rarr;
                                            </Link>
                                        </div>

                                        {/* List of Added Attributes */}
                                        {addedAttributes.length === 0 ? (
                                            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748B' }}>
                                                <TagIcon width="36" height="36" style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                                                <p style={{ margin: 0, fontSize: '0.875rem' }}>No attributes added yet. Select an attribute above and click "Add Attribute".</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {addedAttributes.map((attr, attrIdx) => (
                                                    <div
                                                        key={attr.attributeId}
                                                        style={{
                                                            border: '1px solid #CBD5E1',
                                                            borderRadius: '0.375rem',
                                                            overflow: 'hidden',
                                                            background: '#FFFFFF',
                                                        }}
                                                    >
                                                        <div style={{ padding: '0.65rem 1rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>{attr.name}</strong>
                                                            <button
                                                                type="button"
                                                                onClick={() => setAddedAttributes(addedAttributes.filter((_, i) => i !== attrIdx))}
                                                                style={{ color: '#E11D48', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>

                                                        <div style={{ padding: '1rem' }}>
                                                            {/* Value chips */}
                                                            <div style={{ marginBottom: '0.75rem' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                                                                        Values:
                                                                    </span>
                                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => selectAllAttributeValues(attrIdx)}
                                                                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '0.25rem', cursor: 'pointer', color: '#334155' }}
                                                                        >
                                                                            Select all
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => selectNoneAttributeValues(attrIdx)}
                                                                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '0.25rem', cursor: 'pointer', color: '#334155' }}
                                                                        >
                                                                            Select none
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                                    {attr.values.map((v) => {
                                                                        const isSelected = attr.selectedValues.includes(v.id);
                                                                        return (
                                                                            <button
                                                                                key={v.id}
                                                                                type="button"
                                                                                onClick={() => toggleAttributeValue(attrIdx, v.id)}
                                                                                style={{
                                                                                    padding: '0.35rem 0.75rem',
                                                                                    borderRadius: '999px',
                                                                                    background: isSelected ? '#B88E4B' : '#F1F5F9',
                                                                                    border: isSelected ? '1px solid #B88E4B' : '1px solid #CBD5E1',
                                                                                    color: isSelected ? '#FFFFFF' : '#334155',
                                                                                    fontSize: '0.75rem',
                                                                                    fontWeight: 600,
                                                                                    cursor: 'pointer',
                                                                                    transition: 'all 0.15s ease',
                                                                                }}
                                                                            >
                                                                                {isSelected ? '✓ ' : '+ '}
                                                                                {v.value}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>

                                                            {/* Checkboxes */}
                                                            <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#334155', cursor: 'pointer' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={attr.visibleOnProductPage}
                                                                        onChange={(e) => {
                                                                            const updated = [...addedAttributes];
                                                                            updated[attrIdx].visibleOnProductPage = e.target.checked;
                                                                            setAddedAttributes(updated);
                                                                        }}
                                                                        style={{ accentColor: '#B88E4B' }}
                                                                    />
                                                                    Visible on the product page
                                                                </label>

                                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#334155', cursor: 'pointer' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={attr.usedForVariations}
                                                                        onChange={(e) => {
                                                                            const updated = [...addedAttributes];
                                                                            updated[attrIdx].usedForVariations = e.target.checked;
                                                                            setAddedAttributes(updated);
                                                                        }}
                                                                        style={{ accentColor: '#B88E4B' }}
                                                                    />
                                                                    Used for variations
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateVariations}
                                                        className="dayal-btn dayal-btn--primary dayal-btn--sm"
                                                    >
                                                        Save Attributes &amp; Generate Variations &rarr;
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 5: VARIATIONS */}
                                {activeTab === 'variations' && (
                                    <div>
                                        {/* Variation Actions Bar */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <button
                                                    type="button"
                                                    onClick={handleGenerateVariations}
                                                    className="dayal-btn dayal-btn--secondary dayal-btn--sm"
                                                    title="Generate pack sizes from active attributes"
                                                >
                                                    ⚡ Generate from Attributes
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleAddManualVariation}
                                                    className="dayal-btn dayal-btn--outline dayal-btn--sm"
                                                >
                                                    + Add Variation
                                                </button>
                                            </div>

                                            {variations.length > 0 && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <button
                                                        type="button"
                                                        onClick={toggleAllVariations}
                                                        style={{ fontSize: '0.75rem', color: '#64748B', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                                    >
                                                        {expandedVariations.size === variations.length ? 'Collapse All' : 'Expand All'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Variations Accordion List */}
                                        {variations.length === 0 ? (
                                            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                                                <BoxIcon width="40" height="40" style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                                                <h4 style={{ color: '#0F172A', margin: '0 0 0.35rem', fontSize: '1rem' }}>No variations added yet</h4>
                                                <p style={{ margin: '0 0 1rem', fontSize: '0.8125rem' }}>
                                                    Click <strong>"Generate from Attributes"</strong> to automatically create pack sizes (e.g., 250g, 500g, 1kg) or click <strong>"+ Add Variation"</strong>.
                                                </p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {variations.map((v, index) => {
                                                    const isExpanded = expandedVariations.has(index);

                                                    return (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                border: v.is_default ? '1.5px solid #B88E4B' : '1px solid #CBD5E1',
                                                                borderRadius: '0.375rem',
                                                                background: '#FFFFFF',
                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                                            }}
                                                        >
                                                            {/* Accordion Header */}
                                                            <div
                                                                onClick={() => toggleVariationExpand(index)}
                                                                style={{
                                                                    padding: '0.65rem 1rem',
                                                                    background: v.is_default ? '#FBF4E8' : '#F8FAFC',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    cursor: 'pointer',
                                                                    userSelect: 'none',
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                                    <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                                                                        {isExpanded ? '▼' : '▶'}
                                                                    </span>
                                                                    <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>
                                                                        #{index + 1}: {v.variation_name || `Pack Size ${index + 1}`}
                                                                    </strong>
                                                                    {v.is_default && (
                                                                        <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', background: '#B88E4B', color: '#FFFFFF', borderRadius: '999px', fontWeight: 700 }}>
                                                                            ⭐ Default Pack
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                    <span style={{ fontSize: '0.8125rem', color: '#0F172A', fontWeight: 600 }}>
                                                                        ₹{Number(v.selling_price || v.price || 0).toFixed(2)}
                                                                    </span>
                                                                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                                        {v.product_qty} in stock
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            removeVariation(index);
                                                                        }}
                                                                        style={{
                                                                            background: 'transparent',
                                                                            border: 'none',
                                                                            color: '#E11D48',
                                                                            fontSize: '0.75rem',
                                                                            fontWeight: 600,
                                                                            cursor: 'pointer',
                                                                            padding: '0.2rem 0.5rem',
                                                                        }}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Accordion Body */}
                                                            {isExpanded && (
                                                                <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                                                                        <div>
                                                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                                                Variation Name <span style={{ color: '#E11D48' }}>*</span>
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                value={v.variation_name}
                                                                                onChange={(e) => handleVariationFieldChange(index, 'variation_name', e.target.value)}
                                                                                placeholder="e.g. 500g Pack"
                                                                                required
                                                                                style={{ width: '100%', padding: '0.45rem 0.65rem' }}
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                                                SKU
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                value={v.sku || ''}
                                                                                onChange={(e) => handleVariationFieldChange(index, 'sku', e.target.value)}
                                                                                placeholder="e.g. DS-KK-500G"
                                                                                style={{ width: '100%', padding: '0.45rem 0.65rem' }}
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                                                Regular Price (₹) <span style={{ color: '#E11D48' }}>*</span>
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                step="0.01"
                                                                                min="0"
                                                                                value={v.price}
                                                                                onChange={(e) => handleVariationFieldChange(index, 'price', e.target.value)}
                                                                                placeholder="0.00"
                                                                                required
                                                                                style={{ width: '100%', padding: '0.45rem 0.65rem' }}
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                                                Sale Price (₹) <span style={{ color: '#E11D48' }}>*</span>
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                step="0.01"
                                                                                min="0"
                                                                                value={v.selling_price}
                                                                                onChange={(e) => handleVariationFieldChange(index, 'selling_price', e.target.value)}
                                                                                placeholder="0.00"
                                                                                required
                                                                                style={{ width: '100%', padding: '0.45rem 0.65rem' }}
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                                                Stock Quantity
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                value={v.product_qty}
                                                                                onChange={(e) => handleVariationFieldChange(index, 'product_qty', e.target.value)}
                                                                                placeholder="10"
                                                                                style={{ width: '100%', padding: '0.45rem 0.65rem' }}
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                                                Weight &amp; Unit
                                                                            </label>
                                                                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                                                <input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    value={v.weight_value ?? ''}
                                                                                    onChange={(e) => handleVariationFieldChange(index, 'weight_value', e.target.value)}
                                                                                    placeholder="500"
                                                                                    style={{ width: '70%', padding: '0.45rem 0.65rem' }}
                                                                                />
                                                                                <select
                                                                                    value={v.weight_unit || 'g'}
                                                                                    onChange={(e) => handleVariationFieldChange(index, 'weight_unit', e.target.value)}
                                                                                    style={{ width: '30%', padding: '0.45rem 0.25rem' }}
                                                                                >
                                                                                    <option value="g">g</option>
                                                                                    <option value="kg">kg</option>
                                                                                    <option value="pcs">pcs</option>
                                                                                    <option value="box">box</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#0F172A', cursor: 'pointer', fontWeight: 600 }}>
                                                                            <input
                                                                                type="radio"
                                                                                name="default_variation_radio"
                                                                                checked={Boolean(v.is_default)}
                                                                                onChange={() => setDefaultVariation(index)}
                                                                                style={{ accentColor: '#B88E4B' }}
                                                                            />
                                                                            Make this the pre-selected default pack size
                                                                        </label>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeVariation(index)}
                                                                            style={{ color: '#E11D48', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                                        >
                                                                            Delete this variation
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 6: SPECIFICATIONS */}
                                {activeTab === 'specifications' && (
                                    <div style={{ maxWidth: '560px' }}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                                Product Highlights &amp; Bullet Points
                                            </label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    value={newDetail}
                                                    onChange={(e) => setNewDetail(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleAddDetail();
                                                        }
                                                    }}
                                                    placeholder="e.g. 100% Pure Desi Ghee or Shelf Life: 15 Days"
                                                    style={{ flex: 1, padding: '0.55rem 0.75rem' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddDetail}
                                                    className="dayal-btn dayal-btn--secondary dayal-btn--sm"
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            {details.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '0.5rem 0.75rem',
                                                        background: '#F8FAFC',
                                                        border: '1px solid #E2E8F0',
                                                        borderRadius: '0.375rem',
                                                        fontSize: '0.8125rem',
                                                        color: '#0F172A',
                                                    }}
                                                >
                                                    <span>• {item}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveDetail(idx)}
                                                        style={{ background: 'transparent', border: 'none', color: '#E11D48', cursor: 'pointer', fontSize: '0.875rem' }}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 4. Product Short Description Box */}
                    <div className="dayal-wc-meta-box">
                        <div className="dayal-wc-meta-header">
                            <span>Product short description</span>
                        </div>
                        <div className="dayal-wc-meta-body">
                            <textarea
                                rows={3}
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                placeholder="A brief one or two sentence summary shown beside the main product photo on store..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    lineHeight: 1.5,
                                    color: '#0F172A',
                                    outline: 'none',
                                    resize: 'vertical',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    RIGHT SIDEBAR (WordPress Meta Boxes)
                    ======================================================== */}
                <div className="dayal-wc-sidebar-col">
                    {/* Meta Box 1: Publish */}
                    <div className="dayal-wc-meta-box">
                        <div className="dayal-wc-meta-header">
                            <span>Publish</span>
                        </div>
                        <div className="dayal-wc-meta-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8125rem', color: '#475569', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Status:</span>
                                    <strong style={{ color: '#0F172A' }}>Published</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Visibility:</span>
                                    <strong style={{ color: '#0F172A' }}>Public</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Catalog:</span>
                                    <strong style={{ color: '#0F172A' }}>Shop &amp; Search</strong>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                                <Link
                                    href={route('admin.products.index')}
                                    className="dayal-admin-head-btn"
                                    style={{ textDecoration: 'none', fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="dayal-btn dayal-btn--primary"
                                    style={{ fontSize: '0.8125rem', padding: '0.55rem 1.25rem' }}
                                >
                                    {processing ? 'Saving...' : isEdit ? 'Update Product' : 'Publish Product'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Meta Box 2: Product Categories */}
                    <div className="dayal-wc-meta-box">
                        <div className="dayal-wc-meta-header">
                            <span>Product categories</span>
                            <Link
                                href={route('admin.categories.create')}
                                target="_blank"
                                style={{ fontSize: '0.75rem', color: '#B88E4B', textDecoration: 'none', fontWeight: 600 }}
                            >
                                + Add new
                            </Link>
                        </div>
                        <div className="dayal-wc-meta-body">
                            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {categories.map((c) => (
                                    <label
                                        key={c.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.8125rem',
                                            color: '#0F172A',
                                            cursor: 'pointer',
                                            padding: '0.2rem 0',
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="product_category"
                                            checked={String(categoryId) === String(c.id)}
                                            onChange={() => setCategoryId(c.id)}
                                            style={{ accentColor: '#B88E4B' }}
                                        />
                                        <span>{c.category_name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Meta Box 3: Product Image (Featured Image) */}
                    <div className="dayal-wc-meta-box">
                        <div className="dayal-wc-meta-header">
                            <span>Product image</span>
                        </div>
                        <div className="dayal-wc-meta-body" style={{ textAlign: 'center' }}>
                            {imagePreview ? (
                                <div>
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '180px',
                                            borderRadius: '0.375rem',
                                            overflow: 'hidden',
                                            border: '1px solid #CBD5E1',
                                            marginBottom: '0.75rem',
                                            background: '#F8FAFC',
                                        }}
                                    >
                                        <img
                                            src={imagePreview}
                                            alt="Featured Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removePrimaryImage}
                                        style={{
                                            fontSize: '0.75rem',
                                            color: '#E11D48',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        Remove product image
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '2rem 1rem',
                                            border: '2px dashed #CBD5E1',
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer',
                                            background: '#F8FAFC',
                                        }}
                                    >
                                        <BoxIcon width="32" height="32" style={{ color: '#B88E4B', marginBottom: '0.5rem' }} />
                                        <span style={{ fontSize: '0.8125rem', color: '#B88E4B', fontWeight: 600, textDecoration: 'underline' }}>
                                            Set product image
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.25rem' }}>
                                            PNG, JPG or WEBP up to 5MB
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePrimaryImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meta Box 4: Product Gallery */}
                    <div className="dayal-wc-meta-box">
                        <div className="dayal-wc-meta-header">
                            <span>Product gallery</span>
                        </div>
                        <div className="dayal-wc-meta-body">
                            {/* Gallery Thumbnails Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                {/* Existing stored gallery photos */}
                                {existingGalleries.map((item, idx) => (
                                    <div
                                        key={`exist-${idx}`}
                                        style={{
                                            position: 'relative',
                                            aspectRatio: '1',
                                            borderRadius: '0.25rem',
                                            overflow: 'hidden',
                                            border: '1px solid #CBD5E1',
                                        }}
                                    >
                                        <img
                                            src={typeof item === 'string' && item.startsWith('/') ? item : `/storage/${item}`}
                                            alt={`Gallery ${idx + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingGallery(idx)}
                                            style={{
                                                position: 'absolute',
                                                top: '2px',
                                                right: '2px',
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                background: 'rgba(225, 29, 72, 0.85)',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '11px',
                                            }}
                                            title="Remove image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}

                                {/* Newly chosen gallery photos */}
                                {newGalleryPreviews.map((p, idx) => (
                                    <div
                                        key={`new-${idx}`}
                                        style={{
                                            position: 'relative',
                                            aspectRatio: '1',
                                            borderRadius: '0.25rem',
                                            overflow: 'hidden',
                                            border: '1.5px solid #B88E4B',
                                        }}
                                    >
                                        <img
                                            src={p.url}
                                            alt={p.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewGallery(idx)}
                                            style={{
                                                position: 'absolute',
                                                top: '2px',
                                                right: '2px',
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                background: 'rgba(225, 29, 72, 0.85)',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '11px',
                                            }}
                                            title="Remove preview"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add images button */}
                            <label
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    padding: '0.5rem',
                                    background: '#F8FAFC',
                                    border: '1px dashed #CBD5E1',
                                    borderRadius: '0.25rem',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    color: '#B88E4B',
                                    fontWeight: 600,
                                }}
                            >
                                + Add product gallery images
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleGalleryUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
