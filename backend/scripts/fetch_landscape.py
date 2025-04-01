from flask import Flask, jsonify
import pandas as pd
import numpy as np
import ast
import requests
import json
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import psycopg2

load_dotenv(dotenv_path="../.env")

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

# --- Helper Functions ---

def calculate_success_score(row, teams_in_tournament):
    max_matches = np.log2(teams_in_tournament) + 1  # Maximum number of matches a team can play
    matches_played = row['total_wins'] + row['total_draws'] + row['total_losses']
    
    win_percentage = row['total_wins'] / matches_played if matches_played > 0 else 0
    goal_diff_per_match = (row['total_goals_scored'] - row['total_goals_conceded']) / matches_played if matches_played > 0 else 0
    progression_factor = matches_played / max_matches
    tournament_factor = (row['tournament_wins'] * 0.5 + row['finals_appearances'] * 0.3) / row['tournament_appearances'] if row['tournament_appearances'] > 0 else 0
    consistency = row['tournament_appearances'] / 16  # Assuming 16 tournaments total
    
    score = (
        0.4 * win_percentage +
        0.2 * np.tanh(goal_diff_per_match / 2) +
        0.1 * progression_factor +
        0.2 * tournament_factor +
        0.1 * consistency
    )
    score = 0.01 + (0.98 * score)
    return round(score, 3)

def process_goals(goals_str):
    if goals_str is None or (isinstance(goals_str, str) and (pd.isna(goals_str) or goals_str.strip() == '')):
        return 0, 0, 0
    if isinstance(goals_str, (list, tuple, np.ndarray)):
        goals = goals_str
    elif isinstance(goals_str, str):
        try:
            goals = ast.literal_eval(goals_str)
        except Exception as e:
            print(f"Error processing goals_str: {goals_str}. Exception: {e}")
            return 0, 0, 0
    else:
        return 0, 0, 0

    open_play = sum(1 for goal in goals if goal.get('goal_type') == 'SCORED')
    own_goal = sum(1 for goal in goals if goal.get('goal_type') == 'OWN')
    penalty = sum(1 for goal in goals if goal.get('goal_type') == 'PENALTY')
    return open_play, own_goal, penalty

# --- Configuration & Data Loading ---
# db_user = os.getenv('DB_USER')
# db_pass = os.getenv('DB_PASSWORD')
# db_host = os.getenv('DB_HOST')
# db_port = os.getenv('DB_PORT')
# db_name = os.getenv('DB_NAME')
# DATABASE_URL = f'postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}'
DATABASE_URL = os.environ.get("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Mapping from Given Code to Correct ISO 3166-1 Alpha‑3 Code
code_mapping = {
    "SUI": "CHE",      
    "ENG": "GBR",      
    "SWE": "SWE",      
    "FRG": "DEU",      
    "ITA": "ITA",      
    "CIS": None,       
    "DEN": "DNK",      
    "POR": "PRT",      
    "WAL": "GBR",      
    "RUS": "RUS",      
    "SVN": "SVN",      
    "YUG": "YUG",      
    "SCO": "GBR",      
    "GRE": "GRC",      
    "URS": "SUN",      
    "GER": "DEU",      
    "NOR": "NOR",      
    "GEO": "GEO",      
    "BEL": "BEL",      
    "NIR": "GBR",      
    "HUN": "HUN",      
    "NED": "NLD",      
    "AUT": "AUT",      
    "IRL": "IRL",      
    "POL": "POL",      
    "SRB": "SRB",      
    "ESP": "ESP",      
    "CRO": "HRV",      
    "CZE": "CZE",      
    "ROU": "ROU",      
    "MKD": "MKD",      
    "BUL": "BGR",      
    "FIN": "FIN",      
    "TCH": "CSK",      
    "LVA": "LVA",      
    "TUR": "TUR",      
    "ISL": "ISL",      
    "ALB": "ALB",      
    "FRA": "FRA",      
    "UKR": "UKR",      
    "SVK": "SVK"       
}

def update_team_code(code):
    if code in code_mapping and code_mapping[code]:
        return code_mapping[code]
    return code

# Load match data from the "matches" table
all_matches = pd.read_sql_query("SELECT * FROM matches", engine)

# Update team codes in the DataFrame using the mapping
all_matches['home_team_code'] = all_matches['home_team_code'].apply(update_team_code)
all_matches['away_team_code'] = all_matches['away_team_code'].apply(update_team_code)

dissolved_country_codes = ['CIS', 'URS', 'FRG', 'YUG', 'TCH']

tournament_expansions = {
    1980: 8,
    1996: 16,
    2016: 24
}

def get_teams_in_tournament(year):
    for expansion_year, num_teams in sorted(tournament_expansions.items(), reverse=True):
        if year >= expansion_year:
            return num_teams
    return 4

# --- Data Processing ---
country_data = []
for year, matches in all_matches.groupby('year'):
    teams_in_tournament = get_teams_in_tournament(year)
    for _, match in matches.iterrows():
        for team, opponent, team_code, score, opponent_score in [
            (match['home_team'], match['away_team'], match['home_team_code'], match['home_score_total'], match['away_score_total']),
            (match['away_team'], match['home_team'], match['away_team_code'], match['away_score_total'], match['home_score_total'])
        ]:
            if team_code in dissolved_country_codes:
                continue
            goals = process_goals(match['goals'] if team == match['home_team'] else None)
            country_data.append({
                'year': year,
                'country': team,
                'country_code': team_code,
                'opponent': opponent,
                'goals_scored': score,
                'goals_conceded': opponent_score,
                'open_play_goals': score - goals[1] - goals[2],
                'own_goals': goals[1],
                'penalty_goals': goals[2],
                'result': 'win' if score > opponent_score else 'draw' if score == opponent_score else 'loss',
                'round': match['round'],
                'date': match['date'],
                'red_cards': 0,
                'teams_in_tournament': teams_in_tournament
            })

df = pd.DataFrame(country_data)

# Aggregate country statistics
country_stats = df.groupby(['country', 'country_code']).agg({
    'year': 'nunique',
    'goals_scored': 'sum',
    'goals_conceded': 'sum',
    'open_play_goals': 'sum',
    'own_goals': 'sum',
    'penalty_goals': 'sum',
    'red_cards': 'sum',
    'teams_in_tournament': 'max'
}).reset_index()

result_stats = df.groupby('country')['result'].value_counts().unstack(fill_value=0)
result_stats.columns = ['total_' + col for col in result_stats.columns]
country_stats = country_stats.merge(result_stats, left_on='country', right_index=True, how='left')

country_stats.columns = [
    'country', 'country_code', 'tournament_appearances', 
    'total_goals_scored', 'total_goals_conceded',
    'total_open_play_goals', 'total_own_goals', 'total_penalty_goals',
    'total_red_cards', 'max_teams_in_tournament',
    'total_draws', 'total_losses', 'total_wins'
]

finals_appearances = df[df['round'] == 'FINAL'].groupby(['country', 'country_code']).size().reset_index(name='finals_appearances')
country_stats = country_stats.merge(finals_appearances, on=['country', 'country_code'], how='left')
country_stats['finals_appearances'] = country_stats['finals_appearances'].fillna(0).astype(int)

# Load champion data from euro_summary to get correct tournament_wins
champions_query = """
SELECT winner_code, COUNT(*) AS tournament_wins
FROM euro_summary
GROUP BY winner_code;
"""
champions_df = pd.read_sql_query(champions_query, engine)
champions_df.columns = ['country_code', 'tournament_wins']
# Update champion codes using the mapping
champions_df['country_code'] = champions_df['country_code'].apply(lambda code: code_mapping.get(code, code))
country_stats = country_stats.merge(champions_df, on='country_code', how='left')
country_stats['tournament_wins'] = country_stats['tournament_wins'].fillna(0).astype(int)

country_stats['success_score'] = country_stats.apply(
    lambda row: calculate_success_score(row, row['max_teams_in_tournament']),
    axis=1
)

# --- API Endpoints ---

@app.route('/api/euro/stats', methods=['GET'])
def get_country_stats():
    data = country_stats.to_dict(orient='records')
    return jsonify(data)

@app.route('/api/euro/tournaments', methods=['GET'])
def get_tournament_data():
    tournament_data = []
    for year, year_data in df.groupby('year'):
        teams_in_tournament = get_teams_in_tournament(year)
        year_stats = year_data.groupby(['country', 'country_code']).agg({
            'goals_scored': 'sum',
            'goals_conceded': 'sum',
            'open_play_goals': 'sum',
            'own_goals': 'sum',
            'penalty_goals': 'sum',
            'red_cards': 'sum'
        }).reset_index()
        finals_appearances = year_data[year_data['round'] == 'FINAL'].groupby(['country', 'country_code']).size().reset_index(name='finals_appearances')
        year_stats = year_stats.merge(finals_appearances, on=['country', 'country_code'], how='left')
        year_stats['finals_appearances'] = year_stats['finals_appearances'].fillna(0).astype(int)
        tournament_win = year_data[(year_data['round'] == 'FINAL') & (year_data['result'] == 'win')].groupby(['country', 'country_code']).size().reset_index(name='tournament_win')
        year_stats = year_stats.merge(tournament_win, on=['country', 'country_code'], how='left')
        year_stats['tournament_win'] = year_stats['tournament_win'].fillna(0).astype(int)
        year_stats['year'] = year
        year_stats['teams_in_tournament'] = teams_in_tournament
        tournament_data.append(year_stats)
    tournament_df = pd.concat(tournament_data)
    data = tournament_df.to_dict(orient='records')
    return jsonify(data)

@app.route('/api/euro/geo', methods=['GET'])
def get_geojson():
    url = 'https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson'
    response = requests.get(url)
    geojson_data = response.json()
    return jsonify(geojson_data)

@app.route('/api/euro/matches/<country_code>', methods=['GET'])
def get_country_matches(country_code):
    filtered_df = df[df['country_code'] == country_code.upper()].sort_values(by='year')
    return jsonify(filtered_df.to_dict(orient='records'))

if __name__ == '__main__':
    # app.run(debug=True)
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
