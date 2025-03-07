import os
import pdfplumber
import requests
import json
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

# Define Mistral API URL
MISTRAL_LOCAL_URL = "http://localhost:11434/v1/chat/completions"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change this if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Ensure an uploads directory exists
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file using pdfplumber."""
    with pdfplumber.open(pdf_path) as pdf:
        text = "\n".join([page.extract_text() or "" for page in pdf.pages])
    return text

def classify_financial_data(extracted_text):
    """Send extracted PDF text to Mistral for financial analysis with enforced JSON output."""
    prompt = f"""
    Extract and classify financial data from the following text.

    TEXT:
    {extracted_text}

    Provide the response accurately and strictly in JSON format with the following structure:
    {{
      "accounts": [
        {{
          "type": "Stocks" | "Bank Account" | "Crypto" | "Bonds" | "Real Estate" | "Cash",
          "company_name": "Fidelity" | "Charles Schwab" | "Coinbase" | "Vanguard" | "Other",
          "balance": 12345.67
        }}
      ],
      "total_assets": 123456.78
    }}

    Do NOT include any explanations, extra text, or formatting outside this JSON.
    """

    payload = {
        "model": "mistral",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2
    }

    response = requests.post(MISTRAL_LOCAL_URL, json=payload)

    try:
        # Ensure proper JSON parsing
        response_data = response.json()
        structured_data = response_data["choices"][0]["message"]["content"]
        return json.loads(structured_data)  # Convert from string to JSON
    except (KeyError, json.JSONDecodeError):
        return {"error": "Invalid response from Mistral"}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Handles PDF uploads, extracts text, and processes via Mistral."""
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        # Save the uploaded PDF
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(file_path)
        if not extracted_text.strip():
            return JSONResponse(content={"error": "No text found in PDF"}, status_code=400)

        # Process extracted text with Mistral
        financial_data = classify_financial_data(extracted_text)

        return JSONResponse(content=financial_data, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
