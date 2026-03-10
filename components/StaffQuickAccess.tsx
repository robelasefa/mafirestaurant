"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Calendar, Shield, X, ChevronUp, LogIn, LogOut } from "lucide-react";
import Link from "next/link";

const StaffQuickAccess = () => {
  const { data: session, status } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Show the floating affordance after a short delay (subtle entrance)
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Reset secret clicks after 2 seconds of inactivity (requires quick 3 taps)
  useEffect(() => {
    if (clickCount === 0) return;
    const timer = setTimeout(() => setClickCount(0), 2000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  if (status === "loading") return null;

  const isAdmin = session?.user?.role === "admin";
  const isStaff = session?.user?.role === "staff" || isAdmin;

  // If logged-in but not staff, hide forever
  if (session && !isStaff) return null;

  // Secret found when 3 quick taps occur
  const showSecretDoor = clickCount >= 3;

  // If not logged in and not found the secret, render only the invisible trigger
  if (!session && !showSecretDoor) {
    return (
      // 20x20px invisible clickable box in the bottom-right corner
      <div
        onClick={() => setClickCount((prev) => prev + 1)}
        className="fixed bottom-0 right-0 w-5 h-5 z-[60] opacity-0 bg-transparent cursor-default"
        title="Nothing to see here"
        aria-hidden
      />
    );
  }

  const toggleExpanded = () => setIsExpanded((s) => !s);

  return (
    <div
    className={`fixed bottom-6 right-6 z-[9999] transition-all duration-500 will-change-transform ${
      isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`}
  >
    {/* 1. Only ONE label here - fixed absolute position so it doesn't affect flow */}
    {!isExpanded && (
      <div className="absolute -top-8 right-0 text-[10px] uppercase tracking-widest text-primary/40 font-bold whitespace-nowrap">
        {session ? "Staff Access" : "Authorized"}
      </div>
    )}

    {/* Expanded Menu - Use 'bottom-20' to ensure it sits above the button */}
    <div
      className={`absolute bottom-20 right-0 space-y-3 transition-all duration-300 origin-bottom-right ${
        isExpanded ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
      }`}
    >
        {session ? (
          <>
            <Link
              href="/staff/manage-bookings"
              className="group flex items-center gap-3 px-4 py-3 bg-black/60 backdrop-blur-md border border-primary/30 rounded-lg shadow-elegant hover:shadow-gold transition-all duration-300 hover:bg-black/70"
            >
              <Calendar className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-primary font-medium text-sm whitespace-nowrap">
                Manage Bookings
              </span>
            </Link>

            {isAdmin && (
              <Link
                href="/staff/admin/dashboard"
                className="group flex items-center gap-3 px-4 py-3 bg-black/60 backdrop-blur-md border border-primary/30 rounded-lg shadow-elegant hover:shadow-gold transition-all duration-300 hover:bg-black/70"
              >
                <Shield className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-primary font-medium text-sm whitespace-nowrap">
                  Admin Dashboard
                </span>
              </Link>
            )}

             {/* Logout button for staff/admin */}
            <button
  onClick={() => signOut()}
  className="group flex items-center gap-3 px-4 py-3 bg-black/60 backdrop-blur-md border border-red-900/30 rounded-lg shadow-elegant hover:bg-red-950/40 transition-all duration-300 w-full"
>
  <LogOut className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
  <span className="text-red-200 font-medium text-sm whitespace-nowrap">
    Logout
  </span>
</button>
          </>
        ) : (
          <Link
            href="/staff/login"
            className="flex items-center gap-2 bg-primary text-black px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => {
              /* When user navigates to login, we keep the menu visible until session changes */
            }}
          >
            <LogIn size={18} />
            <span className="font-bold">Staff Login</span>
          </Link>
        )}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={toggleExpanded}
        aria-label={isExpanded ? "Close staff quick access" : "Open staff quick access"}
        className={`group relative w-14 h-14 bg-black/60 backdrop-blur-md border border-primary/50 rounded-full shadow-elegant hover:shadow-gold transition-all duration-300 hover:bg-black/70 hover:scale-110 flex items-center justify-center`}
      >
        {/* Mafi Gold Accent Circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 pointer-events-none" />

        {/* Icon Container: Now swaps between Chevron and a crisp X */}
        <div
          className={`relative z-10 transform transition-all duration-300 ${
            isExpanded ? "rotate-0 scale-110" : "rotate-0 scale-100"
          }`}
        >
          {isExpanded ? (
            /* The 'X' icon for closing */
            <X className="h-6 w-6 text-primary stroke-[2.5px] transition-transform" />
          ) : (
            /* The 'ChevronUp' or 'Plus' for opening */
            <ChevronUp className="h-6 w-6 text-primary transition-transform" />
          )}
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>

      {/* Updated Label Text */}
      {!isExpanded && (
        <div className="absolute -top-8 right-0 text-[10px] uppercase tracking-widest text-primary/40 font-bold whitespace-nowrap">
          {session ? "Staff Access" : "Authorized"}
        </div>
      )}
     
    </div>
  );
};

export default StaffQuickAccess;
