from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from flask import render_template
from utils import analyze_claim_gemini, generate_demand_letter_gemini, ask_gemini

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "static/generated_letters"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    content = file.read().decode("utf-8", errors="ignore")
    return jsonify({"content": content})

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    content = data.get("content", "")
    if not content.strip():
        return jsonify({"recoverable": False, "confidence": 0, "explanation": "No content to analyze."})
    result = analyze_claim_gemini(content)
    return jsonify(result)

@app.route("/generate_letter", methods=["POST"])
def generate_letter():
    data = request.get_json()
    claim_text = data.get("claim", "")
    claimant_name = data.get("claimant_name", "John Doe")
    
    if not claim_text.strip():
        return jsonify({"error": "Empty claim text"}), 400

    output_path = generate_demand_letter_gemini(claim_text, claimant_name)
    
    # Ensure file was created
    if not os.path.exists(output_path):
        return jsonify({"error": "Letter generation failed."}), 500

    with open(output_path, "r", encoding="utf-8") as f:
        content = f.read()

    return jsonify({
        "download_url": f"/download_letter/{os.path.basename(output_path)}",
        "content": content,
        "filename": os.path.basename(output_path)
    })

@app.route("/download_letter/<filename>")
def download_letter(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404
    return send_file(filepath, as_attachment=True)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    question = data.get("question", "")
    if not question.strip():
        return jsonify({"answer": "Please ask a valid question."})
    response = ask_gemini(question)
    return jsonify({"answer": response})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
