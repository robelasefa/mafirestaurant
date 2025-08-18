"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/components/providers/AlertProvider";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";


export default function Booking() {
  useEffect(() => {
    document.title = "Booking | Mafi Restaurant"
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    bookingAt: "",
    purpose: "",
  });

  const router = useRouter();
  const { showAlert } = useAlert();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    let error = "";
    if (!value && name !== "organization") {
      error = "This field is required";
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
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          setFormData({
            name: "",
            email: "",
            organization: "",
            bookingAt: "",
            purpose: "",
          });
    
          showAlert("success", "Booking Successful", data.message);
          router.push("/");
        } else {
          throw new Error(data.message || "Failed to submit booking");
        }
      } catch (error: any) {
        showAlert("error", "Booking Failed", error.message || "Please try again or contact us.");
        console.error("Error submitting booking:", error);
      } finally {
        setIsSubmitting(false);
      }
    };
    ;

  return (
    <div className="bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-20 bg-background-accent">
          <div className="max-w-3xl mx-auto px-6 animate-fade-in">
            <h2 className=" text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-3 text-center">
              Book Our Meeting Hall
            </h2>
            <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto mb-10 leading-8 text-center">
              We offer <strong>5 meeting halls</strong> — one large hall that accommodates
              approximately <strong>200 guests</strong>, and four smaller halls each holding
              around <strong>50 guests</strong>. Perfect for corporate meetings, workshops,
              and special celebrations.
            </p>
            <div className="flex justify-center mb-10">
              <div className="relative overflow-hidden rounded-2xl shadow-elegant group transition-all duration-500">
                <img
                  src="/lovable-uploads/75f0a2e1-ceb5-407b-bd2a-4b02d7c7d5e0.png"
                  alt="Mafi Restaurant Meeting Hall"
                  className="block w-full max-w-xl h-72 object-cover transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_40px_10px_rgba(212,175,55,0.4)] group-hover:ring-4 group-hover:ring-[#d4af37]/40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none transition-all duration-500 group-hover:from-[#d4af37]/30" />
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-background rounded-2xl shadow-elegant p-8 border border-primary/20"
            >
              {/* Full Name */}
              <div>
                <Label htmlFor="name" className="text-primary font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.name && touched.name}
                  aria-describedby="name-error"
                  required
                  className={`bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2 ${errors.name && touched.name
                    ? "border-amber-500 focus:ring-amber-500/20"
                    : "hover:border-primary/50"
                    }`}
                />
                {errors.name && touched.name && (
                  <p
                    id="name-error"
                    className="mt-2 text-sm text-amber-600 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-primary font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.email && touched.email}
                  aria-describedby="email-error"
                  required
                  placeholder="your@email.com"
                  className={`bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2 ${errors.email && touched.email
                    ? "border-amber-500 focus:ring-amber-500/20"
                    : "hover:border-primary/50"
                    }`}
                />
                {errors.email && touched.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-sm text-amber-600 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Organization (Optional) */}
              <div>
                <Label
                  htmlFor="organization"
                  className="text-primary font-medium"
                >
                  Organization (Optional)
                </Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Your company or organization"
                  className="bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2 hover:border-primary/50"
                />
              </div>

              {/* Booking Date & Time */}
              <div>
                <Label htmlFor="bookingAt" className="text-primary font-medium">
                  Booking Date & Time *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal mt-2 ${
                        !formData.bookingAt ? "text-muted-foreground" : ""
                      } ${
                        errors.bookingAt && touched.bookingAt
                          ? "border-amber-500 focus:ring-amber-500/20"
                          : "hover:border-primary/50 border-primary/20"
                      }`}
                    >
                      {formData.bookingAt ? (
                        new Date(formData.bookingAt).toLocaleString()
                      ) : (
                        <span>Select date & time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.bookingAt ? new Date(formData.bookingAt) : undefined}
                      onSelect={(date) => {
                        if (!date) return
                        // default to 12:00 PM if no time exists yet
                        const withTime = new Date(date)
                        if (!formData.bookingAt) {
                          withTime.setHours(12, 0, 0, 0)
                        } else {
                          const prev = new Date(formData.bookingAt)
                          withTime.setHours(prev.getHours(), prev.getMinutes())
                        }
                        handleInputChange({
                          target: {
                            name: "bookingAt",
                            value: withTime.toISOString(),
                          },
                        } as any)
                      }}
                      initialFocus
                    />
                    <div className="p-3 border-t border-muted">
                      <Input
                        type="time"
                        value={
                          formData.bookingAt
                            ? new Date(formData.bookingAt).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""
                        }
                        onChange={(e) => {
                          if (!formData.bookingAt) return
                          const newDate = new Date(formData.bookingAt)
                          const [h, m] = e.target.value.split(":").map(Number)
                          newDate.setHours(h, m, 0, 0)
                          handleInputChange({
                            target: {
                              name: "bookingAt",
                              value: newDate.toISOString(),
                            },
                          } as any)
                        }}
                        className="w-full"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                {errors.bookingAt && touched.bookingAt && (
                  <p
                    id="bookingAt-error"
                    className="mt-2 text-sm text-amber-600 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    {errors.bookingAt}
                  </p>
                )}
              </div>

              {/* Purpose */}
              <div>
                <Label htmlFor="purpose" className="text-primary font-medium">
                  Purpose of Meeting *
                </Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows={4}
                  required
                  aria-invalid={!!errors.purpose && touched.purpose}
                  aria-describedby="purpose-error"
                  placeholder="Describe the nature of your event or meeting..."
                  className={`bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2 resize-none ${errors.purpose && touched.purpose
                    ? "border-amber-500 focus:ring-amber-500/20"
                    : "hover:border-primary/50"
                    }`}
                />
                {errors.purpose && touched.purpose && (
                  <p
                    id="purpose-error"
                    className="mt-2 text-sm text-amber-600 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    {errors.purpose}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}