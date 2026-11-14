import { useState } from 'react';
import { ChevronDown, Menu, Phone, Search, ShoppingBag, Store, Truck, UserRound, X, Headset } from 'lucide-react';
import { Link } from '@inertiajs/react';

const navItems = [
    ['Dinning', '/dinning'], ['Gifting', '/gifting'], ['About Us', '/about-us'],
    ['Gallery', '/gallery'], ['Contact Us', '/contact-us'],
];

export default function Header() {
    const [shopOpen, setShopOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="dayal-header">
            <div className="dayal-header-top">
                <div className="dayal-header-container dayal-header-top-inner">
                    <p>Free delivery on orders above <strong>₹999</strong></p>
                    <div className="dayal-header-quicklinks">
                        <a href="/"><Truck size={15} />Delivery</a><a href="/franchise"><Store size={15} />Franchise</a><a href="/corporate-gifting"><Headset size={15} />Bulk/Corporate Inquiry</a><a href="tel:+919876543210"><Phone size={15} />+91 98765 43210</a>
                    </div>
                </div>
            </div>
            <div className="dayal-header-main">
                <div className="dayal-header-container dayal-header-main-inner">
                    <Link href="/" className="dayal-header-logo" aria-label="Dayal Sweets home"><img src="/assets/logos/dayal-sweets-header.png" alt="Dayal Sweets" /></Link>
                    <nav className={`dayal-header-nav ${mobileOpen ? 'is-open' : ''}`} aria-label="Main navigation">
                        <Link href="/" className="dayal-header-link is-active">Home</Link>
                        <div className="dayal-header-shop">
                            <button type="button" className="dayal-header-link" aria-expanded={shopOpen} onClick={() => setShopOpen(!shopOpen)}>Shop <ChevronDown size={13} /></button>
                            {shopOpen && <div className="dayal-header-dropdown">{['Kaju Katli', 'Milk Cake', 'Rasgulla', 'Gulab Jamun', 'Rasmalai', 'Peda', 'Dry Fruit Laddu', 'Barfi', 'Motichoor Laddu', 'Imarti', 'Malai Ghewar'].map((name) => <a key={name} href="/shop">{name}</a>)}</div>}
                        </div>
                        {navItems.map(([label, href]) => <a key={label} className="dayal-header-link" href={href}>{label}</a>)}
                    </nav>
                    <div className="dayal-header-actions">
                        <button type="button" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}><Search size={19} strokeWidth={1.6} /></button>
                        <a href="/my-account" aria-label="My account"><UserRound size={19} strokeWidth={1.6} /></a>
                        <a href="/cart" className="dayal-header-cart" aria-label="Shopping bag"><ShoppingBag size={19} strokeWidth={1.6} /><span>0</span></a>
                        <a className="dayal-header-order" href="/shop">Order Now</a>
                        <button className="dayal-header-toggle" type="button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
                    </div>
                </div>
                {searchOpen && <form className="dayal-header-search" action="/" method="get"><input type="search" name="s" placeholder="Search Our Collection" aria-label="Search Our Collection" /><button type="submit" aria-label="Submit search"><Search size={18} /></button></form>}
            </div>
        </header>
    );
}
