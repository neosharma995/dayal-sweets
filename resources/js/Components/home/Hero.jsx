import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { heroSlides } from '@/data/heroSlides';

export default function Hero() {
    const [activeIndex, setActiveIndex] = useState(0);
    const slide = heroSlides[activeIndex];

    return (
        <section className="dayal-hero" aria-label="Featured sweets">
            <div className="dayal-hero-inner">
                <nav className="dayal-hero-pagination" aria-label="Choose featured slide">
                    {heroSlides.map((item, index) => (
                        <button key={item.id} type="button" aria-label={`Show slide ${index + 1}`} aria-current={activeIndex === index ? 'true' : undefined} className={activeIndex === index ? 'is-active' : ''} onClick={() => setActiveIndex(index)}>
                            {String(index + 1).padStart(2, '0')}
                        </button>
                    ))}
                </nav>
                <div className="dayal-hero-content" key={slide.id}>
                    <p className="dayal-hero-eyebrow">{slide.eyebrow}</p>
                    <h1 className="dayal-hero-title">
                        {slide.title.map((line, index) => <span key={`${slide.id}-${line}`} className={`dayal-hero-title-line dayal-hero-title-line-${index + 1}`}>{line}</span>)}
                    </h1>
                    <div className="dayal-hero-mobile-image"><img src={slide.image} alt={slide.imageAlt} /></div>
                    <p className="dayal-hero-description">{slide.description}</p>
                    <div className="dayal-hero-actions">
                        <a className="dayal-hero-button dayal-hero-button-primary" href={slide.primaryButton.url}>{slide.primaryButton.label}<ArrowRight size={14} strokeWidth={1.5} /></a>
                        <a className="dayal-hero-button dayal-hero-button-secondary" href={slide.secondaryButton.url}>{slide.secondaryButton.label}</a>
                    </div>
                </div>
                <div className="dayal-hero-product"><img src={slide.image} alt={slide.imageAlt} /></div>
                <aside className="dayal-hero-social" aria-label="Social media">
                    <span>Follow<br />Us</span>
                    <a href="https://instagram.com" aria-label="Instagram"><img src="/assets/social/instagram-outline.svg" alt="" /></a>
                    <a href="https://facebook.com" aria-label="Facebook"><img src="/assets/social/facebook-outline.svg" alt="" /></a>
                    <a href="https://youtube.com" aria-label="YouTube"><img src="/assets/social/youtube-outline.svg" alt="" /></a>
                </aside>
                <div className="dayal-hero-badge"><img src="/assets/images/Frame-11.png" alt="60+ years of sweet traditions" /></div>
            </div>
        </section>
    );
}
