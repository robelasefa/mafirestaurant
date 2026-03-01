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
import { useUploadThing } from "@/lib/utils";

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
  const [letterUrl, setLetterUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const router = useRouter();
  const { showAlert } = useAlert();
  
  // Initialize UploadThing Hook
  const { startUpload } = useUploadThing("pdfUploader");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        showAlert("error", "File Too Large", "Please select a file smaller than 2MB.");
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showAlert("error", "Invalid File Type", "Please upload PDF, DOC, DOCX, JPG, or PNG files only.");
        return;
      }
      
      setUploadedFile(file);
      setLetterUrl(null); // Clear any previous uploaded URL
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setLetterUrl(null);
  };

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
          const now = new Date();
          if (isNaN(selectedDate.getTime())) {
            error = "Invalid date format.";
          } else if (selectedDate < now) {
            error = "Booking time must be in the future.";
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
    ["name", "email", "phone", "bookingAt", "purpose"].every(
      (field) => formData[field as keyof typeof formData]
    ) &&
    (!formData.organization.trim() || uploadedFile !== null); // If org is present, file is required

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      let finalLetterUrl = null;

      // Handle File Upload first
      if (uploadedFile && formData.organization) {
        setIsUploading(true);
        const uploadRes = await startUpload([uploadedFile]);
        
        if (!uploadRes || uploadRes.length === 0) {
          throw new Error("Failed to upload file.");
        }
        // Note: check if your version of UploadThing uses .ufsUrl or .url
        finalLetterUrl = uploadRes[0].url; 
        setIsUploading(false);
      }

      // Prepare the payload as JSON (Standard for Next.js API routes)
      const payload = {
        ...formData,
        letterUrl: finalLetterUrl,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // ... (Your existing success logic)
        setFormData({
          name: "",
          email: "",
          phone: "",
          organization: "",
          bookingAt: "",
          purpose: "",
        });
        setLetterUrl(null);
        setUploadedFile(null);

        showAlert("success", "Success", "Booking request sent!");
        router.push("/");
      } else {
        throw new Error(data.error || "Failed to submit booking");
      }
    } catch (error: any) {
      showAlert("error", "Error", error.message);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

    return (
      <div className="bg-background">
        <Navbar />
        <main>
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
              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-background rounded-2xl shadow-elegant p-8 border border-primary/20"
              >
                {/* Name */}
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

                {/* Organization */}
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
                    <div className="mt-3 mb-4">
                      {uploadedFile ? (
                        <div className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg 
                                        bg-green-900/20 text-green-400 border border-green-500/40">
                          <div className="flex items-center gap-2">
                            <span>📄</span>
                            <div>
                              <span className="font-medium">File Selected</span>
                              <p className="text-sm text-green-300/80">{uploadedFile.name}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeFile}
                            className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            id="letter-upload"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isSubmitting || isUploading}
                          />
                          <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg 
                                          bg-primary/10 text-primary border border-primary/30 hover:border-primary/50 
                                          transition-colors cursor-pointer">

                            <span className="font-medium">Attach Letter</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-foreground-muted">
                      Please upload an official letter if booking on behalf of an organization.
                      Supported formats: PDF, DOC, DOCX, JPG, PNG. Max 2MB.
                    </p>
                  </div>
                )}

                {/* Date & Time */}
                <div className="space-y-2">
                  <Label htmlFor="bookingAt" className="text-primary font-medium">
                    Booking Date & Time *
                  </Label>
                  <Input
                    id="bookingAt"
                    name="bookingAt"
                    type="datetime-local"
                    value={formData.bookingAt ? new Date(formData.bookingAt).toISOString().slice(0, 16) : ""}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                    className={`
                      bg-background-subtle 
                      border-primary/20 
                      text-foreground-accent 
                      focus:border-primary 
                      mt-2 
                      h-11
                      selection:bg-primary/30
                      /* Ensures the text color is bright enough on mobile dark mode */
                      scheme-dark
                      ${errors.bookingAt && touched.bookingAt
                        ? "border-amber-500 focus:ring-amber-500/20"
                        : "hover:border-primary/50"
                      }
                    `}
                  />
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
                  disabled={!isFormValid || isSubmitting || isUploading}
                >
                  {isSubmitting ? "Submitting..." : isUploading ? "Uploading File..." : "Submit"}
                </Button>
              </form>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
