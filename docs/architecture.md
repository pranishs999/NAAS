# Architecture: Horizon Business Services

---

## 1. System Architecture

### Stack
- **Framework:** Next.js (App Router) + TypeScript (strict mode) + Tailwind CSS [Q7]
- **Hosting:** Vercel [Q45, Q93]
- **Auth provider:** `CLIENT INPUT REQUIRED` — **BLOCKER** [Q86]. Real server-side auth required; demo layer simulates roles until provider is configured.
- **Database:** `CLIENT INPUT REQUIRED` — **BLOCKER** [Q86, Q92]. Demo uses browser-persistent storage (localStorage); production requires a server database.
- **i18n:** English now; centralized translation files, locale-aware routing foundations, RTL-ready for future Arabic [Q42, Q96].

### Rendering Strategy
| Route Type | Strategy | Rationale |
|---|---|---|
| Public pages (Home, About, Services, Jobs, Contact, News) | SSG or ISR | Static content, fast load, SEO [Q41] |
| News article detail | ISR | Editable content, needs freshness |
| Admin Login | SSR | Server-side auth validation [Q86] |
| Admin Dashboard | CSR (SPA) | Dynamic, interactive, auth-gated [Q78] |
| API routes | Serverless functions | Data operations |

### Environment Separation [Q92]
| Environment | Purpose | Data Layer | Auth |
|---|---|---|---|
| Demo (default) | Client evaluation | Browser localStorage | Simulated (labeled) or real if configured |
| Preview | PR review | Same as demo | Same as demo |
| Production | Live operations | Server database | Real server-side auth [Q86] |

Separation enforced via environment variables. Demo data never touches production database. See `security.md` §6.

### i18n Architecture [Q42, Q96]
- Locale prefix strategy: `/{locale}/path` (e.g., `/en/about`, `/ar/about`).
- Default locale (`en`) may omit prefix [DERIVED — standard Next.js i18n pattern].
- Translation files: JSON per locale per namespace (e.g., `messages/en/common.json`).
- RTL: CSS logical properties; `dir="rtl"` on `<html>` for Arabic.
- Currently only `en` locale implemented.

---

## 2. Data Model

### Entity Relationship Overview

```
User 1──N Session
User 1──N AuditLog
Inquiry 1──N InquiryNote
Inquiry 1──N StatusEvent
Inquiry 1──N Document
Inquiry N──1 Service (optional)
Inquiry N──1 User (assignee, optional)
Service N──1 Category (implicit via field)
NewsArticle 1──N NewsRevision
Setting (singleton per key)
RoutingRule (standalone)
ConsentRecord (standalone per visitor)
DataSubjectRequest (standalone)
Testimonial (standalone)
```

### Entities

#### User [Q38, Q82, Q86]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED — standard] |
| email | string | unique, required | [Q86] |
| name | string | required | [Q82] |
| role | enum: `admin`, `staff` | required, default `staff` | [Q38, Q39] |
| passwordHash | string | required, never exposed | [Q86] |
| isActive | boolean | default true | [Q82] |
| mfaEnabled | boolean | default false | [Q89] |
| createdAt | datetime | auto | [DERIVED — audit trail] |
| updatedAt | datetime | auto | [DERIVED — audit trail] |
| lastLoginAt | datetime | nullable | [DERIVED — security monitoring] |
| isDemoUser | boolean | default false | [Q82] — labels demo entries |

**Demo storage:** localStorage `hbs_users` array. **Production:** server DB table.

#### Session [Q86, Q50 answer]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED — standard] |
| userId | uuid | FK → User | [Q86] |
| token | string | unique, hashed | [Q86] |
| expiresAt | datetime | required | [Q86] |
| createdAt | datetime | auto | [DERIVED] |
| ipAddress | string | nullable | [DERIVED — security monitoring] |
| userAgent | string | nullable | [DERIVED — security monitoring] |

**Demo storage:** localStorage `hbs_sessions`. **Production:** server DB / auth provider.

#### Inquiry [Q5, Q32, Q33, Q34, Q35]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED — standard] |
| referenceCode | string | unique, indexed | [Q34] |
| branch | enum: `visa`, `jobs` | required | [Q34] |
| serviceId | uuid | FK → Service, nullable | [Q12] |
| status | string | from StatusWorkflow, default `new` | [Q36] |
| priority | enum: `low`, `medium`, `high` | default `medium` | [DERIVED — supports triage from Q35] |
| assigneeId | uuid | FK → User, nullable | [line 311] |
| fullName | string | required | [Q32] |
| email | string | required | [Q32] |
| phone | string | nullable | [Q32] |
| message | text | nullable | [Q32] |
| formData | json | additional step fields | [Q32] |
| firstResponseAt | datetime | nullable | [Q103] |
| createdAt | datetime | auto | [DERIVED] |
| updatedAt | datetime | auto | [DERIVED] |
| isDemo | boolean | default false | [DERIVED — labels demo data] |

**Index:** referenceCode (unique), branch, status, assigneeId, createdAt.

**Reference code generation:**
- Demo: browser-local sequential counter per category prefix. Format **PROVISIONAL** (e.g., `HBS-VIS-0001`) [Q34, Q76 OPEN].
- Production: server-generated unique codes; format TBD.

#### InquiryNote [Q35]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| inquiryId | uuid | FK → Inquiry | [Q35] |
| authorId | uuid | FK → User | [Q35] |
| content | text | required | [Q35] |
| type | enum: `internal`, `status_change`, `communication` | required | [Q104] |
| createdAt | datetime | auto | [DERIVED] |

#### StatusEvent [Q36, Q103]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| inquiryId | uuid | FK → Inquiry | [Q36] |
| fromStatus | string | nullable (null for creation) | [Q36] |
| toStatus | string | required | [Q36] |
| changedById | uuid | FK → User | [DERIVED — audit] |
| changedAt | datetime | auto | [Q103] |

#### Service [Q12, Q21, Q81]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| name | string | required | [Q81] — values `CLIENT INPUT REQUIRED` |
| category | enum: `visa`, `jobs` | required | [Q34] |
| icon | string | required | [Q81] |
| description | text | required | [Q81] |
| featured | boolean | default false | [Q12] |
| order | integer | required | [Q81] |
| published | boolean | default true | [Q81] |
| createdAt | datetime | auto | [DERIVED] |
| updatedAt | datetime | auto | [DERIVED] |

#### NewsArticle [Q77, Q113 second instance]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| title | string | required | [Q77] |
| slug | string | unique | [DERIVED — SEO-friendly URLs] |
| excerpt | text | required | [Q79 answer] |
| body | text | required | [Q77] |
| category | string | nullable | [Q113] |
| imageUrl | string | nullable | [Q79 answer] |
| authorId | uuid | FK → User | [Q113] |
| status | enum: `draft`, `scheduled`, `published`, `unpublished`, `archived` | default `draft` | [Q77, Q113] |
| publishAt | datetime | nullable | [Q113] |
| createdAt | datetime | auto | [DERIVED] |
| updatedAt | datetime | auto | [DERIVED] |

#### NewsRevision [Q113 second instance]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| articleId | uuid | FK → NewsArticle | [Q113] |
| title | string | required | [Q113] |
| body | text | required | [Q113] |
| editedById | uuid | FK → User | [Q113] |
| createdAt | datetime | auto | [Q113] |

#### Testimonial [Q31, Q114]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| clientName | string | required | [Q31] |
| content | text | required | [Q31] |
| order | integer | required | [Q114] |
| published | boolean | default true | [Q114] |
| isDemo | boolean | default false | [Q114] |
| createdAt | datetime | auto | [DERIVED] |

#### Document [Q111, Q112]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| inquiryId | uuid | FK → Inquiry | [Q111] |
| fileName | string | required | [Q111] |
| mimeType | string | required | [Q111] |
| sizeBytes | integer | required | [Q111] |
| storagePath | string | required | [Q111] |
| uploadedById | uuid | FK → User, nullable | [DERIVED] |
| retentionDate | date | nullable | [Q112] |
| createdAt | datetime | auto | [DERIVED] |

**Demo storage:** browser (metadata only; file content as base64 or blob URL). **Production:** private server storage (S3-compatible), malware-scanned [Q111].

#### AuditLog [Q78, Q83 — scope OPEN]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| userId | uuid | FK → User | [DERIVED — who] |
| action | string | required | [Q78] |
| entityType | string | nullable | [DERIVED — what entity] |
| entityId | uuid | nullable | [DERIVED — which record] |
| details | json | nullable | [DERIVED — contextual data, no secrets] |
| ipAddress | string | nullable | [DERIVED — security] |
| isDemo | boolean | default false | [DERIVED — label demo entries] |
| createdAt | datetime | auto | [DERIVED] |

**Scope:** OPEN [Q83]. Events to log TBD; see `security.md` §4.

#### Setting [Q27, Q48, Q85]
| Field | Type | Constraints | Source |
|---|---|---|---|
| key | string | PK | [Q27] |
| value | json | required | [Q27] |
| updatedAt | datetime | auto | [DERIVED] |
| updatedById | uuid | FK → User, nullable | [DERIVED] |

Keys include: `company_name`, `company_phone`, `company_email`, `company_address`, `company_hours`, `whatsapp_number`, `social_links`, `branding`, `notification_rules`, `localization_preferences`, `system_defaults`, `demo_access_settings`.

#### RoutingRule [line 311]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| branch | enum: `visa`, `jobs`, `all` | required | [line 311] |
| serviceCategory | string | nullable | [line 311] |
| assigneeId | uuid | FK → User | [line 311] |
| priority | integer | for rule ordering | [DERIVED — configurable rules] |
| isActive | boolean | default true | [DERIVED] |

#### ConsentRecord [Q90, Q110]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| visitorId | string | anonymous identifier | [Q109] |
| consentType | enum: `essential`, `analytics` | required | [Q110] |
| granted | boolean | required | [Q110] |
| grantedAt | datetime | auto | [Q110] |
| revokedAt | datetime | nullable | [Q110] |

#### DataSubjectRequest [Q90]
| Field | Type | Constraints | Source |
|---|---|---|---|
| id | uuid | PK | [DERIVED] |
| requestType | enum: `access`, `deletion`, `correction`, `portability` | required | [Q90] |
| requesterEmail | string | required | [Q90] |
| status | enum: `received`, `in_progress`, `completed`, `denied` | default `received` | [Q90] |
| notes | text | nullable | [DERIVED] |
| createdAt | datetime | auto | [DERIVED] |
| completedAt | datetime | nullable | [DERIVED] |

### Demo vs Production Data Layer
| Layer | Demo | Production |
|---|---|---|
| Storage | localStorage (per-entity JSON arrays) | Server database (PostgreSQL/MySQL TBD) |
| Key prefix | `hbs_` | N/A (DB tables) |
| Reference codes | Sequential counter, browser-local | Server-generated unique |
| File storage | Base64 in localStorage or blob URLs | Private cloud storage |
| Auth tokens | localStorage (labeled as insecure) | HTTP-only secure cookies / server sessions |
| Backup | JSON download from localStorage | Encrypted server backups |

---

## 3. Route Map

### Public Routes
| Path | Page | Auth | Notes |
|---|---|---|---|
| `/` | Home | None | SSG [Q60] |
| `/about` | About Us | None | SSG |
| `/services/visa` | Documentation & Visa Services | None | SSG [Q64] |
| `/services/jobs` | International Job Services | None | SSG [Q14 answer] |
| `/contact` | Contact Us | None | SSG + form [Q105] |
| `/news` | News & Updates | None | ISR [Q77] |
| `/news/[slug]` | News Article Detail | None | ISR [Q113] |
| `/privacy` | Privacy & Terms | None | SSG [Q15] |

**Locale prefix:** `/{locale}/path` when i18n enabled; default `en` may omit prefix [Q96].

### Admin Routes
| Path | Page/Section | Auth | Role | Notes |
|---|---|---|---|---|
| `/admin/login` | Admin Login | None (pre-auth) | — | [Q86] |
| `/admin` | Dashboard (redirect to overview) | Required | admin, staff | [Q78] |
| `/admin/overview` | Overview | Required | admin, staff | [Q70] |
| `/admin/inquiries` | Inquiries List | Required | admin, staff | [Q35] |
| `/admin/inquiries/[id]` | Inquiry Detail | Required | admin, staff | [Q35, Q104] |
| `/admin/services` | Services Management | Required | admin | [DERIVED — admin-level content mgmt] |
| `/admin/news` | News Management | Required | admin | [Q77] |
| `/admin/news/[id]/edit` | News Editor | Required | admin | [Q113] |
| `/admin/testimonials` | Testimonials Management | Required | admin | [Q114] |
| `/admin/users` | Users Management | Required | admin | [Q39, Q82] |
| `/admin/audit-logs` | Audit Logs | Required | admin | [Q78, Q83 OPEN] |
| `/admin/analytics` | Analytics | Required | admin, staff | [Q40, Q83 answer] |
| `/admin/documents` | Documents | Required | admin, staff | [Q112] |
| `/admin/settings` | Settings | Required | admin | [Q39, Q85] |

### API Routes
| Method | Path | Auth | Role | Purpose | Demo/Real | Source |
|---|---|---|---|---|---|---|
| POST | `/api/auth/login` | None | — | Authenticate user | Real if provider configured; else simulated | [Q86] |
| POST | `/api/auth/logout` | Required | any | End session | Real/simulated | [Q86] |
| GET | `/api/auth/session` | Required | any | Validate session | Real/simulated | [Q86] |
| POST | `/api/auth/reauth` | Required | any | Re-authenticate for sensitive actions | Real/simulated | [Q89] |
| GET | `/api/inquiries` | Required | admin, staff | List/search/filter inquiries | Both | [Q35] |
| GET | `/api/inquiries/[id]` | Required | admin, staff | Get inquiry detail + timeline | Both | [Q35, Q104] |
| PATCH | `/api/inquiries/[id]` | Required | admin, staff | Update status, assignee | Both | [Q35, Q36] |
| POST | `/api/inquiries/[id]/notes` | Required | admin, staff | Add internal note | Both | [Q35] |
| POST | `/api/inquiries/submit` | None (public) | — | Submit visitor inquiry (honeypot, rate-limited) | Both | [Q32, Q33] |
| GET | `/api/inquiries/export` | Required | admin, staff | CSV export | Both | [Q37] |
| GET | `/api/services` | None (public) | — | List published services | Both | [Q12] |
| POST | `/api/services` | Required | admin | Create service | Both | [Q81] |
| PATCH | `/api/services/[id]` | Required | admin | Update service | Both | [Q81] |
| DELETE | `/api/services/[id]` | Required | admin | Delete service | Both | [Q81] |
| PATCH | `/api/services/reorder` | Required | admin | Reorder services | Both | [Q81] |
| GET | `/api/news` | None (public) | — | List published news | Both | [Q77] |
| POST | `/api/news` | Required | admin | Create article | Both | [Q77, Q113] |
| PATCH | `/api/news/[id]` | Required | admin | Update article | Both | [Q113] |
| DELETE | `/api/news/[id]` | Required | admin | Delete article | Both | [Q113] |
| GET | `/api/testimonials` | None (public) | — | List published testimonials | Both | [Q31] |
| POST | `/api/testimonials` | Required | admin | Create testimonial | Both | [Q114] |
| PATCH | `/api/testimonials/[id]` | Required | admin | Update testimonial | Both | [Q114] |
| DELETE | `/api/testimonials/[id]` | Required | admin | Delete testimonial | Both | [Q114] |
| PATCH | `/api/testimonials/reorder` | Required | admin | Reorder testimonials | Both | [Q114] |
| GET | `/api/users` | Required | admin | List users | Both | [Q82] |
| POST | `/api/users` | Required | admin | Create user | Both | [Q82] |
| PATCH | `/api/users/[id]` | Required | admin | Update user (re-auth for role/deactivation) | Both | [Q82, Q89] |
| GET | `/api/audit-logs` | Required | admin | List audit logs | Both | [Q78] |
| GET | `/api/analytics` | Required | admin, staff | Get analytics data | Both | [Q40] |
| GET | `/api/analytics/export` | Required | admin, staff | CSV analytics export | Both | [Q83 answer] |
| GET | `/api/documents/[id]` | Required | admin, staff | Download/preview document | Both | [Q112] |
| DELETE | `/api/documents/[id]` | Required | admin | Delete document | Both | [Q112] |
| POST | `/api/documents/upload` | None (public, with inquiry) | — | Upload file with inquiry | Both | [Q111] |
| GET | `/api/settings` | Required | admin | Get all settings | Both | [Q85] |
| PATCH | `/api/settings` | Required | admin | Update settings | Both | [Q85] |
| POST | `/api/backup/export` | Required | admin | Download full backup | Both | [Q47] |
| POST | `/api/backup/restore` | Required | admin | Restore from backup | Both | [Q47] |
| POST | `/api/backup/reset` | Required | admin | Reset to sample data | Both | [Q71 answer] |
| GET | `/api/routing-rules` | Required | admin | List routing rules | Both | [line 311] |
| POST | `/api/routing-rules` | Required | admin | Create routing rule | Both | [line 311] |
| PATCH | `/api/routing-rules/[id]` | Required | admin | Update routing rule | Both | [line 311] |
| DELETE | `/api/routing-rules/[id]` | Required | admin | Delete routing rule | Both | [line 311] |
| POST | `/api/consent` | None (public) | — | Record consent preference | Both | [Q110] |
| POST | `/api/dsr` | None (public) | — | Submit data subject request | Both | [Q90] |
| GET | `/api/dsr` | Required | admin | List DSR requests | Both | [Q90] |
| PATCH | `/api/dsr/[id]` | Required | admin | Update DSR status | Both | [Q90] |

### Validation & Error Format
All API endpoints return standard error format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [{ "field": "email", "message": "Required" }]
  }
}
```
Error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `RATE_LIMITED`, `INTERNAL_ERROR` [Q43]. See `engineering.md` §2.

### Rate Limiting
| Endpoint Category | Limit | Source |
|---|---|---|
| Public inquiry submission | `CLIENT INPUT REQUIRED` (e.g., 5/min per IP) | [DERIVED — anti-spam] |
| Public file upload | `CLIENT INPUT REQUIRED` (e.g., 3/min per IP) | [DERIVED — anti-abuse] |
| Auth login | `CLIENT INPUT REQUIRED` (e.g., 5 attempts / 15 min) | [DERIVED — brute-force prevention] |
| Admin API (authenticated) | `CLIENT INPUT REQUIRED` | [DERIVED — optional] |

---

## 4. Permissions Matrix

### Role Permissions [Q39, Q82]
| Action | Staff | Admin | Re-Auth Required | Source |
|---|---|---|---|---|
| View dashboard overview | ✅ | ✅ | No | [Q70] |
| View/search inquiries | ✅ | ✅ | No | [Q35] |
| Update inquiry status | ✅ | ✅ | No | [Q36] |
| Add inquiry notes | ✅ | ✅ | No | [Q35] |
| Reassign inquiries | ✅ | ✅ | No | [line 311] |
| Export inquiry CSV | ✅ | ✅ | No | [Q37] |
| View documents | ✅ | ✅ | No | [Q112] |
| View analytics | ✅ | ✅ | No | [Q40] |
| Export analytics CSV | ✅ | ✅ | No | [Q83 answer] |
| Manage services | ❌ | ✅ | No | [DERIVED — admin content mgmt, Q39] |
| Manage news | ❌ | ✅ | No | [DERIVED — admin content mgmt] |
| Manage testimonials | ❌ | ✅ | No | [DERIVED — admin content mgmt] |
| Manage users | ❌ | ✅ | No | [Q39] |
| Change user role | ❌ | ✅ | **Yes** | [Q89] |
| Deactivate user | ❌ | ✅ | **Yes** | [Q89] |
| Change security settings | ❌ | ✅ | **Yes** | [Q89] |
| Manage company settings | ❌ | ✅ | No | [Q39] |
| Backup/restore/reset | ❌ | ✅ | No | [Q47] |
| View audit logs | ❌ | ✅ | No | [Q78] |
| Manage routing rules | ❌ | ✅ | No | [DERIVED — admin-level config] |
| Manage DSR requests | ❌ | ✅ | No | [Q90] |
| Delete documents | ❌ | ✅ | No | [Q112] |

### Server-Side Enforcement Points [Q86, Q50 answer]
- Every API route validates session token before processing.
- Role checked via middleware; insufficient role returns `403 FORBIDDEN`.
- Re-auth endpoints verify recent authentication timestamp for sensitive actions [Q89].
- In demo mode: enforcement is simulated in browser; labeled as non-production.
- In production: all enforcement is server-side; client-side checks are UX-only.
