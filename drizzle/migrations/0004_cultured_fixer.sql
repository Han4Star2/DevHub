ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "roblox_user_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "roblox_username" text;--> statement-breakpoint
CREATE UNIQUE INDEX "users_roblox_user_id_idx" ON "users" USING btree ("roblox_user_id");