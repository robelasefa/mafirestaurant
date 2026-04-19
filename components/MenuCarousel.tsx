"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const menuItems = [
  {
    id: 1,
    title: "Roast Chicken",
    description:
      "Roasted boneless chicken legs served with crisp fries and seasonal vegetables, topped with your choice of tomato–garlic butter or classic pan jus.",
    image: "/images/roast-chicken.webp",
  },
  {
    id: 2,
    title: "Beef or Chicken Fajita",
    description:
      "Sizzling strips of marinated beef or chicken with peppers and onions, served with warm accompaniments for a vibrant, shareable plate.",
    image: "/images/fajita.webp",
  },
  {
    id: 3,
    title: "Rolled Beef",
    description:
      "Tender rolled beef stuffed with ricotta and spinach, served with creamy mashed potatoes and seasonal vegetables.",
    image: "/images/rolled-beef.webp",
  },
  {
    id: 4,
    title: "Fish & Chips",
    description: "Crispy battered tilapia served with fries, house tartar sauce, and a wedge of lemon.",
    image: "/images/fish-chips.webp",
  },
  {
    id: 5,
    title: "Fish Cutlet",
    description:
      "Breaded fish fillet topped with a delicate sweet-and-sour glaze, served with mashed potatoes and seasonal vegetables.",
    image: "/images/fish-cutlet.webp",
  },
  {
    id: 6,
    title: "Grilled Fish",
    description:
      "Grilled fillet of tilapia or Nile perch served with sautéed spinach, parsley potatoes, and a garlic–lemon butter or sweet-and-sour sauce.",
    image: "/images/grilled-fish.webp",
  },
  {
    id: 7,
    title: "Stuffed Chicken Breast",
    description:
      "Spinach and ricotta–stuffed chicken breast served with fragrant curry rice, seasonal vegetables, and a silky white wine cream sauce.",
    image: "/images/stuffed-chicken.webp",
  },
];

const MenuCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoSliding) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === menuItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoSliding]);

  const nextSlide = () => {
    setIsAutoSliding(false); // Pause auto-slide when user interacts
    setCurrentIndex((prevIndex) =>
      prevIndex === menuItems.length - 1 ? 0 : prevIndex + 1
    );
    // Resume auto-slide after 10 seconds
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const prevSlide = () => {
    setIsAutoSliding(false); // Pause auto-slide when user interacts
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? menuItems.length - 1 : prevIndex - 1
    );
    // Resume auto-slide after 10 seconds
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const currentItem = menuItems[currentIndex];

  return (
    <section id="menu" className="py-24 bg-background-accent relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <span className="text-primary font-medium tracking-widest uppercase text-xs md:text-sm">Our Cuisine</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-primary mb-6 leading-tight text-pretty">
            Signature Menu
          </h2>
          <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            Discover our carefully crafted dishes, each prepared with the finest
            ingredients and presented with elegance.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="w-full flex flex-col items-center">
          {/* Image Display - FIXED to show food portions */}
          <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-background-subtle group border border-primary/10">
            <Image
              src={currentItem.image}
              alt={currentItem.title}
              width={800}
              height={600}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
              style={{
                filter: "brightness(1.08) contrast(1.15) saturate(1.1)",
                objectPosition: "center bottom",
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

            {/* Floating Badge */}
            <div className="absolute top-5 right-5 bg-primary/95 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full shadow-lg border border-primary/30">
              <span className="font-semibold text-sm">Signature</span>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="group hover:bg-primary/20 border border-primary/30 hover:border-primary h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg bg-background/80 backdrop-blur-sm hover:scale-110"
              aria-label="Previous menu item"
            >
              <ChevronLeft className="h-5 w-5 text-primary group-hover:scale-110 transition-all duration-300" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2">
              {menuItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoSliding(false);
                    setTimeout(() => setIsAutoSliding(true), 10000);
                  }}
                  className={`transition-all duration-300 rounded-full focus:outline-none ${index === currentIndex
                    ? "w-6 h-1.5 bg-primary shadow-md"
                    : "w-1.5 h-1.5 bg-primary/30 hover:bg-primary/50 hover:scale-125"
                    }`}
                  aria-label={`Go to menu item ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="group hover:bg-primary/20 border border-primary/30 hover:border-primary h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg bg-background/80 backdrop-blur-sm hover:scale-110"
              aria-label="Next menu item"
            >
              <ChevronRight className="h-5 w-5 text-primary group-hover:scale-110 transition-all duration-300" />
            </Button>
          </div>

          {/* Content Display */}
          <div className="text-center mt-12 space-y-5 max-w-3xl">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary transition-all duration-500 text-pretty">
                {currentItem.title}
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto transition-all duration-500"></div>
            </div>

            <p className="text-lg md:text-xl text-foreground-muted mx-auto max-w-2xl leading-relaxed opacity-95">
              {currentItem.description}
            </p>

            {/* Menu Categories */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/30 hover:bg-primary/20 transition-colors">
                Premium
              </span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/30 hover:bg-primary/20 transition-colors">
                Fresh
              </span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/30 hover:bg-primary/20 transition-colors">
                Expert
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuCarousel;
