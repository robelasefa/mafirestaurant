"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const Footer = () => {
  const handleMapClick = () => {
    // Opens Google Maps with Mafi Restaurant location (placeholder coordinates)
    window.open("https://maps.google.com/?q=Mafi+Restaurant", "_blank");
  };

  const handleSocialClick = (platform: string) => {
    // Placeholder social media links
    const links = {
      instagram: "https://instagram.com/mafirestaurant",
      tiktok: "https://tiktok.com/@mafirestaurant",
      facebook: "https://facebook.com/mafirestaurant",
    };
    window.open(links[platform as keyof typeof links], "_blank");
  };

  return (
    <footer id="contact" className="bg-background-accent border-t border-primary/20 py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-primary/30"></div>
            <span className="text-primary font-medium tracking-widest uppercase text-sm">Get In Touch</span>
            <div className="w-16 h-px bg-primary/30"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-3 leading-tight">
            Contact Us
          </h2>
          <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
            Reserve your table, plan a celebration, or book our meeting halls — our team is ready to welcome you to Mafi Restaurant in Adama.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16 text-center lg:text-left">
          {/* Logo and Description */}
          <div className="space-y-8">
            <div className="flex justify-center lg:justify-start">
              <div className="relative group">
                <Image
                  src="/images/logo.webp"
                  alt="Mafi Restaurant Logo"
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover rounded-full border-2 border-primary transition-all duration-300 group-hover:border-primary-glow group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-serif font-bold text-primary">
                Mafi Restaurant
              </h3>
              <p className="text-foreground-muted leading-relaxed text-lg">
                A modern dining destination offering carefully crafted dishes,
                warm hospitality, and a refined atmosphere for every occasion.
              </p>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="flex flex-col items-center lg:items-start space-y-8">
            <h4 className="text-2xl font-serif font-semibold text-primary">
              Contact & Location
            </h4>
            <div className="space-y-6">
              {/* Phone Numbers */}
              <div className="flex items-start gap-3 text-foreground-muted group">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col space-y-1">
                  <a 
                    href="tel:+251945184545" 
                    className="hover:text-primary transition-colors duration-300 font-medium"
                  >
                    +251 945 184 545
                  </a>
                  <a 
                    href="tel:+25145666555" 
                    className="hover:text-primary transition-colors duration-300 font-medium"
                  >
                    +251 456 665 55
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 text-foreground-muted group">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <a 
                  href="https://maps.app.goo.gl/4L6ArGjjvARUhF7K9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-300 font-medium"
                >
                  Adama, Ethiopia
                </a>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 text-foreground-muted group">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <a
                  href="mailto:mafirestaurant@gmail.com"
                  className="hover:text-primary transition-colors duration-300 font-medium"
                >
                  mafirestaurant@gmail.com
                </a>
              </div>
            </div>

            <Button
              onClick={handleMapClick}
              variant="gold"
              className="flex items-center gap-3 px-6 py-3 shadow-gold hover:shadow-glow transition-all duration-300 transform hover:scale-105 interactive-element"
            >
              <MapPin className="h-5 w-5" />
              View on Map
            </Button>
          </div>

          {/* Social Media & Hours */}
          <div className="space-y-8">
            <h4 className="text-2xl font-serif font-semibold text-primary">
              Follow Us
            </h4>

            {/* Social Media Buttons */}
            <div className="flex justify-center lg:justify-start gap-4">
              <Button
                onClick={() => handleSocialClick("tiktok")}
                variant="outline"
                size="icon"
                className="w-12 h-12 gold-hover border-primary/30 text-primary hover:text-background hover:bg-primary transition-all duration-300"
                aria-label="Visit our TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => handleSocialClick("instagram")}
                variant="outline"
                size="icon"
                className="w-12 h-12 gold-hover border-primary/30 text-primary hover:text-background hover:bg-primary transition-all duration-300"
                aria-label="Visit our Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => handleSocialClick("facebook")}
                variant="outline"
                size="icon"
                className="w-12 h-12 gold-hover border-primary/30 text-primary hover:text-background hover:bg-primary transition-all duration-300"
                aria-label="Visit our Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Opening Hours */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-primary">Opening Hours</h5>
              <div className="space-y-2 text-foreground-muted">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">11:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span className="font-medium">10:00 AM - 12:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary/20 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-foreground-muted">
              © 2026 Mafi Restaurant. All rights reserved.
            </p>
            {/* <div className="flex items-center space-x-6 text-sm text-foreground-muted">
              <a href="#" className="hover:text-primary transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors duration-300">Cookie Policy</a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
