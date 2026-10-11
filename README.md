# Horizon Business Services — Demo Application

A Next.js (App Router) demo application built for **Horizon Business Services** (fictional demo brand), presenting both **Documentation & Visa Services** and **International Job Services** under a single unified brand.

---

## 🚀 Setup Instructions

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. **Run Local Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Admin & Staff Credentials

For evaluating the Admin Dashboard SPA and role permissions matrix:

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Admin (Full)** | `admin@hbs.demo` | `admin123` | Full access to all 10 dashboard sections, CRUD, user management, and settings |
| **Staff (Limited)** | `staff@hbs.demo` | `staff123` | Access restricted to Overview, Inquiries, Analytics, and Documents only |

> **⚠️ NON-PRODUCTION WARNING:** This demo implements a server-side session using env-configured demo credentials with a signed `httpOnly` cookie. This session layer is labeled non-production in the UI and does not replace a production identity provider (e.g. NextAuth, Clerk, Auth0).

---

## 📜 Available NPM Scripts

- `npm run dev` — Starts Next.js development server.
- `npm run build` — Validates TypeScript types and builds production Next.js output.
- `npm run start` — Runs production server.
- `npm run lint` — Executes ESLint checks across codebase.
- `npm run test` — Executes Vitest unit tests.

---

## 🏗️ Architecture Summary

- **Framework:** Next.js (App Router) + TypeScript (`strict: true`) + Tailwind CSS v4.
- **Rendering Strategy:** SSG/ISR for public pages (`/`, `/services/visa`, `/services/jobs`, `/about`, `/contact`, `/news`, `/privacy`); Client-Side SPA for Admin Dashboard (`/admin/*`).
- **Data Persistence:** Browser-persistent storage (`localStorage`) isolated under `hbs_*` keys. Pre-seeded with 11 visa service placeholders, sample vacancies, news updates, and testimonials.
- **Reference Code Generator:** Category-prefixed sequential format (`HBS-VIS-0001`, `HBS-JOB-0001` — **PROVISIONAL**).
- **Authentication:** Server-side route handler `/api/auth/login` validating credentials and setting signed `httpOnly` cookie `hbs_session_token`. `src/middleware.ts` enforces role-based access.

---

## 🔄 How to Reset Demo Data

1. Log into the **Admin Dashboard** (`/admin/login`).
2. Navigate to **Settings** (`/admin/settings`).
3. Under **Demo Data Backup & Restore Operations**, click **Reset Sample Data**.
4. Confirm the prompt to restore initial pre-seeded demo records.

---

## 📊 Demo vs Production Table

| Feature | Demo Status | Production Requirement |
|---|---|---|
| Public pages & 8-page structure | ✅ Implemented | Same |
| Service cards & inquiry modal | ✅ Implemented | Same |
| Multi-step inquiry forms | ✅ Implemented | Same, with server validation |
| Reference code generation | ✅ Implemented (browser-local) | Server-generated unique codes |
| WhatsApp deep links | ✅ Implemented (prefilled links) | Same; external delivery |
| Admin authentication | ⚠️ Signed httpOnly cookie (env demo credentials) | Real server-side auth provider (`CLIENT INPUT REQUIRED` — **BLOCKER**) |
| Data storage | Browser-persistent (`localStorage`) | Server database (`CLIENT INPUT REQUIRED` — **BLOCKER**) |
| Role permissions | ✅ Enforced via Next.js Middleware | Server-enforced RBAC |
| CSV export & Backup/Restore | ✅ Implemented | Encrypted server backups |
| Sample data reset | ✅ Implemented | N/A |
| File uploads | ⚠️ Simulated (base64 in browser) | Server cloud storage + malware scan (`CLIENT INPUT REQUIRED`) |
| Email / SMS notifications | ❌ Simulated in UI | Provider required (`CLIENT INPUT REQUIRED` / OPEN Q55, Q91) |
| Cookie consent | ✅ Implemented | Legal review of consent text |
| Map integration | ⚠️ Placeholder frame | Map API Key (`CLIENT INPUT REQUIRED`) |

---

## ⚠️ Known Limitations / Deviations from Docs

1. **Auth Provider & Database (`BLOCKER`):** As specified in `security.md`, real production auth provider and database are not configured. Implemented server-side demo sessions with signed `httpOnly` cookies as instructed.
2. **11 Services Unspecified (`CLIENT INPUT REQUIRED`):** All 11 service names and descriptions are stored as explicit `[CLIENT INPUT REQUIRED]` placeholders in `src/config/contentConfig.ts`.
3. **Company Contacts & Credentials (`CLIENT INPUT REQUIRED`):** Phone, email, address, logo, mission, and credentials are centralized in `src/config/siteConfig.ts` with explicit placeholders.
4. **Notifications (`OPEN` Q55, Q91):** Email, SMS, and WhatsApp API delivery are unconfigured; UI displays non-production simulation notices.

---

## 📦 Dependencies & Justifications

- `next`: React framework for App Router, SSG/ISR rendering, and server API routes.
- `react` & `react-dom`: UI component library.
- `zod`: Type-safe schema validation for form inputs and API payloads.
- `lucide-react`: Accessible, lightweight UI icon system.
- `tailwindcss` & `@tailwindcss/turbopack`: Utility-first CSS engine for design tokens.
- `typescript`: Strict type checking across the project.
- `vitest` & `vite`: Unit testing suite.
