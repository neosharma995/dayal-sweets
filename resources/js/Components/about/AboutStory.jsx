import React, { useState } from 'react';

/**
 * Section B: About Dayal – Our Story
 * Left: Sweets-making video poster with play button & interaction
 * Right: Eyebrow, Heading, and Detailed Story Copy
 */
export default function AboutStory() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="about-story-section">
            <div className="about-story-container">
                <div className="about-story-grid">
                    {/* Left Column: Video Poster & Interactive Player */}
                    <div className="about-story-media-wrap">
                        {isPlaying ? (
                            <video
                                src="/uploads/2026/07/dayal-sweets-showcase.mp4"
                                controls
                                autoPlay
                                className="about-story-video"
                            />
                        ) : (
                            <div
                                className="about-story-poster-wrap"
                                onClick={() => setIsPlaying(true)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setIsPlaying(true);
                                    }
                                }}
                                aria-label="Watch Dayal Sweets Story Video"
                            >
                                <img
                                    src="/uploads/2026/07/About-Outlet.png"
                                    alt="Dayal Sweets Kitchen & Outlet"
                                />
                                <div className="about-story-play-overlay">
                                    <div className="about-story-play-btn" aria-hidden="true">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <span className="about-story-play-label">
                                        WATCH OUR STORY
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Copy & Story */}
                    <div className="about-story-copy">
                        <div className="about-story-eyebrow" aria-hidden="true">
                            <span className="about-story-divider" />
                            <span className="about-story-eyebrow-text">About Dayal Sweets</span>
                            <span className="about-story-divider" />
                        </div>

                        <h2 className="about-story-title">
                            The Story Behind <br />
                            <span className="rt-span-color">Every Sweet</span>
                        </h2>

                        <p className="about-story-p1">
                            Welcome to Dayal Sweets – where every bite tells a story of{' '}
                            <span className="rt-span-color">tradition, purity, and love.</span>
                            <br />
                            For years, we have been serving a delightful range of authentic Indian sweets,
                            snacks, and meals, made with the finest ingredients and a whole lot of passion.
                            From the soft and juicy Rasgullas, rich Kaju Katli, to our flavorful Chole
                            Bhature and refreshing Lassi, everything is prepared fresh every day to bring
                            you the real taste of India.
                        </p>

                        <p className="about-story-p2">
                            Our goal is simple — to make your moments sweeter. Whether it's a family gathering,
                            festive celebration, or just an evening craving, we make sure every customer leaves
                            with a smile (and a box of happiness!).
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
