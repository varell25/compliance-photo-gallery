from fastapi import APIRouter, HTTPException, Body
from typing import Dict
from app.models.schemas import Property, ImagePair
from uuid import uuid4

router = APIRouter()

# Keep a reference to the in-memory properties DB
# In a real app this would be a database session
from app.api.properties import properties_db

@router.post("/{property_id}/upload-pair")
def upload_property_image_pair(property_id: str, image_pair: ImagePair = Body(...)):
    """
    Validates the input using the ImagePair schema and returns a compliance_id.
    """
    if property_id not in properties_db:
        # If property doesn't exist, we can create a default one to make testing easier
        # Or return a 404. Sticking to 404 for stricter compliance.
        raise HTTPException(status_code=404, detail="Property not found")
        
    prop = properties_db[property_id]
    
    # We can generate a new compliance_id if one wasn't provided, 
    # but the schema requires one. We will just use the one from the payload,
    # or override it if your requirements strictly mean "generate one and return it".
    # Assuming we return the compliance_id of the successfully validated/added pair.
    
    prop.images.append(image_pair)
    
    return {
        "message": "Image pair uploaded successfully",
        "compliance_id": image_pair.compliance_id,
        "property_id": property_id,
        "pair_id": image_pair.pair_id
    }
