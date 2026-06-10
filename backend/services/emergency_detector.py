def detect_emergency(text):
    if not text:
        return False
        
    emergency_keywords = [
        "chest pain", "heart attack", "can't breathe", "cannot breathe",
        "stroke", "unconscious", "not breathing", "severe bleeding", 
        "poisoning", "overdose", "suicidal", "seizure", "choking", 
        "anaphylaxis", "allergic reaction", "difficulty breathing",
        "shortness of breath", "heavy bleeding"
    ]
    
    text_lower = text.lower()
    for keyword in emergency_keywords:
        if keyword in text_lower:
            return True
            
    return False
