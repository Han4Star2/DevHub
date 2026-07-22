CREATE VIEW "latest_game_stats" AS
SELECT DISTINCT ON (game_id)
	id,
	game_id,
	ccu,
	visits,
	favorites,
	likes,
	dislikes,
	rating_pct,
	captured_at
FROM "game_stats_snapshots"
ORDER BY game_id, captured_at DESC;
