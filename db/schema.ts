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
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
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
