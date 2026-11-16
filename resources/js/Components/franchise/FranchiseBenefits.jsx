import React from 'react';
import { franchiseBenefits } from '@/data/franchiseData';

/**
 * Section A: Why Partner With Dayal Sweets?
 * 6 Benefit Cards in a responsive grid
 */
export default function FranchiseBenefits() {
    return (
        <section className="franchise-benefits-section" aria-label="Why Partner With Dayal Sweets">
            <div className="franchise-benefits-container">
                <h2 className="franchise-benefits-heading">
                    Why Partner With <span className="rt-span-color">Dayal Sweets?</span>
                </h2>

                <div className="franchise-benefits-grid">
                    {franchiseBenefits.map((item) => (
                        <article key={item.id} className="franchise-benefits-card">
                            <div className="franchise-benefits-icon-wrap">
                                <img
                                    src={item.icon}
                                    alt={item.title}
                                    className="franchise-benefits-icon"
                                    loading="lazy"
                                />
                            </div>

                            <h3 className="franchise-benefits-card-title">{item.title}</h3>

                            <img
                                src={item.divider}
                                alt=""
                                className="franchise-benefits-divider"
                                aria-hidden="true"
                            />

                            <p className="franchise-benefits-desc">{item.description}</p>

                            <img
                                src={item.arrow}
                                alt=""
                                className="franchise-benefits-arrow"
                                aria-hidden="true"
                            />
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
