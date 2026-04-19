"use client";

import { useState } from "react";
import { Award, Clock, MapPin, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("story");

  const tabs = [
    { id: "story", label: "Our Story", icon: Heart },
    { id: "awards", label: "Awards", icon: Award },
  ];

  const stats = [
    { icon: Clock, value: "7+", label: "Years of Excellence" },
    { icon: MapPin, value: "Adama", label: "Prime Location" },
  ];

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <span className="text-primary font-medium tracking-widest uppercase text-xs md:text-sm">Discover</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-primary mb-6 leading-tight text-pretty">
            Who We Are
          </h2>
          <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
            Experience the passion, tradition, and innovation that makes Mafi Restaurant a culinary destination in Adama, Ethiopia.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 py-12 border-y border-primary/10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/15 transition-all duration-300">
                <stat.icon className="h-10 w-10 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-foreground-muted text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
          {/* Image */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <Image
                  src="/images/meeting-hall.webp"
                  alt="Mafi Restaurant Interior"
                  width={1000}
                  height={500}
                  className="w-full h-[550px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -right-8 bg-primary/95 backdrop-blur-sm text-primary-foreground px-8 py-4 rounded-full shadow-lg border border-primary/30">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6" />
                  <span className="font-semibold">Since 2017</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 animate-slide-up">
            <div className="space-y-8">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-gold"
                        : "bg-background-subtle text-foreground-muted hover:bg-primary/10 hover:text-primary border border-primary/20"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === "story" && (
                  <div className="space-y-6">
                    <h3 className="text-4xl font-serif font-bold text-primary">Our Culinary Journey</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-primary via-primary to-primary/50"></div>
                    <div className="space-y-5 text-foreground-muted leading-relaxed text-lg">
                      <p>
                        Founded in 2017, Mafi Restaurant began as a dream to bring authentic Ethiopian cuisine
                        with a modern twist to the heart of Adama. Our mission: to create memorable dining
                        experiences that celebrate both tradition and innovation.
                      </p>
                      <p>
                        Today, we&apos;ve become a beloved destination for locals and visitors alike, known for our
                        commitment to quality ingredients, exceptional service, and warm hospitality.
                      </p>
                      <p>
                        Combining the rich flavors of Ethiopian cuisine with contemporary dining aesthetics,
                        we create an atmosphere where every meal becomes a celebration of culture and community.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "awards" && (
                  <div className="space-y-6">
                    <h3 className="text-4xl font-serif font-bold text-primary">Recognition & Awards</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-primary via-primary to-primary/50"></div>
                    <div className="space-y-5">
                      <div className="bg-background-subtle/30 p-7 rounded-lg border border-primary/20 hover:border-primary/40 hover:bg-background-subtle/50 transition-all duration-300 group">
                        <h4 className="text-lg font-semibold text-primary mb-2 group-hover:text-primary-glow transition-colors">World Health Organization (WHO)</h4>
                        <p className="text-base text-foreground-muted">Awarded for excellence in hygiene and food safety standards.</p>
                      </div>

                      <div className="bg-background-subtle/30 p-7 rounded-lg border border-primary/20 hover:border-primary/40 hover:bg-background-subtle/50 transition-all duration-300 group">
                        <h4 className="text-lg font-semibold text-primary mb-2 group-hover:text-primary-glow transition-colors">Ethiopian Electric Service</h4>
                        <p className="text-base text-foreground-muted">Recognized for outstanding operational standards.</p>
                      </div>

                      <div className="bg-background-subtle/30 p-7 rounded-lg border border-primary/20 hover:border-primary/40 hover:bg-background-subtle/50 transition-all duration-300 group">
                        <h4 className="text-lg font-semibold text-primary mb-2 group-hover:text-primary-glow transition-colors">Adama City Administration</h4>
                        <p className="text-base text-foreground-muted">Honored for contributions to the city&apos;s hospitality sector.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Call to Action */}
              <div className="pt-6">
                <Button
                  variant="gold"
                  size="lg"
                  className="text-lg py-4 px-8 shadow-gold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    const menuSection = document.getElementById("menu");
                    if (menuSection) menuSection.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore Our Menu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
