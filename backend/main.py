from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CSV
df = pd.read_csv("recipes.csv")

@app.get("/search")
def search_recipe(q: str = Query(...)):
    try:
        filtered = df[df["Recipe"].str.contains(q, case=False, na=False)]
        # Convert NaNs to empty strings so JSON can handle it
        clean_results = filtered.fillna("").to_dict(orient="records")
        return clean_results
    except Exception as e:
        print("Search error:", e)
        return {"error": str(e)}

