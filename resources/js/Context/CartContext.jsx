import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const DEFAULT_ITEMS = [
    {
        id: '8554-default',
        productId: 8554,
        name: 'Birthday Party Combo',
        slug: 'birthday-party-combo',
        image: '/uploads/2026/09/Birthday-Party-Combo.png',
        price: 200,
        quantity: 2,
        variation: null,
        variationLabel: null,
    },
    {
        id: '322-1-piece',
        productId: 322,
        name: 'Brownies - 1 Piece',
        slug: 'brownies',
        image: '/uploads/2026/07/Brownies.jpg',
        price: 70,
        quantity: 2,
        variation: { label: '1 Piece', price: 70 },
        variationLabel: 'pack-size: 1 Piece',
    },
];

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('dayal_sweets_cart');
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch (e) {
                console.error('Error loading cart from localStorage', e);
            }
        }
        return DEFAULT_ITEMS;
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('dayal_sweets_cart', JSON.stringify(cart));
            } catch (e) {
                console.error('Error saving cart to localStorage', e);
            }
        }
    }, [cart]);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);
    const toggleCart = () => setIsCartOpen((prev) => !prev);

    const addToCart = (product, quantity = 1, variation = null) => {
        const qty = Math.max(1, parseInt(quantity, 10) || 1);
        const varLabel = variation ? (variation.label.toLowerCase().includes('piece') ? `pack-size: ${variation.label}` : `weight: ${variation.label}`) : null;
        const itemId = `${product.id}-${variation ? variation.label : 'default'}`;

        let unitPrice = 0;
        if (variation && typeof variation.price === 'number') {
            unitPrice = variation.price;
        } else if (typeof product.price === 'number') {
            unitPrice = product.price;
        } else if (typeof product.price === 'string') {
            unitPrice = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
        }

        const displayName = variation
            ? (product.name.includes(variation.label) ? product.name : `${product.name} - ${variation.label}`)
            : product.name;

        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => item.id === itemId);
            if (existingIndex > -1) {
                const updated = [...prevCart];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + qty,
                };
                return updated;
            }

            return [
                ...prevCart,
                {
                    id: itemId,
                    productId: product.id,
                    name: displayName,
                    slug: product.slug || '',
                    image: product.image || '/uploads/2026/07/kaaju-katli.png',
                    price: unitPrice,
                    quantity: qty,
                    variation: variation,
                    variationLabel: varLabel,
                },
            ];
        });

        // Automatically open cart sidebar on add
        setIsCartOpen(true);
    };

    const updateQuantity = (itemId, newQuantity) => {
        const qty = parseInt(newQuantity, 10);
        if (qty <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId ? { ...item, quantity: qty } : item
            )
        );
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                isCartOpen,
                openCart,
                closeCart,
                toggleCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                cartCount,
                cartSubtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
