from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId

class ReportBase(BaseModel):
    report_type: str = "General Health"

class ExtractedData(BaseModel):
    hemoglobin: Optional[float] = None
    blood_sugar_fasting: Optional[float] = None
    blood_sugar_pp: Optional[float] = None
    total_cholesterol: Optional[float] = None
    hdl: Optional[float] = None
    ldl: Optional[float] = None
    triglycerides: Optional[float] = None
    vitamin_d: Optional[float] = None
    vitamin_b12: Optional[float] = None
    tsh: Optional[float] = None
    # Flexible field for other parameters
    other_parameters: Optional[Dict[str, Any]] = None

class GeminiAnalysis(BaseModel):
    summary: str
    abnormal_parameters: List[str]
    dietary_suggestions: List[str]
    foods_to_include: List[str]
    foods_to_avoid: List[str]
    lifestyle_tips: List[str]
    doctor_consultation: bool

class ReportCreate(ReportBase):
    pass

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
