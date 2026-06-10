from groq import Groq
import json
import re
from config import Config

client = Groq(api_key=Config.GROQ_API_KEY)

def clean_json_response(text):
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return text

class GeminiService:
    @staticmethod
    def analyze_symptoms(symptoms, chat_history=[], language="english"):
        history_text = ""
        if chat_history:
            for msg in chat_history:
                if isinstance(msg, dict):
                    role = msg.get('role', 'user')
                    content = msg.get('content', '')
                    history_text += f"{role}: {content}\n"
                else:
                    history_text += f"{msg}\n"

        language_instruction = "Respond in English."
        if language == "telugu":
            language_instruction = "You MUST respond in Telugu language (తెలుగు). The 'reply' field must be written entirely in Telugu script."
        elif language == "hindi":
            language_instruction = "You MUST respond in Hindi language (हिंदी). The 'reply' field must be written entirely in Hindi script."

        prompt = f"""
You are a cautious, responsible AI medical triage assistant.

A patient has described the following symptoms: {symptoms}

Previous conversation context: {history_text}

Response language instruction: {language_instruction}

Your task:
1. Respond empathetically and clearly in simple language
2. Assess triage level as exactly one of: LOW, MEDIUM, or URGENT
3. Suggest which specialist they should consult
4. If symptoms suggest emergency (chest pain, stroke, severe bleeding, difficulty breathing, unconsciousness), set is_emergency to true

Respond ONLY with this exact JSON:
{{
  "reply": "<your empathetic response in 3-4 sentences>",
  "triage_level": "<LOW or MEDIUM or URGENT>",
  "specialist": "<specialist type>",
  "is_emergency": <true or false>,
  "disclaimer": "This is AI-generated information only. Please consult a qualified doctor."
}}
Return only valid JSON. No text outside the JSON.
"""
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            json_text = clean_json_response(response.choices[0].message.content)
            return json.loads(json_text)
        except Exception as e:
            print(f"Groq API Error: {e}")
            return {
                "reply": "I apologize, but I am having trouble analyzing your symptoms right now. If you feel this is an emergency, please seek medical help immediately.",
                "triage_level": "URGENT",
                "specialist": "Emergency Physician",
                "is_emergency": True,
                "disclaimer": "Error in AI processing. Safety first: consult a doctor."
            }

    @staticmethod
    def lookup_medicine(medicine_name):
        prompt = f"""
You are a pharmacist assistant. A user wants to know about the medicine: {medicine_name}

Respond ONLY with this exact JSON:
{{
  "medicine_name": "<official name>",
  "used_for": "<what condition or symptom this medicine treats, in simple language>",
  "how_it_works": "<simple 1-2 sentence explanation of mechanism>",
  "common_dosage": "<typical adult dosage>",
  "side_effects": ["<side effect 1>", "<side effect 2>", "<side effect 3>"],
  "interactions": ["<drug or food it interacts with 1>", "<interaction 2>"],
  "warnings": "<who should not take this medicine>",
  "disclaimer": "This is AI-generated information only. Always consult a pharmacist or doctor before taking any medicine."
}}
Return only valid JSON. No text outside the JSON.
"""
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            json_text = clean_json_response(response.choices[0].message.content)
            return json.loads(json_text)
        except Exception as e:
            print(f"Groq API Error: {e}")
            return {
                "medicine_name": medicine_name,
                "used_for": "Unable to retrieve information",
                "how_it_works": "Service temporarily unavailable",
                "common_dosage": "Consult your doctor",
                "side_effects": ["Information unavailable"],
                "interactions": ["Information unavailable"],
                "warnings": "Always consult a doctor before taking any medicine",
                "disclaimer": "AI service error. Please consult a qualified pharmacist."
            }

    @staticmethod
    def analyze_report(report_text):
        prompt = f"""
You are a medical report explainer. A patient has uploaded a medical report.
Your job is to explain it in simple, non-technical language that a non-doctor can understand.

Report text:
{report_text}

Respond ONLY with this exact JSON:
{{
  "summary": "<2-3 sentence plain language summary of what this report shows>",
  "key_findings": ["<finding 1>", "<finding 2>", "<finding 3>"],
  "red_flags": ["<abnormal value or concern if any, empty array if all normal>"],
  "recommended_next_steps": "<what the patient should do next>",
  "specialist_recommended": "<which doctor to see based on this report>",
  "disclaimer": "This explanation is AI-generated for educational purposes only. Always consult your doctor for medical interpretation."
}}
Return only valid JSON. No text outside the JSON.
"""
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            json_text = clean_json_response(response.choices[0].message.content)
            return json.loads(json_text)
        except Exception as e:
            print(f"Groq API Error: {e}")
            return {
                "summary": "We encountered an error while analyzing your report.",
                "key_findings": ["Analysis failed"],
                "red_flags": ["System Error"],
                "recommended_next_steps": "Please consult a doctor with your original report.",
                "specialist_recommended": "General Practitioner",
                "disclaimer": "AI Analysis failed. Do not rely on this output."
            }