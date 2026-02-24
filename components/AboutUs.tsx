"use client";

import { useState } from "react";
import { Award, Clock, MapPin, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface AboutUsProps {
  id?: string;
}

const AboutUs = ({ id }: AboutUsProps) => {
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
    <section id={id || "about"} className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-primary/30"></div>
            <span className="text-primary font-medium tracking-widest uppercase text-sm">Discover</span>
            <div className="w-16 h-px bg-primary/30"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-3 leading-tight">
            Who We Are
          </h2>
          <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
            Experience the passion, tradition, and innovation that makes Mafi Restaurant a culinary destination in Adama, Ethiopia.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="glass p-8 rounded-3xl text-center group hover:scale-105 transition-all duration-500">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:rotate-12 transition-all duration-300">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-serif font-bold text-primary mb-2 tracking-tight">{stat.value}</div>
              <div className="text-foreground-muted text-sm uppercase tracking-widest font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/images/meeting-hall.png"
                  alt="Mafi Restaurant Interior"
                  width={1000}
                  height={500}
                  className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-primary/90 backdrop-blur-sm text-primary-foreground px-6 py-3 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">Since 2017</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 animate-slide-up">
            <div className="space-y-8">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-4 glass p-2 rounded-full w-fit">
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
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="space-y-6 min-h-[300px]">
                {activeTab === "story" && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-4xl font-serif font-bold text-primary leading-tight">Our Culinary Journey</h3>
                    <div className="space-y-6 text-lg text-foreground-muted leading-relaxed italic">
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
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-4xl font-serif font-bold text-primary leading-tight">Recognition & Awards</h3>
                    <div className="space-y-6">
                      <div className="glass p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-colors">
                        <h4 className="text-lg font-semibold text-primary">World Health Organization (WHO)</h4>
                        <p className="text-sm text-foreground-muted">Awarded for excellence in hygiene and food safety standards.</p>
                      </div>

                      <div className="glass p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-colors">
                        <h4 className="text-lg font-semibold text-primary">Ethiopian Electric Service</h4>
                        <p className="text-sm text-foreground-muted">Recognized for outstanding operational standards.</p>
                      </div>

                      <div className="glass p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-colors">
                        <h4 className="text-lg font-semibold text-primary">Adama City Administration</h4>
                        <p className="text-sm text-foreground-muted">Honored for contributions to the city&apos;s hospitality sector.</p>
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
