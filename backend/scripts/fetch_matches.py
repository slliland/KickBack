import os
import pandas as pd
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
import numpy as np

# Load environment variables
load_dotenv(dotenv_path="../.env")

# PostgreSQL connection
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)
cur = conn.cursor()

# Create table if it doesn't exist
create_table_sql = """
CREATE TABLE IF NOT EXISTS matches (
    id_match INTEGER PRIMARY KEY,
    home_team TEXT,
    away_team TEXT,
    home_team_code TEXT,
    away_team_code TEXT,
    home_score INTEGER,
    away_score INTEGER,
    home_penalty INTEGER,
    away_penalty INTEGER,
    home_score_total INTEGER,
    away_score_total INTEGER,
    winner TEXT,
    winner_reason TEXT,
    year INTEGER,
    date TEXT,
    date_time TIMESTAMPTZ,
    utc_offset_hours TEXT,
    group_name TEXT,
    matchday_name TEXT,
    condition_humidity TEXT,
    condition_pitch TEXT,
    condition_temperature TEXT,
    condition_weather TEXT,
    condition_wind_speed TEXT,
    status TEXT,
    type TEXT,
    round TEXT,
    round_mode TEXT,
    match_attendance INTEGER,
    stadium_id TEXT,
    stadium_country_code TEXT,
    stadium_capacity INTEGER,
    stadium_latitude DOUBLE PRECISION,
    stadium_longitude DOUBLE PRECISION,
    stadium_pitch_length INTEGER,
    stadium_pitch_width INTEGER,
    goals JSONB,
    penalties_missed JSONB,
    penalties JSONB,
    red_cards JSONB,
    game_referees JSONB,
    stadium_city TEXT,
    stadium_name TEXT,
    stadium_name_media TEXT,
    stadium_name_official TEXT,
    stadium_name_event TEXT,
    stadium_name_sponsor TEXT,
    home_lineups JSONB,
    away_lineups JSONB,
    home_coaches JSONB,
    away_coaches JSONB,
    events JSONB
);
"""
cur.execute(create_table_sql)
conn.commit()

# Helper to safely parse JSON columns
def safe_json_parse(value):
    try:
        if pd.isna(value) or str(value).lower() == "nan":
            return Json([])
        return Json(eval(value))
    except Exception:
        return Json([])

# Path to your CSV folder
folder = '/Users/yujian/Downloads/archive/matches/matches/euro'

for file in os.listdir(folder):
    if file.endswith('.csv'):
        path = os.path.join(folder, file)
        print(f"Uploading {file}...")

        df = pd.read_csv(path)
        df = df.replace({np.nan: None})

        for _, row in df.iterrows():
            try:
                cur.execute("""
                    INSERT INTO matches VALUES (
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s
                    )
                    ON CONFLICT (id_match) DO NOTHING;
                """, [
                    row['id_match'], row['home_team'], row['away_team'], row['home_team_code'], row['away_team_code'],
                    row['home_score'], row['away_score'], row['home_penalty'], row['away_penalty'], row['home_score_total'],
                    row['away_score_total'], row['winner'], row['winner_reason'], row['year'], row['date'],
                    row['date_time'], row['utc_offset_hours'], row['group_name'], row['matchday_name'], row['condition_humidity'],
                    row['condition_pitch'], row['condition_temperature'], row['condition_weather'], row['condition_wind_speed'], row['status'],
                    row['type'], row['round'], row['round_mode'], row['match_attendance'], row['stadium_id'],
                    row['stadium_country_code'], row['stadium_capacity'], row['stadium_latitude'], row['stadium_longitude'], row['stadium_pitch_length'],
                    row['stadium_pitch_width'], 
                    safe_json_parse(row['goals']),
                    safe_json_parse(row['penalties_missed']),
                    safe_json_parse(row['penalties']),
                    safe_json_parse(row['red_cards']),
                    safe_json_parse(row['game_referees']),
                    row['stadium_city'], row['stadium_name'], row.get('stadium_name_media'), row.get('stadium_name_official'),
                    row.get('stadium_name_event'), row.get('stadium_name_sponsor'),
                    safe_json_parse(row.get('home_lineups')),
                    safe_json_parse(row.get('away_lineups')),
                    safe_json_parse(row.get('home_coaches')),
                    safe_json_parse(row.get('away_coaches')),
                    safe_json_parse(row.get('events'))
                ])
            except Exception as e:
                print("Error uploading row:", e)
                conn.rollback()

        conn.commit()

cur.close()
conn.close()
