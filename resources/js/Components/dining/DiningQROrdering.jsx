import React from 'react';
import { diningQrSteps } from '@/data/diningData';

/**
 * Section C: QR Table Ordering
 * Left: QR ordering photograph (phone & table stand)
 * Middle: Eyebrow, Heading, Description
 * Right: 5-step ordering process card with icons and connecting arrows
 */
export default function DiningQROrdering() {
    const step1 = diningQrSteps.find((s) => s.step === 1);
    const step2 = diningQrSteps.find((s) => s.step === 2);
    const step3 = diningQrSteps.find((s) => s.step === 3);
    const step4 = diningQrSteps.find((s) => s.step === 4);
    const step5 = diningQrSteps.find((s) => s.step === 5);

    return (
        <section className="dining-qr-section" aria-label="QR Table Ordering">
            <div className="dining-qr-container">
                <div className="dining-qr-box">
                    {/* Left Column: Phone & QR Stand Image */}
                    <div className="dining-qr-media-col">
                        <div className="dining-qr-media-wrap">
                            <img
                                src="/uploads/2026/09/Ellipse-2487.png"
                                alt=""
                                className="dining-qr-ellipse-bg"
                                aria-hidden="true"
                            />
                            <img
                                src="/uploads/2026/09/table-scan-img.png"
                                alt="Dayal Sweets QR Table Ordering Stand and Mobile App"
                                className="dining-qr-phone-img"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Middle Column: Text & Heading */}
                    <div className="dining-qr-text-col">
                        <div className="dining-qr-eyebrow-wrap">
                            <span className="dining-qr-eyebrow-line" aria-hidden="true" />
                            <span className="dining-qr-eyebrow">QR TABLE ORDERING</span>
                            <span className="dining-qr-eyebrow-line" aria-hidden="true" />
                        </div>

                        <h2 className="dining-qr-heading">
                            Scan. <span className="rt-span-color">Order.</span> Enjoy.
                        </h2>

                        <p className="dining-qr-desc">
                            Skip the wait! Scan the QR code at your table, browse the menu, place your order, and enjoy a seamless waiter-free dining experience.
                        </p>
                    </div>

                    {/* Right Column: Step-by-Step Card */}
                    <div className="dining-qr-steps-col">
                        <div className="dining-qr-steps-card">
                            <div className="dining-qr-steps-header">
                                <h3 className="dining-qr-steps-title">Just Follow these steps :</h3>
                                <img
                                    src="/uploads/2026/08/Follow-Mark.png"
                                    alt=""
                                    className="dining-qr-follow-mark"
                                    aria-hidden="true"
                                />
                            </div>

                            {/* Row 1: Step 1 -> Arrow -> Step 2 */}
                            <div className="dining-qr-steps-row">
                                {step1 && (
                                    <div className="dining-qr-step-item">
                                        <img src={step1.icon} alt={step1.title} className="dining-qr-step-icon" />
                                        <div className="dining-qr-step-info">
                                            <h4 className="dining-qr-step-name">{step1.title}</h4>
                                            <p className="dining-qr-step-text">{step1.description}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="dining-qr-step-arrow-wrap" aria-hidden="true">
                                    <img src="/uploads/2026/08/Follow-Line.png" alt="" className="dining-qr-step-arrow" />
                                </div>
                                {step2 && (
                                    <div className="dining-qr-step-item">
                                        <img src={step2.icon} alt={step2.title} className="dining-qr-step-icon" />
                                        <div className="dining-qr-step-info">
                                            <h4 className="dining-qr-step-name">{step2.title}</h4>
                                            <p className="dining-qr-step-text">{step2.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Row 2: Step 3 -> Arrow -> Step 4 */}
                            <div className="dining-qr-steps-row">
                                {step3 && (
                                    <div className="dining-qr-step-item">
                                        <img src={step3.icon} alt={step3.title} className="dining-qr-step-icon" />
                                        <div className="dining-qr-step-info">
                                            <h4 className="dining-qr-step-name">{step3.title}</h4>
                                            <p className="dining-qr-step-text">{step3.description}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="dining-qr-step-arrow-wrap" aria-hidden="true">
                                    <img src="/uploads/2026/08/Follow-Line.png" alt="" className="dining-qr-step-arrow" />
                                </div>
                                {step4 && (
                                    <div className="dining-qr-step-item">
                                        <img src={step4.icon} alt={step4.title} className="dining-qr-step-icon" />
                                        <div className="dining-qr-step-info">
                                            <h4 className="dining-qr-step-name">{step4.title}</h4>
                                            <p className="dining-qr-step-text">{step4.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Row 3: Step 5 */}
                            <div className="dining-qr-steps-row dining-qr-steps-row-last">
                                {step5 && (
                                    <div className="dining-qr-step-item">
                                        <img src={step5.icon} alt={step5.title} className="dining-qr-step-icon" />
                                        <div className="dining-qr-step-info">
                                            <h4 className="dining-qr-step-name">{step5.title}</h4>
                                            <p className="dining-qr-step-text">{step5.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Decorative Thali at bottom right of card */}
                            <img
                                src="/uploads/2026/08/Qr-Container-Step-Background.png"
                                alt=""
                                className="dining-qr-steps-bg-decor"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
