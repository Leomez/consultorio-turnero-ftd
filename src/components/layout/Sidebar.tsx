'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

const navItems = [
    { href: '/', label: 'DASHBOARD' },
    { href: '/pacientes', label: 'PACIENTES' },
    { href: '/turnos', label: 'TURNOS' },
    { href: '/historia', label: 'HISTORIA CLINICA' },
    { href: '/pagos', label: 'PAGOS' },
];

export function Sidebar({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay mobile */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed md:static z-50
          h-full w-64 bg-white border-r
          transform transition-transform
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
            >
                <div className="h-14 flex items-center justify-between px-4 border-b">
                    <span className="font-bold">Consultorio</span>
                    <button onClick={onClose} className="md:hidden">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  block px-3 py-2 rounded-md text-sm
                  ${active
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'}
                `}
                                onClick={onClose}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
