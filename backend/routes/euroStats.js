const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/extremes', async (req, res) => {
  try {
    const queries = {
      maxGoals: `SELECT year, goals FROM euro_summary ORDER BY goals DESC LIMIT 1;`,
      maxAttendance: `SELECT year, attendance FROM euro_summary ORDER BY attendance DESC LIMIT 1;`,
      maxRedCards: `SELECT year, red_cards FROM euro_summary ORDER BY red_cards DESC LIMIT 1;`,
      maxMatches: `SELECT year, matches FROM euro_summary ORDER BY matches DESC LIMIT 1;`,
      topWinner: `
        SELECT winner, COUNT(*) AS titles
        FROM euro_summary
        GROUP BY winner
        ORDER BY titles DESC
        LIMIT 1;
      `
    };

    const results = await Promise.all([
      pool.query(queries.maxGoals),
      pool.query(queries.maxAttendance),
      pool.query(queries.maxRedCards),
      pool.query(queries.maxMatches),
      pool.query(queries.topWinner),
    ]);

    const response = {
      maxGoals: results[0].rows[0],
      maxAttendance: results[1].rows[0],
      maxRedCards: results[2].rows[0],
      maxMatches: results[3].rows[0],
      topWinner: results[4].rows[0],
    };

    res.json(response);
  } catch (err) {
    console.error('Error retrieving extreme stats:', err);
    res.status(500).send('Internal server error');
  }
});

router.get('/news', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT title, link, fetched_at
      FROM euro_news
      ORDER BY fetched_at DESC
      LIMIT 5;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
