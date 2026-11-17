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
export default function Gallery({ auth, page }) {
    const sections = page?.sections || {};

    const topBarHeading = sections.top_bar_Heading ?? 'OUR GALLERY';
    const topBarSubHeading = sections.top_bar_sub_heading ?? 'Every Picture Tells a Sweet Story';
    const topBarDescription = sections.top_bar_description ?? 'Enjoy authentic Indian, Himachali, Chinese, South Indian, and Fast Food prepared fresh every day by our experienced chefs.';

    const categories = sections.categories;
    const images = sections.images;

    return (
        <div className="gallery-page-root">
            <Head title={`${topBarHeading || 'Our Gallery'} | Dayal Sweets`} />

            {/* Existing Header Component */}
            <Header auth={auth} />

            <main>
                {/* Section A: Reusable Red Hero Banner */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: topBarHeading, url: null },
                    ]}
                    title={topBarHeading}
                    subtitle={topBarSubHeading}
                    description={topBarDescription}
                />

                {/* Section B: Explore Our Moments (Photo Gallery Grid & Lightbox) */}
                <GalleryGrid categories={categories} images={images} />

                {/* Section C: Signature Food Collection */}
                <FoodCollection />
            </main>

            {/* Section D & E: Promotional CTA & Global Footer */}
            <Footer />
        </div>
    );
}
