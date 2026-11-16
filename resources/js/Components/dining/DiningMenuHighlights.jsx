import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { diningMenuCategories, diningMenuItems } from '@/data/diningData';
import { useCart } from '@/Context/CartContext';
import { Plus, Check, ShoppingBag, ArrowRight } from 'lucide-react';

export default function DiningMenuHighlights() {
    const [activeTab, setActiveTab] = useState('all');
    const { addToCart } = useCart();
    const [addedIds, setAddedIds] = useState({});

    const filteredItems = useMemo(() => {
        if (activeTab === 'all') {
            return diningMenuItems;
        }
        return diningMenuItems.filter((item) => item.category === activeTab);
    }, [activeTab]);

    const handleAddToCart = (item) => {
        addToCart({
            id: `dine-${item.id}`,
            name: item.name,
            price: item.price,
            image: item.image,
            variation: 'Dine-In Special',
        }, 1);

        setAddedIds((prev) => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            setAddedIds((prev) => ({ ...prev, [item.id]: false }));
        }, 1500);
    };

    return (
        <section className="dayal-dining-menu-section" id="dining-menu">
            <div className="dayal-dining-container">
                <header className="dayal-dining-section-header">
                    <div className="dayal-dining-eyebrow">
                        <span className="eyebrow-line" />
                        <span className="eyebrow-text">CHEF'S CURATED MENU</span>
                        <span className="eyebrow-line" />
                    </div>
                    <h2 className="dayal-dining-section-title">
                        A Symphony of <span className="title-accent">Traditional Flavors</span>
                    </h2>
                    <p className="dayal-dining-section-subtitle">
                        Every curry, tandoori bread, dosa, and dessert is prepared live in our kitchen with pure desi ghee and ground spices.
                    </p>
                </header>

                {/* Filter Tabs */}
                <div className="dayal-dining-tabs-wrapper" role="tablist" aria-label="Dining menu categories">
                    {diningMenuCategories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === cat.id}
                            className={`dayal-dining-tab-btn ${activeTab === cat.id ? 'is-active' : ''}`}
                            onClick={() => setActiveTab(cat.id)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Dishes Grid */}
                <div className="dayal-dining-dishes-grid">
                    {filteredItems.map((item) => {
                        const isAdded = Boolean(addedIds[item.id]);

                        return (
                            <article className="dayal-dining-dish-card" key={item.id}>
                                <div className="dish-card-media">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        loading="lazy"
                                        className="dish-card-img"
                                    />
                                    {item.badge && (
                                        <span className="dish-badge-pill">{item.badge}</span>
                                    )}
                                </div>

                                <div className="dish-card-body">
                                    <div className="dish-header-row">
                                        <div className="dish-veg-badge" title="100% Pure Vegetarian">
                                            <span className="veg-circle" />
                                        </div>
                                        <span className="dish-price">&#8377;{item.price.toFixed(2)}</span>
                                    </div>

                                    <h3 className="dish-title">{item.name}</h3>
                                    <p className="dish-desc">{item.description}</p>

                                    <div className="dish-footer-row">
                                        <button
                                            type="button"
                                            className={`dish-add-cart-btn ${isAdded ? 'is-success' : ''}`}
                                            onClick={() => handleAddToCart(item)}
                                            aria-label={`Add ${item.name} to order`}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check size={14} />
                                                    <span>Added!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={14} />
                                                    <span>Add to Order</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Full Shop / Menu Link */}
                <div className="dayal-dining-menu-action">
                    <Link href="/shop" className="dayal-dining-viewall-btn">
                        <span>EXPLORE COMPLETE SHOP CATALOG</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
