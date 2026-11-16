import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import FranchiseBenefits from '@/Components/franchise/FranchiseBenefits';
import FranchiseEnquiry from '@/Components/franchise/FranchiseEnquiry';
import FranchiseOutlets from '@/Components/franchise/FranchiseOutlets';
import FranchiseTimeline from '@/Components/franchise/FranchiseTimeline';
import FranchiseTestimonials from '@/Components/franchise/FranchiseTestimonials';
import '../../scss/pages/_contact.scss';
import '../../scss/pages/_franchise.scss';

/**
 * Dayal Sweets - Franchise Page
 * Exact 1:1 Static Duplication from D:\Dayal Sweets Old (Post 4009)
 *
 * Page Structure (in exact visual screenshot order):
 * 1. Global Header
 * 2. Hero Banner: Common Red Hero Banner (FRANCHISE)
 * 3. Section A: Why Partner With Dayal Sweets? (6 Benefit Cards)
 * 4. Section B: Become Our Franchise Partner (7-Field Enquiry Form + Building Photo)
 * 5. Section C: Premium Outlets (5 Outlets with Mountain Backdrop)
 * 6. Section D: How It Works? (6-Step Milestone Timeline)
 * 7. Section E: Customer Testimonials (4.9 Rating Badge + Mascot + Testimonial Slider)
 * 8. Promotional CTA & Global Footer
 */
export default function Franchise({ auth }) {
    return (
        <div className="franchise-page-root">
            <Head>
                <title>Franchise | Dayal Sweets</title>
                <meta
                    name="description"
                    content="Partner with Dayal Sweets and bring our rich culinary heritage and premium sweets to your city. High returns, end-to-end support, and a trusted legacy."
                />
            </Head>

            {/* Global Header */}
            <Header auth={auth} />

            <main>
                {/* Hero Banner */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: 'FRANCHISE', url: null },
                    ]}
                    title="FRANCHISE"
                    subtitle="Loved By Thousands, Trusted Every Day"
                    description="From our delicious sweets to our warm hospitality, here's what our happy customers have to say about Dayal Sweets."
                />

                {/* Section A: Why Partner With Dayal Sweets? */}
                <FranchiseBenefits />

                {/* Section B: Become Our Franchise Partner (Form + Building) */}
                <FranchiseEnquiry />

                {/* Section C: Premium Outlets */}
                <FranchiseOutlets />

                {/* Section D: How It Works? */}
                <FranchiseTimeline />

                {/* Section E: Customer Testimonials */}
                <FranchiseTestimonials />
            </main>

            {/* Promotional CTA & Global Footer */}
            <Footer />
        </div>
    );
}
