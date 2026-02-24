"use client";

import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 md:pt-24 lg:pt-28">

      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat cursor-pointer group transition-transform duration-1000 hover:scale-105"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
        }}
        onClick={() => {
          const menuSection = document.getElementById("menu");
          if (menuSection) menuSection.scrollIntoView({ behavior: "smooth" });
        }}
        title="View Menu"
      />

      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />

      {/* Hero Content with Layout */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 animate-slide-up">
        {/* Main Heading with Enhanced Typography */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary via-primary-glow to-primary" />
          <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary mb-6 leading-tight tracking-tight animate-fade-in">
            Mafi Restaurant
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
            <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        </div>

        {/* Enhanced Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-foreground-muted mb-16 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
          Experience luxury dining with exquisite cuisine and elegant atmosphere
          in the heart of <span className="text-primary font-medium">Adama, Ethiopia</span>
        </p>

        {/* Enhanced Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <Button
            variant="gold"
            size="lg"
            className="text-base md:text-lg px-10 py-6 h-auto font-semibold tracking-wide shadow-gold hover:shadow-glow transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shine-effect group"
            onClick={() => {
              const menuSection = document.getElementById("menu");
              if (menuSection)
                menuSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="relative z-10">Explore Our Menu</span>
          </Button>
          <Button
            variant="luxury"
            size="lg"
            className="text-base md:text-lg px-10 py-6 h-auto font-semibold tracking-wide shadow-elegant hover:shadow-gold transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shine-effect group"
            onClick={() => {
              const hallSection = document.getElementById("reservation");
              if (hallSection)
                hallSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="relative z-10">Book Meeting Hall</span>
          </Button>
        </div>

        {/* Enhanced Feature Highlights */}
        <div className="hidden lg:grid grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center group">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Star className="h-9 w-9 text-primary group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-primary-glow transition-colors duration-300">Premium Quality</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Finest ingredients and authentic flavors
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <MapPin className="h-9 w-9 text-primary group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-primary-glow transition-colors duration-300">Prime Location</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Heart of Adama with easy accessibility
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Clock className="h-9 w-9 text-primary group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-primary-glow transition-colors duration-300">Elegant Atmosphere</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Sophisticated dining environment
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
