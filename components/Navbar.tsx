"use client";

import { useEffect, useState, MouseEvent } from "react";
import { cn } from "../lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import Image from 'next/image';

const sections = [
  { label: "Home", id: "hero" },
  { label: "About", id: "about" },
  { label: "Menu", id: "menu" },
  { label: "Reservation", id: "reservation" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Consolidated scroll effect for efficiency.
  useEffect(() => {
    const handleScroll = () => {
      // Use a single state variable to track the scroll position.
      setScrolled(window.scrollY > 10);
    };

    // Call it once on mount to set the initial state.
    handleScroll();
    // Use a passive event listener for better performance.
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsOpen((v) => !v);

  const hrefFor = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);

  const handleSectionClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    // Only prevent default and scroll if we're on the homepage.
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Use window.history for correct URL state management.
        window.history.replaceState(null, "", `#${id}`);
      }
    }
    // Always close the mobile menu after a click.
    setIsOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-background/98 backdrop-blur-md shadow-elegant"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center h-20 w-full">
          {/* Logo + Brand */}
          <Link
            href="/"
            onClick={(e) => {
              handleSectionClick(e, "hero");
            }}
            className="flex items-center group"
            aria-label="Go to homepage"
          >
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="Mafi Restaurant"
                width={56}   // h-14 = 56px
                height={56}
                className="h-14 w-14 rounded-full object-cover border-2 border-primary transition-all duration-300 group-hover:border-primary-glow group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="ml-4 text-2xl font-serif font-bold text-primary group-hover:text-primary-glow transition-colors duration-300">
              Mafi Restaurant
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-10">
            {sections.map(({ label, id }) => (
              <Link
                key={id}
                href={hrefFor(id)}
                onClick={(e) => handleSectionClick(e, id)}
                className="relative text-lg font-medium text-primary hover:text-primary-glow transition-all duration-300 group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-glow transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right CTA → TikTok */}
          <div className="hidden xl:flex items-center justify-center lg:justify-start gap-4">
            <a
              href="https://www.tiktok.com/@mafirestaurant"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-primary/30 text-primary hover:text-background hover:bg-primary transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              aria-label="Visit our TikTok"
            >
              <FaTiktok className="h-5 w-5" />
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden ml-auto">
            <button
              aria-label="Toggle menu"
              onClick={toggleMenu}
              className="text-primary hover:text-primary-glow hover:bg-primary/10 transition-all duration-300 h-12 w-12 rounded-xl flex items-center justify-center"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-primary/30 animate-slide-in-right">
            <div className="py-8 space-y-1">
              {sections.map(({ label, id }) => (
                <Link
                  key={id}
                  href={hrefFor(id)}
                  onClick={(e) => handleSectionClick(e, id)}
                  className="block w-full text-left px-8 py-5 text-primary hover:text-primary-glow hover:bg-primary/10 transition-all duration-300 border-b border-primary/20 group"
                >
                  <span className="text-xl font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    {label}
                  </span>
                </Link>
              ))}
              {/* TikTok in mobile menu */}
              <a
                href="https://www.tiktok.com/@mafirestaurant"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-8 py-5 text-primary hover:text-primary-glow hover:bg-primary/10 transition-all duration-300 group"
              >
                <span className="text-xl font-semibold group-hover:translate-x-2 transition-transform duration-300 flex items-center space-x-2">
                  <FaTiktok className="h-5 w-5" />
                  <span>TikTok</span>
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
