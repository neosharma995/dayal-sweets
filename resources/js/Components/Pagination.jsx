import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowRight } from 'lucide-react';

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems = null,
    itemsPerPage = 20,
    onPageChange,
    showJump = true,
    className = '',
}) {
    const [jumpPage, setJumpPage] = useState('');

    if (totalPages <= 1) {
        return null;
    }

    // Build page array with ellipsis
    const getPageNumbers = () => {
        const pages = [];
        const maxVisibleButtons = 7;

        if (totalPages <= maxVisibleButtons) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Always show page 1
        pages.push(1);

        if (currentPage > 4) {
            pages.push('ellipsis-start');
        }

        // Calculate surrounding pages
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        // Adjust if near start
        if (currentPage <= 4) {
            for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
                pages.push(i);
            }
        } else if (currentPage >= totalPages - 3) {
            for (let i = Math.max(2, totalPages - 4); i <= totalPages - 1; i++) {
                pages.push(i);
            }
        } else {
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        if (currentPage < totalPages - 3) {
            pages.push('ellipsis-end');
        }

        // Always show last page
        pages.push(totalPages);

        return pages;
    };

    const handleJumpSubmit = (e) => {
        e.preventDefault();
        const parsed = parseInt(jumpPage, 10);
        if (!isNaN(parsed) && onPageChange) {
            const clamped = Math.max(1, Math.min(totalPages, parsed));
            onPageChange(clamped);
            setJumpPage('');
        }
    };

    const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : null;
    const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : null;

    return (
        <div className={`dayal-pagination-wrapper ${className}`}>
            {/* Optional Summary Info */}
            {totalItems !== null && (
                <div className="pagination-summary">
                    Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
                    <strong>{totalItems}</strong> items
                </div>
            )}

            {/* Pagination Controls */}
            <div className="pagination-controls-row">
                <nav className="pagination-nav" aria-label="Pagination">
                    {/* First Page Button */}
                    <button
                        type="button"
                        className="pagination-btn arrow-btn"
                        onClick={() => onPageChange && onPageChange(1)}
                        disabled={currentPage <= 1}
                        title="First page"
                        aria-label="First page"
                    >
                        <ChevronsLeft size={16} />
                    </button>

                    {/* Previous Page Button */}
                    <button
                        type="button"
                        className="pagination-btn arrow-btn"
                        onClick={() => onPageChange && onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        title="Previous page"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* Page Numbers with Ellipsis */}
                    <div className="pagination-numbers">
                        {getPageNumbers().map((item, idx) => {
                            if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                                return (
                                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis" aria-hidden="true">
                                        ...
                                    </span>
                                );
                            }

                            const pageNum = item;
                            const isActive = pageNum === currentPage;

                            return (
                                <button
                                    key={`page-${pageNum}`}
                                    type="button"
                                    className={`pagination-btn number-btn ${isActive ? 'active' : ''}`}
                                    onClick={() => onPageChange && onPageChange(pageNum)}
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-label={`Page ${pageNum}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Page Button */}
                    <button
                        type="button"
                        className="pagination-btn arrow-btn"
                        onClick={() => onPageChange && onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        title="Next page"
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} />
                    </button>

                    {/* Last Page Button */}
                    <button
                        type="button"
                        className="pagination-btn arrow-btn"
                        onClick={() => onPageChange && onPageChange(totalPages)}
                        disabled={currentPage >= totalPages}
                        title="Last page"
                        aria-label="Last page"
                    >
                        <ChevronsRight size={16} />
                    </button>
                </nav>

                {/* Page Jump Input */}
                {showJump && totalPages > 2 && (
                    <form onSubmit={handleJumpSubmit} className="pagination-jump-form">
                        <label htmlFor="jump-page-input" className="jump-label">
                            Go to page:
                        </label>
                        <div className="jump-input-wrap">
                            <input
                                id="jump-page-input"
                                type="number"
                                min="1"
                                max={totalPages}
                                value={jumpPage}
                                onChange={(e) => setJumpPage(e.target.value)}
                                placeholder={String(currentPage)}
                                aria-label="Jump to page number"
                            />
                            <button
                                type="submit"
                                className="jump-btn"
                                disabled={!jumpPage.trim()}
                                title="Jump to page"
                            >
                                Go
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
