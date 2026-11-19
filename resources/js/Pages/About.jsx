import React from 'react';
import SeoHead from '@/Components/SeoHead';
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

export default function About({ auth, page }) {
    const sections = page?.sections || {};
    const topBarHeading = sections.top_bar_Heading ?? 'ABOUT DAYAL';
    const topBarSubHeading = sections.top_bar_sub_heading ?? 'Crafting Sweet Traditions Since 1962';
    const topBarDescription = sections.top_bar_description ?? 'Over six decades of crafting authentic Indian sweets with premium ingredients, age-old recipes and a promise of purity.';

    return (
        <div className="about-page-root">
            <SeoHead
                page={page}
                fallbackTitle="About Us | Dayal Sweets"
                fallbackDescription={topBarDescription}
            />

            {/* Existing Header Component */}
            <Header auth={auth} />

            <main>
                {/* Section A: Common Red Hero Banner (Reusable) */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: topBarHeading, url: null },
                    ]}
                    title={topBarHeading}
                    subtitle={topBarSubHeading}
                    description={topBarDescription}
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
