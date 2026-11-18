import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext(null);

export function CartProvider({
    children,
    initialPincodeSession = null,
    initialCart = [],
    sessionToken = null,
}) {
    // Initialize cart from session or localStorage; fallback to EMPTY array (never fake demo items)
    const [cart, setCart] = useState(() => {
        if (Array.isArray(initialCart) && initialCart.length > 0) {
            return initialCart;
        }
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('dayal_sweets_cart');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        return parsed;
                    }
                }
            } catch (e) {
                console.error('Error loading cart from localStorage', e);
            }
        }
        return [];
    });

    // Pincode Session State
    const [pincodeSession, setPincodeSession] = useState(() => {
        if (initialPincodeSession?.isServiceable && initialPincodeSession?.pincode) {
            return initialPincodeSession;
        }
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('dayal_sweets_pincode_session');
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch (e) {
                console.error('Error loading pincode session from localStorage', e);
            }
        }
        return {
            pincode: initialPincodeSession?.pincode || null,
            isServiceable: !!initialPincodeSession?.isServiceable,
            outletIds: initialPincodeSession?.outletIds || [],
            outlets: initialPincodeSession?.outlets || [],
            message: initialPincodeSession?.message || null,
        };
    });

    const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
    const [pincodeModalReason, setPincodeModalReason] = useState(null); // 'cart_guard' | 'initial_prompt' | 'user_initiated'
    const [pendingCartItem, setPendingCartItem] = useState(null);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [isToastExiting, setIsToastExiting] = useState(false);
    const toastTimerRef = useRef(null);
    const toastExitTimerRef = useRef(null);

    // Track whether initial mount sync has occurred
    const isInitialMount = useRef(true);

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

    // Sync client cart changes with localStorage AND Laravel session
    const syncCartWithServer = useCallback(async (currentCart) => {
        try {
            await axios.post('/cart/sync', { cart: currentCart }, {
                headers: {
                    'Accept': 'application/json',
                },
            });
        } catch (e) {
            console.error('Failed to sync cart with server session', e);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('dayal_sweets_cart', JSON.stringify(cart));
            } catch (e) {
                console.error('Error saving cart to localStorage', e);
            }
        }

        // On first mount, if localStorage had items but server didn't, or vice versa, sync to session
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (cart.length > 0) {
                syncCartWithServer(cart);
            }
            return;
        }

        // Sync with backend session on every cart change
        syncCartWithServer(cart);
    }, [cart, syncCartWithServer]);

    // Save pincodeSession changes to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && pincodeSession) {
            try {
                if (pincodeSession.isServiceable && pincodeSession.pincode) {
                    localStorage.setItem('dayal_sweets_pincode_session', JSON.stringify(pincodeSession));
                }
            } catch (e) {
                console.error('Error saving pincode session to localStorage', e);
            }
        }
    }, [pincodeSession]);

    // Allow external server hydration (e.g. from Inertia props)
    const syncServerCart = useCallback((serverCart) => {
        if (Array.isArray(serverCart)) {
            setCart(serverCart);
        }
    }, []);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);
    const toggleCart = () => setIsCartOpen((prev) => !prev);

    const openPincodeModal = useCallback((options = {}) => {
        setPincodeModalReason(options.reason || 'user_initiated');
        if (options.pendingItem) {
            setPendingCartItem(options.pendingItem);
        }
        setIsPincodeModalOpen(true);
    }, []);

    const closePincodeModal = useCallback(() => {
        setIsPincodeModalOpen(false);
        setPincodeModalReason(null);
    }, []);

    // Internal helper that performs the actual cart insertion
    const performAddToCart = (product, quantity = 1, variation = null, openDrawer = false) => {
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

        if (openDrawer) {
            setIsCartOpen(true);
        }

        return true;
    };

    /**
     * Add to Cart Guard:
     * Users CANNOT add to cart without a verified serviceable delivery PIN code.
     * If no pincode is set or verified, the pincode popup is triggered.
     */
    const addToCart = (product, quantity = 1, variation = null, openDrawer = false) => {
        const hasVerifiedPincode = Boolean(pincodeSession?.isServiceable && pincodeSession?.pincode);

        if (!hasVerifiedPincode) {
            openPincodeModal({
                reason: 'cart_guard',
                pendingItem: { product, quantity, variation, openDrawer },
            });
            return false;
        }

        return performAddToCart(product, quantity, variation, openDrawer);
    };

    // Execute any queued item addition once PIN is successfully verified
    const executePendingAddToCart = (verifiedSessionData) => {
        if (!pendingCartItem) return;

        const { product, quantity, variation, openDrawer } = pendingCartItem;
        performAddToCart(product, quantity, variation, openDrawer);
        setPendingCartItem(null);
    };

    const updateQuantity = (itemId, newQuantity) => {
        const parsed = parseInt(newQuantity, 10);
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
        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem('dayal_sweets_cart');
            } catch (e) {}
        }
        axios.post('/cart/clear').catch(() => {});
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
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
                // Pincode & Delivery Area Serviceability
                pincodeSession,
                setPincodeSession,
                isPincodeModalOpen,
                pincodeModalReason,
                pendingCartItem,
                setPendingCartItem,
                openPincodeModal,
                closePincodeModal,
                executePendingAddToCart,
                // Server synchronization
                syncServerCart,
                sessionToken,
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
