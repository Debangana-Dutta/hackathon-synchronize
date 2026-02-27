# Title Similarity & Compliance Validation System

A robust tool designed to verify the uniqueness and compliance of proposed newspaper titles against a database of 160,000+ existing records. The system uses advanced phonetic (Metaphone), semantic, and fuzzy string matching algorithms to ensure regulatory compliance.

## 🚀 Features

- **Uniqueness Check:** Compares proposed titles with existing records to prevent duplicates.
- **Phonetic Matching:** Uses Metaphone algorithms to detect titles that sound similar (e.g., "Namaskar" vs. "Namascar").
- **Fuzzy Similarity:** Employs RapidFuzz for high-performance string similarity scoring.
- **Compliance Rules:** Automatically rejects titles containing restricted words (e.g., "Police", "Crime", "Army").
- **Visual Analytics:** Real-time feedback with probability scores, risk levels, and detailed compliance reports.
- **Modern UI:** Responsive, clean interface with animated results and interactive tables.

## 🛠️ Tech Stack

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Matching Libraries:** 
  - `jellyfish` (Phonetic matching)
  - `rapidfuzz` (Fuzzy string similarity)
- **Database:** SQLite (for persistent title storage)

### Frontend
- **Languages:** HTML5, CSS3, JavaScript (ES6+)
- **Icons & Fonts:** Font Awesome, Google Fonts (Inter)
- **Design:** Modern, Card-based UI with CSS animations.

## 📁 Project Structure

```text
D:\synchronize
├── backend/
│   ├── main.py          # FastAPI application & business logic
│   ├── database.py      # Database connection & management
│   ├── titles.db        # SQLite database file
│   └── requirements.txt # Python dependencies
└── frontend/
    ├── index.html       # Main application interface
    ├── style.css        # Styling and animations
    └── script.js        # Frontend logic and UI updates
```

## ⚙️ Setup & Installation

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional) Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn jellyfish rapidfuzz
   ```
4. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup
1. Open the `frontend/index.html` file in your preferred web browser.
   - Alternatively, use a VS Code extension like "Live Server" for the best experience.

## 📝 Usage
1. Enter the proposed newspaper title in the input field.
2. Click **Verify Title**.
3. View the **Verification Probability** and **Detailed Compliance Check** results.
4. Review the **Top 5 Similar Titles** table to identify potential conflicts.

## 📋 Compliance Rules
The system enforces several rules for title acceptance:
- **Restricted Words:** Titles cannot contain words like "Police", "Crime", "Corruption", "CBI", "CID", or "Army".
- **Similarity Threshold:** Titles with a similarity probability below 50% (higher than 50% similarity to existing ones) are typically rejected.
- **Phonetic Conflict:** Titles sounding too similar to existing ones are flagged as "Risky" or "Rejected".

## 🛠️ Future Improvements
- [ ] Expand the SQLite database to include the full 160,000+ title dataset.
- [ ] Implement AI-powered semantic matching using NLP embeddings (e.g., Sentence-Transformers).
- [ ] Add an administrative dashboard for title management and audit logs.
- [ ] Enhance UI with more granular matching categories (e.g., prefix vs. suffix similarity).

---
© 2026 Government Media Authority. All Rights Reserved.
