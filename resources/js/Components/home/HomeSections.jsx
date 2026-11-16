import { useEffect, useRef, useState } from 'react';

const trustItems = [
    ['Since 1962', '60+ Years of Tradition', 'Frame-34.svg'],
    ['Fresh Ingredients', 'Finest Quality Ingredients', 'Frame-34-1.svg'],
    ['Hygienic Preparation', 'Prepared With Care', 'Frame-34-2.svg'],
    ['Fast Delivery', 'Fresh To Your Doorstep', 'Frame-34-3.svg'],
];

const productCategories = [
    { name: 'Sweets', slug: 'sweets', description: 'Traditional sweet made with pure love and purity', image: '/uploads/2026/07/image-62.png' },
    { name: 'South Indian', slug: 'south-indian', description: 'Authentic Flavors, Southern Culinary Delights', image: '/uploads/2026/09/39de7fca-c160-4487-91ff-d2fe87b868cb.png' },
    { name: 'Snacks', slug: 'snacks', description: 'Hot, crispy and perfect to satisfy cravings', image: '/uploads/2026/07/image-58.png' },
    { name: 'North Indian', slug: 'north-indian', description: 'Rich Flavors, Timeless Traditions', image: '/uploads/2026/09/40acb6a2-6bfe-4f5f-b741-4fa56207df16.png' },
    { name: 'Namkeen', slug: 'namkeen', description: 'Crispy, crunchy and full of flavour', image: '/uploads/2026/07/d9d5fb317e661ab4dd3c92f437cdeafd61cbe426.webp' },
    { name: 'Bakery', slug: 'bakery', description: 'Freshly baked delights for every mood', image: '/uploads/2026/07/image-59.png' },
    { name: 'Beverages', slug: 'beverages', description: 'Refreshing drinks crafted to quench your thirst and complement every meal.', image: '/uploads/2026/07/images__1_-removebg-preview.png' },
    { name: 'Best Seller', slug: 'best-seller', description: 'Customer favorites loved for their exceptional taste and quality.', image: '/uploads/woocommerce-placeholder.webp' },
    { name: 'Gift hampers', slug: 'gift-hampers', description: 'Thoughtfully Curated Gifts for Every Occasion', image: '/uploads/2026/08/Gift-Hamper-img.png' },
    { name: 'Himachali Special', slug: 'himachali-special', description: 'Authentic Himachali Flavors, Made with Love', image: '/uploads/2026/09/c18eaaf3-39b9-4392-9f9a-0c9f0dafec86.png' },
    { name: 'Chinese', slug: 'chinese', description: 'Delicious Flavors, Asian-Inspired Delights', image: '/uploads/2026/09/a4a43e59-a217-42d7-8117-5f654e1660fd.png' },
    { name: 'Desserts', slug: 'desserts', description: 'Sweet Treats, Pure Happiness', image: '/uploads/2026/09/310f8065-fcb6-4b1f-ad85-2d3ec7b64a70.png' },
];

function CategorySlider() {
    const viewportRef = useRef(null);
    const trackRef = useRef(null);
    const progressTrackRef = useRef(null);
    const dragRef = useRef(null);
    const progressDragRef = useRef(null);
    const [progress, setProgress] = useState({ width: 0, left: 0, enabled: false, atStart: true, atEnd: true });

    useEffect(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return undefined;

        const refresh = () => {
            const scrollable = track.scrollWidth - viewport.clientWidth;
            const visibleRatio = track.scrollWidth ? viewport.clientWidth / track.scrollWidth : 1;
            const progressWidth = progressTrackRef.current?.clientWidth ?? 0;
            const thumbWidth = Math.max(progressWidth * visibleRatio, 30);
            const progressRatio = scrollable > 0 ? viewport.scrollLeft / scrollable : 0;
            setProgress({
                width: scrollable > 0 ? thumbWidth : 0,
                left: scrollable > 0 ? progressRatio * (progressWidth - thumbWidth) : 0,
                enabled: scrollable > 2,
                atStart: viewport.scrollLeft <= 2,
                atEnd: viewport.scrollLeft + viewport.clientWidth >= track.scrollWidth - 2,
            });
        };

        refresh();
        viewport.addEventListener('scroll', refresh, { passive: true });
        window.addEventListener('resize', refresh);
        window.addEventListener('load', refresh);
        const observer = new ResizeObserver(refresh);
        observer.observe(viewport);
        observer.observe(track);
        if (progressTrackRef.current) observer.observe(progressTrackRef.current);

        const moveThumb = (event) => {
            const drag = progressDragRef.current;
            if (!drag) return;
            const x = event.touches?.[0]?.pageX ?? event.pageX;
            const scrollable = track.scrollWidth - viewport.clientWidth;
            const progressWidth = progressTrackRef.current?.clientWidth ?? 0;
            const visibleRatio = track.scrollWidth ? viewport.clientWidth / track.scrollWidth : 1;
            const thumbWidth = Math.max(progressWidth * visibleRatio, 30);
            const maxThumbLeft = progressWidth - thumbWidth;
            if (maxThumbLeft <= 0) return;
            viewport.scrollLeft = drag.scrollLeft + ((x - drag.x) / maxThumbLeft) * scrollable;
        };
        const stopThumbDrag = () => {
            if (!progressDragRef.current) return;
            progressDragRef.current = null;
            document.body.style.userSelect = '';
        };
        document.addEventListener('mousemove', moveThumb);
        document.addEventListener('mouseup', stopThumbDrag);
        document.addEventListener('touchmove', moveThumb, { passive: true });
        document.addEventListener('touchend', stopThumbDrag);

        return () => {
            viewport.removeEventListener('scroll', refresh);
            window.removeEventListener('resize', refresh);
            window.removeEventListener('load', refresh);
            document.removeEventListener('mousemove', moveThumb);
            document.removeEventListener('mouseup', stopThumbDrag);
            document.removeEventListener('touchmove', moveThumb);
            document.removeEventListener('touchend', stopThumbDrag);
            observer.disconnect();
        };
    }, [progress.enabled]);

    const scrollByCard = (direction) => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        const card = track?.querySelector('.dayal-category-card');
        if (!viewport || !track || !card) return;
        const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
        viewport.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    };

    const handleMouseDown = (event) => {
        if (event.button !== 0) return;
        const viewport = viewportRef.current;
        dragRef.current = { x: event.pageX - viewport.offsetLeft, left: viewport.scrollLeft };
        viewport.style.scrollBehavior = 'auto';
        viewport.style.cursor = 'grabbing';
    };
    const handleMouseMove = (event) => {
        if (!dragRef.current) return;
        event.preventDefault();
        const viewport = viewportRef.current;
        const x = event.pageX - viewport.offsetLeft;
        viewport.scrollLeft = dragRef.current.left - (x - dragRef.current.x) * 1.5;
    };
    const stopMouseDrag = () => {
        if (!dragRef.current || !viewportRef.current) return;
        dragRef.current = null;
        viewportRef.current.style.cursor = '';
        viewportRef.current.style.scrollBehavior = 'smooth';
    };
    const startThumbDrag = (event) => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const x = event.touches?.[0]?.pageX ?? event.pageX;
        progressDragRef.current = { x, scrollLeft: viewport.scrollLeft };
        document.body.style.userSelect = 'none';
    };

    return (
        <section className="dayal-home-category" aria-label="Shop by category">
            <img className="dayal-home-category-decoration" src="/uploads/2026/07/image-48-1.png" alt="" />
            <header className="dayal-home-category-heading">
                <div><i aria-hidden="true" /><p>what would you like today</p><i aria-hidden="true" /></div>
                <span aria-hidden="true">DELIGHTS</span>
            </header>
            <div className="dayal-home-category-widget">
                <div className="dayal-category-wrapper">
                    <div
                        className="dayal-category-viewport"
                        ref={viewportRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={stopMouseDrag}
                        onMouseLeave={stopMouseDrag}
                    >
                        <div className="dayal-category-track" ref={trackRef}>
                            {productCategories.map((category) => (
                                <article className="dayal-category-card" key={category.slug}>
                                    <a className="dayal-category-image" href={`/product-category/${category.slug}/`}>
                                        <img src={category.image} alt={category.name} loading="lazy" draggable="false" />
                                    </a>
                                    <div className="dayal-category-diamond" aria-hidden="true"><img src="/uploads/2026/08/flower.png" alt="" /></div>
                                    <h3>{category.name}</h3>
                                    <p>{category.description}</p>
                                    <a className="dayal-category-link" href={`/product-category/${category.slug}/`}>
                                        Order Now <img src="/uploads/2026/07/Icon-4.png" alt="" />
                                    </a>
                                </article>
                            ))}
                        </div>
                    </div>
                    {progress.enabled && <div className="dayal-category-controls">
                        <button type="button" aria-label="Previous categories" className={progress.atStart ? 'is-disabled' : ''} onClick={() => scrollByCard(-1)}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="dayal-category-progress" ref={progressTrackRef}><span onMouseDown={startThumbDrag} onTouchStart={startThumbDrag} style={{ width: `${progress.width}px`, left: `${progress.left}px` }} /></div>
                        <button type="button" aria-label="Next categories" className={progress.atEnd ? 'is-disabled' : ''} onClick={() => scrollByCard(1)}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>}
                </div>
            </div>
        </section>
    );
}

const processSteps = [
    {
        number: '01',
        image: 'Frame-81.svg',
        title: 'Fresh Milk Selection',
        description: 'Fresh milk sourced daily from trusted farms. Carefully selected for purity and richness.',
    },
    {
        number: '02',
        image: 'image-196.svg',
        title: 'Traditional Preparation',
        description: 'Time-honoured recipes passed through generations. Prepared by skilled halwais with dedication.',
    },
    {
        number: '03',
        image: 'image-197.svg',
        title: 'Slow Cooking Process',
        description: 'Slow-cooked to develop rich flavour and perfect texture. Patience and tradition bring every batch to life.',
    },
    {
        number: '04',
        image: 'image-198.svg',
        title: 'Quality & Hygiene',
        description: 'Every sweet is carefully inspected for quality and freshness. Prepared under strict hygiene standards.',
    },
    {
        number: '05',
        image: 'image-199.svg',
        title: 'Packaging & Delivery',
        description: 'Packed with care to preserve taste, freshness and quality. Ready to delight every celebration.',
    },
];

const heroCommitments = [
    ['Fast Delivery', 'Container-4.svg'],
    ['Trusted by Thousands', 'Container-5.svg'],
    ['Pure & Fresh', 'Container-6.svg'],
    ['Hygienic Kitchen', 'Container-7.svg'],
];

export function HeroCommitments() {
    return (
        <div className="dayal-home-hero-line" aria-label="Dayal Sweets service qualities">
            {heroCommitments.map(([label, icon]) => (
                <div className="dayal-home-hero-line-item" key={label}>
                    <img src={`/uploads/2026/07/${icon}`} alt="" />
                    <span>{label}</span>
                </div>
            ))}
        </div>
    );
}

const launchBanners = [
    {
        id: 'blue-bottle',
        eyebrow: 'New Arrival',
        title: 'Blue Bottle',
        subtitle: 'Pure Himalayan Drinking Water',
        description: 'Naturally purified and enriched with essential minerals for a refreshing and healthy lifestyle.',
        points: ['Available in 500ml & 1L', 'Chilled & Ready to Drink', 'Just at ₹30', 'Pure & safe ingredients', 'Fresh From Himalayas', 'No Added Preservatives', 'Trusted Quality'],
        background: '/uploads/2026/08/Image-2-e1787054923923.png',
        product: '/uploads/2026/09/a351fcd017b6d21208fd17488591d4da0a6e675b-e1789536890762.png',
        mobileProduct: '/uploads/2026/07/image-87-1.avif',
        mobileBackground: '/uploads/2026/08/Image-2-e1787054923923.png',
        button: 'Shop Now',
        url: '/shop',
    },
    {
        id: 'blueberry-cake',
        eyebrow: 'New Arrival',
        title: 'Blueberry Cake',
        subtitle: 'Crafted For Every Celebration',
        description: 'A rich blend of creamy cheesecake and handpicked blueberries, finished with a smooth, indulgent texture.',
        points: ['Real Blueberries', 'Soft & Rich Cream', 'No Added Preservatives', 'Trusted Quality'],
        background: '/uploads/2026/08/Image-3-e1787054985167.png',
        product: '/uploads/2026/09/318d6fa899e1eae6f78c3e1dfe6897110110cec2-e1789538227876.png',
        mobileProduct: '/uploads/2026/09/cake-mobile.png',
        mobileBackground: '/uploads/2026/09/cake-image.png',
        button: 'Order Now',
        url: '/shop',
    },
];

const bestSellers = [
    ['Marwadi Ladoo', 'SWEETS', 'Traditional Rajasthani Marwadi Ladoo prepared with pure desi ghee and premium ingredients, offering an authentic rich taste in every bite.', 'Marwadi-ladoo.avif', 'From ₹120.00', ['250g', '500g', '1kg']],
    ['Brownies', 'BAKERY', 'Rich, moist, and fudgy brownies made with premium chocolate, freshly baked to deliver an irresistible treat for every chocolate lover.', 'Brownies.jpg', 'From ₹70.00', ['1 Piece', '2 Pieces', '4 Pieces']],
    ['Office Tea Combo', 'UNCATEGORIZED', 'Brighten up your workday with our Office Tea Combo — a perfect pairing of refreshing tea and delicious snacks.', 'Office-Tea-Combo.png', '₹150.00', []],
    ['Donuts', 'BAKERY', 'Soft, fluffy, and freshly baked donuts topped with delicious glazes and delightful flavors, making them the perfect treat for every occasion.', 'Donuts.jpg', 'From ₹60.00', ['1 Piece', '2 Pieces', '4 Pieces']],
    ['Engagement Combo', 'COMBO', 'Celebrate your special day with our Engagement Combo, featuring a delightful selection of delicious favorites perfect for your celebration.', 'Engagement-Combo.png', '₹250.00', []],
    ['Birthday Party Combo', 'COMBO', 'Make every birthday celebration extra special with our Birthday Party Combo! A delicious selection of crowd-pleasing favorites.', 'Birthday-Party-Combo.png', '₹200.00', []],
    ['Puff Patties', 'BAKERY', 'Crispy, flaky Puff Patties filled with a delicious savory stuffing, freshly baked to golden perfection for a flavorful and satisfying bite.', 'Puff-Patties.jpg', 'From ₹40.00', ['1 Piece', '2 Pieces', '4 Pieces']],
    ['Garlic Bread', 'BAKERY', 'Freshly baked Garlic Bread with a crispy crust, soft center, buttery garlic, and aromatic herbs, perfect as a savory snack.', 'Garlic-Bread.jpg', 'From ₹80.00', ['2 Pieces', '4 Pieces', '6 Pieces']],
    ['Cakes', 'BAKERY', 'Freshly baked cakes crafted with premium ingredients, offering a soft texture, rich flavor, and perfect sweetness for birthdays.', 'Cakes.jpg', 'From ₹450.00', ['500g', '1kg', '2kg']],
    ['Dhokla', 'SNACKS', 'Soft, fluffy, and freshly prepared Dhokla made from premium gram flour, offering a light, healthy, and flavorful snack.', 'Dhokla.jpg', 'From ₹70.00', ['250g', '500g', '1kg']],
];

const serviceCards = [
    { title: 'Festival Gifting', description: 'Luxury sweet hampers, festive gift boxes, and curated collections crafted to make every celebration memorable.', points: ['Premium Gift Hampers', 'Corporate Gifting', 'Custom Packaging', 'Bulk Festival Orders'], action: 'Explore Collection', href: '/shop', image: '85febe95b2f68483bbe3d2740da348076827bcea.png', background: '1-1.png', icon: 'gift' },
    { title: 'Catering', description: 'From intimate family functions to grand celebrations, enjoy authentic flavours and impeccable service.', points: ['Live Food Counters', 'Wedding Catering', 'Corporate Events', 'Customized Menus'], action: 'Request Quote', href: '/contact-us', image: 'cafbdb05b860e369184358b6c53ff29ec6bd4ef1.png', background: '2.png', icon: 'serving' },
    { title: 'Wedding', description: 'Beautifully curated mithai collections, luxury packaging, and bespoke wedding gifting solutions.', points: ['Premium Wedding Sweets', 'Luxury Packaging', 'Bulk Orders', 'Timely Delivery'], action: 'Request Quote', href: '/contact-us', image: '1e042ce16b4adfb2ec672c88677de25f8e161238.png', background: '3.png', icon: 'wedding' },
    { title: 'Birthday', description: 'Designer cakes, party desserts, and handcrafted treats made to make birthdays unforgettable.', points: ['Custom Celebration Cakes', 'Theme-Based Desserts', 'Fresh Daily Preparation', 'Doorstep Delivery'], action: 'Order Cakes', href: '/shop', image: '1208e29127df94840c76deb4a669846d282b099a.png', background: '4.png', icon: 'cake' },
];

const videos = [
    ['Festive Sweet Preparation', 'Fresh ingredients and traditional recipes come together for every celebration.'],
    ['Traditional Sweet Making', 'Time-honored techniques bring authentic Dayal sweets to life.'],
    ['Diwali festival', 'Enjoying purchasing with friends and colleagues in Dayal Sweets.'],
    ['Festival Gift Platters', 'Bespoke gifting for every celebration.'],
    ['Jalebi Frying Fresh', 'Fried fresh every morning, served warm.'],
    ['Khoya Pedas Magic', '100% desi ghee, pure milk, no preservatives.'],
    ['Spounch', 'Each peda shaped by hand, one at a time.'],
    ['Slow Cooking Tradition', 'Traditional wood-fire methods since 1952.'],
];

const outlets = [
    { name: 'Amb', phone: '+91 80627 57395', image: '/uploads/2026/08/Amb-Outlet.png', map: 'https://www.google.com/maps/search/?api=1&query=Dayal+Sweets+Amb' },
    { name: 'Hamirpur', address: 'Dayal Sweets- Gandhi Chowk, NH-70, Pratap Nagar, Hamirpur, Himachal Pradesh 177005', phone: '+91 80627 57395', image: '/uploads/2026/08/Hamirpur-Outlet.png', map: 'https://maps.app.goo.gl/NP2CS4WAhi5xYh546' },
    { name: 'Una', address: 'Dayal Sweets-Nangal Road, Una, Durga Colony, Himachal Pradesh 174303', phone: '+91 80627 57395', image: '/uploads/2026/07/About-Outlet.png', map: 'https://maps.app.goo.gl/NWcR3Mdg264m6SnY7' },
    { name: 'Una (Bus Stand)', address: 'Dayal Sweets- Una - Hamirpur Rd, opp. Bus Stand, Una, Himachal Pradesh 174303', phone: '+91 80627 57395', image: '/uploads/2026/08/Nangal-Road-Una-Outlet.png', map: 'https://maps.app.goo.gl/etQYvcQMNKH1KekE8' },
    { name: 'Palampur', image: '/uploads/2026/09/palampoor-stor.png', comingSoon: true },
];

function SectionHeading({ eyebrow, children }) {
    return <header className="dayal-home-section-heading"><p>{eyebrow}</p><h2>{children}</h2></header>;
}

function BestSellers() {
    const filters = ['All', 'Bakery', 'Best Seller', 'Beverages', 'Chinese', 'Combo', 'Desserts', 'Gift hampers', 'Himachali Special', 'Namkeen', 'North Indian', 'Snacks', 'South Indian', 'Sweets'];
    const [selected, setSelected] = useState('All');
    const visibleProducts = selected === 'All' || selected === 'Best Seller'
        ? bestSellers
        : bestSellers.filter((product) => product[1].toLowerCase() === selected.toLowerCase());
    return <section className="dayal-home-bestsellers">
        <div className="dayal-home-bestsellers-inner">
            <header className="dayal-home-section-heading dayal-home-bestsellers-heading"><p>Most Loved by Our Customers</p><h2>Our Best <span>Sellers</span></h2></header>
            <div className="dayal-home-product-filters" aria-label="Product categories">{filters.map((filter) => <button type="button" className={selected === filter ? 'is-active' : ''} key={filter} onClick={() => setSelected(filter)}>{filter}</button>)}</div>
            <div className="dayal-home-product-grid">{visibleProducts.map(([name, category, description, image, price, sizes]) => <article className="dayal-home-product-card" key={name}>
                <div className="dayal-home-product-image"><img src={`/uploads/2026/${image === 'Office-Tea-Combo.png' || image === 'Engagement-Combo.png' || image === 'Birthday-Party-Combo.png' ? '09' : '07'}/${image}`} alt={name} loading="lazy" /><span>Best Seller</span></div>
                <div className="dayal-home-product-info"><small>{category}</small><h3>{name}</h3><p>{description}</p>{sizes.length > 0 && <div className="dayal-home-product-sizes">{sizes.map((size) => <span key={size}>{size}</span>)}</div>}<div className="dayal-home-product-price"><strong>{price}</strong><a href="/shop" aria-label={`View ${name}`}>↗</a></div></div>
            </article>)}</div>
            <a className="dayal-home-view-all" href="/shop">View All <span aria-hidden="true">→</span></a>
        </div>
    </section>;
}

function SpecialServices() {
    return <section className="dayal-home-services"><div className="dayal-home-services-inner">
        <SectionHeading eyebrow="Our Support">Special <span>Services</span></SectionHeading>
        <p className="dayal-home-section-description">Every celebration deserves something extraordinary. Discover our signature services, crafted with timeless recipes, premium ingredients, and generations of sweet-making excellence.</p>
        <div className="dayal-home-services-grid">{serviceCards.map((service, index) => <article className={`dayal-home-service-card${index === 0 ? ' is-featured' : ''}`} style={{ backgroundImage: `url('/uploads/2026/07/${service.background}')` }} key={service.title}>
            <div className="dayal-home-service-copy"><h3>{service.title}</h3><p>{service.description}</p><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul><a href={service.href}>{service.action}<span aria-hidden="true">↗</span></a></div><img className="dayal-home-service-product" src={`/uploads/2026/07/${service.image}`} alt="" loading="lazy" />
        </article>)}</div>
    </div></section>;
}

function VideoGallery() {
    const slider = useRef(null);
    const [playing, setPlaying] = useState(null);
    const toggle = async (index) => {
        const items = slider.current?.querySelectorAll('video') ?? [];
        const video = items[index];
        if (!video) return;
        if (playing === index) { video.pause(); setPlaying(null); }
        else { items.forEach((item) => item.pause()); try { await video.play(); setPlaying(index); } catch { setPlaying(null); } }
    };
    return <section className="dayal-home-video"><div className="dayal-home-video-inner"><SectionHeading eyebrow="Watch the Making">The Art Behind<br /><span>Every Sweet Bite</span></SectionHeading><p className="dayal-home-section-description">From selecting the finest ingredients to handcrafted preparation and slow cooking, witness the journey that makes every Dayal sweet truly special.</p></div>
        <div className="dayal-home-video-slider" ref={slider}>{videos.map(([title, description], index) => <article className="dayal-home-video-card" key={title}><video src="/uploads/2026/07/dayal-sweets-showcase.mp4" muted loop playsInline preload="metadata" onClick={() => toggle(index)} /><button type="button" className={playing === index ? 'is-playing' : ''} aria-label={`${playing === index ? 'Pause' : 'Play'} ${title}`} onClick={() => toggle(index)}>▶</button><div><h3>{title}</h3><p>{description}</p></div></article>)}</div><div className="dayal-home-video-scroll"><span /></div>
    </section>;
}

function CustomerReviews() {
    return <section className="dayal-home-reviews"><img className="dayal-home-reviews-mascot" src="/uploads/2026/08/Halwai.png" alt="" /><div className="dayal-home-reviews-inner"><header><SectionHeading eyebrow="What They Say">Loved By <span>Thousands</span></SectionHeading><div className="dayal-home-google-rating"><strong>4.9</strong><img src="/uploads/2026/09/google-logo.png" alt="Google" /><span>★★★★★</span><small>Based on 3,200+ reviews</small></div></header><div className="dayal-home-review-layout"><article className="dayal-home-review-feature"><img className="dayal-home-quote" src="/uploads/2026/07/quote-up.png" alt="" /><img className="dayal-home-review-google" src="/uploads/2026/09/google-logo.png" alt="Google" /><blockquote>Dayal Sweets made our wedding reception extraordinary. The custom mithai trays were not only beautiful but absolutely divine in taste. Every guest complimented the sweets — we couldn't have asked for better.</blockquote><footer><strong>Ananya Sharma</strong><span>Una, HP</span><b>★★★★★</b></footer></article><div className="dayal-home-review-side">{[['Ananya Sharma', 'Wedding', 'Dayal Sweets made our wedding reception extraordinary. The custom mithai trays were not only beautiful but absolutely divine in taste.'], ['Priya Mehta', 'Regular Customer', 'The Kaju Katli is in a league of its own. I’ve tried mithai from across Himachal but nothing comes close to Dayal’s.'], ['Rajesh Verma', 'Corporate Gifting', 'We ordered corporate Diwali hampers for 200 employees. The presentation was impeccable, delivery was on time.']].map(([name, category, quote]) => <article key={name}><strong>{name}</strong><small>{category}</small><p>{quote}</p></article>)}</div></div></div></section>;
}

function PremiumOutlets() {
    return <section className="dayal-home-outlets"><div className="dayal-home-outlets-inner"><SectionHeading eyebrow="View Our Stores">Premium <span>Outlets</span></SectionHeading><p className="dayal-home-section-description">Visit our premium outlets across Himachal Pradesh and experience the authentic taste<br />of tradition, craftsmanship, and celebration.</p><div className="dayal-home-outlet-grid">{outlets.map((outlet) => <article className="dayal-home-outlet-card" key={outlet.name}><img src={outlet.image} alt={`${outlet.name} Dayal Sweets outlet`} loading="lazy" />{outlet.comingSoon ? <div className="dayal-home-outlet-info"><h3>{outlet.name}</h3><em>Opening Soon</em><p>Expected Opening<br /><strong>Coming Soon</strong></p><button type="button">Notify Me</button></div> : <div className="dayal-home-outlet-info"><h3>{outlet.name}</h3>{outlet.address && <p>{outlet.address}</p>}<p>{outlet.phone}</p><a href={outlet.map} target="_blank" rel="noreferrer">View Map ↗</a></div>}</article>)}</div><div className="dayal-home-franchise"><img src="/uploads/2026/07/Frame-51-1-1.png" alt="" /><div><small>Franchise Opportunities</small><h3>Own A Premium <span>Dayal Sweets Outlet</span></h3><p>With 60+ years of trust, premium products, and a loyal customer base, Dayal Sweets offers the perfect opportunity to build a successful business in your city.</p></div><a href="tel:+919876543210">Interested in Franchise<br /><strong>+91 98765 43210</strong></a><a href="https://wa.me/919876543210">WhatsApp us<br /><strong>+91 98765 43210</strong></a><a className="dayal-home-franchise-button" href="/franchise">Fill Your Details</a></div></div></section>;
}

function LaunchBanners() {
    return (
        <section className="dayal-home-launch" aria-label="New products">
            <div className="dayal-home-launch-inner">
                <header className="dayal-home-section-heading dayal-home-launch-heading">
                    <p>New Products</p>
                    <h2>Our New <span>Launch</span></h2>
                </header>
                <div className="dayal-home-launch-grid">
                    {launchBanners.map((banner) => (
                        <article className={`dayal-home-launch-card dayal-home-launch-card-${banner.id}`} key={banner.id}>
                            <picture className="dayal-home-launch-background">
                                <source media="(max-width: 767px)" srcSet={banner.mobileBackground} />
                                <img src={banner.background} alt="" />
                            </picture>
                            <div className="dayal-home-launch-copy">
                                <p className="dayal-home-launch-eyebrow">{banner.eyebrow}</p>
                                <h3>{banner.title}</h3>
                                <h4>{banner.subtitle}</h4>
                                <img className="dayal-home-launch-divider" src="/uploads/2026/07/Frame-99.png" alt="" />
                                <p className="dayal-home-launch-description">{banner.description}</p>
                                <ul>{banner.points.map((point) => <li key={point}>{point}</li>)}</ul>
                                <a href={banner.url}>{banner.button}<span aria-hidden="true">→</span></a>
                            </div>
                            <picture className="dayal-home-launch-product">
                                <source media="(max-width: 767px)" srcSet={banner.mobileProduct} />
                                <img src={banner.product} alt={banner.title} />
                            </picture>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function HomeSections() {
    return (
        <div className="dayal-home-sections">
            <CategorySlider />
            <LaunchBanners />
            <BestSellers />
            <section className="dayal-home-trust" aria-label="Dayal Sweets commitments">
                <div className="dayal-home-trust-inner dayal-home-trust-grid">
                    {trustItems.map(([title, description, icon]) => (
                        <article className="dayal-home-trust-item" key={title}>
                            <img src={`/uploads/2026/07/${icon}`} alt="" />
                            <div><strong>{title}</strong><span>{description}</span></div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="dayal-home-process">
                <div className="dayal-home-process-inner">
                    <header className="dayal-home-section-heading">
                        <p>Our Process</p>
                        <h2>From Fresh Ingredients to<br />Sweet Perfection</h2>
                    </header>
                    <ol className="dayal-home-process-grid">
                        {processSteps.map((step) => (
                            <li className="dayal-home-process-step" key={step.number}>
                                <img src={`/uploads/2026/07/${step.image}`} alt="" loading="lazy" />
                                <span className="dayal-home-process-number">Step {step.number}</span>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
            <SpecialServices />
            <VideoGallery />
            <CustomerReviews />
            <PremiumOutlets />
        </div>
    );
}
