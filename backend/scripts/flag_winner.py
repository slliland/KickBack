import psycopg2

# Mapping of winner names to team codes
winner_to_code = {
    'Spain': 'ESP',
    'Italy': 'ITA',
    'West Germany': 'FRG',
    'Germany': 'GER',
    'France': 'FRA',
    'USSR': 'CIS',
    'Soviet Union': 'CIS',
    'Portugal': 'POR',
    'Netherlands': 'NED',
    'Czechoslovakia': 'TCH',
    'Yugoslavia': 'YUG',
    'Denmark': 'DEN',
    'Greece': 'GRE',
    'Czech Republic': 'CZE'
}

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname="euro_db",
    user="postgres",
    password="songyujian2002",
    host="localhost"
)
cur = conn.cursor()

# Add winner_code column if not exists
cur.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'euro_summary' AND column_name = 'winner_code'
        ) THEN
            ALTER TABLE euro_summary ADD COLUMN winner_code TEXT;
        END IF;
    END
    $$;
""")

# Update the winner_code based on mapping
for winner, code in winner_to_code.items():
    cur.execute("""
        UPDATE euro_summary
        SET winner_code = %s
        WHERE winner = %s;
    """, (code, winner))

conn.commit()
cur.close()
conn.close()

"✅ Mapping completed and `winner_code` column updated in euro_summary."
