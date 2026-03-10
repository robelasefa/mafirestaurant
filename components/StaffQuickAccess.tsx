"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Calendar, Shield, X, ChevronUp, LogIn, LogOut } from "lucide-react";
import Link from "next/link";

const StaffQuickAccess = () => {
  const { data: session, status } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);

  // Persistence for knock count
  const clickCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (session) {
      setSecretUnlocked(false);
    }
  }, [session]);

  // 2. Secret Knock Handler
  const handleKnock = () => {
    clickCount.current += 1;
    
    // Reset timer on every click
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Auto-reset knock count after 2 seconds
    timerRef.current = setTimeout(() => {
      clickCount.current = 0;
    }, 2000);

    // If 3 knocks, unlock the door
    if (clickCount.current >= 3) {
      setSecretUnlocked(true);
    }
  };

  // The condition for showing the trigger or the full menu
  const showSecretDoor = secretUnlocked;

  if (status === "loading") return null;

  const isAdmin = session?.user?.role === "admin";
  const isStaff = session?.user?.role === "staff" || isAdmin;

  // If not logged in, show menu ONLY if secretUnlocked is true
  if (session && !isStaff) return null;

  if (!session && !secretUnlocked) {
  return (
    <div
      onClick={handleKnock}
      className="fixed bottom-0 right-0 w-20 h-20 z-[9999] bg-transparent cursor-pointer pointer-events-auto"
      title="Secret Trigger"
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
