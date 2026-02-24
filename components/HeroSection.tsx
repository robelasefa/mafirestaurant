"use client";

import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 md:pt-24 lg:pt-28">

      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat cursor-pointer group transition-transform duration-700 hover:scale-105"
        style={{
          backgroundImage:
            "url('/images/hero-bg.png')",
        }}
        onClick={() => {
          const menuSection = document.getElementById("menu");
          if (menuSection) menuSection.scrollIntoView({ behavior: "smooth" });
        }}
        title="View Menu"
      />

      {/* Gradient Overlay with Multiple Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Hero Content with Layout */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 animate-slide-up">
        {/* Main Heading with Typography */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary mb-4 leading-tight tracking-tight">
            Mafi Restaurant
          </h1>
        </div>

        {/* Subtitle with Better Typography */}
        <p className="text-lg md:text-xl lg:text-2xl text-foreground-muted mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Experience luxury dining with exquisite cuisine and elegant atmosphere
          in the heart of Adama, Ethiopia
        </p>

        {/* Buttons with Better Spacing and Icons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button
            variant="gold"
            size="lg"
            className="text-base md:text-lg px-8 py-4 h-auto font-semibold tracking-wide shadow-gold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
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
            className="text-base md:text-lg px-8 py-4 h-auto font-semibold tracking-wide shadow-elegant hover:shadow-gold transition-all duration-300 transform hover:scale-105"
            onClick={() => {
              const hallSection = document.getElementById("reservation");
              if (hallSection)
                hallSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Book Meeting Hall
          </Button>
        </div>

        {/* Feature Highlights - Visible only on larger devices */}
        <div className="hidden lg:grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors duration-300">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Premium Quality</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Finest ingredients and authentic flavors
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors duration-300">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Prime Location</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Heart of Adama with easy accessibility
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors duration-300">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Elegant Atmosphere</h3>
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
