// routes/championships.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/top-countries', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT winner AS country, COUNT(*) AS wins, winner_code AS country_code
      FROM euro_summary
      WHERE winner IS NOT NULL
      GROUP BY winner, winner_code
      ORDER BY wins DESC
      LIMIT 10;
    `);

    const enriched = await Promise.all(result.rows.map(async (row) => {
      const flagRes = await pool.query(
        'SELECT flag FROM team_flags WHERE team_code = $1',
        [row.country_code]
      );
      const flagData = flagRes.rows[0]?.flag;
      const base64Flag = flagData ? `data:image/png;base64,${flagData.toString('base64')}` : null;

      return {
        ...row,
        flag: base64Flag,
      };
    }));

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
