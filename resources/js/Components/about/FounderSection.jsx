import React from 'react';
import { founderCommitments } from '@/data/aboutData';

/**
 * Section C: Founder's Message and Commitments
 * Three columns:
 * 1. Founder's Message Copy
 * 2. Founder Photograph, Mandala Overlay & Signature
 * 3. Our Commitments (4 cards with icons)
 */
export default function FounderSection() {
    return (
        <section className="about-founder-section">
            <div className="about-founder-container">
                <div className="about-founder-box">
                {/* Column 1 – Founder's Message */}
                <div className="about-founder-col1">
                    <div className="about-founder-eyebrow" aria-hidden="true">
                        <span className="about-story-divider" />
                        <span className="about-story-eyebrow-text">Founder's Message</span>
                        <span className="about-story-divider" />
                    </div>

                    <h2 className="about-founder-title">
                        A Legacy Built on <br />
                        <span className="rt-span-color">Trust & Tradition</span>
                    </h2>

                    <p className="about-founder-desc">
                        Our story began in the 90's with a humble tea stall in a very small town located
                        in the valleys of Himachal named Una that only served tea and some snacks.
                        Mr. Hardayal Chand Jatle, a laborious man and owner of that tea stall, worked
                        tirelessly to earn his bread and butter, and serve the residents of Una.
                    </p>

                    <p className="about-founder-desc">
                        After earning great admiration from the people of Una, he launched Dayal Sweets
                        in 1962 which has become the first choice of mithai lovers in Himachal today.
                    </p>
                </div>

                {/* Column 2 – Founder Photograph */}
                <div className="about-founder-col2">
                    <div className="about-founder-photo-wrap">
                        {/* Decorative background mandala */}
                        <img
                            src="/uploads/2026/07/decorative-golden-mandala-white-background-2.webp"
                            alt=""
                            className="about-founder-mandala"
                            aria-hidden="true"
                        />
                        {/* Original founder photograph */}
                        <img
                            src="/uploads/2026/07/Container-10.webp"
                            alt="Sh. Hardayal Chand Jatle"
                            className="about-founder-img"
                        />
                    </div>

                    <h3 className="about-founder-name">
                        Sh. Hardayal Chand Jatle
                    </h3>

                    <div className="about-founder-designation-wrap">
                        <span className="about-founder-designation-divider" aria-hidden="true" />
                        <p className="about-founder-designation">
                            FOUNDER & CHAIRMAN, DAYAL SWEETS
                        </p>
                    </div>
                </div>

                {/* Column 3 – Our Commitments */}
                <div className="about-founder-col3">
                    <h3 className="about-commitments-heading">
                        OUR COMMITMENTS
                    </h3>

                    <div className="about-commitments-grid">
                        {founderCommitments.map((card) => (
                            <div key={card.id} className="about-commitment-card">
                                <img
                                    src={card.icon}
                                    alt=""
                                    className="about-commitment-icon"
                                    aria-hidden="true"
                                />
                                <div>
                                    <h4 className="about-commitment-title">{card.title}</h4>
                                    <p className="about-commitment-desc">{card.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Stamp Badge */}
                    <div className="about-commitments-stamp">
                        <img
                            src="/uploads/2026/07/Container-12.png"
                            alt=""
                            className="about-commitments-stamp-icon"
                            aria-hidden="true"
                        />
                        <p className="about-commitments-stamp-text">
                            Crafting Joy Since 1962 · una
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
}
