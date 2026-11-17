import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutDashboard, LogOut, MapPin, Menu, Package, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import { useCart } from '@/Context/CartContext';
import CartDrawer from '@/Components/CartDrawer';
import Modal from '@/Components/Modal';

const navItems = [
    ['Dining', '/dining'], ['Gifting', '/gifting'], ['About Us', '/about-us'],
    ['Gallery', '/gallery'], ['Contact Us', '/contact-us'],
];

const utilityLinks = [
    ['Delivery', '/', 'delivered-sent.svg'],
    ['Franchise', '/franchise', 'store-verified-01.svg'],
    ['Bulk/Corporate Inquiry', 'tel:98765 43210', 'customer-support.svg'],
    ['+91 98765 43210', 'tel:98765 43210', 'phone-calling.svg'],
];

const shopCategories = [
    { title: 'Sweets', icon: 'cinnamon-roll.png', products: [['Barfi', 'barfi'], ['Dry Fruit Laddu', 'dry-fruit-laddu'], ['Gulab Jamun', 'gulab-jamun'], ['Imarti', 'imarti'], ['Kaju Katli', 'kaju-katli'], ['Malai Ghewar', 'malai-ghewar'], ['Milk Cake', 'milk-cake'], ['Motichoor Laddu', 'motichoor-laddu'], ['Peda', 'peda'], ['Rasgulla', 'rasgulla'], ['Rasmalai', 'rasmalai']], all: '/shop/?cats=sweets', allLabel: 'View All Sweets' },
    { title: 'NAMKEEN', icon: 'Icon.png', products: [['Bhujia', 'bhujia'], ['Chana Dal', 'chana-dal'], ['Mathii', 'mathii'], ['Mattri', 'mattri'], ['Moong Dal', 'moong-dal'], ['Namkeen Mix', 'namkeen-mix'], ['Punjabi Tadka Mix', 'punjabi-tadka-mix'], ['Khatta Meetha Mix', 'khatta-meetha-mix']], all: '/shop/?cats=namkeen', allLabel: 'View All Namkeen' },
    { title: 'BAKERY', icon: 'Icon-1.png', products: [['Brownies', 'brownies'], ['Cakes', 'cakes'], ['Cookies', 'cookies'], ['Donuts', 'donuts'], ['Dry Cakes', 'dry-cakes'], ['Garlic Bread', 'garlic-bread'], ['Muffins', 'muffins'], ['Pastries', 'pastries'], ['Puff Patties', 'puff-patties'], ['Rusks', 'rusks'], ['Tea Cakes', 'tea-cakes']], all: '/shop/?cats=bakery', allLabel: 'View All Bakery' },
    { title: 'Beverages', icon: 'bubble-tea-01.png', products: [['Badam Milk', 'badam-milk'], ['Fresh Juices', 'fresh-juices'], ['Fresh Lime Soda', 'fresh-lime-soda'], ['Kesar Milk', 'kesar-milk'], ['Masala Chaas', 'masala-chaas'], ['Masala Chai', 'masala-chai']], all: '/shop/?cats=beverages', allLabel: 'View All Beverages' },
    { title: 'Snacks', icon: 'doughnut.png', products: [['Chole Bhature', 'chole-bhature'], ['Bhalla Papri', 'bhalla-papri'], ['Dhokla', 'dhokla'], ['Kachori', 'kachori'], ['Paneer Puff', 'paneer-puff'], ['Pizza Slice', 'pizza-slice'], ['Samosa', 'samosa'], ['Spring Roll', 'spring-roll'], ['Veg Patty', 'veg-patty'], ['Aloo Tikki', 'aloo-tikki']], all: '/shop/?cats=snacks', allLabel: 'View All Snacks' },
];

const shopShortcuts = [
    ['Best Sellers', 'package-03.png'],
    ['New Arrivals', 'new-releases.png'],
    ['Festivals Special', 'gift.png'],
    ['Offers & Combos', 'discount-tag-02.png'],
];

export default function Header({ auth }) {
    const { url, props } = usePage();
    const user = auth?.user || props?.auth?.user;
    const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const isAdmin = roles.includes('admin') || roles.includes('super-admin');
    const dashboardUrl = isAdmin ? '/admin/dashboard' : '/customer/dashboard';
    const ordersUrl = isAdmin ? '/admin/orders' : '/customer/orders';
    const accountUrl = isAdmin ? '/admin/account' : '/customer/account';

    const cartContext = useCart();
    const cartCount = cartContext?.cartCount ?? 0;
    const openCart = cartContext?.openCart ?? (() => { });
    const currentPath = url.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
    const shopActive = currentPath === '/shop' || currentPath.startsWith('/shop/') || currentPath.startsWith('/product/');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [openShopCategory, setOpenShopCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const shopNavigationRef = useRef(null);
    const userMenuRef = useRef(null);

    const closeMobileMenu = () => setMobileOpen(false);
    const openShopMenu = () => {
        setShopOpen(true);
    };

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);
    const toggleShopMenu = () => {
        setShopOpen((open) => !open);
    };

    const handleConfirmLogout = () => {
        setLoggingOut(true);
        const logoutTarget = isAdmin && typeof route === 'function' && route().has('admin.logout')
            ? route('admin.logout')
            : (typeof route === 'function' && route().has('logout') ? route('logout') : '/logout');

        router.post(logoutTarget, {}, {
            onFinish: () => {
                setLoggingOut(false);
                setLogoutModalOpen(false);
                setUserMenuOpen(false);
            },
        });
    };

    // Auto-close user dropdown on outside click or Escape key
    useEffect(() => {
        if (!userMenuOpen) return undefined;
        const handleOutsideClick = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('pointerdown', handleOutsideClick);
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick);
            window.removeEventListener('keydown', handleEscape);
        };
    }, [userMenuOpen]);

    useEffect(() => {
        if (!searchOpen) return undefined;
        const closeOnEscape = (event) => { if (event.key === 'Escape') setSearchOpen(false); };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [searchOpen]);

    useEffect(() => {
        if (!shopOpen) return undefined;
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setShopOpen(false);
            }
        };
        const closeOnOutsideClick = (event) => {
            if (!shopNavigationRef.current?.contains(event.target)) {
                setShopOpen(false);
            }
        };
        window.addEventListener('keydown', closeOnEscape);
        document.addEventListener('pointerdown', closeOnOutsideClick);
        return () => {
            window.removeEventListener('keydown', closeOnEscape);
            document.removeEventListener('pointerdown', closeOnOutsideClick);
        };
    }, [shopOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`dayal-header${isSticky ? ' is-sticky' : ''}`}>
            <div className="dayal-header-top">
                <div className="dayal-header-container dayal-header-top-inner">
                    <p>FREE DELIVERY ON ORDERS ABOVE <strong>&#8377;999</strong></p>
                    <div className="dayal-header-quicklinks">
                        {utilityLinks.map(([label, href, icon]) => {
                            if (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) {
                                return (
                                    <a href={href} key={label}>
                                        <img src={`/uploads/2026/07/${icon}`} alt="" />
                                        {label}
                                    </a>
                                );
                            }
                            return (
                                <Link href={href} key={label}>
                                    <img src={`/uploads/2026/07/${icon}`} alt="" />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="dayal-header-main" onMouseLeave={() => setShopOpen(false)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setShopOpen(false); }}>
                <div className="dayal-header-container dayal-header-main-inner">
                    <Link href="/" className="dayal-header-logo" aria-label="Dayal Sweets home">
                        <img
                            src="/uploads/2026/07/Frame-51-2-e1789985433447.png"
                            srcSet="/uploads/2026/07/Frame-51-2-e1789985433447.png 1x, /uploads/2026/07/Frame-51-2-e1789985433447@2x.png 2x"
                            alt="Dayal Sweets"
                            width="254"
                            height="64"
                        />
                    </Link>
                    <nav className={`dayal-header-nav ${mobileOpen ? 'is-open' : ''}`} aria-label="Main navigation">
                        <Link href="/" className={`dayal-header-link${currentPath === '/' ? ' is-active' : ''}`} aria-current={currentPath === '/' ? 'page' : undefined} onClick={closeMobileMenu}><span>Home</span></Link>
                        <div ref={shopNavigationRef} className="dayal-header-shop" onMouseEnter={openShopMenu}>
                            <div className="dayal-header-shop-controls">
                                <Link href="/shop/" className={`dayal-header-link${shopActive ? ' is-active' : ''}`} aria-current={currentPath === '/shop' ? 'page' : undefined} onClick={closeMobileMenu}><span>Shop</span></Link>
                                <button className="dayal-header-shop-trigger" type="button" aria-label="Toggle Shop categories" aria-expanded={shopOpen} aria-controls="dayal-shop-menu" onClick={toggleShopMenu} onFocus={openShopMenu}><svg className="elementskit-submenu-indicator ekit-svg-icon icon-down-arrow1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="14" height="14" aria-hidden="true"><path d="M31.582 8.495c-0.578-0.613-1.544-0.635-2.153-0.059l-13.43 12.723-13.428-12.723c-0.61-0.578-1.574-0.553-2.153 0.059-0.579 0.611-0.553 1.576 0.058 2.155l14.477 13.715c0.293 0.277 0.67 0.418 1.047 0.418s0.756-0.14 1.048-0.418l14.477-13.715c0.611-0.579 0.637-1.544 0.058-2.155z" fill="currentColor" /></svg></button>
                            </div>
                            {shopOpen && <div className="dayal-header-mega-menu" id="dayal-shop-menu">
                                <div className="dayal-header-mega-menu-inner">
                                    <div className="dayal-header-mega-category-area">
                                        <div className="dayal-header-mega-columns">
                                            {shopCategories.map((category) => <section className={`dayal-header-mega-category${openShopCategory === category.title ? ' is-expanded' : ''}`} key={category.title}>
                                                <h3><button type="button" aria-expanded={openShopCategory === category.title} onClick={() => setOpenShopCategory((open) => open === category.title ? null : category.title)}><img src={`/uploads/2026/07/${category.icon}`} alt="" loading="lazy" />{category.title}<ChevronDown size={14} aria-hidden="true" /></button></h3>
                                                <ul>
                                                    {category.products.map(([label, slug]) => <li key={slug}><Link href={`/product/${slug}/`} onClick={() => { setShopOpen(false); closeMobileMenu(); }}>{label}</Link></li>)}
                                                    <li className="dayal-header-mega-view-all"><Link href={category.all} onClick={() => { setShopOpen(false); closeMobileMenu(); }}>{category.allLabel}</Link></li>
                                                </ul>
                                            </section>)}
                                        </div>
                                        <div className="dayal-header-mega-shortcuts"><div className="dayal-header-mega-shortcuts-inner">{shopShortcuts.map(([label, image]) => <div className="dayal-header-mega-shortcut" key={label}><img src={`/uploads/2026/07/${image}`} alt="" loading="lazy" /><span>{label}</span></div>)}</div></div>
                                    </div>
                                    <aside className="dayal-header-mega-promo">
                                        <h3>Crafted <span>For Every Celebration</span></h3>
                                        <p>Premium gift boxes crafted with love, packed with the finest ingredients.</p>
                                        <Link href="/gifting" onClick={() => { setShopOpen(false); closeMobileMenu(); }}>Explore Gifting <img src="/uploads/2026/07/Icon.svg" alt="" /></Link>
                                        <img className="dayal-header-mega-promo-image" src="/uploads/2026/07/image-220.png" alt="Dayal Sweets celebration gift box" loading="lazy" />
                                    </aside>
                                </div>
                            </div>}
                        </div>
                        {navItems.map(([label, href]) => {
                            const trimmedHref = href.replace(/\/+$/, '');
                            const active = currentPath === trimmedHref || (trimmedHref === '/dining' && currentPath === '/dinning');
                            return <Link key={label} className={`dayal-header-link${active ? ' is-active' : ''}`} href={href} aria-current={active ? 'page' : undefined} onClick={closeMobileMenu}><span>{label}</span></Link>;
                        })}
                    </nav>
                    <button
                        className="dayal-header-toggle"
                        type="button"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? (
                            <X size={30} strokeWidth={2.2} />
                        ) : (
                            <svg
                                className="ekit-menu-icon ekit-svg-icon icon-burger-menu"
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M0 18.294h32v-2.563h-32v2.563zM11.519 25.975h20.481v-2.563h-20.481v2.563zM6.4 8.056v2.563h25.6v-2.563h-25.6z" />
                            </svg>
                        )}
                    </button>
                    <div className="dayal-header-actions">
                        <div className="dayal-header-icons">
                            <button className="dayal-header-search-trigger" type="button" aria-label="Search Products" onClick={() => setSearchOpen(true)}><Search size={20} strokeWidth={1.8} aria-hidden="true" /></button>
                            {user ? (
                                <div className="dayal-header-user-wrapper" ref={userMenuRef}>
                                    <button
                                        type="button"
                                        className={`dayal-header-avatar-btn ${userMenuOpen ? 'is-active' : ''}`}
                                        onClick={() => setUserMenuOpen((prev) => !prev)}
                                        aria-expanded={userMenuOpen}
                                        aria-label={`Open account menu for ${user.name}`}
                                        title={`${user.name} (${user.email})`}
                                    >
                                        <span className="dayal-header-avatar-text">{userInitial}</span>
                                    </button>

                                    {userMenuOpen && (
                                        <div className="dayal-header-dropdown" role="menu">
                                            <div className="dayal-dropdown-header">
                                                <div className="dayal-dropdown-user-info">
                                                    <div className="dayal-dropdown-avatar-badge">
                                                        {userInitial}
                                                    </div>
                                                    <div className="dayal-dropdown-text-details">
                                                        <div className="dayal-dropdown-name" title={user.name}>
                                                            {user.name}
                                                        </div>
                                                        <div className="dayal-dropdown-email" title={user.email}>
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="dayal-dropdown-badge-row">
                                                    <span className={`dayal-role-badge ${isAdmin ? 'dayal-role-badge--admin' : 'dayal-role-badge--customer'}`}>
                                                        {isAdmin ? 'Administrator' : 'Customer Account'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="dayal-dropdown-body">
                                                <Link
                                                    href={dashboardUrl}
                                                    className="dayal-dropdown-item"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <span className="dayal-dropdown-icon-box">
                                                        <LayoutDashboard size={15} />
                                                    </span>
                                                    <div className="dayal-dropdown-item-content">
                                                        <span className="dayal-dropdown-item-title">Dashboard</span>
                                                        <span className="dayal-dropdown-item-desc">
                                                            {isAdmin ? 'Store & catalog controls' : 'Orders & items tracking'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={ordersUrl}
                                                    className="dayal-dropdown-item"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <span className="dayal-dropdown-icon-box">
                                                        <Package size={15} />
                                                    </span>
                                                    <div className="dayal-dropdown-item-content">
                                                        <span className="dayal-dropdown-item-title">
                                                            {isAdmin ? 'All Orders' : 'My Orders & Items'}
                                                        </span>
                                                        <span className="dayal-dropdown-item-desc">
                                                            {isAdmin ? 'Manage kitchen & dispatch' : 'Purchased items & status'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {!isAdmin && (
                                                    <Link
                                                        href="/customer/addresses"
                                                        className="dayal-dropdown-item"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <span className="dayal-dropdown-icon-box">
                                                            <MapPin size={15} />
                                                        </span>
                                                        <div className="dayal-dropdown-item-content">
                                                            <span className="dayal-dropdown-item-title">Saved Addresses</span>
                                                            <span className="dayal-dropdown-item-desc">Shipping & billing details</span>
                                                        </div>
                                                    </Link>
                                                )}

                                                <Link
                                                    href={accountUrl}
                                                    className="dayal-dropdown-item"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <span className="dayal-dropdown-icon-box">
                                                        <UserRound size={15} />
                                                    </span>
                                                    <div className="dayal-dropdown-item-content">
                                                        <span className="dayal-dropdown-item-title">Account Details</span>
                                                        <span className="dayal-dropdown-item-desc">
                                                            {isAdmin ? 'Store profile & security' : 'Profile & password settings'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                <div className="dayal-dropdown-divider" />

                                                <button
                                                    type="button"
                                                    className="dayal-dropdown-item dayal-dropdown-item--logout"
                                                    onClick={() => {
                                                        setUserMenuOpen(false);
                                                        setLogoutModalOpen(true);
                                                    }}
                                                >
                                                    <span className="dayal-dropdown-icon-box dayal-dropdown-icon-box--logout">
                                                        <LogOut size={15} />
                                                    </span>
                                                    <div className="dayal-dropdown-item-content">
                                                        <span className="dayal-dropdown-item-title">Sign Out</span>
                                                        <span className="dayal-dropdown-item-desc">End your active session</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="dayal-header-account"
                                    aria-label="Login or create account"
                                    title="Sign In / Register"
                                >
                                    <UserRound size={20} strokeWidth={1.8} aria-hidden="true" />
                                </Link>
                            )}
                            <button
                                type="button"
                                className="dayal-header-cart"
                                aria-label={`View cart, ${cartCount} items`}
                                onClick={openCart}
                            >
                                <ShoppingBag size={20} strokeWidth={1.8} aria-hidden="true" />
                                <span className="dayal-header-cart-count" aria-live="polite">{cartCount}</span>
                            </button>
                        </div>
                        <Link className="dayal-header-order" href="/shop">Order Now</Link>
                    </div>
                </div>
                {searchOpen && <div className="dayal-search-modal-overlay" role="presentation" onClick={() => setSearchOpen(false)}>
                    <section className="dayal-search-modal" role="dialog" aria-modal="true" aria-labelledby="dayal-search-title" onClick={(event) => event.stopPropagation()}>
                        <button className="dayal-search-modal-close" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>×</button>
                        <header className="dayal-search-modal-header">
                            <strong id="dayal-search-title">Search Our Collection</strong>
                            <p>Find your favorite sweets, savouries &amp; festive gifts</p>
                        </header>
                        <form action="/products/" method="get" className="dayal-search-modal-form">
                            <input type="hidden" name="post_type" value="product" />
                            <div className="dayal-search-modal-input-wrapper">
                                <Search size={20} aria-hidden="true" />
                                <input type="search" name="s" placeholder="Search sweets, snacks, gifts..." aria-label="Search Our Collection" autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                                {searchTerm && <button className="dayal-search-modal-clear" type="button" aria-label="Clear search" onClick={() => setSearchTerm('')}>×</button>}
                                <button type="submit">Search</button>
                            </div>
                        </form>
                        <footer className="dayal-search-modal-footer">
                            <span>Press ESC to close</span>
                            <Link href="/shop" onClick={() => setSearchOpen(false)}>View All Products in Shop <span aria-hidden="true">→</span></Link>
                        </footer>
                    </section>
                </div>}
            </div>

            {/* Slide-over Cart Drawer */}
            <CartDrawer />

            {/* Logout Confirmation Modal */}
            <Modal show={logoutModalOpen} onClose={() => !loggingOut && setLogoutModalOpen(false)}>
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: '#FEE2E2',
                                border: '1px solid #FECACA',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#DC2626',
                                flexShrink: 0,
                            }}
                        >
                            <LogOut size={22} color="#DC2626" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0F172A', fontFamily: 'Cormorant Garamond, serif' }}>
                                Confirm Sign Out
                            </h3>
                            <span style={{ fontSize: '12px', color: '#64748B' }}>
                                Dayal Sweets Active Session
                            </span>
                        </div>
                    </div>

                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                        Are you sure you want to sign out, <strong>{user?.name}</strong>? Any items in your active shopping bag and addresses will remain saved for your next visit.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={() => setLogoutModalOpen(false)}
                            className="dayal-btn dayal-btn--outline dayal-btn--sm"
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={loggingOut}
                            onClick={handleConfirmLogout}
                            className="dayal-btn dayal-btn--primary dayal-btn--sm"
                            style={{
                                padding: '8px 18px',
                                fontSize: '13px',
                                background: '#DC2626',
                                borderColor: '#DC2626',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            {loggingOut ? (
                                <span>Signing out...</span>
                            ) : (
                                <>
                                    <LogOut size={14} />
                                    <span>Sign Out</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </header>
    );
}
