import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import AboutStory from '@/Components/about/AboutStory';
import FounderSection from '@/Components/about/FounderSection';
import AboutTimeline from '@/Components/about/AboutTimeline';
import SignatureCollection from '@/Components/about/SignatureCollection';
import AboutStatistics from '@/Components/about/AboutStatistics';
import '../../scss/pages/_contact.scss';
import '../../scss/pages/_about-us.scss';

/**
 * Dayal Sweets - About Us Page
 * 100% Faithful Source of Truth Duplication of D:\dayal-sweets-old (Post 61)
 *
 * Page Structure:
 * 1. Global Header
 * 2. Section A: Reusable Red Hero Banner (ABOUT DAYAL)
 * 3. Section B: About Dayal – Our Story (Video Showcase & Copy)
 * 4. Section C: Founder's Message and Commitments (3 Columns with Founder photo & cards)
 * 5. Section D: Our Journey – Timeline (6 Milestones with horizontal line & flowers)
 * 6. Section E: The Signature Collection (Showcase Video & 5 Product Cards)
 * 7. Section F: Numbers That Matters (5 Burgundy Statistics)
 * 8. Section G & H: Promotional CTA & Global Footer
 */
export default function About({ auth }) {
    return (
        <div className="about-page-root">
            <Head>
                <title>About Us | Dayal Sweets</title>
                <meta
                    name="description"
                    content="Over six decades of crafting authentic Indian sweets with premium ingredients, age-old recipes and a promise of purity. Crafting sweet traditions since 1962."
                />
            </Head>

            {/* Existing Header Component */}
            <Header auth={auth} />

            <main>
                {/* Section A: Common Red Hero Banner (Reusable) */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: 'ABOUT US', url: null },
                    ]}
                    title="ABOUT DAYAL"
                    subtitle="Crafting Sweet Traditions Since 1962"
                    description="Over six decades of crafting authentic Indian sweets with premium ingredients, age-old recipes and a promise of purity."
                />

                {/* Section B: About Dayal – Our Story */}
                <AboutStory />

                {/* Section C: Founder's Message and Commitments */}
                <FounderSection />

                {/* Section D: Our Journey – Timeline */}
                <AboutTimeline />

                {/* Section E: The Signature Collection */}
                <SignatureCollection />

                {/* Section F: Numbers That Matters */}
                <AboutStatistics />
            </main>

            {/* Section G & H: Promotional CTA & Global Footer */}
            <Footer />
        </div>
    );
}
