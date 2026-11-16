import React, { useState } from 'react';
import { Calendar, Clock, Users, Phone, MapPin, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';

export default function TableReservationForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        outlet: 'amb',
        space: 'family',
        date: '',
        timeSlot: 'dinner',
        guests: '4',
        occasion: 'casual',
        specialNotes: '',
    });

    const [submittedBooking, setSubmittedBooking] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const bookingId = `DSR-${Math.floor(1000 + Math.random() * 9000)}`;
            setSubmittedBooking({
                ...formData,
                id: bookingId,
            });
            setIsSubmitting(false);
        }, 600);
    };

    const handleReset = () => {
        setSubmittedBooking(null);
        setFormData({
            name: '',
            phone: '',
            email: '',
            outlet: 'amb',
            space: 'family',
            date: '',
            timeSlot: 'dinner',
            guests: '4',
            occasion: 'casual',
            specialNotes: '',
        });
    };

    return (
        <section className="dayal-dining-reservation-section" id="reservation-form">
            <div className="dayal-dining-container">
                <div className="reservation-layout-card">
                    {/* Left Column: Hospitality Visual & Quick Call */}
                    <aside className="reservation-info-sidebar">
                        <div className="info-sidebar-inner">
                            <span className="sidebar-eyebrow">RESERVE IN ADVANCE</span>
                            <h3 className="sidebar-title">Book Your Table or Private Celebration Suite</h3>
                            <p className="sidebar-description">
                                Guarantee seamless seating for your family and guests. Whether it's a spontaneous family dinner or an elaborate birthday celebration, our team prepares ahead for your arrival.
                            </p>

                            <div className="sidebar-perks-list">
                                <div className="sidebar-perk-item">
                                    <div className="perk-icon-dot">
                                        <Sparkles size={16} />
                                    </div>
                                    <div className="perk-text">
                                        <strong>Zero Wait Time</strong>
                                        <span>Your reserved table is kept ready before your arrival time.</span>
                                    </div>
                                </div>

                                <div className="sidebar-perk-item">
                                    <div className="perk-icon-dot">
                                        <Users size={16} />
                                    </div>
                                    <div className="perk-text">
                                        <strong>Private Celebration Suite</strong>
                                        <span>Exclusive dining space with personal attendant for groups of 10+.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar-contact-box">
                                <span className="contact-box-label">Prefer Instant Phone Booking?</span>
                                <a href="tel:+919876543210" className="contact-phone-link">
                                    <Phone size={18} />
                                    <span>+91 98765 43210</span>
                                </a>
                                <a
                                    href="https://wa.me/919876543210?text=Hello%20Dayal%20Sweets,%20I%20would%20like%20to%20reserve%20a%20dining%20table."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-whatsapp-link"
                                >
                                    <MessageCircle size={18} />
                                    <span>Book via WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Right Column: Interactive Form */}
                    <div className="reservation-form-main">
                        {submittedBooking ? (
                            <div className="reservation-success-card">
                                <div className="success-icon-wrap">
                                    <CheckCircle2 size={54} strokeWidth={1.75} />
                                </div>
                                <h3 className="success-title">Table Reservation Confirmed!</h3>
                                <p className="success-booking-ref">
                                    Booking Reference: <strong>{submittedBooking.id}</strong>
                                </p>
                                <p className="success-desc">
                                    Thank you, <strong>{submittedBooking.name}</strong>. We have received your dining reservation for <strong>{submittedBooking.guests} guests</strong>. A confirmation SMS and WhatsApp message have been dispatched to <strong>{submittedBooking.phone}</strong>.
                                </p>

                                <div className="success-details-summary">
                                    <div className="summary-pill">
                                        <strong>Outlet:</strong> {submittedBooking.outlet.toUpperCase()}
                                    </div>
                                    <div className="summary-pill">
                                        <strong>Time:</strong> {submittedBooking.timeSlot.toUpperCase()}
                                    </div>
                                    <div className="summary-pill">
                                        <strong>Dining Space:</strong> {submittedBooking.space.toUpperCase()}
                                    </div>
                                </div>

                                <div className="success-actions">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="btn-book-another"
                                    >
                                        Reserve Another Table
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form className="dayal-reservation-form" onSubmit={handleSubmit}>
                                <div className="form-header">
                                    <h3 className="form-title">Reserve a Dining Experience</h3>
                                    <p className="form-subtitle">Fill out your preferred dining details below.</p>
                                </div>

                                <div className="form-grid-row">
                                    <div className="form-field-group">
                                        <label htmlFor="res-name">Full Name *</label>
                                        <input
                                            id="res-name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Rahul Sharma"
                                            className="dayal-form-input"
                                        />
                                    </div>

                                    <div className="form-field-group">
                                        <label htmlFor="res-phone">Phone Number *</label>
                                        <input
                                            id="res-phone"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+91 98765 43210"
                                            className="dayal-form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-grid-row">
                                    <div className="form-field-group">
                                        <label htmlFor="res-outlet">Select Outlet *</label>
                                        <select
                                            id="res-outlet"
                                            name="outlet"
                                            value={formData.outlet}
                                            onChange={handleChange}
                                            className="dayal-form-select"
                                        >
                                            <option value="amb">Amb Outlet (Flagship Highway)</option>
                                            <option value="hamirpur">Hamirpur Outlet (Gandhi Chowk)</option>
                                            <option value="una">Nangal Road Una Outlet</option>
                                        </select>
                                    </div>

                                    <div className="form-field-group">
                                        <label htmlFor="res-space">Dining Space *</label>
                                        <select
                                            id="res-space"
                                            name="space"
                                            value={formData.space}
                                            onChange={handleChange}
                                            className="dayal-form-select"
                                        >
                                            <option value="family">Family Dining Hall</option>
                                            <option value="corporate">Corporate Lounge</option>
                                            <option value="private">Private Celebration Suite</option>
                                            <option value="outdoor">Open-Air &amp; Terrace Courtyard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-grid-row three-cols">
                                    <div className="form-field-group">
                                        <label htmlFor="res-date">Date *</label>
                                        <input
                                            id="res-date"
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                            className="dayal-form-input"
                                        />
                                    </div>

                                    <div className="form-field-group">
                                        <label htmlFor="res-time">Time Slot *</label>
                                        <select
                                            id="res-time"
                                            name="timeSlot"
                                            value={formData.timeSlot}
                                            onChange={handleChange}
                                            className="dayal-form-select"
                                        >
                                            <option value="lunch">Lunch (12:00 PM – 03:30 PM)</option>
                                            <option value="evening">Hi-Tea &amp; Snacks (04:00 PM – 07:00 PM)</option>
                                            <option value="dinner">Dinner (07:00 PM – 10:30 PM)</option>
                                        </select>
                                    </div>

                                    <div className="form-field-group">
                                        <label htmlFor="res-guests">Number of Guests *</label>
                                        <select
                                            id="res-guests"
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleChange}
                                            className="dayal-form-select"
                                        >
                                            <option value="1-2">1 – 2 Guests</option>
                                            <option value="3-5">3 – 5 Guests</option>
                                            <option value="6-10">6 – 10 Guests</option>
                                            <option value="11-20">11 – 20 Guests</option>
                                            <option value="20+">20+ Guests (Large Celebration)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-field-group">
                                    <label htmlFor="res-notes">Occasion / Special Dietary Requests</label>
                                    <textarea
                                        id="res-notes"
                                        name="specialNotes"
                                        rows={3}
                                        value={formData.specialNotes}
                                        onChange={handleChange}
                                        placeholder="E.g. Celebrating 25th anniversary, require high chair for toddler, less spicy Jain food preparation..."
                                        className="dayal-form-textarea"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="dayal-submit-reservation-btn"
                                >
                                    {isSubmitting ? 'Confirming Your Reservation...' : 'CONFIRM TABLE RESERVATION'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
