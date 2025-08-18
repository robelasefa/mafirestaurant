"use client";

import { ReactNode } from "react";

interface StaffLayoutProps {
  children: ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Staff header */}
      <header className="bg-background/98 backdrop-blur-md py-6 px-8 text-center text-2xl md:text-3xl font-bold text-primary shadow-elegant border-b border-primary/20 rounded-b-xl">
        Mafi Restaurant Staff Panel
      </header>

      {/* Main content */}
      <main className="flex-1 pt-8 pb-16 px-4 md:px-8">
        {children}
      </main>
    </div>
  );
}
