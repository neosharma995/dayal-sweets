import React, { useState, useMemo, useRef } from 'react';
import { galleryCategories, galleryItems } from '@/data/galleryData';
import GalleryLightbox from './GalleryLightbox';

/**
 * GalleryGrid Component:
 * - Category filter pills
 * - 4-item first row, 5-item subsequent rows desktop layout
 * - Load More / Show Less toggle
 * - Integrated Lightbox Modal
 */
export default function GalleryGrid() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isExpanded, setIsExpanded] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const gridRef = useRef(null);

    // Filter items based on selected category
    const filteredItems = useMemo(() => {
        if (selectedCategory === 'all') {
            return galleryItems;
        }
        return galleryItems.filter(
            (item) => item.categories && item.categories.includes(selectedCategory)
        );
    }, [selectedCategory]);

    // Initial batch shows 19 items (exactly 4 in row 1 + 5 in row 2 + 5 in row 3 + 5 in row 4)
    const displayedItems = useMemo(() => {
        if (isExpanded || filteredItems.length <= 19) {
            return filteredItems;
        }
        return filteredItems.slice(0, 19);
    }, [filteredItems, isExpanded]);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        setIsExpanded(false); // Reset pagination on category change
    };

    const handleToggleExpand = () => {
        if (isExpanded) {
            setIsExpanded(false);
            if (gridRef.current) {
                gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            setIsExpanded(true);
        }
    };

    const handleOpenLightbox = (index) => {
        setLightboxIndex(index);
    };

    const handleCloseLightbox = () => {
        setLightboxIndex(null);
    };

    const handlePrevLightbox = () => {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : displayedItems.length - 1));
    };

    const handleNextLightbox = () => {
        setLightboxIndex((prev) => (prev < displayedItems.length - 1 ? prev + 1 : 0));
    };

    return (
        <section className="gallery-moments-section" ref={gridRef}>
            <div className="gallery-moments-container">
                {/* Section Title */}
                <h2 className="gallery-moments-title">
                    Explore <span className="rt-span-color">Our Moments</span>
                </h2>

                {/* Filter Tabs */}
                <div className="gallery-tabs" role="tablist" aria-label="Gallery category filters">
                    {galleryCategories.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                className={`gallery-tab-btn ${isActive ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(cat.id)}
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                </div>

                {/* Gallery Images Grid */}
                {displayedItems.length > 0 ? (
                    <div className="gallery-grid">
                        {displayedItems.map((item, idx) => (
                            <div key={item.id} className="gallery-grid-item">
                                <div
                                    className="gallery-grid-img"
                                    onClick={() => handleOpenLightbox(idx)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleOpenLightbox(idx);
                                        }
                                    }}
                                    aria-label={`View ${item.title}`}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        loading="lazy"
                                    />
                                    <div className="gallery-grid-overlay">
                                        <span className="gallery-grid-title">{item.title}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="gallery-no-items">
                        No moments found for this category.
                    </div>
                )}

                {/* Load More / Show Less Button */}
                {filteredItems.length > 19 && (
                    <div className="gallery-load-more-wrap">
                        <button
                            type="button"
                            className={isExpanded ? 'gallery-show-less-btn' : 'gallery-load-more-btn'}
                            onClick={handleToggleExpand}
                        >
                            {isExpanded ? 'SHOW LESS' : 'LOAD MORE PHOTOS'}
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <GalleryLightbox
                isOpen={lightboxIndex !== null}
                images={displayedItems}
                currentIndex={lightboxIndex !== null ? lightboxIndex : 0}
                onClose={handleCloseLightbox}
                onPrev={handlePrevLightbox}
                onNext={handleNextLightbox}
            />
        </section>
    );
}
