from pydantic import BaseModel
from datetime import datetime

class BMICreate(BaseModel):
    height_cm: float
    weight_kg: float

class BMIRecordInDB(BaseModel):
    user_id: str
    height_cm: float
    weight_kg: float
    bmi: float
    category: str
    created_at: datetime
