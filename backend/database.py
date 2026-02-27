import sqlite3

class TitleDatabase:
    def __init__(self, db_path="titles.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Initialize the database if it doesn't exist."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS titles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT UNIQUE NOT NULL
            )
        ''')
        conn.commit()
        conn.close()

    def get_all_titles(self):
        """Fetch all titles from the database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT title FROM titles")
        titles = [row[0] for row in cursor.fetchall()]
        conn.close()
        return titles

    def add_title(self, title):
        """Add a new title to the database."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("INSERT INTO titles (title) VALUES (?)", (title,))
            conn.commit()
            conn.close()
            return True
        except sqlite3.IntegrityError:
            return False
