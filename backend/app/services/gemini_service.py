import google.generativeai as genai
import json
from app.core.config import get_settings
from app.models.report import GeminiAnalysis

settings = get_settings()

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

async def analyze_health_report(extracted_text: str, extracted_data: dict) -> GeminiAnalysis:
    """
    Analyzes health report text using Gemini API and returns a structured JSON response.
    """
    
    prompt = f"""
    You are a health advisor analyzing a patient's lab report.
    
    Extracted Data:
    {json.dumps(extracted_data, indent=2)}
    
    Full Report Text (Context):
    {extracted_text[:5000]}  # Truncate to avoid token limits if necessary, though 1.5 has large context
    
    Normal Ranges (Indian standards):
    - Hemoglobin: 13-17 g/dL (men), 12-15 g/dL (women)
    - Blood Sugar (Fasting): 70-100 mg/dL
    - Total Cholesterol: < 200 mg/dL
    - Vitamin D: 30-100 ng/mL
    
    Tasks:
    1. Identify parameters outside normal range
    2. Assess overall health status
    3. Provide dietary recommendations using common Indian foods
    4. Suggest lifestyle modifications
    5. Indicate if doctor consultation is recommended
    
    Respond in STRICT JSON format matching this schema:
    {{
        "summary": "brief overview",
        "abnormal_parameters": ["param1", "param2"],
        "dietary_suggestions": ["suggestion1", "suggestion2"],
        "foods_to_include": ["food1", "food2"],
        "foods_to_avoid": ["food1", "food2"],
        "lifestyle_tips": ["tip1", "tip2"],
        "doctor_consultation": true/false
    }}
    
    Do not include markdown formatting (like ```json), just the raw JSON string.
    """
    
    try:
        response = model.generate_content(prompt)
        response_text = response.text
        
        # Clean up if markdown code blocks are present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        data = json.loads(response_text)
        return GeminiAnalysis(**data)
    except Exception as e:
        print(f"Gemini Analysis Error: {e}")
        # Return a fallback/empty analysis in case of failure to avoid crashing
        return GeminiAnalysis(
            summary="Could not analyze report due to an error.",
            abnormal_parameters=[],
            dietary_suggestions=[],
            foods_to_include=[],
            foods_to_avoid=[],
            lifestyle_tips=[],
            doctor_consultation=False
        )
