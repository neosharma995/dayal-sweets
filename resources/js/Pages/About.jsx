import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

const commitments = [
    ['Heritage Recipes', 'Formulas passed down through four generations, unchanged and uncompromised.'],
    ['Pure Ingredients', 'Only the finest milk, ghee, and dry fruits — sourced directly from trusted farms.'],
    ['Crafted with Care', 'Every piece shaped by hand, exactly as our founder taught us in 1962.'],
    ['Trusted Since 1962', 'Over six decades of sweetening celebrations across generations of families.'],
];

const milestones = [
    ['1950s', 'Humble Beginnings', 'A small tea stall in Una began a journey built on passion and hard work.'],
    ['1962', 'Dayal Sweets Founded', 'Dayal Sweets was established, bringing authentic Indian sweets to the community.'],
    ['1980s', 'Growing Trust', 'Growing customer trust inspired an expanded menu of sweets, snacks and traditional meals.'],
    ['2000s', 'Quality & Innovation'],
    ['2015', 'Expanding Outlets'],
    ['Today', 'A Legacy Continues'],
];

const collection = [
    ['Milk Cake', '/assets/wordpress/about/Milk-Cake.png', 'Patience caramelized into perfection'],
    ['Premium Bakery', '/assets/wordpress/about/Premium-Bakery-Sweet.png', 'Modern baking, timeless taste'],
    ['Palak Mathi', '/assets/wordpress/about/Palak-Mathi.png', 'Savory. Crisp. Unforgettable.'],
    ['Choco Cookies', '/assets/wordpress/about/Choco-Cookies.png', 'Every celebration, perfectly curated'],
];

export default function About() {
    return (
        <div className="dayal-site dayal-about">
            <Head title="About Us | Dayal Sweets" />
            <Header />
            <main>
                <nav className="dayal-about-breadcrumb dayal-about-container" aria-label="Breadcrumb">
                    <Link href="/">Home</Link><span aria-hidden="true">/</span><span>About Us</span>
                </nav>

                <section className="dayal-about-hero">
                    <div className="dayal-about-container dayal-about-hero-inner">
                        <div>
                            <p className="dayal-about-eyebrow">About Dayal</p>
                            <h1>Crafting Sweet Traditions Since 1962</h1>
                            <p>Over six decades of crafting authentic Indian sweets with premium ingredients, age-old recipes and a promise of purity.</p>
                        </div>
                        <img src="/assets/wordpress/about/image-48.png" alt="Decorative peacock feather" />
                    </div>
                </section>

                <section className="dayal-about-story dayal-about-container">
                    <div className="dayal-about-story-image">
                        <img src="/assets/wordpress/about/9d1a7fa1a155108c29d13f682f856fb91693ce3e-scaled.jpg" alt="Kaju Katli from the Dayal Sweets collection" />
                    </div>
                    <div className="dayal-about-story-copy">
                        <p className="dayal-about-eyebrow">About Dayal Sweets</p>
                        <h2>The Story Behind Every Sweet</h2>
                        <p>Welcome to Dayal Sweets – where every bite tells a story of tradition, purity, and love. For years, we have been serving a delightful range of authentic Indian sweets, snacks, and meals, made with the finest ingredients and a whole lot of passion. From the soft and juicy Rasgullas, rich Kaju Katli, to our flavorful Chole Bhature and refreshing Lassi, everything is prepared fresh every day to bring you the real taste of India.</p>
                        <p>Our goal is simple — to make your moments sweeter. Whether it's a family gathering, festive celebration, or just an evening craving, we make sure every customer leaves with a smile (and a box of happiness!).</p>
                    </div>
                </section>

                <section className="dayal-about-founder">
                    <div className="dayal-about-container dayal-about-founder-inner">
                        <div>
                            <p className="dayal-about-eyebrow">Founder’s Message</p>
                            <h2>A Legacy Built on Trust &amp; Tradition</h2>
                            <p>Our story began in the 90’s with a stunted tea stall in a very small town located in the valleys of Himachal named Una that only served tea and some snacks. Mr. Hardayal Chand Jatic, a laborious man and owner of that tea stall, worked tirelessly to earn his bread and butter, and serve the residents of Una.</p>
                            <p>After earning great admiration from the people of Una, he launched Dayal Sweets in 1962 which has become the first choice of mithai lovers in Himachal today.</p>
                            <h3>Sh. Hardayal Chand Jatic</h3>
                            <p>Founder &amp; Chairman, Dayal Sweets</p>
                        </div>
                        <img src="/assets/wordpress/about/Container-10.webp" alt="Sh. Hardayal Chand Jatic" />
                    </div>
                </section>

                <section className="dayal-about-commitments dayal-about-container">
                    <header className="dayal-about-section-heading">
                        <p className="dayal-about-eyebrow">Our Commitments</p>
                        <h2>Crafting Joy Since 1962 · Una</h2>
                    </header>
                    <div className="dayal-about-commitment-grid">
                        {commitments.map(([title, description]) => (
                            <article className="dayal-about-commitment" key={title}>
                                <h3>{title}</h3><p>{description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="dayal-about-journey">
                    <div className="dayal-about-container">
                        <header className="dayal-about-section-heading">
                            <p className="dayal-about-eyebrow">Our Journey</p>
                            <h2>From Small Shop to Generation Of Celebrations</h2>
                        </header>
                        <ol className="dayal-about-timeline">
                            {milestones.map(([year, title, description]) => (
                                <li key={year}>
                                    <span>{year}</span><h3>{title}</h3>{description && <p>{description}</p>}
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="dayal-about-collection dayal-about-container">
                    <header className="dayal-about-section-heading">
                        <p className="dayal-about-eyebrow">Our Premium Products</p>
                        <h2>The Signature Collection</h2>
                    </header>
                    <div className="dayal-about-product-grid">
                        {collection.map(([name, image, description]) => (
                            <article className="dayal-about-product" key={name}>
                                <img src={image} alt={name} /><h3>{name}</h3><p>{description}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
