const express = require('express');
const router = express.Router();
const pool = require('../db');
const fetch = require('node-fetch');

const codeMapping = {
  "SUI": "CHE", "ENG": "GBR", "SWE": "SWE", "FRG": "DEU", "ITA": "ITA", "CIS": null, 
  "DEN": "DNK", "POR": "PRT", "WAL": "GBR", "RUS": "RUS", "SVN": "SVN", "YUG": "YUG", 
  "SCO": "GBR", "GRE": "GRC", "URS": "SUN", "GER": "DEU", "NOR": "NOR", "GEO": "GEO", 
  "BEL": "BEL", "NIR": "GBR", "HUN": "HUN", "NED": "NLD", "AUT": "AUT", "IRL": "IRL", 
  "POL": "POL", "SRB": "SRB", "ESP": "ESP", "CRO": "HRV", "CZE": "CZE", "ROU": "ROU", 
  "MKD": "MKD", "BUL": "BGR", "FIN": "FIN", "TCH": "CSK", "LVA": "LVA", "TUR": "TUR", 
  "ISL": "ISL", "ALB": "ALB", "FRA": "FRA", "UKR": "UKR", "SVK": "SVK"
};

function updateTeamCode(code) {
  return codeMapping[code] || code;
}

function calculateSuccessScore(row, teamsInTournament) {
  const maxMatches = Math.log2(teamsInTournament) + 1;
  const matchesPlayed = row.total_wins + row.total_draws + row.total_losses;
  const winPercentage = matchesPlayed ? row.total_wins / matchesPlayed : 0;
  const goalDiffPerMatch = matchesPlayed ? (row.total_goals_scored - row.total_goals_conceded) / matchesPlayed : 0;
  const progressionFactor = matchesPlayed / maxMatches;
  const tournamentFactor = row.tournament_appearances ? (row.tournament_wins * 0.5 + row.finals_appearances * 0.3) / row.tournament_appearances : 0;
  const consistency = row.tournament_appearances / 16;

  let score = (
    0.4 * winPercentage +
    0.2 * Math.tanh(goalDiffPerMatch / 2) +
    0.1 * progressionFactor +
    0.2 * tournamentFactor +
    0.1 * consistency
  );

  score = 0.01 + (0.98 * score);
  return Math.round(score * 1000) / 1000;
}

router.get('/stats', async (req, res) => {
  try {
    const aggQuery = `
      SELECT country, country_code, COUNT(DISTINCT year) AS tournament_appearances,
             SUM(goals_scored) AS total_goals_scored, SUM(goals_conceded) AS total_goals_conceded,
             SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) AS total_wins,
             SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END) AS total_draws,
             SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) AS total_losses
      FROM (
        SELECT year, home_team AS country, home_team_code AS country_code, home_score_total AS goals_scored,
               away_score_total AS goals_conceded,
               CASE WHEN home_score_total > away_score_total THEN 'win'
                    WHEN home_score_total = away_score_total THEN 'draw'
                    ELSE 'loss' END AS result FROM matches
        UNION ALL
        SELECT year, away_team, away_team_code, away_score_total, home_score_total,
               CASE WHEN away_score_total > home_score_total THEN 'win'
                    WHEN away_score_total = home_score_total THEN 'draw'
                    ELSE 'loss' END FROM matches
      ) sub GROUP BY country, country_code ORDER BY country;
    `;
    const statsResult = await pool.query(aggQuery);
    let stats = statsResult.rows;

    const finalsQuery = `
      SELECT country, country_code, COUNT(*) AS finals_appearances
      FROM (
        SELECT home_team AS country, home_team_code AS country_code FROM matches WHERE round='FINAL'
        UNION ALL
        SELECT away_team, away_team_code FROM matches WHERE round='FINAL'
      ) AS sub GROUP BY country, country_code;
    `;
    const finalsResult = await pool.query(finalsQuery);
    const finalsMap = new Map(finalsResult.rows.map(row => [row.country_code, row.finals_appearances]));

    const championsResult = await pool.query("SELECT winner_code, COUNT(*) AS tournament_wins FROM euro_summary GROUP BY winner_code;");
    const championsMap = new Map(championsResult.rows.map(row => [updateTeamCode(row.winner_code), row.tournament_wins]));

    stats = stats.map(stat => {
      const finals = finalsMap.get(stat.country_code) || 0;
      const tournaments = championsMap.get(stat.country_code) || 0;
      const successScore = calculateSuccessScore({...stat, finals_appearances: finals, tournament_wins: tournaments}, 24);
      return {...stat, finals_appearances: finals, tournament_wins: tournaments, success_score: successScore};
    });

    res.json(stats);
  } catch (error) {
    console.error("Error retrieving stats:", error);
    res.status(500).json({error: 'Internal server error'});
  }
});

router.get('/matches/:country_code', async (req, res) => {
  const {country_code} = req.params;
  const query = `
    SELECT year, country, country_code, goals_scored, goals_conceded, result, round, date
    FROM (
      SELECT year, home_team AS country, home_team_code AS country_code, home_score_total AS goals_scored, away_score_total AS goals_conceded,
             CASE WHEN home_score_total > away_score_total THEN 'win' WHEN home_score_total = away_score_total THEN 'draw' ELSE 'loss' END result, round, date FROM matches WHERE home_team_code=$1
      UNION ALL
      SELECT year, away_team, away_team_code, away_score_total, home_score_total,
             CASE WHEN away_score_total > home_score_total THEN 'win' WHEN away_score_total = home_score_total THEN 'draw' ELSE 'loss' END, round, date FROM matches WHERE away_team_code=$1
    ) sub ORDER BY year;
  `;
  const matchesResult = await pool.query(query, [country_code]);
  res.json(matchesResult.rows);
});

router.get('/geo', async (_, res) => {
  const response = await fetch("https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson");
  const geojson = await response.json();
  res.json(geojson);
});

module.exports = router;
