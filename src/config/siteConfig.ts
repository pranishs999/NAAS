/**
 * Centralized Company Settings for Horizon Business Services (Demo)
 * Source: context.md §2.1 & Q27, Q48, Q59
 * Anything marked CLIENT INPUT REQUIRED is stored as a explicit placeholder here.
 */

export interface SiteConfig {
  companyName: string;
  isDemo: boolean;
  tagline: string;
  phone: string;
  email: string;
  whatsAppNumber: string;
  physicalAddress: string;
  officeHours: string;
  socialMediaLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  logoUrl: string;
  mission: string;
  vision: string;
  values: string[];
  credentials: string[];
  mapEmbedUrl: string;
}

export const siteConfig: SiteConfig = {
  companyName: "Horizon Business Services",
  isDemo: true,
  tagline: "[CLIENT INPUT REQUIRED - Tagline]",
  phone: "[CLIENT INPUT REQUIRED - Phone Number]",
  email: "[CLIENT INPUT REQUIRED - Email Address]",
  whatsAppNumber: "[CLIENT INPUT REQUIRED - WhatsApp Number]",
  physicalAddress: "[CLIENT INPUT REQUIRED - Physical Address (Dubai, UAE)]",
  officeHours: "[CLIENT INPUT REQUIRED - Office Hours]",
  socialMediaLinks: {
    linkedin: "[CLIENT INPUT REQUIRED - LinkedIn Link]",
    twitter: "[CLIENT INPUT REQUIRED - Twitter Link]",
    facebook: "[CLIENT INPUT REQUIRED - Facebook Link]",
    instagram: "[CLIENT INPUT REQUIRED - Instagram Link]",
  },
  logoUrl: "[CLIENT INPUT REQUIRED - Logo Asset URL]",
  mission: "[CLIENT INPUT REQUIRED - Mission Statement]",
  vision: "[CLIENT INPUT REQUIRED - Vision Statement]",
  values: [
    "[CLIENT INPUT REQUIRED - Core Value 1]",
    "[CLIENT INPUT REQUIRED - Core Value 2]",
    "[CLIENT INPUT REQUIRED - Core Value 3]",
  ],
  credentials: [
    "[CLIENT INPUT REQUIRED - Credential / Licensing Info 1]",
    "[CLIENT INPUT REQUIRED - Credential / Licensing Info 2]",
  ],
  mapEmbedUrl: "[CLIENT INPUT REQUIRED - Map Embed URL]",
};
