"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Newspaper, Calendar, User, ArrowRight } from "lucide-react";
import { getNewsArticles } from "@/lib/data/demoStore";

export default function NewsListingPage(): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const articles = getNewsArticles().filter((a) => a.status === "published");

  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));

  const filteredArticles = selectedCategory === "all"
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#F4AE52]/20 text-[#D4621A] border border-[#F4AE52]/40 rounded-full inline-block">
          Editorial & Updates
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
          News & Regulations Updates
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Stay informed with recent developments in UAE visa regulations, government attestation updates, and international candidate guidance.
        </p>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === "all"
                ? "bg-[#D4621A] text-white shadow-xs"
                : "bg-white border border-[rgba(42,26,14,0.12)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            All Updates
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-[#D4621A] text-white shadow-xs"
                  : "bg-white border border-[rgba(42,26,14,0.12)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="p-6 bg-white border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="px-2.5 py-0.5 rounded-full font-semibold bg-[#FEF3E2] text-[#D4621A] border border-[rgba(42,26,14,0.12)]">
                  {article.category || "General"}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(article.publishAt || article.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-[var(--text-primary)] hover:text-[#D4621A] transition-colors">
                <Link href={`/news/${article.slug}`}>{article.title}</Link>
              </h2>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-[rgba(42,26,14,0.12)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <User className="w-3.5 h-3.5" />
                <span>{article.authorName}</span>
              </div>

              <Link
                href={`/news/${article.slug}`}
                className="font-bold text-[#D4621A] hover:underline inline-flex items-center gap-1"
              >
                Read Full Article <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
