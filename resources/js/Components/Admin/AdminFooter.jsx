import React from 'react';

export default function AdminFooter() {
    return (
        <footer className="dayal-admin-footer">
            <div>
                <span>Dayal Sweets Store Manager • Chandni Chowk Flagship Operations</span>
            </div>
            <div className="dayal-admin-footer-status">
                <span className="dayal-badge dayal-badge--green">
                    <span className="dayal-pulsing-dot" />
                    Dispatch Server Active
                </span>
                <span>•</span>
                <span>v1.0.0</span>
            </div>
        </footer>
    );
}
