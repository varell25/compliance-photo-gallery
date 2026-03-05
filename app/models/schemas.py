from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

class ImagePair(BaseModel):
    pair_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    compliance_id: str
    original_url: str
    edited_url: str
    ai_confidence_score: float = Field(default=0.0, le=1.0, ge=0.0)

class Property(BaseModel):
    property_id: str
    address: str
    images: List[ImagePair] = []
