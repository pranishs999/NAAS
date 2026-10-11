# UI/UX: Horizon Business Services

---

## 1. Design System

### 1.1 Color Palette — **OFFICIAL BRAND COLOR SYSTEM** (Horizon Business Services)
Official four-color brand system: Warm Cream, Golden Amber, Burnt Orange, and Deep Espresso. Strict Light Only mode, with absolutely no blue, navy, cyan, or neon colors.

| Token | Light Value | Usage | Source / Notes |
|---|---|---|---|
| `--color-bg-primary` / `--bg-cream` | `#FEF3E2` (rgb: 254, 243, 226) | Primary page background (warm cream / beige) | [OFFICIAL 4-COLOR BRAND SYSTEM] |
| `--color-bg-secondary` / `--surface-white` | `#FFFFFF` | Card & form container surface | [OFFICIAL 4-COLOR BRAND SYSTEM] |
| `--color-text-primary` / `--text-espresso` | `#2A1A0E` (rgb: 42, 26, 14) | Headings, body text, navigation labels (deep espresso / black) | [OFFICIAL 4-COLOR BRAND SYSTEM] |
| `--color-text-secondary` | `rgba(42, 26, 14, 0.55)` | Secondary & muted text (espresso at 55% opacity) | [OFFICIAL 4-COLOR BRAND SYSTEM] |
| `--accent-primary` / `--action-orange` | `#D4621A` (rgb: 212, 98, 26) | Primary action buttons, active tabs, main links (burnt orange) | [OFFICIAL 4-COLOR BRAND SYSTEM] |
| `--accent-secondary` / `--accent-amber` | `#F4AE52` (rgb: 244, 174, 82) | Highlights, decorative lines, badge accents (warm gold) | [OFFICIAL 4-COLOR BRAND SYSTEM] |
| `--color-border` / `--border-cream` | `rgba(42, 26, 14, 0.12)` | Soft borders & hairline dividers (espresso at 12% opacity) | [OFFICIAL 4-COLOR BRAND SYSTEM] |
| `--color-success` | `#2A1A0E` | Muted espresso status | [OFFICIAL 4-COLOR BRAND SYSTEM] |
| `--color-error` | `#D4621A` | Burnt orange error status | [OFFICIAL 4-COLOR BRAND SYSTEM] |
| `--color-warning` | `#D4621A` | Burnt orange warning status | [OFFICIAL 4-COLOR BRAND SYSTEM] |

### 1.2 Typography [Q25]
- **Family:** Modern sans-serif; specific font `CLIENT INPUT REQUIRED` (Q61 header unanswered for specifics; Q25 sets "modern sans-serif"). Recommendation: Inter, system-ui fallback.
- **Scale:**

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--text-h1` | 2.5rem / 40px | 700 | Page titles |
| `--text-h2` | 2rem / 32px | 600 | Section headings |
| `--text-h3` | 1.5rem / 24px | 600 | Subsection headings |
| `--text-body` | 1rem / 16px | 400 | Body text |
| `--text-small` | 0.875rem / 14px | 400 | Captions, meta |
| `--text-xs` | 0.75rem / 12px | 400 | Labels, badges |

### 1.3 Spacing
- Base unit: `4px`.
- Scale: `4, 8, 12, 16, 24, 32, 48, 64, 96` px.
- Generous whitespace per minimal modern direction [line 171].

### 1.4 Motion [Q28]
- Subtle premium animations: smooth fades, hover effects, refined transitions.
- Duration: 150–300ms for micro-interactions; 300–500ms for page transitions.
- Easing: `ease-out` for entrances, `ease-in-out` for state changes.
- `prefers-reduced-motion: reduce` → disable all non-essential animations [DERIVED — accessibility].

### 1.5 Light Only Mode [Q29 OVERRIDDEN]
- Theme mode: Light Only (Strict).
- Dark mode, theme toggles, and `prefers-color-scheme` dark overrides are completely disabled per user override (overriding Q29).
- Aesthetic: Warm, refined, luxurious, understated Dubai styling throughout.

---

## 2. Page Layouts

### 2.1 Home [Q60, Q24]
1. **Navigation bar** (shared across all pages)
2. **Welcome section** — refined typography, Dubai imagery background [Q20, Q60]
3. **Two branch cards** — equal size, equal prominence: Documentation & Visa | International Jobs [Q60, Q24]
4. **Featured services** — subset of 11, premium cards [Q12, Q21]
5. **Trust section** — transparent processes, proof, disclaimers [Q30]
6. **Testimonials carousel** — admin-managed, fictional entries labeled [Q31]
7. **WhatsApp floating button** (persistent) [Q23]
8. **Footer**

### 2.2 About Us
1. Navigation bar
2. Company overview — `CLIENT INPUT REQUIRED`
3. Mission/values — `CLIENT INPUT REQUIRED`
4. Trust indicators — `CLIENT INPUT REQUIRED`
5. Footer

### 2.3 Documentation & Visa Services [Q64]
1. Navigation bar
2. Page header with branch identity
3. Service cards grid — all 11 services, premium cards with icons, descriptions, inquiry buttons [Q21, Q64]
4. Each card opens service modal on click [Q22]
5. Footer

### 2.4 International Job Services [Q14 answer]
1. Navigation bar
2. Page header with branch identity
3. Job assistance process explanation (process-first)
4. Sample vacancies — clearly labeled **FICTIONAL DEMO** [Q14 answer]
5. Job inquiry CTA
6. Footer

### 2.5 Contact Us [Q105, Q106]
1. Navigation bar
2. Split layout: contact info | contact form
3. Branch-specific inquiry choices [Q105]
4. Click-to-call, email links, WhatsApp action buttons [Q105]
5. Embedded interactive map — provider `CLIENT INPUT REQUIRED` [Q106]
6. Office address — `CLIENT INPUT REQUIRED`
7. Office hours — `CLIENT INPUT REQUIRED`
8. Footer

### 2.6 News & Updates [Q77, Q79 answer]
1. Navigation bar
2. News listing — responsive cards: title, date, excerpt, optional image [Q79 answer]
3. Category filters [Q113]
4. Pagination
5. Individual article view at `/news/[slug]` [Q113]
6. Footer

### 2.7 Admin Login [Q86]
1. Centered login card
2. Email/password fields
3. Non-production security warning (demo mode) [Q82]
4. Forgot password link (functional only if auth provider configured)
5. Error messaging for failed attempts

### 2.8 Admin Dashboard [Q78]
1. **Sidebar** — expanded sections: Overview, Inquiries, Services, News, Testimonials, Users, Audit Logs, Analytics, Documents, Settings [Q78]
2. **Top bar** — user info, notifications placeholder, logout
3. **Main content area** — section-specific content
4. **Responsive:** sidebar collapses to hamburger on mobile [DERIVED]

---

## 3. Component Inventory

| Component | Purpose | Props/Variants | States | Accessibility | Source |
|---|---|---|---|---|---|
| **Navbar** | Primary navigation | `variant: public \| admin`; Services dropdown; branch action buttons | default, scrolled, mobile-open | Keyboard nav, aria-expanded, skip-to-content link | [Q19, Q61 answer] |
| **MobileDrawer** | Slide-out mobile nav | `isOpen: boolean` | open, closed, transitioning | Focus trap, aria-modal, Escape to close | [Q19] |
| **HeroWelcome** | Home welcome section | `backgroundImage, title, subtitle` | loaded, image-loading | alt text on image, semantic heading | [Q60] |
| **BranchCard** | Home branch CTAs | `branch: visa \| jobs`, `title, description, icon, href` | default, hover, focus | role=link, focus-visible ring | [Q60] |
| **ServiceCard** | Display a service | `service: Service`, `variant: featured \| full` | default, hover, focus | button role, aria-label | [Q21, Q64] |
| **ServiceModal** | Service detail + form | `service: Service`, `isOpen: boolean` | open, closed, form-active | Focus trap, aria-modal, Escape to close | [Q22] |
| **MultiStepForm** | Inquiry submission | `steps: FormStep[]`, `branch: visa \| jobs` | step-N, validating, submitting, success, error | aria-live for step changes, required fields marked | [Q32] |
| **ProgressIndicator** | Form step progress | `currentStep, totalSteps` | active-step highlighted | aria-label="Step N of M" | [Q32] |
| **ConfirmationCard** | Post-submission | `referenceCode, branch` | displayed | aria-live="polite" announcement | [Q33] |
| **WhatsAppButton** | WhatsApp deep link | `variant: floating \| contextual \| followup`, `message: string` | default, hover | aria-label, opens new window notice | [Q23, Q74] |
| **Footer** | Site footer | Multi-column: services, jobs, company, contacts, legal | default | nav landmark, link lists | [Q26] |
| **ThemeToggle** | *(Removed)* | Deprecated | Removed per latest user override (Light Only) | — | [Q29 OVERRIDDEN] |
| **CookieBanner** | Consent collection | `hasConsented: boolean` | visible, dismissed, settings-open | focus trap when visible | [Q110] |
| **Toast** | Notifications | `type: success \| error \| warning \| info`, `message, duration` | entering, visible, exiting | role="alert", aria-live="assertive" | [Q43] |
| **ConfirmDialog** | Destructive action confirm | `title, message, confirmLabel, cancelLabel` | open, closed | Focus trap, aria-modal, Escape to cancel | [DERIVED — delete/reset actions] |
| **DataTable** | Admin list views | `columns, data, sortable, filterable, searchable` | loading, loaded, empty, error | aria-sort on headers, keyboard navigation | [Q35] |
| **Chart** | Analytics visualizations | `type: line \| bar \| pie`, `data, config` | loading, loaded, empty | aria-label with data summary, color-blind safe | [Q40, Q70] |
| **InquiryTimeline** | Communication history | `events: TimelineEvent[]` | loaded, empty | ordered list, datetime formatted | [Q104] |
| **StatusBadge** | Inquiry status | `status: string`, `variant: pill \| dot` | per-status color | text label always visible (not color-only) | [Q36] |
| **EmptyState** | No data placeholder | `icon, title, description, actionLabel, actionHref` | displayed | — | [Q43] |
| **LoadingState** | Content loading | `variant: skeleton \| spinner \| progress` | animating | aria-busy="true", aria-label | [Q43] |
| **ErrorState** | Error display | `message, retryAction` | displayed | role="alert" | [Q43] |
| **FileUpload** | Document attachment | `allowedTypes, maxSize` | idle, dragging, uploading, complete, error | aria-label, error messages | [Q111] |
| **NewsCard** | News listing item | `article: NewsArticle` | default, hover | semantic article element | [Q79 answer] |
| **TestimonialCard** | Testimonial display | `testimonial: Testimonial` | default | blockquote semantics | [Q31] |
| **MapEmbed** | Office location | `address` (provider TBD) | loading, loaded, error | aria-label, fallback link | [Q106] |

---

## 4. Admin Dashboard UI — Per Section

### 4.1 Overview [Q70]
- Summary stat cards: total inquiries, new today, pending, conversion rate.
- Trend charts: inquiries over time (line), by branch (bar), by status (pie).
- Branch comparison metrics [Q70].
- Date range filter [Q40].
- Recent inquiries quick list.

### 4.2 Inquiries [Q35, Q65 answer]
- DataTable with columns: reference code, name, branch, service, status, assignee, date.
- Search bar (reference code, name, email) [Q35].
- Filters: branch, status, date range, assignee [Q35].
- Bulk status update [DERIVED — efficiency].
- **Detail view:** full inquiry data, unified timeline [Q104], response-time metrics [Q103], overdue indicators [Q103], status update dropdown, note input, document list, reassign control [line 311].

### 4.3 Services [Q81]
- DataTable/list: name, category, published, featured, order.
- Drag-to-reorder [Q81].
- Create/edit form: name, category, icon picker, description, featured toggle, published toggle.
- Publish/unpublish action [Q81].

### 4.4 News [Q77, Q113]
- DataTable: title, status, category, author, publish date.
- Rich text editor for body.
- Status workflow: draft → scheduled → published → unpublished → archived [Q113].
- Image upload for article image [Q79 answer].
- Preview mode [Q113].
- Revision history list [Q113].
- Scheduling controls [Q113].

### 4.5 Testimonials [Q114]
- DataTable/list: client name, excerpt, published, order.
- Drag-to-reorder [Q114].
- Create/edit form.
- Publish/unpublish [Q114].
- Fictional demo entries labeled [Q114].

### 4.6 Users [Q82]
- DataTable: name, email, role, active status, last login.
- Create/edit form: name, email, role, active toggle.
- Non-production security warnings displayed prominently [Q82].
- Role change and deactivation trigger re-auth/MFA prompt [Q89].

### 4.7 Audit Logs [Q78, Q83 OPEN]
- DataTable: timestamp, user, action, entity, details.
- Filters: user, action type, date range.
- Read-only; no edit/delete.
- Demo entries labeled.
- **Scope of events logged is OPEN** [Q83]. See `security.md` §4.

### 4.8 Analytics [Q40, Q83 answer]
- Inquiry trends chart (line) with date range selector.
- Branch comparison (bar chart).
- Conversion funnel visualization.
- Status distribution (pie chart).
- Response-time averages [Q103].
- CSV export button [Q83 answer].
- Printable summary view [Q83 answer].

### 4.9 Documents [Q112]
- DataTable: file name, inquiry reference, type, size, uploaded date, retention date.
- Preview (for supported types), download, delete.
- Access permissions per role [Q112].
- Retention date indicator [Q112].

### 4.10 Settings [Q85]
- **Company details:** name, phone, email, address, hours, WhatsApp number, social links, logo [Q27, Q48].
- **Demo access:** demo credentials display, access controls [Q85].
- **Notification rules:** placeholder / OPEN [Q55, Q91] [Q85].
- **Backup & restore:** export button, restore upload, sample-data reset button with confirmation [Q47, Q71 answer].
- **Localization:** locale preferences, future RTL toggle [Q85, Q96].
- **System defaults:** default inquiry status, default routing rules, retention settings [Q85].

---

## 5. SEO Checklist (Must-Have) [Q41, Q107 answer]

| Item | Requirement | Status | Source |
|---|---|---|---|
| Title tags | Unique, descriptive per page (≤60 chars) | Required | [Q41] |
| Meta descriptions | Compelling, per page (≤160 chars) | Required | [Q41] |
| Clean URLs | Semantic, lowercase, hyphenated | Required | [Q107 answer] |
| Open Graph | og:title, og:description, og:image, og:url on all public pages | Required | [Q41] |
| Canonical URLs | Self-referencing canonical on every page | Required | [Q107 answer] |
| `sitemap.xml` | Auto-generated, public pages only | Required | [Q107 answer] |
| `robots.txt` | Allow public, disallow `/admin/*` | Required | [Q107 answer] |
| Structured data | Organization schema (with verified details only — `CLIENT INPUT REQUIRED`) | Required | [Q107 answer] |
| Admin noindex | `<meta name="robots" content="noindex,nofollow">` on all admin pages | Required | [Q107 answer] |
| Image optimization | Next.js `<Image>` component, WebP, lazy loading, appropriate alt text | Required | [Q49, Q107 answer] |
| Performance targets | LCP < 2.5s, FID < 100ms, CLS < 0.1 | Required | [Q41] |
| Heading hierarchy | Single `<h1>` per page, logical heading order | Required | [DERIVED — SEO baseline] |

---

## 6. Accessibility & Responsive Requirements

### 6.1 Accessibility Standards
- Target: WCAG 2.1 AA [DERIVED — industry standard].
- All interactive elements keyboard-accessible [Q95].
- Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text.
- Focus indicators visible on all interactive elements.
- Screen reader tested with NVDA/VoiceOver.
- `prefers-reduced-motion` respected [DERIVED].
- `lang` attribute on `<html>` [DERIVED].
- Skip-to-content link [DERIVED].
- Form inputs have associated labels.
- Error messages linked to fields via `aria-describedby`.
- Modals/drawers trap focus and close on Escape.

### 6.2 Responsive Breakpoints
| Breakpoint | Name | Behavior |
|---|---|---|
| < 640px | Mobile | Single column, mobile drawer nav, stacked cards |
| 640–1024px | Tablet | Two-column grid, drawer nav or compact horizontal nav |
| > 1024px | Desktop | Full layout, expanded nav with dropdowns, sidebar in admin |

### 6.3 Per-Page / Per-Component Acceptance Checklist

| Page / Component | Keyboard | Screen Reader | Contrast | Responsive | Reduced Motion |
|---|---|---|---|---|---|
| Navbar + Drawer | Tab order, Escape close | Landmark, aria-expanded | ✅ | Drawer on mobile | Menu animation |
| Home Hero | — | alt text, heading hierarchy | ✅ | Image scales, text reflows | Fade-in disabled |
| Branch Cards | Enter/Space activates | aria-label describes branch | ✅ | Stack on mobile | Hover effect disabled |
| Service Cards | Enter/Space opens modal | aria-label with service name | ✅ | Grid reflows to 1/2 col | Hover effect disabled |
| Service Modal | Focus trap, Escape close | aria-modal, role=dialog | ✅ | Full-screen on mobile | Entry animation disabled |
| Multi-step Form | Tab through fields, Enter submit | Step announced via aria-live | ✅ | Full-width on mobile | Progress animation disabled |
| WhatsApp Buttons | Enter/Space activates | aria-label, new-window warning | ✅ | Responsive sizing | — |
| Cookie Banner | Tab to accept/reject/settings | role=dialog, aria-live | ✅ | Full-width on mobile | Slide-in disabled |
| Data Tables | Arrow keys for navigation | Column headers, row count | ✅ | Horizontal scroll or card view on mobile | — |
| Charts | — | aria-label with data summary | Color-blind safe palette | Scales down | Animation disabled |
| Theme Toggle | Enter/Space toggles | aria-label, current state | ✅ | — | Crossfade disabled |
| Footer | Tab through links | nav landmark | ✅ | Stacks columns | — |
| Admin Sidebar | Tab order, Enter expands | nav landmark, aria-current | ✅ | Collapses to hamburger | — |
| Toasts | Auto-dismiss, Escape close | role=alert, aria-live | ✅ | Full-width on mobile | Slide-in disabled |
