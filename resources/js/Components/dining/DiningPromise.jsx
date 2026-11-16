import React from 'react';
import { diningPromises } from '@/data/diningData';
import { ShieldCheck, Award, Flame, HeartHandshake } from 'lucide-react';

export default function DiningPromise() {
    return (
        <section className="dayal-dining-promise-section">
            <div className="dayal-dining-container">
                <div className="promise-section-card">
                    <header className="dayal-dining-section-header light-text">
                        <div className="dayal-dining-eyebrow">
                            <span className="eyebrow-line gold" />
                            <span className="eyebrow-text gold">OUR CULINARY PROMISE</span>
                            <span className="eyebrow-line gold" />
                        </div>
                        <h2 className="dayal-dining-section-title">
                            Pure Ingredients. <span className="title-accent gold">Zero Compromise.</span>
                        </h2>
                        <p className="dayal-dining-section-subtitle light-text">
                            For over 60 years, Dayal Sweets has stood for unmatched purity, genuine mountain hospitality, and honest craftsmanship.
                        </p>
                    </header>

                    <div className="dayal-dining-promise-grid">
                        {diningPromises.map((promise) => (
                            <div className="dayal-promise-item" key={promise.id}>
                                <div className="promise-icon-bubble">
                                    <img
                                        src={promise.icon}
                                        alt={promise.title}
                                        loading="lazy"
                                        className="promise-icon-img"
                                    />
                                </div>
                                <h3 className="promise-item-title">{promise.title}</h3>
                                <p className="promise-item-desc">{promise.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="promise-footer-banner">
                        <div className="promise-cert-badge">
                            <Award size={20} />
                            <span>100% Pure Desi Ghee &amp; FSSAI Certified</span>
                        </div>
                        <div className="promise-cert-badge">
                            <ShieldCheck size={20} />
                            <span>Strict Hygiene &amp; Sanitized Kitchens</span>
                        </div>
                        <div className="promise-cert-badge">
                            <HeartHandshake size={20} />
                            <span>Himachal's Trusted Legacy Since 1962</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
