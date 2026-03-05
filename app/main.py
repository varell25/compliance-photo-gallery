from fastapi import FastAPI
from app.api import properties

app = FastAPI(title="Compliance Photo Gallery")

app.include_router(properties.router, prefix="/properties", tags=["properties"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Compliance Photo Gallery API"}
