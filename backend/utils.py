import os
import uuid
import google.generativeai as genai
from config import GEMINI_API_KEY
from datetime import datetime

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_claim_gemini(text):
    prompt = f"""You are an expert insurance subrogation analyst.

Given the following insurance claim, determine:
- Is it recoverable? (Yes or No)
- Your confidence in percentage
- A one-sentence explanation

Claim Text:
{text}
"""
    try:
        res = model.generate_content(prompt)
        return parse_gemini_response(res.text)
    except Exception as e:
        return {
            "recoverable": False,
            "confidence": 0.0,
            "explanation": f"Error during analysis: {str(e)}"
        }

def generate_demand_letter_gemini(claim_text, claimant_name):
    today = datetime.today().strftime("%d/%m/%Y")
    prompt = f"""
You're a legal assistant. Draft a professional **Letter of Demand** for an insurance subrogation claim.

Include:
- Date: {today}
- Claimant: {claimant_name}
- Structure: Legal formal tone
- Insert the provided claim details dynamically
- Conclude with a strong demand for payment and legal action if not met

Claim Details:
{claim_text}
"""

    try:
        res = model.generate_content(prompt)
        letter_text = res.text.strip()

        # Save to file
        filename = f"demand_letter_{uuid.uuid4().hex}.txt"
        output_path = os.path.join("static/generated_letters", filename)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(letter_text)

        return output_path
    except Exception as e:
        print(f"[ERROR] Letter generation failed: {e}")
        return None

def ask_gemini(question):
    try:
        knowledge_base = ""
        if os.path.exists("knowledge_base.txt"):
            with open("knowledge_base.txt", "r", encoding="utf-8") as f:
                knowledge_base = f.read()

        prompt = f"""You are an insurance and subrogation assistant bot. Be clear and concise.

Knowledge base:
{knowledge_base}

User Question:
{question}
"""
        res = model.generate_content(prompt)
        return res.text.strip()
    except Exception as e:
        return f"Sorry, there was an error responding to your question: {e}"

def parse_gemini_response(text):
    try:
        lines = text.strip().split("\n")
        recoverable_line = lines[0].strip().lower()
        confidence_line = next((line for line in lines if "%" in line), "")
        explanation_line = next((line for line in lines if "explanation" in line.lower()), lines[-1])

        return {
            "recoverable": "yes" in recoverable_line,
            "confidence": float(confidence_line.split("%")[0].split()[-1]),
            "explanation": explanation_line.strip()
        }
    except Exception as e:
        return {
            "recoverable": False,
            "confidence": 50.0,
            "explanation": f"Could not parse response: {str(e)}"
        }
