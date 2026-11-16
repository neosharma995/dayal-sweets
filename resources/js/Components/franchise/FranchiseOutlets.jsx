import React from 'react';
import Outlets from '@/Components/Outlets';

/**
 * Section C: Premium Outlets
 * Reuses the standard Outlets component with 5 outlets:
 * Amb, Hamirpur, Una, Una (Bus Stand), Palampur (Opening Soon)
 */
export default function FranchiseOutlets() {
    return (
        <div className="franchise-outlets-wrapper">
            <Outlets
                eyebrow="— VIEW OUR STORES —"
                title="Premium"
                highlightTitle="Outlets"
                subtitle="Visit our premium outlets across Himachal Pradesh and experience the authentic taste of tradition, craftsmanship, and celebration."
            />
        </div>
    );
}
