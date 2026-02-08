"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from 'next/image';

const MeetingHallBooking = () => {
  const router = useRouter();

  return (
    <section id="reservation" className="py-20 bg-background relative overflow-hidden">
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

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Meeting Hall Image */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <Image
  src="/lovable-uploads/75f0a2e1-ceb5-407b-bd2a-4b02d7c7d5e0.png"
  alt="Mafi Restaurant Meeting Hall"
  width={1000}
  height={500}
  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Floating Info Cards */}
              <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-primary font-semibold text-sm">Capacity: 400+ People</span>
                </div>
              </div>

              <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-primary font-semibold text-sm">Professional Setup</span>
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
                onClick={() => router.push("/booking")}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingHallBooking;
