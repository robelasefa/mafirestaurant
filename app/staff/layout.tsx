"use client";

import { ReactNode } from "react";

interface StaffLayoutProps {
  children: ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 md:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
