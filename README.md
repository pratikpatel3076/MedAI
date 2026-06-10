# AI Medical Assistant Bot

A production-ready AI-powered medical triage and report analysis system. This application helps patients understand their symptoms and medical reports using Groq LLaMA 3.3 AI, while providing a secure portal for doctors to review consultations.

## Features

- **AI Symptom Triage**: Interactive chat interface with real-time LOW / MEDIUM / URGENT triage levels.
- **Report Analyzer**: Upload PDF medical reports for plain-language AI explanation with red flag detection.
- **Medicine Lookup**: Search any medicine for dosage, side effects, interactions, and warnings.
- **Emergency Detection**: Keyword-based filter runs synchronously before any LLM call — instant red flag detection bypassing AI for immediate safety.
- **Health Timeline**: View past consultations with triage levels and specialist recommendations over time.
- **Multi-language Support**: AI responses in English, Telugu (తెలుగు), and Hindi (हिंदी).
- **Voice Input**: Speak symptoms directly using the Web Speech API — language-aware.
- **Body Map**: Clickable SVG human figure to pre-fill the symptom input by body region.
- **Doctor Dashboard**: Secure JWT-protected portal for medical professionals to review all patient consultations and add clinical notes.
- **Dark Medical UI**: Modern, responsive design built with React and Tailwind CSS.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Python, Flask, PyMongo, JWT, bcrypt |
| **AI** | Groq API — llama-3.3-70b-versatile |
| **Frontend** | React.js, Vite, Tailwind CSS |
| **Database** | MongoDB Atlas |
| **Parsing** | pdfplumber |

## AI Model Approach

- **LLM:** Groq API using `llama-3.3-70b-versatile` — prompt engineering used throughout, no fine-tuning
- **Emergency Detection:** Synchronous keyword filter runs before any LLM call — life-threatening keywords trigger URGENT triage immediately
- **Symptom Triage:** Structured JSON prompt returns triage level, specialist recommendation, and empathetic response
- **Report Analysis:** PDF text extracted via pdfplumber, sent to LLM for plain-language explanation with red flag detection
- **Medicine Lookup:** LLM acts as a pharmacist assistant returning dosage, side effects, interactions, and warnings
- **Multi-language:** Language instruction injected into prompt — only the reply field changes language, all structured fields remain in English

## Setup Instructions

### Prerequisites
- Python 3.12
- Node.js 18+
- MongoDB Atlas account
- Groq API Key ([Get it here](https://console.groq.com))

### 1. Backend Setup
```bash
cd backend
py -3.12 -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GROQ_API_KEY and MONGODB_URI
python app.py
```

### 2. Create Initial Doctor Account
Run this curl command to register the first doctor:
```bash
curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d "{\"email\": \"doctor@hospital.com\", \"password\": \"securepassword123\", \"name\": \"Dr. Smith\"}"
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

## Safety & Disclaimer

This application is designed with a **Safety-First** approach:
1. **Mandatory Disclaimer**: All users must accept a medical disclaimer before using the app — modal cannot be dismissed without active consent.
2. **Synchronous Emergency Detection**: The system checks for critical keywords (e.g., "chest pain", "shortness of breath", "seizure") before sending data to the AI.
3. **Transparent Triage**: AI responses are tagged with LOW, MEDIUM, or URGENT badges with specialist recommendations.
4. **Professional Oversight**: All consultations are stored in MongoDB for doctor review via the protected dashboard.

> **Disclaimer**: This AI Medical Assistant is for educational and preliminary informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. In case of emergency, call 112 immediately.

## License
MIT License - for educational purposes.