import React from 'react';

export default function AdminFooter() {
    return (
        <footer className="px-4 md:px-8 py-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
                <span>Dayal Sweets Store Manager • Chandni Chowk Flagship Operations</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    API & Dispatch Server Active
                </span>
                <span>•</span>
                <span>v1.0.0</span>
            </div>
        </footer>
    );
}
