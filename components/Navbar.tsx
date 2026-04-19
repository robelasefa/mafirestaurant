"use client";

import { useEffect, useState, MouseEvent } from "react";
import { cn } from "../lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from 'next/image';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const sections = [
  { label: "Home", id: "hero" },
  { label: "About", id: "about" },
  { label: "Menu", id: "menu" },
  { label: "Meeting Hall", id: "meeting-hall" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsOpen((v) => !v);

  const hrefFor = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);

  const handleSectionClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${id}`);
      }
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-background/98 backdrop-blur-md shadow-elegant !shadow-none"
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
                src="/images/logo.webp"
                alt="Mafi Restaurant"
                width={56}   // h-14 = 56px
                height={56}
                className="h-14 w-14 rounded-full object-cover border-2 border-primary"
              />
            </div>
            <span className="ml-4 text-2xl font-serif font-bold text-primary">
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

          <div className="hidden xl:flex items-center justify-center lg:justify-start gap-4">
            <a
              href="https://www.tiktok.com/@mafirestaurant"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-primary/30 text-primary hover:text-background hover:bg-primary transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              aria-label="Visit our TikTok"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>

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
              <a
                href="https://www.tiktok.com/@mafirestaurant"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-8 py-5 text-primary hover:text-primary-glow hover:bg-primary/10 transition-all duration-300 group"
              >
                <span className="text-xl font-semibold group-hover:translate-x-2 transition-transform duration-300 flex items-center space-x-2">
                  <TikTokIcon className="h-5 w-5" />
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
