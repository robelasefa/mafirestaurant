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
      "mixed lamb, chicken, sausage, steak served with roasted tomatoes and french fries topped with red wine sauce",
    image: "/images/mixed-grill.png",
  },
  {
    id: 2,
    title: "Roast Chicken",
    description:
      "roasted boneless chicken legs served with french fries and seasonal vegetables topped with french fries or tomato garlic butter sauce",
    image: "/images/roast-chicken.png",
  },
  {
    id: 3,
    title: "Beef or Chicken Fajita",
    description:
      "mixed lamb or chicken sausage, steak served with roasted tomatoes and french fries topped with red wine sauce",
    image: "/images/fajita.png",
  },
  {
    id: 4,
    title: "Rolled Beef",
    description:
      "mafi beef rolle stuffed with ricotta cheese and spinach served with mashed potatoes and seasonal vegetables",
    image: "/images/rolled-beef.png",
  },
  {
    id: 5,
    title: "Fish & Chips",
    description: "fried tilapia served with french fries and tartar sauce",
    image: "/images/fish-chips.png",
  },
  {
    id: 6,
    title: "Fish Cutlet",
    description:
      "breaded fish fillet topped with sweet or sour sauce served with mashed potatoes and seasonal vegetables",
    image: "/images/fish-cutlet.png",
  },
  {
    id: 7,
    title: "Grilled Fish",
    description:
      "grilled catch of the trillet of tilapia or nile perch served with spinach and parsley potato with garlic lemon butter sauce or sweet and sour sauce",
    image: "/images/grilled-fish.png",
  },
  {
    id: 8,
    title: "Stuffed Chicken Breast",
    description:
      "spinach and ricotta cheese stuffed chicken breast served with curry rice and seasonal vegetables topped with creamy white wine sauce",
    image: "/images/stuffed-chicken.png",
  },
];

interface MenuCarouselProps {
  id?: string;
}

const MenuCarousel = ({ id }: MenuCarouselProps) => {
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
    <section id={id || "menu"} className="py-20 bg-background-accent">
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
          <div className="relative w-full max-w-2xl aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl bg-black border border-primary/20 group">
            <Image
              key={currentItem.image}
              src={currentItem.image}
              alt={currentItem.title}
              width={1000}
              height={625}
              className="w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-110"
              style={{
                filter: "brightness(1.1) contrast(1.1) saturate(1.1)",
                objectPosition: "center",
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Floating Badge */}
            <div className="absolute top-6 right-6 glass px-4 py-2 rounded-full shadow-gold animate-glow">
              <span className="font-serif font-bold text-sm tracking-widest text-primary uppercase">Chef&apos;s Special</span>
            </div>

            {/* Price/Tag Overlay */}
            <div className="absolute bottom-6 left-6 glass px-4 py-2 rounded-xl">
               <span className="text-primary font-bold">Premium Selection</span>
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
          <div className="text-center mt-12 space-y-4 max-w-3xl animate-fade-in" key={currentItem.id}>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary tracking-tight">
                {currentItem.title}
              </h3>
              <div className="w-32 h-1 bg-primary mx-auto rounded-full" />
            </div>

            <p className="text-lg md:text-xl text-foreground-muted mx-auto max-w-2xl leading-relaxed font-light italic">
              &quot;{currentItem.description}&quot;
            </p>

            {/* Menu Categories */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {["Authentic", "Gourmet", "Signature"].map((tag) => (
                <span key={tag} className="glass px-4 py-1 text-primary rounded-full text-sm font-semibold tracking-widest uppercase border border-primary/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuCarousel;
