CREATE TABLE "game_stats_snapshots" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"game_id" uuid NOT NULL,
	"ccu" bigint,
	"visits" bigint,
	"favorites" bigint,
	"likes" bigint,
	"dislikes" bigint,
	"rating_pct" numeric(5, 2),
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"universe_id" bigint NOT NULL,
	"root_place_id" bigint NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"studio_name" text,
	"studio_id" bigint,
	"description" text,
	"genre" text,
	"thumbnail_url" text,
	"icon_url" text,
	"verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_stats_snapshots" ADD CONSTRAINT "game_stats_snapshots_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "game_stats_snapshots_game_captured_idx" ON "game_stats_snapshots" USING btree ("game_id","captured_at");--> statement-breakpoint
CREATE UNIQUE INDEX "games_universe_id_idx" ON "games" USING btree ("universe_id");--> statement-breakpoint
CREATE UNIQUE INDEX "games_slug_idx" ON "games" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "games_genre_idx" ON "games" USING btree ("genre");--> statement-breakpoint
CREATE INDEX "games_is_active_idx" ON "games" USING btree ("is_active");