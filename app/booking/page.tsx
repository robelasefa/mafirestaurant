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
import { UploadCloud, FileText } from "lucide-react";
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
    <div className="bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-20 bg-background-accent">
          <div className="max-w-3xl mx-auto px-6 animate-fade-in">
            <h2 className=" text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-3 text-center">
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
              <div className="relative overflow-hidden rounded-2xl shadow-elegant group transition-all duration-500">
                <Image
                  src="/images/meeting-hall.png"
                  alt="Mafi Restaurant Meeting Hall"
                  width={600}
                  height={300}
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

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-primary font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.phone && touched.phone}
                  aria-describedby="phone-error"
                  required
                  placeholder="+251 9XX XXX XXX"
                  className={`bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2 ${errors.phone && touched.phone
                    ? "border-amber-500 focus:ring-amber-500/20"
                    : "hover:border-primary/50"
                    }`}
                />
                {errors.phone && touched.phone && (
                  <p
                    id="phone-error"
                    className="mt-2 text-sm text-amber-600 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    {errors.phone}
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

              {/* Upload Letter (Only show if organization is provided) */}
              {formData.organization.trim() && (
                <div className="animate-fade-in">
                  <Label
                    htmlFor="letter"
                    className="text-primary font-medium"
                  >
                    Upload Letter (Optional)
                  </Label>
                  <div className="mt-3 mb-4 flex items-center gap-4">
                    {/* Hidden native input */}
                    <Input
                      id="letter"
                      name="letter"
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          
                          // Validate file size (2MB max)
                          const maxSize = 2 * 1024 * 1024; // 2MB in bytes
                          if (file.size > maxSize) {
                            showAlert(
                              "error",
                              "File Too Large",
                              "File size must be less than 2MB."
                            );
                            e.target.value = ''; // Clear the input
                            setLetterFile(null);
                            return;
                          }
                          
                          // Validate file type
                          const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
                          if (!allowedTypes.includes(file.type)) {
                            showAlert(
                              "error",
                              "Invalid File Type",
                              "Allowed types: PDF, DOC, DOCX, JPG, PNG."
                            );
                            e.target.value = ''; // Clear the input
                            setLetterFile(null);
                            return;
                          }
                          
                          setLetterFile(file);
                        } else {
                          setLetterFile(null);
                        }
                      }}
                      className="hidden"
                    />

                    {/* Square action area */}
                    <label
                      htmlFor="letter"
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-primary/40 bg-background-subtle text-primary hover:border-primary hover:bg-primary/10 cursor-pointer transition-colors"
                    >
                      {letterFile ? (
                        <FileText className="h-6 w-6" />
                      ) : (
                        <UploadCloud className="h-6 w-6" />
                      )}
                    </label>

                    {/* File name / status */}
                    <div className="flex-1 min-w-0">
                      {letterFile ? (
                        <div className="inline-flex items-center gap-2 rounded-full bg-background-subtle border border-primary/20 px-3 py-1.5 text-sm text-foreground-accent">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="truncate max-w-[220px]">
                            {letterFile.name}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground-muted">
                          Click the square to upload your official letter.
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-foreground-muted">
                    Please upload an official letter if booking on behalf of an organization.
                    Supported formats: PDF, DOC, Images. Max 2MB.
                  </p>
                </div>
              )}

              {/* Booking Date & Time */}
              <div>
                <Label htmlFor="bookingAt" className="text-primary font-medium">
                  Booking Date & Time *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal mt-2 h-11 px-4 ${!formData.bookingAt ? "text-muted-foreground" : ""
                        } ${errors.bookingAt && touched.bookingAt
                          ? "border-amber-500 focus:ring-amber-500/20"
                          : "hover:border-primary/50 border-primary/30 bg-background-subtle"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        📅
                        {formData.bookingAt ? (
                          new Date(formData.bookingAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        ) : (
                          "Select date & time"
                        )}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-4">
                      <Calendar
                        mode="single"
                        selected={
                          formData.bookingAt
                            ? new Date(formData.bookingAt)
                            : undefined
                        }
                        onSelect={(date) => {
                          if (!date) return;
                          // default to 12:00 PM if no time exists yet
                          const withTime = new Date(date);
                          if (!formData.bookingAt) {
                            withTime.setHours(12, 0, 0, 0);
                          } else {
                            const prev = new Date(formData.bookingAt);
                            withTime.setHours(prev.getHours(), prev.getMinutes());
                          }
                          handleInputChange({
                            target: {
                              name: "bookingAt",
                              value: withTime.toISOString(),
                            },
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                      />
                    </div>
                    <div className="p-4 pt-5 border-t border-primary/10 bg-background-subtle rounded-b-xl">
                      <Label className="text-sm font-medium text-foreground mb-2 block">Time</Label>
                      <Input
                        type="time"
                        value={
                          formData.bookingAt
                            ? new Date(formData.bookingAt).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                            : "12:00"
                        }
                        onChange={(e) => {
                          if (!formData.bookingAt) return;
                          const newDate = new Date(formData.bookingAt);
                          const [h, m] = e.target.value.split(":").map(Number);
                          newDate.setHours(h, m, 0, 0);
                          handleInputChange({
                            target: {
                              name: "bookingAt",
                              value: newDate.toISOString(),
                            },
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        className="w-full border-primary/30 bg-background focus:border-primary"
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
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
