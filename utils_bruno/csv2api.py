from fastapi import FastAPI
import pandas as pd
import json
import uvicorn

app = FastAPI()

@app.get("/anomalies_csv")
def read_csv():
    df = pd.read_csv("anomalies.csv", sep=";")
    return df.to_dict(orient="records")

@app.get("/anomalies_json")
def read_issues():
    with open("issues.json", "r", encoding="utf-8") as f:
        return json.load(f)

uvicorn.run(app, host="localhost", port=3000)
