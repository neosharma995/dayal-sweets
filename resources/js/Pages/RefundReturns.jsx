import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import '../../scss/pages/_contact.scss';
import '../../scss/pages/_refund-returns.scss';

/**
 * Dayal Sweets - Refund and Returns Policy Page
 * 100% Faithful Source of Truth Duplication of D:\Dayal Sweets Old (Post 11)
 *
 * Page Structure:
 * 1. Global Header
 * 2. Reusable Common Red Hero Banner (REFUND & RETURNS)
 * 3. Policy Content Area (Overview, Refunds, Exchanges, Gifts, Shipping, Need Help)
 * 4. Promotional CTA & Global Footer
 */
export default function RefundReturns({ auth }) {
    return (
        <div className="refund-returns-page-root">
            <Head>
                <title>Refund and Returns Policy | Dayal Sweets</title>
                <meta
                    name="description"
                    content="Learn about our refund, cancellation and returns process for orders placed with Dayal Sweets."
                />
            </Head>

            {/* Existing Global Header */}
            <Header auth={auth} />

            <main className="refund-returns-page-main">
                {/* Common Red Hero Banner (Reusable Component) */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: 'REFUND AND RETURNS POLICY', url: null },
                    ]}
                    title="REFUND & RETURNS"
                    subtitle="Your Satisfaction Matters to Us"
                    description="Learn about our refund, cancellation and returns process for orders placed with Dayal Sweets."
                />

                {/* Policy Content Area */}
                <section className="refund-returns-content-section" aria-label="Refund and Returns Policy Details">
                    <div className="refund-returns-page-container">
                        <div className="refund-returns-content-card">
                            {/* Section 1: Overview */}
                            <div className="refund-returns-section-block">
                                <h2 className="refund-returns-section-title">Overview</h2>
                                <p className="refund-returns-content-text">
                                    Our refund and returns policy lasts 30 days. If 30 days have passed since your purchase, we can’t offer you a full refund or exchange.
                                </p>
                                <p className="refund-returns-content-text">
                                    To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
                                </p>
                                <p className="refund-returns-content-text">
                                    Several types of goods are exempt from being returned. Perishable goods such as food, flowers, newspapers or magazines cannot be returned. We also do not accept products that are intimate or sanitary goods, hazardous materials, or flammable liquids or gases.
                                </p>
                                <p className="refund-returns-content-text">
                                    Additional non-returnable items:
                                </p>
                                <ul className="refund-returns-content-list">
                                    <li className="refund-returns-content-list-item">Gift cards</li>
                                    <li className="refund-returns-content-list-item">Downloadable software products</li>
                                    <li className="refund-returns-content-list-item">Some health and personal care items</li>
                                </ul>
                                <p className="refund-returns-content-text">
                                    To complete your return, we require a receipt or proof of purchase.
                                </p>
                                <p className="refund-returns-content-text">
                                    Please do not send your purchase back to the manufacturer.
                                </p>
                                <p className="refund-returns-content-text">
                                    There are certain situations where only partial refunds are granted:
                                </p>
                                <ul className="refund-returns-content-list">
                                    <li className="refund-returns-content-list-item">Book with obvious signs of use</li>
                                    <li className="refund-returns-content-list-item">CD, DVD, VHS tape, software, video game, cassette tape, or vinyl record that has been opened.</li>
                                    <li className="refund-returns-content-list-item">Any item not in its original condition, is damaged or missing parts for reasons not due to our error.</li>
                                    <li className="refund-returns-content-list-item">Any item that is returned more than 30 days after delivery</li>
                                </ul>
                            </div>

                            {/* Section 2: Refunds */}
                            <div className="refund-returns-section-block">
                                <h2 className="refund-returns-section-title">Refunds</h2>
                                <p className="refund-returns-content-text">
                                    Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                                </p>
                                <p className="refund-returns-content-text">
                                    If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
                                </p>

                                {/* Subsection: Late or missing refunds */}
                                <h3 className="refund-returns-section-subtitle">Late or missing refunds</h3>
                                <p className="refund-returns-content-text">
                                    If you haven’t received a refund yet, first check your bank account again.
                                </p>
                                <p className="refund-returns-content-text">
                                    Then contact your credit card company, it may take some time before your refund is officially posted.
                                </p>
                                <p className="refund-returns-content-text">
                                    Next contact your bank. There is often some processing time before a refund is posted.
                                </p>
                                <p className="refund-returns-content-text">
                                    If you’ve done all of this and you still have not received your refund yet, please contact us at <a href="mailto:info@dayalsweets.com" className="refund-returns-content-link">{'{email address}'}</a>.
                                </p>

                                {/* Subsection: Sale items */}
                                <h3 className="refund-returns-section-subtitle">Sale items</h3>
                                <p className="refund-returns-content-text">
                                    Only regular priced items may be refunded. Sale items cannot be refunded.
                                </p>
                            </div>

                            {/* Section 3: Exchanges */}
                            <div className="refund-returns-section-block">
                                <h2 className="refund-returns-section-title">Exchanges</h2>
                                <p className="refund-returns-content-text">
                                    We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at <a href="mailto:info@dayalsweets.com" className="refund-returns-content-link">{'{email address}'}</a> and send your item to: {'{physical address}'}.
                                </p>
                            </div>

                            {/* Section 4: Gifts */}
                            <div className="refund-returns-section-block">
                                <h2 className="refund-returns-section-title">Gifts</h2>
                                <p className="refund-returns-content-text">
                                    If the item was marked as a gift when purchased and shipped directly to you, you’ll receive a gift credit for the value of your return. Once the returned item is received, a gift certificate will be mailed to you.
                                </p>
                                <p className="refund-returns-content-text">
                                    If the item wasn’t marked as a gift when purchased, or the gift giver had the order shipped to themselves to give to you later, we will send a refund to the gift giver and they will find out about your return.
                                </p>
                            </div>

                            {/* Section 5: Shipping returns */}
                            <div className="refund-returns-section-block">
                                <h2 className="refund-returns-section-title">Shipping returns</h2>
                                <p className="refund-returns-content-text">
                                    To return your product, you should mail your product to: {'{physical address}'}.
                                </p>
                                <p className="refund-returns-content-text">
                                    You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                                </p>
                                <p className="refund-returns-content-text">
                                    Depending on where you live, the time it may take for your exchanged product to reach you may vary.
                                </p>
                                <p className="refund-returns-content-text">
                                    If you are returning more expensive items, you may consider using a trackable shipping service or purchasing shipping insurance. We don’t guarantee that we will receive your returned item.
                                </p>
                            </div>

                            {/* Section 6: Need help? */}
                            <div className="refund-returns-section-block">
                                <h2 className="refund-returns-section-title">Need help?</h2>
                                <p className="refund-returns-content-text">
                                    Contact us at <a href="mailto:info@dayalsweets.com" className="refund-returns-content-link">{'{email}'}</a> for questions related to refunds and returns.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Existing Global Footer (Includes Promotional CTA & Footer Links) */}
            <Footer />
        </div>
    );
}
