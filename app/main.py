from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api import properties as api_properties
from app.routers import property as router_property

app = FastAPI(title="Compliance Photo Gallery")

# Include the older api endpoints
app.include_router(api_properties.router, prefix="/properties", tags=["properties-api"])
# Include the new router
app.include_router(router_property.router, prefix="/properties", tags=["property-upload"])

# Mount static files for the frontend
app.mount("/", StaticFiles(directory="static", html=True), name="static")

