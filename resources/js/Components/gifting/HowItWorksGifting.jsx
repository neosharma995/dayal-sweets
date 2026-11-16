import React from 'react';
import { howItWorksSteps } from '@/data/giftingData';

/**
 * Section F: How It Works
 * 4 Gifting Steps connected by dashed follow arrows
 * Sourced directly from Elementor Post 65
 */
export default function HowItWorksGifting() {
    return (
        <section className="gifting-steps-section">
            <div className="gifting-steps-container">
                {/* Eyebrow: — HOW IT WORKS — */}
                <div className="gifting-eyebrow-wrapper" aria-hidden="true">
                    <span className="gifting-eyebrow-divider" />
                    <span className="gifting-eyebrow-text">HOW IT WORKS</span>
                    <span className="gifting-eyebrow-divider" />
                </div>

                {/* Section Heading */}
                <h2 className="gifting-section-heading">
                    Simple Gifting in Four <span className="rt-span-color">Easy Steps</span>
                </h2>

                {/* Steps Row with Interspersed Arrows */}
                <div className="gifting-steps-row">
                    {howItWorksSteps.map((step, idx) => (
                        <React.Fragment key={step.id}>
                            <div className="gifting-step-card">
                                <div className="gifting-step-icon-wrap">
                                    <img
                                        src={step.icon}
                                        alt=""
                                        className="gifting-step-icon"
                                        aria-hidden="true"
                                    />
                                </div>
                                <h3 className="gifting-step-title">{step.title}</h3>
                            </div>

                            {/* Arrow between steps (not after the last step) */}
                            {idx < howItWorksSteps.length - 1 && (
                                <div className="gifting-step-arrow-wrap" aria-hidden="true">
                                    <img
                                        src="/uploads/2026/08/Follow-Line-2.png"
                                        alt=""
                                        className="gifting-step-arrow"
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
