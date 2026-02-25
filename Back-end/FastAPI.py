from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

# ✅ Enable CORS (VERY IMPORTANT for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "mental_health_chatbot"

class ChatRequest(BaseModel):
    message: str
    mode: str

chat_histories = {
    "general": [],
    "rant": [],
    "selfcare": [],
    "breathing": [],
    "music": []
}

@app.post("/chat")
def chat(request: ChatRequest):

    mode = request.mode

    if mode not in chat_histories:
        chat_histories[mode] = []

    chat_histories[mode].append({
        "role": "user",
        "content": request.message
    })

    payload = {
        "model": MODEL_NAME,
        "messages": chat_histories[mode],
        "stream": False
    }

    response = requests.post(OLLAMA_URL, json=payload)
    result = response.json()

    assistant_reply = result["message"]["content"]

    chat_histories[mode].append({
        "role": "assistant",
        "content": assistant_reply
    })

    return {"response": assistant_reply}