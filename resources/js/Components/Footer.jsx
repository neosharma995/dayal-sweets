import { ArrowRight } from 'lucide-react';

export default function Footer() {
    const trustItems = [
        ['100% SECURE', 'Safe & Secure Payments'],
        ['LIVE TRACKING', 'Real-time Updates'],
        ['FAST DELIVERY', 'On Time, Every Time'],
        ['PREMIUM QUALITY', 'Handcrafted with Love & Purity'],
    ];

    return (
        <footer className="dayal-footer">
            <section className="dayal-footer-cta">
                <div className="dayal-footer-container dayal-footer-cta-inner">
                    <div className="dayal-footer-cta-copy">
                        <p className="dayal-footer-eyebrow">Craving something sweet</p>
                        <h2>Order your favorites<br />Anytime, Anywhere</h2>
                        <p>From our kitchen to your doorstep,<br />we make every order special.</p>
                    </div>
                    <div className="dayal-footer-cta-actions">
                        <a href="/shop">Order Now <ArrowRight size={16} /></a>
                        <a href="https://wa.me/919876543210">Chat Now</a>
                    </div>
                </div>
            </section>
            <section className="dayal-footer-trust" aria-label="Shopping benefits">
                <div className="dayal-footer-container dayal-footer-trust-grid">
                    {trustItems.map(([title, description]) => <div className="dayal-footer-trust-item" key={title}><strong>{title}</strong><span>{description}</span></div>)}
                </div>
            </section>
            <div className="dayal-footer-main">
                <div className="dayal-footer-container dayal-footer-main-inner">
                    <div className="dayal-footer-brand"><img src="/assets/logos/dayal-sweets-footer.png" alt="Dayal Sweets" /><p>Crafting India’s most loved sweet moments since 1962. Pure ingredients, authentic recipes, and a legacy of taste.</p><strong>Certified &amp; Proud</strong></div>
                    <div className="dayal-footer-social"><a href="https://www.instagram.com/" aria-label="Instagram"><img src="/assets/social/instagram.svg" alt="" /></a><a href="https://www.facebook.com/" aria-label="Facebook"><img src="/assets/social/facebook.svg" alt="" /></a><a href="https://www.youtube.com/" aria-label="YouTube"><img src="/assets/social/youtube.svg" alt="" /></a></div>
                </div>
                <div className="dayal-footer-container dayal-footer-links">
                    <div><strong>Quick Link</strong><a href="/">Home</a><a href="/about-us">About us</a><a href="/reviews">Reviews</a><a href="/contact-us">Contact Us</a><a href="/privacy-policy">Privacy Policy</a><a href="/return-policy">Return Policy</a></div>
                    <div><strong>Shop</strong><a href="/shop">Sweets &amp; Mithai</a><a href="/shop">Namkeen &amp; Snaks</a><a href="/shop">Bakery Items</a><a href="/shop">Beverages</a><a href="/gifting">Gift hampers</a><a href="/shop">Seasonal Specials</a></div>
                    <div><strong>Corporate</strong><a href="/gifting">Orders</a><a href="/gifting">Corporate Gifting</a><a href="/franchise">Franchise Enquiry</a><a href="/gallery">Gallery</a></div>
                </div>
                <div className="dayal-footer-container dayal-footer-bottom">© 2026 Dayal Sweets. All rights reserved.</div>
            </div>
        </footer>
    );
}
