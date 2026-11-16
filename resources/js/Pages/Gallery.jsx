import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import GalleryGrid from '@/Components/gallery/GalleryGrid';
import FoodCollection from '@/Components/gallery/FoodCollection';
import '../../scss/pages/_contact.scss';
import '../../scss/pages/_gallery.scss';

/**
 * Dayal Sweets - Gallery Page
 * 100% Faithful Source of Truth Duplication of D:\dayal-sweets-old (Post 66)
 *
 * Page Structure:
 * 1. Global Header
 * 2. Section A: Reusable Red Hero Banner
 * 3. Section B: Explore Our Moments (Photo Gallery with Filter Tabs, 4/5 Grid, Load More & Lightbox)
 * 4. Section C: Signature Food Collection (6 Cards & View Full Menu Button)
 * 5. Section D & E: Promotional CTA & Global Footer
 */
export default function Gallery({ auth }) {
    return (
        <div className="gallery-page-root">
            <Head>
                <title>Our Gallery | Dayal Sweets</title>
                <meta
                    name="description"
                    content="Explore Dayal Sweets moments - Authentic Indian, Himachali, Chinese, South Indian, and fresh sweets crafted with love."
                />
            </Head>

            {/* Existing Header Component */}
            <Header auth={auth} />

            <main>
                {/* Section A: Reusable Red Hero Banner */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: 'GALLERY', url: null },
                    ]}
                    title="OUR GALLERY"
                    subtitle="Every Picture Tells a Sweet Story"
                    description="Enjoy authentic Indian, Himachali, Chinese, South Indian, and Fast Food prepared fresh every day by our experienced chefs."
                />

                {/* Section B: Explore Our Moments (Photo Gallery Grid & Lightbox) */}
                <GalleryGrid />

                {/* Section C: Signature Food Collection */}
                <FoodCollection />
            </main>

            {/* Section D & E: Promotional CTA & Global Footer */}
            <Footer />
        </div>
    );
}
