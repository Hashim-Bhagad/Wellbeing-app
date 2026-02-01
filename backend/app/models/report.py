from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId

class ReportBase(BaseModel):
    report_type: str = "General Health"

class ExtractedData(BaseModel):
    # Dynamic field mapping for better validation and storage
    data: Dict[str, Any] = Field(default_factory=dict)

class GeminiAnalysis(BaseModel):
    summary: str
    health_score: int # Score out of 100
    abnormal_parameters: List[str]
    dietary_suggestions: List[str]
    foods_to_include: List[str]
    foods_to_avoid: List[str]
    lifestyle_tips: List[str]
    doctor_consultation: bool


class ReportInDB(ReportBase):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    extracted_data: Dict[str, Any] # Flexible dict to accommodate various report formats
    gemini_analysis: Optional[GeminiAnalysis] = None
    pdf_path: Optional[str] = None

    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str
        }

class ReportResponse(ReportInDB):
    id: str = Field(..., alias="_id")
