const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/map', async (req, res) => {
  try {
    const query = `
      SELECT tc.team_code, tc.latitude, tc.longitude, f.flag
      FROM team_coordinates tc
      JOIN team_flags f ON tc.team_code = f.team_code;
    `;
    const { rows } = await pool.query(query);

    const result = rows.map(row => ({
      code: row.team_code,
      lat: row.latitude,
      lng: row.longitude,
      flag: `data:image/png;base64,${Buffer.from(row.flag).toString('base64')}`
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching map data:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
