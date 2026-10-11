"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { CookieBanner } from "@/components/shared/CookieBanner";

export function PublicChrome(): React.JSX.Element | null {
  const pathname = usePathname();

  // Hide public footer, floating WhatsApp bubble, and cookie banner on admin portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <Footer />
      <WhatsAppButton variant="floating" />
      <CookieBanner />
    </>
  );
}
