from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import jellyfish  # For Soundex/Metaphone
from rapidfuzz import fuzz
import sqlite3
from database import TitleDatabase

app = FastAPI()
db = TitleDatabase()

# MUST HAVE: This allows your HTML file to talk to this Python script
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DISALLOWED = ["Police", "Crime", "Corruption", "CBI", "CID", "Army"]

@app.get("/verify")
def verify(title: str):
    # Rule 1: Disallowed Words
    if any(word.lower() in title.lower() for word in DISALLOWED):
        return {"status": "Rejected", "prob": 0, "reason": "Restricted word detected."}

    # Rule 2: Database Check (Mocking the 160k titles)
    # Using a small list for your demo
    db_titles = db.get_all_titles()
    
    # If the database is empty, use some defaults for demo purposes
    existing_titles = db_titles if db_titles else ["The Hindu", "Times of India", "Indian Express", "Namaskar"]
    
    max_sim = 0
    match_found = ""

    for ex in existing_titles:
        # Phonetic Check (Namaskar vs Namascar)
        if jellyfish.metaphone(title) == jellyfish.metaphone(ex):
            max_sim = max(max_sim, 90)
            match_found = ex
        
        # Fuzzy Check
        sim = fuzz.ratio(title.lower(), ex.lower())
        if sim > max_sim:
            max_sim = sim
            match_found = ex

    # Rule 3: Probability = 100 - Similarity
    probability = 100 - max_sim
    status = "Accepted" if probability >= 50 else "Rejected"
    
    return {
        "status": status,
        "probability": max(0, probability),
        "similarity": max_sim,
        "reason": f"Too similar to '{match_found}'" if status == "Rejected" else "Title is unique!"
    }