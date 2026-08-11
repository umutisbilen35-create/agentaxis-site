CREATE TABLE `content_clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_key` text NOT NULL,
	`name` text NOT NULL,
	`portal_token_hash` text NOT NULL,
	`whatsapp_e164` text,
	`whatsapp_opt_in_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_clients_key` ON `content_clients` (`client_key`);--> statement-breakpoint
CREATE TABLE `content_notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`client_key` text NOT NULL,
	`approval_public_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`created_at` text NOT NULL,
	`sent_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_notifications_public_id` ON `content_notifications` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_notifications_approval_type` ON `content_notifications` (`approval_public_id`,`type`);--> statement-breakpoint
CREATE INDEX `idx_content_notifications_status_created` ON `content_notifications` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `content_portal_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_key` text NOT NULL,
	`ip_hash` text NOT NULL,
	`window_start` text NOT NULL,
	`failures` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_portal_attempt_window` ON `content_portal_attempts` (`client_key`,`ip_hash`,`window_start`);--> statement-breakpoint
CREATE INDEX `idx_content_portal_attempt_updated` ON `content_portal_attempts` (`updated_at`);--> statement-breakpoint
CREATE TABLE `content_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`client_key` text NOT NULL,
	`source` text NOT NULL,
	`suggestion_key` text,
	`topic` text NOT NULL,
	`note` text,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_requests_public_id` ON `content_requests` (`public_id`);--> statement-breakpoint
CREATE INDEX `idx_content_requests_client_created` ON `content_requests` (`client_key`,`created_at`);