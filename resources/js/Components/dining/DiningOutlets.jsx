import React from 'react';
import { diningOutlets } from '@/data/diningData';
import { MapPin, Clock, Phone, Navigation, Users } from 'lucide-react';

export default function DiningOutlets() {
    return (
        <section className="dayal-dining-outlets-section" id="dining-outlets">
            <div className="dayal-dining-container">
                <header className="dayal-dining-section-header">
                    <div className="dayal-dining-eyebrow">
                        <span className="eyebrow-line" />
                        <span className="eyebrow-text">OUR LOCATIONS</span>
                        <span className="eyebrow-line" />
                    </div>
                    <h2 className="dayal-dining-section-title">
                        Visit Our Dining <span className="title-accent">Destinations</span>
                    </h2>
                    <p className="dayal-dining-section-subtitle">
                        Experience Dayal Sweets hospitality at our flagship branch in Amb, Hamirpur, or our highway hub in Una.
                    </p>
                </header>

                <div className="dayal-dining-outlets-grid">
                    {diningOutlets.map((outlet) => (
                        <article className="dayal-outlet-card" key={outlet.id}>
                            <div className="outlet-card-media">
                                <img
                                    src={outlet.image}
                                    alt={outlet.name}
                                    loading="lazy"
                                    className="outlet-card-img"
                                />
                                <span className="outlet-capacity-pill">
                                    <Users size={12} />
                                    <span>{outlet.capacity}</span>
                                </span>
                            </div>

                            <div className="outlet-card-body">
                                <span className="outlet-city-tag">{outlet.city}</span>
                                <h3 className="outlet-title">{outlet.name}</h3>

                                <div className="outlet-meta-item">
                                    <MapPin size={16} className="outlet-meta-icon" />
                                    <span>{outlet.address}</span>
                                </div>

                                <div className="outlet-meta-item">
                                    <Clock size={16} className="outlet-meta-icon" />
                                    <span>{outlet.timings}</span>
                                </div>

                                <div className="outlet-meta-item">
                                    <Phone size={16} className="outlet-meta-icon" />
                                    <a href={`tel:${outlet.phone.replace(/\s+/g, '')}`}>
                                        {outlet.phone}
                                    </a>
                                </div>

                                <div className="outlet-features-list">
                                    {outlet.features.map((feat, fIdx) => (
                                        <span className="outlet-feature-chip" key={fIdx}>
                                            {feat}
                                        </span>
                                    ))}
                                </div>

                                <div className="outlet-card-actions">
                                    <a
                                        href={outlet.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outlet-directions"
                                    >
                                        <Navigation size={14} />
                                        <span>Get Directions</span>
                                    </a>
                                    <a
                                        href="#reservation-form"
                                        className="btn-outlet-reserve"
                                    >
                                        Book Table
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
