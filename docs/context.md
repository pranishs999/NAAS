# Context: Horizon Business Services

---

## 1. Product Requirements Document

### Purpose
A two-in-one website for a UAE-based company offering **Documentation & Visa Services** and **International Job Services** under a single brand, **Horizon Business Services** (fictional demo name) [Q59, Q8]. The demo helps the client evaluate design, workflow, and feature scope before committing to production infrastructure [line 170].

### Audience
- **Primary visitors:** Individuals seeking UAE documentation/visa assistance or international job placement.
- **Admin users:** Company staff managing inquiries, content, and settings.
- **Client stakeholder:** Evaluating the demo for production approval.

### Goals
- Present both service branches with equal prominence [Q24].
- Capture visitor inquiries via multi-step forms and WhatsApp [Q5, Q10, Q32].
- Provide an admin dashboard to manage inquiries, content, users, and settings [Q78].
- Demonstrate a realistic workflow without misrepresenting demo features as production-ready [line 170].

### Non-Goals
- No real payment processing, no real job board with employer-posted listings.
- No production-grade notification delivery (email, SMS, push) — these are OPEN [Q55, Q91].
- No claimed legal compliance with any specific regulation.

### Scope Boundaries
- **In scope:** 8 public/admin pages, demo data layer, admin CRUD for all content types, inquiry lifecycle, WhatsApp deep links, cookie consent, basic analytics hooks.
- **Out of scope:** Production database, production auth provider, real email/WhatsApp APIs, payment, employer job posting, mobile native apps.

### Success Criteria
- Client can browse all 8 pages on mobile and desktop.
- Client can submit a visa inquiry and a job inquiry, receive a reference code, and use the WhatsApp follow-up button.
- Admin can log in, search inquiries by reference code, update status, add notes, and export CSV.
- Admin can manage services, news, testimonials, users, and settings.
- All demo data is clearly labeled as fictional.
- No functionality is presented as production-complete when it is simulated.

### Two Branches, One Brand
| Branch | Public Page | Services | Inquiry Type |
|---|---|---|---|
| Documentation & Visa | Documentation & Visa Services | 11 services (names `CLIENT INPUT REQUIRED`) [Q12] | Visa/document inquiry |
| International Jobs | International Job Services | Job assistance + sample vacancies (fictional, labeled) [Q14 answer] | Job inquiry |

### 8-Page Structure [Q15, Q76 page list]
| # | Page | Type |
|---|---|---|
| 1 | Home | Static |
| 2 | About Us | Static |
| 3 | Documentation & Visa Services | Static + inquiry |
| 4 | International Job Services | Static + inquiry |
| 5 | Contact Us | Static + contact form |
| 6 | News & Updates | Public listing |
| 7 | Admin Login | Authentication |
| 8 | Admin Dashboard | Single-page app with sections |

Privacy & Terms: combined, accessible from footer [Q15].

---

## 2. Content & Data Specification

### 2.1 Centralized Company Settings
All company-specific values are stored centrally and admin-editable [Q27, Q48].

| Setting | Value |
|---|---|
| Company name | Horizon Business Services (demo) [Q59] |
| Tagline | `CLIENT INPUT REQUIRED` |
| Phone number | `CLIENT INPUT REQUIRED` |
| Email address | `CLIENT INPUT REQUIRED` |
| WhatsApp number | `CLIENT INPUT REQUIRED` |
| Physical address | `CLIENT INPUT REQUIRED` |
| Office hours | `CLIENT INPUT REQUIRED` |
| Social media links | `CLIENT INPUT REQUIRED` |
| Logo | `CLIENT INPUT REQUIRED` |

### 2.2 Per-Page Content Blocks

**Home**
- Welcome section with Dubai imagery [Q20] and refined typography [Q25] [Q60]
- Two prominent branch cards (Documentation & Visa, International Jobs) [Q60]
- Featured services (selected subset of 11) [Q12]
- Trust elements: transparent processes, genuine proof, clear disclaimers [Q30]
- Testimonials carousel (admin-managed, fictional entries labeled) [Q31]
- WhatsApp floating button [Q23]

**About Us**
- Company overview, mission, values: `CLIENT INPUT REQUIRED`
- Trust indicators / credentials: `CLIENT INPUT REQUIRED`

**Documentation & Visa Services**
- Premium service cards with icons, descriptions, inquiry buttons [Q21, Q64]
- Service modal popup on click: details + inquiry form [Q22]
- All 11 services displayed [Q12]

**International Job Services**
- Job assistance process explanation (process-first) [Q13, Q14 answer]
- Sample vacancies labeled **FICTIONAL DEMO** [Q14 answer]
- Job inquiry form [Q5]

**Contact Us**
- Split layout with branch-specific inquiry choices [Q105]
- Click-to-call, email links, WhatsApp actions [Q105]
- Embedded interactive map with address, directions, office hours [Q106]
- Contact form [Q5]

**News & Updates**
- Responsive news cards: title, date, excerpt, optional image [Q79 answer]
- Categories, archive navigation [Q113 second instance]

**Admin Login**
- Login form; real server-side authentication [Q86]
- Demo instructions visible but non-production security warnings displayed [Q82]

**Admin Dashboard** (sections per Q78)
- Overview, Inquiries, Services, News, Testimonials, Users, Audit Logs, Analytics, Documents, Settings

### 2.3 The 11 Services
| Field | Type | Notes |
|---|---|---|
| name | string | `CLIENT INPUT REQUIRED` — all 11 names unspecified |
| category | string | Documentation & Visa or International Jobs [Q34] |
| icon | string/component | Admin-selectable [Q81] |
| description | text | Admin-editable [Q81] |
| featured | boolean | Controls homepage display [Q12] |
| order | number | Admin-reorderable [Q81] |
| published | boolean | Admin publish/unpublish [Q81] |

### 2.4 Demo Data Rules
- All demo data must be explicitly labeled as fictional [Q82, Q114, line 170].
- Sample inquiries, vacancies, testimonials, and news articles are pre-seeded for demonstration.
- Demo data uses browser-persistent storage [Q37, Q47, Q71].
- One-click reset restores original demo state [Q71 answer].
- No demo data may be presented as real customer information.

### 2.5 News Content Rules [Q77, Q113 second instance]
- Full editorial workflow: drafts, scheduling, publish, unpublish, revisions, approval workflows.
- Fields: title, excerpt, body, category, image (optional), author, publish date, status.
- Publication history and revision tracking.
- Related articles and archive management.

### 2.6 Testimonial Content Rules [Q31, Q114]
- Admin-managed: create, edit, reorder, publish/unpublish.
- Fictional demo entries clearly labeled.
- Fields: client name, text, rating (if applicable), order, published status.
- Actual testimonial content: `CLIENT INPUT REQUIRED`.

### 2.7 Vacancy Content Rules [Q14 answer]
- Process-first presentation; vacancies are secondary.
- Any sample vacancies must be labeled **FICTIONAL DEMO**.
- Actual vacancy content: `CLIENT INPUT REQUIRED`.

---

## 3. User Flows

### 3.1 Visitor Browses Services
1. Visitor lands on Home → sees welcome section and two branch cards [Q60].
2. Clicks a branch card → navigates to Documentation & Visa Services or International Job Services.
3. Views service cards [Q21] → clicks a card → modal opens with details and inquiry form [Q22].
4. **Failure:** Page fails to load → error state with retry button and recovery guidance [Q43].
5. **Failure:** Service data unavailable → loading skeleton, then error message if timeout.

### 3.2 Visitor Submits Visa Inquiry
1. Visitor clicks inquiry button on a service card or modal [Q22].
2. Multi-step form appears with progress indicator [Q32].
3. Visitor fills required fields (personal info, service type, documents if applicable).
4. Optional: visitor attaches documents (restricted types, size limits) [Q111].
5. Visitor submits → simulated processing → success confirmation [Q33].
6. Reference code displayed (category-prefixed, e.g., `HBS-VIS-0001` — **PROVISIONAL** format) [Q34].
7. WhatsApp follow-up button shown with prefilled message including reference code [Q33, Q74].
8. **Failure:** Validation errors → inline error messages per field, form not submitted.
9. **Failure:** File upload rejected → clear message about allowed types/sizes [Q111].
10. **Failure:** Submission fails → error message with retry option [Q43].
11. **Failure:** User navigates away mid-form → unsaved-form protection dialog [Q43].

### 3.3 Visitor Submits Job Inquiry
1. Same as 3.2 but from International Job Services page.
2. Form fields tailored to job assistance (experience, preferred role, etc.).
3. Reference code uses job category prefix (e.g., `HBS-JOB-0001` — **PROVISIONAL**) [Q34].

### 3.4 WhatsApp Follow-Up with Reference Code
1. After submission, visitor clicks WhatsApp button [Q33].
2. WhatsApp opens (or app prompt) with prefilled message containing reference code [Q74].
3. Visitor sends message to company WhatsApp number (`CLIENT INPUT REQUIRED`).
4. **Note:** Message delivery is not guaranteed by the system. No delivery confirmation is provided.

### 3.5 Admin Searches by Reference Code
1. Admin logs in (see 3.7) → navigates to Inquiries section [Q78].
2. Types reference code into search bar [Q35].
3. Matching inquiry displayed with full details.
4. **Failure:** No match → empty state with clear messaging.

### 3.6 Staff Updates Status and Notes
1. Admin/Staff opens an inquiry from the list [Q35].
2. Views unified timeline: notes, status changes, communication history [Q104].
3. Updates status from workflow options (admin-editable defaults) [Q36].
4. Adds internal note [Q35].
5. Views response-time metrics and overdue indicators [Q103].
6. **Failure:** Concurrent edit → last-write-wins with notification (or conflict resolution TBD).

### 3.7 Admin Manages Users / Settings / News / Services / Testimonials
1. Admin logs in with real server-side credentials [Q86].
2. Navigates via sidebar to relevant section [Q78].
3. **Users:** Create, edit, activate/deactivate, assign roles; non-production warnings displayed [Q82]. Sensitive actions (role change, deactivation) require re-auth/MFA [Q89].
4. **Settings:** Company details, demo access, notification rules, backup/restore, localization, system defaults [Q85].
5. **News:** Full editorial: create draft → edit → preview → schedule/publish → unpublish → archive [Q77, Q113].
6. **Services:** Create, edit, reorder, publish/unpublish, set categories/icons/featured [Q81].
7. **Testimonials:** Create, edit, reorder, publish/unpublish [Q114].
8. **Failure:** Unauthorized action → access denied message.
9. **Failure:** Session expired → redirect to login with return URL.

### 3.8 Backup / Restore / Reset
1. Admin navigates to Settings → Backup & Restore [Q47, Q85].
2. **Backup:** Downloads demo data as file (CSV for inquiries [Q37], full backup for all data).
3. **Restore:** Uploads previously downloaded backup → confirmation dialog → data restored [Q47].
4. **Reset:** One-click reset to original demo sample data → confirmation dialog [Q71 answer].
5. **Failure:** Invalid backup file → error message, no data modified.
6. **Failure:** Restore interruption → recovery guidance [Q43].

---

## 4. Demo vs Production Table

| Feature | Demo Status | Production Requirement |
|---|---|---|
| Public pages & content | ✅ Implemented | Same |
| Service cards & modals | ✅ Implemented | Same |
| Multi-step inquiry forms | ✅ Implemented | Same, with server-side validation |
| Reference code generation | ✅ Implemented (browser-local) | Production-unique generation (server) |
| WhatsApp deep links | ✅ Implemented (prefilled links) | Same; delivery depends on external WhatsApp |
| Admin login | ⚠️ Simulated unless auth provider configured | Real server-side auth required [Q86]; **BLOCKER if no provider/DB** |
| Admin CRUD (all sections) | ✅ Implemented (browser storage) | Server database required |
| Role-based permissions | ⚠️ Simulated in browser; labeled | Server-enforced RBAC [Q50 answer] |
| Data storage | Browser-persistent (localStorage) | Server database; `CLIENT INPUT REQUIRED` |
| CSV export | ✅ Implemented | Same |
| Backup/restore | ✅ Implemented (browser) | Encrypted server backups; `CLIENT INPUT REQUIRED` |
| Sample data reset | ✅ Implemented | N/A (production has real data) |
| File uploads | ⚠️ Simulated (browser storage) | Server-side storage, validation, malware scan [Q111] |
| Email notifications | ❌ Not implemented | `CLIENT INPUT REQUIRED` (provider needed) |
| SMS/push notifications | ❌ Not implemented | OPEN [Q55, Q91] |
| Analytics tracking | ⚠️ Simulated events | Privacy-conscious analytics provider needed [Q109]; `CLIENT INPUT REQUIRED` |
| Cookie consent | ✅ Implemented (UI) | Needs legal review of consent text |
| Map integration | ⚠️ Placeholder | Map provider `CLIENT INPUT REQUIRED` [Q106] |
| SEO | ✅ Implemented (technical) | Verify structured data with real company details |
| MFA / re-auth | ⚠️ UI only, labeled | Real MFA provider needed [Q89] |
| Audit logs | ⚠️ Simulated, demo entries labeled | Server-side audit trail; scope OPEN [Q83] |
| Privacy workflows (DSR, retention) | ⚠️ UI framework only | Legal review required [Q90] |
| i18n / Arabic | ❌ Architecture only | Translation files + RTL implementation [Q42, Q96] |
| CAPTCHA | ❌ Not implemented | Provider `CLIENT INPUT REQUIRED` |
| Malware scanning | ❌ Not implemented | Production-only [Q111] |

---

## 5. Conflicts Log, Open Decisions, and Known Issues

### 5.1 Resolved Conflicts

| # | Topic | Earlier Decision | Later Decision | Resolution | Tag |
|---|---|---|---|---|---|
| C1 | Color palette | Navy+Gold+White [Q3] | White/charcoal minimal [line 171] | **OFFICIAL BRAND SYSTEM:** Warm Cream (`#FEF3E2`) background, Deep Espresso (`#2A1A0E`) text, Burnt Orange (`#D4621A`) primary action, Golden Amber (`#F4AE52`) secondary accent. Strict Light Mode Only, no blue or neon colors. | Q3, line 171 |
| C2 | Jobs page | No listings [Q13] | Job assistance + sample vacancies [Q14 answer] | Process-first; any vacancies labeled **FICTIONAL DEMO** | Q13, Q14 |
| C3 | Admin auth | Demo credentials/roles [Q17, Q38, Q82] | Real server-side auth [Q86] | Real auth is the requirement; demo role UI is a labeled simulation layer; **BLOCKER** if provider/DB not configured | Q17, Q38, Q82, Q86 |
| C4 | Data storage | Session-only [Q16] | Browser-persistent + CSV/backup/restore/reset [Q37, Q47, Q71] | Browser-persistent demo data, isolated from production | Q16, Q37, Q47, Q71 |
| C5 | Hero section | Shared hero [Q4, Q9] | Welcome + two branch cards [Q60] | Shared welcome section, then two equal branch cards | Q4, Q9, Q60 |
| C6 | Admin dashboard scope | Minimal [Q11] | Expanded workspace [Q78] | Expanded workspace wins (later decision) | Q11, Q78 |
| C7 | Admin sidebar | Compact [Q69] | Expanded sections [Q78] | Expanded sections win (later decision) | Q69, Q78 |

### 5.2 Open Decisions (Unanswered)

| # | Topic | Question(s) | Status |
|---|---|---|---|
| O1 | Production notifications (email, SMS, push) | Q55, Q91 | OPEN — no answer in transcript |
| O2 | Reference code format | Q76 | OPEN — no answer; `HBS-VIS-0001` / `HBS-JOB-0001` is **PROVISIONAL** example from Q34 context only |
| O3 | Audit log scope (which events to record) | Q83 | OPEN — answer was about analytics, not audit logs |
| O4 | Social media link display style | Q107 | OPEN — answer was about SEO, not social media display |

### 5.3 Known Issues

| # | Issue | Details |
|---|---|---|
| K1 | 11 services never named | All 11 service names are `CLIENT INPUT REQUIRED` [Q12] |
| K2 | Auth provider unspecified | Real server-side auth required [Q86] but no provider (e.g., NextAuth, Clerk, Auth0) decided. **BLOCKER** for production. |
| K3 | Database unspecified | Server database required for production but no provider/type chosen [Q86, Q92]. **BLOCKER**. |
| K4 | Email provider unspecified | `CLIENT INPUT REQUIRED` |
| K5 | WhatsApp API provider unspecified | Deep links work without API; business API for notifications is `CLIENT INPUT REQUIRED` |
| K6 | Map provider unspecified | Embedded map required [Q106]; provider (Google Maps, Mapbox, etc.) `CLIENT INPUT REQUIRED` |
| K7 | Analytics provider unspecified | Privacy-conscious analytics required [Q109]; provider `CLIENT INPUT REQUIRED` |
| K8 | CAPTCHA provider unspecified | `CLIENT INPUT REQUIRED` |
| K9 | Transcript header/answer misalignment | Multiple question headers don't match the answer beneath them (Q14, Q50, Q61, Q65, Q71, Q79, Q83, Q107). Answers mapped by text content, not header. |
| K10 | Missing question numbers | Gaps in question numbering; some questions appear without headers (e.g., inquiry routing at line 311). |
| K11 | Q112 duplicated | Lines 336–338 and 341–343 are identical; duplicate ignored. |
| K12 | Demo role/auth tension | Demo user management UI [Q82] exists alongside real auth requirement [Q86]. Security warning required: demo role UI does not provide real access control. See `security.md` §2. |
| K13 | Company contacts/address/hours | `CLIENT INPUT REQUIRED` |
| K14 | Testimonial content | `CLIENT INPUT REQUIRED` |
| K15 | Vacancy content | `CLIENT INPUT REQUIRED` |
| K16 | Pricing information | `CLIENT INPUT REQUIRED` |
| K17 | Legal credentials/claims | `CLIENT INPUT REQUIRED` — never claim compliance |
| K18 | Typography style detail | Q61 header asked about typography but answer was about navigation. Typography settled by Q25 (modern sans-serif) only. Specific font family undecided. |

---

## 6. Acceptance Criteria

### Public Pages
- [ ] AC-01: All 8 pages render without errors on Chrome, Firefox, Safari (latest) [Q95].
- [ ] AC-02: All pages are responsive on mobile (375px), tablet (768px), desktop (1280px+) [Q5, Q95].
- [ ] AC-03: Home page shows welcome section and two equal branch cards [Q60].
- [ ] AC-04: Featured services appear on Home; all 11 appear on Documentation & Visa Services page [Q12].
- [ ] AC-05: Service card click opens modal with details and inquiry form [Q22].
- [ ] AC-06: International Job Services shows process description and sample vacancies labeled **FICTIONAL DEMO** [Q14 answer].
- [ ] AC-07: Contact Us shows split layout, map placeholder, office hours placeholder, WhatsApp/email/call actions [Q105, Q106].
- [ ] AC-08: News page shows responsive cards with title, date, excerpt, optional image [Q79 answer].
- [ ] AC-09: Footer is multi-column with services, jobs, company info, contacts, and Privacy & Terms link [Q26, Q15].
- [ ] AC-10: Light-only theme enforced; warm refined Dubai aesthetic applied [Q29 OVERRIDDEN].

### Inquiry Submission
- [ ] AC-11: Multi-step form with progress indicator validates each step before advancing [Q32].
- [ ] AC-12: Successful submission shows confirmation with reference code and WhatsApp button [Q33].
- [ ] AC-13: WhatsApp button opens WhatsApp with prefilled message including reference code [Q74].
- [ ] AC-14: File upload accepts only allowed types and rejects oversized files with clear messaging [Q111].
- [ ] AC-15: Navigating away from a partially filled form triggers unsaved-data warning [Q43].
- [ ] AC-16: Submission errors show retry option [Q43].

### Admin Dashboard
- [ ] AC-17: Admin login uses real server-side authentication (or documented BLOCKER if unconfigured) [Q86].
- [ ] AC-18: Dashboard shows expanded sections: Overview, Inquiries, Services, News, Testimonials, Users, Audit Logs, Analytics, Documents, Settings [Q78].
- [ ] AC-19: Overview shows analytics: trends, conversion metrics, charts, branch comparisons [Q70].
- [ ] AC-20: Inquiries section supports search by reference code, filters, status update, internal notes, date filters, CSV export [Q35, Q65 answer].
- [ ] AC-21: Inquiry detail shows unified timeline with notes, status changes, communication history [Q104].
- [ ] AC-22: Response-time metrics and overdue indicators display on inquiry detail [Q103].
- [ ] AC-23: Inquiry routing by branch, category, configurable rules, manual reassignment works [line 311].
- [ ] AC-24: Services section supports CRUD, reorder, publish/unpublish, categories, icons, featured [Q81].
- [ ] AC-25: News section supports full editorial workflow: drafts, scheduling, publish, revisions, approval [Q77, Q113].
- [ ] AC-26: Testimonials section supports CRUD, reorder, publish/unpublish; fictional entries labeled [Q114].
- [ ] AC-27: Users section supports CRUD, activate/deactivate, role assignment; non-production warnings shown [Q82].
- [ ] AC-28: Staff role can manage inquiries but cannot access Users or Settings [Q39].
- [ ] AC-29: Admin role has full access [Q39].
- [ ] AC-30: Sensitive actions (role change, deactivation, security settings) require re-auth/MFA prompt [Q89].
- [ ] AC-31: Settings allows editing company details, demo access, notification rules, backup/restore, localization, system defaults [Q85].
- [ ] AC-32: Backup downloads demo data; restore uploads backup; reset returns to sample data [Q47, Q71 answer].

### SEO & Accessibility
- [ ] AC-33: Each page has unique title tag and meta description [Q41].
- [ ] AC-34: sitemap.xml and robots.txt present; admin pages have noindex [Q107 answer].
- [ ] AC-35: Open Graph tags present on public pages [Q41].
- [ ] AC-36: All interactive elements are keyboard-accessible [Q95].
- [ ] AC-37: Color contrast meets WCAG AA [Q95].

### Privacy & Consent
- [ ] AC-38: Cookie consent banner appears on first visit with essential/analytics separation [Q110].
- [ ] AC-39: User can change consent preferences later [Q110].
- [ ] AC-40: Privacy & Terms page accessible from footer [Q15].

### Demo Integrity
- [ ] AC-41: All demo data is labeled as fictional [line 170, Q82, Q114].
- [ ] AC-42: No functionality is presented as production-complete when simulated [line 170].
- [ ] AC-43: Browser storage is never described as "secure" in any user-facing text.
- [ ] AC-44: Demo admin login displays non-production security warnings [Q82].
