import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { heroSlides } from '@/data/heroSlides';
import { HeroCommitments } from '@/Components/home/HomeSections';

export default function Hero() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(null);

    useEffect(() => {
        if (paused || heroSlides.length < 2) return undefined;

        const timer = window.setTimeout(() => {
            setActiveIndex((index) => (index + 1) % heroSlides.length);
        }, 6000);

        return () => window.clearTimeout(timer);
    }, [activeIndex, paused]);

    const goToSlide = (index) => setActiveIndex((index + heroSlides.length) % heroSlides.length);
    const handleTouchStart = (event) => { touchStartX.current = event.changedTouches[0]?.screenX ?? null; };
    const handleTouchEnd = (event) => {
        if (touchStartX.current === null) return;
        const distance = event.changedTouches[0].screenX - touchStartX.current;
        if (Math.abs(distance) >= 50) goToSlide(activeIndex + (distance < 0 ? 1 : -1));
        touchStartX.current = null;
    };

    return (
        <section className="dayal-hero" aria-label="Featured sweets">
            <div className="dayal-hero-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                {heroSlides.map((slide, slideIndex) => {
                    const active = slideIndex === activeIndex;

                    return <article className={`dayal-hero-slide${active ? ' is-active' : ''}`} key={slide.id} aria-hidden={!active}>
                        <div className="dayal-hero-inner">
                            <nav className="dayal-hero-pagination" aria-label="Choose featured slide">
                                {[0, 1, 2].map((offset) => {
                                    const index = (activeIndex + offset) % heroSlides.length;
                                    return <button key={`${slide.id}-${index}`} type="button" aria-label={`Show slide ${index + 1}`} aria-current={active && offset === 0 ? 'true' : undefined} className={active && offset === 0 ? 'is-active' : ''} onClick={() => goToSlide(index)}>
                                        <span>{String(index + 1).padStart(2, '0')}</span>
                                        {offset < 2 && <span className="dayal-hero-pagination-line" aria-hidden="true" />}
                                    </button>;
                                })}
                            </nav>
                            <div className="dayal-hero-content">
                                <p className="dayal-hero-eyebrow">{slide.eyebrow}</p>
                                <h1 className="dayal-hero-title">
                                    {slide.title.map((line, index) => <span key={`${slide.id}-${index}`} className={`dayal-hero-title-line dayal-hero-title-line-${index + 1}`}>{line}</span>)}
                                </h1>
                                <div className="dayal-hero-mobile-image"><img src={slide.image} alt={slide.imageAlt} /></div>
                                <p className="dayal-hero-description">{slide.description}</p>
                                <div className="dayal-hero-actions">
                                    <Link className="dayal-hero-button dayal-hero-button-primary" href={slide.primaryButton.url}>{slide.primaryButton.label}<svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true"><path d="M8.5 1L12.5 5M12.5 5L8.5 9M12.5 5H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
                                    <Link className="dayal-hero-button dayal-hero-button-secondary" href={slide.secondaryButton.url}>{slide.secondaryButton.label}</Link>
                                </div>
                            </div>
                            <div className="dayal-hero-product"><img src={slide.image} alt={slide.imageAlt} /></div>
                            <aside className="dayal-hero-social" aria-label="Social media">
                                <span>Follow Us</span>
                                <a href="https://www.instagram.com/dayalsweets/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><img src="/uploads/2026/07/brand-instagram.svg" alt="" /></a>
                                <a href="https://www.facebook.com/dayalsweets/" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><img src="/uploads/2026/07/brand-facebook.svg" alt="" /></a>
                                <a href="https://www.youtube.com/results?search_query=Dayal+Sweets" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><img src="/uploads/2026/07/brand-youtube.svg" alt="" /></a>
                            </aside>
                            <div className="dayal-hero-badge"><img src="/uploads/2026/07/Frame-11.png" alt="60+ years of sweet traditions" /></div>
                            <div className="dayal-hero-badge-mobile"><img src="/uploads/2026/07/Frame-11.png" alt="60+ years of sweet traditions" /></div>
                        </div>
                    </article>;
                })}
            </div>
            <div className="dayal-home-container">
                <HeroCommitments />
            </div>
        </section>
    );
}
