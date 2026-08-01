CREATE INDEX `idx_lead_intakes_ip_created` ON `lead_intakes` (`ip_hash`,`created_at`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trial_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`intake_id` integer NOT NULL,
	`status` text DEFAULT 'waiting_for_review' NOT NULL,
	`starts_at` text,
	`ends_at` text,
	`milestones_json` text NOT NULL,
	`metrics_json` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`intake_id`) REFERENCES `lead_intakes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_trial_runs`("id", "intake_id", "status", "starts_at", "ends_at", "milestones_json", "metrics_json", "created_at") SELECT "id", "intake_id", "status", "starts_at", "ends_at", "milestones_json", "metrics_json", "created_at" FROM `trial_runs`;--> statement-breakpoint
DROP TABLE `trial_runs`;--> statement-breakpoint
ALTER TABLE `__new_trial_runs` RENAME TO `trial_runs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_trial_runs_intake` ON `trial_runs` (`intake_id`);