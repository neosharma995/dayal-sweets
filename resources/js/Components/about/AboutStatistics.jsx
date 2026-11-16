import React from 'react';
import { aboutStatistics } from '@/data/aboutData';

/**
 * Section F: Numbers That Matters
 * Full-width burgundy statistics banner with 5 metrics
 */
export default function AboutStatistics() {
    return (
        <section className="about-stats-section">
            <div className="about-stats-container">
                {/* Eyebrow */}
                <div className="about-stats-eyebrow" aria-hidden="true">
                    <span className="about-stats-divider" />
                    <span className="about-stats-eyebrow-text">Numbers that matters</span>
                    <span className="about-stats-divider" />
                </div>

                {/* 5 Statistics Grid */}
                <div className="about-stats-grid">
                    {aboutStatistics.map((stat) => (
                        <div key={stat.id} className="about-stat-item">
                            <div className="about-stat-number">{stat.number}</div>
                            <div className="about-stat-label">{stat.label}</div>
                            <p className="about-stat-desc">{stat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
