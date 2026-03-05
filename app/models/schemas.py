from pydantic import BaseModel
from typing import List, Optional

class ImagePair(BaseModel):
    compliance_id: str
    original_url: str
    edited_url: str

class Property(BaseModel):
    property_id: str
    address: str
    images: List[ImagePair] = []
