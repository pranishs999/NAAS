/**
 * News Entity & Revision Types
 * Source: architecture.md §2, context.md §2.5
 */

export type NewsStatus = "draft" | "scheduled" | "published" | "unpublished" | "archived";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category?: string | null;
  imageUrl?: string | null;
  authorId?: string | null;
  authorName: string;
  status: NewsStatus;
  publishAt?: string | null;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

export interface NewsRevision {
  id: string;
  articleId: string;
  title: string;
  body: string;
  editedById: string;
  editedByName: string;
  createdAt: string;
}
