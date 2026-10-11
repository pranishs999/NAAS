import { z } from "zod";

// Visitor Inquiry Form Schema
export const inquirySchema = z.object({
  branch: z.enum(["visa", "jobs"]),
  serviceId: z.string().optional(),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  message: z.string().optional(),
  formData: z.object({
    passportNumber: z.string().optional(),
    nationality: z.string().optional(),
    currentLocation: z.string().optional(),
    qualification: z.string().optional(),
    experienceYears: z.string().optional(),
    preferredRole: z.string().optional(),
    urgency: z.string().optional(),
    additionalNotes: z.string().optional(),
  }).optional(),
  honeypot: z.string().max(0, "Spam detected").optional(), // anti-spam
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// Admin Login Schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Re-Auth / MFA Confirmation Schema
export const reauthSchema = z.object({
  password: z.string().min(1, "Password is required for sensitive action verification"),
});

export type ReauthInput = z.infer<typeof reauthSchema>;

// Admin Service CRUD Schema
export const serviceSchema = z.object({
  name: z.string().min(3, "Service name must be at least 3 characters"),
  category: z.enum(["visa", "jobs"]),
  icon: z.string().min(1, "Icon is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  featured: z.boolean().default(false),
  order: z.number().int().default(1),
  published: z.boolean().default(true),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

// Admin News CRUD Schema
export const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  body: z.string().min(20, "Body content must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published", "unpublished", "archived"]).default("draft"),
  publishAt: z.string().optional(),
});

export type NewsInput = z.infer<typeof newsSchema>;

// Admin Testimonial CRUD Schema
export const testimonialSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  role: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  order: z.number().int().default(1),
  published: z.boolean().default(true),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// Admin User Management Schema
export const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  role: z.enum(["admin", "staff"]),
  isActive: z.boolean().default(true),
});

export type UserInput = z.infer<typeof userSchema>;

// Routing Rule Schema
export const routingRuleSchema = z.object({
  branch: z.enum(["visa", "jobs", "all"]),
  serviceCategory: z.string().optional(),
  assigneeId: z.string().min(1, "Assignee is required"),
  priority: z.number().int().default(1),
  isActive: z.boolean().default(true),
});

export type RoutingRuleInput = z.infer<typeof routingRuleSchema>;

// File Upload Constraints Schema (security.md §3.3)
export const fileUploadConstraints = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["application/pdf", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".docx"],
};
