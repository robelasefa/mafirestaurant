"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bookingFormSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/components/providers/AlertProvider";
import { useUploadThing } from "@/lib/utils";

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingForm() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlert();
  const { startUpload } = useUploadThing("fileUploader");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      bookingAt: "",
      purpose: "",
      uploadedFile: null,
    },
  });

  const organization = watch("organization");
  const uploadedFile = watch("uploadedFile");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showAlert("error", "File Too Large", "Please select a file smaller than 2MB.");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        showAlert("error", "Invalid File Type", "Please upload PDF, DOC, DOCX, JPG, or PNG files only.");
        return;
      }

      setValue("uploadedFile", file, { shouldValidate: true });
    }
  };

  const removeFile = () => {
    setValue("uploadedFile", null, { shouldValidate: true });
  };

  const onSubmit = async (data: BookingFormValues) => {
    setIsUploading(true);
    try {
      let finalLetterUrl = null;

      if (data.uploadedFile && data.organization) {
        const uploadRes = await startUpload([data.uploadedFile]);
        if (!uploadRes || uploadRes.length === 0) {
          throw new Error("Failed to upload file.");
        }
        finalLetterUrl = uploadRes[0].url;
      }

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        organization: data.organization || null,
        bookingAt: data.bookingAt,
        purpose: data.purpose,
        letterUrl: finalLetterUrl,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok) {
        reset();
        showAlert("success", "Success", "Booking request sent!");
        router.push("/");
      } else {
        throw new Error(resData.error || resData.message || "Failed to submit booking");
      }
    } catch (error: any) {
      showAlert("error", "Error", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-background rounded-2xl shadow-elegant p-8 border border-primary/20"
    >
      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-primary font-medium">
          Full Name *
        </Label>
        <Input
          id="name"
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby="name-error"
          className={`bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2 ${
            errors.name ? "border-amber-500 focus:ring-amber-500/20" : "hover:border-primary/50"
          }`}
        />
        {errors.name?.message && (
          <p id="name-error" className="mt-2 text-sm text-amber-600 flex items-center">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
            {errors.name.message}
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
          type="email"
          placeholder="your@email.com"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
          className={`bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2 ${
            errors.email ? "border-amber-500 focus:ring-amber-500/20" : "hover:border-primary/50"
          }`}
        />
        {errors.email?.message && (
          <p id="email-error" className="mt-2 text-sm text-amber-600 flex items-center">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
            {errors.email.message}
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
          type="tel"
          placeholder="+251 9XX XXX XXX"
          {...register("phone")}
          aria-invalid={!!errors.phone}
          aria-describedby="phone-error"
          className={`bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2 ${
            errors.phone ? "border-amber-500 focus:ring-amber-500/20" : "hover:border-primary/50"
          }`}
        />
        {errors.phone?.message && (
          <p id="phone-error" className="mt-2 text-sm text-amber-600 flex items-center">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Organization */}
      <div>
        <Label htmlFor="organization" className="text-primary font-medium">
          Organization (Optional)
        </Label>
        <Input
          id="organization"
          placeholder="Your company or organization"
          {...register("organization")}
          className="bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2 hover:border-primary/50"
        />
      </div>

      {/* Upload Letter (Only show if organization is provided) */}
      {organization && organization.trim() !== "" && (
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
          {errors.uploadedFile?.message && (
            <p className="mt-2 text-sm text-amber-600 flex items-center">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
              {errors.uploadedFile.message as string}
            </p>
          )}
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
          type="datetime-local"
          min={new Date().toISOString().slice(0, 16)}
          {...register("bookingAt")}
          aria-invalid={!!errors.bookingAt}
          aria-describedby="bookingAt-error"
          className={`
            bg-background-subtle 
            border-primary/20 
            text-foreground-accent 
            focus:border-primary 
            mt-2 
            h-11
            selection:bg-primary/30
            scheme-dark
            ${errors.bookingAt ? "border-amber-500 focus:ring-amber-500/20" : "hover:border-primary/50"}
          `}
        />
        {errors.bookingAt?.message && (
          <p id="bookingAt-error" className="mt-2 text-sm text-amber-600 flex items-center">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
            {errors.bookingAt.message}
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
          rows={4}
          placeholder="Describe the nature of your event or meeting..."
          {...register("purpose")}
          aria-invalid={!!errors.purpose}
          aria-describedby="purpose-error"
          className={`bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2 resize-none ${
            errors.purpose ? "border-amber-500 focus:ring-amber-500/20" : "hover:border-primary/50"
          }`}
        />
        {errors.purpose?.message && (
          <p id="purpose-error" className="mt-2 text-sm text-amber-600 flex items-center">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
            {errors.purpose.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isValid || isSubmitting || isUploading}
      >
        {isSubmitting ? "Submitting..." : isUploading ? "Uploading File..." : "Submit"}
      </Button>
    </form>
  );
}
