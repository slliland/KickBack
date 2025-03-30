import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_NAME = os.getenv("DB_NAME", "euro_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "songyujian2002")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
FLAGS_DIR = os.getenv("FLAGS_DIR", "/Users/yujian/Downloads/archive/logos/logos")

def insert_bytea_flags():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()

    for filename in os.listdir(FLAGS_DIR):
        if filename.endswith(".png"):
            code = filename.split('.')[0]
            path = os.path.join(FLAGS_DIR, filename)
            try:
                with open(path, 'rb') as f:
                    binary_data = f.read()
                cur.execute(
                    "INSERT INTO team_flags (team_code, flag) VALUES (%s, %s) ON CONFLICT (team_code) DO NOTHING",
                    (code, psycopg2.Binary(binary_data))
                )
                print(f"Inserted {code}")
            except Exception as e:
                print(f"Failed for {code}: {e}")

    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    insert_bytea_flags()
