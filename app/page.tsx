"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutUs from "@/components/AboutUs";
import MenuCarousel from "@/components/MenuCarousel";
import MeetingHallBooking from "@/components/MeetingHallBooking";
import Footer from "@/components/Footer";
import AlertComponent from "@/components/ui/Alert";

export default function Home() {
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("bookingStatus");
    const msg = params.get("msg");

    if (status) {
      setAlert({
        type: status === "success" ? "success" : "error",
        message: msg || (status === "success" ? "Booking confirmed successfully!" : "An error occurred."),
      });

      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  return (
    <div className="bg-background min-h-screen relative">
      {alert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4">
          <AlertComponent
            title={alert.type === "success" ? "Success" : "Error"}
            description={alert.message}
            type={alert.type}
            duration={5000}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      <Navbar />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="about">
        <AboutUs />
      </div>
      <div id="menu">
        <MenuCarousel />
      </div>
      <div id="meeting-hall">
        <MeetingHallBooking />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
