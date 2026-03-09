"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Calendar, Shield, X, ChevronUp } from "lucide-react";
import Link from "next/link";

const StaffQuickAccess = () => {
  const { data: session, status } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 1. Initialize hooks first, THEN check for conditions
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 2. Early return only AFTER all hooks are called
  if (status === "loading" || !session) return null;
  
  const isStaff = session.user?.role === "staff" || session.user?.role === "admin";
  const isAdmin = session.user?.role === "admin";

  if (!isStaff) return null;

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      {/* Expanded Menu */}
      <div className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 transform origin-bottom-right ${
          isExpanded ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <Link
          href="/staff/manage-bookings"
          className="flex items-center gap-3 px-4 py-3 bg-black/60 backdrop-blur-md border border-primary/30 rounded-lg shadow-elegant hover:shadow-gold transition-all duration-300 hover:bg-black/70 hover:border-primary/50 hover:scale-105 group"
        >
          <Calendar className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-primary font-medium text-sm whitespace-nowrap">
            Manage Bookings
          </span>
        </Link>

        {/* Admin button only shows if user is admin */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 bg-black/60 backdrop-blur-md border border-primary/30 rounded-lg shadow-elegant hover:shadow-gold transition-all duration-300 hover:bg-black/70 hover:border-primary/50 hover:scale-105 group"
          >
            <Shield className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-primary font-medium text-sm whitespace-nowrap">
              Admin Dashboard
            </span>
          </Link>
        )}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={toggleExpanded}
        className={`relative w-14 h-14 bg-black/60 backdrop-blur-md border border-primary/50 rounded-full shadow-elegant hover:shadow-gold transition-all duration-300 hover:bg-black/70 hover:scale-110 group flex items-center justify-center ${
          isExpanded ? "rotate-45" : "rotate-0"
        }`}
      >
        {/* Mafi Gold Accent Circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 pointer-events-none" />
        
        {/* Icon */}
        <div className="relative">
          {isExpanded ? (
            <X className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronUp className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
          )}
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>

      {/* Conditional Label: hide text when expanded */}
      {!isExpanded && (
        <div className="absolute -top-8 right-0 text-xs text-primary/60 font-medium whitespace-nowrap opacity-70">
          Staff Access
        </div>
      )}
    </div>
  );
};

export default StaffQuickAccess;
