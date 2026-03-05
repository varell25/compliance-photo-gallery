from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api import properties

app = FastAPI(title="Compliance Photo Gallery")

app.include_router(properties.router, prefix="/properties", tags=["properties"])

# Mount static files for the frontend
app.mount("/", StaticFiles(directory="static", html=True), name="static")

