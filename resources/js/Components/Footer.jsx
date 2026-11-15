const quickLinks = [
    ['Home', '/'],
    ['About us', '/about-us'],
    ['Contact Us', '/contact-us'],
    ['Privacy Policy', '/privacy-policy'],
    ['Track Order', '/track-order'],
    ['Return Policy', '/refund-returns'],
    ['Delivery Info', '/delivery-info'],
];

const shopLinks = [
    ['Sweets & Mithai', '/shop/?cats=sweets'],
    ['Namkeen & Snaks', '/shop/?cats=namkeen%2Csnacks'],
    ['Bakery Items', '/shop/?cats=bakery'],
    ['Beverages', '/shop/?cats=beverages'],
    ['Gift hampers', '/shop/?cats=gift-hampers'],
    ['Seasonal Specials', '/products/?seasonal=baisakhi%2Cdiwali%2Cchristmas%2Ceid%2Cnew-year%2Choli%2Cnavratri%2Craksha-bandhan%2Csummer-specials%2Cwinter-specials%2Cwedding-collection'],
];

const corporateLinks = [
    ['Bulk Orders', '/shop'],
    ['Corporate Gifting', '/gifting'],
    ['Event Catering', '/gifting'],
    ['Franchise Enquiry', '/franchise'],
];

const galleryImages = [
    'Image-Namkeen.png',
    'photo-1547592180-85f173990554.png',
    'photo-1601050690597-df0568f70950.png',
    'Image-Gulab-Jamun.png',
    'photo-1519225421980-715cb0215aed.png',
    'Container-9.png',
];

const trustItems = [
    ['100% SECURE', 'Safe & Secure Payments', 'Vector-3.svg'],
    ['LIVE TRACKING', 'Real-time Updates', 'Icon-1.svg'],
    ['FAST DELIVERY', 'On Time, Every Time', 'Icon-2.svg'],
    ['PREMIUM QUALITY', 'Handcrafted with Love & Purity', 'Vector-4.svg'],
];

function FooterLinkList({ title, links }) {
    return (
        <section className="dayal-footer-links-column">
            <h3>{title}</h3>
            <ul>{links.map(([label, url]) => <li key={label}><a href={url}>{label}</a></li>)}</ul>
        </section>
    );
}

export default function Footer() {
    return (
        <footer className="dayal-footer">
            <section className="dayal-footer-cta">
                <div className="dayal-footer-cta-inner">
                    <div className="dayal-footer-cta-content">
                        <div className="dayal-footer-cta-lead">
                            <div className="dayal-footer-cta-intro">
                                <span className="dayal-footer-cta-intro-rule" aria-hidden="true" />
                                <p className="dayal-footer-eyebrow">craving something sweet</p>
                                <span className="dayal-footer-cta-intro-rule" aria-hidden="true" />
                            </div>
                            <div className="dayal-footer-cta-heading">
                                <h2>Order your favorites</h2>
                                <h2 className="rt-span-color">Anytime, Anywhere</h2>
                            </div>
                        </div>
                        <div className="dayal-footer-cta-copy">
                            <p className="dayal-footer-cta-description">From our kitchen to your doorstep,<br />we make every order special.</p>
                            <div className="dayal-footer-cta-actions">
                                <a href="/shop"><span className="dayal-footer-cta-action-icon dayal-footer-cta-order-icon" aria-hidden="true" />ORDER NOW</a>
                                <a href="https://wa.me/919876543210"><span className="dayal-footer-cta-action-icon dayal-footer-cta-chat-icon" aria-hidden="true" />CHAT NOW</a>
                            </div>
                        </div>
                        <div className="dayal-footer-cta-benefits" aria-label="Shopping benefits">
                            {trustItems.map(([title, description, icon]) => (
                                <div className="dayal-footer-cta-benefit" key={title}>
                                    <img src={`/uploads/2026/07/${icon}`} alt="" />
                                    <div className="dayal-footer-cta-benefit-copy">
                                        <strong>{title}</strong>
                                        <span>{description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <img className="dayal-footer-cta-image" src="/uploads/2026/07/25a75be7cdf9333748b57b1e795b01d57a04548a.webp" alt="Dayal Sweets storefront" />
                </div>
            </section>
            <div className="dayal-footer-main">
                <div className="dayal-footer-container dayal-footer-main-inner">
                    <div className="dayal-footer-brand">
                        <img src="/uploads/2026/07/Frame-51-1-1.png" alt="Dayal Sweets" />
                        <p>Crafting India's most loved sweet moments since 1962. Pure ingredients, authentic recipes, and a legacy of taste.</p>
                        <div className="dayal-footer-social" aria-label="Social media">
                            <a href="https://www.instagram.com/" aria-label="Instagram"><img src="/uploads/2026/07/Link.svg" alt="" /></a>
                            <a href="https://www.facebook.com/" aria-label="Facebook"><img src="/uploads/2026/07/Link-1-1.svg" alt="" /></a>
                            <a href="https://www.youtube.com/" aria-label="YouTube"><img src="/uploads/2026/07/Link-2-1.svg" alt="" /></a>
                        </div>
                        <div className="dayal-footer-certification">
                            <h4>Certified &amp; Proud</h4>
                            <div className="dayal-footer-certificates">
                                <img src="/uploads/2026/07/kindpng_2513820-1.png" alt="" />
                                <img src="/uploads/2026/07/Asset-1-2-1.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <FooterLinkList title="Quick Link" links={quickLinks} />
                    <FooterLinkList title="Shop" links={shopLinks} />
                    <FooterLinkList title="Corporate" links={corporateLinks} />
                    <section className="dayal-footer-gallery">
                        <h3>Gallery</h3>
                        <div className="dayal-footer-gallery-grid">
                            {galleryImages.map((image) => <a href="/gallery/" key={image}><img src={`/uploads/2026/07/${image}`} alt="" /></a>)}
                        </div>
                    </section>
                </div>
                <div className="dayal-footer-bottom"><p>© 2026 Dayal Sweets. All rights reserved.</p></div>
            </div>
        </footer>
    );
}
