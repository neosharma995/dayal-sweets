import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import ContactHero from '@/Components/contact/ContactHero';
import '../../scss/pages/_contact.scss';
import '../../scss/pages/_privacy-policy.scss';

/**
 * Dayal Sweets - Privacy Policy Page
 * 100% Faithful Source of Truth Duplication of D:\Dayal Sweets Old (Post 3)
 *
 * Page Structure:
 * 1. Global Header
 * 2. Reusable Common Red Hero Banner (PRIVACY POLICY)
 * 3. Privacy Policy Content Area (9 Sections in 90% Container Card)
 * 4. Promotional CTA & Global Footer
 */
export default function PrivacyPolicy({ auth }) {
    return (
        <div className="privacy-policy-page-root">
            <Head>
                <title>Privacy Policy | Dayal Sweets</title>
                <meta
                    name="description"
                    content="Learn how Dayal Sweets collects, uses and protects your personal information when you visit our website or use our services."
                />
            </Head>

            {/* Existing Global Header */}
            <Header auth={auth} />

            <main className="privacy-policy-page-main">
                {/* Common Red Hero Banner (Reusable Component) */}
                <ContactHero
                    breadcrumbs={[
                        { label: 'HOME', url: '/' },
                        { label: 'PRIVACY POLICY', url: null },
                    ]}
                    title="PRIVACY POLICY"
                    subtitle="Your Privacy Matters to Us"
                    description="Learn how Dayal Sweets collects, uses and protects your personal information when you visit our website or use our services."
                />

                {/* Privacy Policy Content Area */}
                <section className="privacy-policy-content-section" aria-label="Privacy Policy Details">
                    <div className="privacy-policy-page-container">
                        <div className="privacy-policy-content-card">
                            {/* Section 1: Who we are */}
                            <div className="privacy-policy-section-block">
                                <h2 className="privacy-policy-section-title">Who we are</h2>
                                <p className="privacy-policy-content-text">
                                    Our website address is:{' '}
                                    <a
                                        href="https://red-newt-668101.hostingersite.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="privacy-policy-content-link"
                                    >
                                        https://red-newt-668101.hostingersite.com
                                    </a>
                                    .
                                </p>
                            </div>

                            {/* Section 2: Comments */}
                            <div className="privacy-policy-section-block">
                                <h2 className="privacy-policy-section-title">Comments</h2>
                                <p className="privacy-policy-content-text">
                                    When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
                                </p>
                                <p className="privacy-policy-content-text">
                                    An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here:{' '}
                                    <a
                                        href="https://automattic.com/privacy/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="privacy-policy-content-link"
                                    >
                                        https://automattic.com/privacy/
                                    </a>
                                    . After approval of your comment, your profile picture is visible to the public in the context of your comment.
                                </p>
                            </div>

                            {/* Section 3: Media */}
                            <div className="privacy-policy-section-block">
                                <h2 className="privacy-policy-section-title">Media</h2>
                                <p className="privacy-policy-content-text">
                                    If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
                                </p>
                            </div>

                            {/* Section 4: Cookies */}
                            <div className="privacy-policy-section-block">
                                <h2 className="privacy-policy-section-title">Cookies</h2>
                                <p className="privacy-policy-content-text">
                                    If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
                                </p>
                                <p className="privacy-policy-content-text">
                                    If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
                                </p>
                                <p className="privacy-policy-content-text">
                                    When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
                                </p>
                                <p className="privacy-policy-content-text">
                                    If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
                                </p>
                            </div>

                            {/* Section 5: Embedded content from other websites */}
                            <div className="privacy-policy-section-block">
                                <h2 className="privacy-policy-section-title">Embedded content from other websites</h2>
                                <p className="privacy-policy-content-text">
                                    Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
                                </p>
                                <p className="privacy-policy-content-text">
                                    These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
                                </p>
                            </div>

                            {/* Section 6: Who we share your data with */}
                            <div className="privacy-policy-section-block">
                                <h2 className="privacy-policy-section-title">Who we share your data with</h2>
                                <p className="privacy-policy-content-text">
                                    If you request a password reset, your IP address will be included in the reset email.
                                </p>
                            </div>

                            {/* Section 7: How long we retain your data */}
                            <div className="privacy-policy-section-block">
                                <h2 className="privacy-policy-section-title">How long we retain your data</h2>
                                <p className="privacy-policy-content-text">
                                    If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
                                </p>
                                <p className="privacy-policy-content-text">
                                    For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
                                </p>
                            </div>

                            {/* Section 8: What rights you have over your data */}
                            <div className="privacy-policy-section-block">
                                <h2 className="privacy-policy-section-title">What rights you have over your data</h2>
                                <p className="privacy-policy-content-text">
                                    If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
                                </p>
                            </div>

                            {/* Section 9: Where your data is sent */}
                            <div className="privacy-policy-section-block">
                                <h2 className="privacy-policy-section-title">Where your data is sent</h2>
                                <p className="privacy-policy-content-text">
                                    Visitor comments may be checked through an automated spam detection service.
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
