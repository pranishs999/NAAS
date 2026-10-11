/**
 * Browser-Persistent Demo Store for Horizon Business Services
 * All demo records are stored in browser localStorage and explicitly labeled.
 * Source: architecture.md §2, context.md §2.4, security.md §6
 */

import {
  Inquiry,
  InquiryNote,
  StatusEvent,
  Service,
  NewsArticle,
  Testimonial,
  User,
  AuditLog,
  AttachedDocumentMetadata,
  ConsentRecord,
  DataSubjectRequest,
  RoutingRule,
} from "@/types";

import {
  initialServices,
  initialVacancies,
  initialTestimonials,
  initialNewsArticles,
  initialUsers,
  VacancySeed,
} from "@/config/contentConfig";

import { siteConfig } from "@/config/siteConfig";

// Storage Keys
const KEYS = {
  INQUIRIES: "hbs_inquiries",
  NOTES: "hbs_inquiry_notes",
  STATUS_EVENTS: "hbs_status_events",
  SERVICES: "hbs_services",
  VACANCIES: "hbs_vacancies",
  NEWS: "hbs_news",
  TESTIMONIALS: "hbs_testimonials",
  USERS: "hbs_users",
  AUDIT_LOGS: "hbs_audit_logs",
  DOCUMENTS: "hbs_documents",
  SETTINGS: "hbs_settings",
  ROUTING_RULES: "hbs_routing_rules",
  DSR: "hbs_dsr",
  CONSENT: "hbs_consent",
};

// Initial Seed Inquiries for Demonstration
const initialInquiriesSeed: Inquiry[] = [
  {
    id: "inq-001",
    referenceCode: "HBS-VIS-0001",
    branch: "visa",
    serviceId: "srv-001",
    status: "new",
    priority: "high",
    fullName: "Ahmed Al-Maktoum (Demo)",
    email: "ahmed.demo@example.com",
    phone: "+971501234567",
    message: "Requesting Golden Visa documentation checklist and family eligibility guidance.",
    formData: {
      passportNumber: "A12345678",
      nationality: "United Arab Emirates",
      currentLocation: "Dubai",
      urgency: "Immediate",
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isDemo: true,
  },
  {
    id: "inq-002",
    referenceCode: "HBS-JOB-0001",
    branch: "jobs",
    status: "in_review",
    priority: "medium",
    assigneeId: "usr-staff-01",
    assigneeName: "Operations Staff (Demo)",
    fullName: "Sarah Jenkins (Demo)",
    email: "sarah.j.demo@example.com",
    phone: "+447700900077",
    message: "Applying for hospitality candidate review and document attestation for UAE employment.",
    formData: {
      qualification: "Bachelor of Hospitality Management",
      experienceYears: "5",
      preferredRole: "Hospitality Manager",
    },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    isDemo: true,
  },
];

// Helper to get or initialize localStorage item
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Guarantee Initialization of Demo Store
export function initDemoStore(): void {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(KEYS.SERVICES)) {
    setItem(KEYS.SERVICES, initialServices);
  }
  if (!localStorage.getItem(KEYS.VACANCIES)) {
    setItem(KEYS.VACANCIES, initialVacancies);
  }
  if (!localStorage.getItem(KEYS.TESTIMONIALS)) {
    setItem(KEYS.TESTIMONIALS, initialTestimonials);
  }
  if (!localStorage.getItem(KEYS.NEWS)) {
    setItem(KEYS.NEWS, initialNewsArticles);
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    setItem(KEYS.USERS, initialUsers);
  }
  if (!localStorage.getItem(KEYS.INQUIRIES)) {
    setItem(KEYS.INQUIRIES, initialInquiriesSeed);
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    setItem(KEYS.SETTINGS, siteConfig);
  }
  if (!localStorage.getItem(KEYS.ROUTING_RULES)) {
    setItem<RoutingRule[]>(KEYS.ROUTING_RULES, [
      {
        id: "rr-01",
        branch: "visa",
        assigneeId: "usr-admin-01",
        assigneeName: "System Admin (Demo)",
        priority: 1,
        isActive: true,
      },
      {
        id: "rr-02",
        branch: "jobs",
        assigneeId: "usr-staff-01",
        assigneeName: "Operations Staff (Demo)",
        priority: 2,
        isActive: true,
      },
    ]);
  }
}

// Initialize on module load in client
if (typeof window !== "undefined") {
  initDemoStore();
}

// INQUIRIES STORE API
export function getInquiries(): Inquiry[] {
  return getItem<Inquiry[]>(KEYS.INQUIRIES, initialInquiriesSeed);
}

export function getInquiryById(id: string): Inquiry | undefined {
  const inquiries = getInquiries();
  return inquiries.find((i) => i.id === id || i.referenceCode === id);
}

export function createInquiry(inquiry: Omit<Inquiry, "id" | "createdAt" | "updatedAt" | "status" | "priority" | "isDemo">): Inquiry {
  const inquiries = getInquiries();
  const newInquiry: Inquiry = {
    ...inquiry,
    id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: "new",
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true,
  };
  inquiries.unshift(newInquiry);
  setItem(KEYS.INQUIRIES, inquiries);

  // Add audit log entry
  addAuditLog({
    userId: "visitor",
    userName: "Public Visitor",
    action: "INQUIRY_SUBMITTED",
    entityType: "Inquiry",
    entityId: newInquiry.id,
    details: { referenceCode: newInquiry.referenceCode, branch: newInquiry.branch },
  });

  return newInquiry;
}

export function updateInquiryStatus(inquiryId: string, status: Inquiry["status"], user: { id: string; name: string }): Inquiry | undefined {
  const inquiries = getInquiries();
  const index = inquiries.findIndex((i) => i.id === inquiryId);
  if (index === -1) return undefined;

  const oldStatus = inquiries[index]!.status;
  inquiries[index]!.status = status;
  inquiries[index]!.updatedAt = new Date().toISOString();

  if (status !== "new" && !inquiries[index]!.firstResponseAt) {
    inquiries[index]!.firstResponseAt = new Date().toISOString();
  }

  setItem(KEYS.INQUIRIES, inquiries);

  // Record status event timeline
  const statusEvents = getItem<StatusEvent[]>(KEYS.STATUS_EVENTS, []);
  statusEvents.push({
    id: `se-${Date.now()}`,
    inquiryId,
    fromStatus: oldStatus,
    toStatus: status,
    changedById: user.id,
    changedByName: user.name,
    changedAt: new Date().toISOString(),
  });
  setItem(KEYS.STATUS_EVENTS, statusEvents);

  // Add note entry for status change
  addInquiryNote(inquiryId, `Status updated from '${oldStatus}' to '${status}' by ${user.name}.`, user, "status_change");

  // Add audit log
  addAuditLog({
    userId: user.id,
    userName: user.name,
    action: "INQUIRY_STATUS_UPDATED",
    entityType: "Inquiry",
    entityId: inquiryId,
    details: { fromStatus: oldStatus, toStatus: status },
  });

  return inquiries[index];
}

export function reassignInquiry(inquiryId: string, assignee: { id: string; name: string }, user: { id: string; name: string }): Inquiry | undefined {
  const inquiries = getInquiries();
  const index = inquiries.findIndex((i) => i.id === inquiryId);
  if (index === -1) return undefined;

  inquiries[index]!.assigneeId = assignee.id;
  inquiries[index]!.assigneeName = assignee.name;
  inquiries[index]!.updatedAt = new Date().toISOString();
  setItem(KEYS.INQUIRIES, inquiries);

  addInquiryNote(inquiryId, `Inquiry reassigned to ${assignee.name} by ${user.name}.`, user, "internal");

  addAuditLog({
    userId: user.id,
    userName: user.name,
    action: "INQUIRY_REASSIGNED",
    entityType: "Inquiry",
    entityId: inquiryId,
    details: { assigneeId: assignee.id, assigneeName: assignee.name },
  });

  return inquiries[index];
}

// INQUIRY NOTES STORE
export function getInquiryNotes(inquiryId: string): InquiryNote[] {
  const notes = getItem<InquiryNote[]>(KEYS.NOTES, []);
  return notes.filter((n) => n.inquiryId === inquiryId);
}

export function addInquiryNote(
  inquiryId: string,
  content: string,
  author: { id: string; name: string },
  type: InquiryNote["type"] = "internal"
): InquiryNote {
  const notes = getItem<InquiryNote[]>(KEYS.NOTES, []);
  const newNote: InquiryNote = {
    id: `note-${Date.now()}-${Math.floor(Math.random() * 100)}`,
    inquiryId,
    authorId: author.id,
    authorName: author.name,
    content,
    type,
    createdAt: new Date().toISOString(),
  };
  notes.push(newNote);
  setItem(KEYS.NOTES, notes);
  return newNote;
}

// STATUS EVENTS STORE
export function getStatusEvents(inquiryId: string): StatusEvent[] {
  const events = getItem<StatusEvent[]>(KEYS.STATUS_EVENTS, []);
  return events.filter((e) => e.inquiryId === inquiryId);
}

// SERVICES STORE API
export function getServices(): Service[] {
  return getItem<Service[]>(KEYS.SERVICES, initialServices as Service[]);
}

export function saveServices(services: Service[]): void {
  setItem(KEYS.SERVICES, services);
}

export function createService(service: Omit<Service, "id" | "createdAt" | "updatedAt">): Service {
  const services = getServices();
  const newService: Service = {
    ...service,
    id: `srv-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  services.push(newService);
  saveServices(services);
  return newService;
}

export function updateService(id: string, updates: Partial<Service>): Service | undefined {
  const services = getServices();
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return undefined;
  services[index] = { ...services[index]!, ...updates, updatedAt: new Date().toISOString() };
  saveServices(services);
  return services[index];
}

export function deleteService(id: string): boolean {
  const services = getServices();
  const filtered = services.filter((s) => s.id !== id);
  if (filtered.length === services.length) return false;
  saveServices(filtered);
  return true;
}

// VACANCIES STORE API
export function getVacancies(): VacancySeed[] {
  return getItem<VacancySeed[]>(KEYS.VACANCIES, initialVacancies);
}

// NEWS STORE API
export function getNewsArticles(): NewsArticle[] {
  return getItem<NewsArticle[]>(KEYS.NEWS, initialNewsArticles as NewsArticle[]);
}

export function createNewsArticle(article: Omit<NewsArticle, "id" | "createdAt" | "updatedAt" | "isDemo">): NewsArticle {
  const articles = getNewsArticles();
  const newArticle: NewsArticle = {
    ...article,
    id: `news-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true,
  };
  articles.unshift(newArticle);
  setItem(KEYS.NEWS, articles);
  return newArticle;
}

export function updateNewsArticle(id: string, updates: Partial<NewsArticle>): NewsArticle | undefined {
  const articles = getNewsArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return undefined;
  articles[index] = { ...articles[index]!, ...updates, updatedAt: new Date().toISOString() };
  setItem(KEYS.NEWS, articles);
  return articles[index];
}

export function deleteNewsArticle(id: string): boolean {
  const articles = getNewsArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  setItem(KEYS.NEWS, filtered);
  return true;
}

// TESTIMONIALS STORE API
export function getTestimonials(): Testimonial[] {
  return getItem<Testimonial[]>(KEYS.TESTIMONIALS, initialTestimonials as Testimonial[]);
}

export function createTestimonial(t: Omit<Testimonial, "id" | "createdAt" | "isDemo">): Testimonial {
  const items = getTestimonials();
  const newItem: Testimonial = {
    ...t,
    id: `tst-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isDemo: true,
  };
  items.push(newItem);
  setItem(KEYS.TESTIMONIALS, items);
  return newItem;
}

export function updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | undefined {
  const items = getTestimonials();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return undefined;
  items[index] = { ...items[index]!, ...updates };
  setItem(KEYS.TESTIMONIALS, items);
  return items[index];
}

export function deleteTestimonial(id: string): boolean {
  const items = getTestimonials();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  setItem(KEYS.TESTIMONIALS, filtered);
  return true;
}

// USERS STORE API
export function getUsers(): User[] {
  return getItem<User[]>(KEYS.USERS, initialUsers as User[]);
}

export function createUser(u: Omit<User, "id" | "createdAt" | "updatedAt" | "isDemoUser" | "mfaEnabled">): User {
  const users = getUsers();
  const newUser: User = {
    ...u,
    id: `usr-${Date.now()}`,
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemoUser: true,
  };
  users.push(newUser);
  setItem(KEYS.USERS, users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  users[index] = { ...users[index]!, ...updates, updatedAt: new Date().toISOString() };
  setItem(KEYS.USERS, users);
  return users[index];
}

// AUDIT LOGS STORE API
export function getAuditLogs(): AuditLog[] {
  return getItem<AuditLog[]>(KEYS.AUDIT_LOGS, []);
}

export function addAuditLog(log: Omit<AuditLog, "id" | "createdAt" | "isDemo">): AuditLog {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    ...log,
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    isDemo: true,
  };
  logs.unshift(newLog);
  setItem(KEYS.AUDIT_LOGS, logs);
  return newLog;
}

// ROUTING RULES STORE API
export function getRoutingRules(): RoutingRule[] {
  return getItem<RoutingRule[]>(KEYS.ROUTING_RULES, []);
}

export function createRoutingRule(rule: Omit<RoutingRule, "id">): RoutingRule {
  const rules = getRoutingRules();
  const newRule: RoutingRule = { ...rule, id: `rr-${Date.now()}` };
  rules.push(newRule);
  setItem(KEYS.ROUTING_RULES, rules);
  return newRule;
}

export function deleteRoutingRule(id: string): boolean {
  const rules = getRoutingRules();
  const filtered = rules.filter((r) => r.id !== id);
  if (filtered.length === rules.length) return false;
  setItem(KEYS.ROUTING_RULES, filtered);
  return true;
}

// DSR STORE API
export function getDsrRequests(): DataSubjectRequest[] {
  return getItem<DataSubjectRequest[]>(KEYS.DSR, []);
}

export function createDsrRequest(req: Omit<DataSubjectRequest, "id" | "status" | "createdAt">): DataSubjectRequest {
  const requests = getDsrRequests();
  const newReq: DataSubjectRequest = {
    ...req,
    id: `dsr-${Date.now()}`,
    status: "received",
    createdAt: new Date().toISOString(),
  };
  requests.unshift(newReq);
  setItem(KEYS.DSR, requests);
  return newReq;
}

export function updateDsrStatus(id: string, status: DataSubjectRequest["status"]): DataSubjectRequest | undefined {
  const requests = getDsrRequests();
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) return undefined;
  requests[index]!.status = status;
  if (status === "completed") requests[index]!.completedAt = new Date().toISOString();
  setItem(KEYS.DSR, requests);
  return requests[index];
}

// EXPORT, BACKUP, RESTORE & RESET
export function exportInquiriesCsv(): string {
  const inquiries = getInquiries();
  const headers = ["ReferenceCode", "Branch", "FullName", "Email", "Phone", "Status", "Priority", "Assignee", "CreatedAt"];
  const rows = inquiries.map((i) => [
    i.referenceCode,
    i.branch,
    `"${i.fullName.replace(/"/g, '""')}"`,
    i.email,
    i.phone || "",
    i.status,
    i.priority,
    i.assigneeName || "Unassigned",
    i.createdAt,
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function exportAnalyticsCsv(): string {
  const inquiries = getInquiries();
  const total = inquiries.length;
  const visa = inquiries.filter((i) => i.branch === "visa").length;
  const jobs = inquiries.filter((i) => i.branch === "jobs").length;
  const completed = inquiries.filter((i) => i.status === "completed").length;

  return `Metric,Value\nTotal Inquiries,${total}\nDocumentation & Visa Inquiries,${visa}\nInternational Job Inquiries,${jobs}\nCompleted Inquiries,${completed}\nConversion Rate,${total > 0 ? ((completed / total) * 100).toFixed(1) : 0}%\nExportedAt,${new Date().toISOString()}`;
}

export function exportFullBackup(): string {
  const backupData = {
    exportedAt: new Date().toISOString(),
    isDemoBackup: true,
    version: "1.0",
    data: {
      inquiries: getInquiries(),
      notes: getItem(KEYS.NOTES, []),
      statusEvents: getItem(KEYS.STATUS_EVENTS, []),
      services: getServices(),
      news: getNewsArticles(),
      testimonials: getTestimonials(),
      users: getUsers(),
      auditLogs: getAuditLogs(),
      routingRules: getRoutingRules(),
      dsr: getDsrRequests(),
      settings: getItem(KEYS.SETTINGS, siteConfig),
    },
  };
  return JSON.stringify(backupData, null, 2);
}

export function restoreBackup(jsonString: string): boolean {
  try {
    const backup = JSON.parse(jsonString);
    if (!backup || !backup.data) return false;

    const { data } = backup;
    if (data.inquiries) setItem(KEYS.INQUIRIES, data.inquiries);
    if (data.notes) setItem(KEYS.NOTES, data.notes);
    if (data.statusEvents) setItem(KEYS.STATUS_EVENTS, data.statusEvents);
    if (data.services) setItem(KEYS.SERVICES, data.services);
    if (data.news) setItem(KEYS.NEWS, data.news);
    if (data.testimonials) setItem(KEYS.TESTIMONIALS, data.testimonials);
    if (data.users) setItem(KEYS.USERS, data.users);
    if (data.auditLogs) setItem(KEYS.AUDIT_LOGS, data.auditLogs);
    if (data.routingRules) setItem(KEYS.ROUTING_RULES, data.routingRules);
    if (data.dsr) setItem(KEYS.DSR, data.dsr);
    if (data.settings) setItem(KEYS.SETTINGS, data.settings);

    return true;
  } catch (err) {
    console.error("Failed to restore backup:", err);
    return false;
  }
}

export function resetSampleData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.INQUIRIES);
  localStorage.removeItem(KEYS.NOTES);
  localStorage.removeItem(KEYS.STATUS_EVENTS);
  localStorage.removeItem(KEYS.SERVICES);
  localStorage.removeItem(KEYS.VACANCIES);
  localStorage.removeItem(KEYS.NEWS);
  localStorage.removeItem(KEYS.TESTIMONIALS);
  localStorage.removeItem(KEYS.USERS);
  localStorage.removeItem(KEYS.AUDIT_LOGS);
  localStorage.removeItem(KEYS.DOCUMENTS);
  localStorage.removeItem(KEYS.SETTINGS);
  localStorage.removeItem(KEYS.ROUTING_RULES);
  localStorage.removeItem(KEYS.DSR);
  localStorage.removeItem("hbs_ref_counter_visa");
  localStorage.removeItem("hbs_ref_counter_jobs");

  initDemoStore();
}
