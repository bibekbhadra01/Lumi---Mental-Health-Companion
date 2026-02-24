from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "mental-health-bot"

class ChatRequest(BaseModel):
    message: str

chat_history = []

@app.post("/chat")
def chat(request: ChatRequest):

    chat_history.append({
        "role": "user",
        "content": request.message
    })

    payload = {
        "model": MODEL_NAME,
        "messages": chat_history,
        "stream": False
    }

    response = requests.post(OLLAMA_URL, json=payload)
    result = response.json()

    assistant_reply = result["message"]["content"]

    chat_history.append({
        "role": "assistant",
        "content": assistant_reply
    })

    return {"response": assistant_reply}