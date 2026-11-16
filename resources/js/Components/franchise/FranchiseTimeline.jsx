import React from 'react';
import { franchiseTimeline } from '@/data/franchiseData';

/**
 * Section D: How It Works?
 * 6-step horizontal timeline with connecting line & milestone nodes
 */
export default function FranchiseTimeline() {
    return (
        <section className="franchise-timeline-section" aria-label="How It Works">
            <div className="franchise-timeline-container">
                <h2 className="franchise-timeline-heading">
                    How It <span className="rt-span-color">Works?</span>
                </h2>

                <div className="franchise-timeline-wrapper">
                    {/* Continuous horizontal connection line */}
                    <div className="franchise-timeline-track-line" aria-hidden="true" />

                    <div className="franchise-timeline-grid">
                        {franchiseTimeline.map((item, index) => (
                            <div key={item.step} className="franchise-timeline-item">
                                {/* Circular Icon Wrap */}
                                <div className="franchise-timeline-icon-wrap">
                                    <img
                                        src={item.icon}
                                        alt={item.title}
                                        className="franchise-timeline-icon"
                                        loading="lazy"
                                    />
                                    {/* Connector diamond between items (desktop only, not after last) */}
                                    {index < franchiseTimeline.length - 1 && (
                                        <span className="franchise-timeline-diamond" aria-hidden="true" />
                                    )}
                                </div>

                                {/* Step Number & Title */}
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
