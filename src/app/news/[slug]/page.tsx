import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Newspaper } from "lucide-react";
import { getNewsArticles } from "@/lib/data/demoStore";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getNewsArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const articles = getNewsArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4621A] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All News
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="px-3 py-1 rounded-full font-bold bg-[#F4AE52]/20 text-[#D4621A] border border-[#F4AE52]/40">
            {article.category || "Updates"}
          </span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(article.publishAt || article.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{article.authorName}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
          {article.title}
        </h1>

        <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed italic border-l-4 border-[#D4621A] pl-4 py-1">
          {article.excerpt}
        </p>
      </div>

      <div className="p-8 bg-white border border-[rgba(42,26,14,0.12)] rounded-3xl shadow-xs text-sm text-[var(--text-primary)] leading-relaxed space-y-4">
        <p>{article.body}</p>
        <div className="pt-6 border-t border-[rgba(42,26,14,0.12)] text-xs text-[var(--text-secondary)] flex items-center justify-between">
          <span>Published under Editorial Guidelines for Horizon Business Services</span>
          <span className="px-2 py-0.5 bg-[#F4AE52]/20 text-[#D4621A] border border-[#F4AE52]/40 rounded font-bold">Demo Content</span>
        </div>
      </div>
    </article>
  );
}
