const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM euro_summary');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
