import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`dayal-simple-navlink ${active ? 'active' : ''} ${className}`.trim()}
        >
            {children}
        </Link>
    );
}
