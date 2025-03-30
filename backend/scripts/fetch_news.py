import os
import requests
import psycopg2
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")
# Read secrets from environment
key = os.getenv("GOOGLE_API_KEY")
cx = os.getenv("GOOGLE_CSE_ID")

# PostgreSQL connection
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)
cur = conn.cursor()

def fetch_news_from_google_api():
    query = "Euro Cup 2028"
    url = f"https://www.googleapis.com/customsearch/v1?key={key}&cx={cx}&q={query}"

    res = requests.get(url)
    data = res.json()

    for item in data.get("items", [])[:5]:
        title = item.get("title")
        link = item.get("link")

        cur.execute("""
            INSERT INTO euro_news (title, link, fetched_at)
            VALUES (%s, %s, %s)
            ON CONFLICT (link) DO NOTHING;
        """, (title, link, datetime.utcnow()))

    conn.commit()
    print("News inserted.")

fetch_news_from_google_api()
cur.close()
conn.close()
