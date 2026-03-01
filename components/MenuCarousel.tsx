"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const menuItems = [
  {
    id: 1,
    title: "Mixed Grill",
    description:
      "Mixed lamb, chicken, sausage, and steak served with roasted tomatoes and golden fries, finished with a rich red wine sauce.",
    image: "/images/mixed-grill.webp",
  },
  {
    id: 2,
    title: "Roast Chicken",
    description:
      "Roasted boneless chicken legs served with crisp fries and seasonal vegetables, topped with your choice of tomato–garlic butter or classic pan jus.",
    image: "/images/roast-chicken.webp",
  },
  {
    id: 3,
    title: "Beef or Chicken Fajita",
    description:
      "Sizzling strips of marinated beef or chicken with peppers and onions, served with warm accompaniments for a vibrant, shareable plate.",
    image: "/images/fajita.webp",
  },
  {
    id: 4,
    title: "Rolled Beef",
    description:
      "Tender rolled beef stuffed with ricotta and spinach, served with creamy mashed potatoes and seasonal vegetables.",
    image: "/images/rolled-beef.webp",
  },
  {
    id: 5,
    title: "Fish & Chips",
    description: "Crispy battered tilapia served with fries, house tartar sauce, and a wedge of lemon.",
    image: "/images/fish-chips.webp",
  },
  {
    id: 6,
    title: "Fish Cutlet",
    description:
      "Breaded fish fillet topped with a delicate sweet-and-sour glaze, served with mashed potatoes and seasonal vegetables.",
    image: "/images/fish-cutlet.webp",
  },
  {
    id: 7,
    title: "Grilled Fish",
    description:
      "Grilled fillet of tilapia or Nile perch served with sautéed spinach, parsley potatoes, and a garlic–lemon butter or sweet-and-sour sauce.",
    image: "/images/grilled-fish.webp",
  },
  {
    id: 8,
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
    <section id="menu" className="py-20 bg-background-accent">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-primary/30"></div>
            <span className="text-primary font-medium tracking-widest uppercase text-sm">Our Cuisine</span>
            <div className="w-16 h-px bg-primary/30"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-3 leading-tight">
            Signature Menu
          </h2>
          <p className="text-base md:text-lg text-foreground-muted max-w-xl mx-auto leading-relaxed">
            Discover our carefully crafted dishes, each prepared with the finest
            ingredients and presented with elegance
          </p>
        </div>

        {/* Carousel Container */}
        <div className="w-full flex flex-col items-center">
          {/* Image Display - FIXED to show food portions */}
          <div className="relative w-full max-w-lg aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-background-subtle group">
            <Image
              src={currentItem.image}
              alt={currentItem.title}
              width={800} // Set the actual width in px if known
              height={600} // Or 4:3 aspect from the parent div
              className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
              style={{
                filter: "brightness(1.05) contrast(1.1) saturate(1.05)",
                objectPosition: "center bottom",
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

            {/* Floating Badge */}
            <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-full shadow-md">
              <span className="font-semibold text-xs">Signature</span>
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
          <div className="text-center mt-8 space-y-3 max-w-2xl">
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-primary transition-all duration-500">
                {currentItem.title}
              </h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto transition-all duration-500"></div>
            </div>

            <p className="text-sm md:text-base text-foreground-muted mx-auto max-w-lg leading-relaxed opacity-90">
              {currentItem.description}
            </p>

            {/* Menu Categories */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
                Premium
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
                Fresh
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
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
