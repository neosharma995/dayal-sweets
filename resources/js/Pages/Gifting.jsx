import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import OccasionSection from '@/Components/gifting/OccasionSection';
import FeaturedCollections from '@/Components/gifting/FeaturedCollections';
import FestivalSpecials from '@/Components/gifting/FestivalSpecials';
import WhyChooseGifting from '@/Components/gifting/WhyChooseGifting';
import HowItWorksGifting from '@/Components/gifting/HowItWorksGifting';
import CustomQuoteSection from '@/Components/gifting/CustomQuoteSection';
import Testimonials from '@/Components/Testimonials';
import '../../scss/pages/_contact.scss';
import '../../scss/pages/_gifting.scss';

/**
 * Dayal Sweets - Gifting Page
 * 100% Faithful Source of Truth Duplication of D:\Dayal Sweets Old (Post 65, Post 4570)
 *
 * Page Structure (in exact visual screenshot order):
 * 1. Global Header
 * 2. Section A: Reusable Red Hero Banner (GIFTING)
 * 3. Section B: Shop by Occasion (8 Occasion Cards)
 * 4. Section C: Featured Gift Collections (Build Your Own Hamper & Corporate Gifting)
 * 5. Section D: Festival Specials (8 Festival Cards)
 * 6. Section E: Why Choose Dayal Sweets (6 Benefit Cards)
 * 7. Section F: How It Works (4 Gifting Steps with Connecting Arrows)
 * 8. Section G: Custom Gifting / Large Celebration Quote Form (3 Columns)
 * 9. Section H: Customer Testimonials (4.9 Rating Badge + Mascot + Testimonial Slider)
 * 10. Section I & J: Promotional CTA & Global Footer
 */
export default function Gifting({ auth }) {
    return (
        <div className="gifting-page-root">
            <Head>
                <title>Gifting | Dayal Sweets</title>
                <meta
                    name="description"
                    content="Share the joy of every celebration with beautifully crafted mithai boxes, luxury hampers, dry fruit collections, and personalized gifting experiences from Dayal Sweets."
                />
            </Head>

            {/* Existing Global Header */}
            <Header auth={auth} />

            <main>
                {/* Section A: Common Red Hero Banner (Reusable) */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: 'GIFTING', url: null },
                    ]}
                    title="GIFTING"
                    subtitle="Celebrate Every Occasion with Thoughtful Gifts"
                    description="Share the joy of every celebration with beautifully crafted mithai boxes, luxury hampers, dry fruit collections, and personalized gifting experiences from Dayal Sweets."
                    rightVisual="/uploads/2026/08/Gifting-Hero-Visual.png"
                />

                {/* Section B: Shop by Occasion */}
                <OccasionSection />

                {/* Section C: Featured Gift Collections */}
                <FeaturedCollections />

                {/* Section D: Festival Specials */}
                <FestivalSpecials />

                {/* Section E: Why Choose Dayal Sweets */}
                <WhyChooseGifting />

                {/* Section F: How It Works */}
                <HowItWorksGifting />

                {/* Section G: Custom Gifting / Large Celebration Quote Form */}
                <CustomQuoteSection />

                {/* Section H: Customer Testimonials */}
                <Testimonials />
            </main>

            {/* Existing Global Footer (Includes Section I & J) */}
            <Footer />
        </div>
    );
}
