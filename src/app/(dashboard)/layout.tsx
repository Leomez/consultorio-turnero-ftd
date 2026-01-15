"use client";

import { usePathname } from "next/navigation";
import { useState, } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/header";


export default function dashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [siderbarOpen, setSidebarOpen] = useState(false); 

  return (
    <div className="flex w-full h-full">
      {/* Sidebar */}
      <Sidebar open={siderbarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Header onMenuClick={() => setSidebarOpen(true)}></Header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}