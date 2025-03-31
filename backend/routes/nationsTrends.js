const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/trends/:team_code', async (req, res) => {
  const { team_code } = req.params;

  try {
    const query = `
      SELECT
        year,
        home_team_code,
        away_team_code,
        home_score_total,
        away_score_total,
        match_attendance
      FROM matches
      WHERE home_team_code = $1 OR away_team_code = $1
      ORDER BY year;
    `;

    const result = await pool.query(query, [team_code]);
    const yearlyStats = {};

    result.rows.forEach(row => {
      const year = row.year;
      const isHome = row.home_team_code === team_code;
      const scored = isHome ? row.home_score_total : row.away_score_total;
      const conceded = isHome ? row.away_score_total : row.home_score_total;
      const win = (scored > conceded) ? 1 : 0;
      const draw = (scored === conceded) ? 1 : 0;
      const attendance = row.match_attendance || 0;

      if (!yearlyStats[year]) {
        yearlyStats[year] = {
          year,
          matches: 0,
          wins: 0,
          draws: 0,
          goals_scored: 0,
          goals_conceded: 0,
          total_attendance: 0
        };
      }

      yearlyStats[year].matches += 1;
      yearlyStats[year].wins += win;
      yearlyStats[year].draws += draw;
      yearlyStats[year].goals_scored += scored;
      yearlyStats[year].goals_conceded += conceded;
      yearlyStats[year].total_attendance += attendance;
    });

    res.json(Object.values(yearlyStats).sort((a, b) => a.year - b.year));
  } catch (err) {
    console.error('Error fetching trends:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
