"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Image from 'next/image';


const Footer = () => {
  const handleMapClick = () => {
    // Opens Google Maps with Mafi Restaurant location (placeholder coordinates)
    window.open("https://maps.google.com/?q=Mafi+Restaurant", "_blank");
  };

  const handleSocialClick = (platform: string) => {
    // Placeholder social media links
    const links = {
      instagram: "https://instagram.com/mafirestaurant",
      tiktok: "https://tiktok.com/@mafirestaurant",
      facebook: "https://facebook.com/mafirestaurant",
    };
    window.open(links[platform as keyof typeof links], "_blank");
  };

  return (
    <footer id="contact" className="bg-background-accent border-t border-primary/20 py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-primary/30"></div>
            <span className="text-primary font-medium tracking-widest uppercase text-sm">Get In Touch</span>
            <div className="w-16 h-px bg-primary/30"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-3 leading-tight">
            Contact Us
          </h2>
          <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
            Experience luxury dining with exquisite cuisine and elegant atmosphere in the heart of Adama, Ethiopia.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16 text-center lg:text-left">
          {/* Logo and Description */}
          <div className="space-y-8 glass p-10 rounded-[3rem] border-primary/10">
            <div className="flex justify-center lg:justify-start">
              <div className="relative group">
                <Image
                  src="/images/logo.png"
                  alt="Mafi Restaurant Logo"
                  width={100}
                  height={100}
                  className="h-24 w-24 object-cover rounded-full border-2 border-primary transition-all duration-500 group-hover:border-primary-light group-hover:scale-110 group-hover:rotate-12"
                />
                <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-serif font-bold text-primary tracking-tight">
                Mafi Restaurant
              </h3>
              <p className="text-foreground-muted leading-relaxed text-lg italic">
                &quot;Where tradition meets luxury, creating unforgettable culinary journeys in the heart of Adama.&quot;
              </p>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="flex flex-col items-center lg:items-start space-y-8">
            <h4 className="text-2xl font-serif font-semibold text-primary">
              Contact & Location
            </h4>
            <div className="space-y-6">
              {/* Phone Numbers */}
              <div className="flex items-center gap-4 text-foreground-muted group glass p-4 rounded-2xl border-primary/10 hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <Phone className="h-6 w-6 text-primary group-hover:text-background transition-colors" />
                </div>
                <div className="flex flex-col">
                  <p className="text-primary font-bold tracking-wider">
                    +251 945 184 545
                  </p>
                  <p className="text-sm opacity-70">
                    Direct Reservation Line
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 text-foreground-muted group">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <p className="hover:text-primary transition-colors duration-300 font-medium">
                  Adama, Ethiopia
                </p>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 text-foreground-muted group">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <a
                  href="mailto:mafirestaurant@gmail.com"
                  className="hover:text-primary transition-colors duration-300 font-medium"
                >
                  mafirestaurant@gmail.com
                </a>
              </div>
            </div>

            <Button
              onClick={handleMapClick}
              variant="gold"
              className="flex items-center gap-3 px-6 py-3 shadow-gold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              <MapPin className="h-5 w-5" />
              View on Map
            </Button>
          </div>

          {/* Social Media & Hours */}
          <div className="space-y-8">
            <h4 className="text-2xl font-serif font-semibold text-primary">
              Follow Us
            </h4>

            {/* Social Media Buttons */}
            <div className="flex justify-center lg:justify-start gap-4">
              <Button
                onClick={() => handleSocialClick("tiktok")}
                variant="outline"
                size="icon"
                className="w-12 h-12 gold-hover border-primary/30 text-primary hover:text-background hover:bg-primary transition-all duration-300 transform hover:scale-110"
              >
                <FaTiktok className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => handleSocialClick("instagram")}
                variant="outline"
                size="icon"
                className="w-12 h-12 gold-hover border-primary/30 text-primary hover:text-background hover:bg-primary transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => handleSocialClick("facebook")}
                variant="outline"
                size="icon"
                className="w-12 h-12 gold-hover border-primary/30 text-primary hover:text-background hover:bg-primary transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebook className="h-5 w-5" />
              </Button>
            </div>

            {/* Opening Hours */}
            <div className="space-y-6 glass p-8 rounded-3xl border-primary/10">
              <h5 className="text-2xl font-serif font-bold text-primary tracking-wide">Opening Hours</h5>
              <div className="space-y-4 text-foreground-muted">
                <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                  <span className="font-medium">Mon - Fri</span>
                  <span className="text-primary font-bold">11:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                  <span className="font-medium">Sat - Sun</span>
                  <span className="text-primary font-bold">10:00 AM - 12:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary/20 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-foreground-muted">
              © 2025 Mafi Restaurant. All rights reserved.
            </p>
            {/* <div className="flex items-center space-x-6 text-sm text-foreground-muted">
              <a href="#" className="hover:text-primary transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors duration-300">Cookie Policy</a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
