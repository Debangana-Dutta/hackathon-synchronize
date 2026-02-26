import sqlite3

def init_db():
    conn = sqlite3.connect('titles.db')
    cursor = conn.cursor()
    # Create table for existing titles
    cursor.execute('CREATE TABLE IF NOT EXISTS registered_titles (title TEXT)')
    # Seed with some samples (Requirement: 160,000 titles in production)
    samples = [('The Hindu',), ('Times of India',), ('Indian Express',), ('Namaskar',)]
    cursor.executemany('INSERT INTO registered_titles VALUES (?)', samples)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()