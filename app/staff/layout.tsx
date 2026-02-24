"use client";

import { ReactNode } from "react";

interface StaffLayoutProps {
  children: ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <div className="bg-background min-h-screen flex flex-col relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Staff header */}
      <header className="relative z-10 glass-dark py-8 px-8 text-center shadow-gold border-b border-primary/20">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary tracking-widest uppercase">
          Mafi Restaurant <span className="text-foreground-muted font-light italic lowercase text-2xl md:text-3xl ml-2">Staff Portal</span>
        </h1>
        <div className="w-24 h-0.5 bg-primary mx-auto mt-4 rounded-full shadow-glow" />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 pt-12 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="relative z-10 py-6 text-center text-foreground-muted text-sm border-t border-primary/10 glass-dark">
        &copy; 2025 Mafi Restaurant • Internal Management System
      </footer>
    </div>
  );
}
