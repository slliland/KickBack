const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/trends', async (req, res) => {
  const { team_codes } = req.query;

  if (!team_codes) {
    return res.status(400).send('Team codes are required');
  }

  const codesArray = team_codes.split(',');

  try {
    const query = `
      SELECT
        year,
        home_team_code,
        away_team_code,
        home_score_total,
        away_score_total,
        match_attendance,
        red_cards,
        penalties,
        condition_weather,
        condition_temperature
      FROM matches
      WHERE home_team_code = ANY($1) OR away_team_code = ANY($1)
      ORDER BY year;
    `;

    const result = await pool.query(query, [codesArray]);
    const teamStats = {};

    result.rows.forEach(row => {
      const year = row.year;
      const teams = [row.home_team_code, row.away_team_code];

      teams.forEach((team, index) => {
        if (!codesArray.includes(team)) return;

        const isHome = index === 0;
        const scored = isHome ? row.home_score_total : row.away_score_total;
        const conceded = isHome ? row.away_score_total : row.home_score_total;
        const win = scored > conceded ? 1 : 0;
        const draw = scored === conceded ? 1 : 0;
        const attendance = row.match_attendance || 0;
        const redCardCount = Array.isArray(row.red_cards)
          ? row.red_cards.filter(e => e.country_code === team).length
          : 0;
        const penaltyCount = Array.isArray(row.penalties)
          ? row.penalties.filter(e => e.country_code === team).length
          : 0;

        if (!teamStats[team]) teamStats[team] = {};

        if (!teamStats[team][year]) {
          teamStats[team][year] = {
            year,
            matches: 0,
            wins: 0,
            draws: 0,
            goals_scored: 0,
            goals_conceded: 0,
            total_attendance: 0,
            red_cards: 0,
            penalties: 0,
            weather: {},
            temp_sum: 0,
            temp_count: 0
          };
        }

        const stats = teamStats[team][year];
        stats.matches += 1;
        stats.wins += win;
        stats.draws += draw;
        stats.goals_scored += scored;
        stats.goals_conceded += conceded;
        stats.total_attendance += attendance;
        stats.red_cards += redCardCount;
        stats.penalties += penaltyCount;

        const temp = parseFloat(row.condition_temperature);
        if (!isNaN(temp)) {
          stats.temp_sum += temp;
          stats.temp_count += 1;
        }

        const weather = row.condition_weather;
        if (weather) {
          stats.weather[weather] = (stats.weather[weather] || 0) + 1;
        }
      });
    });

    const response = Object.entries(teamStats).map(([team, yearlyStats]) => ({
      team_code: team,
      stats: Object.values(yearlyStats)
        .map(stat => ({
          ...stat,
          avg_temperature: stat.temp_count > 0
            ? parseFloat((stat.temp_sum / stat.temp_count).toFixed(1))
            : null,
          most_common_weather: Object.entries(stat.weather).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
          win_ratio: stat.matches ? parseFloat((stat.wins / stat.matches * 100).toFixed(2)) : null
        }))
        .sort((a, b) => a.year - b.year)
    }));

    res.json(response);
  } catch (err) {
    console.error('Error fetching trends:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
