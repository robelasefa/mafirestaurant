"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';

const MeetingHallBooking = () => {

  return (
    <section id="reservation" className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <span className="text-primary font-medium tracking-widest uppercase text-xs md:text-sm">
              Book Your Event
            </span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-primary mb-6 leading-tight text-pretty">
            Premium Event Spaces
          </h2>
          <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
            Host your corporate events, meetings, and special gatherings in
            our elegant meeting halls with state-of-the-art facilities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Meeting Hall Image */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group border border-primary/10">
              <Image
                src="/images/meeting-hall.webp"
                alt="Mafi Restaurant Meeting Hall"
                width={1000}
                height={500}
                className="w-full h-[550px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Floating Info Cards */}
              <div className="absolute bottom-8 left-8 bg-background/95 backdrop-blur-md rounded-lg p-5 shadow-lg border border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-primary font-semibold">Capacity: 400+ People</span>
                </div>
              </div>

              <div className="absolute top-8 right-8 bg-background/95 backdrop-blur-md rounded-lg p-5 shadow-lg border border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-primary font-semibold">Professional Setup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="order-1 lg:order-2 animate-slide-up text-center">
            <div className="max-w-lg mx-auto space-y-6">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary">
                Ready to Book?
              </h3>
              <p className="text-foreground-muted">
                Click below to start your booking process
              </p>

              <Button
                variant="gold"
                size="lg"
                className="w-full text-base py-4 h-auto shadow-gold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <Link href="/booking" prefetch={true}>Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingHallBooking;
