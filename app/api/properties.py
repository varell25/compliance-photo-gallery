from fastapi import APIRouter, HTTPException
from typing import List, Dict
from app.models.schemas import Property, ImagePair

router = APIRouter()

# In-memory storage for demonstration purposes
properties_db: Dict[str, Property] = {}

@router.post("/", response_model=Property, status_code=201)
def create_property(property_in: Property):
    if property_in.property_id in properties_db:
        raise HTTPException(status_code=400, detail="Property already exists")
    properties_db[property_in.property_id] = property_in
    return property_in

@router.get("/", response_model=List[Property])
def list_properties():
    return list(properties_db.values())

@router.get("/{property_id}", response_model=Property)
def get_property(property_id: str):
    if property_id not in properties_db:
        raise HTTPException(status_code=404, detail="Property not found")
    return properties_db[property_id]

@router.post("/{property_id}/images", response_model=Property)
def add_image_to_property(property_id: str, image: ImagePair):
    if property_id not in properties_db:
        raise HTTPException(status_code=404, detail="Property not found")
    
    prop = properties_db[property_id]
    prop.images.append(image)
    return prop
