/**
 * Service Entity Types
 * Source: architecture.md §2, context.md §2.3
 */

export type ServiceCategory = "visa" | "jobs";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  icon: string;
  description: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
