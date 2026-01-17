'use client';

import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
      >
        <Menu size={22} />
      </button>

      <div className="ml-auto flex items-center gap-4">
        <div className="text-sm text-right">
          <div className="font-medium">{user?.nombre}</div>
          <div className="text-xs text-gray-500">{user?.role}</div>
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
