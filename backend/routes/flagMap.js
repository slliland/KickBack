// flagMap.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/map', async (req, res) => {
  try {
    const query = `
      WITH team_years AS (
        SELECT home_team AS team, year FROM matches
        UNION
        SELECT away_team AS team, year FROM matches
      ),
      appearances AS (
        SELECT team, COUNT(DISTINCT year) AS total_appearances
        FROM team_years
        GROUP BY team
      ),
      wins AS (
        SELECT winner AS team, COUNT(*) AS total_wins
        FROM matches
        WHERE winner IS NOT NULL
        GROUP BY winner
      ),
      match_counts AS (
        SELECT team, COUNT(*) AS total_matches
        FROM (
          SELECT home_team AS team FROM matches
          UNION ALL
          SELECT away_team AS team FROM matches
        ) all_teams
        GROUP BY team
      ),
      draws AS (
        SELECT team, COUNT(*) AS total_draws
        FROM (
          SELECT home_team AS team, home_score_total AS h, away_score_total AS a FROM matches
          UNION ALL
          SELECT away_team AS team, away_score_total AS a, home_score_total AS h FROM matches
        ) t
        WHERE h = a
        GROUP BY team
      ),
      codes AS (
        SELECT DISTINCT home_team, home_team_code FROM matches
        UNION
        SELECT DISTINCT away_team, away_team_code FROM matches
      ),
      coords AS (
        SELECT * FROM team_coordinates
      )
      SELECT
        a.team,
        tc.home_team_code AS team_code,
        a.total_appearances,
        COALESCE(w.total_wins, 0) AS total_wins,
        COALESCE(d.total_draws, 0) AS total_draws,
        COALESCE(m.total_matches, 0) - COALESCE(w.total_wins, 0) - COALESCE(d.total_draws, 0) AS total_losses,
        COALESCE(coord.latitude, 51.5074) AS lat,
        COALESCE(coord.longitude, -0.1278) AS lng,
        f.flag
      FROM appearances a
      LEFT JOIN wins w ON w.team = a.team
      LEFT JOIN draws d ON d.team = a.team
      LEFT JOIN match_counts m ON m.team = a.team
      LEFT JOIN codes tc ON tc.home_team = a.team
      LEFT JOIN coords coord ON coord.team_code = tc.home_team_code
      LEFT JOIN team_flags f ON f.team_code = tc.home_team_code
      ORDER BY a.total_appearances DESC;
    `;

    const { rows } = await pool.query(query);

    const result = rows.map(row => ({
      team: row.team,
      team_code: row.team_code,
      total_appearances: row.total_appearances,
      total_wins: row.total_wins,
      total_draws: row.total_draws,
      total_losses: row.total_losses,
      lat: row.lat,
      lng: row.lng,
      flag: row.flag 
        ? `data:image/png;base64,${Buffer.from(row.flag).toString('base64')}`
        : '' // or provide a default flag URL
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching map data:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
