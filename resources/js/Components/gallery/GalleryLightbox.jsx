import React, { useEffect, useCallback } from 'react';

/**
 * Gallery Lightbox Modal
 * Displays enlarged gallery image with navigation and keyboard support.
 */
export default function GalleryLightbox({
    isOpen,
    images = [],
    currentIndex = 0,
    onClose,
    onPrev,
    onNext,
}) {
    const handleKeyDown = useCallback(
        (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                onPrev();
            } else if (e.key === 'ArrowRight') {
                onNext();
            }
        },
        [isOpen, onClose, onPrev, onNext]
    );

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('gallery-modal-open');
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.classList.remove('gallery-modal-open');
        }

        return () => {
            document.body.classList.remove('gallery-modal-open');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen || images.length === 0) return null;

    const currentItem = images[currentIndex];
    if (!currentItem) return null;

    return (
        <div className={`gallery-lightbox-modal is-open`} role="dialog" aria-modal="true" aria-label="Image preview">
            <div className="gallery-lightbox-backdrop" onClick={onClose} />

            <div className="gallery-lightbox-content">
                {/* Close Button */}
                <button
                    type="button"
                    className="gallery-lightbox-close"
                    onClick={onClose}
                    aria-label="Close preview"
                >
                    &times;
                </button>

                {/* Previous Button */}
                {images.length > 1 && (
                    <button
                        type="button"
                        className="gallery-lightbox-nav prev"
                        onClick={onPrev}
                        aria-label="Previous image"
                    >
                        &#8249;
                    </button>
                )}

                {/* Main Preview Image */}
                <img
                    src={currentItem.image}
                    alt={currentItem.title || 'Gallery image'}
                    className="gallery-lightbox-img"
                />

                {/* Caption Title */}
                {currentItem.title && (
                    <div className="gallery-lightbox-caption">
                        {currentItem.title}
                    </div>
                )}

                {/* Next Button */}
                {images.length > 1 && (
                    <button
                        type="button"
                        className="gallery-lightbox-nav next"
                        onClick={onNext}
                        aria-label="Next image"
                    >
                        &#8250;
                    </button>
                )}
            </div>
        </div>
    );
}
