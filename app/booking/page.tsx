"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";

export default function Booking() {
  useEffect(() => {
    document.title = "Booking | Mafi Restaurant";
  }, []);

  return (
    <div className="bg-background">
      <Navbar />
      <main>
        <section className="py-20 bg-background-accent">
          <div className="max-w-3xl mx-auto px-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-3 text-center">
              Book Our Meeting Hall
            </h2>
            <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto mb-10 leading-8 text-center">
              We offer <strong>5 meeting halls</strong> — one large hall that
              accommodates approximately <strong>200 guests</strong>, and four
              smaller halls each holding around <strong>50 guests</strong>.
              Perfect for corporate meetings, workshops, and special
              celebrations.
            </p>
            <div className="flex justify-center mb-10">
              <div className="relative overflow-hidden rounded-2xl shadow-elegant">
                <Image
                  src="/images/meeting-hall.webp"
                  alt="Mafi Restaurant Meeting Hall"
                  width={600}
                  height={300}
                  className="block w-full max-w-xl h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>
            <BookingForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
