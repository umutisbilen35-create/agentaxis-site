CREATE TABLE `approval_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`ip_hash` text NOT NULL,
	`window_start` text NOT NULL,
	`failures` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_approval_attempt_window` ON `approval_attempts` (`public_id`,`ip_hash`,`window_start`);--> statement-breakpoint
CREATE INDEX `idx_approval_attempt_updated` ON `approval_attempts` (`updated_at`);