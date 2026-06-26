# AI-Driven Focus & Routine Workspace 🚀

An intelligent, full-stack productivity ecosystem designed to help students and developers optimize their daily routines. The application tracks task adherence, uses machine learning to identify personal productivity bottlenecks, and includes a beautiful, distraction-free glassmorphic focus timer.

## Tech Stack

- **Frontend:** HTML5, CSS3 (Advanced Masks & Pseudo-element Animations), JavaScript (ES6+, Fetch API, LocalStorage)
- **Backend:** Python 3, FastAPI, Uvicorn (Asynchronous Server)
- **Machine Learning & Data Science:** Scikit-Learn (K-Means Clustering), NumPy

---

## Key Features

- **Dynamic Timetable Scheduler:** A responsive interface to map out your daily slots, classes, and study blocks.
- **Local Telemetry System:** Uses browser `LocalStorage` to log task adherence metrics (`completed` vs. `skipped` slots) without requiring a heavy database setup.
- **ML-Powered Bottleneck Detection:** Integrates a **K-Means Clustering** pipeline to separate optimal habits from friction vectors, automatically isolating your lowest-efficiency routine blocks.
- **Contextual Recommendation Engine:** A backend rule system that analyzes task metadata (keywords like "nap" or late-night time windows) to serve human-like, actionable advice to prevent burnout.
- **Glassmorphic Focus Timer:** A standalone, high-performance workspace (`timer.html`) featuring a 50-minute study / 10-minute nap loop wrapped inside an animated, CSS-masked gradient border.

---

## Getting Started

1. Clone the Repository
```bash
git clone [https://github.com/Aqsa4066/ai-focus-workspace.git](https://github.com/Aqsa4066/ai-focus-workspace.git)
cd ai-focus-workspace
```
2. Set Up the Python Backend

python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn numpy scikit-learn

3. Run the API Server

python main.py

