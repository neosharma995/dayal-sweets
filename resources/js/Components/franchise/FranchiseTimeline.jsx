import React from 'react';
import { franchiseTimeline } from '@/data/franchiseData';

/**
 * Section D: How It Works?
 * 6-step horizontal timeline with golden connecting line, diamond separators,
 * and decorative floral elements matching the reference design.
 */
export default function FranchiseTimeline() {
    return (
        <section className="franchise-timeline-section" aria-label="How It Works">
            <div className="franchise-timeline-container">
                <h2 className="franchise-timeline-heading">
                    How It <span className="rt-span-color">Works?</span>
                </h2>

                <div className="franchise-timeline-wrapper">
                    {/* Connecting line with 6 milestone steps and diamond separators */}
                    <div className="franchise-timeline-line">
                        {franchiseTimeline.map((item) => (
                            <div key={item.step} className="franchise-timeline-item">
                                {/* Circular Maroon Icon */}
                                <div className="franchise-timeline-icon-wrap">
                                    <img
                                        src={item.icon}
                                        alt={item.title}
                                        className="franchise-timeline-icon"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Step Content: 01, Title, Description */}
                                <div className="franchise-timeline-content">
                                    <span className="franchise-timeline-step-num">{item.step}</span>
                                    <h3 className="franchise-timeline-step-title">{item.title}</h3>
                                    <p className="franchise-timeline-step-desc">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
