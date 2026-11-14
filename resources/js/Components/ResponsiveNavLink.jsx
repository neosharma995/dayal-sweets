import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`dayal-simple-responsive-navlink ${active ? 'active' : ''} ${className}`.trim()}
        >
            {children}
        </Link>
    );
}
