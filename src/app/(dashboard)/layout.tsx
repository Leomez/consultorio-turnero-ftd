"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";


const navItems = [
  { href: "/", label: "DASHBOARD" },
  { href: "/pacientes", label: "PACIENTES" },
  { href: "/turnos", label: "TURNOS" },
  { href: "/historia", label: "HISTORIA CLINICA" },
  { href: "/pagos", label: "PAGOS" },
]

export default function dashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [siderbarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex w-full h-full">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex-col hidden md:flex">
        <div className="p-4 font-bold text-xl border-b">Consultorio</div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded-md ${pathname === item.href
                    ? "bg-blue-600 text-white font-bold" // link activo
                    : "text-gray-700 hover:bg-gray-200 font-bold hover:text-gray-900" // link inactivo
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={() => {
            document.cookie = "token=; path=/; max-age=0"; // eliminar cookie
            window.location.href = "/login";
          }}
          className="text-sm bg-blue-600 block px-3 py-2 rounded-md absolute bottom-4
        left-4 text-white font-bold hover:bg-blue-700 transition-colors"
        >
          Cerrar sesión
        </button>

      </aside>

      {/* <button className="text-3xl text-gray-600 absolute bottom-4 left-20">
        Hola Mundo
      </button> */}

      {/* Mobile menu button */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md bg-blue-600 text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile sidebar */}
      {siderbarOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Fondo Oscuro */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          {/* Panel lateral */}
          <aside className="relative w-64 bg-white shadow-md flex flex-col z-50">
            <div className="p-4 font-bold text-xl border-b flex justify-between items-center">
              Consultorio
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md bg-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded-md ${pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-200"
                        }`}
                      onClick={() => setSidebarOpen(false)} // Cerrar sidebar al hacer clic
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              onClick={() => {
                document.cookie = "token=; path=/; max-age=0"; // eliminar cookie
                window.location.href = "/login";
              }}
              className="text-sm bg-blue-600 block px-3 py-2 rounded-md absolute bottom-4
              left-4 text-white font-bold hover:bg-blue-700 transition-colors"
            >
              Cerrar sesión
            </button>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}