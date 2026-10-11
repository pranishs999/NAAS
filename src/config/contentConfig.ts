/**
 * Centralized Initial Content & Seed Data for Horizon Business Services
 * All demo items are clearly marked with isDemo: true and FICTIONAL DEMO labels.
 * Source: context.md §2.3, architecture.md §2, security.md §2
 */

export interface ServiceSeed {
  id: string;
  name: string;
  category: "visa" | "jobs";
  icon: string;
  description: string;
  featured: boolean;
  order: number;
  published: boolean;
}

export interface VacancySeed {
  id: string;
  title: string;
  industry: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  isDemo: boolean;
}

export interface TestimonialSeed {
  id: string;
  clientName: string;
  role: string;
  content: string;
  order: number;
  published: boolean;
  isDemo: boolean;
}

export interface NewsArticleSeed {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  imageUrl?: string;
  authorName: string;
  status: "draft" | "scheduled" | "published" | "unpublished" | "archived";
  publishAt: string;
  createdAt: string;
  isDemo: boolean;
}

export interface UserSeed {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  isActive: boolean;
  isDemoUser: boolean;
  createdAt: string;
}

// 11 Services for Documentation & Visa Services (all 11 names marked CLIENT INPUT REQUIRED)
export const initialServices: ServiceSeed[] = [
  {
    id: "srv-001",
    name: "Service 1 (CLIENT INPUT REQUIRED - Golden Visa / Residency)",
    category: "visa",
    icon: "FileCheck",
    description: "Complete assistance for residency and long-term visa documentation in the UAE. [CLIENT INPUT REQUIRED - Full Description]",
    featured: true,
    order: 1,
    published: true,
  },
  {
    id: "srv-002",
    name: "Service 2 (CLIENT INPUT REQUIRED - Family Visa Processing)",
    category: "visa",
    icon: "Users",
    description: "Sponsorship and family visa processing services with document verification. [CLIENT INPUT REQUIRED - Full Description]",
    featured: true,
    order: 2,
    published: true,
  },
  {
    id: "srv-003",
    name: "Service 3 (CLIENT INPUT REQUIRED - Business & Commercial Visa)",
    category: "visa",
    icon: "Briefcase",
    description: "Commercial and investor visa processing for corporate entities and entrepreneurs. [CLIENT INPUT REQUIRED - Full Description]",
    featured: true,
    order: 3,
    published: true,
  },
  {
    id: "srv-004",
    name: "Service 4 (CLIENT INPUT REQUIRED - Employment Visa Clearance)",
    category: "visa",
    icon: "Building2",
    description: "Work permit and employment visa document attestation and government clearance. [CLIENT INPUT REQUIRED - Full Description]",
    featured: true,
    order: 4,
    published: true,
  },
  {
    id: "srv-005",
    name: "Service 5 (CLIENT INPUT REQUIRED - Document Attestation)",
    category: "visa",
    icon: "ShieldCheck",
    description: "Degree, marriage, and commercial document attestation from relevant ministries. [CLIENT INPUT REQUIRED - Full Description]",
    featured: false,
    order: 5,
    published: true,
  },
  {
    id: "srv-006",
    name: "Service 6 (CLIENT INPUT REQUIRED - Trade License Renewal)",
    category: "visa",
    icon: "FileText",
    description: "Corporate trade licensing documentation and government affairs consulting. [CLIENT INPUT REQUIRED - Full Description]",
    featured: false,
    order: 6,
    published: true,
  },
  {
    id: "srv-007",
    name: "Service 7 (CLIENT INPUT REQUIRED - Emirates ID Assistance)",
    category: "visa",
    icon: "CreditCard",
    description: "Application, biometrics scheduling, and renewal services for Emirates ID. [CLIENT INPUT REQUIRED - Full Description]",
    featured: false,
    order: 7,
    published: true,
  },
  {
    id: "srv-008",
    name: "Service 8 (CLIENT INPUT REQUIRED - Medical Fitness Typing)",
    category: "visa",
    icon: "HeartPulse",
    description: "Medical fitness test application typing and VIP appointment scheduling. [CLIENT INPUT REQUIRED - Full Description]",
    featured: false,
    order: 8,
    published: true,
  },
  {
    id: "srv-009",
    name: "Service 9 (CLIENT INPUT REQUIRED - Certificate Translation)",
    category: "visa",
    icon: "Languages",
    description: "Legal translation of official certificates and legal documents for government use. [CLIENT INPUT REQUIRED - Full Description]",
    featured: false,
    order: 9,
    published: true,
  },
  {
    id: "srv-010",
    name: "Service 10 (CLIENT INPUT REQUIRED - Visa Cancellation & Status Change)",
    category: "visa",
    icon: "UserMinus",
    description: "Seamless processing of visa cancellations, status changes, and fine clearances. [CLIENT INPUT REQUIRED - Full Description]",
    featured: false,
    order: 10,
    published: true,
  },
  {
    id: "srv-011",
    name: "Service 11 (CLIENT INPUT REQUIRED - PRO & Government Liaison)",
    category: "visa",
    icon: "Landmark",
    description: "Dedicated Public Relations Officer (PRO) services for municipal and immigration departments. [CLIENT INPUT REQUIRED - Full Description]",
    featured: false,
    order: 11,
    published: true,
  },
];

// Sample Vacancies (FICTIONAL DEMO)
export const initialVacancies: VacancySeed[] = [
  {
    id: "vac-001",
    title: "Senior Software Engineer (Demo Listing)",
    industry: "Information Technology",
    location: "Dubai, UAE",
    type: "Full-Time",
    description: "Fictional sample vacancy for demonstrating job placement and placement workflow UI.",
    requirements: ["5+ years experience", "Full stack web development", "Fluent in English"],
    isDemo: true,
  },
  {
    id: "vac-002",
    title: "Hospitality Manager (Demo Listing)",
    industry: "Hospitality & Tourism",
    location: "Abu Dhabi, UAE",
    type: "Full-Time",
    description: "Fictional sample vacancy for hospitality professional placement process.",
    requirements: ["3+ years hotel management", "Customer service excellence", "GCC experience preferred"],
    isDemo: true,
  },
];

// Sample Testimonials (FICTIONAL DEMO)
export const initialTestimonials: TestimonialSeed[] = [
  {
    id: "tst-001",
    clientName: "Demo Client A (Fictional)",
    role: "Business Owner",
    content: "Fictional testimonial content for demonstration purposes. Horizon Business Services handled our visa paperwork smoothly.",
    order: 1,
    published: true,
    isDemo: true,
  },
  {
    id: "tst-002",
    clientName: "Demo Client B (Fictional)",
    role: "International Candidate",
    content: "Fictional testimonial content for demonstration. The guidance for job documentation and processing was clear.",
    order: 2,
    published: true,
    isDemo: true,
  },
];

// Sample News Articles
export const initialNewsArticles: NewsArticleSeed[] = [
  {
    id: "news-001",
    title: "UAE Visa Regulations & Documentation Updates 2026",
    slug: "uae-visa-regulations-update-2026",
    excerpt: "An overview of recent updates in documentation requirements for residency and employment visas in the UAE.",
    body: "This is a sample news article demonstrating the content publishing and news update features of Horizon Business Services. All information is for demonstration purposes.",
    category: "Visa Updates",
    authorName: "HBS Editorial Team",
    status: "published",
    publishAt: "2026-10-01T08:00:00Z",
    createdAt: "2026-10-01T08:00:00Z",
    isDemo: true,
  },
  {
    id: "news-002",
    title: "Guide to International Placement and Documentation Services",
    slug: "guide-to-international-placement",
    excerpt: "Key steps candidates should prepare when applying for international job assistance and visa clearance.",
    body: "Sample news article outlining the general steps in job assistance, document attestation, and embassy approvals.",
    category: "Job Assistance",
    authorName: "HBS Editorial Team",
    status: "published",
    publishAt: "2026-09-15T10:00:00Z",
    createdAt: "2026-09-15T10:00:00Z",
    isDemo: true,
  },
];

// Seed Admin & Staff Users (for demo auth)
export const initialUsers: UserSeed[] = [
  {
    id: "usr-admin-01",
    email: "admin@hbs.demo",
    name: "System Admin (Demo)",
    role: "admin",
    isActive: true,
    isDemoUser: true,
    createdAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "usr-staff-01",
    email: "staff@hbs.demo",
    name: "Operations Staff (Demo)",
    role: "staff",
    isActive: true,
    isDemoUser: true,
    createdAt: "2026-10-01T00:00:00Z",
  },
];
