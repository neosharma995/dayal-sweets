import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import DiningIntroduction from '@/Components/dining/DiningIntroduction';
import DiningQROrdering from '@/Components/dining/DiningQROrdering';
import DiningMenu from '@/Components/dining/DiningMenu';
import DiningReservation from '@/Components/dining/DiningReservation';
import '../../scss/pages/_contact.scss';
import '../../scss/pages/_dining.scss';

/**
 * Dayal Sweets - Dining Page
 * Exact 1:1 Static Duplication from D:\Dayal Sweets Old (Post 3125 & Post 64)
 * Matches the exact reference screenshot:
 *
 * Page Structure (in exact visual screenshot order):
 * 1. Global Header
 * 2. Section A: Reusable Red Hero Banner (DINNING)
 * 3. Section B: Welcome to Dayal Sweets Dining (Large Interior Photo + 4 Feature Cards)
 * 4. Section C: QR Table Ordering (Phone Stand + Scan. Order. Enjoy + 5-Step Process)
 * 5. Section D: Explore Our Menu (7 Categories in 1 Row + EXPLORE FULL MENU CTA)
 * 6. Section E: Book Your Table (Chef's Special Card + Table Reservation Form)
 * 7. Section F & G: Promotional CTA & Global Footer
 */
export default function Dining({ auth }) {
    return (
        <div className="dining-page-root">
            <Head>
                <title>Dining | Dayal Sweets</title>
                <meta
                    name="description"
                    content="Enjoy authentic Indian, Himachali, Chinese, South Indian, and Fast Food prepared fresh every day by our experienced chefs at Dayal Sweets."
                />
            </Head>

            {/* Global Header */}
            <Header auth={auth} />

            <main>
                {/* Section A: Common Red Hero Banner (Reusable) */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: 'DINNING', url: null },
                    ]}
                    title="DINNING"
                    subtitle="Good Food. Great Moments."
                    description="Enjoy authentic Indian, Himachali, Chinese, South Indian, and Fast Food prepared fresh every day by our experienced chefs."
                />

                {/* Section B: Welcome to Dayal Sweets Dining */}
                <DiningIntroduction />

                {/* Section C: QR Table Ordering */}
                <DiningQROrdering />

                {/* Section D: Explore Our Menu */}
                <DiningMenu />

                {/* Section E: Book Your Table / Reservation */}
                <DiningReservation />
            </main>

            {/* Section F & G: Promotional CTA & Global Footer */}
            <Footer />
        </div>
    );
}