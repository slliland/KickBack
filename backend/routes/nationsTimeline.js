const express = require('express');
const router = express.Router();
const pool = require('../db');

const fallbackTeamCodeMap = {
  'USSR': 'USSR',
  'Serbia': 'SER',
  'West Germany': 'FRG',
  'Germany': 'GER',
  'Yugoslavia': 'YUG',
  'Czechoslovakia': 'TCH',
  'Czechia': 'CZE',
  'Republic of Ireland': 'IRL',
  'Northern Ireland': 'NIR',
  'Netherlands': 'NED',
  'North Macedonia': 'MKD',
  'Commonwealth of Independent States': 'CIS'
};

router.get('/timeline', async (req, res) => {
  try {
    const timelineQuery = `
      WITH all_teams AS (
        SELECT home_team AS team, year FROM matches
        UNION ALL
        SELECT away_team AS team, year FROM matches
      ),
      final_teams AS (
        SELECT year, home_team AS team FROM matches WHERE round = 'FINAL'
        UNION ALL
        SELECT year, away_team AS team FROM matches WHERE round = 'FINAL'
      ),
      winners AS (
        SELECT winner AS team, COUNT(*) AS total_wins
        FROM matches
        WHERE round = 'FINAL' AND winner IS NOT NULL
        GROUP BY winner
      ),
      team_codes AS (
        SELECT DISTINCT home_team AS team, home_team_code AS code FROM matches
        UNION
        SELECT DISTINCT away_team, away_team_code FROM matches
      ),
      base AS (
        SELECT
          at.team,
          MIN(at.year) AS first_participation,
          COUNT(DISTINCT at.year) AS total_participations,
          COALESCE(f.count, 0) AS final_appearances,
          COALESCE(w.total_wins, 0) AS total_wins,
          tc.code
        FROM all_teams at
        LEFT JOIN (
          SELECT team, COUNT(*) AS count
          FROM final_teams
          GROUP BY team
        ) f ON f.team = at.team
        LEFT JOIN winners w ON w.team = at.team
        LEFT JOIN team_codes tc ON tc.team = at.team
        GROUP BY at.team, f.count, w.total_wins, tc.code
      )
      SELECT
        b.team,
        b.first_participation,
        b.total_participations,
        b.final_appearances,
        b.total_wins,
        b.code,
        ENCODE(tf.flag, 'base64') AS flag_base64
      FROM base b
      LEFT JOIN team_flags tf ON tf.team_code = b.code
      ORDER BY b.team;
    `;

    const result = await pool.query(timelineQuery);

    const enrichedRows = await Promise.all(
      result.rows.map(async row => {
        let { team, code, flag_base64 } = row;

        // If code is missing or flag not found, fallback
        if (!flag_base64) {
          const fallbackCode = fallbackTeamCodeMap[team];
          if (fallbackCode) {
            const flagResult = await pool.query(
              `SELECT ENCODE(flag, 'base64') AS flag_base64 FROM team_flags WHERE team_code = $1`,
              [fallbackCode]
            );
            if (flagResult.rows.length > 0) {
              flag_base64 = flagResult.rows[0].flag_base64;
              row.code = fallbackCode; // update code too
              row.flag_base64 = flag_base64;
            }
          }
        }

        return row;
      })
    );

    res.json(enrichedRows);
  } catch (err) {
    console.error('Error in /api/nations/timeline:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
