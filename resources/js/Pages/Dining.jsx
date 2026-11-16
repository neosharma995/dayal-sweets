import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import DiningSpaces from '@/Components/dining/DiningSpaces';
import DiningMenuHighlights from '@/Components/dining/DiningMenuHighlights';
import DiningPromise from '@/Components/dining/DiningPromise';
import TableReservationForm from '@/Components/dining/TableReservationForm';
import DiningOutlets from '@/Components/dining/DiningOutlets';
import '../../scss/pages/_contact.scss';
import '../../scss/pages/_dining.scss';

/**
 * Dayal Sweets - Dining Page
 * Pure SCSS Architecture with 1720px standard container
 *
 * Page Structure:
 * 1. Global Header
 * 2. Section A: Reusable Red Hero Banner (DINING EXPERIENCE)
 * 3. Section B: Curated Dining Spaces (Family, Corporate, Private, Outdoor)
 * 4. Section C: Chef's Curated Menu Highlights (Interactive category filter)
 * 5. Section D: Our Culinary Promise (Pure Desi Ghee, Live Kitchen, Hygiene, 1962 Heritage)
 * 6. Section E: Table Reservation & Event Booking Form
 * 7. Section F: Our Dining Destinations (Amb, Hamirpur, Nangal Road Una Outlets)
 * 8. Global Footer & Promotional CTA
 */
export default function Dining({ auth }) {
    return (
        <div className="dayal-site dayal-dining-page-root">
            <Head>
                <title>Dining Experience | Dayal Sweets - Pure Traditional Taste</title>
                <meta
                    name="description"
                    content="Experience royal Himachali hospitality and authentic vegetarian delicacies at Dayal Sweets. Book family tables, private celebration suites, and executive corporate dining."
                />
            </Head>

            {/* Global Header */}
            <Header auth={auth} />

            <main className="dayal-dining-main">
                {/* Section A: Reusable Royal Maroon Hero Banner */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: 'DINING', url: null },
                    ]}
                    title="DINING EXPERIENCE"
                    subtitle="Savor Authentic Flavors in Royal Ambience"
                    description="From slow-simmered Himachali Madra and North Indian gravies to sizzling Indo-Chinese and artisanal desserts, experience Himachal's most loved dining destination."
                />

                {/* Section B: Curated Dining Spaces */}
                <DiningSpaces />

                {/* Section C: Chef's Curated Menu Highlights */}
                <DiningMenuHighlights />

                {/* Section D: Our Culinary Promise */}
                <DiningPromise />

                {/* Section E: Table Reservation & Event Booking Form */}
                <TableReservationForm />

                {/* Section F: Our Dining Outlets & Destinations */}
                <DiningOutlets />
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
}
