/**
 * Testimonial Entity Types
 * Source: architecture.md §2, context.md §2.6
 */

export interface Testimonial {
  id: string;
  clientName: string;
  role?: string;
  content: string;
  order: number;
  published: boolean;
  isDemo: boolean;
  createdAt: string;
}
