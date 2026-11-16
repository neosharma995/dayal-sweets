import React from 'react';
import { timelineMilestones } from '@/data/aboutData';

/**
 * Section D: Our Journey – Timeline
 * Eyebrow, Heading, Horizontal Connecting Line, Flowers, Diamond Connectors, 6 Milestones
 */
export default function AboutTimeline() {
    return (
        <section className="about-timeline-section">
            <div className="about-timeline-container">
                {/* Eyebrow */}
                <div className="about-timeline-eyebrow" aria-hidden="true">
                    <span className="about-story-divider" />
                    <span className="about-story-eyebrow-text">Our Journey</span>
                    <span className="about-story-divider" />
                </div>

                {/* Section Title */}
                <h2 className="about-timeline-title">
                    From Small Shop to <br />
                    <span className="rt-span-color">Generation Of Celebrations</span>
                </h2>

                {/* Timeline Outer Wrapper with Flower Graphics */}
                <div className="about-timeline-wrapper">
                    <div className="about-timeline-line">
                        {timelineMilestones.map((milestone, idx) => (
                            <div key={milestone.year} className="about-timeline-item">
                                {/* Circular Icon */}
                                <div className="about-timeline-icon-wrap">
                                    <img
                                        src={milestone.icon}
                                        alt={milestone.year}
                                        className="about-timeline-icon"
                                    />
                                </div>

                                {/* Milestone Year */}
                                <div className="about-timeline-year">
                                    {milestone.year}
                                </div>

                                {/* Milestone Title */}
                                <h3 className="about-timeline-milestone-title">
                                    {milestone.title}
                                </h3>

                                {/* Milestone Description */}
                                <p className="about-timeline-desc">
                                    {milestone.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
