"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/components/providers/AlertProvider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import dynamic from "next/dynamic";

const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((mod) => mod.Calendar),
  { ssr: false, loading: () => <div className="p-4 text-center text-sm text-foreground-muted">Loading calendar...</div> }
);

export default function Booking() {
  useEffect(() => {
    document.title = "Booking | Mafi Restaurant";
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    bookingAt: "",
    purpose: "",
  });
  const [letterFile, setLetterFile] = useState<File | null>(null);

  const router = useRouter();
  const { showAlert } = useAlert();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Please enter your full name.";
        else if (value.trim().length < 3) error = "Name must be at least 3 characters.";
        break;

      case "email":
        if (!value) error = "Email is required.";
        else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) error = "Enter a valid email address.";
        }
        break;

      case "phone":
        if (!value) error = "Phone number is required.";
        else {
          const phoneRegex = /^0(9|7)\d{2}\d{3}\d{3}$/;
          if (!phoneRegex.test(value)) error = "Enter a valid Ethiopian phone number.";
        }
        break;

      case "bookingAt":
        if (!value) error = "Please select a date and time.";
        else {
          const selectedDate = new Date(value);
          if (isNaN(selectedDate.getTime())) {
            error = "Invalid date format.";
          } else if (selectedDate < new Date()) {
            error = "Booking date must be in the future.";
          }
        }
        break;

      case "purpose":
        if (!value.trim()) error = "Purpose is required.";
        else if (value.trim().length < 10) error = "Please provide more details (min 10 chars).";
        break;
    }

    return error;
  };



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const isFormValid =
    Object.values(errors).every((err) => err === "") &&
    ["name", "email", "bookingAt", "purpose"].every(
      (field) => formData[field as keyof typeof formData].trim() !== ""
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((field) => {
      newErrors[field] = validateField(
        field,
        formData[field as keyof typeof formData]
      );
    });
    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      )
    );
    if (Object.values(newErrors).some((err) => err)) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      if (letterFile && formData.organization) {
        submitData.append("letter", letterFile);
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          organization: "",
          bookingAt: "",
          purpose: "",
        });
        setLetterFile(null);

        showAlert(
          "success",
          "Booking Request Sent",
          "Your request is pending approval."
        );
        router.push("/");
      } else {
        throw new Error(data.error || "Failed to submit booking");
      }
    } catch (error: unknown) {
      showAlert(
        "error",
        "Booking Failed",
        (error as Error)?.message || "Please try again or contact us."
      );
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen selection:bg-primary selection:text-black">
      <Navbar />
      <main className="pt-32 pb-24 relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        <section className="relative z-10 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header Content */}
            <div className="text-center mb-16 animate-slide-up">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-6 leading-tight">
                Reserve Your Horizon
              </h1>
              <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed italic font-light">
                Experience the pinnacle of hospitality. Our five distinguished halls offer bespoke environments for up to 200 guests.
              </p>
            </div>

            {/* Feature Image */}
            <div className="flex justify-center mb-20 animate-slide-up delay-100">
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group border border-primary/20">
                <Image
                  src="/images/meeting-hall.png"
                  alt="Mafi Restaurant Meeting Hall"
                  width={800}
                  height={400}
                  className="block w-full max-w-2xl h-80 object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full text-center">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] drop-shadow-lg">Grand Horizon Suites</span>
                </div>
              </div>
            </div>

            {/* Booking Form Card */}
            <div className="glass-dark rounded-[3rem] shadow-elegant p-8 md:p-16 border border-primary/20 relative animate-slide-up delay-200">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

              <div className="mb-12 text-center">
                <h3 className="text-2xl font-serif font-bold text-primary mb-2 uppercase tracking-widest">Inquiry Form</h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-[1px] bg-primary/30" />
                  <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Required Fields Marked *</span>
                  <div className="w-8 h-[1px] bg-primary/30" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  {/* Full Name */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary ml-1">
                      Guest Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      className="rounded-2xl h-12"
                      placeholder="Ex. Julian Vance"
                    />
                    {errors.name && touched.name && (
                      <p className="text-[10px] text-amber-500 uppercase tracking-widest ml-1 font-bold animate-pulse">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary ml-1">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      className="rounded-2xl h-12"
                      placeholder="name@example.com"
                    />
                    {errors.email && touched.email && (
                      <p className="text-[10px] text-amber-500 uppercase tracking-widest ml-1 font-bold animate-pulse">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Phone */}
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary ml-1">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      className="rounded-2xl h-12"
                      placeholder="+251 9XX XXX XXX"
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-[10px] text-amber-500 uppercase tracking-widest ml-1 font-bold animate-pulse">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Organization */}
                  <div className="space-y-3">
                    <Label htmlFor="organization" className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary ml-1">
                      Organization
                    </Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="rounded-2xl h-12"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-3">
                  <Label htmlFor="bookingAt" className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary ml-1">
                    Event Schedule *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="luxury"
                        className="w-full justify-start text-left h-14 rounded-2xl px-6 border-primary/20 glass hover:border-primary/50 group"
                      >
                        <span className="flex items-center gap-3 text-sm font-medium">
                          <span className="text-primary group-hover:scale-110 transition-transform">📅</span>
                          {formData.bookingAt ? (
                            <span className="text-foreground-accent">
                              {new Date(formData.bookingAt).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          ) : (
                            <span className="text-foreground-muted/50 font-light italic tracking-widest">SELECT DATE AND TIME</span>
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-primary/30 shadow-2xl rounded-3xl overflow-hidden glass-dark" align="center">
                      <div className="p-6">
                        <Calendar
                          mode="single"
                          selected={formData.bookingAt ? new Date(formData.bookingAt) : undefined}
                          onSelect={(date) => {
                            if (!date) return;
                            const withTime = new Date(date);
                            if (!formData.bookingAt) withTime.setHours(12, 0, 0, 0);
                            else {
                              const prev = new Date(formData.bookingAt);
                              withTime.setHours(prev.getHours(), prev.getMinutes());
                            }
                            handleInputChange({
                              target: { name: "bookingAt", value: withTime.toISOString() },
                            } as React.ChangeEvent<HTMLInputElement>);
                          }}
                        />
                      </div>
                      <div className="p-6 border-t border-primary/10 bg-primary/5">
                        <Label className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 block">Configure Time</Label>
                        <Input
                          type="time"
                          value={formData.bookingAt ? new Date(formData.bookingAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "12:00"}
                          onChange={(e) => {
                            if (!formData.bookingAt) return;
                            const newDate = new Date(formData.bookingAt);
                            const [h, m] = e.target.value.split(":").map(Number);
                            newDate.setHours(h, m, 0, 0);
                            handleInputChange({
                              target: { name: "bookingAt", value: newDate.toISOString() },
                            } as React.ChangeEvent<HTMLInputElement>);
                          }}
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  {errors.bookingAt && touched.bookingAt && (
                    <p className="text-[10px] text-amber-500 uppercase tracking-widest ml-1 font-bold animate-pulse">
                      {errors.bookingAt}
                    </p>
                  )}
                </div>

                {/* Purpose */}
                <div className="space-y-3">
                  <Label htmlFor="purpose" className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary ml-1">
                    Event Description *
                  </Label>
                  <Textarea
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={4}
                    required
                    placeholder="Describe the nature of your gathering..."
                    className="rounded-[2rem] p-6 min-h-[160px]"
                  />
                  {errors.purpose && touched.purpose && (
                    <p className="text-[10px] text-amber-500 uppercase tracking-widest ml-1 font-bold animate-pulse">
                      {errors.purpose}
                    </p>
                  )}
                </div>

                {/* Upload Letter (Only show if organization is provided) */}
                {formData.organization.trim() && (
                  <div className="space-y-3 animate-slide-up">
                    <Label htmlFor="letter" className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary ml-1">
                      Official Authorization (PDF/Image)
                    </Label>
                    <div className="relative">
                      <Input
                        id="letter"
                        name="letter"
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={(e) => setLetterFile(e.target.files?.[0] || null)}
                        className="rounded-2xl h-14 pt-4 px-6 cursor-pointer file:hidden"
                      />
                      <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-primary/40 text-xs font-bold uppercase tracking-widest">
                        {letterFile ? letterFile.name : "Choose File"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full h-20 rounded-full text-lg tracking-[0.3em] font-bold shadow-gold mt-10 uppercase transition-all hover:scale-[1.02]"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "TRANSMITTING..." : "CONFIRM RESERVATION"}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
