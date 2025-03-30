// backend/routes/search.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query required' });

  try {
    const news = await pool.query(`
      SELECT title, link, fetched_at FROM euro_news
      WHERE LOWER(title) LIKE LOWER($1)
      ORDER BY fetched_at DESC
      LIMIT 10;
    `, [`%${query}%`]);

    const summaries = await pool.query(`
      SELECT year, winner, final FROM euro_summary
      WHERE LOWER(winner) LIKE LOWER($1) OR LOWER(final) LIKE LOWER($1)
      ORDER BY year DESC
      LIMIT 10;
    `, [`%${query}%`]);

    res.json({
      news: news.rows,
      summary: summaries.rows
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
