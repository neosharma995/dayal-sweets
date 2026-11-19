import { Link, usePage } from '@inertiajs/react';

const quickLinks = [
    ['Home', '/'],
    ['About us', '/about-us'],
    ['Testimonials', '/testimonials'],
    ['Contact Us', '/contact-us'],
    ['Privacy Policy', '/privacy-policy'],
    ['Return Policy', '/refund-returns'],
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
    ['Orders', '/shop'],
    ['Corporate Gifting', '/gifting'],
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
            <ul>{links.map(([label, url]) => <li key={label}><Link href={url}>{label}</Link></li>)}</ul>
        </section>
    );
}

export default function Footer() {
    const { headerFooter } = usePage().props;
    const footerBar = headerFooter?.footer_bar || {};

    const subHeading = footerBar.sub_heading ?? 'craving something sweet';
    const heading = footerBar.heading ?? 'Order your favorites Anytime, Anywhere';
    const description = footerBar.description ?? "From our kitchen to your doorstep,\nwe make every order special.";
    const phoneNumber = footerBar.phone_number ?? '+91 98765 43210';
    const ctaImage = footerBar.image || '/uploads/2026/07/25a75be7cdf9333748b57b1e795b01d57a04548a.webp';

    const benefits = Array.isArray(footerBar.items) && footerBar.items.length > 0
        ? footerBar.items
        : trustItems.map(([title, desc, icon]) => ({ heading: title, para: desc, icon }));

    const footerLogo = headerFooter?.footer_logo || '/uploads/2026/07/Frame-51-1-1.png';
    const footerDescription = headerFooter?.footer_description ?? "Crafting India's most loved sweet moments since 1962. Pure ingredients, authentic recipes, and a legacy of taste.";

    const certificates = Array.isArray(headerFooter?.certified_groups) && headerFooter.certified_groups.length > 0
        ? headerFooter.certified_groups
        : ['/uploads/2026/07/kindpng_2513820-1.png', '/uploads/2026/07/Asset-1-2-1.png'];

    const socialLinks = [
        { name: 'Instagram', link: 'https://www.instagram.com/dayalsweets/', icon: '/uploads/2026/07/Link.svg' },
        { name: 'Facebook', link: 'https://www.facebook.com/dayalsweets/', icon: '/uploads/2026/07/Link-1-1.svg' },
        { name: 'YouTube', link: 'https://www.youtube.com/results?search_query=Dayal+Sweets', icon: '/uploads/2026/07/Link-2-1.svg' },
    ];

    const copyright = headerFooter?.copyright_description ?? '© 2026 Dayal Sweets. All rights reserved.';

    const cleanPhone = (phoneNumber || '919876543210').replace(/[^0-9]/g, '') || '919876543210';
    const whatsappLink = `https://wa.me/${cleanPhone}`;

    const renderHeading = (text) => {
        if (!text) return null;
        if (text.includes('\n')) {
            const lines = text.split('\n');
            return (
                <div className="dayal-footer-cta-heading">
                    <h2>{lines[0]}</h2>
                    <h2 className="rt-span-color">{lines.slice(1).join(' ')}</h2>
                </div>
            );
        }
        const words = text.split(' ');
        if (words.length >= 4) {
            const mid = Math.ceil(words.length / 2);
            return (
                <div className="dayal-footer-cta-heading">
                    <h2>{words.slice(0, mid).join(' ')}</h2>
                    <h2 className="rt-span-color">{words.slice(mid).join(' ')}</h2>
                </div>
            );
        }
        return (
            <div className="dayal-footer-cta-heading">
                <h2>{text}</h2>
            </div>
        );
    };

    return (
        <footer className="dayal-footer">
            <section className="dayal-footer-cta">
                <div className="dayal-footer-cta-inner">
                    <div className="dayal-footer-cta-content">
                        <div className="dayal-footer-cta-lead">
                            <div className="dayal-footer-cta-intro">
                                <span className="dayal-footer-cta-intro-rule" aria-hidden="true" />
                                <p className="dayal-footer-eyebrow">{subHeading}</p>
                                <span className="dayal-footer-cta-intro-rule" aria-hidden="true" />
                            </div>
                            {renderHeading(heading)}
                        </div>
                        <div className="dayal-footer-cta-copy">
                            <p className="dayal-footer-cta-description" style={{ whiteSpace: 'pre-line' }}>{description}</p>
                            <div className="dayal-footer-cta-actions">
                                <Link href="/shop"><span className="dayal-footer-cta-action-icon dayal-footer-cta-order-icon" aria-hidden="true" />ORDER NOW</Link>
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><span className="dayal-footer-cta-action-icon dayal-footer-cta-chat-icon" aria-hidden="true" />CHAT NOW</a>
                            </div>
                        </div>
                        <div className="dayal-footer-cta-benefits" aria-label="Shopping benefits">
                            {benefits.map((item, idx) => {
                                const iconSrc = item.icon?.startsWith('/')
                                    ? item.icon
                                    : `/uploads/2026/07/${item.icon || 'Vector-3.svg'}`;
                                return (
                                    <div className="dayal-footer-cta-benefit" key={item.heading || idx}>
                                        <img src={iconSrc} alt="" />
                                        <div className="dayal-footer-cta-benefit-copy">
                                            <strong>{item.heading}</strong>
                                            <span>{item.para}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <img className="dayal-footer-cta-image" src={ctaImage} alt="Dayal Sweets storefront" />
                </div>
            </section>
            <div className="dayal-footer-main">
                <div className="dayal-footer-container dayal-footer-main-inner">
                    <div className="dayal-footer-brand">
                        <img src={footerLogo} alt="Dayal Sweets" />
                        <p>{footerDescription}</p>
                        <div className="dayal-footer-social" aria-label="Social media">
                            {socialLinks.map((social) => (
                                <a href={social.link} aria-label={social.name} key={social.name} target="_blank" rel="noopener noreferrer">
                                    <img src={social.icon} alt={social.name} />
                                </a>
                            ))}
                        </div>
                        <div className="dayal-footer-certification">
                            <h4>Certified &amp; Proud</h4>
                            <div className="dayal-footer-certificates">
                                {certificates.map((cert, idx) => (
                                    <img src={cert} alt="Certified" key={idx} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <FooterLinkList title="Quick Link" links={quickLinks} />
                    <FooterLinkList title="Shop" links={shopLinks} />
                    <FooterLinkList title="Corporate" links={corporateLinks} />
                    <section className="dayal-footer-gallery">
                        <h3>Gallery</h3>
                        <div className="dayal-footer-gallery-grid">
                            {galleryImages.map((image) => <Link href="/gallery" key={image}><img src={`/uploads/2026/07/${image}`} alt="" /></Link>)}
                        </div>
                    </section>
                </div>
                <div className="dayal-footer-bottom"><p>{copyright}</p></div>
            </div>
        </footer>
    );
}
