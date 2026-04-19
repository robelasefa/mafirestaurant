"use client";

import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 md:pt-24 lg:pt-28">

      <video
        src="/videos/hero-bg.mp4"
        poster="/images/hero-first-frame.webp"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover cursor-pointer group transition-transform duration-700 hover:scale-110"
        onClick={() => {
          const menuSection = document.getElementById("menu");
          if (menuSection) menuSection.scrollIntoView({ behavior: "smooth" });
        }}
        title="View Menu"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 animate-slide-up space-y-8">
        {/* Overline */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          <span className="text-primary font-medium tracking-widest uppercase text-xs md:text-sm">Luxury Dining Experience</span>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        </div>

        {/* Main Heading */}
        <div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary mb-6 leading-tight tracking-tight text-pretty">
            Mafi <br className="hidden md:block" />Restaurant
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary/50 mx-auto mb-8"></div>
        </div>

        <p className="text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-3xl mx-auto font-light leading-relaxed">
          Where authentic Ethiopian tradition meets contemporary elegance. An unforgettable culinary journey in the heart of Adama.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Button
            variant="gold"
            size="lg"
            className="text-base md:text-lg px-10 py-4 h-14 font-semibold tracking-wide shadow-gold hover:shadow-glow transition-all duration-300 transform hover:scale-105 interactive-element"
            onClick={() => {
              const menuSection = document.getElementById("menu");
              if (menuSection)
                menuSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Our Menu
          </Button>
          <Button
            variant="luxury"
            size="lg"
            className="text-base md:text-lg px-10 py-4 h-14 font-semibold tracking-wide shadow-elegant hover:shadow-gold transition-all duration-300 transform hover:scale-105 interactive-element"
            onClick={() => {
              const hallSection = document.getElementById("meeting-hall");
              if (hallSection)
                hallSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Reserve Event Space
          </Button>
        </div>

        <div className="hidden lg:grid grid-cols-3 gap-8 max-w-5xl mx-auto pt-12">
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-all duration-300">
              <Star className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Premium Quality</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Finest ingredients and authentic flavors crafted with precision
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-all duration-300">
              <MapPin className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Prime Location</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Heart of Adama with sophisticated ambiance
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-all duration-300">
              <Clock className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Elegant Atmosphere</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Refined dining for every occasion
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
