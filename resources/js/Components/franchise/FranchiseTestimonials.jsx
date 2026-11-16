import React from 'react';
import Testimonials from '@/Components/Testimonials';

/**
 * Section E: Customer Testimonials ("Loved By Thousands")
 * Reuses the standard Testimonials component
 */
export default function FranchiseTestimonials() {
    return (
        <div className="franchise-testimonials-wrapper">
            <Testimonials
                eyebrow="WHAT THE WAY"
                title="Loved By"
                highlightTitle="Thousands"
                rating="4.9"
                ratingCountText="Based on 3,200+ reviews"
                mascot="/uploads/2026/07/image-149-e1789633262291.png"
            />
        </div>
    );
}
