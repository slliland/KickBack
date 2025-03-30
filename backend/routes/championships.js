// routes/championships.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/championships/top-countries
router.get('/top-countries', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT winner, COUNT(*) as titles
      FROM euro_summary
      WHERE winner IS NOT NULL
      GROUP BY winner
      ORDER BY titles DESC
      LIMIT 10;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
