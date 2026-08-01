CREATE TABLE `lead_intakes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`business` text NOT NULL,
	`sector` text NOT NULL,
	`website` text,
	`needs_json` text NOT NULL,
	`plan` text NOT NULL,
	`contact_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`note` text,
	`consent_at` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`ip_hash` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_lead_intakes_reference` ON `lead_intakes` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_lead_intakes_idempotency` ON `lead_intakes` (`idempotency_key`);--> statement-breakpoint
CREATE TABLE `trial_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`intake_id` integer NOT NULL,
	`status` text DEFAULT 'waiting_for_review' NOT NULL,
	`starts_at` text,
	`ends_at` text,
	`milestones_json` text NOT NULL,
	`metrics_json` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_trial_runs_intake` ON `trial_runs` (`intake_id`);