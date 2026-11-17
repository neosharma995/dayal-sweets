import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

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
    const [toast, setToast] = useState(null);
    const [isToastExiting, setIsToastExiting] = useState(false);
    const toastTimerRef = useRef(null);
    const toastExitTimerRef = useRef(null);

    const dismissToast = useCallback(() => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setIsToastExiting(true);
        toastExitTimerRef.current = setTimeout(() => {
            setToast(null);
            setIsToastExiting(false);
        }, 250);
    }, []);

    const showToast = useCallback((toastData) => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        if (toastExitTimerRef.current) clearTimeout(toastExitTimerRef.current);

        setIsToastExiting(false);
        setToast(toastData);

        toastTimerRef.current = setTimeout(() => {
            dismissToast();
        }, 4000);
    }, [dismissToast]);

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            if (toastExitTimerRef.current) clearTimeout(toastExitTimerRef.current);
        };
    }, []);

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

    const addToCart = (product, quantity = 1, variation = null, openDrawer = false) => {
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

        const itemImage = product.image || '/uploads/2026/07/kaaju-katli.png';

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
                    image: itemImage,
                    price: unitPrice,
                    quantity: qty,
                    variation: variation,
                    variationLabel: varLabel,
                },
            ];
        });

        // Trigger toaster notification
        showToast({
            id: Date.now(),
            itemId: itemId,
            name: displayName,
            image: itemImage,
            price: unitPrice,
            quantity: qty,
            variation: varLabel,
            message: `${qty > 1 ? `${qty}× ` : ''}${displayName} added to your cart!`,
        });

        // Automatically open cart sidebar on add ONLY when openDrawer is explicitly true
        if (openDrawer) {
            setIsCartOpen(true);
        }
    };

    const updateQuantity = (itemId, newQuantity) => {
        const parsed = parseInt(newQuantity, 10);
        // Minimum quantity is always 1, prevent auto-deletion on decrement
        const qty = isNaN(parsed) || parsed < 1 ? 1 : Math.min(999, parsed);

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
                toast,
                isToastExiting,
                showToast,
                dismissToast,
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
