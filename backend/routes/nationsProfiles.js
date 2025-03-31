const express = require('express');
const router = express.Router();
const pool = require('../db');

// Manual mapping from full team names to 3-letter codes
const teamNameToCode = require('../utils/teamMap');

router.get('/profiles', async (req, res) => {
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
        COALESCE(coord.latitude, 48.8566) AS lat,
        COALESCE(coord.longitude, 2.3522) AS lng
      FROM appearances a
      LEFT JOIN wins w ON w.team = a.team
      LEFT JOIN draws d ON d.team = a.team
      LEFT JOIN match_counts m ON m.team = a.team
      LEFT JOIN codes tc ON tc.home_team = a.team
      LEFT JOIN coords coord ON coord.team_code = tc.home_team_code
      ORDER BY a.total_appearances DESC;
    `;

    const { rows } = await pool.query(query);

    // Add top scorers using player_starts.country_code
    for (const team of rows) {
      const code = teamNameToCode[team.team] || team.team_code;

      if (!code) {
        team.top_scorers = [];
        continue;
      }

      const scorerQuery = `
        SELECT
          ps.name,
          COUNT(*) AS goals,
          ps.position_national AS position,
          TO_CHAR(ps.birth_date, 'Mon DD, YYYY') AS birth_date,
          ps.height
        FROM matches m
        CROSS JOIN LATERAL jsonb_array_elements(m.events) AS evt
        JOIN player_starts ps ON ps.id_player::text = evt->>'primary_id_person'
        WHERE evt->>'type' = 'GOAL'
          AND ps.country_code = $1
        GROUP BY ps.name, ps.position_national, ps.birth_date, ps.height
        ORDER BY goals DESC
        LIMIT 5;
      `;


      const scorerResult = await pool.query(scorerQuery, [code]);

      team.top_scorers = scorerResult.rows.map(r => ({
        name: r.name,
        goals: r.goals,
        position: r.position || '—',
        height: r.height || '—',
        birth_date: r.birth_date || '—'
      }));  
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching country profiles:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
