"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';

interface MeetingHallBookingProps {
  id?: string;
}

const MeetingHallBooking = ({ id }: MeetingHallBookingProps) => {

  return (
    <section id={id || "meeting-hall"} className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-primary/30"></div>
            <span className="text-primary font-medium tracking-widest uppercase text-sm">
              Book Your Event
            </span>
            <div className="w-16 h-px bg-primary/30"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-3 leading-tight">
            Meeting Halls
          </h2>
          <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
            Host your corporate events, meetings, and special gatherings in
            our elegant meeting hall with state-of-the-art facilities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Meeting Hall Image */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="relative overflow-hidden rounded-[3rem] shadow-2xl group border border-primary/20">
              <Image
                src="/images/meeting-hall.png"
                alt="Mafi Restaurant Meeting Hall"
                width={1000}
                height={600}
                className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Floating Info Cards */}
              <div className="absolute bottom-8 left-8 glass rounded-2xl p-6 shadow-glow border border-primary/40 group-hover:scale-105 transition-all duration-500">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                  <div>
                    <span className="text-primary font-serif font-bold text-xl block">Capacity</span>
                    <span className="text-foreground-muted text-sm">Up to 400+ Guests</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-8 right-8 glass rounded-2xl p-6 shadow-glow border border-primary/40 group-hover:scale-105 transition-all duration-500">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                  <div>
                    <span className="text-primary font-serif font-bold text-xl block">Amenities</span>
                    <span className="text-foreground-muted text-sm">Professional Setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="order-1 lg:order-2 animate-slide-up text-left">
            <div className="max-w-xl space-y-8">
              <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">
                  Seamless Events, <br />
                  <span className="italic text-primary-light">Unforgettable Memories</span>
                </h3>
                <div className="w-24 h-1 bg-primary rounded-full" />
              </div>

              <p className="text-xl text-foreground-muted leading-relaxed font-light">
                Our versatile meeting spaces are designed to inspire. From corporate seminars to grand celebrations, we provide the perfect backdrop for your most important moments.
              </p>

              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="glass p-4 rounded-xl border-primary/20">
                  <p className="text-primary font-bold">Audio Visual</p>
                  <p className="text-sm text-foreground-muted">State-of-the-art tech</p>
                </div>
                <div className="glass p-4 rounded-xl border-primary/20">
                  <p className="text-primary font-bold">Catering</p>
                  <p className="text-sm text-foreground-muted">Customized menus</p>
                </div>
              </div>

              <Button
                variant="gold"
                size="lg"
                className="w-full md:w-auto px-12 text-xl py-6 h-auto shadow-gold hover:shadow-glow transition-all duration-500 transform hover:scale-105 rounded-full font-bold tracking-widest uppercase"
                asChild
              >
                <Link href="/booking" prefetch={true}>Reserve the Hall</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingHallBooking;
