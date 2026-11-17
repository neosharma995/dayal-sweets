import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { AlertIcon } from '@/Components/Icons';

export default function Gallery({ page }) {
    const sections = page?.sections || {};

    // Top Bar Section Fields
    const [topBarHeading, setTopBarHeading] = useState(
        sections.top_bar_Heading ?? 'OUR GALLERY'
    );
    const [topBarSubHeading, setTopBarSubHeading] = useState(
        sections.top_bar_sub_heading ?? 'Every Picture Tells a Sweet Story'
    );
    const [topBarDescription, setTopBarDescription] = useState(
        sections.top_bar_description ?? 'Enjoy authentic Indian, Himachali, Chinese, South Indian, and Fast Food prepared fresh every day by our experienced chefs.'
    );

    // Gallery Categories
    const initialCategories = Array.isArray(sections.categories) && sections.categories.length > 0
        ? sections.categories
        : [
            { id: 'corporate', name: 'Corporate' },
            { id: 'customers', name: 'Customers' },
            { id: 'dining', name: 'Dining' },
            { id: 'events', name: 'Events' },
            { id: 'festival', name: 'Festival' },
            { id: 'food', name: 'Food' },
            { id: 'kitchen', name: 'Kitchen' },
            { id: 'restaurant', name: 'Restaurant' },
            { id: 'snacks', name: 'Snacks' },
            { id: 'sweets', name: 'Sweets' },
        ];
    const [categories, setCategories] = useState(initialCategories);

    // Gallery Images (images[])
    const initialImages = Array.isArray(sections.images) && sections.images.length > 0
        ? sections.images.map((img, idx) => ({
            id: img.id || idx + 1,
            name: img.name || img.title || '',
            category: img.category || (Array.isArray(img.categories) ? img.categories[0] : 'dining'),
            image: img.image || '',
        }))
        : [];
    const [images, setImages] = useState(initialImages);

    // Filter controls for Left-side photo grid
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

    // Page action state
    const [processing, setProcessing] = useState(false);
    const [isSavingEntity, setIsSavingEntity] = useState(false);
    const [errors, setErrors] = useState({});
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [closeHovered, setCloseHovered] = useState(false);
    const [previewHovered, setPreviewHovered] = useState(false);

    // CSRF helper
    const getCsrfToken = () => {
        const metaTag = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (metaTag) return metaTag;
        const cookieMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return cookieMatch ? decodeURIComponent(cookieMatch[1]) : '';
    };

    const showFeedback = (msg) => {
        setFeedbackMessage(msg);
        setSaveSuccess(true);
        setTimeout(() => {
            setSaveSuccess(false);
            setFeedbackMessage('');
        }, 5000);
    };

    // Instant persistence helper to save changes directly to DB
    const saveToServer = async (overrides = {}) => {
        setProcessing(true);
        setIsSavingEntity(true);
        setErrors({});

        const catsToSave = (overrides.categories ?? categories).filter((c) => c.name && c.name.trim() !== '');
        const imgsToSave = (overrides.images ?? images).filter((img) => img.name && img.name.trim() !== '');

        const payload = {
            top_bar_Heading: overrides.top_bar_Heading ?? topBarHeading,
            top_bar_sub_heading: overrides.top_bar_sub_heading ?? topBarSubHeading,
            top_bar_description: overrides.top_bar_description ?? topBarDescription,
            categories: catsToSave,
            images: imgsToSave,
        };

        try {
            const token = getCsrfToken();
            const res = await fetch(route('admin.pages.gallery.update'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                return true;
            } else {
                setErrors(data.errors || { general: data.message || 'Error saving changes.' });
                return false;
            }
        } catch (err) {
            console.error('Save to server error:', err);
            // Fallback via Inertia router
            router.post(route('admin.pages.gallery.update'), payload, {
                preserveScroll: true,
                onError: (errs) => setErrors(errs),
                onFinish: () => {
                    setProcessing(false);
                    setIsSavingEntity(false);
                },
            });
            return false;
        } finally {
            setProcessing(false);
            setIsSavingEntity(false);
        }
    };

    // ==========================================
    // RIGHT SIDEBAR FORM 1: Add Category State
    // ==========================================
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryError, setCategoryError] = useState('');

    const handleAddCategorySubmit = async (e) => {
        e.preventDefault();
        const trimmed = newCategoryName.trim();
        if (!trimmed) {
            setCategoryError('Category Name cannot be empty.');
            return;
        }

        const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const exists = categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase() || c.id === slug);
        if (exists) {
            setCategoryError('Category with this name already exists.');
            return;
        }

        const newCat = { id: slug || `cat-${Date.now()}`, name: trimmed };
        // Prepend category so newly added appears on top (descending order)
        const nextCategories = [newCat, ...categories];
        setCategories(nextCategories);
        setNewCategoryName('');
        setCategoryError('');
        // Automatically default photo form category to the new category
        setPhotoForm((prev) => ({ ...prev, category: newCat.id }));

        // Instantly save to database!
        const saved = await saveToServer({ categories: nextCategories });
        if (saved) {
            showFeedback(`Category "${trimmed}" added and saved live! Visible on /gallery page.`);
        }
    };

    // Delete Confirmation Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [warningModalMessage, setWarningModalMessage] = useState('');

    const handleRequestRemoveCategory = (index) => {
        if (categories.length <= 1) {
            setWarningModalMessage('At least one category is required in the gallery.');
            return;
        }
        setItemToDelete({
            type: 'category',
            index,
            item: categories[index],
        });
        setDeleteModalOpen(true);
    };

    const handleRequestDeletePhoto = (img) => {
        setItemToDelete({
            type: 'photo',
            item: img,
        });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        let nextImages = images;
        let nextCategories = categories;
        let deletedMsg = '';

        if (itemToDelete.type === 'photo') {
            const id = itemToDelete.item.id;
            nextImages = images.filter((item) => item.id !== id);
            setImages(nextImages);
            if (editingImageId === id) {
                handleCancelPhotoEdit();
            }
            deletedMsg = 'Photo deleted and updated live on gallery page!';
        } else if (itemToDelete.type === 'category') {
            const catToRemove = itemToDelete.item;
            nextCategories = categories.filter((_, i) => i !== itemToDelete.index);
            setCategories(nextCategories);

            // Fallback assigned images to remaining[0]
            const fallback = nextCategories[0]?.id || 'all';
            nextImages = images.map((img) => (img.category === catToRemove.id ? { ...img, category: fallback } : img));
            setImages(nextImages);

            if (selectedCategoryFilter === catToRemove.id) {
                setSelectedCategoryFilter('all');
            }
            deletedMsg = `Category "${catToRemove.name}" deleted and updated live!`;
        }

        setDeleteModalOpen(false);
        setItemToDelete(null);

        // Instantly save to database!
        const saved = await saveToServer({ categories: nextCategories, images: nextImages });
        if (saved && deletedMsg) {
            showFeedback(deletedMsg);
        }
    };

    // ==========================================
    // RIGHT SIDEBAR FORM 2: Add / Edit Photo State
    // ==========================================
    const [editingImageId, setEditingImageId] = useState(null);
    const [photoForm, setPhotoForm] = useState({
        name: '',
        category: categories[0]?.id || 'dining',
        image: '',
    });
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [photoFormError, setPhotoFormError] = useState('');

    const handlePhotoFileUpload = async (file) => {
        if (!file) return;
        setIsUploadingPhoto(true);
        setPhotoFormError('');

        const formData = new FormData();
        formData.append('image_file', file);

        try {
            const csrfToken = getCsrfToken();
            const res = await fetch(route('admin.pages.gallery.upload-image'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await res.json();
            if (data.success && data.url) {
                setPhotoForm((prev) => ({ ...prev, image: data.url }));
            } else {
                setPhotoFormError(data.message || 'Image upload failed.');
            }
        } catch (err) {
            console.error('File upload error:', err);
            setPhotoFormError('Network error while uploading image.');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handlePhotoFormSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = photoForm.name.trim();
        if (!trimmedName) {
            setPhotoFormError('Image Name / Title is required.');
            return;
        }
        if (!photoForm.image.trim()) {
            setPhotoFormError('Please upload an image.');
            return;
        }

        const selectedCat = photoForm.category || categories[0]?.id || 'dining';
        let nextImages = [];
        const isEdit = editingImageId !== null;

        if (isEdit) {
            // Update existing photo
            nextImages = images.map((item) => (
                item.id === editingImageId
                    ? {
                        ...item,
                        name: trimmedName,
                        category: selectedCat,
                        image: photoForm.image.trim(),
                    }
                    : item
            ));
            setImages(nextImages);
            setEditingImageId(null);
        } else {
            // Add new photo prepended at top (descending order)
            const newPhoto = {
                id: Date.now(),
                name: trimmedName,
                category: selectedCat,
                image: photoForm.image.trim(),
            };
            nextImages = [newPhoto, ...images];
            setImages(nextImages);
        }

        // Reset sidebar photo form
        setPhotoForm({
            name: '',
            category: selectedCat,
            image: '',
        });
        setPhotoFormError('');

        // Instantly save to database!
        const saved = await saveToServer({ images: nextImages });
        if (saved) {
            showFeedback(
                isEdit
                    ? `Photo "${trimmedName}" updated and saved live!`
                    : `Photo "${trimmedName}" added and saved live! Visible on /gallery page.`
            );
        }
    };

    const handleEditPhotoClick = (img) => {
        setEditingImageId(img.id);
        setPhotoForm({
            name: img.name || '',
            category: img.category || categories[0]?.id || 'dining',
            image: img.image || '',
        });
        setPhotoFormError('');

        // Smooth scroll to sidebar on mobile
        const sidebar = document.getElementById('gallery-right-sidebar');
        if (sidebar && window.innerWidth < 1024) {
            sidebar.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCancelPhotoEdit = () => {
        setEditingImageId(null);
        setPhotoForm({
            name: '',
            category: categories[0]?.id || 'dining',
            image: '',
        });
        setPhotoFormError('');
    };

    // ==========================================
    // Save All Changes (Inertia POST to DB)
    // ==========================================
    const handleSaveAll = async (e) => {
        if (e) e.preventDefault();
        const saved = await saveToServer();
        if (saved) {
            showFeedback('Gallery page content updated successfully! Check the live website.');
        }
    };

    // Filter photos for left grid display
    const filteredImages = images.filter((img) => {
        const matchesQuery = !searchQuery.trim() || img.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategoryFilter === 'all' || img.category === selectedCategoryFilter;
        return matchesQuery && matchesCategory;
    });

    return (
        <AdminLayout header="Gallery Page Settings">
            <Head title="Gallery Page Settings - Dayal Sweets Admin" />

            <style>{`
                .dayal-gallery-6-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 0.75rem;
                }
                @media (max-width: 1536px) {
                    .dayal-gallery-6-grid {
                        grid-template-columns: repeat(5, 1fr);
                    }
                }
                @media (max-width: 1280px) {
                    .dayal-gallery-6-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }
                @media (max-width: 992px) {
                    .dayal-gallery-6-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                @media (max-width: 640px) {
                    .dayal-gallery-6-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 380px) {
                    .dayal-gallery-6-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .dayal-custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .dayal-custom-scroll::-webkit-scrollbar-track {
                    background: #F1F5F9;
                    border-radius: 4px;
                }
                .dayal-custom-scroll::-webkit-scrollbar-thumb {
                    background: #CBD5E1;
                    border-radius: 4px;
                }
                .dayal-custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: #94A3B8;
                }
            `}</style>

            <div className="dayal-container" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
                {/* Header with Top Action Buttons: Preview, Save, X */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <Link href={route('admin.pages.index')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Pages
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Gallery</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Gallery Page 
                        </h1>
                        
                    </div>

                    {/* Top Buttons: Preview, Save, X */}
                    <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                        {/* Preview Button */}
                        <a
                            href="/gallery"
                            target="_blank"
                            rel="noreferrer"
                            onMouseEnter={() => setPreviewHovered(true)}
                            onMouseLeave={() => setPreviewHovered(false)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 1rem',
                                borderRadius: '0.5rem',
                                border: previewHovered ? '1px solid #94A3B8' : '1px solid #CBD5E1',
                                backgroundColor: previewHovered ? '#F8FAFC' : '#FFFFFF',
                                color: '#1E293B',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.15s ease',
                            }}
                            title="Live Preview in new tab"
                        >
                            <span>Preview</span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                        </a>

                        {/* Save Button */}
                        <button
                            type="button"
                            onClick={handleSaveAll}
                            disabled={processing}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '38px',
                                padding: '0 1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #7A1C1C',
                                backgroundColor: processing ? '#991B1B' : '#7A1C1C',
                                color: '#FFFFFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                boxShadow: '0 1px 2px 0 rgba(122, 28, 28, 0.25)',
                                transition: 'all 0.15s ease',
                                minWidth: '95px',
                            }}
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>

                        {/* Close / X Button */}
                        <Link
                            href={route('admin.pages.index')}
                            onMouseEnter={() => setCloseHovered(true)}
                            onMouseLeave={() => setCloseHovered(false)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '38px',
                                height: '38px',
                                borderRadius: '0.5rem',
                                border: closeHovered ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                                backgroundColor: closeHovered ? '#FEF2F2' : '#FFFFFF',
                                color: closeHovered ? '#DC2626' : '#64748B',
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.15s ease',
                                cursor: 'pointer',
                            }}
                            title="Close"
                            aria-label="Close"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {saveSuccess && (
                    <div style={{ padding: '0.85rem 1.25rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '0.5rem', color: '#065F46', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>✓</span> {feedbackMessage || 'Gallery content updated successfully! Check the live website.'}
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div style={{ padding: '0.85rem 1.25rem', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '0.5rem', color: '#DC2626', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Please correct the errors:</strong>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem' }}>
                            {Object.entries(errors).map(([key, msg]) => (
                                <li key={key}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* ========================================================= */}
                {/* 2-COLUMN LAYOUT: LEFT (MAIN CONTENT) + RIGHT (SIDEBAR)     */}
                {/* ========================================================= */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* ----------------------------------------------------- */}
                    {/* LEFT COLUMN: Top Bar + Categories + 4-Grid Photos     */}
                    {/* ----------------------------------------------------- */}
                    <div style={{ flex: '1 1 650px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* 1. Top Bar Section */}
                        <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                                Top Bar Section
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 1.25rem 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                                Heading, sub-heading, and description displayed inside the top red hero banner.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Heading / Title <span style={{ color: '#E11D48' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={topBarHeading}
                                        onChange={(e) => setTopBarHeading(e.target.value)}
                                        placeholder="OUR GALLERY"
                                        required
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Sub Heading
                                    </label>
                                    <input
                                        type="text"
                                        value={topBarSubHeading}
                                        onChange={(e) => setTopBarSubHeading(e.target.value)}
                                        placeholder="Every Picture Tells a Sweet Story"
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={topBarDescription}
                                        onChange={(e) => setTopBarDescription(e.target.value)}
                                        placeholder="Enjoy authentic Indian, Himachali, Chinese, South Indian, and Fast Food prepared fresh every day by our experienced chefs."
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Gallery Photos (Clean 6x6 Grid: 6, 6, 6) */}
                        <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                        Gallery Photos ({images.length} Photos)
                                    </h3>
                                     
                                </div>
                            </div>

                            {/* Search & Filter Toolbar */}
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
                                <input
                                    type="text"
                                    placeholder="Search photos by title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: '0.45rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.8125rem',
                                        width: '240px',
                                        outline: 'none',
                                    }}
                                />

                                <select
                                    value={selectedCategoryFilter}
                                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                                    style={{
                                        padding: '0.45rem 0.85rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.8125rem',
                                        outline: 'none',
                                        background: '#FFFFFF',
                                    }}
                                >
                                    <option value="all">All Categories ({images.length})</option>
                                    {categories.map((cat) => {
                                        const count = images.filter((img) => img.category === cat.id).length;
                                        return (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name} ({count})
                                            </option>
                                        );
                                    })}
                                </select>

                                <div style={{ fontSize: '0.8125rem', color: '#64748B', marginLeft: 'auto' }}>
                                    Showing <strong>{filteredImages.length}</strong> of <strong>{images.length}</strong>
                                </div>
                            </div>

                            {/* 6-Column Grid Container with Scroll for Overflow */}
                            {filteredImages.length > 0 ? (
                                <div className="dayal-custom-scroll" style={{ maxHeight: '720px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                                    <div className="dayal-gallery-6-grid">
                                        {filteredImages.map((img) => {
                                            const catObj = categories.find((c) => c.id === img.category);
                                            const categoryName = catObj ? catObj.name : img.category;
                                            const isBeingEdited = editingImageId === img.id;

                                            return (
                                                <div
                                                    key={img.id}
                                                    style={{
                                                        background: '#FFFFFF',
                                                        border: isBeingEdited ? '2px solid #7A1C1C' : '1px solid #E2E8F0',
                                                        borderRadius: '0.5rem',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 4px 10px -1px rgba(0, 0, 0, 0.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                                                    }}
                                                >
                                                    {/* 1. Image */}
                                                    <div
                                                        style={{
                                                            position: 'relative',
                                                            width: '100%',
                                                            height: '115px',
                                                            background: '#F1F5F9',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {img.image ? (
                                                            <img
                                                                src={img.image}
                                                                alt={img.name}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    display: 'block',
                                                                }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.7rem' }}>
                                                                No Image
                                                            </div>
                                                        )}

                                                        {/* Quick Delete on Top-Right */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRequestDeletePhoto(img);
                                                            }}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '4px',
                                                                right: '4px',
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius: '50%',
                                                                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                                                                color: '#DC2626',
                                                                border: 'none',
                                                                fontSize: '0.85rem',
                                                                fontWeight: 700,
                                                                lineHeight: 1,
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                                            }}
                                                            title="Delete photo"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>

                                                    {/* Card Body */}
                                                    <div style={{ padding: '0.55rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                        {/* 2. Image Name + Edit Icon */}
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
                                                            <span
                                                                style={{
                                                                    fontSize: '0.78rem',
                                                                    fontWeight: 600,
                                                                    color: '#0F172A',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    flex: 1,
                                                                }}
                                                                title={img.name}
                                                            >
                                                                {img.name}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleEditPhotoClick(img)}
                                                                style={{
                                                                    background: isBeingEdited ? '#7A1C1C' : '#F1F5F9',
                                                                    border: 'none',
                                                                    borderRadius: '0.25rem',
                                                                    padding: '0.2rem 0.35rem',
                                                                    cursor: 'pointer',
                                                                    color: isBeingEdited ? '#FFFFFF' : '#475569',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flexShrink: 0,
                                                                    transition: 'all 0.15s ease',
                                                                }}
                                                                title="Edit photo"
                                                                aria-label="Edit photo"
                                                            >
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        {/* 3. Category Name */}
                                                        <div
                                                            style={{
                                                                fontSize: '0.6875rem',
                                                                color: '#64748B',
                                                                fontWeight: 500,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                            title={categoryName}
                                                        >
                                                            {categoryName}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '0.5rem', border: '1px dashed #CBD5E1', color: '#64748B', fontSize: '0.875rem' }}>
                                    No gallery photos found. Use the form on the right sidebar to add photos.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ----------------------------------------------------- */}
                    {/* RIGHT COLUMN: SIDEBAR (Categories + Add Photo Form)   */}
                    {/* ----------------------------------------------------- */}
                    <div id="gallery-right-sidebar" style={{ width: '360px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '1rem' }}>
                        {/* SIDEBAR CARD 1: Gallery Categories */}
                        <div className="dayal-admin-table-card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                    Gallery Categories ({categories.length})
                                </h3>
                                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                                    {images.length} photos
                                </span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 0.85rem 0' }}>
                                Add category below and click any to filter photos.
                            </p>

                            {/* Add New Category Inline Form */}
                            <form onSubmit={handleAddCategorySubmit} style={{ marginBottom: '0.85rem' }}>
                                {categoryError && (
                                    <div style={{ padding: '0.4rem 0.6rem', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '0.375rem', color: '#DC2626', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
                                        {categoryError}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="New category..."
                                        style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem' }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSavingEntity}
                                        style={{
                                            padding: '0.45rem 0.85rem',
                                            borderRadius: '0.375rem',
                                            background: '#B88E4B',
                                            color: '#FFFFFF',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            border: 'none',
                                            cursor: isSavingEntity ? 'not-allowed' : 'pointer',
                                            opacity: isSavingEntity ? 0.7 : 1,
                                            whiteSpace: 'nowrap',
                                            boxShadow: '0 1px 2px rgba(184, 142, 75, 0.25)',
                                        }}
                                    >
                                        {isSavingEntity ? 'Saving...' : '+ Add'}
                                    </button>
                                </div>
                            </form>

                            {/* Scrollable Categories List */}
                            <div
                                className="dayal-custom-scroll"
                                style={{
                                    maxHeight: '230px',
                                    overflowY: 'auto',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '0.375rem',
                                    padding: '0.4rem',
                                    background: '#F8FAFC',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.3rem',
                                }}
                            >
                                {/* "All Categories" Filter Pill */}
                                <div
                                    onClick={() => setSelectedCategoryFilter('all')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.35rem 0.6rem',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer',
                                        background: selectedCategoryFilter === 'all' ? '#7A1C1C' : '#FFFFFF',
                                        color: selectedCategoryFilter === 'all' ? '#FFFFFF' : '#1E293B',
                                        border: '1px solid ' + (selectedCategoryFilter === 'all' ? '#7A1C1C' : '#E2E8F0'),
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <span>All Categories</span>
                                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', background: selectedCategoryFilter === 'all' ? 'rgba(255,255,255,0.25)' : '#E2E8F0', color: selectedCategoryFilter === 'all' ? '#FFFFFF' : '#64748B' }}>
                                        {images.length}
                                    </span>
                                </div>

                                {categories.map((cat, idx) => {
                                    const photoCount = images.filter((img) => img.category === cat.id).length;
                                    const isSelected = selectedCategoryFilter === cat.id;

                                    return (
                                        <div
                                            key={cat.id || idx}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.35rem 0.6rem',
                                                borderRadius: '0.25rem',
                                                background: isSelected ? '#7A1C1C' : '#FFFFFF',
                                                color: isSelected ? '#FFFFFF' : '#1E293B',
                                                border: '1px solid ' + (isSelected ? '#7A1C1C' : '#E2E8F0'),
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <span
                                                onClick={() => setSelectedCategoryFilter(isSelected ? 'all' : cat.id)}
                                                style={{ cursor: 'pointer', flex: 1 }}
                                                title={`Filter photos by ${cat.name}`}
                                            >
                                                {cat.name}
                                            </span>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', background: isSelected ? 'rgba(255,255,255,0.25)' : '#E2E8F0', color: isSelected ? '#FFFFFF' : '#64748B' }}>
                                                    {photoCount}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRequestRemoveCategory(idx);
                                                    }}
                                                    disabled={categories.length <= 1}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: isSelected ? '#FECACA' : (categories.length <= 1 ? '#CBD5E1' : '#94A3B8'),
                                                        cursor: categories.length <= 1 ? 'not-allowed' : 'pointer',
                                                        fontSize: '0.9rem',
                                                        lineHeight: 1,
                                                        padding: '0 2px',
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.color = isSelected ? '#FECACA' : '#94A3B8')}
                                                    title="Delete category"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* SIDEBAR CARD 2: Add / Edit Gallery Photo Form */}
                        <div className="dayal-admin-table-card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                    {editingImageId !== null ? 'Edit Gallery' : 'Add Gallery'}
                                </h3>
                                {editingImageId !== null && (
                                    <button
                                        type="button"
                                        onClick={handleCancelPhotoEdit}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#64748B',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 1rem 0' }}>
                                {editingImageId !== null ? 'Update details of selected photo.' : 'Upload photo and assign category.'}
                            </p>

                            <form onSubmit={handlePhotoFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                {photoFormError && (
                                    <div style={{ padding: '0.5rem 0.75rem', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '0.375rem', color: '#DC2626', fontSize: '0.75rem' }}>
                                        {photoFormError}
                                    </div>
                                )}

                                {/* 1. Image Name */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                        Image Name / Title <span style={{ color: '#E11D48' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={photoForm.name}
                                        onChange={(e) => setPhotoForm({ ...photoForm, name: e.target.value })}
                                        placeholder="e.g. Family Dining"
                                        required
                                        style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem' }}
                                    />
                                </div>

                                {/* 2. Category Selection */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                        Category Selection <span style={{ color: '#E11D48' }}>*</span>
                                    </label>
                                    <select
                                        value={photoForm.category}
                                        onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.8125rem', background: '#FFFFFF' }}
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 3. Image Upload & Preview (NO URL field) */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                        Image <span style={{ color: '#E11D48' }}>*</span>
                                    </label>

                                    {/* Thumbnail Preview */}
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '135px',
                                            borderRadius: '0.375rem',
                                            border: '1px dashed #CBD5E1',
                                            backgroundColor: '#F8FAFC',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            marginBottom: '0.5rem',
                                            position: 'relative',
                                        }}
                                    >
                                        {photoForm.image ? (
                                            <img
                                                src={photoForm.image}
                                                alt={photoForm.name || 'Preview'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.75rem' }}>
                                                No image selected. Choose file below.
                                            </div>
                                        )}

                                        {isUploadingPhoto && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '0.75rem', fontWeight: 600 }}>
                                                Uploading...
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handlePhotoFileUpload(e.target.files[0])}
                                        style={{ width: '100%', fontSize: '0.75rem', color: '#64748B' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUploadingPhoto || isSavingEntity}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: '0.375rem',
                                        background: '#7A1C1C',
                                        color: '#FFFFFF',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: isUploadingPhoto || isSavingEntity ? 'not-allowed' : 'pointer',
                                        opacity: isUploadingPhoto || isSavingEntity ? 0.7 : 1,
                                        boxShadow: '0 2px 4px rgba(122, 28, 28, 0.25)',
                                        marginTop: '0.25rem',
                                    }}
                                >
                                    {isUploadingPhoto
                                        ? 'Uploading Image...'
                                        : isSavingEntity
                                        ? 'Saving...'
                                        : editingImageId !== null
                                        ? 'Update'
                                        : '+ Add Gallery'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                    <div className="dayal-admin-modal-content">
                        <div className="modal-header-row">
                            <div className="modal-icon-badge">
                                <AlertIcon width="24" height="24" />
                            </div>
                            <div className="modal-title-text">
                                <h3>
                                    {itemToDelete?.type === 'photo' ? 'Delete Gallery Photo?' : 'Delete Category?'}
                                </h3>
                                <span>Permanent Gallery Action</span>
                            </div>
                        </div>

                        <p className="modal-desc-text">
                            {itemToDelete?.type === 'photo' ? (
                                <>
                                    Are you sure you want to delete <strong>&ldquo;{itemToDelete?.item?.name}&rdquo;</strong>? This photo will be removed from the gallery. Remember to click <strong>Save</strong> to persist changes.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to delete category <strong>&ldquo;{itemToDelete?.item?.name}&rdquo;</strong>? Any photos currently assigned to this category will be reassigned to the default category.
                                </>
                            )}
                        </p>

                        <div className="modal-actions-row">
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(false)}
                                className="dayal-admin-head-btn modal-cancel-btn"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="modal-confirm-btn"
                            >
                                {itemToDelete?.type === 'photo' ? 'Delete Photo' : 'Delete Category'}
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Validation / Notice Modal */}
                <Modal show={Boolean(warningModalMessage)} onClose={() => setWarningModalMessage('')}>
                    <div className="dayal-admin-modal-content">
                        <div className="modal-header-row">
                            <div className="modal-icon-badge" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                                <AlertIcon width="24" height="24" />
                            </div>
                            <div className="modal-title-text">
                                <h3>Notice</h3>
                                <span>Validation Requirement</span>
                            </div>
                        </div>

                        <p className="modal-desc-text">
                            {warningModalMessage}
                        </p>

                        <div className="modal-actions-row">
                            <button
                                type="button"
                                onClick={() => setWarningModalMessage('')}
                                className="dayal-admin-head-btn modal-cancel-btn"
                                style={{ marginLeft: 'auto' }}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
}
