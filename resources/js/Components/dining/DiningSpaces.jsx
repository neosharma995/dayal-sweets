import React from 'react';
import { diningSpaces } from '@/data/diningData';
import { Check, Users, Sparkles } from 'lucide-react';

export default function DiningSpaces() {
    return (
        <section className="dayal-dining-spaces-section">
            <div className="dayal-dining-container">
                <header className="dayal-dining-section-header">
                    <div className="dayal-dining-eyebrow">
                        <span className="eyebrow-line" />
                        <span className="eyebrow-text">OUR AMBIENCE</span>
                        <span className="eyebrow-line" />
                    </div>
                    <h2 className="dayal-dining-section-title">
                        Curated Dining Spaces for <span className="title-accent">Every Moment</span>
                    </h2>
                    <p className="dayal-dining-section-subtitle">
                        From bustling family lunches and joyful celebrations to quiet executive meetings, our dining halls are crafted with timeless Himachali warmth.
                    </p>
                </header>

                <div className="dayal-dining-spaces-grid">
                    {diningSpaces.map((space, idx) => (
                        <article className="dayal-dining-space-card" key={space.id}>
                            <div className="space-card-media">
                                <img
                                    src={space.image}
                                    alt={space.title}
                                    loading="lazy"
                                    className="space-card-img"
                                />
                                <span className="space-card-badge">{space.tag}</span>
                                <span className="space-card-number">0{idx + 1}</span>
                            </div>

                            <div className="space-card-body">
                                <h3 className="space-card-title">{space.title}</h3>
                                <p className="space-card-description">{space.description}</p>

                                <ul className="space-card-highlights">
                                    {space.highlights.map((highlight, hIdx) => (
                                        <li key={hIdx} className="space-highlight-item">
                                            <span className="highlight-check-icon">
                                                <Check size={14} strokeWidth={2.5} />
                                            </span>
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="space-card-footer">
                                    <a href="#reservation-form" className="space-reserve-btn">
                                        <span>Reserve This Space</span>
                                        <Sparkles size={14} />
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
