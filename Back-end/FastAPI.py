from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "mental-health-bot"

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": request.message}
        ],
        "stream": False
    }

    response = requests.post(OLLAMA_URL, json=payload)
    result = response.json()

    return {"response": result["message"]["content"]}