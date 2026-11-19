import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * Opportunities Section Component
 * Matches Elementor Section 11 (c685845, 3e1a341, f3122af) 1:1
 */
export default function Opportunities({
    phone = '+91 98765 43210',
    phoneLink = 'tel:9198765 43210',
    whatsapp = '+91 98765 43210',
    whatsappLink = 'https://wa.me/919876543210',
    ctaText = 'Fill Your Details',
    ctaLink = '/franchise',
    logoSrc = '/uploads/2026/07/image-150-2.png',
}) {
    return (
        <section
            className="elementor-element elementor-element-31e0de3 dayal-opportunities-section"
            aria-label="Opportunities"
        >
            <div className="dayal-opportunities-container">
                <div className="elementor-element elementor-element-c685845 opportunities-card">
                    {/* Top Row: Logo + Headings/Text + Contact & CTA */}
                    <div className="elementor-element elementor-element-3e1a341 opportunities-section">
                        {/* Part 1: Logo */}
                        <div className="elementor-element elementor-element-ba7a76d opportunities-part-1">
                            <img
                                loading="lazy"
                                decoding="async"
                                width="101"
                                height="114"
                                src={logoSrc}
                                className="opportunities-logo-img"
                                alt="Dayal Sweets"
                            />
                        </div>

                        {/* Part 2: Headings & Description */}
                        <div className="elementor-element elementor-element-2a93d04 opportunities-part-2">
                            <div className="elementor-element elementor-element-624daf0 opportunities-heading-box">
                                <div className="elementor-element elementor-element-35cfd9b opportunities-eyebrow-container">
                                    <span className="opportunities-divider" aria-hidden="true" />
                                    <h3 className="elementor-heading-title opportunities-eyebrow">
                                        Franchise Opportunities
                                    </h3>
                                    <span className="opportunities-divider" aria-hidden="true" />
                                </div>
                                <div className="elementor-element elementor-element-21dbd17">
                                    <h2 className="elementor-heading-title opportunities-title">
                                        Own A Premium{' '}
                                        <span className="rt-span-color" style={{ fontWeight: 600 }}>
                                            Dayal Sweets Outlet
                                        </span>
                                    </h2>
                                </div>
                                <div className="elementor-element elementor-element-3ea9ba4 opportunities-desc">
                                    <p>
                                        With 60+ years of trust, premium products, and a loyal customer base, Dayal Sweets offers the perfect opportunity to build a successful business in your city.&nbsp;
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Part 3: Contact Boxes & CTA Button */}
                        <div className="elementor-element elementor-element-1392fe1 opportunities-part-3">
                            {/* Phone Box */}
                            <div className="elementor-element elementor-element-d1706fe rt-icon_box opportunities-contact-box">
                                <a
                                    href={phoneLink}
                                    className="opportunities-contact-link"
                                    aria-label="Interested In Franchise"
                                >
                                    <span className="opportunities-icon" aria-hidden="true">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="34"
                                            height="34"
                                            viewBox="0 0 34 34"
                                            fill="none"
                                        >
                                            <path
                                                d="M7.08333 5.66699H12.75L15.5833 12.7503L12.0417 14.8753C13.5589 17.9517 16.0487 20.4415 19.125 21.9587L21.25 18.417L28.3333 21.2503V26.917C28.3333 28.4818 27.0648 29.7503 25.5 29.7503C14.0642 29.0554 4.94496 19.9362 4.25 8.50033C4.25 6.93552 5.51853 5.66699 7.08333 5.66699"
                                                stroke="#7B1C2E"
                                                strokeWidth="2.125"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M21.25 9.91699C22.8148 9.91699 24.0833 11.1855 24.0833 12.7503"
                                                stroke="#7B1C2E"
                                                strokeWidth="2.125"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M21.25 4.25C25.9444 4.25 29.75 8.05558 29.75 12.75"
                                                stroke="#7B1C2E"
                                                strokeWidth="2.125"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                    <div className="opportunities-contact-content">
                                        <h3 className="opportunities-contact-title">Interested In Franchise</h3>
                                        <p className="opportunities-contact-val">{phone}</p>
                                    </div>
                                </a>
                            </div>

                            {/* WhatsApp Box */}
                            <div className="elementor-element elementor-element-ceebd9f rt-icon_box opportunities-contact-box">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="opportunities-contact-link"
                                    aria-label="Whatsapp us"
                                >
                                    <span className="opportunities-icon" aria-hidden="true">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            viewBox="0 0 30 30"
                                            fill="none"
                                        >
                                            <g clipPath="url(#clip0_409_113_opp)">
                                                <path
                                                    d="M21.8408 17.9775C21.4695 17.7912 19.6433 16.8937 19.3033 16.7687C18.962 16.645 18.7145 16.5837 18.4658 16.9562C18.2195 17.3275 17.507 18.1637 17.2908 18.4112C17.0745 18.66 16.857 18.69 16.4858 18.505C16.1145 18.3175 14.917 17.9262 13.4983 16.6613C12.3945 15.6762 11.6483 14.46 11.432 14.0875C11.2158 13.7162 11.4095 13.515 11.5945 13.33C11.762 13.1637 11.967 12.8962 12.152 12.68C12.3383 12.4625 12.3995 12.3075 12.5245 12.0587C12.6483 11.8112 12.587 11.595 12.4933 11.4087C12.3995 11.2225 11.657 9.39375 11.3483 8.65C11.0458 7.92625 10.7395 8.025 10.512 8.0125C10.2958 8.0025 10.0483 8 9.79952 8C9.55202 8 9.14952 8.0925 8.80952 8.465C8.46952 8.83625 7.50952 9.735 7.50952 11.5638C7.50952 13.3912 8.84077 15.1575 9.02577 15.4062C9.21202 15.6537 11.6458 19.4062 15.372 21.015C16.2583 21.3975 16.9495 21.6262 17.4895 21.7962C18.3795 22.08 19.1895 22.04 19.8283 21.9437C20.542 21.8375 22.0258 21.045 22.3358 20.1775C22.6458 19.31 22.6458 18.5662 22.552 18.4112C22.4595 18.2562 22.2133 18.1637 21.8408 17.9775Z"
                                                    fill="#25D366"
                                                />
                                                <path
                                                    d="M15 0C6.71625 0 0 6.71625 0 15C0 17.655 0.6975 20.1475 1.91875 22.3062L0.07125 29.4338C0.0436421 29.5394 0.0441718 29.6503 0.0727864 29.7557C0.101401 29.861 0.157103 29.957 0.234348 30.0341C0.311593 30.1113 0.407688 30.1668 0.513069 30.1952C0.61845 30.2237 0.729443 30.224 0.835 30.1962L8.08 28.3125C10.2168 29.4249 12.591 30.0039 15 30C23.2838 30 30 23.2838 30 15C30 6.71625 23.2838 0 15 0ZM15 27.5C12.5375 27.5 10.2375 26.8275 8.26625 25.6588L7.78375 25.3713L2.79 26.6687L4.0525 21.81L3.73875 21.31C2.78001 19.3516 2.35282 17.1755 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5Z"
                                                    fill="#25D366"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_409_113_opp">
                                                    <rect width="30" height="30" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <div className="opportunities-contact-content">
                                        <h3 className="opportunities-contact-title">Whatsapp us</h3>
                                        <p className="opportunities-contact-val">{whatsapp}</p>
                                    </div>
                                </a>
                            </div>

                            {/* Button */}
                            <div className="elementor-element elementor-element-0902c15 fill-btn opportunities-btn-wrap">
                                <Link
                                    className="elementor-button elementor-button-link elementor-size-sm opportunities-submit-btn"
                                    href={ctaLink}
                                >
                                    <span className="elementor-button-content-wrapper">
                                        <span className="elementor-button-icon" aria-hidden="true">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path
                                                    d="M11.933 5H5V21H18V13"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M14 17H9"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M9 13H14V9H9V13Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M15 5V3"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M18 6L20 4"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M19 9H21"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="elementor-button-text">{ctaText}</span>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: 5 Feature Boxes Grid */}
                    <div className="elementor-element elementor-element-f3122af opportunities-features-container">
                        <div className="elementor-element elementor-element-9979976 opportunities-features-grid">
                            {/* Feature 1: Trusted Brand */}
                            <div className="elementor-element elementor-element-1e3bd00 opportunities-feature-item">
                                <div className="opportunities-feature-wrapper">
                                    <div className="opportunities-feature-icon" aria-hidden="true">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="29"
                                            height="35"
                                            viewBox="0 0 29 35"
                                            fill="none"
                                        >
                                            <path
                                                d="M13.5311 6.10375C13.761 5.63244 14.4057 5.63244 14.6356 6.10375L15.9915 8.88296C16.0815 9.06743 16.2506 9.19582 16.4463 9.22838L19.3937 9.7187C19.8932 9.8018 20.0923 10.4412 19.7351 10.8153L17.6251 13.0252C17.4853 13.1716 17.4209 13.3789 17.4517 13.5832L17.9167 16.6674C17.9955 17.1897 17.4741 17.5851 17.0231 17.3451L14.3647 15.9305C14.1879 15.8364 13.9787 15.8364 13.802 15.9305L11.1436 17.3451C10.6926 17.5851 10.1712 17.1897 10.2499 16.6674L10.715 13.5832C10.7458 13.3789 10.6814 13.1716 10.5416 13.0252L8.43161 10.8153C8.0744 10.4412 8.27346 9.8018 8.773 9.7187L11.7203 9.22838C11.9161 9.19582 12.0851 9.06743 12.1751 8.88296L13.5311 6.10375Z"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M25.7498 12.4167C25.7498 18.86 20.5265 24.0833 14.0832 24.0833C7.63985 24.0833 2.4165 18.86 2.4165 12.4167C2.4165 5.97334 7.63985 0.75 14.0832 0.75C20.5265 0.75 25.7498 5.97334 25.7498 12.4167Z"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M15.75 24.654L18.4607 31.8355C19.0068 33.2825 19.2799 34.006 19.7549 34.0833C20.2312 34.013 20.8146 33.2173 21.3847 31.7786C21.793 30.7486 21.9971 30.2335 22.4175 29.9558C22.5465 29.8706 22.6876 29.8033 22.8366 29.7559C23.3227 29.6014 23.8817 29.7525 24.9996 30.0547C26.1949 30.3778 27.0252 30.2876 27.3531 30.0547C27.4495 29.9861 27.3531 30.0495 27.3531 30.0495C27.546 29.7071 27.2856 29.1731 26.7646 28.1051L23.1769 20.75"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M12.4167 24.6534L9.706 31.8338C9.15983 33.2806 8.61952 34.006 8.14452 34.0833C7.66829 34.013 7.3832 33.2938 6.81301 31.8554C6.40478 30.8255 6.16959 30.2321 5.74914 29.9544C5.62021 29.8692 5.47909 29.802 5.33004 29.7546C4.84396 29.6 4.28501 29.7511 3.16711 30.0533C1.9718 30.3764 1.1415 30.281 0.813585 30.0481C0.620622 29.7058 0.881098 29.1719 1.40205 28.104L4.98978 20.75"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="opportunities-feature-content">
                                        <h3 className="opportunities-feature-title">Trusted Brand</h3>
                                        <p className="opportunities-feature-desc">
                                            60+ years of legacy &amp; customer trust
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2: Premium Products */}
                            <div className="elementor-element elementor-element-d034afa opportunities-feature-item">
                                <div className="opportunities-feature-wrapper">
                                    <div className="opportunities-feature-icon" aria-hidden="true">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="35"
                                            viewBox="0 0 32 35"
                                            fill="none"
                                        >
                                            <path
                                                d="M12.4169 12.8421C8.42742 10.6806 4.21784 6.94046 0.750244 0.75M15.1094 4.78168C11.7177 2.55583 7.57928 3.48608 5.86588 6.85945C4.15248 10.2328 5.51297 14.7719 8.90462 16.9977C11.9752 19.0129 18.6957 21.0964 24.0836 15.3249C19.0345 13.1748 18.501 7.00752 15.1094 4.78168Z"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M2.41691 15.75C1.3518 16.5348 0.750244 17.4256 0.750244 18.37C0.750244 21.5254 7.46597 24.0833 15.7502 24.0833C24.0345 24.0833 30.7502 21.5254 30.7502 18.37C30.7502 17.4256 30.1487 16.5348 29.0836 15.75"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M30.7502 19.084C30.7502 25.045 26.5729 30.2751 22.0755 33.221C21.1506 33.8268 20.0509 34.084 18.9454 34.084H12.5551C11.4496 34.084 10.3498 33.8268 9.42501 33.221C4.92758 30.2751 0.750244 25.045 0.750244 19.084"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="opportunities-feature-content">
                                        <h3 className="opportunities-feature-title">Premium Products</h3>
                                        <p className="opportunities-feature-desc">
                                            Wide range of high demand products
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3: Complete Support */}
                            <div className="elementor-element elementor-element-09dded6 opportunities-feature-item">
                                <div className="opportunities-feature-wrapper">
                                    <div className="opportunities-feature-icon" aria-hidden="true">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="35"
                                            height="25"
                                            viewBox="0 0 35 25"
                                            fill="none"
                                        >
                                            <path
                                                d="M0.75 4.08431H5.52504C6.73623 4.08431 7.89781 3.48482 8.75424 2.41772C9.97738 0.89373 11.7866 0.361579 13.4276 1.04313L15.75 2.00768M0.75 19.029H3.45113C5.38361 19.029 6.34985 19.029 7.26353 19.2864C7.30795 19.299 7.35223 19.3119 7.39637 19.3253C8.30431 19.6011 9.10827 20.1192 10.7162 21.1555C13.8631 23.1837 15.4366 24.1978 17.1511 24.0742C17.232 24.0684 17.3126 24.0607 17.3931 24.0511C19.0994 23.8471 20.4366 22.5544 23.1109 19.969L25.75 17.4176"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M34.0834 4.47405H29.8887C28.1125 4.47405 26.8582 3.50878 25.584 2.22194C24.7586 1.38842 23.7052 0.897181 22.598 0.829533C21.3601 0.753896 19.9256 0.6474 18.7234 0.977658C17.3853 1.34524 16.5017 2.35203 15.5671 3.40424L13.1552 6.11949C12.1706 7.228 12.1706 9.02523 13.1552 10.1337C14.0051 11.0905 15.3366 11.2389 16.3367 10.4884C17.0563 9.94829 17.8739 9.07608 18.7219 8.80139C19.6763 8.49224 20.2682 9.18676 20.8091 9.91746L24.6761 15.1416C26.1112 17.0804 26.8288 18.0498 27.8098 18.567C28.7907 19.0843 29.9116 19.0843 32.1534 19.0843H34.0834"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="opportunities-feature-content">
                                        <h3 className="opportunities-feature-title">Complete Support</h3>
                                        <p className="opportunities-feature-desc">
                                            Training, setup &amp; ongoing assistance
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 4: High Profit Potential */}
                            <div className="elementor-element elementor-element-4ead9a3 opportunities-feature-item">
                                <div className="opportunities-feature-wrapper">
                                    <div className="opportunities-feature-icon" aria-hidden="true">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="40"
                                            height="40"
                                            viewBox="0 0 40 40"
                                            fill="none"
                                        >
                                            <rect
                                                x="5"
                                                y="8.33301"
                                                width="30"
                                                height="23.3333"
                                                rx="2"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M26.0405 12.9795H15.0081H18.0169C20.2326 12.9795 22.0287 14.7756 22.0287 16.9913C22.0287 19.207 20.2326 21.0031 18.0169 21.0031H15.0081L21.0258 27.0208"
                                                stroke="#5C1520"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M15.0081 16.9917H26.0405"
                                                stroke="#5C1520"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M10 13.3333H10.0167"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M15 13.3333H15.0167"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="opportunities-feature-content">
                                        <h3 className="opportunities-feature-title">High Profit Potential</h3>
                                        <p className="opportunities-feature-desc">
                                            Proven business model with great returns
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 5: Growth Opportunity */}
                            <div className="elementor-element elementor-element-10f4c48 opportunities-feature-item">
                                <div className="opportunities-feature-wrapper">
                                    <div className="opportunities-feature-icon" aria-hidden="true">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="43"
                                            height="44"
                                            viewBox="0 0 43 44"
                                            fill="none"
                                        >
                                            <path
                                                d="M3.38893 42.7687V37.6401H11.1337V42.7687H3.38893ZM13.7648 42.7687V29.9526H21.2788V42.7687H13.1988H13.7648ZM24.0893 42.7687V24.8275H31.8481V42.7687H24.0893ZM34.6835 42.7687V32.8022H42.2443V42.7687H34.6835ZM0.764648 19.9781L13.1988 10.1714L27.5429 14.59L42.2443 1.6582V6.72345L28.383 18.7932L14.3115 14.59L0.975586 25.3454L0.764648 19.9781Z"
                                                stroke="#5C1520"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </div>
                                    <div className="opportunities-feature-content">
                                        <h3 className="opportunities-feature-title">Growth Opportunity</h3>
                                        <p className="opportunities-feature-desc">
                                            A scalable business backed by a trusted brand
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
