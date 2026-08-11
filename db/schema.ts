import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const leadIntakes = sqliteTable("lead_intakes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull(),
  business: text("business").notNull(),
  sector: text("sector").notNull(),
  website: text("website"),
  needsJson: text("needs_json").notNull(),
  plan: text("plan").notNull(),
  diagnosisJson: text("diagnosis_json").notNull().default("[]"),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  note: text("note"),
  consentAt: text("consent_at").notNull(),
  idempotencyKey: text("idempotency_key").notNull(),
  contentHash: text("content_hash").notNull(),
  ipHash: text("ip_hash").notNull(),
  marketingConsentAt: text("marketing_consent_at"),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("idx_lead_intakes_reference").on(table.reference),
  uniqueIndex("idx_lead_intakes_idempotency").on(table.idempotencyKey),
  index("idx_lead_intakes_content_created").on(table.contentHash, table.createdAt),
  index("idx_lead_intakes_ip_created").on(table.ipHash, table.createdAt),
]);

export const trialRuns = sqliteTable("trial_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  intakeId: integer("intake_id").notNull().references(() => leadIntakes.id),
  status: text("status").notNull().default("waiting_for_review"),
  startsAt: text("starts_at"),
  endsAt: text("ends_at"),
  milestonesJson: text("milestones_json").notNull(),
  metricsJson: text("metrics_json").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [uniqueIndex("idx_trial_runs_intake").on(table.intakeId)]);

export const contentApprovals = sqliteTable("content_approvals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  publicId: text("public_id").notNull(),
  clientKey: text("client_key").notNull(),
  tokenHash: text("token_hash").notNull(),
  title: text("title").notNull(),
  caption: text("caption").notNull(),
  imageKey: text("image_key").notNull(),
  imageSha256: text("image_sha256").notNull(),
  plannedAt: text("planned_at").notNull(),
  status: text("status").notNull().default("waiting_for_review"),
  clientNote: text("client_note"),
  expiresAt: text("expires_at").notNull(),
  decidedAt: text("decided_at"),
  contentHash: text("content_hash").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("idx_content_approvals_public_id").on(table.publicId),
  uniqueIndex("idx_content_approvals_content_hash").on(table.contentHash),
  index("idx_content_approvals_client_status").on(table.clientKey, table.status),
]);

export const approvalAttempts = sqliteTable("approval_attempts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  publicId: text("public_id").notNull(),
  ipHash: text("ip_hash").notNull(),
  windowStart: text("window_start").notNull(),
  failures: integer("failures").notNull().default(1),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  uniqueIndex("idx_approval_attempt_window").on(table.publicId, table.ipHash, table.windowStart),
  index("idx_approval_attempt_updated").on(table.updatedAt),
]);

export const contentClients = sqliteTable("content_clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientKey: text("client_key").notNull(),
  name: text("name").notNull(),
  portalTokenHash: text("portal_token_hash").notNull(),
  email: text("email"),
  emailOptInAt: text("email_opt_in_at"),
  whatsappE164: text("whatsapp_e164"),
  whatsappOptInAt: text("whatsapp_opt_in_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("idx_content_clients_key").on(table.clientKey)]);

export const contentRequests = sqliteTable("content_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  publicId: text("public_id").notNull(),
  clientKey: text("client_key").notNull(),
  source: text("source").notNull(),
  suggestionKey: text("suggestion_key"),
  topic: text("topic").notNull(),
  note: text("note"),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("idx_content_requests_public_id").on(table.publicId),
  index("idx_content_requests_client_created").on(table.clientKey, table.createdAt),
]);

export const contentNotifications = sqliteTable("content_notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  publicId: text("public_id").notNull(),
  clientKey: text("client_key").notNull(),
  approvalPublicId: text("approval_public_id").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error"),
  createdAt: text("created_at").notNull(),
  sentAt: text("sent_at"),
}, (table) => [
  uniqueIndex("idx_content_notifications_public_id").on(table.publicId),
  uniqueIndex("idx_content_notifications_approval_type").on(table.approvalPublicId, table.type),
  index("idx_content_notifications_status_created").on(table.status, table.createdAt),
]);

export const contentPortalAttempts = sqliteTable("content_portal_attempts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientKey: text("client_key").notNull(),
  ipHash: text("ip_hash").notNull(),
  windowStart: text("window_start").notNull(),
  failures: integer("failures").notNull().default(1),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  uniqueIndex("idx_content_portal_attempt_window").on(table.clientKey, table.ipHash, table.windowStart),
  index("idx_content_portal_attempt_updated").on(table.updatedAt),
]);
