import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapPin, X, AlertCircle, CheckCircle2, ArrowRight, Loader2, Store } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { useCart } from '@/Context/CartContext';

export default function PincodeModal() {
    const { props } = usePage();
    const serverPincodeSession = props?.pincodeSession;

    const {
        cart,
        setCart,
        pincodeSession,
        setPincodeSession,
        isPincodeModalOpen,
        closePincodeModal,
        openPincodeModal,
        pincodeModalReason,
        pendingCartItem,
        setPendingCartItem,
        executePendingAddToCart,
    } = useCart();

    const [inputPincode, setInputPincode] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const inputRef = useRef(null);

    // Initial popup when visitor first lands on the website
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // If already verified or active, do not prompt
        if (pincodeSession?.isServiceable && pincodeSession?.pincode) {
            return;
        }

        // Check if user already skipped or interacted in this browser session
        const alreadyPrompted = sessionStorage.getItem('dayal_pincode_prompted');
        if (!alreadyPrompted) {
            const timer = setTimeout(() => {
                openPincodeModal({ reason: 'initial_prompt' });
                sessionStorage.setItem('dayal_pincode_prompted', 'true');
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [pincodeSession?.pincode, pincodeSession?.isServiceable, openPincodeModal]);

    // Set initial input when modal opens or session changes
    useEffect(() => {
        if (isPincodeModalOpen) {
            setInputPincode(pincodeSession?.pincode || '');
            setErrorMsg(null);
            setSuccessMsg(null);
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }, [isPincodeModalOpen, pincodeSession?.pincode]);

    // Keyboard escape handling
    useEffect(() => {
        if (!isPincodeModalOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleSkipOrClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPincodeModalOpen]);

    const handleSkipOrClose = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('dayal_pincode_prompted', 'true');
        }
        setPendingCartItem(null);
        setErrorMsg(null);
        setSuccessMsg(null);
        closePincodeModal();
    };

    const handleQuickPillClick = (pin) => {
        setInputPincode(pin);
        setErrorMsg(null);
        verifyAndSubmit(pin);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyAndSubmit(inputPincode);
    };

    const verifyAndSubmit = async (pincodeToVerify) => {
        const cleanPin = (pincodeToVerify || '').trim();

        if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
            setErrorMsg('Please enter a valid 6-digit Indian PIN code (e.g. 177203, 174303).');
            return;
        }

        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            const response = await axios.post('/pincode/check', { pincode: cleanPin }, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            const data = response.data;

            if (data.serviceable && data.success) {
                const sessionData = {
                    pincode: cleanPin,
                    isServiceable: true,
                    outletIds: data.outlet_ids || [],
                    outlets: data.outlets || [],
                    message: data.message,
                };

                setPincodeSession(sessionData);

                // Instantly sync pruned cart if items were removed due to outlet change
                if (Array.isArray(data.cart)) {
                    setCart(data.cart);
                    try {
                        localStorage.setItem('dayal_sweets_cart', JSON.stringify(data.cart));
                    } catch (e) {
                        console.error('Failed to sync cart in localStorage', e);
                    }
                }

                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('dayal_pincode_prompted', 'true');
                    try {
                        localStorage.setItem('dayal_sweets_pincode_session', JSON.stringify(sessionData));
                    } catch (e) {
                        console.error('Failed to store pincode session in localStorage', e);
                    }
                }

                // If user was trying to add to cart, check availability and add
                if (pendingCartItem) {
                    const pendingProductId = parseInt(pendingCartItem.product?.id, 10);
                    const isAvailable = Array.isArray(data.available_product_ids)
                        ? data.available_product_ids.includes(pendingProductId)
                        : true;

                    if (isAvailable) {
                        const { product, quantity, variation } = pendingCartItem;
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

                        const currentCart = Array.isArray(data.cart) ? data.cart : (cart || []);
                        const existingIdx = currentCart.findIndex((i) => i.id === itemId);
                        let updatedCart;
                        if (existingIdx > -1) {
                            updatedCart = [...currentCart];
                            updatedCart[existingIdx] = {
                                ...updatedCart[existingIdx],
                                quantity: updatedCart[existingIdx].quantity + qty,
                            };
                        } else {
                            updatedCart = [
                                ...currentCart,
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
                        }

                        try {
                            await axios.post('/cart/sync', { cart: updatedCart }, {
                                headers: { 'Accept': 'application/json' },
                            });
                            localStorage.setItem('dayal_sweets_cart', JSON.stringify(updatedCart));
                        } catch (e) {
                            console.error('Failed to sync added item before reload', e);
                        }

                        setPendingCartItem(null);
                    } else {
                        setErrorMsg(`"${pendingCartItem.product?.name}" is not delivered by the kitchen serving PIN ${cleanPin}. Please choose an item available in your area.`);
                        setLoading(false);
                        return;
                    }
                }

                closePincodeModal();

                // Immediately reload page so catalog and products for the selected outlet reflect without needing manual browser refresh
                window.location.reload();
            } else {
                setErrorMsg(data.message || 'We currently do not offer delivery to this PIN code. Please try another area.');
            }
        } catch (err) {
            console.error('Error verifying pincode', err);
            const serverMsg = err.response?.data?.message || err.response?.data?.error;
            setErrorMsg(serverMsg || 'Unable to verify delivery area. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isPincodeModalOpen) {
        return null;
    }

    const isCartGuard = pincodeModalReason === 'cart_guard';
    const pendingProductName = pendingCartItem?.product?.name;

    return (
        <div
            className="dayal-pincode-backdrop"
            role="presentation"
            onClick={handleSkipOrClose}
        >
            <div
                className="dayal-pincode-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dayal-pincode-title"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top-Right Circular Close Button */}
                <button
                    type="button"
                    className="dayal-pincode-close-btn"
                    aria-label="Close delivery pincode modal"
                    onClick={handleSkipOrClose}
                >
                    <X size={13} strokeWidth={2.4} />
                </button>

                {/* Center Golden Medallion at Arch Crest */}
                <div className="dayal-pincode-medallion" aria-hidden="true">
                    <svg width="20" height="24" viewBox="0 0 28 34" fill="none">
                        <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 34 14 34C14 34 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#7E561C" />
                        <circle cx="14" cy="14" r="5" fill="#FFF8E7" />
                    </svg>
                </div>

                <div className="dayal-pincode-body">
                    <h2 id="dayal-pincode-title" className="dayal-pincode-title">
                        {isCartGuard ? 'Enter PIN Code to Add to Bag' : 'Check Delivery Availability'}
                    </h2>

                    {/* Flower Icon Flourish with Custom Left & Right Lines */}
                    <div className="dayal-pincode-flourish">
                        <span className="dayal-pincode-flourish-line" />
                        <img
                            src="/uploads/2026/08/flower.png"
                            alt=""
                            className="dayal-pincode-flower-img"
                            aria-hidden="true"
                        />
                        <span className="dayal-pincode-flourish-line" />
                    </div>

                    <p className="dayal-pincode-subtitle">
                        {isCartGuard
                            ? `Please provide your delivery PIN code to verify outlet kitchen availability before adding ${pendingProductName ? `"${pendingProductName}"` : 'items'} to your cart.`
                            : 'Enter your 6-digit delivery PIN code to discover freshly handcrafted sweets & savouries available from our nearest kitchen outlet.'}
                    </p>

                    {/* Context Alert for Cart Interception */}
                    {isCartGuard && !errorMsg && !successMsg && (
                        <div className="dayal-pincode-alert dayal-pincode-alert--warning" role="alert">
                            <AlertCircle size={18} />
                            <span>Delivery PIN code is required to check freshest stock &amp; dispatch route before adding to cart.</span>
                        </div>
                    )}

                    {/* Error Feedback */}
                    {errorMsg && (
                        <div className="dayal-pincode-alert dayal-pincode-alert--error" role="alert">
                            <AlertCircle size={18} />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Success Feedback */}
                    {successMsg && (
                        <div className="dayal-pincode-alert dayal-pincode-alert--success" role="status">
                            <CheckCircle2 size={18} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="dayal-pincode-form">
                        <div className="dayal-pincode-input-group">
                            <span className="dayal-pincode-input-icon">
                                <svg width="18" height="22" viewBox="0 0 28 34" fill="none">
                                    <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 34 14 34C14 34 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#B38E46"/>
                                    <circle cx="14" cy="14" r="5" fill="#FFFDF8"/>
                                </svg>
                            </span>
                            <input
                                ref={inputRef}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                value={inputPincode}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    setInputPincode(val);
                                    if (errorMsg) setErrorMsg(null);
                                }}
                                placeholder="Enter 6-digit PIN code"
                                className="dayal-pincode-input"
                                disabled={loading}
                                aria-label="Enter 6-digit PIN code"
                            />
                        </div>

                        {/* Quick Outlets Pills */}
                        <div className="dayal-pincode-quick-pills">
                            <span className="dayal-pincode-quick-label">
                                POPULAR OUTLETS:
                            </span>
                            <div className="dayal-pincode-pills-list">
                                <button
                                    type="button"
                                    className={`dayal-pincode-pill-btn ${inputPincode === '177203' ? 'is-active' : ''}`}
                                    onClick={() => handleQuickPillClick('177203')}
                                >
                                    <Store size={14} />
                                    <span>Amb</span>
                                    <strong>177203</strong>
                                </button>
                                <button
                                    type="button"
                                    className={`dayal-pincode-pill-btn ${inputPincode === '177005' ? 'is-active' : ''}`}
                                    onClick={() => handleQuickPillClick('177005')}
                                >
                                    <Store size={14} />
                                    <span>Hamirpur</span>
                                    <strong>177005</strong>
                                </button>
                                <button
                                    type="button"
                                    className={`dayal-pincode-pill-btn ${inputPincode === '174303' ? 'is-active' : ''}`}
                                    onClick={() => handleQuickPillClick('174303')}
                                >
                                    <Store size={14} />
                                    <span>Una</span>
                                    <strong>174303</strong>
                                </button>
                                <button
                                    type="button"
                                    className={`dayal-pincode-pill-btn ${inputPincode === '140001' ? 'is-active' : ''}`}
                                    onClick={() => handleQuickPillClick('140001')}
                                >
                                    <Store size={14} />
                                    <span>Express</span>
                                    <strong>140001</strong>
                                </button>
                            </div>
                        </div>

                        <div className="dayal-pincode-actions">
                            <button
                                type="submit"
                                className="dayal-pincode-submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Checking Availability...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isCartGuard ? 'Confirm PIN & Add to Bag' : 'CHECK & CONFIRM DELIVERY'}</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="dayal-pincode-skip-btn"
                                onClick={handleSkipOrClose}
                            >
                                Skip for now &amp; explore catalog
                            </button>
                        </div>
                    </form>

                    {/* Active Outlets Info when Serviceable */}
                    {pincodeSession?.isServiceable && pincodeSession?.outlets?.length > 0 && (
                        <div className="dayal-pincode-outlet-info">
                            <div className="dayal-pincode-outlet-header">
                                <Store size={15} color="#54111C" />
                                <strong>Currently Serving:</strong>
                                <span className="dayal-pincode-outlet-badge">VERIFIED &#10003;</span>
                            </div>
                            <p>
                                Orders to <strong>{pincodeSession.pincode}</strong> are fulfilled by{' '}
                                <strong>
                                    {pincodeSession.outlets.map((o) => o.name).join(' & ')}
                                </strong>{' '}
                                kitchen outlet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
