# Security: Horizon Business Services

---

## 1. Objectives, Threat Boundaries, Residual Risks

### 1.1 Security Objectives
- Protect admin accounts from unauthorized access [Q86].
- Prevent abuse of public-facing forms (spam, injection, file-based attacks) [Q111].
- Separate demo data from production data [Q92].
- Never misrepresent demo security features as production-grade [line 170].
- Prepare privacy infrastructure for UAE data-protection requirements (without claiming compliance) [Q90].

### 1.2 Threat Boundaries
| Boundary | In Scope | Out of Scope |
|---|---|---|
| Admin authentication | Login, session, role enforcement | Social engineering, physical access |
| Public forms | Input validation, rate limiting, CAPTCHA, honeypot | DDoS mitigation (Vercel/CDN layer) |
| File uploads | Type/size validation, server-side checks, malware scan (production) | Zero-day exploit detection |
| Data storage (demo) | Browser localStorage isolation | Browser extension attacks, XSS in other origins |
| Data storage (production) | Encrypted database, backup/restore | Physical server compromise |
| Notification delivery | — | OPEN [Q55, Q91] |

### 1.3 Residual Risks

| Risk | Severity | Mitigation | Status |
|---|---|---|---|
| Browser localStorage is not secure storage | High | Label demo data as non-production; never store real credentials in browser; display warnings [Q82] | **WARNING** — inherent to demo architecture |
| Auth provider unconfigured | Critical | Document as **BLOCKER**; demo login is a labeled simulation only [Q86] | **BLOCKER** |
| Database unconfigured | Critical | Document as **BLOCKER**; demo uses browser storage only [Q92] | **BLOCKER** |
| Demo role UI creates false sense of security | Medium | Prominent non-production warnings on Users section; no real access control without server auth [Q82] | **WARNING** |
| CAPTCHA provider unconfigured | Medium | Honeypot field as interim; real CAPTCHA required for production | `CLIENT INPUT REQUIRED` |
| No email/notification delivery | Medium | All notifications are OPEN [Q55, Q91]; simulated events labeled | OPEN |
| File upload without malware scanning (demo) | Medium | Type/size restrictions only in demo; production requires server-side malware scan [Q111] | Demo limitation |

---

## 2. Authentication & Sessions

### 2.1 Server-Validated Login [Q86]
- **Requirement:** Real server-side authentication with database and secure session handling [Q86].
- **Provider:** `CLIENT INPUT REQUIRED` — **BLOCKER**. Until configured, admin login is a labeled simulation.
- Password requirements: minimum 12 characters, complexity rules enforced server-side [DERIVED — security baseline].
- Passwords stored as bcrypt/argon2 hash; never stored or logged in plaintext [Q86].

### 2.2 Session Lifecycle [Q86, Q50 answer]
| Event | Behavior | Source |
|---|---|---|
| Login success | Server creates session, returns HTTP-only secure cookie (production) or localStorage token (demo, labeled insecure) | [Q86] |
| Session validation | Every authenticated request validates session server-side | [Q86] |
| Session expiry | Configurable TTL; default 24h [DERIVED — reasonable default] | [Q50 answer] |
| Idle timeout | Configurable; default 30min [DERIVED] | [Q50 answer] |
| Logout | Session invalidated server-side; cookie/token cleared | [Q86] |
| Password change | All other sessions for that user invalidated | [DERIVED — security best practice] |

### 2.3 Account Recovery [Q50 answer]
- Password reset flow via email — requires email provider (`CLIENT INPUT REQUIRED`).
- Reset tokens: single-use, time-limited (15 min) [DERIVED].
- Rate-limited: max 3 reset requests per hour per email [DERIVED].

### 2.4 MFA / Re-Authentication [Q89]
- **Re-auth required for:** role changes, account deactivation, security-setting changes [Q89].
- **MFA:** Supported (TOTP recommended); provider `CLIENT INPUT REQUIRED` [Q50 answer].
- Re-auth window: 5 minutes from last authentication [DERIVED].
- In demo mode: re-auth UI is shown but labeled as simulated.

### 2.5 User Deactivation [Q82]
- Deactivated users cannot log in.
- Existing sessions for deactivated users are immediately invalidated [DERIVED].
- Deactivation requires re-auth [Q89].
- Deactivation is reversible (reactivation by admin).

### 2.6 Security Settings (Admin) [Q85, Q89]
- Configurable: session TTL, idle timeout, password requirements, MFA enforcement.
- Changes to security settings require re-auth [Q89].
- All changes logged in audit trail.

### 2.7 Rate Limiting (Auth) [DERIVED]
| Action | Limit | Lockout |
|---|---|---|
| Login attempts | 5 per 15 minutes per IP | 15-minute lockout, then exponential backoff |
| Password reset | 3 per hour per email | Silently ignore excess (no error leak) |
| Re-auth attempts | 3 per 5 minutes | Forced logout |

### 2.8 Session Invalidation Triggers
- Explicit logout [Q86].
- Password change [DERIVED].
- User deactivation [Q82].
- Role change [DERIVED — re-auth already required by Q89].
- Security setting change affecting sessions [Q85].
- Admin force-logout of specific user [DERIVED — admin tool].

> **⚠️ SECURITY WARNING (Conflict C3):** Demo mode stores session tokens in localStorage, which is accessible to any JavaScript running on the page. This is a labeled simulation only. Production **must** use HTTP-only secure cookies with server-side session validation. See `context.md` §5.1 Conflict C3.

---

## 3. Data Protection & Uploads

### 3.1 Input Validation [Q43, Q111]
| Layer | Validation | Source |
|---|---|---|
| Client-side | Inline field validation (UX only, not security) | [Q32, Q43] |
| Server-side | Zod schema validation on all API inputs | [DERIVED — defense in depth] |
| Sanitization | HTML entity encoding on all user-provided text output | [DERIVED] |
| SQL injection | Parameterized queries (when database configured) | [DERIVED] |

### 3.2 Form Anti-Spam [DERIVED]
| Measure | Status | Source |
|---|---|---|
| Honeypot field | Implemented (demo + production) | [DERIVED — baseline anti-spam] |
| Rate limiting | Per IP on submission endpoints | [DERIVED] |
| CAPTCHA | `CLIENT INPUT REQUIRED` (provider undecided) | [DERIVED — recommended] |
| Input length limits | Max length per field enforced server-side | [DERIVED] |

### 3.3 File Upload Security [Q111, Q112]
| Control | Demo | Production | Source |
|---|---|---|---|
| Allowed file types | Whitelist: PDF, JPG, PNG, DOCX | Same | [Q111] |
| Max file size | `CLIENT INPUT REQUIRED` (e.g., 10MB) | Same | [Q111] |
| File type validation | Extension + MIME type check | Extension + MIME + magic bytes | [Q111] |
| Storage | Browser (base64/blob) | Private server storage, not publicly accessible | [Q111] |
| Access control | Role-based in UI | Server-enforced, signed URLs for download | [Q112] |
| Retention | Manual deletion | Configurable retention dates + auto-cleanup | [Q112] |
| Malware scanning | ❌ Not implemented | Required (ClamAV or cloud scanning service) | [Q111] |
| Filename sanitization | Strip path separators, special chars | Same | [DERIVED] |

### 3.4 Data Retention & Deletion [Q112, Q90]
- Documents have configurable retention dates [Q112].
- Expired documents flagged for admin review/deletion [Q112].
- Production: automated deletion after retention period [DERIVED].
- Inquiry data retention: configurable per `context.md` §2 (privacy preparation) [Q90].

---

## 4. Audit Logs

### 4.1 Scope — OPEN [Q83]
Audit log scope was not answered in the transcript (Q83 answer was about analytics). The following is a **PROVISIONAL** baseline:

**Recommended events to log** [DERIVED]:
| Category | Events |
|---|---|
| Authentication | Login success, login failure, logout, password change, MFA enable/disable |
| User management | User create, edit, role change, activate, deactivate |
| Inquiry management | Status change, note added, assignment change, export |
| Content management | Service/news/testimonial create, edit, publish, unpublish, delete |
| Settings | Any setting change |
| Data operations | Backup export, restore, sample reset |
| Security | Re-auth triggered, session invalidated, rate limit hit |

### 4.2 Logging Rules
- **Never log:** passwords, session tokens, file contents, full PII (log user ID only) [DERIVED — security].
- Each entry: timestamp, user ID, action, entity type, entity ID, IP address, change summary.
- Demo entries: `isDemo: true` flag [DERIVED].
- Audit logs are append-only; no edit or delete by any role [DERIVED].
- Retention: configurable; default 90 days [DERIVED]; production retention `CLIENT INPUT REQUIRED`.

---

## 5. Privacy (UAE Preparation)

> **⚠️ LEGAL DISCLAIMER:** This section documents privacy infrastructure preparation only. It does **not** constitute legal advice and does **not** claim compliance with any specific UAE privacy regulation (including but not limited to the UAE Federal Data Protection Law, DIFC Data Protection Law, or ADGM Data Protection Regulations). All privacy notices, consent texts, retention schedules, and data-handling procedures must be reviewed and approved by a qualified legal professional before production use.

### 5.1 Data Minimization [Q109, Q90]
- Collect only data necessary for stated purposes.
- Inquiry forms: only fields required for service delivery.
- Analytics: privacy-conscious, no personally identifiable tracking [Q109].
- Exported backups / CSV: minimize PII columns where possible.

### 5.2 Privacy Notices [Q90]
- Privacy & Terms page accessible from footer [Q15].
- Content: `CLIENT INPUT REQUIRED` — must be drafted/reviewed by legal counsel.
- Cover: data collected, purposes, retention, third parties, rights, contact info.

### 5.3 Cookie Consent [Q110]
| Category | Cookies/Storage | Default | User Control |
|---|---|---|---|
| Essential | Session, theme preference, consent state | Always on | Cannot be disabled |
| Analytics | Analytics provider cookies/IDs | Off until consented | Accept / Reject / Change later |

- Banner appears on first visit [Q110].
- Granular preferences: separate essential/analytics [Q110].
- Accept all / Reject all / Manage preferences options [Q110].
- Consent changeable from footer link or settings [Q110].
- No analytics scripts load until consent granted [DERIVED].

### 5.4 Consent Records [Q90]
- Every consent grant/revocation stored in ConsentRecord entity (see `architecture.md` §2).
- Records: visitor identifier, consent type, timestamp, granted/revoked.
- Retained for audit purposes; retention period `CLIENT INPUT REQUIRED`.

### 5.5 Retention Schedules [Q90]
| Data Type | Demo | Production | Source |
|---|---|---|---|
| Inquiry data | Until manual delete or reset | Configurable; `CLIENT INPUT REQUIRED` | [Q90] |
| Uploaded documents | Until manual delete | Configurable retention dates [Q112] | [Q112, Q90] |
| Audit logs | Until manual delete or reset | Configurable; `CLIENT INPUT REQUIRED` | [Q90] |
| Consent records | Until reset | Per legal requirement; `CLIENT INPUT REQUIRED` | [Q90] |
| Analytics data | Session | Per provider; `CLIENT INPUT REQUIRED` | [Q109] |
| Account data | Until manual delete | Per legal requirement; `CLIENT INPUT REQUIRED` | [Q90] |

### 5.6 Data Subject Requests [Q90]
- DSR tracking entity in data model (see `architecture.md` §2).
- Request types: access, deletion, correction, portability [Q90].
- Admin UI: list, review, process, complete DSR requests [Q90].
- Response timeline: `CLIENT INPUT REQUIRED` (per applicable regulation).
- In demo: DSR workflow is functional but uses demo data; labeled as non-production.

### 5.7 Incident Response [Q90]
- Incident response procedures: `CLIENT INPUT REQUIRED`.
- Documented process for: detection, containment, notification, remediation, post-mortem.
- Notification obligations: per applicable regulation; `CLIENT INPUT REQUIRED`.
- Contact information for privacy inquiries: `CLIENT INPUT REQUIRED`.

### 5.8 Privacy Audit Reports [Q90]
- Infrastructure supports generating privacy audit reports.
- Report contents: data inventory, processing activities, consent rates, DSR response times, incident history.
- Audit schedule: `CLIENT INPUT REQUIRED`.
- Reports for internal review and regulatory preparation only.

---

## 6. Backup & Restore

### 6.1 Demo (Browser Persistence) [Q37, Q47, Q71 answer]

| Feature | Implementation | Source |
|---|---|---|
| Auto-save | All data written to localStorage on change | [Q47] |
| LocalStorage key prefix | `hbs_` per entity | [DERIVED] |
| Backup download | JSON file containing all localStorage data | [Q47] |
| Restore | Upload JSON backup; confirmation dialog before overwrite | [Q47] |
| Sample-data reset | One-click reset to original demo state; confirmation dialog | [Q71 answer] |
| CSV export (inquiries) | Downloadable CSV of inquiry data | [Q37] |
| CSV export (analytics) | Downloadable CSV of analytics summaries | [Q83 answer] |

**Safe handling of exported files:**
- Exported files may contain demo PII (fictional names, emails). Label files with "DEMO DATA" in filename [DERIVED].
- Advise users not to share backup files containing inquiry data without review [DERIVED].
- CSV exports minimize columns: exclude internal IDs, passwords, session data [DERIVED].

### 6.2 Production (Server) [Q92]

| Feature | Requirement | Status | Source |
|---|---|---|---|
| Encrypted backups | At-rest encryption for all backup files | `CLIENT INPUT REQUIRED` | [Q92] |
| Backup schedule | Automated daily backups minimum | `CLIENT INPUT REQUIRED` | [DERIVED] |
| Retention | Configurable; minimum 30 days recommended | `CLIENT INPUT REQUIRED` | [DERIVED] |
| Restore testing | Monthly restore verification | `CLIENT INPUT REQUIRED` | [DERIVED] |
| RPO (Recovery Point Objective) | `CLIENT INPUT REQUIRED` | `CLIENT INPUT REQUIRED` | [DERIVED — depends on business needs] |
| RTO (Recovery Time Objective) | `CLIENT INPUT REQUIRED` | `CLIENT INPUT REQUIRED` | [DERIVED — depends on business needs] |
| Off-site backup | Recommended for disaster recovery | `CLIENT INPUT REQUIRED` | [DERIVED] |
| Backup access | Admin-only, logged in audit trail | `CLIENT INPUT REQUIRED` | [DERIVED] |

---

## 7. Notifications — OPEN

> **Status:** Unanswered in transcript [Q55, Q91]. No notification delivery system is specified or implemented.

### 7.1 Current State
- No email, SMS, or push notification delivery is implemented.
- No notification provider is configured.
- Dashboard UI may show placeholder notification indicators [Q85 — notification rules in settings].

### 7.2 Simulated Events (Demo Only)
- In-app toast notifications for admin actions (status change, new inquiry) are UI-only simulations.
- These are labeled as simulated; no external delivery occurs.
- **No claims are made about message delivery to any external system.**

### 7.3 Production Requirements (When Decided)
- Email provider: `CLIENT INPUT REQUIRED`.
- WhatsApp Business API: `CLIENT INPUT REQUIRED` (current implementation uses deep links only, not API).
- SMS provider: `CLIENT INPUT REQUIRED`.
- Push notification service: `CLIENT INPUT REQUIRED`.
- Notification templates and triggers: `CLIENT INPUT REQUIRED`.
- Delivery confirmation/retry logic: `CLIENT INPUT REQUIRED`.

---

## 8. Pre-Real-Data Checklist

Before any real customer data enters the system, the following must be completed:

| # | Item | Status | Dependency |
|---|---|---|---|
| 1 | Auth provider configured and tested | ❌ | `CLIENT INPUT REQUIRED` — **BLOCKER** |
| 2 | Server database provisioned and migrated | ❌ | `CLIENT INPUT REQUIRED` — **BLOCKER** |
| 3 | HTTP-only secure cookies replace localStorage tokens | ❌ | Auth provider |
| 4 | All API routes enforce server-side auth | ❌ | Auth provider + DB |
| 5 | File uploads use private server storage | ❌ | Storage provider `CLIENT INPUT REQUIRED` |
| 6 | Malware scanning enabled for uploads | ❌ | Scanner `CLIENT INPUT REQUIRED` |
| 7 | CAPTCHA enabled on public forms | ❌ | CAPTCHA provider `CLIENT INPUT REQUIRED` |
| 8 | Email provider configured for notifications/recovery | ❌ | Email provider `CLIENT INPUT REQUIRED` |
| 9 | Privacy notice reviewed by legal counsel | ❌ | Legal review `CLIENT INPUT REQUIRED` |
| 10 | Cookie consent text reviewed by legal counsel | ❌ | Legal review `CLIENT INPUT REQUIRED` |
| 11 | Retention schedules defined and implemented | ❌ | Legal review `CLIENT INPUT REQUIRED` |
| 12 | Incident response procedures documented | ❌ | `CLIENT INPUT REQUIRED` |
| 13 | Audit log scope finalized and implemented | ❌ | OPEN [Q83] |
| 14 | Notification system implemented | ❌ | OPEN [Q55, Q91] |
| 15 | MFA provider configured | ❌ | `CLIENT INPUT REQUIRED` |
| 16 | SSL/TLS verified on custom domain | ❌ | Vercel handles for `*.vercel.app`; custom domain TBD |
| 17 | Rate limiting configured for production load | ❌ | Load expectations `CLIENT INPUT REQUIRED` |
| 18 | Backup/restore tested with production-like data | ❌ | DB + storage provider |
| 19 | Security scanning (SAST/DAST) completed | ❌ | [Q94] |
| 20 | Penetration test (recommended) | ❌ | `CLIENT INPUT REQUIRED` |
| 21 | Demo data fully purged from production environment | ❌ | [Q92] |
| 22 | Non-production warnings removed from production build | ❌ | Environment variable switch |
| 23 | Analytics provider configured with consent integration | ❌ | Analytics provider `CLIENT INPUT REQUIRED` |
| 24 | Map provider API key scoped to production domain | ❌ | Map provider `CLIENT INPUT REQUIRED` |
