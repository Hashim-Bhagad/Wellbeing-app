from app.core.database import get_database
from fastapi import APIRouter, Depends
from datetime import datetime

from app.models.bmi import BMICreate, BMIRecord
from app.routes.auth import get_current_user


router = APIRouter(tags=["BMI"])
@router.get("/latest")
async def get_latest_bmi(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    bmi_record = await db.bmi_records.find_one(
        {"user_id": str(current_user["_id"])},
        sort=[("created_at", -1)]
    )
    if not bmi_record:
        return None
    
    # Calculate recommended range for response if needed by frontend
    height_m = bmi_record["height_cm"] / 100
    min_w = round(18.5 * (height_m ** 2), 1)
    max_w = round(24.9 * (height_m ** 2), 1)
    
    return {
        "bmi": bmi_record["bmi"],
        "category": bmi_record["category"],
        "height_cm": bmi_record["height_cm"],
        "weight_kg": bmi_record["weight_kg"],
        "recommended_range": f"{min_w} - {max_w} kg",
        "created_at": bmi_record["created_at"]
    }



@router.post("/calculate")
async def calculate_bmi(
    data: BMICreate,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    height_m = data.height_cm / 100
    bmi = round(data.weight_kg / (height_m ** 2), 1)

    if bmi < 18.5:
        category = "Underweight"
        tip = "Consider a nutrient-rich diet."
    elif bmi < 25:
        category = "Normal weight"
        tip = "Great job! Keep maintaining your healthy lifestyle."
    elif bmi < 30:
        category = "Overweight"
        tip = "Regular exercise can help improve your health."
    else:
        category = "Obese"
        tip = "Consult a healthcare professional for guidance."

    min_w = round(18.5 * (height_m ** 2), 1)
    max_w = round(24.9 * (height_m ** 2), 1)

    bmi_doc = BMIRecord(
        user_id=str(current_user["_id"]),
        height_cm=data.height_cm,
        weight_kg=data.weight_kg,
        bmi=bmi,
        category=category,
        created_at=datetime.utcnow()
    )

    await db.bmi_records.insert_one(bmi_doc.dict())

    return {
        "bmi": bmi,
        "category": category,
        "recommended_range": f"{min_w} - {max_w} kg",
        "health_tip": tip
    }
