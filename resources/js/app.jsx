import '../scss/app.scss';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CartProvider } from './Context/CartContext';

// Keep <meta name="csrf-token"> synchronized across Inertia SPA navigations
const syncCsrfMeta = (token) => {
    if (!token) return;
    const meta = document.head.querySelector('meta[name="csrf-token"]');
    if (meta) {
        meta.setAttribute('content', token);
    }
};

router.on('success', (event) => {
    syncCsrfMeta(event.detail.page?.props?.csrf_token);
});

router.on('navigate', (event) => {
    syncCsrfMeta(event.detail.page?.props?.csrf_token);
});

// Gracefully handle 419 (Page Expired / CSRF mismatch) across the entire application
// Prevents the raw Inertia modal iframe and refreshes the page to obtain a fresh CSRF token.
router.on('invalid', (event) => {
    if (event.detail.response?.status === 419) {
        event.preventDefault();
        window.location.reload();
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'Dayal Sweets';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <CartProvider
                initialPincodeSession={props?.initialPage?.props?.pincodeSession}
                initialCart={props?.initialPage?.props?.cart}
                sessionToken={props?.initialPage?.props?.sessionToken}
            >
                <App {...props} />
            </CartProvider>
        );
    },

    progress: {
        color: '#d97706',
    },
});
