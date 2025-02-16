import os
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import uvicorn
from main import main
from dotenv import load_dotenv
load_dotenv(dotenv_path="/Users/shivanshsoni/Desktop/posthuman/server/MuseTalk/.env")

luma_api_key = os.getenv("LUMAAI_API_KEY")
elabs_api_key = os.getenv("ELEVENLABS_API_KEY")

app = FastAPI()

class GenerateRequest(BaseModel):
    image_path: str
    text: str
    recipient_email: str

@app.get("/")
async def read_root():
    return {"message": "Welcome to MuseTalk API"}

@app.post("/generate")
async def generate_video(request: GenerateRequest):
    image_path = request.image_path
    text = request.text
    recipient_email = request.recipient_email
    image_prompt = ("Still shot of person's face showing an expression of love and care. Their body is not moving. Face very slightly.")
    result_dir = "./results"

    if not image_path or not text or not recipient_email:
        raise HTTPException(status_code=400, detail="Missing required parameters")

    # Assuming main function is imported from main.py
    try:
        result_path = main(image_path, None, text, image_prompt, luma_api_key, elabs_api_key, result_dir, recipient_email)
        return {"message": "Video generated successfully", "result_path": result_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

