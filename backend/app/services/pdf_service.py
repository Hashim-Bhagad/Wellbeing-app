import fitz  # PyMuPDF
import re
import logging

logger = logging.getLogger(__name__)

async def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extracts text from PDF bytes using PyMuPDF.
    """
    try:
        doc = fitz.open(stream=file_content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return ""

# Removed parse_health_parameters as Gemini now handles extraction.
