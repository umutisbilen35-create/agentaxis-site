CREATE TABLE `content_approvals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`client_key` text NOT NULL,
	`token_hash` text NOT NULL,
	`title` text NOT NULL,
	`caption` text NOT NULL,
	`image_key` text NOT NULL,
	`planned_at` text NOT NULL,
	`status` text DEFAULT 'waiting_for_review' NOT NULL,
	`client_note` text,
	`expires_at` text NOT NULL,
	`decided_at` text,
	`content_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_approvals_public_id` ON `content_approvals` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_approvals_content_hash` ON `content_approvals` (`content_hash`);--> statement-breakpoint
CREATE INDEX `idx_content_approvals_client_status` ON `content_approvals` (`client_key`,`status`);