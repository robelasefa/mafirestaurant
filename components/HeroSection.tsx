"use client";

import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 md:pt-24 lg:pt-28">

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
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold text-primary mb-4 leading-tight tracking-tight drop-shadow-2xl">
            Mafi Restaurant
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full animate-glow" />
        </div>

        {/* Subtitle with Better Typography */}
        <p className="text-lg md:text-2xl lg:text-3xl text-foreground-muted mb-12 max-w-4xl mx-auto font-light leading-relaxed drop-shadow-lg">
          Experience luxury dining with <span className="text-primary font-medium italic">exquisite cuisine</span> and elegant atmosphere
          in the heart of Adama, Ethiopia
        </p>

        {/* Buttons with Better Spacing and Icons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button
            variant="gold"
            size="lg"
            className="text-lg md:text-xl px-10 py-6 h-auto font-bold tracking-widest shadow-gold hover:shadow-glow transition-all duration-500 transform hover:scale-110 active:scale-95 rounded-full"
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
            className="text-lg md:text-xl px-10 py-6 h-auto font-bold tracking-widest shadow-elegant hover:shadow-gold transition-all duration-500 transform hover:scale-110 active:scale-95 rounded-full"
            onClick={() => {
              const hallSection = document.getElementById("meeting-hall");
              if (hallSection)
                hallSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Book Meeting Hall
          </Button>
        </div>

        {/* Feature Highlights - Visible only on larger devices */}
        <div className="hidden lg:grid grid-cols-3 gap-12 max-w-5xl mx-auto pt-8">
          <div className="flex flex-col items-center text-center group animate-float" style={{ animationDelay: '0s' }}>
            <div className="w-20 h-20 bg-primary/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-500 transform group-hover:rotate-12">
              <Star className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-bold text-primary mb-3">Premium Quality</h3>
            <p className="text-base text-foreground-muted leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              Finest ingredients and authentic flavors crafted by experts
            </p>
          </div>

          <div className="flex flex-col items-center text-center group animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-20 h-20 bg-primary/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-500 transform group-hover:-rotate-12">
              <MapPin className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-bold text-primary mb-3">Prime Location</h3>
            <p className="text-base text-foreground-muted leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              Located in the heart of Adama with easy accessibility for all
            </p>
          </div>

          <div className="flex flex-col items-center text-center group animate-float" style={{ animationDelay: '2s' }}>
            <div className="w-20 h-20 bg-primary/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-500 transform group-hover:rotate-12">
              <Clock className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-bold text-primary mb-3">Elegant Atmosphere</h3>
            <p className="text-base text-foreground-muted leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              Sophisticated dining environment designed for your comfort
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
