import pdfplumber
import os

def extract_text_from_pdf(file_path):
    try:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        # Clean up text
        text = text.strip()
        
        if not text:
            return None, "This PDF appears to be a scanned image. Please upload a text-based PDF report."
            
        return text, None
    except Exception as e:
        return None, f"Error parsing PDF: {str(e)}"
    finally:
        # We might want to keep the file or delete it. 
        # For now, we leave deletion to the route handler if needed.
        pass
