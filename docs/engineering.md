# Engineering: Horizon Business Services

---

## 1. Coding Standards

### 1.1 Repository Structure [Q46, Q94]
```
/
├── .github/
│   ├── CODEOWNERS                    [Q94]
│   ├── pull_request_template.md      [Q94]
│   ├── workflows/
│   │   ├── ci.yml                    [Q94]
│   │   └── deploy.yml                [Q93]
│   └── CONTRIBUTING.md               [Q94]
├── docs/
│   └── adr/                          [Q94] — Architecture Decision Records
├── public/
│   ├── images/                       [Q49]
│   ├── robots.txt                    [Q107 answer]
│   └── sitemap.xml                   [Q107 answer]
├── src/
│   ├── app/                          — Next.js App Router pages
│   │   ├── (public)/                 — Public route group
│   │   │   ├── page.tsx              — Home
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   │   ├── visa/
│   │   │   │   └── jobs/
│   │   │   ├── contact/
│   │   │   ├── news/
│   │   │   │   └── [slug]/
│   │   │   └── privacy/
│   │   ├── admin/                    — Admin route group
│   │   │   ├── login/
│   │   │   ├── overview/
│   │   │   ├── inquiries/
│   │   │   │   └── [id]/
│   │   │   ├── services/
│   │   │   ├── news/
│   │   │   │   └── [id]/
│   │   │   ├── testimonials/
│   │   │   ├── users/
│   │   │   ├── audit-logs/
│   │   │   ├── analytics/
│   │   │   ├── documents/
│   │   │   └── settings/
│   │   ├── api/                      — API routes
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/                       — Shared primitives (Button, Input, etc.)
│   │   ├── layout/                   — Navbar, Footer, Sidebar, etc.
│   │   ├── forms/                    — MultiStepForm, FormFields
│   │   ├── admin/                    — Admin-specific components
│   │   └── shared/                   — ServiceCard, StatusBadge, etc.
│   ├── hooks/                        — Custom React hooks
│   ├── lib/
│   │   ├── auth/                     — Auth utilities
│   │   ├── data/                     — Demo data layer, localStorage wrappers
│   │   ├── validation/               — Zod schemas
│   │   └── utils/                    — Shared utilities
│   ├── types/                        — TypeScript type definitions
│   ├── config/                       — App configuration, constants
│   ├── messages/                     — i18n translation files [Q96]
│   │   └── en/
│   └── styles/                       — Global styles, design tokens
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/                     — Test data
├── .env.example                      [see §4.3]
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── package.json
└── README.md
```

### 1.2 Naming Conventions
| Element | Convention | Example |
|---|---|---|
| Files (components) | PascalCase | `ServiceCard.tsx` |
| Files (utilities) | camelCase | `formatDate.ts` |
| Files (pages) | `page.tsx` (App Router) | `src/app/about/page.tsx` |
| Directories | kebab-case | `audit-logs/` |
| Types/interfaces | PascalCase, prefix `I` only for interfaces if needed | `Inquiry`, `ServiceCardProps` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| Hooks | `use` prefix, camelCase | `useInquiries` |
| Environment variables | UPPER_SNAKE_CASE, `NEXT_PUBLIC_` prefix for client | `NEXT_PUBLIC_WHATSAPP_NUMBER` |

### 1.3 TypeScript Strictness [Q7]
- `strict: true` in `tsconfig.json`.
- `noUncheckedIndexedAccess: true`.
- No `any` without explicit justification comment.
- Explicit return types on exported functions.
- Zod for runtime validation of API inputs and form data [DERIVED — validation library].

### 1.4 Linting & Formatting [Q94]
- ESLint with `eslint-config-next`, strict rules enabled.
- Prettier for formatting, run on save and in CI.
- No warnings allowed in CI (treat as errors) [Q94].

### 1.5 Commit & Release Conventions [Q94]
- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `perf:`.
- Branch naming: `feat/short-description`, `fix/short-description`.
- Semantic versioning for releases [Q94].

### 1.6 CODEOWNERS [Q94]
- Define per directory/file pattern in `.github/CODEOWNERS`.
- At minimum: project lead owns `*`, specialist owners for `src/lib/auth/`, `security.md`, etc.

### 1.7 Architecture Decision Records [Q94]
- Stored in `docs/adr/NNNN-title.md`.
- Template: Status, Context, Decision, Consequences.
- ADR-0001: Use Next.js App Router [Q7].
- ADR-0002: Demo data in localStorage [Q37].
- ADR-0003: Real auth requirement [Q86].

### 1.8 PR Checks [Q94]
- All PRs require: lint pass, type check, unit tests, build success.
- At least one CODEOWNER approval required.
- PR description template enforced via `.github/pull_request_template.md`.

---

## 2. Error Handling

### 2.1 Error Taxonomy [Q43]
| Category | Code | HTTP | User Message | Action |
|---|---|---|---|---|
| Validation error | `VALIDATION_ERROR` | 400 | "Please check the highlighted fields." | Inline field errors |
| Authentication required | `UNAUTHORIZED` | 401 | "Please log in to continue." | Redirect to login |
| Insufficient permissions | `FORBIDDEN` | 403 | "You don't have permission for this action." | Display message |
| Not found | `NOT_FOUND` | 404 | "We couldn't find what you're looking for." | Custom 404 page |
| Rate limited | `RATE_LIMITED` | 429 | "Too many requests. Please try again in a moment." | Auto-retry after delay |
| Server error | `INTERNAL_ERROR` | 500 | "Something went wrong. Please try again." | Retry button + error boundary |
| Network error | `NETWORK_ERROR` | — | "Connection lost. Please check your connection." | Retry button |

### 2.2 User-Facing Error Rules [Q43]
- Never expose stack traces, internal IDs, or technical details to users.
- Always provide a clear next action (retry, go back, contact support).
- Inline validation errors appear immediately on field blur.
- Form-level errors appear above the submit button.
- Toast notifications for transient errors (network, server).

### 2.3 Retry Logic [Q43]
- Network errors: auto-retry once after 2s, then manual retry button.
- Rate limit: auto-retry after `Retry-After` header value.
- Server errors: manual retry button only.
- Never auto-retry mutations (POST, PATCH, DELETE) — show retry button.

### 2.4 Unsaved Form Protection [Q43]
- Detect form dirty state.
- `beforeunload` event warns on page close/navigation.
- In-app navigation: confirmation dialog "You have unsaved changes. Leave anyway?"

### 2.5 Error Boundaries [Q43]
- React Error Boundary wraps each major section (admin sections, public pages).
- Fallback UI: error message + retry + "return to home/dashboard" link.
- Next.js `error.tsx` at route group level.
- `not-found.tsx` for 404.

### 2.6 Standard API Error Format
```typescript
interface ApiError {
  error: {
    code: string;          // e.g., "VALIDATION_ERROR"
    message: string;       // Human-readable
    details?: {            // Per-field errors
      field: string;
      message: string;
    }[];
  };
}
```
See `architecture.md` §3 API Routes.

### 2.7 Logging Rules
- Server-side: structured JSON logs with request ID, timestamp, error code, user ID (if authenticated).
- **Never log:** passwords, tokens, session IDs, PII beyond user ID, file contents [DERIVED — security].
- Client-side: console.error for development only; production sends to error tracking service (`CLIENT INPUT REQUIRED`).

---

## 3. Testing Plan

### 3.1 Test Strategy [Q95]

| Level | Tool | Coverage Target | Focus |
|---|---|---|---|
| Unit | Jest + React Testing Library | ≥80% of utility functions, hooks, validation schemas | Business logic, data transformations, validation |
| Integration | Jest + React Testing Library | All API route handlers | API request/response, auth middleware, data layer |
| E2E | Playwright | All critical user flows (see §3.2) | Full user journeys, cross-browser |
| Accessibility | axe-core (automated) + manual audit | All pages and interactive components | WCAG 2.1 AA compliance [Q95] |
| Responsive | Playwright device emulation | 375px, 768px, 1280px, 1920px | Layout integrity per breakpoint [Q95] |
| Security | npm audit + dependency scanning | All dependencies | Known vulnerabilities [Q94] |
| Performance | Lighthouse CI | All public pages | LCP < 2.5s, FID < 100ms, CLS < 0.1 [Q41] |

### 3.2 Critical E2E Flows → Acceptance Criteria Mapping
| Test | Acceptance Criteria (see `context.md` §6) |
|---|---|
| Home page renders with branch cards | AC-01, AC-03 |
| Browse services, open modal | AC-04, AC-05 |
| Submit visa inquiry end-to-end | AC-11, AC-12, AC-13, AC-16 |
| Submit job inquiry end-to-end | AC-11, AC-12, AC-13 |
| File upload validation | AC-14 |
| Unsaved form warning | AC-15 |
| Admin login | AC-17 |
| Admin search inquiry by reference code | AC-20 |
| Admin update inquiry status | AC-20 |
| Admin add inquiry note | AC-20 |
| Admin export CSV | AC-20 |
| Admin manage services (CRUD) | AC-24 |
| Admin manage news (full editorial) | AC-25 |
| Admin manage testimonials | AC-26 |
| Admin manage users (role change triggers re-auth) | AC-27, AC-28, AC-29, AC-30 |
| Admin backup/restore/reset | AC-32 |
| Light-only theme | AC-10 |
| Cookie consent banner | AC-38, AC-39 |
| Responsive layout check (3 breakpoints) | AC-02 |
| Demo data labeled as fictional | AC-41, AC-42 |

### 3.3 Error-State Tests [Q95]
- Network offline → error message + retry.
- Invalid form submission → inline errors shown.
- Expired session → redirect to login.
- Unauthorized route access → 403 page.
- 404 for invalid URLs.
- Server error → error boundary fallback.

### 3.4 Post-Deployment Verification [Q95]
- Smoke tests on Vercel preview URL: home page loads, admin login works, form submission works.
- Lighthouse audit on preview URL.
- Check `robots.txt`, `sitemap.xml` accessible.
- Verify admin pages have `noindex`.
- Check WhatsApp links open correctly.

---

## 4. Deployment

### 4.1 Vercel Configuration [Q45, Q93]
- Framework preset: Next.js.
- Build command: `next build`.
- Output directory: `.next`.
- Preview deployments on PRs.
- Production deployment on `main` branch merge.

### 4.2 Environments [Q92, Q93]
| Environment | Branch | URL | Purpose |
|---|---|---|---|
| Development | `dev` | `localhost:3000` | Local development |
| Preview | PR branches | `*.vercel.app` | PR review, client demo [Q44, Q93] |
| Production | `main` | Custom domain (TBD) | Live site (post-approval) |

### 4.3 Environment Variables
`.env.example` — names only, no values:

```env
# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_ENVIRONMENT=          # development | preview | production

# Auth (CLIENT INPUT REQUIRED — BLOCKER)
AUTH_PROVIDER=                    # e.g., nextauth, clerk, auth0
AUTH_SECRET=
DATABASE_URL=

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=      # CLIENT INPUT REQUIRED

# Map (CLIENT INPUT REQUIRED)
NEXT_PUBLIC_MAP_PROVIDER=
NEXT_PUBLIC_MAP_API_KEY=

# Analytics (CLIENT INPUT REQUIRED)
NEXT_PUBLIC_ANALYTICS_ID=

# CAPTCHA (CLIENT INPUT REQUIRED)
NEXT_PUBLIC_CAPTCHA_SITE_KEY=
CAPTCHA_SECRET_KEY=

# Email (CLIENT INPUT REQUIRED)
EMAIL_PROVIDER=
EMAIL_API_KEY=

# File storage (production only)
STORAGE_PROVIDER=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

### 4.4 CI Quality Gates [Q94, Q95]
| Gate | Tool | Blocking |
|---|---|---|
| TypeScript type check | `tsc --noEmit` | Yes |
| Lint | ESLint | Yes |
| Format check | Prettier `--check` | Yes |
| Unit tests | Jest | Yes |
| Integration tests | Jest | Yes |
| E2E tests | Playwright | Yes (on `main` PRs) |
| Build | `next build` | Yes |
| Accessibility audit | axe-core | Warning (not blocking) |
| Security scan | `npm audit` / Dependabot | Warning on high/critical |
| Lighthouse | Lighthouse CI | Warning |
| Bundle size | Next.js analyzer | Warning |

### 4.5 Rollout & Rollback [Q93]
- **Rollout:** Vercel automatic deployment on merge to `main`. Instant edge propagation.
- **Rollback:** Vercel instant rollback to previous deployment via dashboard or CLI.
- **Preview:** Every PR gets a unique preview URL for testing before merge.
- **Feature flags:** Consider for gradual rollout of production features [DERIVED — optional].

### 4.6 README Contents
- Project overview and purpose.
- Prerequisites (Node.js version, npm/yarn).
- Setup instructions (`npm install`, `.env` configuration).
- Development commands (`npm run dev`, `npm run lint`, `npm run test`).
- Deployment process.
- Architecture overview with link to `architecture.md`.
- Contributing guidelines link.
- Demo access instructions (with security warnings) [Q82].
- License.
