import { z } from "zod";

const baseBookingFields = {
  name: z.string()
    .min(1, "Please enter your full name.")
    .min(3, "Name must be at least 3 characters."),
  email: z.email("Enter a valid email address."),
  phone: z.string()
    .min(1, "Phone number is required.")
    .regex(/^0(9|7)\d{2}\d{3}\d{3}$/, "Enter a valid Ethiopian phone number."),
  organization: z.string().optional(),
  purpose: z.string()
    .min(1, "Purpose of meeting is required.")
    .min(10, "Please provide more details (min 10 chars)."),
};

export const bookingSchema = z.object({
  ...baseBookingFields,
  bookingAt: z.string()
    .min(1, "Please select a date and time.")
    .refine((val) => {
      const selectedDate = new Date(val);
      return !isNaN(selectedDate.getTime());
    }, { message: "Invalid date format." }),
  letterUrl: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.organization && data.organization.trim() !== "") {
    if (!data.letterUrl || data.letterUrl.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Please upload an official letter if booking on behalf of an organization.",
        path: ["letterUrl"],
      });
    }
  }
});

export const bookingFormSchema = z.object({
  ...baseBookingFields,
  bookingAt: z.string()
    .min(1, "Please select a date and time.")
    .refine((val) => {
      const selectedDate = new Date(val);
      return !isNaN(selectedDate.getTime()) && selectedDate > new Date();
    }, { message: "Booking time must be in the future." }),
  uploadedFile: typeof window !== "undefined"
    ? z.instanceof(File).nullable().optional()
    : z.any().nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.organization && data.organization.trim() !== "") {
    if (!data.uploadedFile) {
      ctx.addIssue({
        code: "custom",
        message: "Please upload an official letter if booking on behalf of an organization.",
        path: ["uploadedFile"],
      });
    }
  }
});

// Staff Schema: Used on the backend for staff creation/registration
export const staffSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.email("Invalid email format."),
  password: z.string().min(1, "Password is required.").min(6, "Password must be at least 6 characters."),
  role: z.enum(["staff", "admin"]),
});
