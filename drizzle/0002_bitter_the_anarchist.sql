ALTER TABLE `lead_intakes` ADD `content_hash` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `lead_intakes` ADD `marketing_consent_at` text;--> statement-breakpoint
CREATE INDEX `idx_lead_intakes_content_created` ON `lead_intakes` (`content_hash`,`created_at`);
